const express = require('express');
const router = express.Router();
const controller = require('../controllers/miembro.controller');
const { authenticateToken } = require('../middleware/auth');

router.get('/', controller.getAllMiembros);
router.get('/:id', authenticateToken, controller.getMiembroByIdOrDetalle); 
router.post('/', controller.createMiembro);
router.put('/:id', controller.updateMiembro);
router.delete('/:id', controller.deleteMiembro);

module.exports = router;