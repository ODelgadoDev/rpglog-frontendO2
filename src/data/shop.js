/**
 * data/shop.js — Datos estáticos de la tienda
 * ─────────────────────────────────────────────────────
 * Contiene toda la configuración de la ShopScreen.
 *
 * Exportaciones:
 *
 *   SHOP_STATS      — Las 6 stats seleccionables en el constructor de misiones
 *                     (mismo formato que STATS en constants.js, sin xp/lv)
 *
 *   DURATIONS       — Opciones de duración para misiones custom:
 *                     { label, hours, multiplier }
 *                     El multiplicador afecta al XP de la misión
 *
 *   STAT_COSTS      — Costo en 🪙 según número de stats seleccionadas:
 *                     { 1: 50, 2: 120, 3: 220, 4: 350 }
 *
 *   BASE_XP         — XP base para misiones custom (80 XP)
 *                     Fórmula: XP = BASE_XP × num_stats × duration.multiplier
 *
 *   TITLES_DATA     — Catálogo completo de títulos de la tienda:
 *                     { id, name, preview, rarity, price, levelReq,
 *                       perks[], isFree, accentColor }
 *                     Rarezas: "free" | "common" | "rare" | "epic"
 *                     Los títulos "rare" y "epic" tienen perks de XP/monedas
 *
 *   DEMO_ACTIVE_MISSION — Misión custom de ejemplo para mostrar en slot activo
 */
// ── Stats (shared with missions) ─────────────────────────────────
export const SHOP_STATS = [
  { id: "str", name: "FUERZA",       icon: "🟥", color: "#e05252" },
  { id: "res", name: "RESISTENCIA",  icon: "🟦", color: "#5b8dd9" },
  { id: "agi", name: "AGILIDAD",     icon: "🟩", color: "#52c97a" },
  { id: "int", name: "INTELIGENCIA", icon: "🟪", color: "#a855f7" },
  { id: "cre", name: "CREATIVIDAD",  icon: "🟨", color: "#f5c842" },
  { id: "com", name: "COMUNICACIÓN", icon: "🟧", color: "#f5853a" },
];

// ── Mission durations ─────────────────────────────────────────────
export const DURATIONS = [
  { label: "1H",  hours: 1,   mult: 1.0 },
  { label: "3H",  hours: 3,   mult: 1.4 },
  { label: "6H",  hours: 6,   mult: 1.8 },
  { label: "12H", hours: 12,  mult: 2.4 },
  { label: "1D",  hours: 24,  mult: 3.0 },
  { label: "2D",  hours: 48,  mult: 4.0 },
  { label: "3D",  hours: 72,  mult: 5.0 },
  { label: "1W",  hours: 168, mult: 7.0 },
];

// Cost by number of stats selected: 1→50, 2→120, 3→220, 4→350
export const STAT_COSTS = [0, 50, 120, 220, 350];
export const BASE_XP    = 80;

