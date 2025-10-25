let jwt;
try {
  jwt = require('jsonwebtoken'); // opcional si quieres validar tokens
} catch (e) {
  jwt = null; // si no está instalado, no fallamos
}

let ioInstance = null;

exports.init = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log('Socket conectado:', socket.id);

    socket.on('identify', (payload) => {
      try {
        // payload puede ser { token } o { userId, role }
        if (payload && payload.token) {
          // Si usas JWT, valida y extrae rol/id
          try {
            const user = jwt.verify(payload.token, process.env.JWT_SECRET || 'default');
            const role = user.rol || user.role;
            const userId = user.id || user.id_usuario;
            if (role) socket.join(`role:${role}`);
            if (userId) socket.join(`user:${userId}`);
            console.log(`Socket ${socket.id} unido a rooms: role:${role}, user:${userId}`);
          } catch (e) {
            console.warn('Token inválido en identify:', e.message);
          }
        } else if (payload && payload.role) {
          socket.join(`role:${payload.role}`);
          if (payload.userId) socket.join(`user:${payload.userId}`);
          console.log('Socket identificado por payload:', payload);
        }
      } catch (err) {
        console.warn('identify error', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket desconectado:', socket.id);
    });
  });
};

exports.getIO = () => ioInstance;

exports.emitToUser = (userId, event, payload) => {
  if (!ioInstance) return;
  ioInstance.to(`user:${userId}`).emit(event, payload);
};

exports.emitToRole = (role, event, payload) => {
  if (!ioInstance) return;
  ioInstance.to(`role:${role}`).emit(event, payload);
};
