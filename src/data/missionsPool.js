/**
 * data/missionsPool.js — Catálogo completo de misiones para selección aleatoria
 *
 * getRandomDailyMissions(userId) → devuelve 6 misiones aleatorias (1 por stat)
 * usando un seed por usuario que cambia periódicamente para que se sientan
 * variadas y abundantes en el feed.
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
      photoEvidenceEnabled: true, photoBonusXp: 10, photoBonusCoins: 5,
    },
    {
      name: "15 Flexiones",
      desc: "Realiza 15 flexiones de pecho completas.",
      xp: 50, coins: 30,
      photoEvidenceEnabled: true, photoBonusXp: 10, photoBonusCoins: 5,
    },
    {
      name: "Peso ligero 10 min",
      desc: "Levanta peso ligero durante 10 minutos continuos.",
      xp: 45, coins: 28,
      photoEvidenceEnabled: true, photoBonusXp: 8, photoBonusCoins: 4,
    },
    {
      name: "Plancha 30 segundos",
      desc: "Mantén la posición de plancha durante 30 segundos.",
      xp: 40, coins: 25,
      photoEvidenceEnabled: true, photoBonusXp: 8, photoBonusCoins: 4,
    },
    {
      name: "10 Fondos en silla",
      desc: "Realiza 10 fondos de tríceps usando una silla.",
      xp: 45, coins: 28,
      photoEvidenceEnabled: true, photoBonusXp: 8, photoBonusCoins: 4,
    },
    {
      name: "25 Sentadillas lentas",
      desc: "Haz 25 sentadillas controladas manteniendo buena técnica.",
      xp: 52, coins: 32,
      photoEvidenceEnabled: true, photoBonusXp: 10, photoBonusCoins: 5,
    },
    {
      name: "12 Zancadas por pierna",
      desc: "Haz 12 zancadas con cada pierna sin prisa.",
      xp: 48, coins: 30,
      photoEvidenceEnabled: true, photoBonusXp: 8, photoBonusCoins: 4,
    },
    {
      name: "Plancha 45 segundos",
      desc: "Mantén la plancha 45 segundos con abdomen firme.",
      xp: 50, coins: 31,
      photoEvidenceEnabled: true, photoBonusXp: 9, photoBonusCoins: 4,
    },
    {
      name: "30 Elevaciones de talón",
      desc: "Haz 30 elevaciones de pantorrilla de forma continua.",
      xp: 38, coins: 24,
      photoEvidenceEnabled: true, photoBonusXp: 7, photoBonusCoins: 3,
    },
    {
      name: "Rutina de brazo 5 min",
      desc: "Haz una rutina ligera de brazos por 5 minutos.",
      xp: 44, coins: 27,
      photoEvidenceEnabled: true, photoBonusXp: 8, photoBonusCoins: 4,
    },
    {
      name: "15 Sentadillas con pausa",
      desc: "Haz 15 sentadillas pausando 1 segundo abajo.",
      xp: 46, coins: 28,
      photoEvidenceEnabled: true, photoBonusXp: 8, photoBonusCoins: 4,
    },
    {
      name: "10 Flexiones inclinadas",
      desc: "Haz 10 flexiones apoyándote en una superficie elevada.",
      xp: 42, coins: 26,
      photoEvidenceEnabled: true, photoBonusXp: 8, photoBonusCoins: 4,
    },
  ],

  // ── RESISTENCIA ───────────────────────────────────────────────
  RESISTENCIA: [
    {
      name: "Caminar 20 minutos",
      desc: "Sal a caminar durante al menos 20 minutos.",
      xp: 50, coins: 30,
      locationEvidenceEnabled: true, locationBonusXp: 25, locationBonusCoins: 10,
      photoEvidenceEnabled: true, photoBonusXp: 10, photoBonusCoins: 5,
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
      photoEvidenceEnabled: true, photoBonusXp: 10, photoBonusCoins: 5,
    },
    {
      name: "Trotar 10 minutos",
      desc: "Trota a ritmo suave durante 10 minutos seguidos.",
      xp: 55, coins: 35,
      locationEvidenceEnabled: true, locationBonusXp: 25, locationBonusCoins: 10,
      photoEvidenceEnabled: true, photoBonusXp: 10, photoBonusCoins: 5,
    },
    {
      name: "Actividad continua 15 min",
      desc: "Muévete de forma continua sin parar por 15 minutos.",
      xp: 45, coins: 28,
      photoEvidenceEnabled: true, photoBonusXp: 8, photoBonusCoins: 4,
    },
    {
      name: "Caminar 10 minutos",
      desc: "Camina 10 minutos sin detenerte.",
      xp: 35, coins: 22,
      locationEvidenceEnabled: true, locationBonusXp: 15, locationBonusCoins: 6,
    },
    {
      name: "Marcha en sitio 5 min",
      desc: "Marcha en tu lugar durante 5 minutos.",
      xp: 32, coins: 20,
      photoEvidenceEnabled: true, photoBonusXp: 6, photoBonusCoins: 3,
    },
    {
      name: "Moverte sin sentarte",
      desc: "Pasa 15 minutos activo sin sentarte.",
      xp: 40, coins: 25,
      photoEvidenceEnabled: true, photoBonusXp: 8, photoBonusCoins: 4,
    },
    {
      name: "Caminar una vuelta corta",
      desc: "Da una vuelta corta a tu cuadra o espacio cercano.",
      xp: 38, coins: 24,
      locationEvidenceEnabled: true, locationBonusXp: 14, locationBonusCoins: 5,
    },
    {
      name: "Bailar 10 minutos",
      desc: "Baila durante 10 minutos seguidos.",
      xp: 42, coins: 26,
      photoEvidenceEnabled: true, photoBonusXp: 8, photoBonusCoins: 4,
    },
    {
      name: "Pausa activa 8 min",
      desc: "Haz una pausa activa moviéndote 8 minutos.",
      xp: 36, coins: 22,
      photoEvidenceEnabled: true, photoBonusXp: 6, photoBonusCoins: 3,
    },
    {
      name: "Caminar escuchando música",
      desc: "Camina 15 minutos mientras escuchas algo que te motive.",
      xp: 43, coins: 27,
      locationEvidenceEnabled: true, locationBonusXp: 15, locationBonusCoins: 6,
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
    {
      name: "Paso rápido 2 min",
      desc: "Haz pasos rápidos en tu sitio durante 2 minutos.",
      xp: 34, coins: 21,
      photoEvidenceEnabled: true, photoBonusXp: 6, photoBonusCoins: 3,
    },
    {
      name: "Cambio de dirección",
      desc: "Haz desplazamientos cortos cambiando de dirección.",
      xp: 42, coins: 26,
      photoEvidenceEnabled: true, photoBonusXp: 8, photoBonusCoins: 4,
    },
    {
      name: "Talones a glúteos",
      desc: "Haz talones a glúteos durante 40 segundos.",
      xp: 39, coins: 24,
      photoEvidenceEnabled: true, photoBonusXp: 7, photoBonusCoins: 3,
    },
    {
      name: "Rodillas arriba 30 seg",
      desc: "Eleva rodillas rápidamente por 30 segundos.",
      xp: 41, coins: 25,
      photoEvidenceEnabled: true, photoBonusXp: 7, photoBonusCoins: 3,
    },
    {
      name: "Esquiva imaginaria",
      desc: "Haz movimientos rápidos de esquiva por 1 minuto.",
      xp: 37, coins: 23,
    },
    {
      name: "Pies rápidos",
      desc: "Mueve los pies rápidamente durante 20 segundos por 3 rondas.",
      xp: 43, coins: 27,
      photoEvidenceEnabled: true, photoBonusXp: 8, photoBonusCoins: 4,
    },
    {
      name: "Secuencia coordinada",
      desc: "Repite una secuencia corta de movimientos 5 veces.",
      xp: 40, coins: 25,
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
    {
      name: "Leer 5 páginas",
      desc: "Lee 5 páginas con atención y sin distracciones.",
      xp: 28, coins: 18,
      photoEvidenceEnabled: true, photoBonusXp: 5, photoBonusCoins: 2,
    },
    {
      name: "Repasar apuntes",
      desc: "Repasa tus apuntes durante 15 minutos.",
      xp: 34, coins: 21,
      photoEvidenceEnabled: true, photoBonusXp: 6, photoBonusCoins: 3,
    },
    {
      name: "Aprender un dato nuevo",
      desc: "Investiga y anota un dato interesante que no supieras.",
      xp: 30, coins: 19,
    },
    {
      name: "Video educativo corto",
      desc: "Ve un video educativo corto y resume la idea principal.",
      xp: 33, coins: 20,
      photoEvidenceEnabled: true, photoBonusXp: 6, photoBonusCoins: 3,
    },
    {
      name: "Ejercicio mental rápido",
      desc: "Haz una actividad mental breve por 5 minutos.",
      xp: 29, coins: 18,
    },
    {
      name: "Organizar una idea",
      desc: "Escribe una idea compleja de forma ordenada y clara.",
      xp: 36, coins: 22,
    },
    {
      name: "Memoriza 5 cosas",
      desc: "Memoriza una lista de 5 elementos y repítela.",
      xp: 31, coins: 19,
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
    {
      name: "Boceto rápido",
      desc: "Haz un boceto simple en menos de 10 minutos.",
      xp: 30, coins: 19,
      photoEvidenceEnabled: true, photoBonusXp: 6, photoBonusCoins: 3,
    },
    {
      name: "Escribe 4 líneas",
      desc: "Escribe 4 líneas sobre algo que imaginaste hoy.",
      xp: 28, coins: 18,
      photoEvidenceEnabled: true, photoBonusXp: 5, photoBonusCoins: 2,
    },
    {
      name: "Rediseña algo",
      desc: "Piensa cómo mejorarías un objeto cotidiano.",
      xp: 34, coins: 21,
    },
    {
      name: "Mini lluvia de ideas",
      desc: "Anota 5 ideas rápidas sobre cualquier tema.",
      xp: 33, coins: 20,
    },
    {
      name: "Crear nombre original",
      desc: "Inventa un nombre original para un proyecto o personaje.",
      xp: 27, coins: 17,
    },
    {
      name: "Doodle libre",
      desc: "Haz doodles durante 5 minutos sin juzgarte.",
      xp: 29, coins: 18,
      photoEvidenceEnabled: true, photoBonusXp: 5, photoBonusCoins: 2,
    },
    {
      name: "Escena imaginaria",
      desc: "Describe una escena imaginaria con 3 detalles visuales.",
      xp: 35, coins: 22,
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
      photoEvidenceEnabled: true, photoBonusXp: 8, photoBonusCoins: 4,
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
    {
      name: "Saludar primero",
      desc: "Toma la iniciativa y saluda primero a alguien hoy.",
      xp: 24, coins: 15,
    },
    {
      name: "Responder con calma",
      desc: "Responde un mensaje pendiente con atención y claridad.",
      xp: 26, coins: 16,
    },
    {
      name: "Dar una opinión",
      desc: "Expresa tu opinión sobre algo de forma respetuosa.",
      xp: 29, coins: 18,
    },
    {
      name: "Escuchar activamente",
      desc: "Dedica tiempo a escuchar de verdad a otra persona.",
      xp: 32, coins: 20,
    },
    {
      name: "Mensaje pendiente",
      desc: "Contesta ese mensaje que llevas tiempo posponiendo.",
      xp: 27, coins: 17,
    },
    {
      name: "Conversación breve",
      desc: "Mantén una conversación breve pero atenta con alguien.",
      xp: 30, coins: 19,
    },
    {
      name: "Halago sincero",
      desc: "Haz un comentario positivo y sincero a alguien.",
      xp: 28, coins: 18,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────
// Meta-datos por stat (mapeados desde el pool)
// ─────────────────────────────────────────────────────────────────
const STAT_META = {
  FUERZA: { id: "str", icon: "🟥", color: "#e05252" },
  RESISTENCIA: { id: "res", icon: "🟦", color: "#5b8dd9" },
  AGILIDAD: { id: "agi", icon: "🟩", color: "#52c97a" },
  INTELIGENCIA: { id: "int", icon: "🟪", color: "#a855f7" },
  CREATIVIDAD: { id: "cre", icon: "🟨", color: "#f5c842" },
  COMUNICACIÓN: { id: "com", icon: "🟧", color: "#f5853a" },
};

// Pseudo-RNG seedeado: devuelve un número en [0, max)
function seededRand(seed, max) {
  const x = Math.sin(seed) * 10000;
  return Math.floor((x - Math.floor(x)) * max);
}

// Seed que cambia por periodo y usuario
function getSeed(userId = "default") {
  const window30m = Math.floor(Date.now() / (30 * 60 * 1000));
  let userHash = 0;
  for (let i = 0; i < userId.length; i++) {
    userHash = (userHash * 31 + userId.charCodeAt(i)) & 0xffffffff;
  }
  return window30m + userHash;
}

/**
 * Genera 6 misiones diarias aleatorias (1 por cada stat).
 * @param {string} userId - ID del usuario para personalizar el seed
 * @param {number} extraOffset - offset adicional para el botón "mezclar"
 * @returns {Array}
 */
