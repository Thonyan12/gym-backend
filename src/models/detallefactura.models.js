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

// Obtener detalles por id_factura
exports.findByFacturaId = async (id_factura) => {
  const result = await db.query(
    "SELECT * FROM detalle_factura WHERE id_factura = $1",
    [id_factura]
  );
  return result.rows;
};

// Crear detalle
exports.create = async (detalle) => {
  try {
    const {
      id_factura,
      tipo_detalle = 'producto',
      referencia_id = null,
      descripcion = '',
      monto = 0,
      iva = 0,
      metodo_pago = 'efectivo',
      estado_registro = 'Activo',
      f_registro = new Date().toISOString().split('T')[0]
    } = detalle;

    if (!id_factura) throw new Error('id_factura es requerido');

    const sql = `INSERT INTO detalle_factura
      (id_factura, tipo_detalle, referencia_id, descripcion, monto, iva, metodo_pago, estado_registro, f_registro)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`;

    const params = [
      Number(id_factura),
      tipo_detalle,
      referencia_id != null ? Number(referencia_id) : null,
      String(descripcion || ''),
      Number(monto || 0),
      Number(iva || 0),
      metodo_pago,
      estado_registro,
      f_registro
    ];

    const result = await db.query(sql, params);
    return result.rows[0];
  } catch (err) {
    console.error('Model detalle.create error:', err.stack || err);
    throw err;
  }
};

// createWithClient para transacciones si necesitas
exports.createWithClient = async (client, detalle) => {
  const { id_factura, descripcion, cantidad, precio_unitario, subtotal } = detalle;
  const result = await client.query(
    `INSERT INTO detalle_factura (id_factura, descripcion, cantidad, precio_unitario, subtotal)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [id_factura, descripcion, cantidad, precio_unitario, subtotal]
  );
  return result.rows[0];
};

exports.update = async (id, d) => {
  const sql = `UPDATE detalle_factura SET
    tipo_detalle=$1, descripcion=$2, monto=$3, iva=$4, metodo_pago=$5, estado_registro=$6
    WHERE id_detalle=$7 RETURNING *`;
  const params = [
    d.tipo_detalle,
    d.descripcion,
    Number(d.monto || 0),
    Number(d.iva || 0),
    d.metodo_pago,
    typeof d.estado_registro === 'boolean' ? d.estado_registro : true,
    Number(id)
  ];
  const r = await db.query(sql, params);
  return r.rows[0];
};

exports.createTransactional = async (client, detalle) => {
  const sql = `INSERT INTO detalle_factura
      (id_factura, tipo_detalle, referencia_id, descripcion, monto, iva, metodo_pago, estado_registro, f_registro)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`;
  const params = [
    Number(detalle.id_factura),
    detalle.tipo_detalle,
    detalle.referencia_id != null ? Number(detalle.referencia_id) : null,
    String(detalle.descripcion || ''),
    Number(detalle.monto || 0),
    Number(detalle.iva || 0),
    detalle.metodo_pago || 'efectivo',
    typeof detalle.estado_registro === 'boolean' ? detalle.estado_registro : true,
    detalle.f_registro || new Date().toISOString().split('T')[0]
  ];
  const res = await client.query(sql, params);
  return res.rows[0];
};

exports.remove = async (id) => {
  await db.query('DELETE FROM detalle_factura WHERE id_detalle=$1', [id]);
  return true;
};