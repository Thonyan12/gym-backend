const bcrypt = require('bcryptjs');
const db = require('../config/db');

// Registro de miembro con asignación automática de entrenador
// Registro de miembro con asignación automática de entrenador
exports.registroMiembroConAsignacion = async (req, res) => {
    const client = await db.connect();
    
    try {
        await client.query('BEGIN');
        
        const { nombre, apellido1, apellido2, email, telefono, password } = req.body;
        
        // 1. Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // 2. Crear el miembro
        const resultMiembro = await client.query(`
            INSERT INTO Miembro (nombre, apellido1, apellido2, correo, telefono, contrasenia, f_registro, estado) 
            VALUES ($1, $2, $3, $4, $5, $6, NOW(), TRUE) RETURNING id_miembro
        `, [nombre, apellido1, apellido2, email, telefono, hashedPassword]);
        
        const idMiembro = resultMiembro.rows[0].id_miembro;
        
        // 3. Seleccionar un entrenador automáticamente (CORREGIDA)
        const entrenadores = await client.query(`
            SELECT e.id_entrenador, e.nombre, e.apellido, COUNT(ae.id_miembro) as total_miembros
            FROM Entrenador e
            LEFT JOIN Asignacion_entrenador ae ON e.id_entrenador = ae.id_entrenador AND ae.estado = TRUE
            WHERE e.estado = TRUE
            GROUP BY e.id_entrenador, e.nombre, e.apellido
            ORDER BY total_miembros ASC
            LIMIT 1
        `);
        
        if (entrenadores.rows.length > 0) {
            const entrenadorAsignado = entrenadores.rows[0];
            
            // 4. Crear asignación de entrenador
            await client.query(`
                INSERT INTO Asignacion_entrenador (id_entrenador, id_miembro, f_asignacion, estado) 
                VALUES ($1, $2, NOW(), TRUE)
            `, [entrenadorAsignado.id_entrenador, idMiembro]);
            
            // 5. Crear notificaciones
            await client.query(`
                INSERT INTO Notificacion_miembro (id_miembro, tipo, titulo, contenido, f_envio, leido) 
                VALUES ($1, 'asignacion_entrenador', 'Bienvenido - Entrenador Asignado', $2, NOW(), FALSE)
            `, [
                idMiembro, 
                `¡Bienvenido al gimnasio! Se te ha asignado el entrenador ${entrenadorAsignado.nombre} ${entrenadorAsignado.apellido}.`
            ]);
            
            await client.query('COMMIT');
            
            res.status(201).json({
                success: true,
                message: 'Registro exitoso',
                data: {
                    miembro: { id: idMiembro, nombre, email },
                    entrenador_asignado: `${entrenadorAsignado.nombre} ${entrenadorAsignado.apellido}`
                }
            });
            
        } else {
            throw new Error('No hay entrenadores disponibles');
        }
        
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error en registro:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el registro',
            error: error.message
        });
    } finally {
        client.release();
    }
};

