const express = require('express');
const router = express.Router();
const notificacionesController = require('../controllers/notificaciones.controller');
const { authenticateToken, requireMember } = require('../middleware/auth');

// Rutas generales de notificaciones
router.get('/', authenticateToken, notificacionesController.getAllNotificaciones); // Listar todas
router.get('/all', authenticateToken, notificacionesController.getAllUserNotifications); // Todas del usuario
router.get('/sent', authenticateToken, notificacionesController.getSentNotifications); // Enviadas
router.get('/received', authenticateToken, notificacionesController.getReceivedNotifications); // Recibidas
router.get('/tipo/:tipo', authenticateToken, notificacionesController.getNotificacionesByTipo); // Por tipo

// CRUD de notificaciones
router.post('/', authenticateToken, notificacionesController.createNotificacion); // Crear nueva
router.get('/:id', authenticateToken, notificacionesController.getNotificacionById); // Buscar por ID
router.put('/:id', authenticateToken, notificacionesController.marcarLeida); // Marcar como leída
router.delete('/:id', authenticateToken, notificacionesController.deleteNotificacion); // Eliminar por ID

// Rutas para miembros
router.get('/miembro', authenticateToken, requireMember, notificacionesController.listarPorUsuario);
router.put('/miembro/:id_notificacion/leida', authenticateToken, requireMember, notificacionesController.marcarLeida);

module.exports = router;