# 🗡️ RPG LOG — Personal RPG System

Sistema de gamificación personal tipo RPG. El usuario crea un perfil, completa misiones diarias y semanales, juega minijuegos, compra títulos y sube de nivel mientras mejora sus hábitos reales.

---

## 🚀 Instalación y arranque

```bash
npm install
npm start        # http://localhost:3000
```

> Requiere **Node.js ≥ 16** y **npm ≥ 8**.

---

## 📁 Estructura del proyecto

```
rpg-log/
├── public/
└── src/
    ├── App.jsx                        ← Raíz: controla autenticación y renderiza AuthScreen o HomeScreen
    ├── index.js                       ← Punto de entrada React
    │
    ├── screens/                       ← Pantallas completas (enrutadas desde HomeScreen)
    │   ├── AuthScreen.jsx             ← Login / Registro con overlay de bienvenida
    │   ├── HomeScreen.jsx             ← Dashboard central: maneja TODO el estado global
    │   ├── MissionsScreen.jsx         ← Misiones diarias, semanales y especial (con localStorage por usuario)
    │   ├── MiniGamesScreen.jsx        ← Lobby de minijuegos y lanzador
    │   ├── ShopScreen.jsx             ← Tienda: tabs Misiones Custom y Títulos
    │   └── SettingsScreen.jsx         ← Ajustes: perfil, monedero, notificaciones, logout
    │
    ├── components/
    │   ├── Navbar.jsx                 ← Barra superior: nav, monedas, campana, avatar
    │   ├── NotificationPanel.jsx      ← Dropdown de notificaciones (desde campana)
    │   ├── HeroSection.jsx            ← Cabecera del héroe: nivel, XP, saludo por hora
    │   ├── StatCards.jsx              ← Tarjetas de las 6 estadísticas con barras de XP
    │   ├── ProgressSection.jsx        ← Misiones completadas hoy (reactivo, tiempo real)
    │   ├── MissionCard.jsx            ← Tarjeta de misión: type="daily" sin barra | type="weekly" con barra
    │   ├── SpecialMission.jsx         ← Misión especial destacada (bloqueada hasta nivel 5)
    │   ├── CompleteModal.jsx          ← Modal de recompensas con bonus foto ×2 XP
    │   ├── GameWrapper.jsx            ← Envuelve cada juego: topbar + HUD + ResultScreen
    │   ├── LoginForm.jsx              ← Formulario de inicio de sesión
    │   ├── SignupForm.jsx             ← Formulario de registro
    │   ├── Stars.jsx                  ← Fondo de estrellas animadas (AuthScreen)
    │   │
    │   ├── games/
    │   │   ├── OsuGame.jsx            ← Reflex Burst: círculos que aparecen y desaparecen
    │   │   ├── WordGame.jsx           ← Word Chaos: ordenar letras contra reloj
    │   │   ├── SimonGame.jsx          ← Simon Glitch: memorizar secuencia de colores
    │   │   ├── TetrisGame.jsx         ← Pixel Blocks: Tetris clásico
    │   │   ├── RhythmGame.jsx         ← Rhythm Strike: notas horizontales estilo Muse Dash
    │   │   └── ResultScreen.jsx       ← Pantalla de resultados: medalla, score, recompensas
    │   │
    │   ├── shop/
    │   │   ├── CustomMissionsTab.jsx  ← 3 slots de compra, timer real, botón completar al llegar a 0
    │   │   ├── TitlesTab.jsx          ← Catálogo de títulos, compra, equipar, bonus aplicados
    │   │   ├── MissionBuilder.jsx     ← Constructor modal de misiones custom
    │   │   └── ConfirmModal.jsx       ← Modal de confirmación genérico
    │   │
    │   └── settings/
    │       ├── AvatarDropdown.jsx     ← Menú del avatar: perfil, monedero, notifs, logout
    │       ├── ProfileSection.jsx     ← Editar nombre, avatar y título
    │       ├── WalletSection.jsx      ← Monedero e historial de transacciones
    │       ├── NotificationsSection.jsx ← Bandeja de notificaciones + preferencias
    │       └── LogoutSection.jsx      ← Cerrar sesión
    │
    ├── styles/
    │   ├── globals.css                ← Variables CSS, reset, tipografías pixel/VT
    │   ├── AuthScreen.css             ← Pantalla de login/registro
    │   ├── HomeScreen.css             ← Navbar, hero, stats, progress, responsive
    │   ├── MissionsScreen.css         ← Filtros, grupos por stat, modal de completar
    │   ├── MiniGamesScreen.css        ← Lobby, pantalla de juego, ResultScreen
    │   ├── ShopScreen.css             ← Tabs, slots, títulos, builder modal
    │   └── SettingsScreen.css         ← Ajustes, dropdown, panel de notificaciones
    │
    └── data/
        ├── constants.js               ← Stats, misiones (todas done:false), nav items
        ├── games.js                   ← Configuración de los 5 minijuegos
        ├── shop.js                    ← TITLES_DATA con bonus, SLOT_PRICES, DURATIONS
        └── settings.js                ← Avatars, historial demo, NOTIF_SETTINGS
```

