const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();


app.use((req, res, next) => {
  console.log('[GATEWAY]', req.method, req.url, 'Origin:', req.headers.origin);
  next();
});


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


app.get('/health', (_, res) => res.json({ ok: true, service: 'gateway' }));


const { authenticateToken } = require('../shared/middleware/auth');


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
  { prefix: '/api/notificaciones-unificadas', target: 'http://localhost:3006', auth: true },
  { prefix: '/api/notificaciones-miembro', target: 'http://localhost:3006', auth: true },
  { prefix: '/api/notificaciones-entrenador', target: 'http://localhost:3006', auth: true },
  { prefix: '/api/notificaciones', target: 'http://localhost:3006', auth: true },
  { prefix: '/socket.io', target: 'http://localhost:3006', auth: false }
];


proxyTable.forEach(({ prefix, target, auth }) => {
  const proxyMiddleware = createProxyMiddleware({
    target,
    changeOrigin: true,
    ws: true,
    logLevel: 'silent',
    
    pathRewrite: (path, req) => {
      try {
        return (req && (req.originalUrl || req.url)) || path;
      } catch (e) {
        return path;
      }
    },
    onProxyReq: (proxyReq, req, res) => {
      
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    }
  });

  if (auth) {
    
    app.use(prefix, authenticateToken, proxyMiddleware);
  } else {
    
    app.use(prefix, proxyMiddleware);
  }
});


app.use('/api/members', createProxyMiddleware({
  target: 'http://localhost:3002',
  changeOrigin: true,
  
  pathRewrite: (path, req) => {
   
    const original = (req && (req.originalUrl || req.url)) || path;
    if (original.startsWith('/api/members/register')) return '/api/miembros';
    
    return original.replace(/^\/api\/members/, '/api/miembros');
  },
  onProxyReq: (proxyReq, req, res) => {
    try {
      console.log('[GATEWAY proxy] ->', req.method, req.originalUrl, '->', proxyReq.path || proxyReq.getHeader('path') || proxyReq.path);
    } catch (e) { }
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