// ── Titles ────────────────────────────────────────────────────────
// bonus: campos estructurados usados por HomeScreen al calcular recompensas
//   xpGlobal   (number) — multiplicador global de XP  (1.0 = sin bonus)
//   coinBonus  (number) — monedas extras fijas por misión completada
//   xpStat     (string|null) — id de stat que recibe bonus extra de XP
//   xpStatMult (number) — multiplicador adicional para esa stat concreta
export const TITLES_DATA = [
  // FREE — sin bonus funcionales
  {
    id: "t0", name: "SIN TÍTULO", preview: '"Aventurero"',
    rarity: "GRATIS", price: 0, minLv: 1, owned: true, equipped: true,
    perks: [], color: "#e8e0d0", accent: "#2a2a3d", border: "#2a2a3d",
    rcColor: "#7a7a8a", type: "free",
    bonus: { xpGlobal: 1.0, coinBonus: 0, xpStat: null, xpStatMult: 1.0 },
  },
  {
    id: "t1", name: "NOVATO", preview: '"El Novato"',
    rarity: "GRATIS", price: 0, minLv: 3, owned: true, equipped: false,
    perks: [], color: "#e8e0d0", accent: "#2a2a3d", border: "#2a2a3d",
    rcColor: "#7a7a8a", type: "free",
    bonus: { xpGlobal: 1.0, coinBonus: 0, xpStat: null, xpStatMult: 1.0 },
  },
  {
    id: "t2", name: "APRENDIZ", preview: '"Aprendiz del Caos"',
    rarity: "GRATIS", price: 0, minLv: 7, owned: true, equipped: false,
    perks: [], color: "#e8e0d0", accent: "#2a2a3d", border: "#2a2a3d",
    rcColor: "#7a7a8a", type: "free",
    bonus: { xpGlobal: 1.0, coinBonus: 0, xpStat: null, xpStatMult: 1.0 },
  },

  // COMMON — solo cosméticos
  {
    id: "t3", name: "EXPLORADOR", preview: '"El Explorador"',
    rarity: "COMÚN", price: 150, minLv: 1, owned: false, equipped: false,
    perks: ["Solo cosmético"], color: "#e8e0d0", accent: "#5b8dd9",
    border: "#1e3a5a", rcColor: "#5b8dd9", type: "common",
    bonus: { xpGlobal: 1.0, coinBonus: 0, xpStat: null, xpStatMult: 1.0 },
  },
  {
    id: "t4", name: "VAGABUNDO", preview: '"Vagabundo Digital"',
    rarity: "COMÚN", price: 100, minLv: 1, owned: false, equipped: false,
    perks: ["Solo cosmético"], color: "#e8e0d0", accent: "#52c97a",
    border: "#1a3a2a", rcColor: "#52c97a", type: "common",
    bonus: { xpGlobal: 1.0, coinBonus: 0, xpStat: null, xpStatMult: 1.0 },
  },
  {
    id: "t5", name: "MAESTRO PIXEL", preview: '"Maestro del Pixel"',
    rarity: "COMÚN", price: 200, minLv: 5, owned: false, equipped: false,
    perks: ["Solo cosmético"], color: "#e8e0d0", accent: "#f5853a",
    border: "#3a2a1a", rcColor: "#f5853a", type: "common",
    bonus: { xpGlobal: 1.0, coinBonus: 0, xpStat: null, xpStatMult: 1.0 },
  },

  // RARE — bonus moderados
  {
    id: "t6", name: "GUARDIÁN", preview: '"El Guardián"',
    rarity: "RARO", price: 350, minLv: 5, owned: false, equipped: false,
    perks: ["+5% XP en Resistencia", "+3% XP global", "Bono de 5🪙 extra por misión", "−10% cooldown"],
    color: "#5b8dd9", accent: "#5b8dd9", border: "#1e3060", rcColor: "#5b8dd9", type: "rare",
    bonus: { xpGlobal: 1.03, coinBonus: 5, xpStat: "res", xpStatMult: 1.05 },
  },
  {
    id: "t7", name: "SABIO ARCANO", preview: '"Sabio Arcano"',
    rarity: "RARO", price: 500, minLv: 8, owned: false, equipped: false,
    perks: ["+5% XP en Inteligencia", "+3% XP global", "Bono de 8🪙 extra", "−15% cooldown"],
    color: "#a855f7", accent: "#a855f7", border: "#2a1a50", rcColor: "#a855f7", type: "rare",
    bonus: { xpGlobal: 1.03, coinBonus: 8, xpStat: "int", xpStatMult: 1.05 },
  },
  {
    id: "t8", name: "LLAMA ROJA", preview: '"La Llama Roja"',
    rarity: "RARO", price: 600, minLv: 8, owned: false, equipped: false,
    perks: ["+5% XP en Fuerza", "+3% XP global", "Bono de 10🪙 extra", "−15% cooldown"],
    color: "#e05252", accent: "#e05252", border: "#3a1010", rcColor: "#e05252", type: "rare",
    bonus: { xpGlobal: 1.03, coinBonus: 10, xpStat: "str", xpStatMult: 1.05 },
  },

  // EPIC — bonus máximos
  {
    id: "t9", name: "DIOS DE LA GUERRA", preview: '"El Dios de la Guerra"',
    rarity: "ÉPICO", price: 1000, minLv: 10, owned: false, equipped: false,
    perks: ["+10% XP global", "−20% costo misiones custom", "Protección de racha (×1)", "−30% cooldown"],
    color: "#f5c842", accent: "#f5c842", border: "#3a2a00", rcColor: "#f5c842", type: "epic",
    shadow: "0 0 14px rgba(245,200,66,.5)",
    bonus: { xpGlobal: 1.10, coinBonus: 0, xpStat: null, xpStatMult: 1.0 },
  },
  {
    id: "t10", name: "MENTE COLMENA", preview: '"La Mente Colmena"',
    rarity: "ÉPICO", price: 1200, minLv: 10, owned: false, equipped: false,
    perks: ["+10% XP global", "2 misiones custom activas", "−25% costo misiones custom", "−30% cooldown"],
    color: "#a855f7", accent: "#a855f7", border: "rgba(168,85,247,.6)", rcColor: "#a855f7", type: "epic",
    shadow: "0 0 14px rgba(168,85,247,.5)",
    bonus: { xpGlobal: 1.10, coinBonus: 0, xpStat: null, xpStatMult: 1.0 },
  },
  {
    id: "t11", name: "CAMPEÓN ETERNO", preview: '"Campeón Eterno"',
    rarity: "ÉPICO", price: 1500, minLv: 10, owned: false, equipped: false,
    perks: ["+10% XP global", "Protección racha (×3)", "−30% costo misiones custom", "−40% cooldown", "2 misiones custom activas"],
    color: "#f5853a", accent: "#f5853a", border: "#3a1800", rcColor: "#f5853a", type: "epic",
    shadow: "0 0 14px rgba(245,133,58,.5)",
    bonus: { xpGlobal: 1.10, coinBonus: 15, xpStat: null, xpStatMult: 1.0 },
  },
];

// ── Precios de los 3 slots de misiones custom ─────────────────────
// Los 3 slots se compran; ninguno viene desbloqueado por defecto.
// Slot 1 → 150🪙 | Slot 2 → 300🪙 | Slot 3 → 500🪙
export const SLOT_PRICES = [150, 300, 500];
