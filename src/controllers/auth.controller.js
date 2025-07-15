const jwt = require("jsonwebtoken");
const authService = require("../services/auth.service");

// LOGIN UNIFICADO para todos (admin, entrenador, miembro)
exports.login = async (req, res) => {
  try {
    const { usuario, contrasenia } = req.body;

    // Buscar usuario (puede ser username o email)
    const user = await authService.findUserByCredentials(usuario, usuario);
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Verificar contraseña (simple por ahora)
    if (contrasenia !== user.contrasenia) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Obtener detalles completos
    const userDetails = await authService.getUserWithDetails(user.id_usuario);

    // Crear token JWT para TODOS
    const token = jwt.sign(
      {
        id: user.id_usuario,
        usuario: user.usuario,
        rol: user.rol,
        id_miembro: user.id_miembro,
        id_coach: user.id_coach,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id_usuario,
        usuario: user.usuario,
        rol: user.rol,
        nombre_completo: userDetails.nombre_completo,
        email: userDetails.email,
      },
      redirectTo: getDashboardRoute(user.rol),
    });
  } catch (error) {
    res.status(500).json({ message: "Error en login", error: error.message });
  }
};

// REGISTRO PARA MIEMBROS (crea miembro + usuario)
exports.memberRegister = async (req, res) => {
  try {
    const memberData = req.body;

    // Crear miembro Y usuario
    const result = await authService.createMemberWithUser(memberData);

    res.status(201).json({
      message: "Miembro registrado exitosamente",
      member: {
        id: result.member.id_miembro,
        nombre: `${result.member.nombre} ${result.member.apellido1}`,
        email: result.member.correo,
        usuario: result.user.usuario,
      },
      instructions: "Ya puedes hacer login con tu email y contraseña",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al registrar", error: error.message });
  }
};
function getDashboardRoute(rol) {
  switch (rol) {
    case "admin":
      return "/admin/dashboard"; 
    case "entrenador":
      return "/entrenadores/dashboard";
    case "miembro":
      return "/miembros/dashboard"; 
    default:
      return "/login";
  }
}

exports.verifyToken = async (req, res) => {
  try {
    const userDetails = await authService.getUserWithDetails(req.user.id);
    res.json({
      message: "Token válido",
      user: userDetails,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al verificar token", error: error.message });
  }
};
