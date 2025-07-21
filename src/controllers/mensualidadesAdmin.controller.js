//tercero
const service = require('../services/mensualidadesAdmin.service');

exports.getAllMensualidades = async (req, res) => {
  try {
    const mensualidades = await service.getAllMensualidades();
    res.json(mensualidades);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las mensualidades",
      error: error.message,
    });
  }
};

exports.createMensualidad = async (req, res) => {
  try {
    const nuevaMensualidad = await service.createMensualidad(req.body);
    res.status(201).json(nuevaMensualidad);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear la mensualidad",
      error: error.message,
    });
  }
};

exports.getMensualidadById = async (req, res) => {
  try {
    const mensualidad = await service.getMensualidadById(req.params.id);

    if (!mensualidad) {
      return res.status(404).json({
        message: `Mensualidad con id ${req.params.id} no encontrada`,
      });
    }
    res.json(mensualidad);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la mensualidad",
      error: error.message,
    });
  }
};

exports.updateMensualidad = async (req, res) => {
  try {
    const mensualidad = await service.updateMensualidad(req.params.id, req.body);
    if (!mensualidad) {
      return res.status(404).json({
        message: "Mensualidad no encontrada",
      });
    }
    res.json(mensualidad);
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar la mensualidad",
      error: error.message,
    });
  }
};

exports.deleteMensualidad = async (req, res) => {
  try {
    const result = await service.deleteMensualidad(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar la mensualidad",
      error: error.message,
    });
  }
};