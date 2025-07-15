const db = require('../config/db');

exports.findALL = async () => {
    const result = await db.query("SELECT * FROM notificacion");
    return result.rows;
};

exports.find = async (id) => {
    const result = await db.query(
        "SELECT * FROM notificacion WHERE id_notificacion = $1",
        [id]
    );
    return result.rows[0];
};

exports.create = async (notificacion) => {
    const { id_usuario, id_usuario_remitente, tipo, contenido, fecha_envio, leido, estado } = notificacion;
    const result = await db.query(
        `INSERT INTO notificacion (id_usuario, id_usuario_remitente, tipo, contenido, fecha_envio, leido, estado)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
        [id_usuario, id_usuario_remitente, tipo, contenido, fecha_envio, leido, estado]
    );
    return result.rows[0];
};

exports.remove = async (id) => {
    await db.query("DELETE FROM notificacion WHERE id_notificacion = $1", [id]);
    return { message: "Notificación eliminada" };
};