const db = require('../config/db');

// Obtener miembros asignados al entrenador
exports.getMisMiembros = async (id_entrenador) => {
    const result = await db.query(
        `SELECT m.*
     FROM Asignacion_entrenador ae
     INNER JOIN Miembro m ON ae.id_miembro = m.id_miembro
     WHERE ae.id_entrenador = $1 AND ae.estado = TRUE AND m.estado = TRUE
     ORDER BY m.nombre, m.apellido1, m.apellido2`,
        [id_entrenador]
    );
    return result.rows;
};

// Obtener perfil del entrenador
exports.getPerfil = async (id_entrenador) => {
    const result = await db.query(
        `SELECT *
     FROM Entrenador
     WHERE id_entrenador = $1 AND estado = TRUE`,
        [id_entrenador]
    );
    return result.rows[0];
};