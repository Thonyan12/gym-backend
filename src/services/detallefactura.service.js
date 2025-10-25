const db = require('../config/db');
const detalleModel = require('../models/detallefactura.models');
const facturaModel = require('../models/facturaAdmin.models');

exports.createDetalleFactura = async (detalle) => {
  // detalle: { id_factura, descripcion, cantidad, precio_unitario, subtotal, ... }
  // validaciones básicas
  if (!detalle.id_factura || !detalle.descripcion) {
    throw new Error('Datos incompletos para detalle de factura');
  }
  // delega al modelo
  return await detalleModel.create(detalle);
};

const service = require('../services/detallefactura.service');

exports.createDetalle = async (req, res) => {
  try {
    console.log('POST /api/detallefactura payload:', req.body);
    const resultado = await service.createDetalleFactura(req.body);
    return res.status(201).json(resultado);
  } catch (err) {
    // mostrar stack completo en consola para depurar
    console.error('Error POST /api/detallefactura:', err);
    return res.status(500).json({
      message: 'Error al crear el detalle de factura',
      error: err.message || err.toString()
    });
  }
};
