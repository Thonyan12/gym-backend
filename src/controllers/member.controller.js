const memberService = require("../services/member.service");

// Registro de nuevo miembro
exports.registerMember = async (req, res) => {
  try {
    // Validar campos requeridos
    const requiredFields = [
      'cedula', 'nombre', 'apellido1', 'edad', 'direccion',
      'altura', 'peso', 'contextura', 'objetivo', 'sexo', 'correo'
    ];
    
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "CAMPOS_REQUERIDOS",
        error: `Campos faltantes: ${missingFields.join(', ')}`
      });
    }
    
    // Validaciones de formato
    const { cedula, edad, altura, peso, sexo, contextura, correo } = req.body;
    
    if (!/^\d{10}$/.test(cedula)) {
      return res.status(400).json({
        success: false,
        message: "CEDULA_INVALIDA",
        error: "La cédula debe tener exactamente 10 dígitos"
      });
    }
    
    if (edad < 15 || edad > 80) {
      return res.status(400).json({
        success: false,
        message: "EDAD_INVALIDA",
        error: "La edad debe estar entre 15 y 80 años"
      });
    }
    
    if (altura < 130 || altura > 220) {
      return res.status(400).json({
        success: false,
        message: "ALTURA_INVALIDA",
        error: "La altura debe estar entre 130 y 220 cm"
      });
    }
    
    if (peso < 35 || peso > 200) {
      return res.status(400).json({
        success: false,
        message: "PESO_INVALIDO",
        error: "El peso debe estar entre 35 y 200 kg"
      });
    }
    
    if (!['M', 'F'].includes(sexo)) {
      return res.status(400).json({
        success: false,
        message: "SEXO_INVALIDO",
        error: "El sexo debe ser 'M' o 'F'"
      });
    }
    
    if (!['Ectomorfo', 'Mesomorfo', 'Endomorfo'].includes(contextura)) {
      return res.status(400).json({
        success: false,
        message: "CONTEXTURA_INVALIDA",
        error: "La contextura debe ser: Ectomorfo, Mesomorfo o Endomorfo"
      });
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      return res.status(400).json({
        success: false,
        message: "CORREO_INVALIDO",
        error: "Formato de correo electrónico inválido"
      });
    }
    
    // Registrar miembro (triggers automáticos se ejecutarán)
    const result = await memberService.registerMember(req.body);
    
    const nombreCompleto = `${result.member.nombre} ${result.member.apellido1}${
      result.member.apellido2 ? ' ' + result.member.apellido2 : ''
    }`;
    
    res.status(201).json({
      success: true,
      message: "REGISTRO EXITOSO",
      data: {
        id_miembro: result.member.id_miembro,
        nombre_completo: nombreCompleto,
        credenciales: {
          usuario: result.credentials.usuario,
          contrasenia: result.credentials.contrasenia
        },
        mensaje_principal: "¡Registro completado exitosamente!",
        instrucciones: [
          "Contacte con el administrador para activar su membresía",
          "Guarde estas credenciales para acceder una vez activado",
          "Su rutina ha sido asignada automáticamente según su perfil físico"
        ]
      }
    });
    
  } catch (error) {
    console.error('Error al registrar miembro:', error);
    
    // Manejo de errores específicos
    if (error.message === 'CEDULA_DUPLICADA') {
      return res.status(409).json({
        success: false,
        message: "CEDULA_DUPLICADA",
        error: "Ya existe un miembro registrado con esta cédula"
      });
    }
    
    if (error.message === 'CORREO_DUPLICADO') {
      return res.status(409).json({
        success: false,
        message: "CORREO_DUPLICADO", 
        error: "Ya existe un miembro registrado con este correo electrónico"
      });
    }
    
    res.status(500).json({
      success: false,
      message: "ERROR_INTERNO",
      error: "Error interno del servidor al procesar el registro"
    });
  }
};

// Obtener estadísticas del gimnasio (solo admin)
exports.getGymStatistics = async (req, res) => {
  try {
    const stats = await memberService.getGymStats();
    
    res.json({
      success: true,
      data: {
        miembros_activos: stats.miembros_activos,
        miembros_pendientes: stats.miembros_pendientes,
        mensualidades_vigentes: stats.mensualidades_vigentes,
        rutinas_asignadas_hoy: stats.rutinas_asignadas_hoy,
        ingresos_mes_actual: parseFloat(stats.ingresos_mes_actual),
        total_notificaciones_pendientes: stats.total_notificaciones_pendientes
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas del gimnasio"
    });
  }
};

// Obtener miembros pendientes (solo admin/entrenador)
exports.getPendingMembers = async (req, res) => {
  try {
    const pendingMembers = await memberService.getPendingMembers();
    
    res.json({
      success: true,
      data: pendingMembers.map(member => ({
        id_miembro: member.id_miembro,
        nombre_completo: `${member.nombre} ${member.apellido1}${
          member.apellido2 ? ' ' + member.apellido2 : ''
        }`,
        correo: member.correo,
        cedula: member.cedula,
        fecha_inscripcion: member.fecha_inscripcion,
        credenciales: {
          usuario: member.usuario,
          contrasenia: member.contrasenia
        }
      }))
    });
  } catch (error) {
    console.error('Error al obtener miembros pendientes:', error);
    res.status(500).json({
      success: false,
      message: "Error al obtener miembros pendientes"
    });
  }
};

// Obtener historial de rutinas de un miembro
exports.getMemberRoutines = async (req, res) => {
  try {
    const { id } = req.params;
    const routines = await memberService.getMemberRoutineHistory(id);
    
    res.json({
      success: true,
      data: routines
    });
  } catch (error) {
    console.error('Error al obtener rutinas del miembro:', error);
    res.status(500).json({
      success: false,
      message: "Error al obtener historial de rutinas"
    });
  }
};