---

## 🏗️ Arquitectura y flujo de datos

### Estado global (`HomeScreen.jsx`)
`HomeScreen` es el único contenedor de estado. Todos los datos fluyen hacia abajo via props y los eventos suben via callbacks.

```
App
└── HomeScreen (estado global)
    ├── user: { name, avatar, title, level, xp, xpMax }
    ├── stats: [{ id, name, lv, xp, max }] × 6
    ├── coins: number
    ├── notifs: Notification[]
    ├── titlesState: { ownedIds: Set, equippedId }
    ├── customMissions: CustomMission[]
    └── unlockedSlots: Set<0|1|2>
```

### Persistencia (localStorage por usuario)
Todas las claves llevan el nombre del usuario sanitizado como sufijo para aislar cuentas:

| Clave | Contenido |
|-------|-----------|
| `rpglog_missions_{user}` | Estado y timestamps de misiones diarias/semanales |
| `rpglog_titles_{user}` | IDs de títulos comprados + ID equipado |
| `rpglog_customs_{user}` | Misiones custom activas con `startedAt` y `durationMs` |
| `rpglog_slots_{user}` | Array de índices de slots desbloqueados `[0,1,2]` |
| `rpglog_notifs_{user}` | Historial de notificaciones |
| `rpglog_records_{user}` | Mejores scores por minijuego |

---

## ⚙️ Sistemas implementados

### Misiones
- **Diarias**: se muestran sin barra de progreso. `done: false` al arrancar siempre. Se reinician cada 24h.
- **Semanales**: barra de progreso que avanza al completar diarias del mismo stat. Se reinician cada 7 días.
- **Especial**: bloqueada hasta nivel 5. Desbloqueo automático al alcanzarlo. 2× XP con foto de evidencia.
- **Custom**: 3 slots de pago (🪙150 / 🪙300 / 🪙500). Timer de cuenta regresiva. Botón COMPLETAR al llegar a 0.

### Sistema de títulos
- 11 títulos en 4 rarezas: Gratis / Común / Raro / Épico.
- Los raros y épicos aplican bonus reales: `xpGlobal`, `coinBonus`, `xpStat + xpStatMult`.
- Estado persistido en localStorage. El título equipado se refleja en Navbar, Dropdown y ProfileSection.

### Notificaciones
- Panel accesible desde la campana 🔔 del Navbar (sin pasar por ajustes).
- Notificaciones automáticas: misión completada, subida de nivel, misión especial desbloqueada, timer custom expirado, récord en minijuego, título comprado/equipado.
- Badge con conteo de no leídas. Marcar individual o todo leído. Limpiar todo.

### Minijuegos
- 5 juegos. Al terminar: pantalla de resultados con medalla (🥇/🥈/🥉), score, XP y monedas.
- Fórmula: `xp = round(base × (1 + score/200))`, `coins = round(base × (1 + score/300))`.
- Se detectan nuevos récords por juego y se notifica.

