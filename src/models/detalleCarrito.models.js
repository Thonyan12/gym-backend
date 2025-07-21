const db = require('../config/db');

exports.findItemsByCart = async (cartId) => {
  const result = await db.query(
    'SELECT * FROM Detalle_Carrito WHERE id_carrito = $1',
    [cartId]
  );
  return result.rows;
};

exports.findItemById = async (itemId) => {
  const result = await db.query(
    'SELECT * FROM Detalle_Carrito WHERE id_detalle_carrito = $1',
    [itemId]
  );
  return result.rows[0];
};

exports.createCartItem = async (cartId, productId, quantity, price) => {
  const result = await db.query(
    `INSERT INTO Detalle_Carrito 
       (id_carrito, id_producto, cantidad, precio_unitario)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [cartId, productId, quantity, price]
  );
  return result.rows[0];
};

exports.updateCartItem = async (itemId, quantity) => {
  const result = await db.query(
    `UPDATE Detalle_Carrito 
      SET cantidad = $1 
     WHERE id_detalle_carrito = $2
     RETURNING *`,
    [quantity, itemId]
  );
  return result.rows[0];
};

exports.deleteCartItem = async (itemId) => {
  await db.query(
    'DELETE FROM Detalle_Carrito WHERE id_detalle_carrito = $1',
    [itemId]
  );
  return { message: 'Item eliminado del carrito' };
};