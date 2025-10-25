const db = require('../config/db');

/**
 * Función auxiliar para generar título desde tipo o contenido
 */
function generarTitulo(tipo, contenido) {
  // Si hay tipo, generar título bonito
  const titulosPorTipo = {
    'asignacion_entrenador': 'Entrenador Asignado',
    'asignacion_rutina': 'Nueva Rutina Asignada',
    'asignacion_dieta': 'Nueva Dieta Asignada',
    'pago_mensualidad': 'Pago de Mensualidad',
    'recordatorio': 'Recordatorio',
    'alerta': 'Alerta',
    'info': 'Información',
    'mensaje': 'Mensaje'
  };

  if (titulosPorTipo[tipo]) {
    return titulosPorTipo[tipo];
  }

  // Si no hay tipo conocido, tomar primeras palabras del contenido
  if (contenido && contenido.length > 0) {
    const palabras = contenido.split(' ').slice(0, 5).join(' ');
    return palabras.length < contenido.length ? palabras + '...' : palabras;
  }

  return 'Notificación';
}

/**
 * Obtener todas las notificaciones unificadas del miembro
 */
exports.obtenerTodasLasNotificacionesDelMiembro = async (req, res) => {
  try {
    const id_miembro = req.user.id_miembro;

    if (!id_miembro) {
      return res.status(400).json({
        success: false,
        message: 'ID de miembro no encontrado en el token'
      });
    }

    console.log('📋 Obteniendo notificaciones para id_miembro:', id_miembro);

    // Primero obtener el id_usuario del miembro
    const userQuery = `
      SELECT id_usuario 
      FROM Usuario 
      WHERE id_miembro = $1 AND estado = TRUE
      LIMIT 1
    `;
    const userResult = await db.query(userQuery, [id_miembro]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado para este miembro'
      });
    }

    const id_usuario = userResult.rows[0].id_usuario;
    console.log('👤 ID de usuario encontrado:', id_usuario);

    // UNION de ambas tablas
    const query = `
      -- Notificaciones de la tabla notificacion_miembro
      SELECT 
        'miembro' as origen,
        id_notificacion,
        id_miembro,
        tipo,
        titulo,
        contenido,
        f_envio as fecha_envio,
        leido,
        estado,
        NULL as id_usuario_remitente
      FROM notificacion_miembro
      WHERE id_miembro = $1 AND estado = TRUE

      UNION ALL

      -- Notificaciones de la tabla notificacion
      SELECT 
        'general' as origen,
        n.id_notificacion,
        $1 as id_miembro,
        n.tipo,
        NULL as titulo,
        n.contenido,
        n.fecha_envio,
        n.leido,
        n.estado,
        n.id_usuario_remitente
      FROM notificacion n
      WHERE n.id_usuario = $2 AND n.estado = TRUE

      -- Ordenar por fecha más reciente
      ORDER BY fecha_envio DESC, id_notificacion DESC
    `;

    const result = await db.query(query, [id_miembro, id_usuario]);

    // Transformar los datos para el frontend
    const notificaciones = result.rows.map(row => ({
      origen: row.origen,
      id_notificacion: row.id_notificacion,
      id_miembro: row.id_miembro,
      tipo: row.tipo,
      titulo: row.titulo || generarTitulo(row.tipo, row.contenido),
      contenido: row.contenido,
      fecha_envio: row.fecha_envio,
      leido: row.leido,
      estado: row.estado,
      id_usuario_remitente: row.id_usuario_remitente
    }));

    // Calcular resumen
    const resumen = {
      total: notificaciones.length,
      sistema: notificaciones.filter(n => n.origen === 'miembro').length,
      entrenadores: notificaciones.filter(n => n.origen === 'general').length,
      no_leidas: notificaciones.filter(n => !n.leido).length
    };

    console.log(`✅ ${notificaciones.length} notificaciones encontradas (${resumen.no_leidas} no leídas)`);

    res.json({
      success: true,
      data: notificaciones,
      resumen: resumen
    });

  } catch (error) {
    console.error('Error al obtener notificaciones unificadas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las notificaciones',
      error: error.message
    });
  }
};

/**
 * Obtener solo notificaciones no leídas
 */
exports.getNotificacionesNoLeidas = async (req, res) => {
  try {
    const id_miembro = req.user.id_miembro;

    if (!id_miembro) {
      return res.status(400).json({
        success: false,
        message: 'ID de miembro no encontrado en el token'
      });
    }

    console.log('📋 Obteniendo notificaciones NO LEÍDAS para id_miembro:', id_miembro);

    // Obtener id_usuario del miembro
    const userQuery = `
      SELECT id_usuario 
      FROM Usuario 
      WHERE id_miembro = $1 AND estado = TRUE
      LIMIT 1
    `;
    const userResult = await db.query(userQuery, [id_miembro]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado para este miembro'
      });
    }

    const id_usuario = userResult.rows[0].id_usuario;

    // UNION de ambas tablas - solo no leídas
    const query = `
      -- Notificaciones no leídas de notificacion_miembro
      SELECT 
        'miembro' as origen,
        id_notificacion,
        id_miembro,
        tipo,
        titulo,
        contenido,
        f_envio as fecha_envio,
        leido,
        estado,
        NULL as id_usuario_remitente
      FROM notificacion_miembro
      WHERE id_miembro = $1 AND estado = TRUE AND leido = FALSE

      UNION ALL

      -- Notificaciones no leídas de notificacion
      SELECT 
        'general' as origen,
        n.id_notificacion,
        $1 as id_miembro,
        n.tipo,
        NULL as titulo,
        n.contenido,
        n.fecha_envio,
        n.leido,
        n.estado,
        n.id_usuario_remitente
      FROM notificacion n
      WHERE n.id_usuario = $2 AND n.estado = TRUE AND n.leido = FALSE

      ORDER BY fecha_envio DESC, id_notificacion DESC
    `;

    const result = await db.query(query, [id_miembro, id_usuario]);

    const notificaciones = result.rows.map(row => ({
      origen: row.origen,
      id_notificacion: row.id_notificacion,
      id_miembro: row.id_miembro,
      tipo: row.tipo,
      titulo: row.titulo || generarTitulo(row.tipo, row.contenido),
      contenido: row.contenido,
      fecha_envio: row.fecha_envio,
      leido: row.leido,
      estado: row.estado,
      id_usuario_remitente: row.id_usuario_remitente
    }));

    console.log(`✅ ${notificaciones.length} notificaciones no leídas encontradas`);

    res.json({
      success: true,
      data: notificaciones,
      total: notificaciones.length
    });

  } catch (error) {
    console.error('Error al obtener notificaciones no leídas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las notificaciones no leídas',
      error: error.message
    });
  }
};

