# Configuración CORS en el Gateway

## ✅ Aplicado

El Gateway (puerto 3000) ahora acepta peticiones desde el frontend en `http://localhost:4200`.

### Headers CORS configurados:

```javascript
Access-Control-Allow-Origin: http://localhost:4200
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

### Implementación en gateway/index.js:

```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## Verificación

Ahora tu frontend en Angular (puerto 4200) puede hacer peticiones a:
- `http://localhost:3000/api/auth/login`
- `http://localhost:3000/api/mensualidades`
- `http://localhost:3000/api/productos`
- etc.

## Prueba desde el navegador

Abre la consola del navegador (F12) y ejecuta:

```javascript
fetch('http://localhost:3000/api/productos')
  .then(r => r.json())
  .then(data => console.log('Productos:', data));
```

Deberías ver los productos sin error de CORS.

## Si necesitas agregar más orígenes

Edita `gateway/index.js` y cambia:

```javascript
origin: 'http://localhost:4200'
```

Por un array:

```javascript
origin: ['http://localhost:4200', 'http://localhost:3001', 'https://tudominio.com']
```

## Notas Importantes

- El CORS está configurado SOLO en el Gateway
- Los microservicios internos (3001-3006) no necesitan CORS porque solo el Gateway les hace peticiones
- Si cambias el puerto del frontend, actualiza el `origin` en `gateway/index.js`
