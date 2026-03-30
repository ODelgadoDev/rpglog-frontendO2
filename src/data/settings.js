/**
 * data/settings.js — Datos estáticos para las secciones de ajustes
 * ─────────────────────────────────────────────────────
 * NOTIFICATIONS_DATA ahora empieza vacío.
 * Las notificaciones se generan automáticamente desde HomeScreen
 * cuando ocurren eventos reales: misión completada, subida de nivel,
 * misión especial desbloqueada, timer de misión custom expirado, etc.
 *
 * Exportaciones:
 *   AVATARS        — 12 emojis seleccionables como avatar
 *   TX_HISTORY     — Historial de transacciones demo (WalletSection)
 *   NOTIFICATIONS_DATA — Array inicial vacío (se puebla con eventos reales)
 *   NOTIF_SETTINGS — Preferencias de notificación (toggles on/off)
 */
export const AVATARS = ["🧙","⚔️","🛡️","🏹","🧝","🧟","🐉","💀","🦸","🧛","🔮","👾"];

export const TX_HISTORY = [
  { icon:"⚔️", label:"Misión completada",        amount:"+50 XP",  coins:"+30🪙",  date:"HOY 14:32",  color:"#52c97a" },
  { icon:"🏪", label:"Título comprado",           amount:"",        coins:"−350🪙", date:"HOY 11:15",  color:"#e05252" },
  { icon:"🎮", label:"Mini juego — Reflex Burst", amount:"+40 XP",  coins:"+25🪙",  date:"AYER 20:44", color:"#52c97a" },
  { icon:"⚙️", label:"Misión custom creada",      amount:"",        coins:"−120🪙", date:"AYER 18:02", color:"#e05252" },
  { icon:"⚔️", label:"Misión especial",           amount:"+160 XP", coins:"+100🪙", date:"AYER 10:20", color:"#f5c842" },
  { icon:"🎮", label:"Mini juego — Simon Glitch", amount:"+55 XP",  coins:"+35🪙",  date:"LUN 22:10",  color:"#52c97a" },
];

// Vacío — las notificaciones reales las genera HomeScreen y se persisten por usuario
export const NOTIFICATIONS_DATA = [];

export const NOTIF_SETTINGS = [
  { id:"missions",  name:"MISIONES COMPLETADAS", desc:"Avisa cuando completas una misión con sus recompensas" },
  { id:"levelup",   name:"SUBIDA DE NIVEL",       desc:"Notifica al subir de nivel o desbloquear títulos" },
  { id:"special",   name:"MISIÓN ESPECIAL",       desc:"Alerta cuando la misión especial se desbloquea" },
  { id:"cooldown",  name:"TIMER DE MISIÓN CUSTOM",desc:"Avisa cuando el tiempo de una misión custom llega a 0" },
  { id:"record",    name:"NUEVOS RÉCORDS",        desc:"Notifica al superar tu mejor puntuación en mini juegos" },
];
