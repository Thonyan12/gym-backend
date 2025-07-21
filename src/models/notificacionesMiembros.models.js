const db = require('../config/db');

exports.findByMemberUserId = async (id_usuario) => {
    const result = await db.query(
        `SELECT * FROM notificacion 
         WHERE id_usuario = $1 AND estado = TRUE 
         ORDER BY fecha_envio DESC, id_notificacion DESC`,
        [id_usuario]
    );
    return result.rows;
};

exports.markAsRead = async (id_notificacion) => {
    await db.query(
        `UPDATE notificacion SET leido = TRUE WHERE id_notificacion = $1`,
        [id_notificacion]
    );
};