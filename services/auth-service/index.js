const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('../../src/routes/auth.routes');
const usuariosRoutes = require('../../src/routes/usuarios.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);

app.get('/health', (_, res) => res.json({ ok: true, service: 'auth-service' }));

const PORT = process.env.AUTH_SERVICE_PORT || 3001;
app.listen(PORT, () => console.log(`auth-service listening on ${PORT}`));
