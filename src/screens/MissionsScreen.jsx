/**
 * MissionsScreen.jsx — FIXED + DYNAMIC MISSIONS
 *
 * Cambios vs versión original:
 *  1. Misiones diarias generadas aleatoriamente via getRandomDailyMissions()
 *  2. Seed cambia cada 6 horas → misiones distintas cada periodo
 *  3. Botón ❌ Eliminar misión (la quita de la lista activa)
 *  4. Botón 🔁 Cambiar misión (reemplaza por otra del mismo stat)
 *  5. Estado persistido en localStorage por usuario
 *  6. Misiones semanales vinculadas correctamente a las diarias
 */
import { useState, useEffect, useCallback, useRef } from "react";
import "../styles/MissionsScreen.css";

import {
  WEEKLY_MISSIONS,
  SPECIAL_MISSION,
  STAT_GROUPS,
} from "../data/constants";

import {
  getRandomDailyMissions,
  getAlternateMission,
} from "../data/missionsPool";

import { questsApi, mapQuest, getToken } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import MissionCard   from "../components/MissionCard";
import SpecialMission from "../components/SpecialMission";
import CompleteModal  from "../components/CompleteModal";

// ── Tiempos ──────────────────────────────────────────────────────
const MS_6H   =  6 * 60 * 60 * 1000;
const MS_DAY  = 24 * 60 * 60 * 1000;
const MS_WEEK =  7 * MS_DAY;

function formatTimeLeft(ms) {
  if (ms <= 0) return "00:00:00";
  const s  = Math.floor(ms / 1000);
  const d  = Math.floor(s / 86400);
  const h  = Math.floor((s % 86400) / 3600);
  const m  = Math.floor((s % 3600) / 60);
  const sc = s % 60;
  const hms = `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(sc).padStart(2,"0")}`;
  return d > 0 ? `${d}d ${hms}` : hms;
}

// ── localStorage helpers ─────────────────────────────────────────
const lsKey = (uid) => `rpglog_missions_v2_${uid || "default"}`;
const lsGet = (k, fb) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } };
const lsSave = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

function saveResetAt(uid, key, val) {
  lsSave(`rpglog_reset_${key}_${uid}`, val);
}
function loadResetAt(uid, key, interval) {
  const raw = localStorage.getItem(`rpglog_reset_${key}_${uid}`);
  if (!raw) return Date.now();
  const saved = parseInt(raw, 10);
  return (Date.now() - saved >= interval) ? Date.now() : saved;
}

// ── Filtro ───────────────────────────────────────────────────────
const FILTER_ALL = "TODAS";

const FilterBar = ({ active, onChange }) => (
  <div className="filter-bar">
    <span className="filter-label">▸ FILTRAR:</span>
    <button
      className={`filter-btn${active === FILTER_ALL ? " active" : ""}`}
      style={{ "--filter-color": "var(--gold)" }}
      onClick={() => onChange(FILTER_ALL)}
    >
      ⚔️ TODAS
    </button>
    {STAT_GROUPS.map((g) => (
      <button
        key={g.key}
        className={`filter-btn${active === g.key ? " active" : ""}`}
        style={{ "--filter-color": g.color }}
        onClick={() => onChange(g.key)}
      >
        {g.icon} {g.key}
      </button>
    ))}
  </div>
);

