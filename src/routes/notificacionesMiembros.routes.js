const express = require('express');
const router = express.Router();
const controller = require('../controllers/notificacionesMiembros.controller');
const { authenticateToken, requireMember } = require('../middleware/auth');

// Listar notificaciones del miembro autenticado
router.get('/', authenticateToken, requireMember, controller.listarPorMiembro);

// Marcar como leída
router.put('/:id/leido', authenticateToken, requireMember, controller.marcarComoLeida);

module.exports = router;