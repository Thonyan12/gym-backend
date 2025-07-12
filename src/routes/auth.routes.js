const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { authenticateToken } = require("../middleware/auth");

// LOGIN UNIFICADO (para todos: admin, entrenador, miembro)
router.post("/login", authController.login);

// REGISTRO (solo para miembros nuevos)
router.post("/register", authController.memberRegister);

// VERIFICAR TOKEN
router.get("/verify", authenticateToken, authController.verifyToken);

module.exports = router;