export function getRandomDailyMissions(userId = "default", extraOffset = 0) {
  const seed = getSeed(userId) + extraOffset;
  const stats = Object.keys(MISSIONS_POOL);
  let missionId = 100;
  const missions = [];

  stats.forEach((stat, statIdx) => {
    const pool = MISSIONS_POOL[stat];
    const meta = STAT_META[stat];

    if (!pool || pool.length === 0) return;

    // Elegimos 2 índices distintos por stat
    const firstIdx = seededRand(seed + statIdx * 1000, pool.length);
    let secondIdx = seededRand(seed + statIdx * 2000 + 77, pool.length);

    if (pool.length > 1) {
      while (secondIdx === firstIdx) {
        secondIdx = (secondIdx + 1) % pool.length;
      }
    }

    const selected = [pool[firstIdx]];
    if (pool.length > 1) selected.push(pool[secondIdx]);

    selected.forEach((base) => {
      missions.push({
        id: missionId++,
        stat,
        icon: meta.icon,
        color: meta.color,
        progress: 0,
        total: 1,
        unit: "vez",
        done: false,
        weeklyLink: null,
        weeklyIncrement: 1,
        ...base,
        photoEvidenceEnabled: base.photoEvidenceEnabled ?? false,
        locationEvidenceEnabled: base.locationEvidenceEnabled ?? false,
        photoBonusXp: base.photoBonusXp ?? 0,
        photoBonusCoins: base.photoBonusCoins ?? 0,
        locationBonusXp: base.locationBonusXp ?? 0,
        locationBonusCoins: base.locationBonusCoins ?? 0,
      });
    });
  });

  return missions;
}
/**
 * Obtiene una misión aleatoria distinta para una stat concreta.
 * Se usa en el botón "mezclar misión".
 */
export function getAlternateMission(stat, exclude, userId = "default") {
  const pool = MISSIONS_POOL[stat] || [];
  const opts = pool.filter((m) => m.name !== exclude);
  if (opts.length === 0) return null;

  const idx = Math.floor(Math.random() * opts.length);
  const base = opts[idx];
  const meta = STAT_META[stat];

  return {
    id: Date.now(),
    stat,
    icon: meta.icon,
    color: meta.color,
    progress: 0,
    total: 1,
    unit: "vez",
    done: false,
    weeklyLink: null,
    weeklyIncrement: 1,
    ...base,
    photoEvidenceEnabled: base.photoEvidenceEnabled ?? false,
    locationEvidenceEnabled: base.locationEvidenceEnabled ?? false,
    photoBonusXp: base.photoBonusXp ?? 0,
    photoBonusCoins: base.photoBonusCoins ?? 0,
    locationBonusXp: base.locationBonusXp ?? 0,
    locationBonusCoins: base.locationBonusCoins ?? 0,
  };
}