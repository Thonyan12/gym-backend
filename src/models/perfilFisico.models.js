const db = require('../config/db');

// Crear nuevo perfil físico (trigger automático asigna rutinas)
exports.create = async (perfilData) => {
    const { id_miembro, altura, peso, observaciones } = perfilData;

    const result = await db.query(
        `INSERT INTO Perfil_fisico (id_miembro, altura, peso, observaciones)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [id_miembro, altura, peso, observaciones]
    );
    return result.rows[0];
};

// Obtener perfil físico actual del miembro (más reciente)
exports.findCurrentByMemberId = async (id_miembro) => {
    const result = await db.query(
        `SELECT *,
            ROUND((peso / ((altura / 100.0) * (altura / 100.0))), 2) as imc_calculado,
            CASE 
                WHEN (peso / ((altura / 100.0) * (altura / 100.0))) < 18.5 THEN 'Bajo peso'
                WHEN (peso / ((altura / 100.0) * (altura / 100.0))) BETWEEN 18.5 AND 24.9 THEN 'Peso normal'
                WHEN (peso / ((altura / 100.0) * (altura / 100.0))) BETWEEN 25.0 AND 29.9 THEN 'Sobrepeso'
                ELSE 'Obesidad'
            END as categoria_imc
         FROM obtener_perfil_fisico_actual($1)`,
        [id_miembro]
    );
    return result.rows[0];
};

// Obtener historial completo de perfiles físicos del miembro
exports.findHistoryByMemberId = async (id_miembro) => {
    const result = await db.query(
        `SELECT pf.*,
                ROUND((pf.peso / ((pf.altura / 100.0) * (pf.altura / 100.0))), 2) as imc_calculado,
                CASE 
                    WHEN (pf.peso / ((pf.altura / 100.0) * (pf.altura / 100.0))) < 18.5 THEN 'Bajo peso'
                    WHEN (pf.peso / ((pf.altura / 100.0) * (pf.altura / 100.0))) BETWEEN 18.5 AND 24.9 THEN 'Peso normal'
                    WHEN (pf.peso / ((pf.altura / 100.0) * (pf.altura / 100.0))) BETWEEN 25.0 AND 29.9 THEN 'Sobrepeso'
                    ELSE 'Obesidad'
                END as categoria_imc,
                -- Calcular diferencia con el registro anterior
                LAG(pf.peso) OVER (ORDER BY pf.fecha_registro) as peso_anterior,
                ROUND(pf.peso - LAG(pf.peso) OVER (ORDER BY pf.fecha_registro), 2) as diferencia_peso
         FROM Perfil_fisico pf
         WHERE pf.id_miembro = $1 AND pf.estado = TRUE
         ORDER BY pf.fecha_registro DESC`,
        [id_miembro]
    );
    return result.rows;
};

// Obtener perfil completo (miembro + físico + rutinas)
exports.findCompleteProfile = async (id_miembro) => {
    const result = await db.query(
        `SELECT 
            -- Datos del miembro
            m.id_miembro, m.cedula, m.nombre, m.apellido1, m.apellido2,
            m.edad, m.direccion, m.contextura, m.objetivo, m.sexo,
            m.fecha_inscripcion, m.estado as miembro_estado, m.correo,
            
            -- Perfil físico actual
            pf.id_perfil, pf.altura, pf.peso, pf.observaciones,
            pf.fecha_registro as fecha_perfil,
            ROUND((pf.peso / ((pf.altura / 100.0) * (pf.altura / 100.0))), 2) as imc_actual,
            CASE 
                WHEN (pf.peso / ((pf.altura / 100.0) * (pf.altura / 100.0))) < 18.5 THEN 'Bajo peso'
                WHEN (pf.peso / ((pf.altura / 100.0) * (pf.altura / 100.0))) BETWEEN 18.5 AND 24.9 THEN 'Peso normal'
                WHEN (pf.peso / ((pf.altura / 100.0) * (pf.altura / 100.0))) BETWEEN 25.0 AND 29.9 THEN 'Sobrepeso'
                ELSE 'Obesidad'
            END as categoria_imc,
            
            -- Rutina actual
            ar.id_asignacion, ar.descripcion_rut, ar.fecha_inicio as rutina_fecha_inicio,
            r.id_rutina, r.nivel, r.tipo_rut, r.descripcion_rut as rutina_descripcion,
            r.duracion_rut
            
         FROM Miembro m
         LEFT JOIN Perfil_fisico pf ON m.id_miembro = pf.id_miembro 
            AND pf.fecha_registro = (
                SELECT MAX(fecha_registro) 
                FROM Perfil_fisico 
                WHERE id_miembro = m.id_miembro AND estado = TRUE
            )
         LEFT JOIN Asignacion_rutina ar ON m.id_miembro = ar.id_miembro 
            AND ar.estado = TRUE
            AND ar.fecha_inicio = (
                SELECT MAX(fecha_inicio)
                FROM Asignacion_rutina
                WHERE id_miembro = m.id_miembro AND estado = TRUE
            )
         LEFT JOIN Rutina r ON ar.id_rutina = r.id_rutina
         WHERE m.id_miembro = $1 AND m.estado = TRUE`,
        [id_miembro]
    );
    return result.rows[0];
};

// Obtener historial de rutinas usando la función de PostgreSQL
exports.findRoutineHistory = async (id_miembro) => {
    const result = await db.query(`
        SELECT 
            ar.id_asignacion,
            ar.fecha_inicio,
            ar.estado,
            ar.descripcion_rut,
            r.id_rutina,
            r.nivel,
            r.tipo_rut,
            r.descripcion_rut AS rutina_descripcion,
            r.duracion_rut
        FROM asignacion_rutina ar
        INNER JOIN rutina r ON ar.id_rutina = r.id_rutina
        WHERE ar.id_miembro = $1
        ORDER BY ar.f_registro DESC, ar.fecha_inicio DESC
    `, [id_miembro]);
    return result.rows;
};

// Verificar si existe perfil físico para el miembro
exports.existsByMemberId = async (id_miembro) => {
    const result = await db.query(
        `SELECT COUNT(*) as total 
         FROM Perfil_fisico 
         WHERE id_miembro = $1 AND estado = TRUE`,
        [id_miembro]
    );
    return parseInt(result.rows[0].total) > 0;
};

// Obtener estadísticas del perfil físico del miembro
exports.getProfileStats = async (id_miembro) => {
    const result = await db.query(
        `SELECT 
            COUNT(*) as total_registros,
            MIN(peso) as peso_minimo,
            MAX(peso) as peso_maximo,
            ROUND(AVG(peso), 2) as peso_promedio,
            MIN(altura) as altura_minima,
            MAX(altura) as altura_maxima,
            ROUND(AVG(altura), 2) as altura_promedio,
            MIN(fecha_registro) as primer_registro,
            MAX(fecha_registro) as ultimo_registro
         FROM Perfil_fisico 
         WHERE id_miembro = $1 AND estado = TRUE`,
        [id_miembro]
    );
    return result.rows[0];
};

// Obtener evolución del IMC del miembro
exports.getIMCEvolution = async (id_miembro) => {
    const result = await db.query(
        `SELECT 
            id_perfil,
            altura,
            peso,
            ROUND((peso / ((altura / 100.0) * (altura / 100.0))), 2) as imc,
            CASE 
                WHEN (peso / ((altura / 100.0) * (altura / 100.0))) < 18.5 THEN 'Bajo peso'
                WHEN (peso / ((altura / 100.0) * (altura / 100.0))) BETWEEN 18.5 AND 24.9 THEN 'Peso normal'
                WHEN (peso / ((altura / 100.0) * (altura / 100.0))) BETWEEN 25.0 AND 29.9 THEN 'Sobrepeso'
                ELSE 'Obesidad'
            END as categoria,
            fecha_registro,
            observaciones
         FROM Perfil_fisico 
         WHERE id_miembro = $1 AND estado = TRUE
         ORDER BY fecha_registro ASC`,
        [id_miembro]
    );
    return result.rows;
};
