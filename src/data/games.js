/**
 * data/games.js — Configuración de los minijuegos
 * ─────────────────────────────────────────────────────
 * Cada entrada define la metadata de un juego:
 *
 *   id      — clave usada en GameWrapper para cargar el componente
 *   name    — nombre en UI
 *   icon    — emoji representativo
 *   desc    — descripción corta para la tarjeta del lobby
 *   stat    — stat PRIMARIA que mejora (string, para compatibilidad)
 *   stats   — array de stats que mejora (cuando son varias)
 *             Si stats.length > 1, GameWrapper y ResultScreen muestran todas
 *   xp      — XP base ganada (escala con score en ResultScreen)
 *   coins   — monedas base ganadas (ídem)
 *   color   — color de acento de la tarjeta (una sola stat)
 *   color2  — color secundario para gradiente (juegos de dos stats)
 *   diff    — dificultad mostrada en la tarjeta
 *   keys    — instrucción de control (opcional)
 *
 * Tabla de stats y colores:
 *   FUERZA        #e05252 (rojo)
 *   RESISTENCIA   #5b8dd9 (azul)
 *   AGILIDAD      #52c97a (verde)
 *   INTELIGENCIA  #a855f7 (morado)
 *   CREATIVIDAD   #f5c842 (amarillo)
 *   COMUNICACIÓN  #f5853a (naranja)
 */
export const GAMES = [
  {
    id: "osu",
    name: "REFLEX BURST",
    icon: "🎯",
    color: "#52c97a",         // AGILIDAD — verde
    diff: "INTERMEDIO",
    stat: "AGILIDAD",
    stats: ["AGILIDAD"],
    desc: "Pulsa los círculos antes de que desaparezcan. ¡Velocidad pura!",
    xp: 45,
    coins: 28,
  },
  {
    id: "word",
    name: "WORD CHAOS",
    icon: "📝",
    color: "#a855f7",         // INTELIGENCIA — morado
    diff: "MEDIO",
    stat: "INTELIGENCIA",
    stats: ["INTELIGENCIA"],
    desc: "Ordena la palabra desordenada. Cada error resta tiempo.",
    xp: 50,
    coins: 30,
  },
  {
    id: "simon",
    name: "SIMON GLITCH",
    icon: "🔲",
    color: "#a855f7",         // INTELIGENCIA — morado
    diff: "MEDIO",
    stat: "INTELIGENCIA",
    stats: ["INTELIGENCIA"],
    desc: "Memoriza y repite el patrón de colores. ¡No te equivoques!",
    xp: 55,
    coins: 35,
  },
  {
    id: "tetris",
    name: "PIXEL BLOCKS",
    icon: "🧱",
    color: "#a855f7",         // INTELIGENCIA — morado (primario)
    color2: "#52c97a",        // AGILIDAD — verde (secundario, para gradiente)
    diff: "FÁCIL",
    stat: "INTELIGENCIA",     // stat primaria (para ResultScreen y HomeScreen)
    stats: ["INTELIGENCIA", "AGILIDAD"],
    desc: "Encaja los bloques y borra líneas. Velocidad aumenta cada 5000 pts.",
    xp: 60,
    coins: 38,
  },
  {
    id: "rhythm",
    name: "RHYTHM STRIKE",
    icon: "🎵",
    color: "#52c97a",         // AGILIDAD — verde
    diff: "DIFÍCIL",
    stat: "AGILIDAD",
    stats: ["AGILIDAD"],
    desc: "Pulsa las teclas al ritmo. Consigue el combo más largo.",
    xp: 70,
    coins: 45,
  },
];
