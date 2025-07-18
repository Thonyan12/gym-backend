const model = require('../models/notificaciones.models');

// Obtener todas las notificaciones
exports.getAllNotificaciones = async () => {
  return await model.findAll();
};

// Obtener notificación por ID
exports.getNotificacionById = async (id) => {
  const notificacion = await model.findById(Number(id));
  if (!notificacion) {
    throw new Error(`Notificación con id ${id} no encontrada`);
  }
  return notificacion;
};

// Crear nueva notificación
exports.createNotificacion = async (notificacion) => {
  return await model.create(notificacion);
};

// Eliminar notificación por ID
exports.deleteNotificacion = async (id) => {
  return await model.remove(Number(id));
};

// Obtener notificaciones enviadas por el usuario logueado
exports.getSentNotifications = async (userId) => {
  return await model.findSentByUser(userId);
};

// Obtener notificaciones recibidas por el usuario logueado
exports.getReceivedNotifications = async (userId) => {
  return await model.findReceivedByUser(userId);
};

exports.getNotificacionesByTipo = async (tipo) => {
  return await model.findByTipo(tipo);
};