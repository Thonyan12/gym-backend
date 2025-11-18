# IMPLEMENTACIÓN DE AUTENTICACIÓN DE DOS FACTORES (2FA)

## RESUMEN

Se ha implementado un sistema completo de autenticación de dos factores (2FA) para el backend del gimnasio. El sistema permite verificación por email tanto en el proceso de registro como en el inicio de sesión.

## CAMBIOS REALIZADOS

### 1. DEPENDENCIAS INSTALADAS

```bash
npm install nodemailer jsonwebtoken
```

- **nodemailer**: Librería para envío de correos electrónicos
- **jsonwebtoken**: Manejo de tokens JWT para autenticación

### 2. CONFIGURACIÓN DE VARIABLES DE ENTORNO

Archivo: `.env`

Se agregaron las siguientes variables:

```env
# Configuración de Email (Gmail) para 2FA
EMAIL_USER=satoruinfinito2004@gmail.com
EMAIL_PASSWORD=pzshjldceszkwezi
```

**Nota**: La contraseña es una "Contraseña de aplicación" generada desde la cuenta de Google con verificación en 2 pasos activada.

### 3. ARCHIVOS CREADOS

#### 3.1. Servicio de Email

**Archivo**: `src/services/emailService.js`

Funciones:
- `generarCodigoVerificacion()`: Genera códigos de 6 dígitos aleatorios
- `enviarCodigoVerificacion(email, codigo, tipo)`: Envía emails con plantilla HTML personalizada

Características:
- Códigos de 6 dígitos
- Plantilla HTML con diseño corporativo
- Soporte para dos tipos: 'registro' y '2fa'
- Expiración de códigos en 10 minutos

#### 3.2. Modelo de Códigos de Verificación

**Archivo**: `src/models/codigoVerificacion.model.js`

Métodos:
- `create(email, codigo, tipo)`: Crea un nuevo código de verificación en la BD
- `verify(email, codigo, tipo)`: Verifica si un código es válido y no ha expirado
- `markAsUsed(id)`: Marca un código como usado

### 4. ARCHIVOS MODIFICADOS

#### 4.1. Modelo de Usuarios

**Archivo**: `src/models/usuarios.models.js`

Se agregaron los siguientes métodos para 2FA:

```javascript
// Buscar usuario por email
exports.findByEmail = async (email)

// Verificar si un email ya existe en el sistema
exports.emailExiste = async (email)

// Verificar contraseña (comparación en texto plano)
exports.verifyPassword = async (plainPassword, storedPassword)
```

**Notas importantes**:
- `usuario.usuario` contiene el EMAIL del usuario (no es un username)
- Las contraseñas se almacenan en texto plano (formato: apellido1 + '123')
- No se utiliza bcrypt (proyecto educativo)

#### 4.2. Rutas de Autenticación

**Archivo**: `src/routes/auth.routes.js`

Se agregaron 4 nuevos endpoints para 2FA:

##### Endpoint 1: Solicitar código de registro
```
POST /api/auth/registro/enviar-codigo
```

Request:
```json
{
  "correo": "usuario@example.com"
}
```

Response:
```json
{
  "success": true,
  "message": "Código enviado a tu correo"
}
```

##### Endpoint 2: Verificar código y completar registro
```
POST /api/auth/registro/verificar
```

