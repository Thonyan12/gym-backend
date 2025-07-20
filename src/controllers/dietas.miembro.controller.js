const service = require('../services/dietasMiembro.service');

// Obtener todas las dietas del miembro logueado
exports.getMyDietas = async (req, res) => {
  try {
    const memberId = req.user.id_miembro;
    
    if (!memberId) {
      return res.status(403).json({
        success: false,
        message: "Solo los miembros pueden acceder a sus dietas"
      });
    }

    const dietas = await service.getDietasByMember(memberId);
    
    if (dietas.length === 0) {
      return res.json({
        success: true,
        message: "No tienes dietas asignadas actualmente",
        data: [],
        total: 0
      });
    }
    
    res.json({
      success: true,
      data: dietas,
      total: dietas.length
    });
  } catch (error) {
    console.error('Error al obtener dietas del miembro:', error);
    res.status(500).json({
      success: false,
      message: "Error al obtener las dietas",
      error: error.message
    });
  }
};

// Obtener una dieta específica con sus comidas
exports.getDietaDetails = async (req, res) => {
  try {
    const dietaId = Number(req.params.id_dieta);
    const memberId = req.user.id_miembro;
    
    if (!memberId) {
      return res.status(403).json({
        success: false,
        message: "Solo los miembros pueden acceder a sus dietas"
      });
    }

    if (!dietaId || isNaN(dietaId)) {
      return res.status(400).json({
        success: false,
        message: "ID de dieta inválido"
      });
    }

    const dietaData = await service.getDietaWithComidas(dietaId, memberId);
    
    res.json({
      success: true,
      data: dietaData
    });
  } catch (error) {
    console.error('Error al obtener detalles de dieta:', error);
    
    if (error.message.includes('no encontrada o no autorizada')) {
      return res.status(404).json({
        success: false,
        message: "Dieta no encontrada o no autorizada"
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Error al obtener los detalles de la dieta",
      error: error.message
    });
  }
};

// Obtener todas las comidas del miembro organizadas por dieta
exports.getAllMyComidas = async (req, res) => {
  try {
    const memberId = req.user.id_miembro;
    
    if (!memberId) {
      return res.status(403).json({
        success: false,
        message: "Solo los miembros pueden acceder a sus comidas"
      });
    }

    const comidasOrganizadas = await service.getAllComidasByMember(memberId);
    
    if (comidasOrganizadas.length === 0) {
      return res.json({
        success: true,
        message: "No tienes comidas asignadas actualmente",
        data: [],
        total: 0
      });
    }
    
    res.json({
      success: true,
      data: comidasOrganizadas,
      total: comidasOrganizadas.length
    });
  } catch (error) {
    console.error('Error al obtener comidas del miembro:', error);
    res.status(500).json({
      success: false,
      message: "Error al obtener las comidas",
      error: error.message
    });
  }
};

// Obtener plan nutricional completo
exports.getPlanNutricional = async (req, res) => {
  try {
    const memberId = req.user.id_miembro;
    
    if (!memberId) {
      return res.status(403).json({
        success: false,
        message: "Solo los miembros pueden acceder a su plan nutricional"
      });
    }

    const planCompleto = await service.getPlanNutricionalCompleto(memberId);
    
    if (planCompleto.length === 0) {
      return res.json({
        success: true,
        message: "No tienes un plan nutricional asignado actualmente",
        data: {
          dietas: [],
          total_dietas: 0,
          total_comidas: 0
        }
      });
    }

    const totalComidas = planCompleto.reduce((acc, dieta) => acc + dieta.total_comidas, 0);
    
    res.json({
      success: true,
      data: {
        dietas: planCompleto,
        total_dietas: planCompleto.length,
        total_comidas: totalComidas
      }
    });
  } catch (error) {
    console.error('Error al obtener plan nutricional:', error);
    res.status(500).json({
      success: false,
      message: "Error al obtener el plan nutricional",
      error: error.message
    });
  }
};