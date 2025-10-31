const express = require('express');
const cors = require('cors');
require('dotenv').config();

const miembroRoutes = require('../../src/routes/miembro.routes');
const asistenciaRoutes = require('../../src/routes/asistencia.routes');
const perfilFisicoRoutes = require('../../src/routes/perfilFisico.routes');
const carritoRoutes = require('../../src/routes/carrito.routes');

const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/miembros', miembroRoutes);
app.use('/api/miembros', carritoRoutes);
app.use('/api/asistencia', asistenciaRoutes);
app.use('/api/perfil-fisico', perfilFisicoRoutes);


const miembroController = require('../../src/controllers/miembro.controller');
app.post('/api/members/register', miembroController.createMiembro);

app.get('/health', (_, res) => res.json({ ok: true, service: 'members-service' }));

const PORT = process.env.MEMBERS_SERVICE_PORT || 3002;
app.listen(PORT, () => console.log(`members-service listening on ${PORT}`));
