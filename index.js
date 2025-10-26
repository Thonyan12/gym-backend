const app = require('./src/app');
const http = require('http');
const { Server } = require('socket.io');
const socketService = require('./src/services/socket.service');

const PORT = process.env.PORT || 3000;

// Orígenes permitidos para CORS (puedes pasar ALLOWED_ORIGINS="http://a,http://b")
const allowedOrigins = (process.env.ALLOWED_ORIGINS && process.env.ALLOWED_ORIGINS.split(',')) || [
  'http://localhost:4200',
  'http://localhost:57727',
];

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Inicializar el servicio de sockets
socketService.init(io);

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
