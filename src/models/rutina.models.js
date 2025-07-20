const db = require('../config/db');

const Rutina = {
    // Obtener todas las rutinas activas
    getAll: async () => {
        const query = `
            SELECT 
                id_rutina,
                nivel,
                tipo_rut,
                descripcion_rut,
                duracion_rut,
                estado,
                f_registro
            FROM Rutina 
            WHERE estado = true 
            ORDER BY f_registro DESC
        `;
        const result = await db.query(query);
        return result.rows;
    },

    // Obtener rutina por ID
    getById: async (id_rutina) => {
        const query = `
            SELECT 
                id_rutina,
                nivel,
                tipo_rut,
                descripcion_rut,
                duracion_rut,
                estado,
                f_registro
            FROM Rutina 
            WHERE id_rutina = $1 AND estado = true
        `;
        const result = await db.query(query, [id_rutina]);
        return result.rows[0];
    },

    // Crear nueva rutina
    create: async (rutinaData) => {
        const { nivel, tipo_rut, descripcion_rut, duracion_rut } = rutinaData;
        const query = `
            INSERT INTO Rutina (nivel, tipo_rut, descripcion_rut, duracion_rut, estado, f_registro)
            VALUES ($1, $2, $3, $4, true, CURRENT_DATE)
            RETURNING *
        `;
        const result = await db.query(query, [nivel, tipo_rut, descripcion_rut, duracion_rut]);
        return result.rows[0];
    },

    // Actualizar rutina
    update: async (id_rutina, rutinaData) => {
        const { nivel, tipo_rut, descripcion_rut, duracion_rut } = rutinaData;
        const query = `
            UPDATE Rutina 
            SET nivel = $1, tipo_rut = $2, descripcion_rut = $3, duracion_rut = $4
            WHERE id_rutina = $5 AND estado = true
            RETURNING *
        `;
        const result = await db.query(query, [nivel, tipo_rut, descripcion_rut, duracion_rut, id_rutina]);
        return result.rows[0];
    },

    // Eliminar rutina (soft delete)
    delete: async (id_rutina) => {
        const query = `
            UPDATE Rutina 
            SET estado = false 
            WHERE id_rutina = $1
            RETURNING *
        `;
        const result = await db.query(query, [id_rutina]);
        return result.rows[0];
    }
};

module.exports = Rutina;
