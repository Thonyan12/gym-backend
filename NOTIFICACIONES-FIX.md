# Guía Rápida - Rutas de Notificaciones CORRECTAS

## ⚠️ CORRECCIÓN IMPORTANTE

La ruta `/api/notificaciones-entrenador/received` **NO EXISTE**.

---

## ✅ Rutas que SÍ FUNCIONAN

### Para TODOS los roles (Admin, Entrenador, Miembro)

```javascript
// Usar la ruta genérica /api/notificaciones
GET    /api/notificaciones/received     // ✅ Notificaciones recibidas
GET    /api/notificaciones/sent         // ✅ Notificaciones enviadas  
GET    /api/notificaciones/all          // ✅ Todas del usuario
GET    /api/notificaciones              // ✅ Listar todas (admin)
POST   /api/notificaciones              // ✅ Crear notificación
PUT    /api/notificaciones/:id          // ✅ Marcar como leída
DELETE /api/notificaciones/:id          // ✅ Eliminar (admin)
```

### Para Entrenadores específicamente

```javascript
GET    /api/notificaciones-entrenador/mis-notificaciones     // ✅ Mis notificaciones
POST   /api/notificaciones-entrenador                        // ✅ Crear
PUT    /api/notificaciones-entrenador/:id/leida             // ✅ Marcar leída
```

### Para Miembros específicamente

```javascript
GET    /api/notificaciones-unificadas                // ✅ Todas las notificaciones
GET    /api/notificaciones-unificadas/no-leidas     // ✅ Solo no leídas
PUT    /api/notificaciones-unificadas/:origen/:id/leida  // ✅ Marcar leída

GET    /api/notificaciones-miembro                  // ✅ Listar
PUT    /api/notificaciones-miembro/:id/leido        // ✅ Marcar leída
```

---

## 🎯 Recomendación para el Frontend

**Usa las rutas genéricas `/api/notificaciones/*` porque funcionan para TODOS los roles:**

```javascript
// Para entrenadores, en lugar de:
// ❌ GET /api/notificaciones-entrenador/received (NO EXISTE)

// Usa:
✅ GET /api/notificaciones/received
✅ GET /api/notificaciones/all
```

---

## Ejemplo Completo

```javascript
// 1. Login
const { token } = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ usuario: 'entrenador1', contrasenia: 'pass123' })
}).then(r => r.json());

// 2. Obtener notificaciones recibidas (funciona para todos)
const notificaciones = await fetch('http://localhost:3000/api/notificaciones/received', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json());

console.log(notificaciones);
```

---

## Verificado con PowerShell

```powershell
$token = (Invoke-RestMethod -Uri http://localhost:3000/api/auth/login -Method POST -Body (@{usuario="admin"; contrasenia="Admin123"} | ConvertTo-Json) -ContentType "application/json").token

# ✅ Funciona
Invoke-RestMethod -Uri http://localhost:3000/api/notificaciones/received -Headers @{Authorization="Bearer $token"}

# ✅ Funciona (solo para entrenadores con token de entrenador)
Invoke-RestMethod -Uri http://localhost:3000/api/notificaciones-entrenador/mis-notificaciones -Headers @{Authorization="Bearer $token"}
```

---

## Resumen

| Ruta Original (frontend) | Estado | Usar en su lugar |
|--------------------------|--------|------------------|
| `/api/notificaciones-entrenador/received` | ❌ 404 | `/api/notificaciones/received` |
| `/api/notificaciones-entrenador/mis-notificaciones` | ✅ OK | - |
| `/api/notificaciones/received` | ✅ OK | - |
| `/api/notificaciones/sent` | ✅ OK | - |
| `/api/notificaciones/all` | ✅ OK | - |

**Actualiza tu frontend para usar `/api/notificaciones/received` en lugar de `/api/notificaciones-entrenador/received`.**
