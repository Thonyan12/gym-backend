const service = require('../services/usuarios.service');

exports.getAllUsuarios = async (req, res) => {
    try {
        const usuarios = await service.getAllUsuarios();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener los usuarios",
            error: error.message,
        });
    }
};

exports.createUsuario = async (req, res) => {
    try {
        const usuario = await service.createUsuario(req.body);
        res.status(201).json(usuario);
    } catch (error) {
        res.status(500).json({
            message: "Error al crear el usuario",
            error: error.message,
        });
    }
};

exports.getUsuarioById = async (req, res) => {
    try {
        const usuario = await service.getUsuarioById(req.params.id);

        if (!usuario) {
            return res.status(404).json({
                message: `Usuario con id ${req.params.id} no encontrado`,
            });
        }
        res.json(usuario);
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener el usuario",
            error: error.message,
        });
    }
};

exports.updateUsuario = async (req, res) => {
    try {
        const usuario = await service.updateUsuario(req.params.id, req.body);
        if (!usuario) {
            return res.status(404).json({
                message: "Usuario no encontrado",
            });
        }
        res.json(usuario);
    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar el usuario",
            error: error.message,
        });
    }
};

exports.deleteUsuario = async (req, res) => {
    try {
        const result = await service.deleteUsuario(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            message: "Error al eliminar el usuario",
            error: error.message,
        });
    }
};