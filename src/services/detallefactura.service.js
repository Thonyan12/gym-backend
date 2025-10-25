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


// Crear un nuevo detalle de factura
exports.createDetalleFactura = async (detalle) => {
  try {
    const nuevoDetalle = await model.create(detalle);
    return nuevoDetalle;
  } catch (error) {
    console.error('Error al crear el detalle de factura:', error);
    throw new Error('Error al crear el detalle de factura');
  }
};


exports.createFacturaConDetalle = async (facturaCompleta) => {
  const { factura, detalles } = facturaCompleta || {};

  if (!factura) {
    throw new Error('Payload inválido: falta objeto factura');
  }

  try {
    // Crear la factura
    const nuevaFactura = await facturaModel.create(factura);
    if (!nuevaFactura || !nuevaFactura.id_factura && !nuevaFactura.id) {
      throw new Error('No se pudo crear la factura');
    }

    const generatedId = nuevaFactura.id_factura ?? nuevaFactura.id ?? nuevaFactura._id;

    // Crear los detalles de factura asociados
    const detallesCreados = [];
    if (Array.isArray(detalles)) {
      for (const det of detalles) {
        det.id_factura = Number(generatedId);
        // asegurar referencia_id por defecto
        if (!det.referencia_id) det.referencia_id = Number(generatedId);
        const nuevoDetalle = await detalleModel.create(det);
        detallesCreados.push(nuevoDetalle);
      }
    }

    return {
      factura: nuevaFactura,
      detalles: detallesCreados,
    };
  } catch (error) {
    console.error('Error al crear factura con detalles:', error);
    throw new Error(error.message || 'Error al crear factura con detalles');
  }
};