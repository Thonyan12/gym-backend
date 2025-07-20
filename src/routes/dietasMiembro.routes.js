const express = require('express');
const router = express.Router();
const controller = require('../controllers/dietas.miembro.controller');
const { authenticateToken, requireMember } = require('../middleware/auth');

// Obtener todas las dietas del miembro logueado
router.get('/miembro', authenticateToken, requireMember, controller.getMyDietas);

// Obtener detalles de una dieta específica con sus comidas
router.get('/miembro/:id_dieta/detalles', authenticateToken, requireMember, controller.getDietaDetails);

// Obtener todas las comidas del miembro organizadas por dieta
router.get('/miembro/comidas', authenticateToken, requireMember, controller.getAllMyComidas);

// Obtener plan nutricional completo del miembro
router.get('/miembro/plan-completo', authenticateToken, requireMember, controller.getPlanNutricional);

module.exports = router;