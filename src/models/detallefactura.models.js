const db = require('../config/db');

// Obtener todos los detalles de factura
exports.findAll = async () => {
  const result = await db.query("SELECT * FROM detalle_factura");
  return result.rows;
};

// Obtener detalle de factura por ID
exports.find = async (id) => {
  const result = await db.query(
    "SELECT * FROM detalle_factura WHERE id_detalle = $1",
    [id]
  );
  return result.rows[0];
};

// Obtener detalles de factura por id_factura
exports.findByFacturaId = async (id_factura) => {
  const result = await db.query(
    "SELECT * FROM detalle_factura WHERE id_factura = $1",
    [id_factura]
  );
  return result.rows;
};


// Crear un nuevo detalle de factura
exports.create = async (detalle) => {
  const { id_factura, tipo_detalle, referencia_id, descripcion, monto, iva, metodo_pago, estado_registro, f_registro } = detalle;
  const result = await db.query(
    `INSERT INTO detalle_factura (id_factura, tipo_detalle, referencia_id, descripcion, monto, iva, metodo_pago, estado_registro, f_registro)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [id_factura, tipo_detalle, referencia_id, descripcion, monto, iva, metodo_pago, estado_registro, f_registro]
  );
  return result.rows[0];
};
