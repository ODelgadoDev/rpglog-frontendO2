# RPGLog Backend API

Backend de RPGLog conectado a MongoDB Atlas.
Stack: Node.js + Express + Mongoose + JWT + bcrypt

## Estado actual
- ✅ Autenticación (registro, login, /me)
- ✅ Perfil de usuario con XP, nivel, monedas y streak
- ✅ Sistema de stats (str, res, agi, int, cre, com)
- ✅ Misiones diarias con seed automático
- ✅ Misiones custom con evidencia foto y GPS
- ✅ Motor de recompensas con bonus por título
- ✅ XpLog (historial de XP ganada)
- ✅ Sincronización básica (push/pull)
- ⏳ Sincronización completa de progreso post-misión (en desarrollo)

## Variables de entorno requeridas (.env)
PORT=3001
NODE_ENV=development
MONGO_URI=mongodb+srv://...
JWT_SECRET=...
CORS_ORIGIN=http://localhost:5173

## Instalación
npm install
npm run dev

## Endpoints principales

### Auth
- `GET /api/auth/ping` - Ping
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Información del usuario autenticado

### Progress
- `GET /api/progress/summary` - Resumen de progreso (nivel, XP, coins, stats)

### Quests
- `GET /api/quests` - Listar quests
- `POST /api/quests` - Crear quest
- `PATCH /api/quests/:id/complete` - Completar quest
- `DELETE /api/quests/:id` - Eliminar quest
- `POST /api/quests/seed-daily` - Generar quests diarias
- `GET /api/quests/custom` - Listar custom quests
- `POST /api/quests/custom` - Crear custom quest
- `PATCH /api/quests/custom/:id` - Editar custom quest
- `DELETE /api/quests/custom/:id` - Eliminar custom quest

### Sync
- `POST /api/sync/push` - Push sincronización
- `GET /api/sync/pull` - Pull sincronización

## Estructura del proyecto
rpglog-backend/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── progress.controller.js
│   │   ├── quests.controller.js
│   │   └── sync.controller.js
│   ├── db/
│   │   └── mongo.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── Quest.js
│   │   ├── User.js
│   │   ├── UserProfile.js
│   │   ├── UserStat.js
│   │   └── XpLog.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── progress.routes.js
│   │   ├── quests.routes.js
│   │   └── sync.routes.js
│   ├── services/
│   │   ├── rewardEngine.service.js
│   │   └── userProgress.service.js
│   ├── utils/
│   │   ├── dailyQuests.js
│   │   ├── jwt.js
│   │   └── progression.js
│   ├── app.js
│   └── index.js
├── .env
├── .env.example
├── package.json
└── README.md

## Notas de seguridad
- El archivo .env NO debe subirse al repositorio
- Usar JWT_SECRET generado aleatoriamente en producción



