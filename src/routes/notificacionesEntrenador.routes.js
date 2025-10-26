const express = require('express');
const router = express.Router();
const controller = require('../controllers/notificacionesEntrenador.controller');
const { authenticateToken, requireTrainer } = require('../middleware/auth');

// Listar notificaciones recibidas por el entrenador logueado
router.get('/mis-notificaciones', authenticateToken, requireTrainer, controller.getMyNotifications);

// Crear notificación
router.post('/', authenticateToken, requireTrainer, controller.createNotification);

// PUT /api/notificaciones-entrenador/:id/leida
router.put('/:id/leida', authenticateToken, requireTrainer, controller.marcarNotificacionLeida);

module.exports = router;