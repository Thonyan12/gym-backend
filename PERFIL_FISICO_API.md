# API Perfil Físico de Miembros - UTMACH GYM

## 📋 Descripción
Sistema completo para gestión de perfiles físicos de miembros con asignación automática de rutinas mediante triggers de PostgreSQL.

## 🚀 Características Principales
- ✅ **Creación automática de rutinas** mediante triggers al registrar perfil físico
- ✅ **Historial completo** de perfiles y rutinas
- ✅ **Cálculo automático de IMC** y categorización
- ✅ **Evolución temporal** del estado físico
- ✅ **Autenticación por rol** (miembro/admin)
- ✅ **Notificaciones automáticas** al actualizar perfil

## 📊 Estructura de Respuesta Estándar
```json
{
  "success": true,
  "message": "Mensaje descriptivo",
  "data": {
    "miembro": { "info_del_miembro": "..." },
    "perfil_fisico_actual": { "ultimo_perfil": "..." },
    "historial_perfiles": [ "array_historiales" ],
    "historial_rutinas": [ "array_rutinas" ],
    "imc_actual": 24.5,
    "categoria_imc": "Peso normal",
    "estadisticas": { "stats_generales": "..." }
  },
  "timestamp": "2025-07-20T10:30:00.000Z"
}
```

## 🔐 Endpoints para MIEMBROS

### 1. GET `/api/perfil-fisico/mi-perfil-completo`
**Descripción:** Obtiene toda la información del perfil en una sola consulta
**Autenticación:** Requerida (miembro)
**Headers:**
```
Authorization: Bearer <token_jwt>
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Perfil completo obtenido exitosamente",
  "data": {
    "miembro": {
      "id_miembro": 1,
      "cedula": "1234567890",
      "nombre_completo": "Juan Pérez García",
      "edad": 25,
      "contextura": "Mesomorfo",
      "objetivo": "Ganar masa muscular",
      "sexo": "Masculino"
    },
    "perfil_fisico_actual": {
      "id_perfil": 5,
      "altura": 175.0,
      "peso": 70.5,
      "observaciones": "Progreso constante",
      "fecha_registro": "2025-07-20",
      "imc_calculado": 23.02,
      "categoria_imc": "Peso normal"
    },
    "historial_perfiles": [
      {
        "id_perfil": 5,
        "altura": 175.0,
        "peso": 70.5,
        "imc_calculado": 23.02,
        "categoria_imc": "Peso normal",
        "fecha_registro": "2025-07-20",
        "diferencia_peso": 2.0
      }
    ],
    "historial_rutinas": [
      {
        "id_asignacion": 12,
        "rutina_nombre": "Intermedio - Fuerza",
        "rutina_tipo": "Fuerza",
        "rutina_nivel": "Intermedio",
        "descripcion_asignacion": "Rutina asignada automáticamente por progreso físico",
        "fecha_inicio": "2025-07-20",
        "estado_rutina": true,
        "duracion_semanas": "6 semanas"
      }
    ],
    "imc_actual": 23.02,
    "categoria_imc": "Peso normal",
    "estadisticas": {
      "total_perfiles": 3,
      "peso_minimo": 68.0,
      "peso_maximo": 72.0,
      "peso_promedio": 70.17
    },
    "tiempo_en_gimnasio": "3 mes(es)"
  }
}
```

### 2. POST `/api/perfil-fisico/crear`
**Descripción:** Crea nuevo perfil físico (trigger automático asigna rutinas)
**Autenticación:** Requerida (miembro)

**Body (JSON):**
```json
{
  "altura": 175.5,
  "peso": 71.2,
  "observaciones": "Me siento más fuerte, veo progreso en el gimnasio"
}
```

**Validaciones:**
- `altura`: Obligatorio, entre 120-250 cm
- `peso`: Obligatorio, entre 30-300 kg
- `observaciones`: Opcional

