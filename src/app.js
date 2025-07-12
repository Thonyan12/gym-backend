const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productoRoutes = require('./routes/producto.routes');
const authRoutes = require('./routes/auth.routes'); // Agregar esto

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/productos', productoRoutes);
app.use('/api/auth', authRoutes); // Agregar esto

module.exports = app;