const model = require('../models/notificacionesMiembros.models');
const db = require('../config/db');

// Busca el id_usuario a partir del id_miembro
async function getUserIdByMemberId(id_miembro) {
    const res = await db.query(
        'SELECT id_usuario FROM usuario WHERE id_miembro = $1 AND estado = TRUE',
        [id_miembro]
    );
    return res.rows[0]?.id_usuario || null;
}

exports.listarPorMiembro = async (id_miembro) => {
    const id_usuario = await getUserIdByMemberId(id_miembro);
    if (!id_usuario) return [];
    return await model.findByMemberUserId(id_usuario);
};

exports.marcarComoLeida = async (id_notificacion) => {
    await model.markAsRead(id_notificacion);
};