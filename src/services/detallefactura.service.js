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
  const { factura, detalles } = facturaCompleta;

  try {
    // Crear la factura
    const nuevaFactura = await facturaModel.create(factura);

    // Crear los detalles de factura asociados
    const detallesCreados = [];
    for (const detalle of detalles) {
      detalle.id_factura = nuevaFactura.id_factura; // Asignar el id_factura generado
      const nuevoDetalle = await detalleModel.create(detalle);
      detallesCreados.push(nuevoDetalle);
    }

    return {
      factura: nuevaFactura,
      detalles: detallesCreados,
    };
  } catch (error) {
    console.error('Error al crear factura con detalles:', error);
    throw new Error('Error al crear factura con detalles');
  }
};