// Generar notificación del entrenador asignado
exports.generarNotificacionEntrenador = async (req, res) => {
    const client = await db.connect();
    
    try {
        console.log('🎯 Iniciando generarNotificacionEntrenador');
        console.log('📋 Usuario autenticado:', req.user);
        
        const id_miembro = req.user.id_miembro;
        
        if (!id_miembro) {
            console.log('❌ ID de miembro no encontrado en el token');
            return res.status(403).json({ 
                success: false, 
                message: "ID de miembro no encontrado en el token" 
            });
        }
        
        console.log('🔍 Buscando entrenador para miembro:', id_miembro);
        
        // 1. Consultar qué entrenador tiene asignado el miembro (CORREGIDA)
        const asignacion = await client.query(`
            SELECT 
                e.nombre as entrenador_nombre,
                e.apellido as entrenador_apellido,
                e.especialidad,
                e.telefono as entrenador_telefono,
                ae.fecha as fecha_asignacion
            FROM Asignacion_entrenador ae
            INNER JOIN Entrenador e ON ae.id_entrenador = e.id_entrenador
            WHERE ae.id_miembro = $1 AND ae.estado = TRUE
            ORDER BY ae.fecha DESC
            LIMIT 1
        `, [id_miembro]);

        console.log('📊 Resultado consulta entrenador:', asignacion.rows);

        if (asignacion.rows.length === 0) {
            console.log('❌ No se encontró entrenador asignado');
            return res.status(404).json({
                success: false,
                message: 'No tienes un entrenador asignado'
            });
        }

        const entrenador = asignacion.rows[0];
        console.log('👨‍🏫 Entrenador encontrado:', entrenador);
        
        // 2. Verificar si ya existe una notificación de este tipo
        const notificacionExistente = await client.query(`
            SELECT id_notificacion 
            FROM Notificacion_miembro 
            WHERE id_miembro = $1 AND tipo = 'entrenador_asignado'
        `, [id_miembro]);

        console.log('📋 Notificación existente:', notificacionExistente.rows);

        if (notificacionExistente.rows.length > 0) {
            console.log('ℹ️ Ya existe notificación del entrenador');
            return res.status(200).json({
                success: true,
                message: 'Ya tienes una notificación del entrenador asignado',
                data: {
                    entrenador: `${entrenador.entrenador_nombre} ${entrenador.entrenador_apellido}`,
                    especialidad: entrenador.especialidad
                }
            });
        }

        // 3. Crear notificación con información del entrenador
        const contenidoNotificacion = `¡Hola! Tu entrenador asignado es ${entrenador.entrenador_nombre} ${entrenador.entrenador_apellido}. Especialidad: ${entrenador.especialidad || 'Entrenamiento general'}. Contacto: ${entrenador.entrenador_telefono || 'Consultar en recepción'}. ¡Estamos aquí para ayudarte a alcanzar tus objetivos!`;
        
        console.log('📝 Creando notificación:', contenidoNotificacion);
        
        const insertResult = await client.query(`
            INSERT INTO Notificacion_miembro (id_miembro, tipo, titulo, contenido, f_envio, leido) 
            VALUES ($1, 'entrenador_asignado', 'Tu Entrenador Asignado', $2, NOW(), FALSE) RETURNING id_notificacion
        `, [id_miembro, contenidoNotificacion]);

        console.log('✅ Notificación creada con ID:', insertResult.rows[0].id_notificacion);

        res.status(201).json({
            success: true,
            message: 'Notificación de entrenador generada correctamente',
            data: {
                entrenador: `${entrenador.entrenador_nombre} ${entrenador.entrenador_apellido}`,
                especialidad: entrenador.especialidad,
                telefono: entrenador.entrenador_telefono,
                fecha_asignacion: entrenador.fecha_asignacion
            }
        });

    } catch (error) {
        console.error('❌ Error en generarNotificacionEntrenador:', error);
        console.error('❌ Stack trace:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Error interno al generar notificación',
            error: error.message
        });
    } finally {
        client.release();
    }
};

// Listar notificaciones de un miembro autenticado (SIN SERVICIO)
exports.listarPorMiembro = async (req, res) => {
    const client = await db.connect();
    
    try {
        const id_miembro = req.user.id_miembro;
        
        if (!id_miembro) {
            return res.status(403).json({ 
                success: false, 
                message: "Solo miembros pueden ver sus notificaciones" 
            });
        }

        console.log('📋 Listando notificaciones para miembro:', id_miembro);

        // Consulta directa a la base de datos
        const notificaciones = await client.query(`
            SELECT 
                id_notificacion,
                tipo,
                titulo,
                contenido,
                f_envio,
                leido,
                estado
            FROM Notificacion_miembro 
            WHERE id_miembro = $1 AND estado = TRUE
            ORDER BY f_envio DESC
        `, [id_miembro]);

        console.log('📊 Notificaciones encontradas:', notificaciones.rows.length);

        res.json({ 
            success: true, 
            data: notificaciones.rows 
        });

    } catch (error) {
        console.error('❌ Error al listar notificaciones:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al cargar notificaciones',
            error: error.message 
        });
    } finally {
        client.release();
    }
};

// Marcar como leída (SIN SERVICIO)
exports.marcarComoLeida = async (req, res) => {
    const client = await db.connect();
    
    try {
        const { id } = req.params;
        const id_miembro = req.user.id_miembro;

        console.log('✅ Marcando notificación como leída:', id);

        // Actualizar directamente en la base de datos
        const result = await client.query(`
            UPDATE Notificacion_miembro 
            SET leido = TRUE 
            WHERE id_notificacion = $1 AND id_miembro = $2
            RETURNING id_notificacion
        `, [id, id_miembro]);

        if (result.rows.length > 0) {
            res.json({ 
                success: true, 
                message: "Notificación marcada como leída" 
            });
        } else {
            res.status(404).json({ 
                success: false, 
                message: "Notificación no encontrada" 
            });
        }

    } catch (error) {
        console.error('❌ Error al marcar como leída:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al actualizar notificación',
            error: error.message 
        });
    } finally {
        client.release();
    }
};