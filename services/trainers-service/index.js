const express = require('express');
const cors = require('cors');
require('dotenv').config();

const entrenadoresRoutes = require('../../src/routes/entrenadores.routes');
const rutinaRoutes = require('../../src/routes/rutina.routes');
const dietasRoutes = require('../../src/routes/dietasMiembro.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/entrenadores', entrenadoresRoutes);
app.use('/api/rutinas', rutinaRoutes);
app.use('/api/dietas', dietasRoutes);

app.get('/health', (_, res) => res.json({ ok: true, service: 'trainers-service' }));

const PORT = process.env.TRAINERS_SERVICE_PORT || 3003;
app.listen(PORT, () => console.log(`trainers-service listening on ${PORT}`));
