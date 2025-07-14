const db = require('../config/db');

exports.findALL = async () => {
  const result = await db.query("SELECT * FROM miembro");
  return result.rows;
};

exports.find = async (id) => {
  const result = await db.query(
    "SELECT * FROM miembro WHERE id_miembro = $1",
    [id]
  );
  return result.rows[0];
};

exports.create = async (miembro) => {
  const { nombre, apellido, edad, telefono, fecha_registro, estado } = miembro;
  const result = await db.query(
    `INSERT INTO miembro (nombre, apellido, edad, telefono, fecha_registro, estado)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [nombre, apellido, edad, telefono, fecha_registro, estado]
  );
  return result.rows[0];
};

exports.update = async (id, miembro) => {
  const { nombre, apellido, edad, telefono, fecha_registro, estado } = miembro;
  const result = await db.query(
    `UPDATE miembro 
     SET nombre = $1, apellido = $2, edad = $3, telefono = $4, fecha_registro = $5, estado = $6
     WHERE id_miembro = $7
     RETURNING *`,
    [nombre, apellido, edad, telefono, fecha_registro, estado, id]
  );
  return result.rows[0];
};

exports.remove = async (id) => {
  await db.query("DELETE FROM miembro WHERE id_miembro = $1", [id]);
  return { message: "Miembro eliminado" };
};
