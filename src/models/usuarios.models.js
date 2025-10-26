const db = require('../config/db');

exports.findALL = async () => {
    const result = await db.query(`
        SELECT 
            u.id_usuario,
            u.usuario,
            u.rol,
            u.estado,
            u.fecha_registro,
            u.id_coach,
            u.id_miembro,
            CASE 
                WHEN u.rol = 'miembro' THEN CONCAT(m.nombre, ' ', m.apellido1, ' ', COALESCE(m.apellido2, ''))
                WHEN u.rol = 'entrenador' THEN CONCAT(e.nombre, ' ', COALESCE(e.apellido, ''))
                ELSE u.usuario
            END as nombre_completo
        FROM usuario u
        LEFT JOIN miembro m ON u.id_miembro = m.id_miembro
        LEFT JOIN entrenador e ON u.id_coach = e.id_entrenador
        WHERE u.estado = TRUE
        ORDER BY u.rol, nombre_completo
    `);
    return result.rows;
};

exports.find = async (id) => {
    const result = await db.query(
        "SELECT * FROM usuario WHERE id_usuario = $1",
        [id]
    );
    return result.rows[0];
};

exports.create = async (usuario) => {
    const { usuario: nombreUsuario, contrasenia, rol, id_coach, id_miembro, estado } = usuario;
    const result = await db.query(
        `INSERT INTO usuario (usuario, contrasenia, rol, id_coach, id_miembro, estado)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
        [nombreUsuario, contrasenia, rol, id_coach, id_miembro, estado]
    );
    return result.rows[0];
};

exports.update = async (id, usuario) => {
    const { usuario: nombreUsuario, contrasenia, rol, id_coach, id_miembro, estado } = usuario;
    const result = await db.query(
        `UPDATE usuario 
     SET usuario = $1, contrasenia = $2, rol = $3, id_coach = $4, id_miembro = $5, estado = $6
     WHERE id_usuario = $7
     RETURNING *`,
        [nombreUsuario, contrasenia, rol, id_coach, id_miembro, estado, id]
    );
    return result.rows[0];
};

exports.remove = async (id) => {
    await db.query("DELETE FROM usuario WHERE id_usuario = $1", [id]);
    return { message: "Usuario eliminado" };
};