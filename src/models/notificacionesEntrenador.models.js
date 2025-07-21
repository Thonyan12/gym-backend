const db = require('../config/db');

// Listar notificaciones recibidas por el entrenador logueado
exports.findByTrainer = async (id_usuario) => {
  const result = await db.query(
    `SELECT n.*, u.usuario as remitente
     FROM Notificacion n
     LEFT JOIN Usuario u ON n.id_usuario_remitente = u.id_usuario
     WHERE n.id_usuario = $1 AND n.estado = TRUE
     ORDER BY n.fecha_envio DESC`,
    [id_usuario]
  );
  return result.rows;
};

// Crear nueva notificación
exports.create = async ({ id_usuario, id_usuario_remitente, tipo, contenido }) => {
  const result = await db.query(
    `INSERT INTO Notificacion (id_usuario, id_usuario_remitente, tipo, contenido)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [id_usuario, id_usuario_remitente, tipo, contenido]
  );
  return result.rows[0];
};

// Marcar notificación como leída
exports.marcarLeida = async (id_notificacion, id_usuario) => {
  const result = await db.query(
    `UPDATE Notificacion
     SET leido = TRUE
     WHERE id_notificacion = $1 AND id_usuario = $2
     RETURNING *`,
    [id_notificacion, id_usuario]
  );
  return result.rows[0];
};