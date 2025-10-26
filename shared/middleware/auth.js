const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado, token no proporcionado' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Token no válido' });
  }
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    if (!allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({ message: `Acceso denegado. Se requiere rol: ${allowedRoles.join(' o ')}` });
    }

    next();
  };
}

const requireAdmin = requireRole('admin');
const requireTrainer = requireRole('entrenador', 'admin');
const requireMember = requireRole('miembro', 'entrenador', 'admin');

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireTrainer,
  requireMember,
};
