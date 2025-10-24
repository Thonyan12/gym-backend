const model = require('../models/miembro.models');

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

exports.getMiembroByCedula = async (cedula) => {
  const miembro = await model.findByCedula(cedula);
  if (!miembro) {
    const err = new Error('Miembro no encontrado');
    err.status = 404;
    throw err;
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
