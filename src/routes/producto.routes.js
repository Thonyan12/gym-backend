const express = require('express');
const router = express.Router();
const controller = require('../controllers/producto.controller');
const { authenticateToken, requireAdmin, requireTrainer } = require('../middleware/auth');

// Rutas públicas
router.get('/', controller.getAllProductos);
router.get('/:id', controller.getProductoById);

// Rutas protegidas - SOLO ADMIN
router.post('/', authenticateToken, requireAdmin, controller.createProducto);
router.put('/:id', authenticateToken, requireAdmin, controller.updateProducto);
router.delete('/:id', authenticateToken, requireAdmin, controller.deleteProducto);

module.exports = router;