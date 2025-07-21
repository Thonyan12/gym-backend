const db = require('../config/db');

// Registrar asistencia
exports.create = async ({ id_miembro, horario, fecha_asistencia }) => {
    const result = await db.query(
        `INSERT INTO Registro_de_clases (id_miembro, horario, fecha_asistencia)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [id_miembro, horario, fecha_asistencia]
    );
    return result.rows[0];
};

// Listar historial de asistencia (puedes filtrar por miembro)
exports.findAll = async (id_miembro = null) => {
    let result;
    if (id_miembro) {
        result = await db.query(
            `SELECT * FROM Registro_de_clases WHERE id_miembro = $1 ORDER BY fecha_asistencia DESC`,
            [id_miembro]
        );
    } else {
        result = await db.query(
            `SELECT * FROM Registro_de_clases ORDER BY fecha_asistencia DESC`
        );
    }
    return result.rows;
};