//este primero

const db = require('../config/db');

exports.findAll = async () => {
  const result = await db.query("SELECT * FROM mensualidad");
  return result.rows;
};

exports.find = async (id) => {
  const result = await db.query(
    "SELECT * FROM mensualidad WHERE id_mensualidad = $1",
    [id]
  );
  return result.rows[0];
};

exports.create = async (mensualidad) => {
  const { id_miembro, fecha_inicio, fecha_fin, monto, estado_mensualidad, estado, f_registro } = mensualidad;
  const result = await db.query(
    `INSERT INTO mensualidad (id_miembro, fecha_inicio, fecha_fin, monto, estado_mensualidad, estado, f_registro)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [id_miembro, fecha_inicio, fecha_fin, monto, estado_mensualidad, estado, f_registro]
  );
  return result.rows[0];
};

exports.update = async (id, mensualidad) => {
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

exports.remove = async (id) => {
  await db.query("DELETE FROM mensualidad WHERE id_mensualidad = $1", [id]);
  return { message: "Mensualidad eliminada" };
};