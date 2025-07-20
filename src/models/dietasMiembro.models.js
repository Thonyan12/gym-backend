const db = require('../config/db');

// Obtener todas las dietas de un miembro basadas en sus rutinas asignadas
exports.findDietasByMember = async (memberId) => {
  const result = await db.query(
    `SELECT DISTINCT
       d.id_dieta,
       d.nombre,
       d.objetivo,
       d.descripcion,
       d.duracion_dias,
       d.f_registro,
       r.id_rutina,
       r.nivel,
       r.tipo_rut,
       r.descripcion_rut as rutina_descripcion,
       r.duracion_rut,
       ar.fecha_inicio as rutina_fecha_inicio,
       ar.descripcion_rut as asignacion_descripcion
     FROM Dieta d
     INNER JOIN Rutina r ON d.id_rutina = r.id_rutina
     INNER JOIN Asignacion_rutina ar ON r.id_rutina = ar.id_rutina
     WHERE ar.id_miembro = $1 
       AND ar.estado = TRUE 
       AND d.estado = TRUE 
       AND r.estado = TRUE
     ORDER BY ar.fecha_inicio DESC, d.f_registro DESC`,
    [memberId]
  );
  return result.rows;
};

// Obtener una dieta específica por ID (verificando que pertenezca al miembro)
exports.findDietaByIdAndMember = async (dietaId, memberId) => {
  const result = await db.query(
    `SELECT 
       d.id_dieta,
       d.nombre,
       d.objetivo,
       d.descripcion,
       d.duracion_dias,
       d.f_registro,
       r.id_rutina,
       r.nivel,
       r.tipo_rut,
       r.descripcion_rut as rutina_descripcion,
       r.duracion_rut,
       ar.fecha_inicio as rutina_fecha_inicio,
       ar.descripcion_rut as asignacion_descripcion
     FROM Dieta d
     INNER JOIN Rutina r ON d.id_rutina = r.id_rutina
     INNER JOIN Asignacion_rutina ar ON r.id_rutina = ar.id_rutina
     WHERE d.id_dieta = $1 
       AND ar.id_miembro = $2
       AND ar.estado = TRUE 
       AND d.estado = TRUE 
       AND r.estado = TRUE`,
    [dietaId, memberId]
  );
  return result.rows[0];
};

// Obtener todas las comidas de las dietas del miembro
exports.findComidasByMember = async (memberId) => {
  const result = await db.query(
    `SELECT 
       c.id_comida,
       c.id_dieta,
       c.nombre,
       c.tipo,
       c.hora_recomendada,
       c.descripcion,
       c.f_registro,
       d.nombre as dieta_nombre,
       d.objetivo as dieta_objetivo,
       r.tipo_rut as rutina_tipo,
       r.nivel as rutina_nivel
     FROM Comida c
     INNER JOIN Dieta d ON c.id_dieta = d.id_dieta
     INNER JOIN Rutina r ON d.id_rutina = r.id_rutina
     INNER JOIN Asignacion_rutina ar ON r.id_rutina = ar.id_rutina
     WHERE ar.id_miembro = $1 
       AND ar.estado = TRUE 
       AND c.estado = TRUE 
       AND d.estado = TRUE 
       AND r.estado = TRUE
     ORDER BY c.hora_recomendada ASC, d.nombre ASC`,
    [memberId]
  );
  return result.rows;
};

// Obtener comidas de una dieta específica
exports.findComidasByDieta = async (dietaId, memberId) => {
  const result = await db.query(
    `SELECT 
       c.id_comida,
       c.id_dieta,
       c.nombre,
       c.tipo,
       c.hora_recomendada,
       c.descripcion,
       c.f_registro
     FROM Comida c
     INNER JOIN Dieta d ON c.id_dieta = d.id_dieta
     INNER JOIN Rutina r ON d.id_rutina = r.id_rutina
     INNER JOIN Asignacion_rutina ar ON r.id_rutina = ar.id_rutina
     WHERE c.id_dieta = $1 
       AND ar.id_miembro = $2
       AND ar.estado = TRUE 
       AND c.estado = TRUE 
       AND d.estado = TRUE 
       AND r.estado = TRUE
     ORDER BY c.hora_recomendada ASC`,
    [dietaId, memberId]
  );
  return result.rows;
};