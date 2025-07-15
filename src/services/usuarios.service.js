const model = require('../models/usuarios.models');

exports.getAllUsuarios = async () => {
    return await model.findALL();
};

exports.getUsuarioById = async (id) => {
    const usuario = await model.find(Number(id));
    if (!usuario) {
        throw new Error(`Usuario con id ${id} no encontrado`);
    }
    return usuario;
};

exports.createUsuario = async (usuario) => {
    return await model.create(usuario);
};

exports.updateUsuario = async (id, usuario) => {
    return await model.update(Number(id), usuario);
};

exports.deleteUsuario = async (id) => {
    return await model.remove(Number(id));
};