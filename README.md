# Gym Backend - Sistema de Gestión para Gimnasios

Backend completo para la gestión de un gimnasio desarrollado con Node.js, Express y PostgreSQL. Incluye autenticación con JWT, sistema de doble factor (2FA), gestión de miembros, entrenadores, productos, facturación y notificaciones en tiempo real.

## Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Base de Datos](#base-de-datos)
- [API Endpoints](#api-endpoints)
- [Uso](#uso)
- [Scripts Disponibles](#scripts-disponibles)
- [Autenticación y Seguridad](#autenticación-y-seguridad)
- [Sistema 2FA](#sistema-2fa)
- [WebSockets](#websockets)
- [Microservicios](#microservicios)
- [Documentación Adicional](#documentación-adicional)
- [Solución de Problemas](#solución-de-problemas)
- [Contribución](#contribución)
- [Licencia](#licencia)

## Características

- Autenticación y autorización con JWT
- Sistema de doble factor (2FA) por correo electrónico
- Gestión de usuarios (administradores, entrenadores, miembros)
- CRUD completo de miembros y entrenadores
- Sistema de productos y carrito de compras
- Gestión de facturas y mensualidades
- Asignación de rutinas y dietas personalizadas
- Perfil físico con seguimiento de progreso
- Sistema de notificaciones en tiempo real con WebSockets
- Control de asistencias
- API Gateway con proxy inverso
- Arquitectura modular preparada para microservicios

## Tecnologías

### Backend Core
- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **PostgreSQL** - Base de datos relacional

### Librerías Principales
- **jsonwebtoken** - Autenticación JWT
- **bcryptjs** - Encriptación de contraseñas
- **nodemailer** - Envío de correos electrónicos
- **socket.io** - Comunicación en tiempo real
- **cors** - Manejo de CORS
- **dotenv** - Variables de entorno
- **pg** - Cliente PostgreSQL

### Herramientas de Desarrollo
- **nodemon** - Hot reload en desarrollo

## Requisitos Previos

Antes de instalar el proyecto, asegúrate de tener instalado:

- **Node.js** >= 14.0.0
- **npm** >= 6.0.0
- **PostgreSQL** >= 12.0
- **Git** (opcional)

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Thonyan12/gym-backend.git
cd gym-backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar base de datos

Crear una base de datos en PostgreSQL:

```sql
CREATE DATABASE gymUtmach;
```

Ejecutar los scripts de migración ubicados en la carpeta de base de datos (se ubica en la carpeta public del frontend el backup), o contactar al equipo para obtener el schema completo.

### 4. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```bash
touch .env
```

Agregar las siguientes variables (ver sección [Configuración](#configuración)):

```env
# Base de Datos
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=tu_password
PG_DATABASE=gymUtmach

# JWT
JWT_SECRET=tu_clave_secreta_muy_segura_cambiar_en_produccion

# Email (Gmail) para 2FA
EMAIL_USER=tu-correo@gmail.com
EMAIL_PASSWORD=tu_contraseña_de_aplicacion

# Servidor
PORT=3000

# CORS (opcional)
ALLOWED_ORIGINS=http://localhost:4200,http://localhost:57727
```

## Configuración

### Variables de Entorno

#### Base de Datos (Requerido)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PG_HOST` | Host de PostgreSQL | `localhost` |
| `PG_PORT` | Puerto de PostgreSQL | `5432` |
| `PG_USER` | Usuario de la base de datos | `postgres` |
| `PG_PASSWORD` | Contraseña del usuario | `1812` |
| `PG_DATABASE` | Nombre de la base de datos | `gymUtmach` |

#### JWT (Requerido)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `JWT_SECRET` | Clave secreta para firmar tokens | `clave_super_secreta_2024` |

#### Email - Sistema 2FA (Requerido para 2FA)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `EMAIL_USER` | Correo de Gmail | `gimnasio@gmail.com` |
| `EMAIL_PASSWORD` | Contraseña de aplicación | `abcd efgh ijkl mnop` |

**Importante**: Para Gmail, debes generar una "Contraseña de aplicación":
1. Ir a [myaccount.google.com](https://myaccount.google.com)
2. Seguridad → Verificación en 2 pasos (activar)
3. Seguridad → Contraseñas de aplicaciones
4. Generar nueva contraseña para "Correo"
5. Copiar la contraseña de 16 caracteres

#### Servidor (Opcional)

| Variable | Descripción | Default |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `3000` |
| `ALLOWED_ORIGINS` | Orígenes CORS permitidos (separados por comas) | `http://localhost:4200` |

## Estructura del Proyecto

```
gym-backend/
├── docs/                           # Documentación adicional
│   └── sockets-plan.md
├── gateway/                        # API Gateway
│   ├── index.js
│   └── package.json
├── public/                         # Archivos estáticos
├── scripts/                        # Scripts de utilidad
│   └── smoke-test.js
├── services/                       # Microservicios
│   ├── auth-service/
│   ├── billing-service/
│   ├── members-service/
│   ├── notifications-service/
│   ├── products-service/
│   └── trainers-service/
├── shared/                         # Código compartido
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   └── dotenv.js
├── src/                            # Código fuente principal
│   ├── app.js                      # Configuración de Express
│   ├── config/                     # Configuraciones
│   │   ├── db.js                   # Conexión PostgreSQL
│   │   └── dotenv.js
│   ├── controllers/                # Controladores
│   │   ├── auth.controller.js
│   │   ├── miembro.controller.js
│   │   ├── producto.controller.js
│   │   ├── entrenadores.controller.js
│   │   ├── rutina.controller.js
│   │   ├── perfilFisico.controller.js
│   │   ├── asistencia.controller.js
│   │   ├── notificaciones.controller.js
│   │   └── ...
│   ├── middleware/                 # Middlewares
│   │   └── auth.js                 # Middleware de autenticación
│   ├── models/                     # Modelos de datos
│   │   ├── usuarios.models.js
│   │   ├── miembro.models.js
│   │   ├── producto.models.js
│   │   ├── entrenadores.models.js
│   │   ├── rutina.models.js
│   │   ├── codigoVerificacion.model.js
│   │   └── ...
│   ├── routes/                     # Rutas de la API
│   │   ├── auth.routes.js
│   │   ├── miembro.routes.js
│   │   ├── producto.routes.js
│   │   ├── entrenadores.routes.js
│   │   ├── rutina.routes.js
│   │   ├── notificaciones.routes.js
│   │   └── ...
│   └── services/                   # Servicios
│       ├── emailService.js         # Servicio de correo
│       └── socket.service.js       # Servicio WebSocket
├── .env                            # Variables de entorno (no versionado)
├── .gitignore
├── index.js                        # Punto de entrada
├── package.json                    # Dependencias
├── start-all.js                    # Iniciar todos los servicios
├── IMPLEMENTACION_2FA.md           # Documentación 2FA
├── PERFIL_FISICO_API.md            # Documentación Perfil Físico
├── README-MICROSERVICES.md         # Documentación Microservicios
└── README.md                       # Este archivo
```

## Base de Datos

### Esquema Principal

El proyecto utiliza PostgreSQL con las siguientes tablas principales:

#### Usuarios y Autenticación
- `usuario` - Usuarios del sistema (admin, entrenador, miembro)
- `codigos_verificacion` - Códigos 2FA temporales

#### Miembros y Entrenadores
- `miembro` - Información de miembros
- `entrenador` - Información de entrenadores

#### Fitness y Salud
- `perfil_fisico` - Medidas y progreso físico
- `rutina` - Rutinas de ejercicio
- `asignacion_rutina` - Asignación de rutinas a miembros
- `dietas_miembro` - Planes alimenticios
- `asistencia` - Control de asistencias

#### Comercial
- `producto` - Productos del gimnasio
- `carrito` - Carritos de compra
- `detalle_carrito` - Items del carrito
- `factura_admin` - Facturas generales
- `facturas_miembro` - Facturas de miembros
- `detalle_factura` - Detalle de facturas
- `mensualidades_admin` - Mensualidades

#### Notificaciones
- `notificaciones` - Notificaciones generales
- `notificaciones_miembros` - Notificaciones para miembros
- `notificaciones_entrenador` - Notificaciones para entrenadores

### Columnas Importantes

**Tabla: usuario**
```sql
- id_usuario (PK)
- usuario (EMAIL del usuario)
- contrasenia (texto plano en desarrollo)
- rol (admin, entrenador, miembro)
- verificacion_2fa (BOOLEAN)
- email_verificado (BOOLEAN)
- estado (BOOLEAN)
- fecha_registro
- id_coach (FK)
- id_miembro (FK)
```

**Tabla: codigos_verificacion**
```sql
- id (PK)
- email
- codigo (6 dígitos)
- tipo ('registro' o '2fa')
- usado (BOOLEAN)
- expira_en (TIMESTAMP - 10 minutos)
- creado_en
```

### Trigger Automático

Existe un trigger que crea automáticamente un usuario cuando se inserta un miembro:
- Copia `miembro.correo` → `usuario.usuario`
- Genera contraseña: `apellido1 + '123'`
- Asigna rol: `'miembro'`

## API Endpoints

### Autenticación

#### Login Legacy (sin 2FA)
```http
POST /api/auth/login
Content-Type: application/json

{
  "usuario": "correo@ejemplo.com",
  "contrasenia": "password123"
}
```

#### Login con 2FA - Paso 1: Validar Credenciales
```http
POST /api/auth/login/validar
Content-Type: application/json

{
  "email": "correo@ejemplo.com",
  "contrasenia": "password123"
}
```

#### Login con 2FA - Paso 2: Verificar Código
```http
POST /api/auth/login/verificar-2fa
Content-Type: application/json

{
  "email": "correo@ejemplo.com",
  "codigo": "123456"
}
```

#### Registro con 2FA - Paso 1: Solicitar Código
```http
POST /api/auth/registro/enviar-codigo
Content-Type: application/json

{
  "correo": "nuevo@ejemplo.com"
}
```

#### Registro con 2FA - Paso 2: Completar Registro
```http
POST /api/auth/registro/verificar
Content-Type: application/json

{
  "correo": "nuevo@ejemplo.com",
  "codigo": "123456",
  "cedula": "1234567890",
  "nombre": "Juan",
  "apellido1": "Pérez",
  "apellido2": "González",
  "edad": 25,
  "direccion": "Calle 123",
  "altura": 1.75,
  "peso": 70,
  "contextura": "Normal",
  "objetivo": "Fitness",
  "sexo": "M"
}
```

#### Verificar Token
```http
GET /api/auth/verify
Authorization: Bearer {token}
```

### Miembros

```http
GET    /api/miembros              # Listar todos
GET    /api/miembros/:id          # Obtener por ID
POST   /api/miembros              # Crear nuevo
PUT    /api/miembros/:id          # Actualizar
DELETE /api/miembros/:id          # Eliminar
```

### Entrenadores

```http
GET    /api/entrenadores          # Listar todos
GET    /api/entrenadores/:id      # Obtener por ID
POST   /api/entrenadores          # Crear nuevo
PUT    /api/entrenadores/:id      # Actualizar
DELETE /api/entrenadores/:id      # Eliminar
```

### Productos

```http
GET    /api/productos             # Listar todos
GET    /api/productos/:id         # Obtener por ID
POST   /api/productos             # Crear nuevo
PUT    /api/productos/:id         # Actualizar
DELETE /api/productos/:id         # Eliminar
```

### Rutinas

```http
GET    /api/rutinas               # Listar todas
GET    /api/rutinas/:id           # Obtener por ID
POST   /api/rutinas               # Crear nueva
PUT    /api/rutinas/:id           # Actualizar
DELETE /api/rutinas/:id           # Eliminar
```

### Perfil Físico

```http
GET    /api/perfil-fisico/miembro/:idMiembro     # Obtener perfil
POST   /api/perfil-fisico                        # Crear perfil
PUT    /api/perfil-fisico/:id                    # Actualizar
```

### Asistencias

```http
GET    /api/asistencia            # Listar todas
POST   /api/asistencia            # Registrar asistencia
```

### Notificaciones

```http
GET    /api/notificaciones-miembro/:id           # Notificaciones de miembro
GET    /api/notificaciones-entrenador/:id        # Notificaciones de entrenador
GET    /api/notificaciones-unificadas/:id        # Todas las notificaciones
POST   /api/notificaciones                       # Crear notificación
```

### Facturas

```http
GET    /api/facturas              # Listar facturas (admin)
GET    /api/facturasMiembros/:id  # Facturas de un miembro
POST   /api/facturas              # Crear factura
```

### Usuarios

```http
GET    /api/usuarios              # Listar todos
GET    /api/usuarios/:id          # Obtener por ID
POST   /api/usuarios              # Crear nuevo
PUT    /api/usuarios/:id          # Actualizar
DELETE /api/usuarios/:id          # Eliminar
```

**Nota**: Todos los endpoints (excepto login/registro) requieren autenticación con token JWT en el header:
```
Authorization: Bearer {token}
```

## Uso

### Iniciar el servidor

#### Modo de producción (monolito)
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

#### Modo microservicios
```bash
# Iniciar todos los servicios
npm start

# O iniciar servicios individuales
npm run start:gateway        # API Gateway
npm run start:auth          # Servicio de autenticación
npm run start:members       # Servicio de miembros
npm run start:trainers      # Servicio de entrenadores
npm run start:billing       # Servicio de facturación
npm run start:products      # Servicio de productos
npm run start:notifications # Servicio de notificaciones
```

#### Modo desarrollo
```bash
nodemon index.js
```

### Probar la API

#### Con cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"admin@gym.com","contrasenia":"Admin123"}'

# Obtener miembros (con token)
curl -X GET http://localhost:3000/api/miembros \
  -H "Authorization: Bearer tu_token_jwt"
```

#### Con Insomnia / Postman

1. Importar colección (si existe archivo de colección)
2. Configurar variable de entorno `base_url`: `http://localhost:3000`
3. Realizar login para obtener token
4. Usar token en requests subsiguientes

### Smoke Test

Ejecutar pruebas básicas de conectividad:

```bash
npm run smoke
```

## Scripts Disponibles

```bash
npm start                    # Iniciar servidor principal
npm run start:gateway        # Iniciar API Gateway
npm run start:auth          # Iniciar servicio de autenticación
npm run start:members       # Iniciar servicio de miembros
npm run start:trainers      # Iniciar servicio de entrenadores
npm run start:billing       # Iniciar servicio de facturación
npm run start:products      # Iniciar servicio de productos
npm run start:notifications # Iniciar servicio de notificaciones
npm run smoke               # Ejecutar smoke tests
npm test                    # Ejecutar tests (no implementado)
```

## Autenticación y Seguridad

### JWT (JSON Web Tokens)

El sistema utiliza JWT para autenticación stateless:

- **Expiración**: 24 horas
- **Algoritmo**: HS256
- **Payload**: `{ id, rol, email }`

### Roles de Usuario

- **admin**: Acceso total al sistema
- **entrenador**: Gestión de rutinas, dietas, miembros asignados
- **miembro**: Acceso a su perfil, rutinas, productos

### Middleware de Autenticación

```javascript
// Proteger ruta
const { authenticateToken } = require('./middleware/auth');

router.get('/ruta-protegida', authenticateToken, (req, res) => {
  // req.user contiene { id, rol, email }
});
```

### Contraseñas

**IMPORTANTE**: En el estado actual (desarrollo educativo):
- Las contraseñas se almacenan en texto plano
- Formato generado: `apellido1 + '123'`
- **NO usar en producción**

Para producción se recomienda:
```javascript
const bcrypt = require('bcryptjs');
const hashedPassword = await bcrypt.hash(password, 10);
```

## Sistema 2FA

El sistema incluye autenticación de dos factores (2FA) opcional por correo electrónico.

### Funcionamiento

1. Usuario inicia sesión con email/contraseña
2. Si `verificacion_2fa = TRUE` en BD:
   - Sistema genera código de 6 dígitos
   - Envía email con código
   - Usuario ingresa código
   - Sistema valida y emite token JWT
3. Si `verificacion_2fa = FALSE`:
   - Login directo con token JWT

### Características

- Códigos de 6 dígitos aleatorios
- Expiración automática (10 minutos)
- Códigos de un solo uso
- Emails con plantilla HTML personalizada
- Tipos de código: `registro` y `2fa`

### Activar 2FA para un usuario

```sql
UPDATE usuario 
SET verificacion_2fa = TRUE 
WHERE usuario = 'correo@ejemplo.com';
```

### Configuración de Email

Se utiliza Gmail con contraseñas de aplicación:

1. Cuenta de Gmail con verificación en 2 pasos
2. Generar contraseña de aplicación
3. Configurar en `.env`:
   ```env
   EMAIL_USER=gimnasio@gmail.com
   EMAIL_PASSWORD=abcd efgh ijkl mnop
   ```

Ver documentación completa en: [IMPLEMENTACION_2FA.md](./IMPLEMENTACION_2FA.md)

## WebSockets

El sistema incluye comunicación en tiempo real con Socket.IO para:

- Notificaciones instantáneas
- Chat en tiempo real (si aplica)
- Actualizaciones de estado
- Eventos del sistema

### Conectar desde el cliente

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  withCredentials: true
});

socket.on('notificacion', (data) => {
  console.log('Nueva notificación:', data);
});
```

### Eventos disponibles

```javascript
// Servidor → Cliente
socket.on('notificacion', callback);
socket.on('actualizacion', callback);

// Cliente → Servidor
socket.emit('mensaje', data);
```

Ver plan completo en: [docs/sockets-plan.md](./docs/sockets-plan.md)

## Microservicios

El proyecto está preparado para arquitectura de microservicios:

### Servicios Disponibles

1. **Gateway** (`gateway/`) - Proxy inverso y enrutamiento
2. **Auth Service** (`services/auth-service/`) - Autenticación
3. **Members Service** (`services/members-service/`) - Gestión de miembros
4. **Trainers Service** (`services/trainers-service/`) - Gestión de entrenadores
5. **Billing Service** (`services/billing-service/`) - Facturación
6. **Products Service** (`services/products-service/`) - Productos
7. **Notifications Service** (`services/notifications-service/`) - Notificaciones

### Iniciar en modo microservicios

```bash
npm start  # Inicia todos los servicios con start-all.js
```

Ver documentación completa en: [README-MICROSERVICES.md](./README-MICROSERVICES.md)

## Documentación Adicional

- [IMPLEMENTACION_2FA.md](./IMPLEMENTACION_2FA.md) - Sistema de doble factor
- [PERFIL_FISICO_API.md](./PERFIL_FISICO_API.md) - API de perfil físico
- [README-MICROSERVICES.md](./README-MICROSERVICES.md) - Arquitectura de microservicios
- [docs/sockets-plan.md](./docs/sockets-plan.md) - Plan de WebSockets

## Solución de Problemas

### Error de conexión a base de datos

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solución**:
1. Verificar que PostgreSQL esté corriendo
2. Verificar credenciales en `.env`
3. Verificar que la base de datos existe

```bash
# Windows
services.msc  # Buscar PostgreSQL

# Linux/Mac
sudo service postgresql status
```

### Error al enviar emails (2FA)

```
Error: Invalid login
```

**Solución**:
1. Verificar que `EMAIL_USER` y `EMAIL_PASSWORD` estén correctos
2. Usar contraseña de aplicación de Gmail (no la contraseña normal)
3. Verificar que la verificación en 2 pasos esté activada en Gmail

### Token JWT inválido

```
Error: jwt malformed
```

**Solución**:
1. Verificar que `JWT_SECRET` esté configurado en `.env`
2. Verificar formato del token: `Bearer {token}`
3. Obtener nuevo token haciendo login

### Puerto en uso

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solución**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID {PID} /F

# Linux/Mac
lsof -i :3000
kill -9 {PID}
```

### CORS Error

```
Access to fetch at 'http://localhost:3000' has been blocked by CORS policy
```

**Solución**:
Agregar origen del frontend en `.env`:
```env
ALLOWED_ORIGINS=http://localhost:4200,http://localhost:3000
```

## Contribución

### Proceso de Contribución

1. Fork del proyecto
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'Agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

### Estándares de Código

- Usar nombres descriptivos en español para variables y funciones
- Comentar código complejo
- Seguir estructura de carpetas existente
- Validar datos de entrada
- Manejar errores apropiadamente

### Convenciones de Commits

```
feat: Nueva funcionalidad
fix: Corrección de bug
docs: Cambios en documentación
style: Formato, punto y coma, etc
refactor: Refactorización de código
test: Agregar tests
chore: Tareas de mantenimiento
```

## Licencia

ISC

## Autor

Desarrollado por: **antho**

---

**Universidad Técnica de Machala (UTMACH)**  
Sistema de Gestión de Gimnasio - Proyecto Educativo

Para más información o soporte, contactar al equipo de desarrollo 