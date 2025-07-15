const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productoRoutes = require('./routes/producto.routes');
const authRoutes = require('./routes/auth.routes'); // Agregar esto
const miembroRoutes = require('./routes/miembro.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const mensualidadesAdminRoutes = require('./routes/mensualidadesAdmin.routes'); // Agregar rutas de mensualidades
const notificacionesRoutes = require('./routes/notificaciones.routes'); // Agregar esto
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/miembros', miembroRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/auth', authRoutes); // Agregar esto
app.use('/api/mensualidades', mensualidadesAdminRoutes); // Agregar rutas de mensualidades
app.use('/api/notificaciones', notificacionesRoutes); // Agregar esto
module.exports = app;