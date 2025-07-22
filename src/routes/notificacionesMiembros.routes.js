const express = require('express');
const router = express.Router();
const controller = require('../controllers/notificacionesMiembros.controller');
const { authenticateToken, requireMember } = require('../middleware/auth');

// Registro de miembro con asignación automática de entrenador
router.post('/registro-miembro', controller.registroMiembroConAsignacion);

// Generar notificación del entrenador asignado
router.post('/generar-entrenador', authenticateToken, requireMember, controller.generarNotificacionEntrenador);

// Listar notificaciones del miembro autenticado
router.get('/', authenticateToken, requireMember, controller.listarPorMiembro);

// Marcar como leída
router.put('/:id/leido', authenticateToken, requireMember, controller.marcarComoLeida);

module.exports = router;