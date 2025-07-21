const service = require('../services/asistencia.service');

// POST /api/asistencia - Registrar asistencia
exports.registrarAsistencia = async (req, res) => {
    try {
        const { id_miembro, horario, fecha_asistencia } = req.body;
        if (!id_miembro || !horario || !fecha_asistencia) {
            return res.status(400).json({
                success: false,
                message: 'Faltan datos obligatorios: id_miembro, horario, fecha_asistencia'
            });
        }
        const asistencia = await service.registrarAsistencia({ id_miembro, horario, fecha_asistencia });
        res.status(201).json({
            success: true,
            message: 'Asistencia registrada correctamente',
            data: asistencia
        });
    } catch (error) {
        console.error('Error al registrar asistencia:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno al registrar asistencia',
            error: error.message
        });
    }
};

// GET /api/asistencia - Listar historial de asistencia (opcional: ?id_miembro=)
exports.listarAsistencia = async (req, res) => {
    try {
        const { id_miembro } = req.query;
        console.log('Query recibido:', req.query);
        console.log('Token recibido:', req.user);

        const historial = await service.listarAsistencia(id_miembro);
        console.log('Historial de asistencia:', historial);

        res.json({
            success: true,
            data: historial
        });
    } catch (error) {
        console.error('Error al listar asistencia:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno al listar asistencia',
            error: error.message
        });
    }
};