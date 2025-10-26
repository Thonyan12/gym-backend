# Arquitectura de Microservicios - Gym Backend

Este proyecto ha sido reestructurado para usar microservicios sin Docker, manteniendo toda la lógica existente en `src/`.

## Estructura del Proyecto

```
gym-backend/
├── gateway/                    # API Gateway (Puerto 3000)
│   └── index.js               # Proxy + validación JWT
│
├── services/
│   ├── auth-service/          # Puerto 3001 - Autenticación
│   ├── members-service/       # Puerto 3002 - Miembros, asistencia, perfil
│   ├── trainers-service/      # Puerto 3003 - Entrenadores, rutinas, dietas
│   ├── billing-service/       # Puerto 3004 - Facturas, mensualidades
│   ├── products-service/      # Puerto 3005 - Productos
│   └── notifications-service/ # Puerto 3006 - Notificaciones + Socket.IO
│
├── shared/                    # Código compartido
│   ├── config/
│   │   └── db.js             # Configuración PostgreSQL
│   ├── middleware/
│   │   └── auth.js           # Middleware JWT
│   └── dotenv.js
│
├── src/                       
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── services/
│
├── scripts/
│   └── smoke-test.js         # Pruebas de verificación
│
├── start-all.js              # Inicia todos los servicios
└── package.json
```

## Cómo Usar

### Instalación
```powershell
npm install
```

### Iniciar Todos los Servicios
```powershell
npm start
```
Esto levanta:
- Gateway en http://localhost:3000
- Auth service en http://localhost:3001
- Members service en http://localhost:3002
- Trainers service en http://localhost:3003
- Billing service en http://localhost:3004
- Products service en http://localhost:3005
- Notifications service en http://localhost:3006

### Iniciar un Servicio Individual
```powershell
npm run start:gateway
npm run start:auth
npm run start:members
npm run start:trainers
npm run start:billing
npm run start:products
npm run start:notifications
```

### Ejecutar Pruebas
```powershell
npm run smoke
```

## Arquitectura

### Gateway (Puerto 3000)
- **Función**: Proxy reverso + validación JWT centralizada
- **Características**:
  - Valida JWT en todas las rutas excepto `/api/auth` y `/health`
  - Proxifica peticiones HTTP a microservicios
  - Soporta proxy de WebSocket a `notifications-service`
- **Rutas públicas** (sin autenticación):
  - `/health`
  - `/api/auth/*`

### Microservicios

#### auth-service (3001)
- Login unificado
- Registro de miembros
- Verificación de tokens

#### members-service (3002)
- CRUD de miembros
- Asistencia
- Perfil físico
- Carrito de compras

#### trainers-service (3003)
- Gestión de entrenadores
- Rutinas
- Dietas

#### billing-service (3004)
- Facturas (admin y miembros)
- Mensualidades
- Detalles de factura

#### products-service (3005)
- Catálogo de productos

#### notifications-service (3006)
- API REST para notificaciones
- Servidor Socket.IO para tiempo real
- Manejo de rooms por usuario/rol

## Flujo de Peticiones

```
Cliente → Gateway (3000)
          ↓ (valida JWT si requerido)
          ↓ (proxy)
          → Microservicio específico (3001-3006)
            ↓ (ejecuta lógica en src/)
            ← Respuesta
          ← Respuesta al cliente
```

## Código Compartido

Los archivos en `shared/` son usados por todos los servicios:
- `shared/config/db.js`: Pool de PostgreSQL
- `shared/middleware/auth.js`: Validación JWT y roles
- `shared/dotenv.js`: Carga de variables de entorno

Los archivos en `src/config` y `src/middleware` ahora reexportan desde `shared/`.

## Socket.IO

- El servidor Socket.IO reside en `notifications-service` (3006)
- El cliente puede conectarse a través del gateway (`http://localhost:3000`) o directo al servicio (`http://localhost:3006`)
- Autenticación vía evento `identify` con token JWT
- Soporta rooms por usuario (`user:${userId}`) y rol (`role:${role}`)

Ver `docs/sockets-plan.md` para detalles.

## Variables de Entorno

Las variables en `.env` son compartidas por todos los servicios:
- `PG_HOST`, `PG_PORT`, `PG_USER`, `PG_PASSWORD`, `PG_DATABASE`
- `JWT_SECRET`
- `PORT` (puerto del gateway, default 3000)

Puertos de servicios (opcionales):
- `AUTH_SERVICE_PORT` (default 3001)
- `MEMBERS_SERVICE_PORT` (default 3002)
- `TRAINERS_SERVICE_PORT` (default 3003)
- `BILLING_SERVICE_PORT` (default 3004)
- `PRODUCTS_SERVICE_PORT` (default 3005)
- `NOTIFICATIONS_SERVICE_PORT` (default 3006)

## Notas Importantes

1. **Sin Docker**: Los servicios corren directamente con Node.js en tu máquina
2. **Lógica intacta**: Todo el código en `src/` permanece sin modificar
3. **Base de datos compartida**: Todos los servicios usan el mismo pool de PostgreSQL
4. **CORS**: Configurado en cada servicio y en el gateway
5. **Sin transacciones distribuidas**: Si necesitas operaciones que cruzan servicios, gestiónalas manualmente

## Troubleshooting

### Puertos ocupados
Si ves errores `EADDRINUSE`, mata los procesos:
```powershell
Get-Process node | Stop-Process -Force
```

### Dependencias faltantes
```powershell
npm install
```

### Ver logs
Los logs de todos los servicios se muestran en la terminal donde ejecutaste `npm start`

### Verificar servicios
```powershell
# Gateway
Invoke-RestMethod http://localhost:3000/health

# Auth service
Invoke-RestMethod http://localhost:3001/health

# Members service
Invoke-RestMethod http://localhost:3002/health
```

## Próximos Pasos (Opcionales)

- [ ] Implementar circuit breakers entre servicios
- [ ] Añadir rate limiting por servicio
- [ ] Implementar logging centralizado
- [ ] Añadir métricas y monitoring
- [ ] Separar bases de datos por servicio
- [ ] Implementar message queue para eventos entre servicios
- [ ] Añadir tests de integración E2E
