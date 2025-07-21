const express = require('express');
const router = express.Router();
const controller = require('../controllers/facturaAdmin.controller');

router.get('/', controller.getAllFacturas);
router.get('/:id', controller.getFacturaById);
router.post('/', controller.createFactura);
router.put('/:id', controller.updateFactura);
router.delete('/:id', controller.deleteFactura);

// Ruta para crear factura con detalles
router.post('/crear-con-detalle', controller.createFacturaConDetalle);

module.exports = router;