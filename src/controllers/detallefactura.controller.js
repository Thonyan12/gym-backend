const service = require('../services/detallefactura.service');

// Obtener todos los detalles de factura
exports.getAllDetallesFactura = async (req, res) => {
  try {
    const detalles = await service.getAllDetallesFactura();
    res.json(detalles);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los detalles de factura",
      error: error.message,
    });
  }
};

// Obtener detalle de factura por ID
exports.getDetalleFacturaById = async (req, res) => {
  try {
    const detalle = await service.getDetalleFacturaById(req.params.id);

    if (!detalle) {
      return res.status(404).json({
        message: `Detalle de factura con id ${req.params.id} no encontrado`,
      });
    }
    res.json(detalle);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el detalle de factura",
      error: error.message,
    });
  }
};

// Obtener detalles de factura por id_factura
exports.getDetallesByFacturaId = async (req, res) => {
  try {
    const detalles = await service.getDetallesByFacturaId(req.params.id_factura);

    if (!detalles || detalles.length === 0) {
      return res.status(404).json({
        message: `No se encontraron detalles de factura con id_factura ${req.params.id_factura}`,
      });
    }
    res.json(detalles);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los detalles de factura por id_factura",
      error: error.message,
    });
  }
};

// Crear un nuevo detalle de factura
exports.createDetalleFactura = async (req, res) => {
  try {
    const nuevoDetalle = await service.createDetalleFactura(req.body);
    res.status(201).json(nuevoDetalle);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear el detalle de factura",
      error: error.message,
    });
  }
};

exports.createFacturaConDetalle = async (req, res) => {
  try {
    const facturaCompleta = req.body; // Recibir factura y detalles desde el cliente
    const resultado = await service.createFacturaConDetalle(facturaCompleta);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear factura con detalles",
      error: error.message,
    });
  }
};

