const db = require('../config/db');

exports.findActiveCartByMember = async (memberId) => {
  const result = await db.query(
    'SELECT * FROM Carrito WHERE id_miembro = $1 AND procesado = FALSE',
    [memberId]
  );
  return result.rows[0];
};

exports.createCart = async (memberId) => {
  const result = await db.query(
    'INSERT INTO Carrito (id_miembro) VALUES ($1) RETURNING *',
    [memberId]
  );
  return result.rows[0];
};

exports.checkoutCart = async (cartId) => {
  const result = await db.query(
    'UPDATE Carrito SET procesado = TRUE WHERE id_carrito = $1 RETURNING *',
    [cartId]
  );
  return result.rows[0];
};