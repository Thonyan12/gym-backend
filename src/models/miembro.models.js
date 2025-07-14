const db = require('../config/db');

// Crear miembro
exports.create = async (miembro) => {
    const {
        cedula, nombre, apellido1, apellido2, edad, direccion,
        altura, peso, contextura, objetivo, sexo, correo
    } = miembro;

    const result = await db.query(
        `INSERT INTO miembro (cedula, nombre, apellido1, apellido2, edad, direccion, altura, peso, contextura, objetivo, sexo, correo)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     RETURNING *`,
        [cedula, nombre, apellido1, apellido2, edad, direccion, altura, peso, contextura, objetivo, sexo, correo]
    );
    return result.rows[0];
};


// Obtener todos los miembros
exports.findALL = async () => {
    const result = await db.query("SELECT * FROM miembro");
    return result.rows;
};

// Obtener miembro por ID
exports.find = async (id) => {
    const result = await db.query(
        "SELECT * FROM miembro WHERE id_miembro = $1",
        [id]
    );
    return result.rows[0];
};

// Actualizar miembro
exports.update = async (id, miembro) => {
    const {
        cedula, nombre, apellido1, apellido2, edad, direccion,
        altura, peso, contextura, objetivo, sexo, fecha_inscripcion,
        estado, correo
    } = miembro;

    const result = await db.query(
        `UPDATE miembro 
        SET cedula = $1, nombre = $2, apellido1 = $3, apellido2 = $4, 
            edad = $5, direccion = $6, altura = $7, peso = $8, 
            contextura = $9, objetivo = $10, sexo = $11, 
            fecha_inscripcion = $12, estado = $13, correo = $14
        WHERE id_miembro = $15
        RETURNING *`,
        [cedula, nombre, apellido1, apellido2, edad, direccion, altura, peso, contextura, objetivo, sexo, fecha_inscripcion, estado, correo, id]
    );
    return result.rows[0];
};

// Eliminar miembro
exports.remove = async (id) => {
    await db.query("DELETE FROM miembro WHERE id_miembro = $1", [id]);
    return { message: "Miembro eliminado" };
};