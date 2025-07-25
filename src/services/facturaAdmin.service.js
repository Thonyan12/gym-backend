//2
const model = require('../models/facturaAdmin.models');
const detalleModel = require('../models/detallefactura.models');

// Obtener todas las facturas
exports.getAllFacturas = async () => {
  return await model.findAll();
};

// Obtener factura por ID
exports.getFacturaById = async (id) => {
  const factura = await model.find(Number(id));
  if (!factura) {
    throw new Error(`Factura con id ${id} no encontrada`);
  }
  return factura;
};

// Crear nueva factura
exports.createFactura = async (factura) => {
  const { id_miembro, id_admin, fecha_emision, total, estado_registro, f_registro } = factura;
  const result = await db.query(
    `INSERT INTO factura (id_miembro, id_admin, fecha_emision, total, estado_registro, f_registro)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [id_miembro, id_admin, fecha_emision, total, estado_registro, f_registro]
  );
  return result.rows[0];
};

// Actualizar factura
exports.updateFactura = async (id, factura) => {
  const updatedFactura = await model.update(Number(id), factura);
  if (!updatedFactura) {
    throw new Error(`Factura con id ${id} no encontrada para actualizar`);
  }
  return updatedFactura;
};

// Eliminar factura
exports.deleteFactura = async (id) => {
  await model.remove(Number(id));
  return { message: "Factura eliminada" };
};

exports.createFacturaConDetalle = async (facturaCompleta) => {
  const { factura, detalles } = facturaCompleta;

  try {
    console.log('Datos procesados en el servicio:', factura, detalles); // Depuración

    // Crear la factura
    const nuevaFactura = await model.create(factura);

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
    console.error('Error en createFacturaConDetalle:', error);
    throw new Error('Error al crear factura con detalles');
  }
};