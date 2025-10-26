const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();

// CORS configuration - MUST be before routes
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// health - before any middleware
app.get('/health', (_, res) => res.json({ ok: true, service: 'gateway' }));

// Auth validation middleware (but don't consume body)
const { authenticateToken } = require('../shared/middleware/auth');

// proxy table: pathPrefix -> target
const proxyTable = [
  { prefix: '/api/auth', target: 'http://localhost:3001', auth: false },
  { prefix: '/api/usuarios', target: 'http://localhost:3001', auth: true },
  { prefix: '/api/miembros', target: 'http://localhost:3002', auth: true },
  { prefix: '/api/asistencia', target: 'http://localhost:3002', auth: true },
  { prefix: '/api/perfil-fisico', target: 'http://localhost:3002', auth: true },
  { prefix: '/api/entrenadores', target: 'http://localhost:3003', auth: true },
  { prefix: '/api/rutinas', target: 'http://localhost:3003', auth: true },
  { prefix: '/api/dietas', target: 'http://localhost:3003', auth: true },
  { prefix: '/api/facturas', target: 'http://localhost:3004', auth: true },
  { prefix: '/api/mensualidades', target: 'http://localhost:3004', auth: true },
  { prefix: '/api/detallefactura', target: 'http://localhost:3004', auth: true },
  { prefix: '/api/productos', target: 'http://localhost:3005', auth: false },
  // Notification routes - all go to notifications-service (3006)
  { prefix: '/api/notificaciones-unificadas', target: 'http://localhost:3006', auth: true },
  { prefix: '/api/notificaciones-miembro', target: 'http://localhost:3006', auth: true },
  { prefix: '/api/notificaciones-entrenador', target: 'http://localhost:3006', auth: true },
  { prefix: '/api/notificaciones', target: 'http://localhost:3006', auth: true },
  { prefix: '/socket.io', target: 'http://localhost:3006', auth: false }
];

// Configure proxies with conditional auth
proxyTable.forEach(({ prefix, target, auth }) => {
  const proxyMiddleware = createProxyMiddleware({
    target,
    changeOrigin: true,
    ws: true,
    logLevel: 'silent',
    onProxyReq: (proxyReq, req, res) => {
      // Don't modify the body, let it stream through
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    }
  });

  if (auth) {
    // Protected routes: validate token first, then proxy
    app.use(prefix, authenticateToken, proxyMiddleware);
  } else {
    // Public routes: just proxy
    app.use(prefix, proxyMiddleware);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Gateway listening on http://localhost:${PORT}`);
});

module.exports = app;