Request:
```json
{
  "correo": "usuario@example.com",
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

Response:
```json
{
  "success": true,
  "message": "Registro exitoso",
  "data": {
    "id_usuario": 15,
    "id_miembro": 10,
    "email": "usuario@example.com",
    "credenciales": {
      "usuario": "usuario@example.com",
      "contrasenia": "Pérez123"
    }
  }
}
```

##### Endpoint 3: Login con validación de credenciales
```
POST /api/auth/login/validar
```

Request:
```json
{
  "email": "usuario@example.com",
  "contrasenia": "Pérez123"
}
```

Response (con 2FA activado):
```json
{
  "success": true,
  "message": "Código 2FA enviado a tu correo",
  "requiresTwoFactor": true,
  "email": "us***@example.com"
}
```

Response (sin 2FA):
```json
{
  "success": true,
  "message": "Login exitoso",
  "requiresTwoFactor": false,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 15,
    "nombre": "Juan",
    "rol": "miembro"
  }
}
```

##### Endpoint 4: Verificar código 2FA
```
POST /api/auth/login/verificar-2fa
```

Request:
```json
{
  "email": "usuario@example.com",
  "codigo": "654321"
}
```

Response:
```json
{
  "success": true,
  "message": "Autenticación exitosa",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 15,
    "nombre": "Juan",
    "rol": "miembro"
  }
}
```

## ESTRUCTURA DE LA BASE DE DATOS

### Tabla: codigos_verificacion

Columnas:
- `id`: INTEGER (PK, AUTO_INCREMENT)
- `email`: VARCHAR(255)
- `codigo`: VARCHAR(6)
- `tipo`: VARCHAR(20) ('registro' o '2fa')
- `usado`: BOOLEAN (default: FALSE)
- `expira_en`: TIMESTAMP
- `creado_en`: TIMESTAMP (default: NOW())

### Tabla: usuario (columnas agregadas)

- `email_verificado`: BOOLEAN (default: FALSE)
- `verificacion_2fa`: BOOLEAN (default: FALSE)

## FLUJO DE TRABAJO

### Flujo de Registro

1. Usuario solicita código: `POST /api/auth/registro/enviar-codigo`
2. Sistema genera código de 6 dígitos
3. Sistema guarda código en BD (expira en 10 min)
4. Sistema envía email con código
5. Usuario ingresa código: `POST /api/auth/registro/verificar`
6. Sistema valida código
7. Sistema crea miembro en BD
8. Trigger automático crea usuario con contraseña (apellido1 + '123')
9. Sistema marca código como usado
10. Sistema retorna credenciales

### Flujo de Login (con 2FA)

1. Usuario ingresa credenciales: `POST /api/auth/login/validar`
2. Sistema valida email y contraseña
3. Sistema verifica si `verificacion_2fa = TRUE`
4. Si tiene 2FA activado:
   - Genera código de 6 dígitos
   - Guarda código en BD
   - Envía email
   - Retorna `requiresTwoFactor: true`
5. Usuario ingresa código: `POST /api/auth/login/verificar-2fa`
6. Sistema valida código
7. Sistema genera token JWT
8. Sistema retorna token

### Flujo de Login (sin 2FA)

1. Usuario ingresa credenciales: `POST /api/auth/login/validar`
2. Sistema valida email y contraseña
3. Sistema verifica si `verificacion_2fa = FALSE`
4. Sistema genera token JWT directamente
5. Sistema retorna token

## CONFIGURACIÓN DE 2FA POR USUARIO

Para activar 2FA en un usuario específico:

```sql
UPDATE usuario 
SET verificacion_2fa = TRUE 
WHERE usuario = 'email@ejemplo.com';
```

Para desactivar 2FA:

```sql
UPDATE usuario 
SET verificacion_2fa = FALSE 
WHERE usuario = 'email@ejemplo.com';
```

## ENDPOINTS LEGACY

Los siguientes endpoints siguen disponibles para compatibilidad:

- `POST /api/auth/login` - Login sin 2FA (legacy)
- `POST /api/auth/register` - Registro sin 2FA (legacy)
- `GET /api/auth/verify` - Verificar token JWT

## SEGURIDAD

### Características implementadas

- Códigos de verificación de un solo uso
- Expiración automática de códigos (10 minutos)
- Tokens JWT con expiración de 24 horas
- Validación de credenciales antes de enviar códigos
- Ofuscación del email en respuestas (ej: "us***@example.com")

### Notas de seguridad

**ADVERTENCIA**: Este es un proyecto educativo. En producción se recomienda:

1. Usar bcrypt para hashear contraseñas
2. Implementar rate limiting para prevenir ataques de fuerza bruta
3. Usar HTTPS para todas las comunicaciones
4. Implementar CAPTCHA en el registro
5. Agregar logs de seguridad
6. Usar variables de entorno más seguras para JWT_SECRET

## PRUEBAS

### Probar registro completo

```bash
# 1. Solicitar código
curl -X POST http://localhost:3000/api/auth/registro/enviar-codigo \
  -H "Content-Type: application/json" \
  -d '{"correo":"test@example.com"}'

