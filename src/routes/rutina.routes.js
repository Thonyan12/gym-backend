const express = require('express');
const router = express.Router();
const controller = require('../controllers/rutina.controller');
const { authenticateToken, requireAdmin, requireTrainer, requireMember } = require('../middleware/auth');

// ===== RUTAS PARA RUTINAS =====
// Obtener todas las rutinas (admin/entrenador)
router.get('/rutinas', authenticateToken, requireTrainer, controller.getAllRutinas);

// Obtener rutina por ID (admin/entrenador)
router.get('/rutinas/:id', authenticateToken, requireTrainer, controller.getRutinaById);

// Crear nueva rutina (admin/entrenador)
router.post('/rutinas', authenticateToken, requireTrainer, controller.createRutina);

// Actualizar rutina (admin/entrenador)
router.put('/rutinas/:id', authenticateToken, requireTrainer, controller.updateRutina);

// Eliminar rutina (admin)
router.delete('/rutinas/:id', authenticateToken, requireAdmin, controller.deleteRutina);

// ===== RUTAS PARA ASIGNACIONES =====
// Obtener todas las asignaciones (admin/entrenador)
router.get('/asignaciones', authenticateToken, requireTrainer, controller.getAllAsignaciones);

// Asignar rutina a miembro (admin/entrenador)
router.post('/asignaciones', authenticateToken, requireTrainer, controller.asignarRutina);

// Actualizar asignación (admin/entrenador)
router.put('/asignaciones/:id', authenticateToken, requireTrainer, controller.updateAsignacion);

// Eliminar asignación (admin/entrenador)
router.delete('/asignaciones/:id', authenticateToken, requireTrainer, controller.deleteAsignacion);

// ===== RUTAS PARA MIEMBROS =====
// **RUTA PRINCIPAL**: Obtener rutinas de un miembro específico (admin/entrenador)
router.get('/miembro/:id_miembro', authenticateToken, requireTrainer, controller.getRutinasByMiembro);

// Obtener mis rutinas (miembro autenticado)
router.get('/mis-rutinas', authenticateToken, requireMember, controller.getMyRutinas);

module.exports = router;
