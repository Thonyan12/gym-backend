const express = require('express');
const router = express.Router();
const controller = require('../controllers/producto.controller');

router.get('/', controller.getAllProductos);
router.get('/:id', controller.getProductoById);

module.exports = router;