# 2. Verificar código (usar código recibido por email)
curl -X POST http://localhost:3000/api/auth/registro/verificar \
  -H "Content-Type: application/json" \
  -d '{
    "correo": "test@example.com",
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
  }'
```

### Probar login con 2FA

```bash
# 1. Login (activar 2FA primero en BD)
curl -X POST http://localhost:3000/api/auth/login/validar \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","contrasenia":"Pérez123"}'

# 2. Verificar código 2FA
curl -X POST http://localhost:3000/api/auth/login/verificar-2fa \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","codigo":"654321"}'
```

## PLANTILLA DE EMAIL

El sistema envía emails con el siguiente formato:

**Asunto**: "Código de Verificación - Utmach Gym" o "Código de Autenticación - Utmach Gym"

**Contenido**:
- Header con logo/nombre del gimnasio
- Código de 6 dígitos en formato destacado
- Información sobre expiración (10 minutos)
- Mensaje de seguridad

**Remitente**: "Utmach Gym" <satoruinfinito2004@gmail.com>

## ARQUITECTURA DEL SISTEMA

### Componentes

1. **Capa de Rutas** (`src/routes/auth.routes.js`)
   - Maneja las peticiones HTTP
   - Valida datos de entrada
   - Orquesta la lógica de negocio

2. **Capa de Modelos** 
   - `src/models/usuarios.models.js`: Operaciones de usuarios
   - `src/models/miembro.models.js`: Operaciones de miembros
   - `src/models/codigoVerificacion.model.js`: Operaciones de códigos

3. **Capa de Servicios**
   - `src/services/emailService.js`: Envío de correos electrónicos

4. **Base de Datos**
   - PostgreSQL con conexión configurada en `src/config/db.js`

### Integración con sistema existente

- Utiliza el trigger automático existente que crea usuarios al insertar miembros
- Compatible con rutas de autenticación legacy
- Respeta la estructura de roles (admin, entrenador, miembro)
- Utiliza el middleware de autenticación existente

## REQUISITOS DEL SISTEMA

### Software necesario

- Node.js (v14 o superior)
- PostgreSQL
- Cuenta de Gmail con verificación en 2 pasos

### Variables de entorno requeridas

```env
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=tu_password
PG_DATABASE=gymUtmach
JWT_SECRET=tu_clave_secreta_segura
EMAIL_USER=tu-correo@gmail.com
EMAIL_PASSWORD=tu_contraseña_de_aplicacion
```

## TROUBLESHOOTING

### El email no se envía

1. Verificar que EMAIL_USER y EMAIL_PASSWORD estén correctamente configurados
2. Verificar que la contraseña sea una "Contraseña de aplicación" de Google
3. Verificar que la verificación en 2 pasos esté activada en la cuenta de Gmail
4. Revisar logs del servidor para errores de nodemailer

### Código inválido o expirado

1. Los códigos expiran en 10 minutos
2. Cada código solo se puede usar una vez
3. Verificar que el tipo de código coincida ('registro' o '2fa')

### Usuario no encontrado

1. Verificar que el email esté escrito correctamente
2. Verificar que el usuario exista en la tabla `usuario`
3. Recordar que `usuario.usuario` contiene el email

## FUTURAS MEJORAS

1. Endpoint para activar/desactivar 2FA desde el frontend
2. Historial de intentos de login
3. Bloqueo temporal después de múltiples intentos fallidos
4. Soporte para múltiples métodos de 2FA (SMS, autenticador)
5. Recuperación de contraseña con verificación por email
6. Panel de administración para gestionar usuarios
7. Implementar bcrypt para hashear contraseñas
8. Agregar rate limiting
9. Sistema de notificaciones de actividad sospechosa
10. Opción de recordar dispositivo por 30 días

## CONTACTO Y SOPORTE

Para preguntas o problemas relacionados con esta implementación, contactar al equipo de desarrollo.

---

**Fecha de implementación**: Noviembre 18, 2025
**Versión**: 1.0.0
**Estado**: Implementado y funcional
