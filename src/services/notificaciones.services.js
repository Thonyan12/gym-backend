const model = require('../models/notificaciones.models');

exports.getAllNotificaciones = async () => {
    return await model.findALL();
};

exports.getNotificacionById = async (id) => {
    const notificacion = await model.find(Number(id));
    if (!notificacion) {
        throw new Error(`Notificación con id ${id} no encontrada`);
    }
    return notificacion;
};

exports.createNotificacion = async (notificacion) => {
    return await model.create(notificacion);
};

exports.deleteNotificacion = async (id) => {
    return await model.remove(Number(id));
};