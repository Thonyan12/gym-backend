const model = require('../models/miembro.models');
const db = require('../config/db');

exports.getAllMiembros = async () => {
    return await model.findALL();
};

exports.getMiembroById = async (id) => {
    const miembro = await model.find(Number(id));
    if (!miembro) {
        throw new Error(`Miembro con id ${id} no encontrado`);
    }
    return miembro;
};

exports.createMiembro = async (miembro) => {
    return await model.create(miembro);
};

exports.updateMiembro = async (id, miembro) => {
    return await model.update(Number(id), miembro);
};

exports.deleteMiembro = async (id) => {
    return await model.remove(Number(id));
};
