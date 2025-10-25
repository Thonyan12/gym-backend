const express = require('express');
const router = express.Router();
const controller = require('../controllers/detallefactura.controller');

router.get('/', controller.getAllDetallesFactura);
router.get('/:id', controller.getDetalleFacturaById);
router.get('/factura/:id_factura', controller.getDetallesByFacturaId);
router.post('/', controller.createDetalle); // <-- POST /
router.put('/:id', controller.updateDetalle);
router.delete('/:id', controller.deleteDetalle);

module.exports = router;