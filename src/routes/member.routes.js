const express = require('express');
const router = express.Router();
const memberController = require('../controllers/member.controller');
const { authenticateToken, requireAdmin, requireTrainer } = require('../middleware/auth');

// Rutas públicas
router.post('/register', memberController.registerMember);

// Rutas para admin
router.get('/statistics', authenticateToken, requireAdmin, memberController.getGymStatistics);
router.get('/pending', authenticateToken, requireTrainer, memberController.getPendingMembers);

// Rutas para miembros/staff
router.get('/:id/routines', authenticateToken, memberController.getMemberRoutines);

module.exports = router;