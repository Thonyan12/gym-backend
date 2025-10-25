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
const detallefacturaRoutes = require('./routes/detallefactura.routes');
const facturasMiembroRoutes = require('./routes/facturaMiembro.routes');
const dietasMiembroRoutes = require('./routes/dietasMiembro.routes');
const rutinaRoutes = require('./routes/rutina.routes');
const perfilFisicoRoutes = require('./routes/perfilFisico.routes');
const asistenciaRoutes = require('./routes/asistencia.routes');
const entrenadoresRoutes = require('./routes/entrenadores.routes');
const notificacionesMiembroRoutes = require('./routes/notificacionesMiembros.routes');
const notificacionesEntrenadorRoutes = require('./routes/notificacionesEntrenador.routes');
const notificacionesUnificadasRoutes = require('./routes/notificaciones-unificadas.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/notificaciones-miembro', notificacionesMiembroRoutes);
app.use('/api/asistencia', asistenciaRoutes);
app.use('/api/entrenadores', entrenadoresRoutes);
app.use('/api/miembros', miembroRoutes);    
app.use('/api/miembros', carritoRoutes); 
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes); 
app.use('/api/mensualidades', mensualidadesAdminRoutes);
app.use('/api/notificaciones', notificacionesRoutes);
app.use('/api/facturas', facturaAdminRoutes);
app.use('/api/detallefactura', detallefacturaRoutes);
app.use('/api/facturasMiembros', facturasMiembroRoutes);
app.use('/api/dietas', dietasMiembroRoutes);
app.use('/api/rutinas', rutinaRoutes);
app.use('/api/perfil-fisico', perfilFisicoRoutes);
app.use('/api/notificaciones-entrenador', notificacionesEntrenadorRoutes);
app.use('/api/notificaciones-unificadas', notificacionesUnificadasRoutes);

module.exports = app;