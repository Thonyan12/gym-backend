const express = require('express');
const router = express.Router();
const controller = require('../controllers/entrenadores.controller');
const { authenticateToken } = require('../middleware/auth');

// Miembros asignados al entrenador autenticado
router.get('/mis-miembros', authenticateToken, controller.getMisMiembros);
// Endpoint de prueba sin autenticación

// Perfil del entrenador autenticado
router.get('/mi-perfil', authenticateToken, controller.getMiPerfil);
router.get('/test', (req, res) => {
  res.json({ message: 'Endpoint funcionando' });
});
module.exports = router;