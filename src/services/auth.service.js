const db = require("../config/db");

// Login unificado para TODOS (admin, entrenador, miembro)
exports.findUserByCredentials = async (usuario, email) => {
  const result = await db.query(`
    SELECT 
      u.id_usuario,
      u.usuario,
      u.contrasenia,
      u.rol,
      u.id_coach,
      u.id_miembro,
      u.estado,
      CASE 
        WHEN u.rol = 'miembro' AND u.id_miembro IS NOT NULL THEN 
          (SELECT m.correo FROM Miembro m WHERE m.id_miembro = u.id_miembro)
        WHEN u.rol = 'entrenador' AND u.id_coach IS NOT NULL THEN 
          (SELECT e.telefono FROM Entrenador e WHERE e.id_entrenador = u.id_coach)
        ELSE NULL
      END as email_real
    FROM Usuario u
    WHERE (u.usuario = $1 OR u.usuario = $2) AND u.estado = true
  `, [usuario, email]);
  
  return result.rows[0];
};

// Crear miembro Y su usuario
exports.createMemberWithUser = async (memberData) => {
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');
    
    // 1. Crear miembro
    const memberResult = await client.query(`
      INSERT INTO Miembro (
        cedula, nombre, apellido1, apellido2, edad, direccion,
        altura, peso, contextura, objetivo, sexo, correo
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `, [
      memberData.cedula, memberData.nombre, memberData.apellido1, 
      memberData.apellido2, memberData.edad, memberData.direccion,
      memberData.altura, memberData.peso, memberData.contextura, 
      memberData.objetivo, memberData.sexo, memberData.correo
    ]);
    
    const newMember = memberResult.rows[0];
    
    // 2. Crear usuario para el miembro
    const userResult = await client.query(`
      INSERT INTO Usuario (usuario, contrasenia, rol, id_miembro)
      VALUES ($1, $2, 'miembro', $3)
      RETURNING *
    `, [memberData.correo, memberData.contrasenia, newMember.id_miembro]);
    
    await client.query('COMMIT');
    
    return {
      member: newMember,
      user: userResult.rows[0]
    };
    
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Obtener detalles completos del usuario
exports.getUserWithDetails = async (userId) => {
  const result = await db.query(`
    SELECT 
      u.id_usuario,
      u.usuario,
      u.rol,
      u.estado,
      CASE 
        WHEN u.rol = 'miembro' AND u.id_miembro IS NOT NULL THEN 
          (SELECT m.nombre || ' ' || m.apellido1 FROM Miembro m WHERE m.id_miembro = u.id_miembro)
        WHEN u.rol = 'entrenador' AND u.id_coach IS NOT NULL THEN 
          (SELECT e.nombre || ' ' || e.apellido FROM Entrenador e WHERE e.id_entrenador = u.id_coach)
        ELSE 'Administrador'
      END as nombre_completo,
      CASE 
        WHEN u.rol = 'miembro' AND u.id_miembro IS NOT NULL THEN 
          (SELECT m.correo FROM Miembro m WHERE m.id_miembro = u.id_miembro)
        ELSE NULL
      END as email
    FROM Usuario u
    WHERE u.id_usuario = $1 AND u.estado = true
  `, [userId]);
  
  return result.rows[0];
};