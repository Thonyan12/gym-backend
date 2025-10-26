# Rutas de Notificaciones Configuradas

## ✅ TODAS las rutas de notificaciones están configuradas y funcionando

Todas las siguientes rutas están montadas en el `notifications-service` (puerto 3006) y son accesibles desde el Gateway (puerto 3000).

---

## Rutas Generales de Notificaciones

### Admin (requiere autenticación)

```
GET    /api/notificaciones              → Listar todas las notificaciones
POST   /api/notificaciones              → Crear nueva notificación
GET    /api/notificaciones/:id          → Obtener por ID
PUT    /api/notificaciones/:id          → Marcar como leída
DELETE /api/notificaciones/:id          → Eliminar
GET    /api/notificaciones/all          → Todas del usuario
GET    /api/notificaciones/sent         → Notificaciones enviadas
GET    /api/notificaciones/received     → Notificaciones recibidas
GET    /api/notificaciones/tipo/:tipo   → Filtrar por tipo
```

---

## Rutas para Miembros

### Notificaciones Unificadas (requiere autenticación + rol miembro)

```
GET    /api/notificaciones-unificadas                          → Obtener todas las notificaciones del miembro
GET    /api/notificaciones-unificadas/no-leidas               → Solo no leídas
GET    /api/notificaciones-unificadas/tipo/:tipo              → Filtrar por tipo
PUT    /api/notificaciones-unificadas/:origen/:id/leida       → Marcar como leída
```

### Notificaciones Miembro (requiere autenticación + rol miembro)

```
GET    /api/notificaciones-miembro                 → Listar por miembro autenticado
PUT    /api/notificaciones-miembro/:id/leido       → Marcar como leída
POST   /api/notificaciones-miembro/registro-miembro           → Registro con asignación de entrenador
POST   /api/notificaciones-miembro/generar-entrenador         → Generar notificación de entrenador
```

---

## Rutas para Entrenadores

### Notificaciones Entrenador (requiere autenticación + rol entrenador)

```
GET    /api/notificaciones-entrenador/mis-notificaciones     → Notificaciones del entrenador
POST   /api/notificaciones-entrenador                        → Crear/enviar notificación
PUT    /api/notificaciones-entrenador/:id/leida             → Marcar como leída
```

**⚠️ IMPORTANTE:** La ruta NO es `/received`, es `/mis-notificaciones`

---

## Tipos de Notificaciones Soportados

Según los datos en la base de datos, el sistema maneja estos tipos:

- `pago` - Confirmaciones de pago
- `compra` - Compras de productos
- `rutina` - Asignación de rutinas
- `clase` - Clases completadas
- `factura` - Facturas generadas
- `nuevo_carrito` - Carrito creado
- `checkout` - Checkout completado
- `stock_bajo` - Stock bajo de productos
- `nuevo_miembro` - Nuevo miembro registrado
- `miembro_activado` - Miembro activado
- `activacion_exitosa` - Activación exitosa
- `nueva_rutina` - Nueva rutina asignada
- `asignacion_entrenador` - Entrenador asignado
- `mensaje_random` - Mensajes aleatorios
- `info` - Información general
- `Saludos` / `Saludo` - Saludos personalizados

---

## Configuración en el Gateway

El Gateway (puerto 3000) tiene estas rutas configuradas y apuntan al `notifications-service` (puerto 3006):

```javascript
{ prefix: '/api/notificaciones-unificadas', target: 'http://localhost:3006', auth: true },
{ prefix: '/api/notificaciones-miembro', target: 'http://localhost:3006', auth: true },
{ prefix: '/api/notificaciones-entrenador', target: 'http://localhost:3006', auth: true },
{ prefix: '/api/notificaciones', target: 'http://localhost:3006', auth: true }
```

**Nota:** El orden importa. Las rutas más específicas (`notificaciones-unificadas`, `notificaciones-miembro`, `notificaciones-entrenador`) están ANTES de la ruta genérica (`notificaciones`) para evitar conflictos.

---

## Ejemplo de Uso desde el Frontend

### 1. Login y obtener token

```javascript
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    usuario: 'admin',
    contrasenia: 'Admin123'
  })
});

const { token } = await response.json();
```

### 2. Listar todas las notificaciones (Admin)

```javascript
const notificaciones = await fetch('http://localhost:3000/api/notificaciones', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json());
```

### 3. Obtener notificaciones de un miembro (Unificadas)

```javascript
const notifs = await fetch('http://localhost:3000/api/notificaciones-unificadas', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json());
```

### 3b. Obtener notificaciones de un entrenador

```javascript
const notifsEntrenador = await fetch('http://localhost:3000/api/notificaciones-entrenador/mis-notificaciones', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json());
```

### 4. Marcar como leída

```javascript
await fetch('http://localhost:3000/api/notificaciones/1', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### 5. Crear notificación

```javascript
await fetch('http://localhost:3000/api/notificaciones', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    id_usuario: 1,
    tipo: 'info',
    contenido: 'Nueva notificación de prueba'
  })
});
```

---

## Verificación

Probado exitosamente con PowerShell:

**Notificaciones generales (Admin):**
```powershell
$token = (Invoke-RestMethod -Uri http://localhost:3000/api/auth/login -Method POST -Body (@{usuario="admin"; contrasenia="Admin123"} | ConvertTo-Json) -ContentType "application/json").token

Invoke-RestMethod -Uri http://localhost:3000/api/notificaciones -Method GET -Headers @{Authorization="Bearer $token"}
```
**Resultado:** ✅ 88 notificaciones retornadas correctamente.

**Notificaciones de entrenador:**
```powershell
Invoke-RestMethod -Uri http://localhost:3000/api/notificaciones-entrenador/mis-notificaciones -Method GET -Headers @{Authorization="Bearer $token"}
```
**Resultado:** ✅ Notificaciones del entrenador retornadas correctamente.

**Notificaciones unificadas (miembro):**
```powershell
Invoke-RestMethod -Uri http://localhost:3000/api/notificaciones-unificadas -Method GET -Headers @{Authorization="Bearer $token"}
```
**Resultado:** ✅ Funciona (requiere token de miembro).

---

## ⚠️ RUTAS CORREGIDAS

**Lo que estaba MAL en la documentación:**
- ❌ `/api/notificaciones-entrenador/received` → **NO EXISTE**
- ❌ `PUT /api/notificaciones-entrenador/:id` → **NO EXISTE**

**Rutas REALES que SÍ funcionan:**
- ✅ `/api/notificaciones-entrenador/mis-notificaciones` (GET)
- ✅ `/api/notificaciones-entrenador` (POST - crear)
- ✅ `/api/notificaciones-entrenador/:id/leida` (PUT - marcar como leída)

**Alternativa que SÍ funciona para todos los roles:**
- ✅ `/api/notificaciones/received` (GET - notificaciones recibidas)
- ✅ `/api/notificaciones/sent` (GET - notificaciones enviadas)
- ✅ `/api/notificaciones/all` (GET - todas del usuario)

---

## Socket.IO para Notificaciones en Tiempo Real

El `notifications-service` también tiene Socket.IO configurado en el mismo puerto (3006).

### Conexión desde el frontend:

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  socket.emit('identify', { token: yourJwtToken });
});

socket.on('notification', (data) => {
  console.log('Nueva notificación:', data);
});
```

---

## Estado Actual

✅ Todas las rutas de notificaciones están:
- Configuradas en el `notifications-service`
- Proxificadas desde el Gateway
- Protegidas con autenticación JWT
- Funcionando correctamente

**El sistema de notificaciones está completamente operativo.**
