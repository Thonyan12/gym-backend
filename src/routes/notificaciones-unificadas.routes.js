const express = require('express');
const router = express.Router();
const controller = require('../controllers/notificaciones-unificadas.controller');
const { authenticateToken, requireMember } = require('../middleware/auth');

// Obtener TODAS las notificaciones del miembro
router.get('/', authenticateToken, requireMember, controller.obtenerTodasLasNotificacionesDelMiembro);

// Obtener solo notificaciones NO LEÍDAS
router.get('/no-leidas', authenticateToken, requireMember, controller.getNotificacionesNoLeidas);

// Obtener notificaciones por tipo
router.get('/tipo/:tipo', authenticateToken, requireMember, controller.getNotificacionesPorTipo);

// Marcar como leída - ruta: PUT /:origen/:id_notificacion/leida
router.put('/:origen/:id_notificacion/leida', authenticateToken, requireMember, controller.marcarComoLeida);

module.exports = router;
