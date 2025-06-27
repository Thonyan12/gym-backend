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