const db = require('../config/db');
exports.findFacturasByMember = async (memberId) => {
  const result = await db.query(
    `SELECT 
       f.id_factura,
       f.fecha_emision,
       f.total,
       f.estado_registro,
       f.f_registro,
       m.nombre || ' ' || m.apellido1 as nombre_miembro,
       u.usuario as admin_usuario
     FROM Factura f
     INNER JOIN Miembro m ON f.id_miembro = m.id_miembro
     INNER JOIN Usuario u ON f.id_admin = u.id_usuario
     WHERE f.id_miembro = $1
     ORDER BY f.fecha_emision DESC`,
    [memberId]
  );
  return result.rows;
};


exports.findFacturaByIdAndMember = async (facturaId, memberId) => {
  const result = await db.query(
    `SELECT 
       f.id_factura,
       f.id_miembro,
       f.id_admin,
       f.fecha_emision,
       f.total,
       f.estado_registro,
       f.f_registro,
       m.nombre || ' ' || m.apellido1 as nombre_miembro,
       m.correo,
       u.usuario as admin_usuario
     FROM Factura f
     INNER JOIN Miembro m ON f.id_miembro = m.id_miembro
     INNER JOIN Usuario u ON f.id_admin = u.id_usuario
     WHERE f.id_factura = $1 AND f.id_miembro = $2`,
    [facturaId, memberId]
  );
  return result.rows[0];
};


exports.findDetallesByFactura = async (facturaId) => {
  const result = await db.query(
    `SELECT 
       df.id_detalle,
       df.tipo_detalle,
       df.referencia_id,
       df.descripcion,
       df.monto,
       df.iva,
       df.metodo_pago,
       df.estado_registro,
       df.f_registro
     FROM Detalle_Factura df
     WHERE df.id_factura = $1
     ORDER BY df.f_registro ASC`,
    [facturaId]
  );
  return result.rows;
};