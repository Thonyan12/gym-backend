const service = require('../services/detallefactura.service');

exports.getAllDetallesFactura = async (req, res) => {
  try {
    const detalles = await service.getAllDetallesFactura();
    res.json(detalles);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los detalles de factura", error: error.message });
  }
};

exports.getDetalleFacturaById = async (req, res) => {
  try {
    const detalle = await service.getDetalleFacturaById(req.params.id);
    res.json(detalle);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el detalle de factura", error: error.message });
  }
};

exports.getDetallesByFacturaId = async (req, res) => {
  try {
    const detalles = await service.getDetallesByFacturaId(req.params.id_factura);
    res.json(detalles);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los detalles por id_factura", error: error.message });
  }
};


exports.createDetalle = async (req, res) => {
  try {
    console.log('POST /api/detallefactura payload:', JSON.stringify(req.body));
    const resultado = await service.createDetalleFactura(req.body);
    return res.status(201).json(resultado);
  } catch (err) {
    // imprime stack completo en consola para depuración
    console.error('Error POST /api/detallefactura stack:', err.stack || err);
    return res.status(500).json({
      message: 'Error al crear el detalle de factura',
      error: err.message || String(err)
    });
  }
};


exports.updateDetalle = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const r = await service.updateDetalle(id, req.body);
    res.json(r);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteDetalle = async (req, res) => {
  try {
    await service.deleteDetalle(Number(req.params.id));
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};