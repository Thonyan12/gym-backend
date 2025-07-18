const db = require("../config/db");

// Obtener todas las notificaciones
exports.findAll = async () => {
  const result = await db.query("SELECT * FROM notificacion");
  return result.rows;
};

// Obtener notificación por ID
exports.findById = async (id) => {
  const result = await db.query(
    "SELECT * FROM notificacion WHERE id_notificacion = $1",
    [id]
  );
  return result.rows[0];
};

// Crear nueva notificación
exports.create = async (notificacion) => {
  const {
    id_usuario,
    id_usuario_remitente,
    tipo,
    contenido,
    fecha_envio,
    leido,
    estado,
  } = notificacion;
  const result = await db.query(
    `INSERT INTO notificacion (id_usuario, id_usuario_remitente, tipo, contenido, fecha_envio, leido, estado)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      id_usuario,
      id_usuario_remitente,
      tipo,
      contenido,
      fecha_envio,
      leido,
      estado,
    ]
  );
  return result.rows[0];
};

// Eliminar notificación por ID
exports.remove = async (id) => {
  await db.query("DELETE FROM notificacion WHERE id_notificacion = $1", [id]);
  return { message: "Notificación eliminada" };
};

// Obtener notificaciones enviadas por el usuario logueado
exports.findSentByUser = async (userId) => {
  const result = await db.query(
    `SELECT * FROM notificacion WHERE id_usuario_remitente = $1 ORDER BY fecha_envio DESC`,
    [userId]
  );
  return result.rows;
};

// Obtener notificaciones recibidas por el usuario logueado
exports.findReceivedByUser = async (userId) => {
  console.log("ID recibido en el modelo:", userId); // Depuración
  const result = await db.query(
    `SELECT * FROM notificacion WHERE id_usuario = $1 ORDER BY fecha_envio DESC`,
    [userId]
  );
  console.log("Resultados de la consulta SQL:", result.rows); // Depuración
  return result.rows;
};
exports.findByTipo = async (tipo) => {
  const result = await db.query(
    "SELECT * FROM notificacion WHERE LOWER(tipo) LIKE LOWER($1)",
    [`%${tipo}%`]
  );
  return result.rows;
};
