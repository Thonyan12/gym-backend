const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarios.controller');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Rutas protegidas - requieren autenticación
router.get('/', authenticateToken, controller.getAllUsuarios);
router.get('/:id', authenticateToken, controller.getUsuarioById);

// Rutas admin
router.post('/', authenticateToken, requireAdmin, controller.createUsuario);
router.put('/:id', authenticateToken, requireAdmin, controller.updateUsuario);
router.delete('/:id', authenticateToken, requireAdmin, controller.deleteUsuario);

module.exports = router;