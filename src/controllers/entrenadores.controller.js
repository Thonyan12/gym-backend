const service = require('../services/entrenadores.service');

// GET /api/entrenadores/mis-miembros - Miembros asignados al entrenador autenticado
exports.getMisMiembros = async (req, res) => {
    try {
        const id_entrenador = req.user.id_coach; // Asegúrate que el token tenga este campo
        if (!id_entrenador) {
            return res.status(401).json({
                success: false,
                message: 'No autorizado como entrenador'
            });
        }
        const miembros = await service.getMisMiembros(id_entrenador);
        res.json({
            success: true,
            data: miembros
        });
    } catch (error) {
        console.error('Error al obtener miembros asignados:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno al obtener miembros asignados',
            error: error.message
        });
    }
};

// GET /api/entrenadores/mi-perfil - Perfil del entrenador autenticado
exports.getMiPerfil = async (req, res) => {
    try {
        const id_entrenador = req.user.id_coach; // Asegúrate que el token tenga este campo
        if (!id_entrenador) {
            return res.status(401).json({
                success: false,
                message: 'No autorizado como entrenador'
            });
        }
        const perfil = await service.getPerfil(id_entrenador);
        res.json({
            success: true,
            data: perfil
        });
    } catch (error) {
        console.error('Error al obtener perfil del entrenador:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno al obtener perfil del entrenador',
            error: error.message
          });
    }
};