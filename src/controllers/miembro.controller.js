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
