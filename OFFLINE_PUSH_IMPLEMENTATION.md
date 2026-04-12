# Sincronización Offline + Notificaciones Push — Implementación Completada

## RESUMEN DE CAMBIOS

### PARTE 1: Sincronización Offline (PWA)

#### Frontend — Archivos Creados/Modificados:

1. **public/sw.js** — Service Worker Completo
   - Caching de assets estáticos
   - Network First para API (sin cachear)
   - Cache First para assets
   - Background Sync: sincroniza acciones pendientes al reconectarse
   - Push notifications: recibe notificaciones y maneja clicks

2. **src/services/offline.js** — Servicio IndexedDB
   - `openDB()` — Abre/crea base de datos offline
   - `savePendingAction()` — Guardar acciones cuando no hay conexión
   - `getPendingActions()` — Obtener acciones pendientes
   - `clearPendingActions()` — Limpiar cola
   - `requestBackgroundSync()` — Registrar sync con SW
   - `isOnline()` — Detectar estado de conexión

3. **src/hooks/useOfflineSync.js** — Hook React
   - Detecta cambios online/offline
   - Detección automática de reconexión
   - `safeApiCall()` — Wrapper para llamadas API con fallback offline
   - Retroalimentación de estado de conexión

4. **src/components/OfflineBanner.jsx** — Banner Visual
   - Se muestra cuando no hay conexión (fijo arriba)
   - Fondo rojo (#e05252)
   - Mensaje: "📡 SIN CONEXIÓN — TUS ACCIONES SE GUARDARÁN Y SINCRONIZARÁN AL RECONECTARTE"
   - Desaparece automáticamente al reconectarse

5. **src/screens/HomeScreen.jsx** — Integración
   - Imports nuevos: useOfflineSync, OfflineBanner, subscribeToPush
   - Hook: `const { online } = useOfflineSync()`
   - UseEffect: `subscribeToPush()` — suscribir a notificaciones push
   - Return: agregar `<OfflineBanner online={online} />` antes de Navbar

### PARTE 2: Notificaciones Push Web

#### Backend — Archivos Creados/Modificados:

1. **backend/.env** — Nuevas Variables
   ```
   VAPID_PUBLIC_KEY=BBOlHyQG_921CaUXTjFKrafpstgWLnq5wxVybgPX_NYuYBTuRb2k-GnNDsXm9BS4mFIl3vMNfjn1LyuCCck905U
   VAPID_PRIVATE_KEY=mejStIba_SosuOH8qiToQ2cch0jdeRKbpmi1QiPSqLA
   VAPID_EMAIL=mailto:admin@rpglog.com
   ```

2. **backend/package.json** — Nueva Dependencia
   - `web-push` — módulo para enviar notificaciones push

3. **backend/src/models/PushSubscription.js** — Modelo MongoDB
   - Almacena suscripciones de navegadores por usuario
   - Campos: userId, endpoint, keys (p256dh, auth)
   - Índice en userId para búsquedas rápidas

4. **backend/src/routes/push.routes.js** — Rutas Push
   - `POST /api/push/subscribe` — guardar suscripción del navegador
   - `POST /api/push/send` — enviar notificación (testing/interno)
   - `GET /api/push/vapid-key` — obtener public key para el frontend

5. **backend/src/app.js** — Integración
   - Import: `const pushRoutes = require("./routes/push.routes");`
   - Ruta: `app.use("/api/push", pushRoutes);`

#### Frontend — Archivos Creados:

6. **src/services/pushNotifications.js** — Servicio Push
   - `subscribeToPush()` — flujo completo de suscripción
   - Pide permiso al usuario (Notification API)
   - Obtiene VAPID key del backend
   - Registra push subscription
   - Envía suscripción al backend para almacenarla

## FLUJO FINAL

### Modo Offline:
1. Usuario pierde conexión
2. OfflineBanner muestra "SIN CONEXIÓN"
3. Acciones (misiones, minijuegos) se guardan en IndexedDB
4. Service Worker intenta sincronizar cada 5s
5. Cuando vuelve internet, Service Worker envía acciones pendientes al backend
6. Banner desaparece automáticamente

### Notificaciones Push:
1. Usuario hace login
2. HomeScreen llama a `subscribeToPush()` (3s después de montar)
3. Solicita permiso al navegador
4. Obtiene VAPID key de `GET /api/push/vapid-key`
5. Se suscribe a push del navegador
6. Envía suscripción a `POST /api/push/subscribe`
7. Backend almacena en MongoDB
8. Cuando hay evento, backend envía push a `POST /api/push/send`
9. Browser recibe notificación (incluso con app cerrada)
10. Click en notificación abre la app

## VALIDACIÓN

✅ Frontend build: OK (74.17 KB JavaScript)
✅ Backend sintaxis: OK (app.js, push.routes.js, PushSubscription.js)
✅ npm install web-push: OK (8 paquetes nuevos)
✅ VAPID keys generadas: OK
✅ Variables de entorno actualizadas: OK

