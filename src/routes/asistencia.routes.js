const express = require('express');
const router = express.Router();
const controller = require('../controllers/asistencia.controller');
const { authenticateToken } = require('../middleware/auth');

// Registrar asistencia
router.post('/', authenticateToken, controller.registrarAsistencia);

// Listar historial de asistencia
router.get('/', authenticateToken, controller.listarAsistencia);

module.exports = router;