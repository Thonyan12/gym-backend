const model = require('../models/facturasMiembro.models');

exports.getFacturasByMember = async (memberId) => {
  return await model.findFacturasByMember(memberId);
};

// Obtener una factura específica con sus detalles (solo si pertenece al miembro)
exports.getFacturaWithDetails = async (facturaId, memberId) => {
  const factura = await model.findFacturaByIdAndMember(facturaId, memberId);
  if (!factura) {
    throw new Error(`Factura con id ${facturaId} no encontrada o no autorizada`);
  }
  
  const detalles = await model.findDetallesByFactura(facturaId);
  
  return {
    factura,
    detalles
  };
};

// Validar que una factura pertenece a un miembro
exports.validateFacturaOwnership = async (facturaId, memberId) => {
  const factura = await model.findFacturaByIdAndMember(facturaId, memberId);
  return !!factura;
};