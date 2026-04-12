/**
 * data/constants.js — UPDATED
 *
 * DAILY_MISSIONS ahora se genera dinámicamente via missionsPool.js
 * (importar getRandomDailyMissions desde allí).
 *
 * Aquí quedan: WEEKLY_MISSIONS, SPECIAL_MISSION, y las constantes de UI.
 */

export const STATS = [
  { id: "str", name: "FUERZA",       icon: "🟥", color: "#e05252", lv: 7,  xp: 340, max: 500 },
  { id: "res", name: "RESISTENCIA",  icon: "🟦", color: "#5b8dd9", lv: 5,  xp: 210, max: 400 },
  { id: "agi", name: "AGILIDAD",     icon: "🟩", color: "#52c97a", lv: 6,  xp: 280, max: 450 },
  { id: "int", name: "INTELIGENCIA", icon: "🟪", color: "#a855f7", lv: 9,  xp: 480, max: 600 },
  { id: "cre", name: "CREATIVIDAD",  icon: "🟨", color: "#f5c842", lv: 4,  xp: 150, max: 350 },
  { id: "com", name: "COMUNICACIÓN", icon: "🟧", color: "#f5853a", lv: 6,  xp: 260, max: 450 },
];

export const INITIAL_STATS = [
  { id: "str", name: "FUERZA",       icon: "🟥", color: "#e05252", lv: 1, xp: 0, max: 200 },
  { id: "res", name: "RESISTENCIA",  icon: "🟦", color: "#5b8dd9", lv: 1, xp: 0, max: 200 },
  { id: "agi", name: "AGILIDAD",     icon: "🟩", color: "#52c97a", lv: 1, xp: 0, max: 200 },
  { id: "int", name: "INTELIGENCIA", icon: "🟪", color: "#a855f7", lv: 1, xp: 0, max: 200 },
  { id: "cre", name: "CREATIVIDAD",  icon: "🟨", color: "#f5c842", lv: 1, xp: 0, max: 200 },
  { id: "com", name: "COMUNICACIÓN", icon: "🟧", color: "#f5853a", lv: 1, xp: 0, max: 200 },
];

// Datos de demo — NO se usan como misiones activas; son solo para el dashboard de home
export const MISSIONS_TODAY = [];
export const ACHIEVEMENTS   = [];
export const XP_HISTORY     = [];

export const NAV_ITEMS = [
  { id: "home",      label: "INICIO",      icon: "🏠" },
  { id: "missions",  label: "MISIONES",    icon: "⚔️" },
  { id: "minigames", label: "MINI JUEGOS", icon: "🎮" },
  { id: "shop",      label: "TIENDA",      icon: "🏪" },
  { id: "settings",  label: "CONFIG",      icon: "⚙️" },
];

// DAILY_MISSIONS está vacío — se genera en runtime con getRandomDailyMissions()
// Se exporta vacío para no romper imports existentes.
export const DAILY_MISSIONS = [];

// ─── MISIONES SEMANALES ──────────────────────────────────────────
export const WEEKLY_MISSIONS = [
  {
    id: 7, name: "Leer 50 páginas",
    desc: "Completa 50 páginas de lectura esta semana.",
    stat: "INTELIGENCIA", icon: "🟪", color: "#a855f7",
    xp: 200, coins: 120, progress: 0, total: 50, unit: "págs", done: false,
  },
  {
    id: 8, name: "Entrenar 4 días",
    desc: "Haz al menos 1 misión de Fuerza o Resistencia en 4 días distintos.",
    stat: "FUERZA", icon: "🟥", color: "#e05252",
    xp: 250, coins: 150, progress: 0, total: 4, unit: "días", done: false,
  },
  {
    id: 9, name: "5 conversaciones nuevas",
    desc: "Inicia 5 conversaciones con personas distintas esta semana.",
    stat: "COMUNICACIÓN", icon: "🟧", color: "#f5853a",
    xp: 180, coins: 110, progress: 0, total: 5, unit: "convs", done: false,
  },
  {
    id: 10, name: "Semana creativa",
    desc: "Crea algo distinto cada día: dibujo, foto, texto, etc.",
    stat: "CREATIVIDAD", icon: "🟨", color: "#f5c842",
    xp: 190, coins: 115, progress: 0, total: 5, unit: "obras", done: false,
  },
  {
    id: 11, name: "Velocista semanal",
    desc: "Completa 5 misiones de Agilidad esta semana.",
    stat: "AGILIDAD", icon: "🟩", color: "#52c97a",
    xp: 210, coins: 125, progress: 0, total: 5, unit: "misiones", done: false,
  },
];

export const SPECIAL_MISSION = {
  id: 99,
  name: "MENTE Y MÚSCULO",
  desc: "Lee 5 páginas Y haz 15 sentadillas en el mismo día. El cuerpo y la mente crecen juntos.",
  stats: [
    { label: "INTELIGENCIA", color: "#a855f7", icon: "🟪" },
    { label: "FUERZA",       color: "#e05252", icon: "🟥" },
  ],
  icon: "⚡",
  xp: 160,
  coins: 100,
  locked: false,
};

export const PARTICLES = ["✨","⭐","💫","✦","★"].map((icon, i) => ({
  id: i, icon,
  x: 8 + i * 18,
  ps: `${0.55 + (i * 0.13)}rem`,
  pd: `${2 + (i * 0.4)}s`,
  pdelay: `${(i * 0.4)}s`,
}));

export const STAT_GROUPS = [
  { key: "FUERZA",       icon: "🟥", color: "#e05252" },
  { key: "RESISTENCIA",  icon: "🟦", color: "#5b8dd9" },
  { key: "AGILIDAD",     icon: "🟩", color: "#52c97a" },
  { key: "INTELIGENCIA", icon: "🟪", color: "#a855f7" },
  { key: "CREATIVIDAD",  icon: "🟨", color: "#f5c842" },
  { key: "COMUNICACIÓN", icon: "🟧", color: "#f5853a" },
];