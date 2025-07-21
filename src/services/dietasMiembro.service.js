const model = require('../models/dietasMiembro.models');

// Obtener todas las dietas del miembro
exports.getDietasByMember = async (memberId) => {
  return await model.findDietasByMember(memberId);
};

// Obtener una dieta específica con sus comidas
exports.getDietaWithComidas = async (dietaId, memberId) => {
  const dieta = await model.findDietaByIdAndMember(dietaId, memberId);
  if (!dieta) {
    throw new Error(`Dieta con id ${dietaId} no encontrada o no autorizada`);
  }
  
  const comidas = await model.findComidasByDieta(dietaId, memberId);
  
  return {
    dieta,
    comidas
  };
};

// Obtener todas las comidas del miembro organizadas por dieta
exports.getAllComidasByMember = async (memberId) => {
  const comidas = await model.findComidasByMember(memberId);
  
  // Organizar comidas por dieta
  const comidasPorDieta = {};
  comidas.forEach(comida => {
    const dietaKey = `${comida.id_dieta}_${comida.dieta_nombre}`;
    if (!comidasPorDieta[dietaKey]) {
      comidasPorDieta[dietaKey] = {
        id_dieta: comida.id_dieta,
        dieta_nombre: comida.dieta_nombre,
        dieta_objetivo: comida.dieta_objetivo,
        rutina_tipo: comida.rutina_tipo,
        rutina_nivel: comida.rutina_nivel,
        comidas: []
      };
    }
    comidasPorDieta[dietaKey].comidas.push({
      id_comida: comida.id_comida,
      nombre: comida.nombre,
      tipo: comida.tipo,
      hora_recomendada: comida.hora_recomendada,
      descripcion: comida.descripcion
    });
  });
  
  return Object.values(comidasPorDieta);
};

// Obtener plan nutricional completo del miembro
exports.getPlanNutricionalCompleto = async (memberId) => {
  const dietas = await model.findDietasByMember(memberId);
  const todasLasComidas = await model.findComidasByMember(memberId);
  
  const planCompleto = dietas.map(dieta => {
    const comidasDieta = todasLasComidas.filter(c => c.id_dieta === dieta.id_dieta);
    return {
      ...dieta,
      total_comidas: comidasDieta.length,
      comidas: comidasDieta.sort((a, b) => a.hora_recomendada.localeCompare(b.hora_recomendada))
    };
  });
  
  return planCompleto;
};