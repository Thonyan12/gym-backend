const model = require('../models/notificacionesEntrenador.models');

exports.getTrainerNotifications = async (id_usuario) => {
  return await model.findByTrainer(id_usuario);
};

exports.createNotification = async (data) => {
  return await model.create(data);
};

exports.marcarLeida = async (id_notificacion, id_usuario) => {
  return await model.marcarLeida(id_notificacion, id_usuario);
};