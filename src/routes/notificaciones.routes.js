const express = require('express');
const router = express.Router();
const notificacionesController = require('../controllers/notificaciones.controller');
const { authenticateToken, requireMember } = require('../middleware/auth');

// Ruta para obtener todas las notificaciones del usuario (enviadas y recibidas)
router.get('/all', authenticateToken, notificacionesController.getAllUserNotifications);
router.get('/:id', authenticateToken, notificacionesController.getNotificacionById); // Buscar por ID
router.post('/', authenticateToken, notificacionesController.createNotificacion); // Crear nueva
router.delete('/:id', authenticateToken, notificacionesController.deleteNotificacion); // Eliminar por ID
router.get('/tipo/:tipo', authenticateToken, notificacionesController.getNotificacionesByTipo);

// Listar notificaciones del usuario logueado (con filtro por tipo y orden)
router.get('/miembro', authenticateToken, requireMember, notificacionesController.listarPorUsuario);

// Marcar notificación como leída
router.put('/miembro/:id_notificacion/leida', authenticateToken, requireMember, notificacionesController.marcarLeida);

module.exports = router;