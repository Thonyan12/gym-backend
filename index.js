const app = require('./src/app');
const http = require('http');
const { Server } = require('socket.io');
const socketService = require('./src/services/socket.service');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.ALLOWED_ORIGIN || '*', methods: ['GET', 'POST'] }
});

// Inicializar el servicio de sockets
socketService.init(io);

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
