const db = require("../config/db");

// Registrar nuevo miembro (activará triggers automáticos)
exports.registerMember = async (memberData) => {
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');
    
    
    const existingMember = await client.query(`
      SELECT id_miembro, cedula, correo 
      FROM Miembro 
      WHERE cedula = $1 OR correo = $2
    `, [memberData.cedula, memberData.correo]);
    
    if (existingMember.rows.length > 0) {
      const existing = existingMember.rows[0];
      if (existing.cedula === memberData.cedula) {
        throw new Error('CEDULA_DUPLICADA');
      }
      if (existing.correo === memberData.correo) {
        throw new Error('CORREO_DUPLICADO');
      }
    }
    
    
    const result = await client.query(`
      INSERT INTO Miembro (
        cedula, nombre, apellido1, apellido2, edad, direccion,
        altura, peso, contextura, objetivo, sexo, correo, estado
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, FALSE)
      RETURNING *
    `, [
      memberData.cedula,
      memberData.nombre,
      memberData.apellido1,
      memberData.apellido2 || null,
      memberData.edad,
      memberData.direccion,
      memberData.altura,
      memberData.peso,
      memberData.contextura,
      memberData.objetivo,
      memberData.sexo,
      memberData.correo
    ]);
    
    const newMember = result.rows[0];
    
    
    const userResult = await client.query(`
      SELECT usuario, contrasenia 
      FROM Usuario 
      WHERE id_miembro = $1
    `, [newMember.id_miembro]);
    
    await client.query('COMMIT');
    
    return {
      member: newMember,
      credentials: userResult.rows[0]
    };
    
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};


exports.getGymStats = async () => {
  const result = await db.query('SELECT * FROM obtener_estadisticas_gimnasio()');
  return result.rows[0];
};


exports.getPendingMembers = async () => {
  const result = await db.query(`
    SELECT 
      m.id_miembro,
      m.nombre,
      m.apellido1,
      m.apellido2,
      m.correo,
      m.cedula,
      m.fecha_inscripcion,
      u.usuario,
      u.contrasenia
    FROM Miembro m
    INNER JOIN Usuario u ON m.id_miembro = u.id_miembro
    WHERE m.estado = FALSE
    ORDER BY m.fecha_inscripcion DESC
  `);
  return result.rows;
};


exports.getMemberRoutineHistory = async (memberId) => {
  const result = await db.query(
    'SELECT * FROM obtener_historial_rutinas_miembro($1)',
    [memberId]
  );
  return result.rows;
};