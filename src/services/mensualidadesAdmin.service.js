//segundo

const model = require('../models/mensualidadesAdmin.models');
const db = require('../config/db');

// Obtener todas las mensualidades
exports.getAllMensualidades = async () => {
  return await model.findAll();
};

// Obtener mensualidad por ID
exports.getMensualidadById = async (id) => {
  const mensualidad = await model.find(Number(id));
  if (!mensualidad) {
    throw new Error(`Mensualidad con id ${id} no encontrada`);
  }
  return mensualidad;
};

 // Crear nueva mensualidad y factura asociada
exports.createMensualidad = async (mensualidad) => {
  const { id_miembro, fecha_inicio, fecha_fin, monto, estado_mensualidad, estado, f_registro } = mensualidad;

  // Crear la mensualidad
  const mensualidadResult = await db.query(
    `INSERT INTO mensualidad (id_miembro, fecha_inicio, fecha_fin, monto, estado_mensualidad, estado, f_registro)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [id_miembro, fecha_inicio, fecha_fin, monto, estado_mensualidad, estado, f_registro]
  );

  const nuevaMensualidad = mensualidadResult.rows[0];

  // Retornar solo la mensualidad creada, ya que la factura será generada automáticamente por el trigger
  return nuevaMensualidad;
};


// Actualizar mensualidad
exports.updateMensualidad = async (id, mensualidad) => {
  const { id_miembro, fecha_inicio, fecha_fin, monto, estado_mensualidad, estado, f_registro } = mensualidad;
  const result = await db.query(
    `UPDATE mensualidad 
     SET id_miembro = $1, fecha_inicio = $2, fecha_fin = $3, monto = $4, estado_mensualidad = $5, estado = $6, f_registro = $7
     WHERE id_mensualidad = $8
     RETURNING *`,
    [id_miembro, fecha_inicio, fecha_fin, monto, estado_mensualidad, estado, f_registro, id]
  );
  return result.rows[0];
};

// Eliminar mensualidad
exports.deleteMensualidad = async (id) => {
  await db.query("DELETE FROM mensualidad WHERE id_mensualidad = $1", [id]);
  return { message: "Mensualidad eliminada" };
};