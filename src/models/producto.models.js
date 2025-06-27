const db = require("../config/db");

exports.findALL = async () => {
  const result = await db.query("SELECT * FROM producto");
  return result.rows;
};
exports.find = async (id) => {
  const result = await db.query(
    "SELECT * FROM producto WHERE id_producto = $1",
    [id]
  );
  return result.rows[0];
};

exports.create = async (producto) => {
  const { nombre_prod, tipo_prod, precio_prod, stock } = producto;
  const result = await db.query(
    `INSERT INTO producto (nombre_prod, tipo_prod, precio_prod, stock)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [nombre_prod, tipo_prod, precio_prod, stock]
  );
  return result.rows[0];
};

exports.update = async (id, producto) => {
  const { nombre_prod, tipo_prod, precio_prod, stock } = producto;
  const result = await db.query(
    `UPDATE producto 
     SET nombre_prod = $1, tipo_prod = $2, precio_prod = $3, stock = $4
     WHERE id_producto = $5
     RETURNING *`,
    [nombre_prod, tipo_prod, precio_prod, stock, id]
  );
  return result.rows[0];
};


exports.remove = async (id) => {
  await db.query("DELETE FROM producto WHERE id_producto = $1", [id]);
  return { message: "Producto eliminado" };
};