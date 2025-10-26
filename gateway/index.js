const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();

// Simple request logger for debugging
app.use((req, res, next) => {
  console.log('[GATEWAY]', req.method, req.url, 'Origin:', req.headers.origin);
  next();
});

// CORS dev: reflejar orígenes localhost (acepta 4200, 57727, etc.)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && origin.startsWith('http://localhost')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

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
    // Ensure target receives the full original path (e.g. /api/auth/login)
    pathRewrite: (path, req) => {
      try {
        return (req && (req.originalUrl || req.url)) || path;
      } catch (e) {
        return path;
      }
    },
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

// Ensure English "members" path is proxied to members-service (some frontends call /api/members)
app.use('/api/members', createProxyMiddleware({
  target: 'http://localhost:3002',
  changeOrigin: true,
  // Reescribir paths recibidos por el gateway hacia las rutas del members-service
  // - POST /api/members/register  -> /api/miembros   (members-service crea miembro en POST /api/miembros/ )
  // - /api/members/*            -> /api/miembros/*
  pathRewrite: (path, req) => {
    // req.originalUrl contiene la URL tal como vino al gateway (ej: /api/members/register)
    const original = (req && (req.originalUrl || req.url)) || path;
    if (original.startsWith('/api/members/register')) return '/api/miembros';
    // Reescribe prefijo /api/members -> /api/miembros
    return original.replace(/^\/api\/members/, '/api/miembros');
  },
  onProxyReq: (proxyReq, req, res) => {
    try {
      console.log('[GATEWAY proxy] ->', req.method, req.originalUrl, '->', proxyReq.path || proxyReq.getHeader('path') || proxyReq.path);
    } catch (e) { /* ignore logging errors */ }
  },
  onProxyRes: (proxyRes, req, res) => {
    const origin = req.headers.origin;
    proxyRes.headers['Access-Control-Allow-Origin'] = origin || '*';
    proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
  },
  onError: (err, req, res) => {
    console.error('[GATEWAY] proxy /api/members error', err.message);
    if (!res.headersSent) res.status(502).json({ error: 'Bad gateway' });
  }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Gateway listening on http://localhost:${PORT}`);
});

module.exports = app;
