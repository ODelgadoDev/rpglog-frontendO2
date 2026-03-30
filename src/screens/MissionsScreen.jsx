/**
 * MissionsScreen.jsx — Pantalla de misiones
 * ─────────────────────────────────────────────────────
 * Gestiona tres tipos de misiones con persistencia por usuario en localStorage:
 *
 * ── TIPOS DE MISIÓN ──────────────────────────────────────────────
 *   Diarias    — 6 misiones rotadas cada día. Se generan con variedad
 *                (máx. 2 del mismo stat entre las 6). Usan el pool
 *                DAILY_MISSIONS (estándar) o DAILY_MISSIONS_ADAPTED
 *                (movilidad reducida), elegible via toggle de modo adaptado.
 *
 *   Semanales  — 3 misiones que acumulan progreso durante 7 días.
 *                Su progreso avanza automáticamente al completar
 *                misiones diarias del mismo stat.
 *
 *   Especial   — 1 misión de alto XP que rota diariamente desde el
 *                pool SPECIAL_MISSIONS_POOL (7 opciones con stats mixtas).
 *                Garantiza no repetir la del día anterior.
 *                Requiere nivel ≥5 para desbloquearse.
 *
 *   Personales — Misiones compradas en la Tienda. Aparecen en una sección
 *                propia con el mismo diseño visual que las misiones normales.
 *
 * ── EVIDENCIAS (XP EXTRA) ────────────────────────────────────────
 *   Las misiones físicas y creativas admiten evidencia para bonus de XP:
 *   • photoEvidenceEnabled  → el usuario puede tomar una foto al completar
 *                             y obtener XP+monedas extra (aprox. ×1.5 recompensa)
 *   • locationEvidenceEnabled → el usuario puede compartir su GPS al completar
 *                             (ideal para misiones de movimiento: caminar, trotar)
 *   Cada bonus solo se aplica una vez por misión.
 *
 * ── IGNORAR / ABANDONAR MISIONES ────────────────────────────────
 *   Cada misión diaria tiene un botón "ABANDONAR" dentro de la tarjeta,
 *   alineado junto al botón "COMPLETAR". Al presionarlo aparece un menú
 *   con dos opciones táctiles grandes:
 *   • 🗑 Eliminar — oculta la misión hasta el día siguiente (ignoredIds)
 *   • 🔄 Cambiar  — reemplaza la misión por otra del pool no usada ese día
 *
 * ── PERSISTENCIA ─────────────────────────────────────────────────
 *   Clave localStorage: "rpglog_missions_{userId}"
 *   Guarda: { dailyMissions, weeklyMissions, specialDone, specialMission,
 *             dailyResetAt, weeklyResetAt, ignoredIds, adaptedMode, dayKey }
 *
 *   Reset automático:
 *   • ≥24h desde dailyResetAt  → reinicia diarias + genera nueva rotación
 *   • ≥7d  desde weeklyResetAt → reinicia semanales
 *   • Cambio de fecha (dayKey)  → fuerza rotación diaria aunque no hayan pasado 24h
 *
 * Props:
 *   onMissionDone(mission, finalXp) — notifica a HomeScreen para actualizar
 *     user.xp, stats y coins tras completar una misión.
 *   userLevel (number) — nivel del usuario (especial bloqueada si < 5).
 *   userId (string)    — identificador por cuenta para aislar localStorage.
 *   gpsEnabled (bool)  — si el GPS global está activo (para CompleteModal).
 *   lastCoords (object)— última ubicación capturada por watchPosition.
 *   customMissions (array) — misiones activas compradas en la Tienda.
 */
import { useState, useEffect, useCallback } from "react";
import "../styles/MissionsScreen.css";

import {
  DAILY_MISSIONS,
  DAILY_MISSIONS_ADAPTED,
  WEEKLY_MISSIONS,
  SPECIAL_MISSION,
  STAT_GROUPS,
  pickSpecialMission,
} from "../data/constants";

import MissionCard    from "../components/MissionCard";
import SpecialMission from "../components/SpecialMission";
import CompleteModal  from "../components/CompleteModal";

