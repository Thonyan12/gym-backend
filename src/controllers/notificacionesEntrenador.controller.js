const service = require('../services/notificacionesEntrenador.service');

// Listar notificaciones recibidas por el entrenador logueado
exports.getMyNotifications = async (req, res) => {
  console.log('Usuario autenticado:', req.user); // <-- agrega esto
  try {
    const id_usuario = req.user.id; // <--- CAMBIA ESTO
    const notificaciones = await service.getTrainerNotifications(id_usuario);
    res.json({ success: true, data: notificaciones });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener notificaciones', error: error.message });
  }
};

// Crear notificación (el entrenador puede enviar a cualquier usuario)
exports.createNotification = async (req, res) => {
  try {
    const id_usuario_remitente = req.user.id;
    const { id_usuario, tipo, contenido } = req.body;
    const nueva = await service.createNotification({ id_usuario, id_usuario_remitente, tipo, contenido });
    res.status(201).json({ success: true, data: nueva });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al crear notificación', error: error.message });
  }
};

// Marcar notificación como leída
exports.marcarNotificacionLeida = async (req, res) => {
  try {
    const id_usuario = req.user.id;
    const { id } = req.params;
    const notificacion = await service.marcarLeida(id, id_usuario);
    if (!notificacion) {
      return res.status(404).json({ success: false, message: 'Notificación no encontrada o no autorizada' });
    }
    res.json({ success: true, data: notificacion });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al marcar como leída', error: error.message });
  }
};