---

## 🎮 Minijuegos disponibles

| Juego | Stat | Dificultad | XP base | 🪙 base | Notas |
|-------|------|-----------|---------|--------|-------|
| 🎯 Reflex Burst | Agilidad | Intermedio | 45 | 28 | Círculos con anillo que se cierra |
| 📝 Word Chaos | Inteligencia | Medio | 50 | 30 | Timer visible, −5s por error |
| 🔲 Simon Glitch | Inteligencia | Medio | 55 | 35 | Secuencia de colores creciente |
| 🧱 Pixel Blocks | Inteligencia + Agilidad | Fácil | 60 | 38 | Velocidad sube cada 5000 pts |
| 🎵 Rhythm Strike | Agilidad | Difícil | 70 | 45 | Notas horizontales, velocidad 2.5 |

---

## 👑 Títulos y bonus

| Rareza | Precio | Nivel mín. | Bonus |
|--------|--------|-----------|-------|
| Gratis (×3) | 🪙0 | 1–7 | Solo cosmético |
| Común (×3) | 🪙100–200 | 1–5 | Solo cosmético |
| Raro (×3) | 🪙350–600 | 5–8 | +3% XP global · +5% XP stat · monedas extra |
| Épico (×3) | 🪙1000–1500 | 10 | +10% XP global · monedas extra |

---

## 🔧 Variables de entorno y backend

Actualmente el proyecto funciona 100% en frontend con datos simulados.
Al integrar el backend crear un `.env` en la raíz:

```env
REACT_APP_API_URL=https://tu-api.com
REACT_APP_VERSION=1.0.0
```

Ver `RPG_LOG_Backend_Spec.docx` para la especificación completa del API (Auth JWT, 16 tablas PostgreSQL, Redis, S3).

---

## 🤝 Guía para el equipo

### Convenciones de código
- **Comentarios**: español. Todos los archivos tienen JSDoc en español al inicio.
- **Nombres de archivos**: inglés (PascalCase para componentes, camelCase para datos).
- **Estado**: sube lo más arriba posible. `HomeScreen` es la única fuente de verdad.
- **Estilos**: CSS modules clásico. No usar inline styles salvo para variables dinámicas (`--accent`, `--color`).
- **localStorage**: siempre con sufijo de usuario (`_${userId}`). Nunca clave global.

### Agregar una nueva misión
1. Añadir objeto en `src/data/constants.js` → `DAILY_MISSIONS` o `WEEKLY_MISSIONS`.
2. Asignar `done: false` y `progress: 0` siempre.
3. El sistema de persistencia y reset lo maneja `MissionsScreen` automáticamente.

### Agregar un nuevo minijuego
1. Crear `src/components/games/NuevoJuego.jsx` que acepte `onEnd(score)`.
2. Registrarlo en `GAME_COMPONENTS` dentro de `GameWrapper.jsx`.
3. Añadir su entrada en `src/data/games.js`.

### Agregar un nuevo título
1. Añadir objeto en `TITLES_DATA` de `src/data/shop.js`.
2. Incluir el campo `bonus: { xpGlobal, coinBonus, xpStat, xpStatMult }`.
3. El sistema de compra/equipar/persistencia lo maneja `HomeScreen` automáticamente.

### Pull requests
- Una rama por feature: `feat/nombre-feature`.
- No modificar `globals.css` sin revisar impacto global.
- Probar en mobile (375px) antes de abrir PR.

---

## 📋 Pendientes (backend)

- [ ] Reemplazar `setTimeout` de login/registro por `POST /auth/login` y `POST /auth/register`
- [ ] Cargar perfil real desde `GET /users/:id/profile`
- [ ] Persistir stats en `PATCH /users/:id/stats`
- [ ] Sistema de logros real desde `GET /achievements`
- [ ] Push notifications (Web Push API)
- [ ] Foto de evidencia → S3 vía `POST /missions/:id/evidence`