/**
 * Obtener notificaciones filtradas por tipo
 */
exports.getNotificacionesPorTipo = async (req, res) => {
  try {
    const id_miembro = req.user.id_miembro;
    const { tipo } = req.params;

    if (!id_miembro) {
      return res.status(400).json({
        success: false,
        message: 'ID de miembro no encontrado en el token'
      });
    }

    console.log('📋 Obteniendo notificaciones tipo:', tipo, 'para id_miembro:', id_miembro);

    // Obtener id_usuario del miembro
    const userQuery = `
      SELECT id_usuario 
      FROM Usuario 
      WHERE id_miembro = $1 AND estado = TRUE
      LIMIT 1
    `;
    const userResult = await db.query(userQuery, [id_miembro]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado para este miembro'
      });
    }

    const id_usuario = userResult.rows[0].id_usuario;

    // UNION de ambas tablas - filtradas por tipo
    const query = `
      -- Notificaciones por tipo de notificacion_miembro
      SELECT 
        'miembro' as origen,
        id_notificacion,
        id_miembro,
        tipo,
        titulo,
        contenido,
        f_envio as fecha_envio,
        leido,
        estado,
        NULL as id_usuario_remitente
      FROM notificacion_miembro
      WHERE id_miembro = $1 AND estado = TRUE AND tipo = $3

      UNION ALL

      -- Notificaciones por tipo de notificacion
      SELECT 
        'general' as origen,
        n.id_notificacion,
        $1 as id_miembro,
        n.tipo,
        NULL as titulo,
        n.contenido,
        n.fecha_envio,
        n.leido,
        n.estado,
        n.id_usuario_remitente
      FROM notificacion n
      WHERE n.id_usuario = $2 AND n.estado = TRUE AND n.tipo = $3

      ORDER BY fecha_envio DESC, id_notificacion DESC
    `;

    const result = await db.query(query, [id_miembro, id_usuario, tipo]);

    const notificaciones = result.rows.map(row => ({
      origen: row.origen,
      id_notificacion: row.id_notificacion,
      id_miembro: row.id_miembro,
      tipo: row.tipo,
      titulo: row.titulo || generarTitulo(row.tipo, row.contenido),
      contenido: row.contenido,
      fecha_envio: row.fecha_envio,
      leido: row.leido,
      estado: row.estado,
      id_usuario_remitente: row.id_usuario_remitente
    }));

    console.log(`✅ ${notificaciones.length} notificaciones tipo '${tipo}' encontradas`);

    res.json({
      success: true,
      data: notificaciones,
      total: notificaciones.length
    });

  } catch (error) {
    console.error('Error al obtener notificaciones por tipo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las notificaciones por tipo',
      error: error.message
    });
  }
};

/**
 * Marcar una notificación como leída
 */
exports.marcarComoLeida = async (req, res) => {
  try {
    const id_miembro = req.user.id_miembro;
    const { id_notificacion, origen } = req.params;

    if (!id_miembro) {
      return res.status(400).json({
        success: false,
        message: 'ID de miembro no encontrado en el token'
      });
    }

    console.log(`📝 Marcando notificación ${id_notificacion} como leída (origen: ${origen})`);

    let result;

    if (origen === 'miembro') {
      // Marcar como leída en notificacion_miembro
      result = await db.query(
        `UPDATE notificacion_miembro 
         SET leido = TRUE 
         WHERE id_notificacion = $1 AND id_miembro = $2 
         RETURNING *`,
        [id_notificacion, id_miembro]
      );
    } else if (origen === 'general') {
      // Marcar como leída en notificacion (buscar id_usuario primero)
      const userResult = await db.query(
        'SELECT id_usuario FROM Usuario WHERE id_miembro = $1 AND estado = TRUE LIMIT 1',
        [id_miembro]
      );
      
      if (userResult.rows.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Usuario no encontrado para este miembro' 
        });
      }

      const id_usuario = userResult.rows[0].id_usuario;
      
      result = await db.query(
        `UPDATE notificacion 
         SET leido = TRUE 
         WHERE id_notificacion = $1 AND id_usuario = $2 
         RETURNING *`,
        [id_notificacion, id_usuario]
      );
    } else {
      return res.status(400).json({ 
        success: false, 
        message: 'Origen de notificación inválido. Debe ser "miembro" o "general"' 
      });
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Notificación no encontrada o no pertenece al usuario' 
      });
    }

    console.log(`✅ Notificación ${id_notificacion} marcada como leída`);

    res.json({
      success: true,
      message: 'Notificación marcada como leída',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error al marcar notificación como leída:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al marcar notificación como leída', 
      error: error.message 
    });
  }
};
