const service = require('../services/miembro.service');

exports.getAllMiembros = async (req, res) => {
    try {
    const miembros = await service.getAllMiembros();
    res.json(miembros);
    } catch (error) {
    res.status(500).json({
    message: "Error al obtener los miembros",
    error: error.message,
    });
}
};

exports.createMiembro = async (req, res) => {
    try {
        const miembro = await service.createMiembro(req.body);
        res.status(201).json(miembro);
    } catch (error) {
        res.status(500).json({
            message: "Error al crear el miembro",
            error: error.message,
        });
    }
};
exports.getMiembroById = async (req, res) => {
try {
    const miembro = await service.getMiembroById(req.params.id);

    if (!miembro) {
    return res.status(404).json({
        message: `Miembro con id ${req.params.id} no encontrado`,
    });
    }
    res.json(miembro);
} catch (error) {
    res.status(500).json({
    message: "Error al obtener el miembro",
    error: error.message,
    });
}
};
exports.getMiembroByIdOrDetalle = async (req, res) => {
    try {
        const idMiembro = req.params.id;
        const miembro = await service.getMiembroById(idMiembro); // O getDetalleMiembro según el caso
        if (!miembro) {
            return res.status(404).json({
                success: false,
                message: 'Miembro no encontrado'
            });
        }
        res.json(miembro);
    } catch (error) {
        console.error('Error al obtener miembro:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno al obtener miembro',
            error: error.message
        });
    }
};
exports.updateMiembro = async (req, res) => {
try {
    const miembro = await service.updateMiembro(req.params.id, req.body);
    if (!miembro) {
            return res.status(404).json({
                message: "Miembro no encontrado",
            });
        }
        res.json(miembro);
    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar el miembro",
            error: error.message,
        });
    }
};

exports.deleteMiembro = async (req, res) => {
    try {
        const result = await service.deleteMiembro(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            message: "Error al eliminar el miembro",
            error: error.message,
        });
    }
};
