const express = require('express');
const router = express.Router();
const perfilFisicoController = require('../controllers/perfilFisico.controller');
const auth = require('../middleware/auth');

// ===============================
// RUTAS PARA MIEMBROS (requieren autenticación de miembro)
// ===============================

// GET /api/perfil-fisico/mi-perfil-completo - Todo en uno
router.get('/mi-perfil-completo', 
    auth.authenticateToken, 
    auth.requireRole('miembro'), 
    perfilFisicoController.getMyCompleteProfile
);

// POST /api/perfil-fisico/crear - Crear perfil (trigger automático)
router.post('/crear', 
    auth.authenticateToken, 
    auth.requireRole('miembro'), 
    perfilFisicoController.createProfile
);

// GET /api/perfil-fisico/historial - Solo historial perfiles
router.get('/historial', 
    auth.authenticateToken, 
    auth.requireRole('miembro'), 
    perfilFisicoController.getProfileHistory
);

// GET /api/perfil-fisico/historial-rutinas - Solo historial rutinas
router.get('/historial-rutinas', 
    auth.authenticateToken, 
    auth.requireRole('miembro'), 
    perfilFisicoController.getRoutineHistory
);

// GET /api/perfil-fisico/evolucion-imc - Evolución del IMC
router.get('/evolucion-imc', 
    auth.authenticateToken, 
    auth.requireRole('miembro'), 
    perfilFisicoController.getIMCEvolution
);

// ===============================
// RUTAS PARA ADMINISTRADORES
// ===============================

// GET /api/perfil-fisico/miembro/:id/completo - Admin obtiene perfil de cualquier miembro
router.get('/miembro/:id/completo', 
    auth.authenticateToken, 
    auth.requireRole(['admin']), 
    perfilFisicoController.getMemberCompleteProfile
);

// POST /api/perfil-fisico/miembro/:id/crear - Admin crea perfil para miembro
router.post('/miembro/:id/crear', 
    auth.authenticateToken, 
    auth.requireRole(['admin']), 
    perfilFisicoController.createMemberProfile
);

// GET /api/perfil-fisico/miembro/:id/historial - Admin obtiene historial de perfiles
router.get('/miembro/:id/historial', 
    auth.authenticateToken, 
    auth.requireRole(['admin']), 
    async (req, res) => {
        try {
            const { id } = req.params;
            const PerfilFisicoService = require('../services/perfilFisico.service');

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de miembro inválido'
                });
            }

            const result = await PerfilFisicoService.getProfileHistory(parseInt(id));

            if (!result.success) {
                return res.status(404).json({
                    success: false,
                    message: result.message
                });
            }

            res.status(200).json({
                success: true,
                message: 'Historial de perfiles obtenido exitosamente',
                data: result.data,
                admin_view: true,
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('Error en admin getProfileHistory:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }
);

// GET /api/perfil-fisico/miembro/:id/historial-rutinas - Admin obtiene historial de rutinas
router.get('/miembro/:id/historial-rutinas', 
    auth.authenticateToken, 
    auth.requireRole(['admin']), 
    async (req, res) => {
        try {
            const { id } = req.params;
            const PerfilFisicoService = require('../services/perfilFisico.service');

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de miembro inválido'
                });
            }

            const result = await PerfilFisicoService.getRoutineHistory(parseInt(id));

            if (!result.success) {
                return res.status(404).json({
                    success: false,
                    message: result.message
                });
            }

            res.status(200).json({
                success: true,
                message: 'Historial de rutinas obtenido exitosamente',
                data: result.data,
                admin_view: true,
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('Error en admin getRoutineHistory:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }
);

// GET /api/perfil-fisico/miembro/:id/evolucion-imc - Admin obtiene evolución IMC
router.get('/miembro/:id/evolucion-imc', 
    auth.authenticateToken, 
    auth.requireRole(['admin']), 
    async (req, res) => {
        try {
            const { id } = req.params;
            const PerfilFisicoService = require('../services/perfilFisico.service');

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de miembro inválido'
                });
            }

            const result = await PerfilFisicoService.getIMCEvolution(parseInt(id));

            if (!result.success) {
                return res.status(404).json({
                    success: false,
                    message: result.message
                });
            }

            res.status(200).json({
                success: true,
                message: 'Evolución del IMC obtenida exitosamente',
                data: result.data,
                admin_view: true,
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('Error en admin getIMCEvolution:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }
);

module.exports = router;
