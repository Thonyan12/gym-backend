const service = require('../services/rutina.service');

// Obtener todas las rutinas
exports.getAllRutinas = async (req, res) => {
  try {
    const rutinas = await service.getAllRutinas();
    res.json({
      success: true,
      data: rutinas
    });
  } catch (error) {
    console.error('Error al obtener rutinas:', error);
    res.status(500).json({
      success: false,
      message: "Error al obtener las rutinas",
      error: error.message
    });
  }
};

// Obtener rutina por ID
exports.getRutinaById = async (req, res) => {
  try {
    const rutina = await service.getRutinaById(req.params.id);
    res.json({
      success: true,
      data: rutina
    });
  } catch (error) {
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: "Error al obtener la rutina",
      error: error.message
    });
  }
};

// Crear nueva rutina
exports.createRutina = async (req, res) => {
  try {
    const rutina = await service.createRutina(req.body);
    res.status(201).json({
      success: true,
      message: "Rutina creada exitosamente",
      data: rutina
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear la rutina",
      error: error.message
    });
  }
};

// Actualizar rutina
exports.updateRutina = async (req, res) => {
  try {
    const rutina = await service.updateRutina(req.params.id, req.body);
    res.json({
      success: true,
      message: "Rutina actualizada exitosamente",
      data: rutina
    });
  } catch (error) {
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: "Error al actualizar la rutina",
      error: error.message
    });
  }
};

// Eliminar rutina
exports.deleteRutina = async (req, res) => {
  try {
    const result = await service.deleteRutina(req.params.id);
    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar la rutina",
      error: error.message
    });
  }
};

// Obtener todas las asignaciones de rutinas
exports.getAllAsignaciones = async (req, res) => {
  try {
    const asignaciones = await service.getAllAsignaciones();
    res.json({
      success: true,
      data: asignaciones
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener las asignaciones",
      error: error.message
    });
  }
};

// Asignar rutina a miembro
exports.asignarRutina = async (req, res) => {
  try {
    const asignacion = await service.asignarRutina(req.body);
    res.status(201).json({
      success: true,
      message: "Rutina asignada exitosamente",
      data: asignacion
    });
  } catch (error) {
    if (error.message.includes('ya tiene asignada')) {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: "Error al asignar la rutina",
      error: error.message
    });
  }
};

// Actualizar asignación de rutina
exports.updateAsignacion = async (req, res) => {
  try {
    const asignacion = await service.updateAsignacion(req.params.id, req.body);
    res.json({
      success: true,
      message: "Asignación actualizada exitosamente",
      data: asignacion
    });
  } catch (error) {
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: "Error al actualizar la asignación",
      error: error.message
    });
  }
};

// Eliminar asignación de rutina
exports.deleteAsignacion = async (req, res) => {
  try {
    const result = await service.deleteAsignacion(req.params.id);
    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar la asignación",
      error: error.message
    });
  }
};

// **ENDPOINT PRINCIPAL: Obtener rutinas de un miembro específico**
exports.getRutinasByMiembro = async (req, res) => {
  try {
    const memberId = req.params.id_miembro;
    const rutinas = await service.getRutinasByMiembro(memberId);
    
    if (rutinas.length === 0) {
      return res.json({
        success: true,
        message: "No tienes rutinas asignadas actualmente",
        data: []
      });
    }
    
    res.json({
      success: true,
      message: "Rutinas del miembro obtenidas exitosamente",
      data: rutinas
    });
  } catch (error) {
    console.error('Error al obtener rutinas del miembro:', error);
    res.status(500).json({
      success: false,
      message: "Error al obtener las rutinas del miembro",
      error: error.message
    });
  }
};

// Para miembros autenticados - obtener sus propias rutinas
exports.getMyRutinas = async (req, res) => {
  try {
    const memberId = req.user.id_miembro;
    
    if (!memberId) {
      return res.status(403).json({
        success: false,
        message: "Solo los miembros pueden acceder a sus rutinas"
      });
    }

    const rutinas = await service.getRutinasByMiembro(memberId);
    
    if (rutinas.length === 0) {
      return res.json({
        success: true,
        message: "No tienes rutinas asignadas actualmente",
        data: []
      });
    }
    
    res.json({
      success: true,
      message: "Tus rutinas obtenidas exitosamente",
      data: rutinas
    });
  } catch (error) {
    console.error('Error al obtener rutinas del miembro:', error);
    res.status(500).json({
      success: false,
      message: "Error al obtener tus rutinas",
      error: error.message
    });
  }
};