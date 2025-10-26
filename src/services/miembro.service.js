const model = require('../models/miembro.models');
const notModel = require('../models/notificaciones.models');
const db = require('../config/db');
const socketService = require('./socket.service');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

exports.getAllMiembros = async () => {
    return await model.findALL();
};

exports.getMiembroById = async (id) => {
    const miembro = await model.find(Number(id));
    if (!miembro) {
        throw new Error(`Miembro con id ${id} no encontrado`);
    }
    return miembro;
};

exports.getMiembroByCedula = async (cedula) => {
  const miembro = await model.findByCedula(cedula);
  if (!miembro) {
    const err = new Error('Miembro no encontrado');
    err.status = 404;
    throw err;
  }
  return miembro;
};

// Al crear un miembro, además crear notificaciones para administradores y emitir por socket
exports.createMiembro = async (miembro) => {
    const client = await db.connect();
    try {
        await client.query('BEGIN');

        // Insert miembro (similar a model.create pero usando el client de la transacción)
        const {
            cedula, nombre, apellido1, apellido2, edad, direccion,
            altura, peso, contextura, objetivo, sexo, correo
        } = miembro;

    // Set estado = FALSE so DB trigger `trigger_nuevo_miembro_registrado` runs
    const insertMiembroSQL = `INSERT INTO miembro (cedula, nombre, apellido1, apellido2, edad, direccion, altura, peso, contextura, objetivo, sexo, correo, estado)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
     RETURNING id_miembro, nombre, apellido1, correo, cedula`;

    const r1 = await client.query(insertMiembroSQL, [cedula, nombre, apellido1, apellido2, edad, direccion, altura, peso, contextura, objetivo, sexo, correo, false]);
        const newMember = r1.rows[0];
        const idMiembro = newMember.id_miembro;

        // Commit the insert of miembro first. The DB trigger may create the usuario row
        // either during or after the transaction; to be robust we commit and then query
        // the pool to find the usuario row.
        await client.query('COMMIT');

        // After commit, fetch the usuario row using the pool (outside the transaction).
        // Try by id_miembro first; if trigger didn't set id_miembro on usuario, try by correo (usuario column).
        let newUser = null;
        try {
            const rUserById = await db.query(
                `SELECT id_usuario, usuario, contrasenia, rol, id_miembro, estado, fecha_registro
                 FROM usuario WHERE id_miembro = $1 ORDER BY fecha_registro DESC LIMIT 1`,
                [idMiembro]
            );
            console.log('[members-service] SELECT usuario by id_miembro rowCount:', rUserById.rowCount);
            if (rUserById.rowCount > 0) newUser = rUserById.rows[0];

            if (!newUser) {
                // fallback: find by email (usuario column) in case trigger didn't set id_miembro
                const rUserByEmail = await db.query(
                    `SELECT id_usuario, usuario, contrasenia, rol, id_miembro, estado, fecha_registro
                     FROM usuario WHERE usuario = $1 ORDER BY fecha_registro DESC LIMIT 1`,
                    [correo]
                );
                console.log('[members-service] SELECT usuario by email rowCount:', rUserByEmail.rowCount);
                if (rUserByEmail.rowCount > 0) newUser = rUserByEmail.rows[0];
            }
        } catch (selErr) {
            console.error('[members-service] error selecting usuario after commit:', selErr);
        }

        // If no usuario row was created by trigger, retry a few times waiting for the trigger to finish.
        // We avoid creating the usuario here because the DB has a trigger `trigger_nuevo_miembro_registrado`
        // that should create the usuario. Instead we poll briefly for visibility.
        if (!newUser) {
            const maxAttempts = 5;
            const delayMs = 200;
            let attempts = 0;
            while (!newUser && attempts < maxAttempts) {
                attempts++;
                await new Promise((res) => setTimeout(res, delayMs));
                try {
                    const rUserByIdRetry = await db.query(
                        `SELECT id_usuario, usuario, contrasenia, rol, id_miembro, estado, fecha_registro
                         FROM usuario WHERE id_miembro = $1 ORDER BY fecha_registro DESC LIMIT 1`,
                        [idMiembro]
                    );
                    console.log('[members-service] retry select by id_miembro attempt', attempts, 'rowCount:', rUserByIdRetry.rowCount);
                    if (rUserByIdRetry.rowCount > 0) { newUser = rUserByIdRetry.rows[0]; break; }

                    const rUserByEmailRetry = await db.query(
                        `SELECT id_usuario, usuario, contrasenia, rol, id_miembro, estado, fecha_registro
                         FROM usuario WHERE usuario = $1 ORDER BY fecha_registro DESC LIMIT 1`,
                        [correo]
                    );
                    console.log('[members-service] retry select by email attempt', attempts, 'rowCount:', rUserByEmailRetry.rowCount);
                    if (rUserByEmailRetry.rowCount > 0) { newUser = rUserByEmailRetry.rows[0]; break; }
                } catch (retryErr) {
                    console.error('[members-service] error during retry select usuario:', retryErr);
                }
            }
            if (!newUser) {
                console.log('[members-service] usuario row still not found after retries for miembro', idMiembro);
                // As the trigger may not run under the conditions expected (e.g. NEW.estado != FALSE),
                // create the usuario here to guarantee the user exists. If the trigger later inserts
                // the same usuario this INSERT will fail due to unique constraint; we handle that.
                try {
                    const genPassword = crypto.randomBytes(6).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 10);
                    const insertRes = await db.query(
                        `INSERT INTO usuario (usuario, contrasenia, rol, id_miembro, estado, fecha_registro)
                         VALUES ($1, $2, $3, $4, TRUE, NOW()) RETURNING id_usuario, usuario, contrasenia, rol, id_miembro, estado, fecha_registro`,
                        [correo, genPassword, 'miembro', idMiembro]
                    );
                    console.log('[members-service] INSERT usuario rowCount:', insertRes.rowCount);
                    if (insertRes.rowCount > 0) {
                        newUser = insertRes.rows[0];
                        returnedPassword = genPassword;
                    }
                } catch (insErr) {
                    // If a concurrent process (e.g. trigger) created the usuario exactly now,
                    // the INSERT may fail with unique violation. Try selecting again.
                    console.error('[members-service] error inserting usuario row (will try select):', insErr.code || insErr.message);
                    try {
                        const rUserFinal = await db.query(
                            `SELECT id_usuario, usuario, contrasenia, rol, id_miembro, estado, fecha_registro
                             FROM usuario WHERE id_miembro = $1 OR usuario = $2 ORDER BY fecha_registro DESC LIMIT 1`,
                            [idMiembro, correo]
                        );
                        if (rUserFinal.rowCount > 0) newUser = rUserFinal.rows[0];
                    } catch (selFinalErr) {
                        console.error('[members-service] final select after insert error:', selFinalErr);
                    }
                }
            }
        }

        // Determine what to return as plain password (if any).
        // Simpler policy: do NOT hash or otherwise modify existing passwords except to set a default
        // when none exists. This keeps passwords in DB in plain text as requested.
        let returnedPassword = null;
        if (newUser) {
            const stored = newUser.contrasenia ? newUser.contrasenia.toString().trim() : '';
            if (!stored) {
                // If no password exists, set a default password (you can change this value)
                const defaultPassword = '123456';
                try {
                    await db.query(`UPDATE usuario SET contrasenia = $1 WHERE id_usuario = $2`, [defaultPassword, newUser.id_usuario]);
                    newUser.contrasenia = defaultPassword;
                    returnedPassword = defaultPassword;
                } catch (errUpdate) {
                    console.error('[members-service] error setting default password for usuario', newUser.id_usuario, errUpdate);
                }
            } else {
                // Keep whatever password exists in DB (do not hash or change it)
                newUser.contrasenia = stored;
                returnedPassword = stored;
                console.log('[members-service] contraseña mantenida en texto plano.');
            }
        }

        // Log de creación
        console.log('[members-service] created member id:', idMiembro, 'user row from trigger:', newUser, 'returnedPasswordPresent:', !!returnedPassword);

        // Crear notificaciones para admins (después del commit)
        try {
            const adminsRes = await db.query('SELECT id_usuario FROM usuario WHERE rol = $1 AND estado = TRUE', ['admin']);
            const admins = adminsRes.rows || [];
            const tipo = 'nuevo_miembro';
            const contenido = `🆕 NUEVO MIEMBRO: ${newMember.nombre || newMember.correo || newMember.cedula} (ID: ${idMiembro})`;
            const fecha_envio = new Date();

            for (const a of admins) {
                const notif = {
                    id_usuario: a.id_usuario,
                    id_usuario_remitente: null,
                    tipo,
                    contenido,
                    fecha_envio,
                    leido: false,
                    estado: true,
                };
                const created = await notModel.create(notif);
                if (socketService && socketService.emitToUser) socketService.emitToUser(a.id_usuario, 'nueva-notificacion', created);
            }
            if (admins.length > 0 && socketService && socketService.emitToRole) {
                socketService.emitToRole('admin', 'nueva-notificacion-bulk', { tipo, contenido, count: admins.length });
            }
        } catch (err) {
            console.error('Error al crear notificaciones para admins:', err);
        }

        // Devolver objeto con credenciales (contraseña en texto solo la primera vez si pudimos obtenerla)
        return {
            id_miembro: idMiembro,
            nombre: `${newMember.nombre} ${newMember.apellido1 || ''}`.trim(),
            usuario: newUser ? newUser.usuario : (correo || `m${idMiembro}`),
            contrasenia: returnedPassword || '',
            passwordReturned: !!returnedPassword
        };
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error crear miembro+usuario:', err);
        throw err;
    } finally {
        client.release();
    }
};

exports.updateMiembro = async (id, miembro) => {
    return await model.update(Number(id), miembro);
};

exports.deleteMiembro = async (id) => {
    return await model.remove(Number(id));
};
