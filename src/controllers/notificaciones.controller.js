const service = require("../services/notificaciones.services");

exports.getAllNotificaciones = async (req, res) => {
  try {
    const notificaciones = await service.getAllNotificaciones();
    res.json(notificaciones);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las notificaciones",
      error: error.message,
    });
  }
};

exports.createNotificacion = async (req, res) => {
  try {
    const userId = req.user.id; // ID del usuario logueado
    const notificacionData = {
      ...req.body,
      id_usuario_remitente: userId, // Asignar el remitente como el usuario logueado
    };

    const notificacion = await service.createNotificacion(notificacionData);
    res.status(201).json(notificacion);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear la notificación",
      error: error.message,
    });
  }
};

exports.getNotificacionById = async (req, res) => {
  try {
    const notificacion = await service.getNotificacionById(req.params.id);

    if (!notificacion) {
      return res.status(404).json({
        message: `Notificación con id ${req.params.id} no encontrada`,
      });
    }
    res.json(notificacion);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la notificación",
      error: error.message,
    });
  }
};

exports.deleteNotificacion = async (req, res) => {
  try {
    const result = await service.deleteNotificacion(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar la notificación",
      error: error.message,
    });
  }
};

// Obtener notificaciones enviadas por el usuario logueado
exports.getSentNotifications = async (req, res) => {
  try {
    const userId = req.user.id; // ID del usuario logueado
    const notifications = await service.getSentNotifications(userId);
    res.json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las notificaciones enviadas",
      error: error.message,
    });
  }
};

// Obtener notificaciones recibidas por el usuario logueado
exports.getReceivedNotifications = async (req, res) => {
  try {
    const userId = req.user.id; // ID del usuario logueado
    const notifications = await service.getReceivedNotifications(userId);
    res.json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las notificaciones recibidas",
      error: error.message,
    });
  }
};

// Obtener todas las notificaciones del usuario (enviadas y recibidas)
exports.getAllUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id; // ID del usuario logueado
    const sent = await service.getSentNotifications(userId); // Notificaciones enviadas
    const received = await service.getReceivedNotifications(userId); // Notificaciones recibidas

    res.json({
      success: true,
      sent,
      received,
    });
  } catch (error) {
    console.error("Error al obtener las notificaciones del usuario:", error);
    res.status(500).json({
      message: "Error al obtener las notificaciones del usuario",
      error: error.message,
    });
  }
};
exports.getNotificacionesByTipo = async (req, res) => {
  try {
    const tipo = req.params.tipo;
    const notificaciones = await service.getNotificacionesByTipo(tipo);
    res.json(notificaciones);
  } catch (error) {
    res.status(500).json({
      message: "Error al buscar notificaciones por tipo",
      error: error.message,
    });
  }
};
