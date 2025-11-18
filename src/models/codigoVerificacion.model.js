const db = require('../config/db');

exports.create = async (email, codigo, tipo) => {
  const expiraEn = new Date(Date.now() + 10 * 60 * 1000); // 10 min
  const result = await db.query(
    `INSERT INTO codigos_verificacion (email, codigo, tipo, expira_en) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [email, codigo, tipo, expiraEn]
  );
  return result.rows[0];
};

exports.verify = async (email, codigo, tipo) => {
  const result = await db.query(
    `SELECT * FROM codigos_verificacion 
     WHERE email = $1 AND codigo = $2 AND tipo = $3 
     AND usado = FALSE AND expira_en > NOW()`,
    [email, codigo, tipo]
  );
  return result.rows[0];
};

exports.markAsUsed = async (id) => {
  await db.query(
    'UPDATE codigos_verificacion SET usado = TRUE WHERE id = $1',
    [id]
  );
};

module.exports = exports;
