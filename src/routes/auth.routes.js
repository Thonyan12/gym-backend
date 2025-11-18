const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { authenticateToken } = require("../middleware/auth");
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarios.models');
const Miembro = require('../models/miembro.models');
const CodigoVerificacion = require('../models/codigoVerificacion.model');
const { generarCodigoVerificacion, enviarCodigoVerificacion } = require('../services/emailService');

// LOGIN UNIFICADO (para todos: admin, entrenador, miembro) - LEGACY
router.post("/login", authController.login);

// REGISTRO (solo para miembros nuevos) - LEGACY
router.post("/register", authController.memberRegister);

// VERIFICAR TOKEN
router.get("/verify", authenticateToken, authController.verifyToken);

// ============================================
// NUEVAS RUTAS 2FA
// ============================================

// 1️⃣ REGISTRO - Enviar código de verificación
router.post('/registro/enviar-codigo', async (req, res) => {
    const { correo } = req.body;
    
    try {
        const emailExiste = await Usuario.emailExiste(correo);
        
        if (emailExiste) {
            return res.status(400).json({ 
                success: false, 
                message: 'Este correo ya está registrado' 
            });
        }

        const codigo = generarCodigoVerificacion();
        await CodigoVerificacion.create(correo, codigo, 'registro');
        await enviarCodigoVerificacion(correo, codigo, 'registro');

        res.json({ 
            success: true, 
            message: 'Código enviado a tu correo' 
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al enviar el código' 
        });
    }
});

// 2️⃣ REGISTRO - Verificar código y crear usuario
router.post('/registro/verificar', async (req, res) => {
    const { correo, codigo, ...datosMiembro } = req.body;
    
    try {
        const codigoValido = await CodigoVerificacion.verify(correo, codigo, 'registro');

        if (!codigoValido) {
            return res.status(400).json({ 
                success: false, 
                message: 'Código inválido o expirado' 
            });
        }

        // Crear miembro (el trigger crea automáticamente el usuario)
        // El trigger genera contraseña como: apellido1 + '123'
        const nuevoMiembro = await Miembro.create({
            ...datosMiembro,
            correo
        });

        // Marcar código como usado
        await CodigoVerificacion.markAsUsed(codigoValido.id);

        // Obtener el usuario creado por el trigger
        const usuario = await Usuario.findByEmail(correo);
        
        // Generar contraseña temporal (mismo formato que el trigger)
        const contraseniaTemp = datosMiembro.apellido1 + '123';

        res.json({
            success: true,
            message: 'Registro exitoso',
            data: {
                id_usuario: usuario.id_usuario,
                id_miembro: nuevoMiembro.id_miembro,
                email: correo,
                credenciales: {
                    usuario: correo,
                    contrasenia: contraseniaTemp
                }
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al completar el registro' 
        });
    }
});

// 3️⃣ LOGIN - Validar y enviar código 2FA
router.post('/login/validar', async (req, res) => {
    const { email, contrasenia } = req.body;
    
    try {
        // Buscar usuario por email (usuario.usuario ES el email)
        const user = await Usuario.findByEmail(email);

        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Credenciales inválidas' 
            });
        }

        // Verificar contraseña
        const contraseniaValida = await Usuario.verifyPassword(contrasenia, user.contrasenia);
        
        if (!contraseniaValida) {
            return res.status(401).json({ 
                success: false, 
                message: 'Credenciales inválidas' 
            });
        }

        // Verificar si tiene 2FA habilitado
        if (user.verificacion_2fa) {
            // Enviar código 2FA
            const codigo = generarCodigoVerificacion();
            await CodigoVerificacion.create(user.usuario, codigo, '2fa');
            await enviarCodigoVerificacion(user.usuario, codigo, '2fa');

            return res.json({ 
                success: true, 
                message: 'Código 2FA enviado a tu correo',
                requiresTwoFactor: true,
                email: user.usuario.replace(/(.{2})(.*)(@.*)/, '$1***$3')
            });
        } else {
            // Login sin 2FA (usuarios antiguos)
            const token = jwt.sign(
                { 
                    id: user.id_usuario, 
                    rol: user.rol,
                    email: user.usuario
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            return res.json({
                success: true,
                message: 'Login exitoso',
                requiresTwoFactor: false,
                token: token,
                usuario: {
                    id: user.id_usuario,
                    nombre: user.nombre,
                    rol: user.rol
                }
            });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error en el login' 
        });
    }
});

// 4️⃣ LOGIN - Verificar código 2FA
router.post('/login/verificar-2fa', async (req, res) => {
    const { email, codigo } = req.body;
    
    try {
        const user = await Usuario.findByEmail(email);

        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Usuario no encontrado' 
            });
        }

        const codigoValido = await CodigoVerificacion.verify(user.usuario, codigo, '2fa');

        if (!codigoValido) {
            return res.status(400).json({ 
                success: false, 
                message: 'Código 2FA inválido o expirado' 
            });
        }

        await CodigoVerificacion.markAsUsed(codigoValido.id);

        const token = jwt.sign(
            { 
                id: user.id_usuario, 
                rol: user.rol,
                email: user.usuario
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Autenticación exitosa',
            token: token,
            usuario: {
                id: user.id_usuario,
                nombre: user.nombre,
                rol: user.rol
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al verificar código 2FA' 
        });
    }
});

module.exports = router;