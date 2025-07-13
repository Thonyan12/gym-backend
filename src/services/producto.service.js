const model = require('../models/producto.models');
const db = require('../config/db');

exports.getAllProductos = async () => {
  return await model.findALL();
};
exports.getProductoById = async (id) => {
  const producto = await model.find(Number(id));
  if (!producto) {
    throw new Error(`Producto con id ${id} no encontrado`);
  }
  return producto;
};
exports.createProducto = async (producto) => {
  const { nombre_prod, tipo_prod, precio_prod, stock } = producto;
  const result = await db.query(
    `INSERT INTO producto (nombre_prod, tipo_prod, precio_prod, stock)
    VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [nombre_prod, tipo_prod, precio_prod, stock]
  );
  return result.rows[0];
};

// Obtener todos los productos
exports.getAllProductos = async () => {
  const result = await db.query("SELECT * FROM producto");
  return result.rows;
};

// Obtener producto por ID
exports.getProductoById = async (id) => {
  const result = await db.query(
    "SELECT * FROM producto WHERE id_producto = $1",
    [id]
  );
  return result.rows[0];
};

// Actualizar producto
exports.updateProducto = async (id, producto) => {
  const { nombre_prod, tipo_prod, precio_prod, stock, estado } = producto;
  const result = await db.query(
    `UPDATE producto 
    SET nombre_prod = $1, tipo_prod = $2, precio_prod = $3, stock = $4, estado = $5
    WHERE id_producto = $6
     RETURNING *`,
    [nombre_prod, tipo_prod, precio_prod, stock, estado, id]
  );
  return result.rows[0];
};
// Eliminar producto
exports.deleteProducto = async (id) => {
  await db.query("DELETE FROM producto WHERE id_producto = $1", [id]);
  return { message: "Producto eliminado" };
};