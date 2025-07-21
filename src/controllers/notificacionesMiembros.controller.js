const service = require('../services/notificacionesMiembros.service');

// Listar notificaciones de un miembro autenticado
exports.listarPorMiembro = async (req, res) => {
    try {
        const id_miembro = req.user.id_miembro;
        if (!id_miembro) {
            return res.status(403).json({ success: false, message: "Solo miembros pueden ver sus notificaciones" });
        }
        const notificaciones = await service.listarPorMiembro(id_miembro);
        res.json({ success: true, data: notificaciones });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Marcar como leída
exports.marcarComoLeida = async (req, res) => {
    try {
        const { id } = req.params;
        await service.marcarComoLeida(id);
        res.json({ success: true, message: "Notificación marcada como leída" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};