const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productoRoutes = require('./routes/producto.routes');
const authRoutes = require('./routes/auth.routes');
const miembroRoutes  = require('./routes/miembro.routes');
const carritoRoutes  = require('./routes/carrito.routes');
const memberRoutes = require('./routes/member.routes'); 
const usuariosRoutes = require('./routes/usuarios.routes');
const mensualidadesAdminRoutes = require('./routes/mensualidadesAdmin.routes');
const notificacionesRoutes = require('./routes/notificaciones.routes');
const facturaAdminRoutes = require('./routes/facturaAdmin.routes');
const facturasMiembroRoutes = require('./routes/facturaMiembro.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/miembros', miembroRoutes);    
app.use('/api/miembros', carritoRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes); 
app.use('/api/mensualidades', mensualidadesAdminRoutes);
app.use('/api/notificaciones', notificacionesRoutes);
app.use('/api/facturas', facturaAdminRoutes);
app.use('/api/facturasMiembros', facturasMiembroRoutes);

module.exports = app;