/**
 * data/settings.js - Datos estaticos para ajustes
 */
export const AVATARS = ["🧙", "⚔️", "🛡️", "🏹", "🧝", "🧟", "🐉", "💀", "🥷", "🧛", "🔮", "👾"];

export const TX_HISTORY = [
  { icon: "⚔️", label: "Mision completada", amount: "+50 XP", coins: "+30🪙", date: "HOY 14:32", color: "#52c97a" },
  { icon: "🏪", label: "Titulo comprado", amount: "", coins: "-350🪙", date: "HOY 11:15", color: "#e05252" },
  { icon: "🎮", label: "Mini juego - Reflex Burst", amount: "+40 XP", coins: "+25🪙", date: "AYER 20:44", color: "#52c97a" },
  { icon: "⚙️", label: "Mision custom creada", amount: "", coins: "-120🪙", date: "AYER 18:02", color: "#e05252" },
  { icon: "⚡", label: "Mision especial", amount: "+160 XP", coins: "+100🪙", date: "AYER 10:20", color: "#f5c842" },
  { icon: "🎮", label: "Mini juego - Simon Glitch", amount: "+55 XP", coins: "+35🪙", date: "LUN 22:10", color: "#52c97a" },
];

export const NOTIFICATIONS_DATA = [];

export const NOTIF_SETTINGS = [
  { id: "missions", name: "MISIONES COMPLETADAS", desc: "Avisa cuando completas una mision con sus recompensas" },
  { id: "games", name: "MINI JUEGOS", desc: "Notifica cuando terminas una partida y recibes recompensas" },
  { id: "levelup", name: "SUBIDA DE NIVEL", desc: "Notifica al subir de nivel o desbloquear titulos" },
  { id: "special", name: "MISION ESPECIAL", desc: "Alerta cuando la mision especial se desbloquea" },
  { id: "cooldown", name: "TIMER DE MISION CUSTOM", desc: "Avisa cuando el tiempo de una mision custom llega a 0" },
  { id: "record", name: "NUEVOS RECORDS", desc: "Notifica al superar tu mejor puntuacion en mini juegos" },
];
