const service = require('../services/facturaMiembro.service');


exports.getMyFacturas = async (req, res) => {
  try {
    const memberId = req.user.id_miembro;
    
    if (!memberId) {
      return res.status(403).json({
        success: false,
        message: "Solo los miembros pueden acceder a sus facturas"
      });
    }

    const facturas = await service.getFacturasByMember(memberId);
    
    res.json({
      success: true,
      data: facturas,
      total: facturas.length
    });
  } catch (error) {
    console.error('Error al obtener facturas del miembro:', error);
    res.status(500).json({
      success: false,
      message: "Error al obtener las facturas",
      error: error.message
    });
  }
};


exports.getFacturaDetails = async (req, res) => {
  try {
    const facturaId = Number(req.params.id_factura);
    const memberId = req.user.id_miembro;
    
    if (!memberId) {
      return res.status(403).json({
        success: false,
        message: "Solo los miembros pueden acceder a sus facturas"
      });
    }

    if (!facturaId || isNaN(facturaId)) {
      return res.status(400).json({
        success: false,
        message: "ID de factura inválido"
      });
    }

    const facturaData = await service.getFacturaWithDetails(facturaId, memberId);
    
    res.json({
      success: true,
      data: facturaData
    });
  } catch (error) {
    console.error('Error al obtener detalles de factura:', error);
    
    if (error.message.includes('no encontrada o no autorizada')) {
      return res.status(404).json({
        success: false,
        message: "Factura no encontrada o no autorizada"
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Error al obtener los detalles de la factura",
      error: error.message
    });
  }
};