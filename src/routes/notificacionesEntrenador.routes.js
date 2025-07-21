const express = require('express');
const router = express.Router();
const controller = require('../controllers/notificacionesEntrenador.controller');
const { authenticateToken, requireTrainer } = require('../middleware/auth');

// Listar notificaciones recibidas por el entrenador logueado
router.get('/mis-notificaciones', authenticateToken, requireTrainer, controller.getMyNotifications);

// Crear notificación
router.post('/', authenticateToken, requireTrainer, controller.createNotification);

// PATCH /api/notificaciones-entrenador/:id/leida
router.patch('/:id/leida', authenticateToken, requireTrainer, controller.marcarNotificacionLeida);

module.exports = router;