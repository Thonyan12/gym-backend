//cuarto
const express = require('express');
const router = express.Router();
const controller = require('../controllers/mensualidadesAdmin.controller');

router.get('/', controller.getAllMensualidades);
router.get('/:id', controller.getMensualidadById);
router.post('/', controller.createMensualidad);
router.put('/:id', controller.updateMensualidad);
router.delete('/:id', controller.deleteMensualidad);

module.exports = router;