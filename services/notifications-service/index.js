const express = require('express');
const cors = require('cors');
require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');
const socketService = require('../../src/services/socket.service');
const notificacionesRoutes = require('../../src/routes/notificaciones.routes');
const notificacionesUnificadasRoutes = require('../../src/routes/notificaciones-unificadas.routes');
const notificacionesMiembrosRoutes = require('../../src/routes/notificacionesMiembros.routes');
const notificacionesEntrenadorRoutes = require('../../src/routes/notificacionesEntrenador.routes');

const app = express();
app.use(cors());
app.use(express.json());

// Mount all notification routes
app.use('/api/notificaciones', notificacionesRoutes);
app.use('/api/notificaciones-unificadas', notificacionesUnificadasRoutes);
app.use('/api/notificaciones-miembro', notificacionesMiembrosRoutes);
app.use('/api/notificaciones-entrenador', notificacionesEntrenadorRoutes);

app.get('/health', (_, res) => res.json({ ok: true, service: 'notifications-service' }));

const PORT = process.env.NOTIFICATIONS_SERVICE_PORT || 3006;
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

socketService.init(io);

server.listen(PORT, () => console.log(`notifications-service (w/ sockets) listening on ${PORT}`));