// ── Tiempos de reset ──────────────────────────────────────────────
const MS_DAY  = 24 * 60 * 60 * 1000;
const MS_WEEK =  7 * MS_DAY;
const lsKey   = (userId) => `rpglog_missions_${userId || "default"}`;

// Formatea ms restantes → "HH:MM:SS" o "Xd HH:MM:SS"
function formatTimeLeft(ms) {
  if (ms <= 0) return "00:00:00";
  const totalSec = Math.floor(ms / 1000);
  const days  = Math.floor(totalSec / 86400);
  const hrs   = Math.floor((totalSec % 86400) / 3600);
  const mins  = Math.floor((totalSec % 3600) / 60);
  const secs  = totalSec % 60;
  const hms   = `${String(hrs).padStart(2,"0")}:${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;
  return days > 0 ? `${days}d ${hms}` : hms;
}

// ── Rotación diaria con variedad de stats ────────────────────────
// Selecciona 6 misiones del pool garantizando máx. 2 por stat.
// La semilla es determinista: mismo usuario ve las mismas 6 cada día.
function pickDailyRotation(pool, userId, dateKey) {
  const seed = dateKey.split("-").reduce((a, b) => a + parseInt(b), 0) +
    (userId || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0);

  const shuffled = [...pool].sort((a, b) => {
    const ha = Math.sin(seed + a.id) * 10000;
    const hb = Math.sin(seed + b.id) * 10000;
    return (ha - Math.floor(ha)) - (hb - Math.floor(hb));
  });

  // Máx. 2 del mismo stat para asegurar variedad
  const selected  = [];
  const statCount = {};
  const MAX_PER_STAT = 2;

  for (const m of shuffled) {
    if (selected.length >= 6) break;
    const count = statCount[m.stat] || 0;
    if (count < MAX_PER_STAT) {
      selected.push({ ...m });
      statCount[m.stat] = count + 1;
    }
  }

  // Completar si pool pequeño (modo adaptado tiene menos misiones)
  if (selected.length < 6) {
    const usedIds = new Set(selected.map(m => m.id));
    for (const m of shuffled) {
      if (selected.length >= 6) break;
      if (!usedIds.has(m.id)) { selected.push({ ...m }); usedIds.add(m.id); }
    }
  }

  return selected;
}

function todayKey() {
  return new Date().toISOString().split("T")[0];
}

// ── Estado inicial desde localStorage o datos frescos ────────────
function loadInitialState(userId) {
  const now  = Date.now();
  const tKey = todayKey();
  try {
    const saved = JSON.parse(localStorage.getItem(lsKey(userId)) || "null");
    if (saved) {
      let { dailyMissions, weeklyMissions, specialDone, specialMission,
            dailyResetAt, weeklyResetAt, ignoredIds, adaptedMode, dayKey } = saved;

      // Día nuevo o ≥24h → generar nueva rotación diaria
      if (now - dailyResetAt >= MS_DAY || dayKey !== tKey) {
        const pool    = adaptedMode ? DAILY_MISSIONS_ADAPTED : DAILY_MISSIONS;
        dailyMissions = pickDailyRotation(pool, userId, tKey);
        specialDone   = false;
        specialMission = pickSpecialMission(userId, tKey);
        dailyResetAt  = now;
        ignoredIds    = [];
        dayKey        = tKey;
      }

      if (now - weeklyResetAt >= MS_WEEK) {
        weeklyMissions = WEEKLY_MISSIONS.map(m => ({ ...m }));
        weeklyResetAt  = now;
      }

      return { dailyMissions, weeklyMissions, specialDone,
               specialMission: specialMission || pickSpecialMission(userId, tKey),
               dailyResetAt, weeklyResetAt,
               ignoredIds: ignoredIds || [], adaptedMode: adaptedMode || false,
               dayKey: dayKey || tKey };
    }
  } catch (_) {}

  return {
    dailyMissions:  pickDailyRotation(DAILY_MISSIONS, userId, tKey),
    weeklyMissions: WEEKLY_MISSIONS.map(m => ({ ...m })),
    specialDone:    false,
    specialMission: pickSpecialMission(userId, tKey),
    dailyResetAt:   now,
    weeklyResetAt:  now,
    ignoredIds:     [],
    adaptedMode:    false,
    dayKey:         tKey,
  };
}

// ── Barra de filtros por stat ─────────────────────────────────────
const FILTER_ALL = "TODAS";

const FilterBar = ({ active, onChange }) => (
  <div className="filter-bar">
    <span className="filter-label">▸ FILTRAR:</span>
    <button className={`filter-btn${active === FILTER_ALL ? " active" : ""}`}
      style={{ "--filter-color": "var(--gold)" }} onClick={() => onChange(FILTER_ALL)}>
      ⚔️ TODAS
    </button>
    {STAT_GROUPS.map(g => (
      <button key={g.key}
        className={`filter-btn${active === g.key ? " active" : ""}`}
        style={{ "--filter-color": g.color }} onClick={() => onChange(g.key)}>
        {g.icon} {g.key}
      </button>
    ))}
  </div>
);

// ── Componente principal ──────────────────────────────────────────
export default function MissionsScreen({
  onMissionDone,
  userLevel     = 1,
  userId        = "default",
  gpsEnabled    = false,
  lastCoords    = null,
  customMissions = [],
}) {
  const [state,    setState]  = useState(() => loadInitialState(userId));
  const [modal,    setModal]  = useState(null);
  const [filter,   setFilter] = useState(FILTER_ALL);

  const { dailyMissions, weeklyMissions, specialDone, specialMission,
          dailyResetAt, weeklyResetAt, ignoredIds, adaptedMode } = state;

  const todaySpecial = specialMission || SPECIAL_MISSION;

  const [dailyLeft,  setDailyLeft]  = useState(() => Math.max(0, MS_DAY  - (Date.now() - dailyResetAt)));
  const [weeklyLeft, setWeeklyLeft] = useState(() => Math.max(0, MS_WEEK - (Date.now() - weeklyResetAt)));

  // Persiste en localStorage en cada cambio de estado
  useEffect(() => {
    try { localStorage.setItem(lsKey(userId), JSON.stringify(state)); } catch (_) {}
  }, [state, userId]);

  // Timer de cuenta regresiva + auto-reset al llegar a 0
  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const dl  = Math.max(0, MS_DAY  - (now - state.dailyResetAt));
      const wl  = Math.max(0, MS_WEEK - (now - state.weeklyResetAt));
      setDailyLeft(dl);
      setWeeklyLeft(wl);
      const tKey = todayKey();

      if (dl === 0 || tKey !== state.dayKey) {
        const pool = state.adaptedMode ? DAILY_MISSIONS_ADAPTED : DAILY_MISSIONS;
        setState(prev => ({
          ...prev,
          dailyMissions:  pickDailyRotation(pool, userId, tKey),
          specialDone:    false,
          specialMission: pickSpecialMission(userId, tKey),
          dailyResetAt:   now,
          ignoredIds:     [],
          dayKey:         tKey,
        }));
      }
      if (wl === 0) {
        setState(prev => ({
          ...prev,
          weeklyMissions: WEEKLY_MISSIONS.map(m => ({ ...m })),
          weeklyResetAt:  now,
        }));
      }
    };
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [state.dailyResetAt, state.weeklyResetAt, state.dayKey, state.adaptedMode, userId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Abre el CompleteModal para la misión seleccionada ────────
  const openModal = useCallback((mission) => setModal(mission), []);

  // ── Oculta una misión diaria hasta el día siguiente ──────────
  const ignoreMission = useCallback((missionId) => {
    setState(prev => ({ ...prev, ignoredIds: [...(prev.ignoredIds || []), missionId] }));
  }, []);

  // ── Reemplaza una misión por otra del pool no usada hoy ──────
  const swapMission = useCallback((missionId) => {
    setState(prev => {
      const pool    = prev.adaptedMode ? DAILY_MISSIONS_ADAPTED : DAILY_MISSIONS;
      const tKey    = todayKey();
      const usedIds = new Set(prev.dailyMissions.map(m => m.id));
      const candidates = pool.filter(m => !usedIds.has(m.id));
      if (candidates.length === 0) return prev;
      const seed = tKey.split("-").reduce((a,b) => a + parseInt(b), 0) + missionId;
      const replacement = [...candidates].sort((a, b) => {
        const ha = Math.sin(seed + a.id) * 10000;
        const hb = Math.sin(seed + b.id) * 10000;
        return (ha - Math.floor(ha)) - (hb - Math.floor(hb));
      })[0];
      return {
        ...prev,
        dailyMissions: prev.dailyMissions.map(m => m.id === missionId ? { ...replacement } : m),
      };
    });
  }, []);

  // ── Cambia entre misiones estándar y adaptadas ───────────────
  const toggleAdapted = useCallback(() => {
    setState(prev => {
      const next = !prev.adaptedMode;
      const pool = next ? DAILY_MISSIONS_ADAPTED : DAILY_MISSIONS;
      const tKey = todayKey();
      return {
        ...prev,
        adaptedMode:    next,
        dailyMissions:  pickDailyRotation(pool, userId, tKey),
        ignoredIds:     [],
        specialDone:    false,
        specialMission: pickSpecialMission(userId, tKey),
        dailyResetAt:   Date.now(),
        dayKey:         tKey,
      };
    });
  }, [userId]);

  // ── Confirma recompensas al completar misión ─────────────────
  // finalXp incluye bonos de foto/GPS si el usuario los aportó.
  const handleConfirm = (finalXp) => {
    const mission = modal;
    setModal(null);
    if (!mission) return;

    const isSpecial = !!mission.stats;
    const isDaily   = dailyMissions.some(d => d.id === mission.id);
    const isWeekly  = weeklyMissions.some(w => w.id === mission.id);

    setState(prev => {
      let { dailyMissions: dm, weeklyMissions: wm, specialDone: sd } = prev;

      if (isSpecial) {
        sd = true;
      } else if (isDaily) {
        dm = dm.map(m => m.id === mission.id ? { ...m, done: true, progress: m.total } : m);
        // Avanza el progreso de las semanales del mismo stat
        wm = wm.map(w => {
          if (w.stat !== mission.stat || w.done) return w;
          const np = Math.min(w.progress + mission.total, w.total);
          return { ...w, progress: np, done: np >= w.total };
        });
      } else if (isWeekly) {
        wm = wm.map(m => m.id === mission.id ? { ...m, done: true } : m);
      }

      return { ...prev, dailyMissions: dm, weeklyMissions: wm, specialDone: sd };
    });

    if (onMissionDone) onMissionDone(mission, finalXp);
  };

  // Misiones diarias visibles (sin las ignoradas)
  const visibleDaily = dailyMissions.filter(m => !(ignoredIds || []).includes(m.id));
  const doneCount    = visibleDaily.filter(m => m.done).length;
  const wDoneCount   = weeklyMissions.filter(m => m.done).length;

  // Misiones personales activas (compradas en la Tienda, timer en curso)
  const activeCustom = (customMissions || []).filter(m => m && !m.done && m.startedAt);

  return (
    <div className="missions-page">

      {/* ── Misión especial del día (rota diariamente) ──────── */}
      <div>
        <div className="section-header">
          <span className="section-title">⚡ MISIÓN ESPECIAL</span>
          <div className="section-line" />
        </div>
        <SpecialMission
          mission={{
            ...todaySpecial,
            locked: specialDone || userLevel < 5,
            lockedReason: specialDone ? "done" : "level",
          }}
          onComplete={openModal}
        />
      </div>

      {/* ── Misiones diarias ────────────────────────────────── */}
      <div>
        <div className="section-header">
          <span className="section-title">▸ MISIONES DIARIAS</span>
          <div className="section-line" />
          <span className="section-count">{doneCount}/{visibleDaily.length}</span>
        </div>

        {/* Toggle modo adaptado (movilidad reducida) */}
        <div className="adapted-toggle-row">
          <span className="adapted-toggle-label">
            {adaptedMode ? "♿ MODO ADAPTADO" : "👤 MODO ESTÁNDAR"}
          </span>
          <button
            className={`adapted-toggle-btn${adaptedMode ? " active" : ""}`}
            onClick={toggleAdapted}
          >
            {adaptedMode ? "CAMBIAR A ESTÁNDAR" : "CAMBIAR A ADAPTADO"}
          </button>
        </div>

        <FilterBar active={filter} onChange={setFilter} />

        <div className="refresh-bar">
          <div className="refresh-left">
            <div className="refresh-dot" />
            <span className="refresh-text">SE RENUEVAN EN</span>
          </div>
          <span className="refresh-timer">{formatTimeLeft(dailyLeft)}</span>
        </div>

        {visibleDaily.length === 0 && (
          <div style={{ fontFamily:"var(--pixel)", fontSize:".4rem", color:"var(--text-dim)", padding:"1rem", textAlign:"center" }}>
            TODAS LAS MISIONES FUERON IGNORADAS · SE RENUEVAN MAÑANA
          </div>
        )}

        {/* Cada tarjeta tiene el botón ABANDONAR integrado */}
        {visibleDaily
          .filter(m => filter === FILTER_ALL || m.stat === filter)
          .map(m => (
            <MissionCard
              key={m.id}
              mission={m}
              type="daily"
              onComplete={openModal}
              onAbandon={(mission, action) => {
                if (action === "delete") ignoreMission(mission.id);
                else if (action === "swap") swapMission(mission.id);
              }}
            />
          ))
        }
      </div>

      {/* ── Misiones semanales ──────────────────────────────── */}
      <div>
        <div className="section-header">
          <span className="section-title">▸ MISIONES SEMANALES</span>
          <div className="section-line" />
          <span className="section-count">{wDoneCount}/{weeklyMissions.length}</span>
        </div>

        <div className="refresh-bar">
          <div className="refresh-left">
            <div className="refresh-dot" />
            <span className="refresh-text">SE RENUEVAN EN</span>
          </div>
          <span className="refresh-timer">{formatTimeLeft(weeklyLeft)}</span>
        </div>

        {weeklyMissions
          .filter(m => filter === FILTER_ALL || m.stat === filter)
          .map(m => (
            <MissionCard key={m.id} mission={m} type="weekly" onComplete={openModal} />
          ))
        }
      </div>

      {/* ── Misiones personales activas (de la Tienda) ──────── */}
      {activeCustom.length > 0 && (
        <div>
          <div className="section-header">
            <span className="section-title">🛒 MISIONES PERSONALES</span>
            <div className="section-line" />
            <span className="section-count">{activeCustom.length} activas</span>
          </div>
          {/* Mismo diseño visual que misiones normales */}
          {activeCustom.map((m, i) => (
            <div
              key={i}
              className="mission-card"
              style={{ "--stat-color": "var(--gold)" }}
            >
              <div className="mission-top">
                <div className="mission-left">
                  <div className="mission-stat-tag" style={{ color:"var(--gold)" }}>
                    🛒 PERSONAL
                  </div>
                  <div className="mission-name-text">{m.name}</div>
                  {m.desc && <div className="mission-desc">{m.desc}</div>}
                </div>
                <div className="mission-rewards">
                  <div className="reward-xp">+{m.xp} XP</div>
                  <div className="reward-coins">🪙 {m.cost}</div>
                  {m.dur?.label && (
                    <div style={{ fontFamily:"var(--pixel)", fontSize:".36rem", color:"var(--text-dim)" }}>
                      ⏱ {m.dur.label}
                    </div>
                  )}
                </div>
              </div>
              <div className="mission-bottom" style={{ borderTop:"1px solid rgba(245,200,66,.2)" }}>
                <div style={{ fontFamily:"var(--pixel)", fontSize:".34rem", color:"var(--text-dim)", letterSpacing:".02em" }}>
                  Gestiona desde Tienda → Misiones Custom
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CompleteModal — permite foto/GPS al completar para XP extra */}
      {modal && (
        <CompleteModal
          mission={modal}
          onClose={() => setModal(null)}
          onDone={handleConfirm}
          gpsEnabled={gpsEnabled}
          lastCoords={lastCoords}
        />
      )}
    </div>
  );
}