**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "message": "Perfil físico creado exitosamente. Sistema evaluando nuevas rutinas automáticamente.",
  "data": {
    "nuevo_perfil": {
      "id_perfil": 6,
      "id_miembro": 1,
      "altura": 175.5,
      "peso": 71.2,
      "observaciones": "Me siento más fuerte, veo progreso en el gimnasio",
      "fecha_registro": "2025-07-20",
      "imc_calculado": 23.12,
      "categoria_imc": "Peso normal"
    },
    "perfil_completo": { "...datos_actualizados" }
  },
  "trigger_info": "Sistema evaluando y asignando nuevas rutinas automáticamente"
}
```

### 3. GET `/api/perfil-fisico/historial`
**Descripción:** Solo historial de perfiles físicos
**Autenticación:** Requerida (miembro)

### 4. GET `/api/perfil-fisico/historial-rutinas`
**Descripción:** Solo historial de rutinas asignadas
**Autenticación:** Requerida (miembro)

### 5. GET `/api/perfil-fisico/evolucion-imc`
**Descripción:** Evolución temporal del IMC con progreso
**Autenticación:** Requerida (miembro)

## 👨‍💼 Endpoints para ADMINISTRADORES

### 1. GET `/api/perfil-fisico/miembro/:id/completo`
**Descripción:** Admin ve perfil completo de cualquier miembro
**Autenticación:** Requerida (admin)

### 2. POST `/api/perfil-fisico/miembro/:id/crear`
**Descripción:** Admin crea perfil para un miembro específico
**Autenticación:** Requerida (admin)

### 3. GET `/api/perfil-fisico/miembro/:id/historial`
**Descripción:** Admin ve historial de perfiles de un miembro
**Autenticación:** Requerida (admin)

### 4. GET `/api/perfil-fisico/miembro/:id/historial-rutinas`
**Descripción:** Admin ve historial de rutinas de un miembro
**Autenticación:** Requerida (admin)

### 5. GET `/api/perfil-fisico/miembro/:id/evolucion-imc`
**Descripción:** Admin ve evolución IMC de un miembro
**Autenticación:** Requerida (admin)

## 🔧 Triggers Automáticos Configurados

### 1. **Trigger al crear perfil físico:**
```sql
-- Se ejecuta automáticamente cuando se crea un nuevo perfil
-- Evalúa características físicas y asigna rutinas apropiadas
trigger_actualizar_rutinas_por_perfil()
```

### 2. **Función de evaluación de rutinas:**
```sql
-- Analiza: IMC, contextura, edad, progreso previo
-- Asigna rutina automáticamente según algoritmo inteligente
evaluar_nuevas_rutinas_por_perfil()
```

### 3. **Notificaciones automáticas:**
- ✅ Al miembro: Nueva rutina asignada
- ✅ A admins: Perfil actualizado, evaluando rutinas

## 📊 Categorías de IMC
- **Bajo peso:** < 18.5
- **Peso normal:** 18.5 - 24.9
- **Sobrepeso:** 25.0 - 29.9
- **Obesidad:** ≥ 30.0

## 🔒 Seguridad
- **JWT Authentication** en todos los endpoints
- **Autorización por roles** (miembro/admin)
- **Validación de datos** de entrada
- **SQL Injection protection** con parámetros preparados

## ⚡ Optimizaciones
- **Consultas eficientes** con JOIN optimizados
- **Índices en BD** para búsquedas rápidas
- **Caching de cálculos** de IMC
- **Paginación** en historiales largos

## 🚨 Códigos de Error Comunes

| Código | Descripción |
|--------|-------------|
| 400 | Datos de entrada inválidos |
| 401 | Token no proporcionado/inválido |
| 403 | Rol insuficiente para la acción |
| 404 | Miembro no encontrado |
| 500 | Error interno del servidor |

## 🧪 Testing
```bash
# Ejemplo de curl para crear perfil
curl -X POST http://localhost:3000/api/perfil-fisico/crear \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu_token>" \
  -d '{
    "altura": 175.5,
    "peso": 71.2,
    "observaciones": "Progreso constante en el gimnasio"
  }'
```

## 📁 Estructura de Archivos Creados
```
src/
├── models/
│   └── perfilFisico.models.js     # Consultas a base de datos
├── services/
│   └── perfilFisico.service.js    # Lógica de negocio
├── controllers/
│   └── perfilFisico.controller.js # Manejo de requests/responses
└── routes/
    └── perfilFisico.routes.js     # Definición de endpoints
```

## 🔄 Flujo de Trabajo
1. **Miembro actualiza perfil** → POST `/crear`
2. **Trigger automático evalúa** progreso físico
3. **Sistema asigna nueva rutina** si corresponde
4. **Notificaciones enviadas** a miembro y admins
5. **Historial actualizado** automáticamente

---
**Desarrollado para UTMACH GYM** 🏋️‍♂️
*Sistema inteligente de gestión física con triggers automáticos*
