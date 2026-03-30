/**
 * data/constants.js — Constantes globales de la aplicación
 * ─────────────────────────────────────────────────────────
 * Exportaciones principales:
 *
 *   STATS / INITIAL_STATS — Las 6 estadísticas del personaje.
 *
 *   DAILY_MISSIONS (30+)  — Pool estándar (usuarios en general).
 *     5 misiones por stat × 6 stats. Las físicas y creativas tienen
 *     photoEvidenceEnabled; las de movimiento tienen locationEvidenceEnabled.
 *     Al completar con evidencia se otorga XP y monedas extra (aprox. ×1.5).
 *
 *   DAILY_MISSIONS_ADAPTED (28+) — Pool adaptado (movilidad reducida).
 *     Misiones de tren superior, brazos y coordinación.
 *
 *   SPECIAL_MISSIONS_POOL (7) — Misiones especiales con stats mixtas.
 *     Rotan diariamente sin repetir la del día anterior.
 *     Función pickSpecialMission(userId, dateKey) selecciona la del día.
 *
 *   WEEKLY_MISSIONS — 3 misiones de progreso acumulado semanal.
 *
 * ── EVIDENCIAS ───────────────────────────────────────────────────
 *   photoEvidenceEnabled: true   → misión admite foto (fuerza, creatividad, etc.)
 *   locationEvidenceEnabled: true → misión admite GPS (resistencia, movimiento)
 *   photoBonusXp / photoBonusCoins       → bonus al aportar foto
 *   locationBonusXp / locationBonusCoins → bonus al aportar GPS
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

export const MISSIONS_TODAY = [
  { name: "20 Sentadillas",       stat: "FUERZA",       xp: "+50 XP", done: false },
  { name: "Leer 10 páginas",      stat: "INTELIGENCIA", xp: "+40 XP", done: false },
  { name: "Iniciar conversación", stat: "COMUNICACIÓN", xp: "+35 XP", done: false },
  { name: "Dibujar algo libre",   stat: "CREATIVIDAD",  xp: "+45 XP", done: false },
  { name: "30 min cardio",        stat: "RESISTENCIA",  xp: "+55 XP", done: false },
];

export const ACHIEVEMENTS = [
  { icon: "🏆", name: "RACHA DE 7 DÍAS", desc: "Misión completada 7 días seguidos",  color: "#f5c842", isNew: true  },
  { icon: "📚", name: "LECTOR VORAZ",    desc: "Leíste 50 páginas esta semana",       color: "#a855f7", isNew: true  },
  { icon: "💪", name: "GUERRERO FÍSICO", desc: "100 sentadillas en total",            color: "#e05252", isNew: false },
];

export const XP_HISTORY = [
  { day: "LUN", xp: 120, pct: 60  },
  { day: "MAR", xp: 200, pct: 100 },
  { day: "MIÉ", xp: 85,  pct: 42  },
  { day: "JUE", xp: 160, pct: 80  },
  { day: "VIE", xp: 95,  pct: 47  },
  { day: "SÁB", xp: 175, pct: 87  },
  { day: "HOY", xp: 90,  pct: 45  },
];

export const NAV_ITEMS = [
  { id: "home",      label: "INICIO",      icon: "🏠" },
  { id: "missions",  label: "MISIONES",    icon: "⚔️" },
  { id: "minigames", label: "MINI JUEGOS", icon: "🎮" },
  { id: "shop",      label: "TIENDA",      icon: "🏪" },
  { id: "settings",  label: "CONFIG",      icon: "⚙️" },
];

// ─────────────────────────────────────────────────────────────────
// MISIONES ESTÁNDAR (usuario general)
// photoEvidenceEnabled  → permite foto como evidencia (bonus ×2 XP)
// locationEvidenceEnabled → permite GPS como evidencia (bonus XP+coins)
// ─────────────────────────────────────────────────────────────────
export const DAILY_MISSIONS = [
  // 💪 FUERZA
  { id: 1,  name: "20 Sentadillas",            desc: "Realiza 20 sentadillas seguidas sin parar.",               stat: "FUERZA",       icon: "🟥", color: "#e05252", xp: 50, coins: 30, progress: 0, total: 20, unit: "reps",  done: false, photoEvidenceEnabled: true,  photoBonusXp: 25, photoBonusCoins: 10 },
  { id: 2,  name: "15 Flexiones",              desc: "Haz 15 flexiones con buena forma.",                        stat: "FUERZA",       icon: "🟥", color: "#e05252", xp: 45, coins: 28, progress: 0, total: 15, unit: "reps",  done: false, photoEvidenceEnabled: true,  photoBonusXp: 20, photoBonusCoins: 8  },
  { id: 3,  name: "Peso ligero 10 min",         desc: "Levanta peso ligero durante 10 minutos.",                  stat: "FUERZA",       icon: "🟥", color: "#e05252", xp: 40, coins: 25, progress: 0, total: 10, unit: "min",   done: false, photoEvidenceEnabled: true,  photoBonusXp: 18, photoBonusCoins: 8  },
  { id: 4,  name: "Plancha 30 segundos",        desc: "Mantén posición de plancha durante 30 segundos.",          stat: "FUERZA",       icon: "🟥", color: "#e05252", xp: 35, coins: 20, progress: 0, total: 1,  unit: "vez",   done: false, photoEvidenceEnabled: true,  photoBonusXp: 15, photoBonusCoins: 6  },
  { id: 5,  name: "10 Desplantes",             desc: "Realiza 10 desplantes (lunges) alternando piernas.",        stat: "FUERZA",       icon: "🟥", color: "#e05252", xp: 45, coins: 28, progress: 0, total: 10, unit: "reps",  done: false, photoEvidenceEnabled: true,  photoBonusXp: 20, photoBonusCoins: 8  },
  { id: 31, name: "Fondos en silla",            desc: "Realiza 10 fondos apoyándote en una silla.",               stat: "FUERZA",       icon: "🟥", color: "#e05252", xp: 40, coins: 25, progress: 0, total: 10, unit: "reps",  done: false, photoEvidenceEnabled: true,  photoBonusXp: 18, photoBonusCoins: 7  },
  // 🏃 RESISTENCIA
  { id: 6,  name: "Caminar 20 minutos",         desc: "Sal a caminar durante al menos 20 minutos.",               stat: "RESISTENCIA",  icon: "🟦", color: "#5b8dd9", xp: 50, coins: 30, progress: 0, total: 20, unit: "min",   done: false, locationEvidenceEnabled: true, locationBonusXp: 25, locationBonusCoins: 10 },
  { id: 7,  name: "Subir escaleras",            desc: "Usa las escaleras en lugar del elevador.",                  stat: "RESISTENCIA",  icon: "🟦", color: "#5b8dd9", xp: 30, coins: 18, progress: 0, total: 1,  unit: "vez",   done: false, photoEvidenceEnabled: true, photoBonusXp: 12, photoBonusCoins: 5, locationEvidenceEnabled: true, locationBonusXp: 15, locationBonusCoins: 6  },
  { id: 8,  name: "Cardio ligero 15 min",       desc: "Realiza cardio ligero durante 15 minutos.",                stat: "RESISTENCIA",  icon: "🟦", color: "#5b8dd9", xp: 45, coins: 28, progress: 0, total: 15, unit: "min",   done: false, locationEvidenceEnabled: true, locationBonusXp: 20, locationBonusCoins: 8  },
  { id: 9,  name: "Trotar 10 minutos",          desc: "Trota de forma continua durante 10 minutos.",              stat: "RESISTENCIA",  icon: "🟦", color: "#5b8dd9", xp: 55, coins: 35, progress: 0, total: 10, unit: "min",   done: false, locationEvidenceEnabled: true, locationBonusXp: 25, locationBonusCoins: 10 },
  { id: 10, name: "Actividad continua 15 min",  desc: "Mantén actividad sin parar durante 15 minutos.",           stat: "RESISTENCIA",  icon: "🟦", color: "#5b8dd9", xp: 45, coins: 28, progress: 0, total: 15, unit: "min",   done: false, photoEvidenceEnabled: true,  photoBonusXp: 20, photoBonusCoins: 8, locationEvidenceEnabled: true, locationBonusXp: 22, locationBonusCoins: 9 },
  // ⚡ AGILIDAD
  { id: 11, name: "Coordinación: saltos",       desc: "Realiza ejercicio de coordinación con saltos suaves.",     stat: "AGILIDAD",     icon: "🟩", color: "#52c97a", xp: 35, coins: 20, progress: 0, total: 1,  unit: "vez",   done: false, photoEvidenceEnabled: true,  photoBonusXp: 15, photoBonusCoins: 6  },
  { id: 12, name: "Saltos laterales 30s",       desc: "Realiza 30 segundos de saltos laterales.",                  stat: "AGILIDAD",     icon: "🟩", color: "#52c97a", xp: 35, coins: 20, progress: 0, total: 1,  unit: "vez",   done: false, photoEvidenceEnabled: true,  photoBonusXp: 15, photoBonusCoins: 6  },
  { id: 13, name: "Equilibrio en un pie",       desc: "Practica equilibrio en un pie durante 30 segundos.",       stat: "AGILIDAD",     icon: "🟩", color: "#52c97a", xp: 30, coins: 18, progress: 0, total: 1,  unit: "vez",   done: false, photoEvidenceEnabled: true,  photoBonusXp: 12, photoBonusCoins: 5  },
  { id: 14, name: "Skipping 20 segundos",       desc: "Haz skipping (rodillas al pecho) durante 20 segundos.",    stat: "AGILIDAD",     icon: "🟩", color: "#52c97a", xp: 35, coins: 20, progress: 0, total: 1,  unit: "vez",   done: false, photoEvidenceEnabled: true,  photoBonusXp: 15, photoBonusCoins: 6  },
  { id: 15, name: "Reacción visual",            desc: "Esquiva objetos o reacciona a estímulos visuales.",         stat: "AGILIDAD",     icon: "🟩", color: "#52c97a", xp: 30, coins: 18, progress: 0, total: 1,  unit: "vez",   done: false },
  // 🧠 INTELIGENCIA
  { id: 16, name: "Estudiar 20 minutos",        desc: "Estudia cualquier tema durante 20 minutos.",               stat: "INTELIGENCIA", icon: "🟪", color: "#a855f7", xp: 50, coins: 30, progress: 0, total: 20, unit: "min",   done: false, photoEvidenceEnabled: true, photoBonusXp: 20, photoBonusCoins: 8  },
  { id: 17, name: "Leer 10 páginas",            desc: "Lee al menos 10 páginas de cualquier libro.",              stat: "INTELIGENCIA", icon: "🟪", color: "#a855f7", xp: 40, coins: 25, progress: 0, total: 10, unit: "págs",  done: false, photoEvidenceEnabled: true, photoBonusXp: 18, photoBonusCoins: 7  },
  { id: 18, name: "Resolver 5 quizzes",         desc: "Responde 5 preguntas tipo quiz de cualquier tema.",        stat: "INTELIGENCIA", icon: "🟪", color: "#a855f7", xp: 35, coins: 20, progress: 0, total: 5,  unit: "pregs", done: false },
  { id: 19, name: "Contenido educativo",        desc: "Ve contenido educativo y toma notas de lo aprendido.",     stat: "INTELIGENCIA", icon: "🟪", color: "#a855f7", xp: 40, coins: 25, progress: 0, total: 1,  unit: "vez",   done: false },
  { id: 20, name: "Aprender y explicar",        desc: "Aprende un concepto nuevo y explícalo con tus propias palabras.", stat: "INTELIGENCIA", icon: "🟪", color: "#a855f7", xp: 50, coins: 30, progress: 0, total: 1, unit: "vez", done: false },
  // 🎨 CREATIVIDAD
  { id: 21, name: "Dibujar 15 minutos",         desc: "Dibuja libremente durante 15 minutos.",                    stat: "CREATIVIDAD",  icon: "🟨", color: "#f5c842", xp: 45, coins: 28, progress: 0, total: 15, unit: "min",   done: false, photoEvidenceEnabled: true,  photoBonusXp: 20, photoBonusCoins: 8  },
  { id: 22, name: "Escribir texto corto",       desc: "Escribe un texto corto: historia, reflexión o poema.",     stat: "CREATIVIDAD",  icon: "🟨", color: "#f5c842", xp: 40, coins: 25, progress: 0, total: 1,  unit: "vez",   done: false, photoEvidenceEnabled: true,  photoBonusXp: 18, photoBonusCoins: 7  },
  { id: 23, name: "Diseñar idea o boceto",      desc: "Diseña una idea o boceto de cualquier proyecto.",          stat: "CREATIVIDAD",  icon: "🟨", color: "#f5c842", xp: 45, coins: 28, progress: 0, total: 1,  unit: "vez",   done: false, photoEvidenceEnabled: true,  photoBonusXp: 20, photoBonusCoins: 8  },
  { id: 24, name: "Contenido digital",          desc: "Crea contenido digital: diseño, edición o video.",         stat: "CREATIVIDAD",  icon: "🟨", color: "#f5c842", xp: 50, coins: 30, progress: 0, total: 1,  unit: "vez",   done: false, photoEvidenceEnabled: true,  photoBonusXp: 22, photoBonusCoins: 10 },
  { id: 25, name: "Foto creativa",              desc: "Toma una foto creativa de algo que llame tu atención.",    stat: "CREATIVIDAD",  icon: "🟨", color: "#f5c842", xp: 35, coins: 20, progress: 0, total: 1,  unit: "vez",   done: false, photoEvidenceEnabled: true,  photoBonusXp: 15, photoBonusCoins: 6  },
  { id: 32, name: "Decorar un objeto",          desc: "Personaliza o decora algo con tu estilo.",                  stat: "CREATIVIDAD",  icon: "🟨", color: "#f5c842", xp: 40, coins: 25, progress: 0, total: 1,  unit: "vez",   done: false, photoEvidenceEnabled: true,  photoBonusXp: 18, photoBonusCoins: 7  },
  // 🗣 COMUNICACIÓN
  { id: 26, name: "Iniciar conversación",       desc: "Inicia una conversación significativa con alguien.",        stat: "COMUNICACIÓN", icon: "🟧", color: "#f5853a", xp: 35, coins: 20, progress: 0, total: 1,  unit: "vez",   done: false },
  { id: 27, name: "Mensaje positivo",           desc: "Envía un mensaje positivo o de apoyo a alguien.",          stat: "COMUNICACIÓN", icon: "🟧", color: "#f5853a", xp: 30, coins: 18, progress: 0, total: 1,  unit: "vez",   done: false },
  { id: 28, name: "Actividad social",           desc: "Participa en una actividad social o reunión.",              stat: "COMUNICACIÓN", icon: "🟧", color: "#f5853a", xp: 40, coins: 25, progress: 0, total: 1,  unit: "vez",   done: false, photoEvidenceEnabled: true, photoBonusXp: 15, photoBonusCoins: 6, locationEvidenceEnabled: true, locationBonusXp: 18, locationBonusCoins: 8 },
  { id: 29, name: "Llamar a alguien",           desc: "Llama por teléfono a alguien cercano.",                     stat: "COMUNICACIÓN", icon: "🟧", color: "#f5853a", xp: 35, coins: 20, progress: 0, total: 1,  unit: "vez",   done: false },
  { id: 30, name: "Expresar una idea",          desc: "Expresa una idea o experiencia personal de forma oral.",   stat: "COMUNICACIÓN", icon: "🟧", color: "#f5853a", xp: 35, coins: 20, progress: 0, total: 1,  unit: "vez",   done: false },
];

// ─────────────────────────────────────────────────────────────────
// MISIONES ADAPTADAS (movilidad reducida)
// ─────────────────────────────────────────────────────────────────
export const DAILY_MISSIONS_ADAPTED = [
  // 💪 FUERZA (tren superior)
  { id: 101, name: "Levantar brazos 15 reps",  desc: "Realiza 15 repeticiones de levantamiento de brazos.",       stat: "FUERZA",       icon: "🟥", color: "#e05252", xp: 40, coins: 25, progress: 0, total: 15, unit: "reps",  done: false, photoEvidenceEnabled: true, photoBonusXp: 18, photoBonusCoins: 7 },
  { id: 102, name: "Empujar superficie 30s",   desc: "Empuja una superficie firme durante 30 segundos.",          stat: "FUERZA",       icon: "🟥", color: "#e05252", xp: 35, coins: 20, progress: 0, total: 1,  unit: "vez",   done: false, photoEvidenceEnabled: true, photoBonusXp: 15, photoBonusCoins: 6 },
  { id: 103, name: "Objetos ligeros 10 min",   desc: "Levanta objetos ligeros de forma continua durante 10 min.", stat: "FUERZA",       icon: "🟥", color: "#e05252", xp: 40, coins: 25, progress: 0, total: 10, unit: "min",   done: false, photoEvidenceEnabled: true, photoBonusXp: 18, photoBonusCoins: 7 },
  { id: 104, name: "Flexiones adaptadas",      desc: "Realiza flexiones apoyadas en mesa o silla.",               stat: "FUERZA",       icon: "🟥", color: "#e05252", xp: 40, coins: 25, progress: 0, total: 1,  unit: "vez",   done: false, photoEvidenceEnabled: true, photoBonusXp: 18, photoBonusCoins: 7 },
  { id: 105, name: "Bandas elásticas 10 min",  desc: "Usa bandas elásticas para ejercitar brazos durante 10 min.",stat: "FUERZA",       icon: "🟥", color: "#e05252", xp: 45, coins: 28, progress: 0, total: 10, unit: "min",   done: false, photoEvidenceEnabled: true, photoBonusXp: 20, photoBonusCoins: 8 },
  // 🏃 RESISTENCIA (adaptada)
  { id: 106, name: "Moverse 15 minutos",       desc: "Mantente en movimiento continuo durante 10–15 minutos.",    stat: "RESISTENCIA",  icon: "🟦", color: "#5b8dd9", xp: 40, coins: 25, progress: 0, total: 15, unit: "min",   done: false, locationEvidenceEnabled: true, locationBonusXp: 18, locationBonusCoins: 8 },
  { id: 107, name: "Brazos en movimiento",     desc: "Realiza movimientos continuos de brazos durante 10 min.",   stat: "RESISTENCIA",  icon: "🟦", color: "#5b8dd9", xp: 35, coins: 20, progress: 0, total: 10, unit: "min",   done: false, photoEvidenceEnabled: true,  photoBonusXp: 15, photoBonusCoins: 6 },
  { id: 108, name: "Actividad sin parar 10min",desc: "Mantén actividad ligera sin detenerte durante 10 min.",     stat: "RESISTENCIA",  icon: "🟦", color: "#5b8dd9", xp: 35, coins: 20, progress: 0, total: 10, unit: "min",   done: false, photoEvidenceEnabled: true,  photoBonusXp: 15, photoBonusCoins: 6 },
  { id: 109, name: "Rutina de brazos",         desc: "Completa una rutina de brazos con ritmo constante.",        stat: "RESISTENCIA",  icon: "🟦", color: "#5b8dd9", xp: 35, coins: 20, progress: 0, total: 1,  unit: "vez",   done: false, photoEvidenceEnabled: true,  photoBonusXp: 15, photoBonusCoins: 6 },
  // ⚡ AGILIDAD (coordinación)
  { id: 110, name: "Coord. de manos",          desc: "Realiza ejercicios de coordinación de manos.",              stat: "AGILIDAD",     icon: "🟩", color: "#52c97a", xp: 30, coins: 18, progress: 0, total: 1,  unit: "vez",   done: false, photoEvidenceEnabled: true,  photoBonusXp: 12, photoBonusCoins: 5 },
  { id: 111, name: "Brazos rápidos 30s",       desc: "Realiza movimientos rápidos de brazos durante 30 segundos.",stat: "AGILIDAD",     icon: "🟩", color: "#52c97a", xp: 30, coins: 18, progress: 0, total: 1,  unit: "vez",   done: false, photoEvidenceEnabled: true,  photoBonusXp: 12, photoBonusCoins: 5 },
  { id: 112, name: "Atrapar objetos ligeros",  desc: "Atrapa o toca objetos ligeros en movimiento.",              stat: "AGILIDAD",     icon: "🟩", color: "#52c97a", xp: 30, coins: 18, progress: 0, total: 1,  unit: "vez",   done: false, photoEvidenceEnabled: true,  photoBonusXp: 12, photoBonusCoins: 5 },
  { id: 113, name: "Reacción visual",          desc: "Juega el minijuego de reflejos durante un rato.",           stat: "AGILIDAD",     icon: "🟩", color: "#52c97a", xp: 35, coins: 20, progress: 0, total: 1,  unit: "vez",   done: false },
  { id: 114, name: "Manos alternas 1 min",     desc: "Alterna movimientos de manos durante 1 minuto.",            stat: "AGILIDAD",     icon: "🟩", color: "#52c97a", xp: 35, coins: 20, progress: 0, total: 1,  unit: "min",   done: false, photoEvidenceEnabled: true,  photoBonusXp: 15, photoBonusCoins: 6 },
  // 🧠 INTELIGENCIA (igual para todos)
  { id: 115, name: "Estudiar 20 minutos",      desc: "Estudia cualquier tema durante 20 minutos.",               stat: "INTELIGENCIA", icon: "🟪", color: "#a855f7", xp: 50, coins: 30, progress: 0, total: 20, unit: "min",   done: false },
  { id: 116, name: "Leer 10 páginas",          desc: "Lee al menos 10 páginas de cualquier libro.",              stat: "INTELIGENCIA", icon: "🟪", color: "#a855f7", xp: 40, coins: 25, progress: 0, total: 10, unit: "págs",  done: false },
  { id: 117, name: "Contenido educativo",      desc: "Ve contenido educativo y toma notas.",                     stat: "INTELIGENCIA", icon: "🟪", color: "#a855f7", xp: 40, coins: 25, progress: 0, total: 1,  unit: "vez",   done: false },
  { id: 118, name: "Aprender y escribirlo",    desc: "Aprende un concepto nuevo y escríbelo.",                   stat: "INTELIGENCIA", icon: "🟪", color: "#a855f7", xp: 45, coins: 28, progress: 0, total: 1,  unit: "vez",   done: false },
  // 🎨 CREATIVIDAD
  { id: 119, name: "Dibujar 15 min",           desc: "Dibuja libremente durante 15 minutos.",                    stat: "CREATIVIDAD",  icon: "🟨", color: "#f5c842", xp: 45, coins: 28, progress: 0, total: 15, unit: "min",   done: false, photoEvidenceEnabled: true, photoBonusXp: 20, photoBonusCoins: 8 },
  { id: 120, name: "Escribir texto corto",     desc: "Escribe un texto corto desde tu entorno.",                  stat: "CREATIVIDAD",  icon: "🟨", color: "#f5c842", xp: 40, coins: 25, progress: 0, total: 1,  unit: "vez",   done: false, photoEvidenceEnabled: true, photoBonusXp: 18, photoBonusCoins: 7 },
  { id: 121, name: "Diseñar boceto",           desc: "Diseña una idea o boceto en papel o digital.",              stat: "CREATIVIDAD",  icon: "🟨", color: "#f5c842", xp: 45, coins: 28, progress: 0, total: 1,  unit: "vez",   done: false, photoEvidenceEnabled: true, photoBonusXp: 20, photoBonusCoins: 8 },
  { id: 122, name: "Contenido digital",        desc: "Crea contenido digital desde tu espacio.",                  stat: "CREATIVIDAD",  icon: "🟨", color: "#f5c842", xp: 50, coins: 30, progress: 0, total: 1,  unit: "vez",   done: false, photoEvidenceEnabled: true, photoBonusXp: 22, photoBonusCoins: 10 },
  { id: 123, name: "Foto creativa",            desc: "Toma una foto creativa desde tu entorno.",                  stat: "CREATIVIDAD",  icon: "🟨", color: "#f5c842", xp: 35, coins: 20, progress: 0, total: 1,  unit: "vez",   done: false, photoEvidenceEnabled: true, photoBonusXp: 15, photoBonusCoins: 6 },
  // 🗣 COMUNICACIÓN
  { id: 124, name: "Iniciar conversación",     desc: "Inicia una conversación significativa.",                    stat: "COMUNICACIÓN", icon: "🟧", color: "#f5853a", xp: 35, coins: 20, progress: 0, total: 1,  unit: "vez",   done: false },
  { id: 125, name: "Mensaje positivo",         desc: "Envía un mensaje positivo a alguien cercano.",              stat: "COMUNICACIÓN", icon: "🟧", color: "#f5853a", xp: 30, coins: 18, progress: 0, total: 1,  unit: "vez",   done: false },
  { id: 126, name: "Actividad social",         desc: "Participa en una actividad social.",                        stat: "COMUNICACIÓN", icon: "🟧", color: "#f5853a", xp: 40, coins: 25, progress: 0, total: 1,  unit: "vez",   done: false },
  { id: 127, name: "Enviar audio o mensaje",   desc: "Envía un audio o mensaje expresando algo.",                 stat: "COMUNICACIÓN", icon: "🟧", color: "#f5853a", xp: 30, coins: 18, progress: 0, total: 1,  unit: "vez",   done: false },
  { id: 128, name: "Compartir una experiencia",desc: "Comparte una idea o experiencia con alguien.",              stat: "COMUNICACIÓN", icon: "🟧", color: "#f5853a", xp: 35, coins: 20, progress: 0, total: 1,  unit: "vez",   done: false },
];

export const WEEKLY_MISSIONS = [
  { id: 7, name: "Leer 50 páginas",         desc: "Completa 50 páginas de lectura esta semana.",                     stat: "INTELIGENCIA", icon: "🟪", color: "#a855f7", xp: 200, coins: 120, progress: 0, total: 50, unit: "págs",  done: false },
  { id: 8, name: "Entrenar 4 días",         desc: "Completa al menos 1 misión de Fuerza o Resistencia 4 días.",      stat: "FUERZA",       icon: "🟥", color: "#e05252", xp: 250, coins: 150, progress: 0, total: 4,  unit: "días",  done: false },
  { id: 9, name: "5 conversaciones nuevas", desc: "Inicia 5 conversaciones con personas distintas esta semana.",      stat: "COMUNICACIÓN", icon: "🟧", color: "#f5853a", xp: 180, coins: 110, progress: 0, total: 5,  unit: "convs", done: false },
];

// Pool de misiones especiales — rotan cada día sin repetirse consecutivamente.
// Cada entrada combina 2 stats para mayor dificultad y recompensa.
// La función pickSpecialMission() selecciona la del día en MissionsScreen.
export const SPECIAL_MISSIONS_POOL = [
  {
    id: 99, name: "MENTE Y MÚSCULO",
    desc: "Lee 5 páginas Y haz 15 sentadillas en el mismo día. El cuerpo y la mente crecen juntos.",
    stats: [ { label: "INTELIGENCIA", color: "#a855f7", icon: "🟪" }, { label: "FUERZA", color: "#e05252", icon: "🟥" } ],
    icon: "⚡", xp: 160, coins: 100,
    photoEvidenceEnabled: true, photoBonusXp: 40, photoBonusCoins: 20,
  },
  {
    id: 100, name: "ARTISTA EN MOVIMIENTO",
    desc: "Diseña o dibuja algo libre Y sal a caminar 15 minutos. Mueve el cuerpo y la mente.",
    stats: [ { label: "CREATIVIDAD", color: "#f5c842", icon: "🟨" }, { label: "RESISTENCIA", color: "#5b8dd9", icon: "🟦" } ],
    icon: "⚡", xp: 155, coins: 95,
    photoEvidenceEnabled: true, photoBonusXp: 35, photoBonusCoins: 18,
    locationEvidenceEnabled: true, locationBonusXp: 30, locationBonusCoins: 15,
  },
  {
    id: 101, name: "CONEXIÓN ACTIVA",
    desc: "Habla con alguien de forma significativa Y realiza 10 minutos de cardio. Cuerpo y vínculos.",
    stats: [ { label: "COMUNICACIÓN", color: "#f5853a", icon: "🟧" }, { label: "RESISTENCIA", color: "#5b8dd9", icon: "🟦" } ],
    icon: "⚡", xp: 150, coins: 90,
    photoEvidenceEnabled: true, photoBonusXp: 30, photoBonusCoins: 15,
    locationEvidenceEnabled: true, locationBonusXp: 25, locationBonusCoins: 12,
  },
  {
    id: 102, name: "REFLEJOS DE GENIO",
    desc: "Estudia 20 minutos Y practica coordinación o equilibrio 5 minutos. Mente ágil, cuerpo ágil.",
    stats: [ { label: "INTELIGENCIA", color: "#a855f7", icon: "🟪" }, { label: "AGILIDAD", color: "#52c97a", icon: "🟩" } ],
    icon: "⚡", xp: 155, coins: 95,
    photoEvidenceEnabled: true, photoBonusXp: 35, photoBonusCoins: 18,
  },
  {
    id: 103, name: "CREADOR VELOZ",
    desc: "Escribe un texto corto Y haz 10 desplantes. La creatividad necesita energía.",
    stats: [ { label: "CREATIVIDAD", color: "#f5c842", icon: "🟨" }, { label: "FUERZA", color: "#e05252", icon: "🟥" } ],
    icon: "⚡", xp: 150, coins: 92,
    photoEvidenceEnabled: true, photoBonusXp: 32, photoBonusCoins: 16,
  },
  {
    id: 104, name: "EXPLORADOR SOCIAL",
    desc: "Sal a un lugar diferente Y comparte la experiencia con alguien. Muévete y conéctate.",
    stats: [ { label: "COMUNICACIÓN", color: "#f5853a", icon: "🟧" }, { label: "AGILIDAD", color: "#52c97a", icon: "🟩" } ],
    icon: "⚡", xp: 150, coins: 90,
    locationEvidenceEnabled: true, locationBonusXp: 35, locationBonusCoins: 18,
  },
  {
    id: 105, name: "GUERRERO DEL SABER",
    desc: "Lee 10 páginas Y levanta peso ligero 10 minutos. Construye cuerpo y mente.",
    stats: [ { label: "INTELIGENCIA", color: "#a855f7", icon: "🟪" }, { label: "FUERZA", color: "#e05252", icon: "🟥" } ],
    icon: "⚡", xp: 160, coins: 100,
    photoEvidenceEnabled: true, photoBonusXp: 38, photoBonusCoins: 20,
  },
];

// Selecciona la misión especial del día de forma determinista.
// Garantiza no repetir la misma que el día anterior.
export function pickSpecialMission(userId, dateKey) {
  const pool = SPECIAL_MISSIONS_POOL;
  const dayNum = dateKey.split("-").reduce((a, b) => a + parseInt(b), 0) +
    (userId || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  // Índice del día anterior para evitar repetición
  const prevIdx = (dayNum - 1 + pool.length) % pool.length;
  let idx = dayNum % pool.length;
  if (idx === prevIdx) idx = (idx + 1) % pool.length;
  return pool[idx];
}

// Alias para compatibilidad — exporta la primera del pool como default
export const SPECIAL_MISSION = SPECIAL_MISSIONS_POOL[0];

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
