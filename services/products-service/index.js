const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productoRoutes = require('../../src/routes/producto.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/productos', productoRoutes);

app.get('/health', (_, res) => res.json({ ok: true, service: 'products-service' }));

const PORT = process.env.PRODUCTS_SERVICE_PORT || 3005;
app.listen(PORT, () => console.log(`products-service listening on ${PORT}`));
