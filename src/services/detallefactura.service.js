const model = require('../models/detallefactura.models');

// Obtener todos los detalles de factura
exports.getAllDetallesFactura = async () => {
  return await model.findAll();
};

// Obtener detalle de factura por ID
exports.getDetalleFacturaById = async (id) => {
  const detalle = await model.find(Number(id));
  if (!detalle) {
    throw new Error(`Detalle de factura con id ${id} no encontrado`);
  }
  return detalle;
};

// Obtener detalles de factura por id_factura
exports.getDetallesByFacturaId = async (id_factura) => {
  const detalles = await model.findByFacturaId(Number(id_factura));
  if (!detalles || detalles.length === 0) {
    throw new Error(`No se encontraron detalles de factura con id_factura ${id_factura}`);
  }
  return detalles;
};

