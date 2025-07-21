const model = require('../models/entrenadores.models');

// Obtener miembros asignados al entrenador
exports.getMisMiembros = async (id_entrenador) => {
    return await model.getMisMiembros(id_entrenador);
};

// Obtener perfil del entrenador
exports.getPerfil = async (id_entrenador) => {
    return await model.getPerfil(id_entrenador);
};