// ── MissionCard con botones de gestión ───────────────────────────
function MissionCardWithActions({ mission, type, onComplete, onDelete, onSwap }) {
  return (
    <div style={{ position: "relative" }}>
      <MissionCard mission={mission} type={type} onComplete={onComplete} />
      {!mission.done && (
        <div style={{
          position: "absolute", top: ".55rem", right: ".7rem",
          display: "flex", gap: ".35rem", zIndex: 2,
        }}>
          {/* Cambiar misión */}
          <button
            title="Cambiar por otra misión aleatoria"
            onClick={() => onSwap(mission)}
            style={{
              background: "rgba(91,141,217,.15)",
              border: "1px solid rgba(91,141,217,.4)",
              color: "#5b8dd9", width: 28, height: 28,
              cursor: "pointer", fontSize: "0.8rem",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            🔁
          </button>
          {/* Eliminar misión */}
          <button
            title="Eliminar esta misión"
            onClick={() => onDelete(mission.id)}
            style={{
              background: "rgba(224,82,82,.15)",
              border: "1px solid rgba(224,82,82,.4)",
              color: "#e05252", width: 28, height: 28,
              cursor: "pointer", fontSize: "0.8rem",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            ❌
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────
export default function MissionsScreen({
  onMissionDone,
  userLevel = 1,
  userId = "default",
  gpsEnabled = false,
  lastCoords = null,
}) {
  const { user } = useAuth();
  const isAuth = !!user;

  // ── Timestamps de reset ──────────────────────────────────────
  const [dailyResetAt,   setDailyResetAt]   = useState(() => loadResetAt(userId, "daily",   MS_6H));
  const [weeklyResetAt,  setWeeklyResetAt]  = useState(() => loadResetAt(userId, "weekly",  MS_WEEK));
  const [specialResetAt, setSpecialResetAt] = useState(() => loadResetAt(userId, "special", MS_DAY));

  // ── Misiones ─────────────────────────────────────────────────
  const [dailyMissions,  setDailyMissions]  = useState(() => {
    const saved = lsGet(`rpglog_daily_${userId}`, null);
    if (saved && Array.isArray(saved) && saved.length > 0) {
      return saved;
    }
    return getRandomDailyMissions(userId);
  });

  const [weeklyMissions, setWeeklyMissions] = useState(() => {
    const saved = lsGet(`rpglog_weekly_${userId}`, null);
    return saved || WEEKLY_MISSIONS.map(m => ({ ...m }));
  });

  const [specialDone,    setSpecialDone]    = useState(() => {
    try { return localStorage.getItem(`rpglog_sp_done_${userId}`) === "1"; } catch { return false; }
  });

  // ── Timers ────────────────────────────────────────────────────
  const [dailyLeft,   setDailyLeft]   = useState(() => Math.max(0, MS_6H  - (Date.now() - loadResetAt(userId, "daily",   MS_6H))));
  const [weeklyLeft,  setWeeklyLeft]  = useState(() => Math.max(0, MS_WEEK - (Date.now() - loadResetAt(userId, "weekly",  MS_WEEK))));
  const [specialLeft, setSpecialLeft] = useState(() => Math.max(0, MS_DAY  - (Date.now() - loadResetAt(userId, "special", MS_DAY))));

  // ── Backend loading ───────────────────────────────────────────
  const [loadingDaily, setLoadingDaily] = useState(false);
  const [dailyError,   setDailyError]   = useState(null);

  // ── Modal + filtro ────────────────────────────────────────────
  const [modal,  setModal]  = useState(null);
  const [filter, setFilter] = useState(FILTER_ALL);
  const { safeApiCall } = { safeApiCall: async (fn) => { try { return await fn(); } catch (e) { throw e; } } };

  // ── Persistir daily en localStorage ──────────────────────────
  useEffect(() => {
    if (dailyMissions.length > 0) {
      lsSave(`rpglog_daily_${userId}`, dailyMissions);
    }
  }, [dailyMissions, userId]);

  useEffect(() => {
    lsSave(`rpglog_weekly_${userId}`, weeklyMissions);
  }, [weeklyMissions, userId]);

  // ── Carga inicial backend (solo si autenticado) ───────────────
  useEffect(() => {
    if (!isAuth || !getToken()) return;
    setLoadingDaily(true);
    setDailyError(null);

    questsApi.seedDaily()
      .then(() => questsApi.list())
      .then((data) => {
        const backendDaily = (data.quests || [])
          .filter(q => q.type === "daily" && !q.deleted && !q.completed)
          .map(mapQuest);

        if (backendDaily.length > 0) {
          setDailyMissions(backendDaily);
        }
        // Si el backend no devuelve nada, mantener las locales generadas
      })
      .catch((err) => {
        setDailyError(err.message);
        // Mantener misiones locales
      })
      .finally(() => setLoadingDaily(false));
  }, [isAuth]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Timer tick (1s) ──────────────────────────────────────────
  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const dl = Math.max(0, MS_6H   - (now - dailyResetAt));
      const wl = Math.max(0, MS_WEEK  - (now - weeklyResetAt));
      const sl = Math.max(0, MS_DAY   - (now - specialResetAt));
      setDailyLeft(dl);
      setWeeklyLeft(wl);
      setSpecialLeft(sl);

      // Reset diario
      if (dl === 0) {
        const next = now;
        setDailyResetAt(next);
        saveResetAt(userId, "daily", next);
        const freshMissions = getRandomDailyMissions(userId);
        setDailyMissions(freshMissions);

        if (isAuth && getToken()) {
          questsApi.seedDaily().catch(() => {});
        }
      }

      // Reset semanal
      if (wl === 0) {
        const next = now;
        setWeeklyResetAt(next);
        saveResetAt(userId, "weekly", next);
        setWeeklyMissions(WEEKLY_MISSIONS.map(m => ({ ...m })));
      }

      // Reset especial
      if (sl === 0 && specialDone) {
        const next = now;
        setSpecialDone(false);
        try { localStorage.removeItem(`rpglog_sp_done_${userId}`); } catch {}
        setSpecialResetAt(next);
        saveResetAt(userId, "special", next);
      }
    };

    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [dailyResetAt, weeklyResetAt, specialResetAt, specialDone, isAuth, userId]);

  // ── Eliminar misión ───────────────────────────────────────────
  const handleDelete = useCallback((missionId) => {
    setDailyMissions(prev => prev.filter(m => m.id !== missionId));
  }, []);

  // ── Cambiar misión por otra aleatoria del mismo stat ──────────
  const handleSwap = useCallback((mission) => {
    const alt = getAlternateMission(mission.stat, mission.name, userId);
    if (!alt) return;
    setDailyMissions(prev => prev.map(m => m.id === mission.id ? alt : m));
  }, [userId]);

  // ── Completar misión ─────────────────────────────────────────
  const handleConfirm = useCallback(async (finalXp, questId, gpsCoords) => {
    const mission   = modal;
    setModal(null);
    if (!mission) return;

    const isSpecial  = !!mission.stats;
    const missionId  = mission._id || mission.id;
    const isDaily    = dailyMissions.some(d => (d._id || d.id) === missionId);
    const isWeekly   = weeklyMissions.some(w => w.id === missionId);

    // ── Completar diaria ─────────────────────────────────────
    if (isDaily) {
      // Marcar como done localmente
      setDailyMissions(prev =>
        prev.map(m => ((m._id || m.id) === missionId ? { ...m, done: true } : m))
      );

      // Actualizar semanales vinculadas
      setWeeklyMissions(prev =>
        prev.map(w => {
          if (w.stat !== mission.stat || w.done) return w;
          const newProgress = Math.min(w.progress + (mission.weeklyIncrement || 1), w.total);
          return { ...w, progress: newProgress };
        })
      );

      // Backend
      if (isAuth && questId && getToken()) {
        try {
          await questsApi.complete(questId);
          if (mission.photoEvidenceEnabled && finalXp > mission.xp) {
            questsApi.submitPhotoEvidence(questId).catch(() => {});
          }
          if (mission.locationEvidenceEnabled && gpsCoords) {
            questsApi.submitLocationEvidence(questId, gpsCoords).catch(() => {});
          }
        } catch {}
      }
    }

    // ── Completar especial ───────────────────────────────────
    if (isSpecial) {
      setSpecialDone(true);
      try { localStorage.setItem(`rpglog_sp_done_${userId}`, "1"); } catch {}
      const next = Date.now();
      setSpecialResetAt(next);
      saveResetAt(userId, "special", next);
    }

    // ── Completar semanal ────────────────────────────────────
    if (isWeekly) {
      setWeeklyMissions(prev =>
        prev.map(m => m.id === missionId ? { ...m, done: true } : m)
      );
    }

    if (onMissionDone) onMissionDone(mission, finalXp);
  }, [modal, dailyMissions, weeklyMissions, isAuth, userId, onMissionDone]);

  // ── Render ────────────────────────────────────────────────────
  const doneCount  = dailyMissions.filter(m => m.done).length;
  const wDoneCount = weeklyMissions.filter(m => m.done).length;

  const visibleDaily = filter === FILTER_ALL
    ? dailyMissions
    : dailyMissions.filter(m => m.stat === filter);

  const visibleWeekly = filter === FILTER_ALL
    ? weeklyMissions
    : weeklyMissions.filter(m => m.stat === filter);

  return (
    <div className="missions-page">

      {/* ── Misión especial ────────────────────────────────── */}
      <div>
        <div className="section-header">
          <span className="section-title">⚡ MISIÓN ESPECIAL</span>
          <div className="section-line" />
        </div>
        <SpecialMission
          mission={{
            ...SPECIAL_MISSION,
            locked: specialDone || userLevel < 5,
            lockedReason: specialDone ? "done" : "level",
          }}
          onComplete={setModal}
        />
        {specialDone && (
          <div className="refresh-bar" style={{ marginTop: ".5rem" }}>
            <div className="refresh-left">
              <div className="refresh-dot" style={{ background: "var(--orange)" }} />
              <span className="refresh-text">DISPONIBLE EN</span>
            </div>
            <span className="refresh-timer" style={{ color: "var(--orange)" }}>
              {formatTimeLeft(specialLeft)}
            </span>
          </div>
        )}
      </div>

      {/* ── Misiones diarias ──────────────────────────────── */}
      <div>
        <div className="section-header">
          <span className="section-title">▸ MISIONES DIARIAS</span>
          <div className="section-line" />
          <span className="section-count">{doneCount}/{dailyMissions.length}</span>
        </div>

        <FilterBar active={filter} onChange={setFilter} />

        <div className="refresh-bar">
          <div className="refresh-left">
            <div className="refresh-dot" />
            <span className="refresh-text">SE RENUEVAN EN</span>
          </div>
          <span className="refresh-timer">{formatTimeLeft(dailyLeft)}</span>
        </div>

        {loadingDaily && (
          <div style={{ fontFamily: "var(--pixel)", fontSize: ".46rem", color: "var(--text-dim)", padding: "1.5rem", textAlign: "center" }}>
            ⏳ CARGANDO MISIONES...
          </div>
        )}
        {!loadingDaily && dailyError && (
          <div style={{ fontFamily: "var(--pixel)", fontSize: ".4rem", color: "var(--orange)", padding: ".5rem 1rem" }}>
            ⚠ Sin conexión — misiones locales activas
          </div>
        )}

        {!loadingDaily && visibleDaily.length === 0 && (
          <div style={{ fontFamily: "var(--pixel)", fontSize: ".4rem", color: "var(--text-dim)", padding: "1rem", textAlign: "center" }}>
            SIN MISIONES PARA ESTE STAT
          </div>
        )}

        {!loadingDaily && visibleDaily.map(m => (
          <MissionCardWithActions
            key={m._id || m.id}
            mission={m}
            type="daily"
            onComplete={setModal}
            onDelete={handleDelete}
            onSwap={handleSwap}
          />
        ))}

        {/* Botón para generar nuevas misiones manualmente */}
        {!loadingDaily && (
          <div style={{ textAlign: "center", marginTop: ".6rem" }}>
            <button
              onClick={() => setDailyMissions(getRandomDailyMissions(userId, Date.now()))}
              style={{
                background: "none", border: "1px dashed var(--border)",
                fontFamily: "var(--pixel)", fontSize: ".38rem", color: "var(--text-dim)",
                padding: ".5rem 1rem", cursor: "pointer", letterSpacing: ".04em",
              }}
            >
              🔄 MEZCLAR MISIONES
            </button>
          </div>
        )}
      </div>

      {/* ── Misiones semanales ────────────────────────────── */}
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

        {visibleWeekly.map(m => (
          <MissionCard key={m.id} mission={m} type="weekly" onComplete={setModal} />
        ))}
      </div>

      {/* ── Modal recompensas ──────────────────────────────── */}
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