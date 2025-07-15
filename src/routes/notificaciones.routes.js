const express = require('express');
const router = express.Router();
const controller = require('../controllers/notificaciones.controller');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Rutas públicas
router.get('/', controller.getAllNotificaciones);
router.get('/:id', controller.getNotificacionById);

// Rutas protegidas - SOLO ADMIN
router.post('/', authenticateToken, requireAdmin, controller.createNotificacion);
router.delete('/:id', authenticateToken, requireAdmin, controller.deleteNotificacion);

module.exports = router;