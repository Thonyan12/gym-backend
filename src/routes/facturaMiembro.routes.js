const express = require('express');
const router = express.Router();
const controller = require('../controllers/facturaMiembro.controller');
const { authenticateToken, requireMember } = require('../middleware/auth');

// Obtener todas las facturas del miembro logueado
router.get('/miembro', authenticateToken, requireMember, controller.getMyFacturas);

// Obtener detalles de una factura específica
router.get('/miembro/:id_factura/detalles', authenticateToken, requireMember, controller.getFacturaDetails);

module.exports = router;