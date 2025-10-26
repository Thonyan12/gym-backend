# Plan de Sockets y Notificaciones

Decisiones tomadas:

- El servidor de Socket.IO residirá en `notifications-service` (puerto 3006).
- El `gateway` (puerto 3000) proxifica `/socket.io` y las rutas `/api/notificaciones` hacia `notifications-service`.
- El proxy está configurado con `ws: true` para permitir la negociación de WebSocket/upgrade.

Autenticación en sockets:

- El `notifications-service` valida el token JWT en el handshake mediante el mismo middleware `shared/middleware/auth.js`.
- El cliente puede enviar el token en el `identify` event (ya soportado por `src/services/socket.service.js`) o en los headers/query del handshake.

Estrategias de conexión de cliente:

1. Conexión a través del gateway (recomendado):
   - Cliente se conecta a `http://localhost:3000`.
   - El gateway proxifica la conexión a `notifications-service`.
   - Ventaja: solo un endpoint público (gateway), facilita CORS y TLS centralizados.

2. Conexión directa al notifications-service:
   - Cliente se conecta a `http://localhost:3006`.
   - Ventaja: evita la capa de proxy para tiempo real, ligeramente menos latencia.
   - Inconveniente: requiere exponer otro puerto y gestionar CORS/autenticación por separado.

Notas de implementación y pruebas:

- Si el proxy de WebSocket falla en algunos clientes, prueba conectar directo a `3006` para aislar el problema.
- Para depuración, habilitar logs en el proxy (`logLevel: 'debug'`) y en `socket.service`.
- Recomendado: validar el token en `connection`/`handshake` y forzar `disconnect()` si no es válido.

Compensaciones:

- Mantener el estado de sockets exclusivamente en `notifications-service` (no en gateway). Si necesitas emitir eventos desde otros servicios, estos pueden llamar el endpoint REST de `notifications-service` o publicar en una cola (RabbitMQ/Redis) para escalado.

Siguientes pasos:

- Implementar validación JWT en el handshake en `notifications-service` (puedo hacerlo si quieres).
- Añadir tests automáticos de WebSocket handshake a través del gateway.
