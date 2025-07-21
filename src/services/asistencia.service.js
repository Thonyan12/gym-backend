const model = require('../models/asistencia.models');

// Registrar asistencia
exports.registrarAsistencia = async (asistenciaData) => {
    return await model.create(asistenciaData);
};

// Listar historial de asistencia (puedes filtrar por id_miembro)
exports.listarAsistencia = async (id_miembro = null) => {
    return await model.findAll(id_miembro);
};