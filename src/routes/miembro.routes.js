const express = require('express');
const router = express.Router();
const controller = require('../controllers/miembro.controller');

router.get('/', controller.getAllMiembros);
router.get('/:id', controller.getMiembroById);
router.post('/', controller.createMiembro);
router.put('/:id', controller.updateMiembro);
router.delete('/:id', controller.deleteMiembro);

module.exports = router;
