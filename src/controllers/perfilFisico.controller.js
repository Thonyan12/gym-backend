const PerfilFisicoService = require('../services/perfilFisico.service');

// GET /api/perfil-fisico/mi-perfil-completo - Todo en uno
exports.getMyCompleteProfile = async (req, res) => {
    try {
        const id_miembro = req.user.id_miembro; // Del middleware de autenticación

        if (!id_miembro) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no autorizado como miembro'
            });
        }

        const result = await PerfilFisicoService.getCompleteProfile(id_miembro);

        if (!result.success) {
            return res.status(404).json({
                success: false,
                message: result.message
            });
        }

        res.status(200).json({
            success: true,
            message: 'Perfil completo obtenido exitosamente',
            data: result.data,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error en getMyCompleteProfile:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// POST /api/perfil-fisico/crear - Crear perfil (trigger automático)
exports.createProfile = async (req, res) => {
    try {
        const id_miembro = req.user.id_miembro; // Del middleware de autenticación
        const { altura, peso, observaciones } = req.body;

        if (!id_miembro) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no autorizado como miembro'
            });
        }

        // Validaciones básicas
        if (!altura || !peso) {
            return res.status(400).json({
                success: false,
                message: 'Altura y peso son obligatorios',
                required_fields: ['altura', 'peso']
            });
        }

        const profileData = {
            altura: parseFloat(altura),
            peso: parseFloat(peso),
            observaciones: observaciones || 'Perfil físico actualizado por el miembro'
        };

        const result = await PerfilFisicoService.createProfile(id_miembro, profileData);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.message,
                error: result.error
            });
        }

        res.status(201).json({
            success: true,
            message: result.message,
            data: result.data,
            trigger_info: 'Sistema evaluando y asignando nuevas rutinas automáticamente',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error en createProfile:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// GET /api/perfil-fisico/historial - Solo historial perfiles
exports.getProfileHistory = async (req, res) => {
    try {
        const id_miembro = req.user.id_miembro; // Del middleware de autenticación

        if (!id_miembro) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no autorizado como miembro'
            });
        }

        const result = await PerfilFisicoService.getProfileHistory(id_miembro);

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
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error en getProfileHistory:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// GET /api/perfil-fisico/historial-rutinas - Solo historial rutinas
exports.getRoutineHistory = async (req, res) => {
    try {
        const id_miembro = req.user.id_miembro; // Del middleware de autenticación

        if (!id_miembro) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no autorizado como miembro'
            });
        }

        const result = await PerfilFisicoService.getRoutineHistory(id_miembro);

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
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error en getRoutineHistory:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// GET /api/perfil-fisico/evolucion-imc - Evolución del IMC
exports.getIMCEvolution = async (req, res) => {
    try {
        const id_miembro = req.user.id_miembro; // Del middleware de autenticación

        if (!id_miembro) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no autorizado como miembro'
            });
        }

        const result = await PerfilFisicoService.getIMCEvolution(id_miembro);

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
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error en getIMCEvolution:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// ===============================
// ENDPOINTS ADICIONALES PARA ADMINS
// ===============================

// GET /api/perfil-fisico/miembro/:id/completo - Admin obtiene perfil de cualquier miembro
exports.getMemberCompleteProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const userRole = req.user.rol; // Del middleware de autenticación

        // Solo admins pueden ver perfiles de otros miembros
        if (userRole !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado. Solo administradores.'
            });
        }

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID de miembro inválido'
            });
        }

        const result = await PerfilFisicoService.getCompleteProfile(parseInt(id));

        if (!result.success) {
            return res.status(404).json({
                success: false,
                message: result.message
            });
        }

        res.status(200).json({
            success: true,
            message: 'Perfil completo del miembro obtenido exitosamente',
            data: result.data,
            admin_view: true,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error en getMemberCompleteProfile:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// POST /api/perfil-fisico/miembro/:id/crear - Admin crea perfil para miembro
exports.createMemberProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { altura, peso, observaciones } = req.body;
        const userRole = req.user.rol; // Del middleware de autenticación

        // Solo admins pueden crear perfiles para otros miembros
        if (userRole !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado. Solo administradores.'
            });
        }

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID de miembro inválido'
            });
        }

        if (!altura || !peso) {
            return res.status(400).json({
                success: false,
                message: 'Altura y peso son obligatorios',
                required_fields: ['altura', 'peso']
            });
        }

        const profileData = {
            altura: parseFloat(altura),
            peso: parseFloat(peso),
            observaciones: observaciones || `Perfil creado por administrador - ${req.user.usuario}`
        };

        const result = await PerfilFisicoService.createProfile(parseInt(id), profileData);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.message,
                error: result.error
            });
        }

        res.status(201).json({
            success: true,
            message: result.message,
            data: result.data,
            created_by: 'admin',
            admin_info: req.user.usuario,
            trigger_info: 'Sistema evaluando y asignando nuevas rutinas automáticamente',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error en createMemberProfile:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};
