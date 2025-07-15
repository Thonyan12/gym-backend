const service = require('../services/notificaciones.services');

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
        const notificacion = await service.createNotificacion(req.body);
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