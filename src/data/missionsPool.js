/**
 * data/missionsPool.js — Catálogo completo de misiones para selección aleatoria
 *
 * getRandomDailyMissions(userId) → devuelve 6 misiones aleatorias (1 por stat)
 * usando un seed diario para que sean consistentes dentro del mismo día pero
 * distintas cada 6 horas (o cuando el usuario resetea).
 */

// ─────────────────────────────────────────────────────────────────
// CATÁLOGO BASE (todas las misiones posibles)
// ─────────────────────────────────────────────────────────────────

export const MISSIONS_POOL = {
  // ── FUERZA ────────────────────────────────────────────────────
  FUERZA: [
    {
      name: "20 Sentadillas",
      desc: "Haz 20 sentadillas seguidas sin parar.",
      xp: 50, coins: 30,
      photoEvidenceEnabled: true,  photoBonusXp: 10, photoBonusCoins: 5,
    },
    {
      name: "15 Flexiones",
      desc: "Realiza 15 flexiones de pecho completas.",
      xp: 50, coins: 30,
      photoEvidenceEnabled: true,  photoBonusXp: 10, photoBonusCoins: 5,
    },
    {
      name: "Peso ligero 10 min",
      desc: "Levanta peso ligero durante 10 minutos continuos.",
      xp: 45, coins: 28,
      photoEvidenceEnabled: true,  photoBonusXp: 8,  photoBonusCoins: 4,
    },
    {
      name: "Plancha 30 segundos",
      desc: "Mantén la posición de plancha durante 30 segundos.",
      xp: 40, coins: 25,
      photoEvidenceEnabled: true,  photoBonusXp: 8,  photoBonusCoins: 4,
    },
    {
      name: "10 Fondos en silla",
      desc: "Realiza 10 fondos de tríceps usando una silla.",
      xp: 45, coins: 28,
      photoEvidenceEnabled: true,  photoBonusXp: 8,  photoBonusCoins: 4,
    },
  ],

  // ── RESISTENCIA ───────────────────────────────────────────────
  RESISTENCIA: [
    {
      name: "Caminar 20 minutos",
      desc: "Sal a caminar durante al menos 20 minutos.",
      xp: 50, coins: 30,
      locationEvidenceEnabled: true, locationBonusXp: 25, locationBonusCoins: 10,
      photoEvidenceEnabled: true,    photoBonusXp: 10,    photoBonusCoins: 5,
    },
    {
      name: "Subir escaleras",
      desc: "Sube y baja escaleras durante 5 minutos.",
      xp: 45, coins: 28,
      photoEvidenceEnabled: true, photoBonusXp: 8, photoBonusCoins: 4,
    },
    {
      name: "Cardio ligero 15 min",
      desc: "Realiza cualquier actividad cardiovascular ligera por 15 min.",
      xp: 50, coins: 30,
      locationEvidenceEnabled: true, locationBonusXp: 20, locationBonusCoins: 8,
      photoEvidenceEnabled: true,    photoBonusXp: 10,    photoBonusCoins: 5,
    },
    {
      name: "Trotar 10 minutos",
      desc: "Trota a ritmo suave durante 10 minutos seguidos.",
      xp: 55, coins: 35,
      locationEvidenceEnabled: true, locationBonusXp: 25, locationBonusCoins: 10,
      photoEvidenceEnabled: true,    photoBonusXp: 10,    photoBonusCoins: 5,
    },
    {
      name: "Actividad continua 15 min",
      desc: "Muévete de forma continua sin parar por 15 minutos.",
      xp: 45, coins: 28,
      photoEvidenceEnabled: true, photoBonusXp: 8, photoBonusCoins: 4,
    },
  ],

  // ── AGILIDAD ──────────────────────────────────────────────────
  AGILIDAD: [
    {
      name: "Saltos de coordinación",
      desc: "Haz 20 saltos suaves coordinando brazos y piernas.",
      xp: 45, coins: 28,
      photoEvidenceEnabled: true, photoBonusXp: 8, photoBonusCoins: 4,
    },
    {
      name: "Saltos laterales 30 seg",
      desc: "Salta de lado a lado sin parar durante 30 segundos.",
      xp: 45, coins: 28,
      photoEvidenceEnabled: true, photoBonusXp: 8, photoBonusCoins: 4,
    },
    {
      name: "Equilibrio 30 seg",
      desc: "Mantente en equilibrio sobre un pie durante 30 segundos.",
      xp: 40, coins: 25,
      photoEvidenceEnabled: true, photoBonusXp: 8, photoBonusCoins: 4,
    },
    {
      name: "Sprint de 100m",
      desc: "Corre a máxima velocidad 100 metros.",
      xp: 50, coins: 30,
      locationEvidenceEnabled: true, locationBonusXp: 20, locationBonusCoins: 8,
    },
    {
      name: "Ritmo con palmas",
      desc: "Sigue un patrón de ritmo con tus palmas por 2 minutos.",
      xp: 35, coins: 22,
    },
  ],

  // ── INTELIGENCIA ──────────────────────────────────────────────
  INTELIGENCIA: [
    {
      name: "Estudiar 20 minutos",
      desc: "Dedica 20 minutos enfocados a estudiar cualquier tema.",
      xp: 50, coins: 30,
      photoEvidenceEnabled: true, photoBonusXp: 10, photoBonusCoins: 5,
    },
    {
      name: "Leer 10 páginas",
      desc: "Lee al menos 10 páginas de cualquier libro.",
      xp: 40, coins: 25,
      photoEvidenceEnabled: true, photoBonusXp: 8, photoBonusCoins: 4,
    },
    {
      name: "Resolver acertijos",
      desc: "Resuelve 3 acertijos o puzzles lógicos.",
      xp: 45, coins: 28,
    },
    {
      name: "Ver contenido educativo",
      desc: "Mira un video educativo y escribe un resumen de 3 líneas.",
      xp: 45, coins: 28,
      photoEvidenceEnabled: true, photoBonusXp: 8, photoBonusCoins: 4,
    },
    {
      name: "Matemáticas básicas",
      desc: "Resuelve 10 operaciones matemáticas mentalmente.",
      xp: 40, coins: 25,
    },
  ],

  // ── CREATIVIDAD ───────────────────────────────────────────────
  CREATIVIDAD: [
    {
      name: "Dibujar 15 minutos",
      desc: "Dibuja lo que quieras durante 15 minutos sin distracciones.",
      xp: 45, coins: 28,
      photoEvidenceEnabled: true, photoBonusXp: 10, photoBonusCoins: 5,
    },
    {
      name: "Escribir un texto",
      desc: "Escribe un párrafo sobre algo que te inspire hoy.",
      xp: 40, coins: 25,
      photoEvidenceEnabled: true, photoBonusXp: 8, photoBonusCoins: 4,
    },
    {
      name: "Crear una historia",
      desc: "Inventa una historia corta de al menos 5 oraciones.",
      xp: 45, coins: 28,
      photoEvidenceEnabled: true, photoBonusXp: 8, photoBonusCoins: 4,
    },
    {
      name: "Foto creativa",
      desc: "Toma una foto artística de algo cotidiano.",
      xp: 40, coins: 25,
      photoEvidenceEnabled: true, photoBonusXp: 12, photoBonusCoins: 6,
    },
    {
      name: "Idea de proyecto",
      desc: "Documenta una idea original de proyecto o creación.",
      xp: 40, coins: 25,
    },
  ],

  // ── COMUNICACIÓN ──────────────────────────────────────────────
  COMUNICACIÓN: [
    {
      name: "Iniciar conversación",
      desc: "Habla con alguien que no conoces bien hoy.",
      xp: 35, coins: 22,
    },
    {
      name: "Mensaje positivo",
      desc: "Envía un mensaje de apoyo o agradecimiento a alguien.",
      xp: 35, coins: 22,
      photoEvidenceEnabled: true, photoBonusXp: 6, photoBonusCoins: 3,
    },
    {
      name: "Actividad social",
      desc: "Participa en una actividad con otras personas.",
      xp: 45, coins: 28,
      locationEvidenceEnabled: true, locationBonusXp: 15, locationBonusCoins: 6,
      photoEvidenceEnabled: true,    photoBonusXp: 8,     photoBonusCoins: 4,
    },
    {
      name: "Agradecer a alguien",
      desc: "Agradece sinceramente a alguien que te ayudó recientemente.",
      xp: 30, coins: 20,
    },
    {
      name: "Llamada breve",
      desc: "Llama por teléfono a alguien con quien no hayas hablado esta semana.",
      xp: 35, coins: 22,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────
// Meta-datos por stat (mapeados desde el pool)
// ─────────────────────────────────────────────────────────────────
const STAT_META = {
  FUERZA:       { id: "str", icon: "🟥", color: "#e05252" },
  RESISTENCIA:  { id: "res", icon: "🟦", color: "#5b8dd9" },
  AGILIDAD:     { id: "agi", icon: "🟩", color: "#52c97a" },
  INTELIGENCIA: { id: "int", icon: "🟪", color: "#a855f7" },
  CREATIVIDAD:  { id: "cre", icon: "🟨", color: "#f5c842" },
  COMUNICACIÓN: { id: "com", icon: "🟧", color: "#f5853a" },
};

// Pseudo-RNG seedeado: devuelve un número en [0, max)
function seededRand(seed, max) {
  const x = Math.sin(seed) * 10000;
  return Math.floor((x - Math.floor(x)) * max);
}

// Seed que cambia cada 6 horas (en ms)
function getSeed(userId = "default") {
  const window6h = Math.floor(Date.now() / (6 * 60 * 60 * 1000));
  // Combina el período con el userId para que cada usuario tenga misiones únicas
  let userHash = 0;
  for (let i = 0; i < userId.length; i++) {
    userHash = (userHash * 31 + userId.charCodeAt(i)) & 0xffffffff;
  }
  return window6h + userHash;
}

/**
 * Genera 6 misiones diarias aleatorias (1 por cada stat).
 * @param {string} userId - ID del usuario para personalizar el seed
 * @param {number} extraOffset - offset adicional para el botón "cambiar misión"
 * @returns {Array} Array de 6 misiones listas para renderizar
 */
export function getRandomDailyMissions(userId = "default", extraOffset = 0) {
  const seed   = getSeed(userId) + extraOffset;
  const stats  = Object.keys(MISSIONS_POOL);
  let missionId = 100; // IDs altos para no chocar con semanales

  return stats.map((stat, statIdx) => {
    const pool  = MISSIONS_POOL[stat];
    const idx   = seededRand(seed + statIdx * 1000, pool.length);
    const base  = pool[idx];
    const meta  = STAT_META[stat];

    return {
      id:    missionId++,
      stat,
      icon:  meta.icon,
      color: meta.color,
      progress: 0,
      total:    1,
      unit:     "vez",
      done:     false,
      weeklyLink: null,
      weeklyIncrement: 1,
      // Copiamos todos los campos del template
      ...base,
      // Campos de evidencia con fallbacks seguros
      photoEvidenceEnabled:    base.photoEvidenceEnabled    ?? false,
      locationEvidenceEnabled: base.locationEvidenceEnabled ?? false,
      photoBonusXp:            base.photoBonusXp            ?? 0,
      photoBonusCoins:         base.photoBonusCoins         ?? 0,
      locationBonusXp:         base.locationBonusXp         ?? 0,
      locationBonusCoins:      base.locationBonusCoins      ?? 0,
    };
  });
}

/**
 * Obtiene UNA misión aleatoria distinta para una stat concreta.
 * Se usa en el botón "cambiar misión".
 * @param {string} stat    - Nombre del stat (ej: "FUERZA")
 * @param {string} exclude - Nombre de la misión a excluir
 */
export function getAlternateMission(stat, exclude, userId = "default") {
  const pool  = MISSIONS_POOL[stat] || [];
  const opts  = pool.filter(m => m.name !== exclude);
  if (opts.length === 0) return null;
  const idx   = Math.floor(Math.random() * opts.length);
  const base  = opts[idx];
  const meta  = STAT_META[stat];
  return {
    id:    Date.now(),
    stat,
    icon:  meta.icon,
    color: meta.color,
    progress: 0,
    total: 1,
    unit:  "vez",
    done:  false,
    weeklyLink: null,
    weeklyIncrement: 1,
    ...base,
    photoEvidenceEnabled:    base.photoEvidenceEnabled    ?? false,
    locationEvidenceEnabled: base.locationEvidenceEnabled ?? false,
    photoBonusXp:            base.photoBonusXp            ?? 0,
    photoBonusCoins:         base.photoBonusCoins         ?? 0,
    locationBonusXp:         base.locationBonusXp         ?? 0,
    locationBonusCoins:      base.locationBonusCoins      ?? 0,
  };
}