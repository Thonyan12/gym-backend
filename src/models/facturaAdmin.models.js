//1
const db = require('../config/db');

exports.findAll = async () => {
  const result = await db.query("SELECT * FROM factura");
  return result.rows;
};

exports.find = async (id) => {
  const result = await db.query(
    "SELECT * FROM factura WHERE id_factura = $1",
    [id]
  );
  return result.rows[0];
};

exports.create = async (factura) => {
  const { id_miembro, id_admin, fecha_emision, total, estado_registro, f_registro } = factura;
  const result = await db.query(
    `INSERT INTO factura (id_miembro, id_admin, fecha_emision, total, estado_registro, f_registro)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [id_miembro, id_admin, fecha_emision, total, estado_registro, f_registro]
  );
  return result.rows[0];
};

exports.update = async (id, factura) => {
  const { id_miembro, id_admin, fecha_emision, total, estado_registro, f_registro } = factura;
  const result = await db.query(
    `UPDATE factura 
     SET id_miembro = $1, id_admin = $2, fecha_emision = $3, total = $4, estado_registro = $5, f_registro = $6
     WHERE id_factura = $7
     RETURNING *`,
    [id_miembro, id_admin, fecha_emision, total, estado_registro, f_registro, id]
  );
  return result.rows[0];
};

exports.remove = async (id) => {
  await db.query("DELETE FROM factura WHERE id_factura = $1", [id]);
  return { message: "Factura eliminada" };
};