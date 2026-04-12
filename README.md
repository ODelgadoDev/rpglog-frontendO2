# RPG Log

RPG Log — Gamified habit tracker / RPG productivity app.

Descripción
-----------
RPG Log transforma tus hábitos en misiones y recompensas: completa misiones, gana XP y monedas, sube de nivel y mejora tus estadísticas. La aplicación es una PWA con frontend en React y backend en Node/Express que persiste datos en MongoDB.

Tech stack
----------
- Frontend: React (Create React App / react-scripts)
- Backend: Node.js, Express, Mongoose
- Database: MongoDB Atlas
- PWA: Service Worker + IndexedDB (cola de acciones pendientes)

Instalación (local)
-------------------
Requisitos: Node 18+, npm.

1) Clonar el repositorio

```bash
git clone <repo-url>
cd rpg-log
```

2) Frontend

```bash
cd rpg-log
npm install
npm run build      # (opcional) crea build de producción
npm start          # levanta dev server en http://localhost:3000
```

3) Backend

```bash
cd backend
npm install
# configura .env según la sección "Variables de entorno"
npm run dev        # usa nodemon en desarrollo (puerto por defecto: 3001)
```

Variables de entorno (.env)
---------------------------
Crea un archivo `.env` en `backend/` con las siguientes variables (ejemplo):

```
PORT=3001
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/rpglog?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:3000
VAPID_PUBLIC_KEY=<vapid_public>
VAPID_PRIVATE_KEY=<vapid_private>
VAPID_EMAIL=mailto:you@example.com
```

No subas tu `.env` al repositorio.

Autenticación (cómo funciona)
-----------------------------
- El frontend guarda únicamente el JWT en `localStorage` bajo `rpglog_token`.
- Al iniciar la app, el `AuthProvider` valida el token llamando a `GET /api/auth/me`.
  - Si es válido, carga `user`, `profile` y `stats` desde el backend.
  - Si es inválido, limpia el token y redirige a la pantalla de login.
- Todas las llamadas API adjuntan el header `Authorization: Bearer <token>`.
- En 401, el cliente limpia el token y emite un evento `rpglog:unauthorized` para forzar logout global.

Flujo de datos (Frontend → Backend → DB)
----------------------------------------
1. El frontend hace peticiones al endpoint central (`services/api.js`).
2. El backend valida token, aplica la lógica de negocio y persiste en MongoDB.
3. El backend devuelve el estado actualizado (profile, stats, quests) y el frontend refleja esos cambios en la UI.

Buenas prácticas aplicadas
-------------------------
- MongoDB es la única fuente de verdad para misiones, progreso y estadísticas.
- El frontend no debe volver a inicializarse desde datos de demo o localStorage.
- IndexedDB solo se usa para almacenar acciones pendientes (cola offline), no el estado completo.
- Centralización de llamadas API y manejo global de 401.

Características principales
--------------------------
- Sistema de misiones diarias y semanales
- Misiones custom con evidencia (foto/GPS)
- Sistema de XP, niveles y stats por usuario
- Tienda con títulos/cosméticos
- Soporte offline: cola de acciones y replay al reconectar
- PWA: Service Worker y cache de recursos

Estructura del proyecto
-----------------------
```
rpg-log/
  README.md
  package.json (frontend)
  public/
  src/
    components/      # UI atoms y molecules
    contexts/        # AuthProvider y otros providers
    hooks/           # hooks (useOfflineSync, etc.)
    screens/         # pantallas: HomeScreen, MissionsScreen, AuthScreen, etc.
    services/        # api.js, offline.js, pushNotifications
    data/            # placeholders mínimos (no usar como DB)
  backend/
    package.json
    src/
      controllers/
      models/
      routes/
      services/
      utils/
```

Despliegue
----------
- Frontend: generar `npm run build` y servir `build/` desde un host estático (Netlify, Vercel, S3+CloudFront, etc.)
- Backend: desplegar Node/Express a un host con acceso a MongoDB (Heroku, Render, DigitalOcean App Platform)
- Asegúrate de configurar `CORS_ORIGIN` en el backend con el dominio del frontend y de establecer `JWT_SECRET` adecuado.

Siguientes pasos sugeridos
-------------------------
- Ejecutar pruebas de integración (end-to-end) para flujos de login, completar misión y sincronización offline.
- Revisar y eliminar cualquier dato demo remanente (ya limpiado en `src/data/constants.js`).
- Opcional: migrar a un bundler moderno (Vite) si se desea equipo de build más rápido.

Contacto y mantenimiento
------------------------
Para cambios grandes de arquitectura crea una rama y abre PR con descripciones claras y checklist de regresión para QA.

---
Generado automáticamente por el equipo de ingeniería. Mantén este README actualizado con cambios de despliegue y variables de entorno.
