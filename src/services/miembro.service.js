const model = require('../models/miembro.models');
const notModel = require('../models/notificaciones.models');
const db = require('../config/db');
const socketService = require('./socket.service');

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
    // Crear miembro
    const newMember = await model.create(miembro);

    try {
        // Obtener admins activos
        const adminsRes = await db.query(
            'SELECT id_usuario FROM usuario WHERE rol = $1 AND estado = TRUE',
            ['admin']
        );
        const admins = adminsRes.rows || [];

        const tipo = 'nuevo_miembro';
        const contenido = `🆕 NUEVO MIEMBRO: ${newMember.nombre || newMember.correo || newMember.cedula} (ID: ${newMember.id_miembro})`;
        const fecha_envio = new Date();

        const insertedNotifs = [];

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
            insertedNotifs.push(created);

            // Emitir al admin específico
            if (socketService && socketService.emitToUser) {
                socketService.emitToUser(a.id_usuario, 'nueva-notificacion', created);
            }
        }

        // Emitir resumen al room de admins
        if (admins.length > 0 && socketService && socketService.emitToRole) {
            socketService.emitToRole('admin', 'nueva-notificacion-bulk', { tipo, contenido, count: admins.length });
        }
    } catch (err) {
        console.error('Error al crear notificaciones para admins:', err);
        // no detengas la creación del miembro por fallos en notificaciones
    }

    return newMember;
};

exports.updateMiembro = async (id, miembro) => {
    return await model.update(Number(id), miembro);
};

exports.deleteMiembro = async (id) => {
    return await model.remove(Number(id));
};
