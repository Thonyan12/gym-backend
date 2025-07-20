const db = require('../config/db');

const AsignacionRutina = {
    // Obtener rutinas asignadas a un miembro específico
    getByMiembro: async (id_miembro) => {
        const query = `
            SELECT 
                ar.id_asignacion,
                ar.id_miembro,
                ar.id_rutina,
                ar.descripcion_rut as descripcion_asignacion,
                ar.fecha_inicio,
                ar.estado as estado_asignacion,
                ar.f_registro,
                r.nivel,
                r.tipo_rut,
                r.descripcion_rut,
                r.duracion_rut,
                m.nombre,
                m.apellido1,
                m.apellido2
            FROM Asignacion_rutina ar
            INNER JOIN Rutina r ON ar.id_rutina = r.id_rutina
            INNER JOIN Miembro m ON ar.id_miembro = m.id_miembro
            WHERE ar.id_miembro = $1 AND ar.estado = true AND r.estado = true
            ORDER BY ar.fecha_inicio DESC
        `;
        const result = await db.query(query, [id_miembro]);
        return result.rows;
    },

    // Obtener todas las asignaciones de rutinas
    getAll: async () => {
        const query = `
            SELECT 
                ar.id_asignacion,
                ar.id_miembro,
                ar.id_rutina,
                ar.descripcion_rut as descripcion_asignacion,
                ar.fecha_inicio,
                ar.estado as estado_asignacion,
                ar.f_registro,
                r.nivel,
                r.tipo_rut,
                r.descripcion_rut,
                r.duracion_rut,
                m.nombre,
                m.apellido1,
                m.apellido2,
                m.cedula
            FROM Asignacion_rutina ar
            INNER JOIN Rutina r ON ar.id_rutina = r.id_rutina
            INNER JOIN Miembro m ON ar.id_miembro = m.id_miembro
            WHERE ar.estado = true AND r.estado = true
            ORDER BY ar.fecha_inicio DESC
        `;
        const result = await db.query(query);
        return result.rows;
    },

    // Crear nueva asignación de rutina
    create: async (asignacionData) => {
        const { id_miembro, id_rutina, descripcion_rut, fecha_inicio } = asignacionData;
        const query = `
            INSERT INTO Asignacion_rutina (id_miembro, id_rutina, descripcion_rut, fecha_inicio, estado, f_registro)
            VALUES ($1, $2, $3, $4, true, CURRENT_DATE)
            RETURNING *
        `;
        const result = await db.query(query, [id_miembro, id_rutina, descripcion_rut, fecha_inicio]);
        return result.rows[0];
    },

    // Obtener asignación por ID
    getById: async (id_asignacion) => {
        const query = `
            SELECT 
                ar.id_asignacion,
                ar.id_miembro,
                ar.id_rutina,
                ar.descripcion_rut as descripcion_asignacion,
                ar.fecha_inicio,
                ar.estado as estado_asignacion,
                ar.f_registro,
                r.nivel,
                r.tipo_rut,
                r.descripcion_rut,
                r.duracion_rut,
                m.nombre,
                m.apellido1,
                m.apellido2
            FROM Asignacion_rutina ar
            INNER JOIN Rutina r ON ar.id_rutina = r.id_rutina
            INNER JOIN Miembro m ON ar.id_miembro = m.id_miembro
            WHERE ar.id_asignacion = $1 AND ar.estado = true
        `;
        const result = await db.query(query, [id_asignacion]);
        return result.rows[0];
    },

    // Actualizar asignación de rutina
    update: async (id_asignacion, asignacionData) => {
        const { id_rutina, descripcion_rut, fecha_inicio } = asignacionData;
        const query = `
            UPDATE Asignacion_rutina 
            SET id_rutina = $1, descripcion_rut = $2, fecha_inicio = $3
            WHERE id_asignacion = $4 AND estado = true
            RETURNING *
        `;
        const result = await db.query(query, [id_rutina, descripcion_rut, fecha_inicio, id_asignacion]);
        return result.rows[0];
    },

    // Eliminar asignación (soft delete)
    delete: async (id_asignacion) => {
        const query = `
            UPDATE Asignacion_rutina 
            SET estado = false 
            WHERE id_asignacion = $1
            RETURNING *
        `;
        const result = await db.query(query, [id_asignacion]);
        return result.rows[0];
    },

    // Verificar si ya existe una asignación activa para un miembro
    checkExistingAssignment: async (id_miembro, id_rutina) => {
        const query = `
            SELECT id_asignacion 
            FROM Asignacion_rutina 
            WHERE id_miembro = $1 AND id_rutina = $2 AND estado = true
        `;
        const result = await db.query(query, [id_miembro, id_rutina]);
        return result.rows.length > 0;
    }
};

module.exports = AsignacionRutina;
