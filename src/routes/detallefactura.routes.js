const express = require('express');
const router = express.Router();
const controller = require('../controllers/detallefactura.controller');

// Ruta para obtener todos los detalles de factura
router.get('/', controller.getAllDetallesFactura);

// Ruta para obtener un detalle de factura por ID
router.get('/:id', controller.getDetalleFacturaById);

// Ruta para obtener los detalles de factura por id_factura
router.get('/factura/:id_factura', controller.getDetallesByFacturaId);



module.exports = router;