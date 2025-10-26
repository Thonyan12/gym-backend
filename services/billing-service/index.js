const express = require('express');
const cors = require('cors');
require('dotenv').config();

const facturaAdminRoutes = require('../../src/routes/facturaAdmin.routes');
const facturaMiembroRoutes = require('../../src/routes/facturaMiembro.routes');
const mensualidadesRoutes = require('../../src/routes/mensualidadesAdmin.routes');
const detallefacturaRoutes = require('../../src/routes/detallefactura.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/facturas', facturaAdminRoutes);
app.use('/api/facturasMiembros', facturaMiembroRoutes);
app.use('/api/mensualidades', mensualidadesRoutes);
app.use('/api/detallefactura', detallefacturaRoutes);

app.get('/health', (_, res) => res.json({ ok: true, service: 'billing-service' }));

const PORT = process.env.BILLING_SERVICE_PORT || 3004;
app.listen(PORT, () => console.log(`billing-service listening on ${PORT}`));
