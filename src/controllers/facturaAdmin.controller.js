//3
const service = require('../services/facturaAdmin.service');

exports.getAllFacturas = async (req, res) => {
  try {
    const facturas = await service.getAllFacturas();
    res.json(facturas);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las facturas",
      error: error.message,
    });
  }
};

exports.createFactura = async (req, res) => {
  try {
    const factura = await service.createFactura(req.body);
    res.status(201).json(factura);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear la factura",
      error: error.message,
    });
  }
};

exports.getFacturaById = async (req, res) => {
  try {
    const factura = await service.getFacturaById(req.params.id);

    if (!factura) {
      return res.status(404).json({
        message: `Factura con id ${req.params.id} no encontrada`,
      });
    }
    res.json(factura);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la factura",
      error: error.message,
    });
  }
};

exports.updateFactura = async (req, res) => {
  try {
    const factura = await service.updateFactura(req.params.id, req.body);
    if (!factura) {
      return res.status(404).json({
        message: "Factura no encontrada",
      });
    }
    res.json(factura);
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar la factura",
      error: error.message,
    });
  }
};

exports.deleteFactura = async (req, res) => {
  try {
    const result = await service.deleteFactura(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar la factura",
      error: error.message,
    });
  }
};