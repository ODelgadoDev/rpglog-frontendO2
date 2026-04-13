/**
 * MissionsScreen.jsx — IMPROVED DEMO VERSION + CUSTOM IN FEED
 *
 * Cambios:
 *  1. Misiones diarias generadas aleatoriamente via getRandomDailyMissions()
 *  2. Seed cambia cada 30 minutos → más sensación de abundancia para demo
 *  3. Botón ABANDONAR visible y separado de recompensas
 *  4. Botón MEZCLAR visible y claro en cada misión
 *  5. Botón general "MEZCLAR MISIONES"
 *  6. Estado persistido en localStorage por usuario
 *  7. Misiones semanales vinculadas correctamente a las diarias
 *  8. Misiones custom visibles también en esta pestaña
 */
import { useState, useEffect, useCallback } from "react";
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
import MissionCard from "../components/MissionCard";
import SpecialMission from "../components/SpecialMission";
import CompleteModal from "../components/CompleteModal";

// ── Tiempos ──────────────────────────────────────────────────────
const MS_30MIN = 30 * 60 * 1000;
const MS_DAY = 24 * 60 * 60 * 1000;
const MS_WEEK = 7 * MS_DAY;

function formatTimeLeft(ms) {
  if (ms <= 0) return "00:00:00";
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sc = s % 60;
  const hms = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sc).padStart(2, "0")}`;
  return d > 0 ? `${d}d ${hms}` : hms;
}

// ── localStorage helpers ─────────────────────────────────────────
const lsGet = (k, fb) => {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : fb;
  } catch {
    return fb;
  }
};
const lsSave = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};

function saveResetAt(uid, key, val) {
  lsSave(`rpglog_reset_${key}_${uid}`, val);
}
function loadResetAt(uid, key, interval) {
  const raw = localStorage.getItem(`rpglog_reset_${key}_${uid}`);
  if (!raw) return Date.now();
  const saved = parseInt(raw, 10);
  return Date.now() - saved >= interval ? Date.now() : saved;
}

// ── Filtro ───────────────────────────────────────────────────────
const FILTER_ALL = "TODAS";
const FILTER_CUSTOM = "CUSTOM";

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

    <button
      className={`filter-btn${active === FILTER_CUSTOM ? " active" : ""}`}
      style={{ "--filter-color": "#f5c842" }}
      onClick={() => onChange(FILTER_CUSTOM)}
    >
      ⚙️ CUSTOM
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

// ── Badge simple ─────────────────────────────────────────────────
function MissionTypeBadge({ label, color = "#f5c842" }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: ".25rem",
        fontFamily: "var(--pixel)",
        fontSize: ".34rem",
        letterSpacing: ".05em",
        color,
        border: `1px solid ${color}55`,
        background: `${color}11`,
        padding: ".28rem .45rem",
        marginBottom: ".35rem",
      }}
    >
      {label}
    </div>
  );
}

// ── MissionCard con botones visibles ─────────────────────────────
function MissionCardWithActions({
  mission,
  type,
  onComplete,
  onDelete,
  onSwap,
  isCustom = false,
  canSwap = true,
}) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <div style={{ paddingLeft: ".2rem" }}>
        <MissionTypeBadge
          label={isCustom ? "⚙️ MISIÓN CUSTOM" : "⚔️ MISIÓN BÁSICA"}
          color={isCustom ? "#f5c842" : "#5b8dd9"}
        />
      </div>

      <MissionCard mission={mission} type={type} onComplete={onComplete} />

      {!mission.done && (
        <div
          style={{
            display: "flex",
            gap: ".6rem",
            justifyContent: "flex-end",
            marginTop: "-.2rem",
            marginBottom: ".4rem",
            paddingRight: ".6rem",
            flexWrap: "wrap",
          }}
        >
          {canSwap && (
            <button
              title="Cambiar por otra misión"
              onClick={() => onSwap(mission)}
              style={{
                background: "rgba(91,141,217,.14)",
                border: "1px solid rgba(91,141,217,.45)",
                color: "#5b8dd9",
                padding: ".42rem .7rem",
                cursor: "pointer",
                fontSize: ".38rem",
                fontFamily: "var(--pixel)",
                letterSpacing: ".04em",
              }}
            >
              🔁 MEZCLAR
            </button>
          )}

          <button
            title="Descartar esta misión"
            onClick={() => onDelete(mission.id || mission._id)}
            style={{
              background: "rgba(224,82,82,.14)",
              border: "1px solid rgba(224,82,82,.45)",
              color: "#e05252",
              padding: ".42rem .7rem",
              cursor: "pointer",
              fontSize: ".38rem",
              fontFamily: "var(--pixel)",
              letterSpacing: ".04em",
            }}
          >
            ✖ ABANDONAR
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
  onCustomMissionComplete,
  customMissions = [],
  setCustomMissions,
  userLevel = 1,
  userId = "default",
  gpsEnabled = false,
  lastCoords = null,
}) {
  const { user } = useAuth();
  const isAuth = !!user;

  // ── Timestamps de reset ──────────────────────────────────────
  const [dailyResetAt, setDailyResetAt] = useState(() => loadResetAt(userId, "daily", MS_30MIN));
  const [weeklyResetAt, setWeeklyResetAt] = useState(() => loadResetAt(userId, "weekly", MS_WEEK));
  const [specialResetAt, setSpecialResetAt] = useState(() => loadResetAt(userId, "special", MS_DAY));

  // ── Misiones ─────────────────────────────────────────────────
  const [dailyMissions, setDailyMissions] = useState(() => {
    const saved = lsGet(`rpglog_daily_${userId}`, null);
    if (saved && Array.isArray(saved) && saved.length > 0) {
      return saved;
    }
    return getRandomDailyMissions(userId, Date.now());
  });

  const [weeklyMissions, setWeeklyMissions] = useState(() => {
    const saved = lsGet(`rpglog_weekly_${userId}`, null);
    return saved || WEEKLY_MISSIONS.map((m) => ({ ...m }));
  });

  const [specialDone, setSpecialDone] = useState(() => {
    try {
      return localStorage.getItem(`rpglog_sp_done_${userId}`) === "1";
    } catch {
      return false;
    }
  });

  // ── Timers ────────────────────────────────────────────────────
  const [dailyLeft, setDailyLeft] = useState(() =>
    Math.max(0, MS_30MIN - (Date.now() - loadResetAt(userId, "daily", MS_30MIN)))
  );
  const [weeklyLeft, setWeeklyLeft] = useState(() =>
    Math.max(0, MS_WEEK - (Date.now() - loadResetAt(userId, "weekly", MS_WEEK)))
  );
  const [specialLeft, setSpecialLeft] = useState(() =>
    Math.max(0, MS_DAY - (Date.now() - loadResetAt(userId, "special", MS_DAY)))
  );

  // ── Backend loading ───────────────────────────────────────────
  const [loadingDaily, setLoadingDaily] = useState(false);
  const [dailyError, setDailyError] = useState(null);

  // ── Modal + filtro ────────────────────────────────────────────
  const [modal, setModal] = useState(null);
  const [filter, setFilter] = useState(FILTER_ALL);

  // ── Persistencia ──────────────────────────────────────────────
  useEffect(() => {
    if (dailyMissions.length > 0) {
      lsSave(`rpglog_daily_${userId}`, dailyMissions);
    }
  }, [dailyMissions, userId]);

  useEffect(() => {
    lsSave(`rpglog_weekly_${userId}`, weeklyMissions);
  }, [weeklyMissions, userId]);

  // ── Carga inicial backend ─────────────────────────────────────
  useEffect(() => {
    if (!isAuth || !getToken()) return;
    setLoadingDaily(true);
    setDailyError(null);

    questsApi
      .seedDaily()
      .then(() => questsApi.list())
      .then((data) => {
        const backendDaily = (data.quests || [])
          .filter((q) => q.type === "daily" && !q.deleted && !q.completed)
          .map(mapQuest);

        if (backendDaily.length > 0) {
          setDailyMissions(backendDaily);
        }
      })
      .catch((err) => {
        setDailyError(err.message);
      })
      .finally(() => setLoadingDaily(false));
  }, [isAuth]);

  // ── Timer tick ────────────────────────────────────────────────
  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const dl = Math.max(0, MS_30MIN - (now - dailyResetAt));
      const wl = Math.max(0, MS_WEEK - (now - weeklyResetAt));
      const sl = Math.max(0, MS_DAY - (now - specialResetAt));

      setDailyLeft(dl);
      setWeeklyLeft(wl);
      setSpecialLeft(sl);

      if (dl === 0) {
        const next = now;
        setDailyResetAt(next);
        saveResetAt(userId, "daily", next);

        const freshMissions = getRandomDailyMissions(userId, Date.now());
        setDailyMissions(freshMissions);

        if (isAuth && getToken()) {
          questsApi.seedDaily().catch(() => {});
        }
      }

      if (wl === 0) {
        const next = now;
        setWeeklyResetAt(next);
        saveResetAt(userId, "weekly", next);
        setWeeklyMissions(WEEKLY_MISSIONS.map((m) => ({ ...m })));
      }

      if (sl === 0 && specialDone) {
        const next = now;
        setSpecialDone(false);
        try {
          localStorage.removeItem(`rpglog_sp_done_${userId}`);
        } catch {}
        setSpecialResetAt(next);
        saveResetAt(userId, "special", next);
      }
    };

    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [dailyResetAt, weeklyResetAt, specialResetAt, specialDone, isAuth, userId]);

  // ── Abandonar misión básica ───────────────────────────────────
  const handleDelete = useCallback((missionId) => {
    setDailyMissions((prev) => prev.filter((m) => m.id !== missionId && m._id !== missionId));
  }, []);

  // ── Abandonar misión custom ───────────────────────────────────
  const handleDeleteCustom = useCallback((missionId) => {
    if (!setCustomMissions) return;
    setCustomMissions((prev) => prev.filter((m) => m.id !== missionId && m._id !== missionId && m.backendQuestId !== missionId));
  }, [setCustomMissions]);

  // ── Mezclar misión ────────────────────────────────────────────
  const handleSwap = useCallback(
    (mission) => {
      const alt = getAlternateMission(mission.stat, mission.name, userId);
      if (!alt) return;
      setDailyMissions((prev) =>
        prev.map((m) => ((m._id || m.id) === (mission._id || mission.id) ? alt : m))
      );
    },
    [userId]
  );

  // ── Completar misión ──────────────────────────────────────────
  const handleConfirm = useCallback(
    async (finalXp, questId, gpsCoords) => {
      const mission = modal;
      setModal(null);
      if (!mission) return;

      const isSpecial = !!mission.stats && mission.id === SPECIAL_MISSION.id;
      const missionId = mission._id || mission.id;
      const isDaily = dailyMissions.some((d) => (d._id || d.id) === missionId);
      const isWeekly = weeklyMissions.some((w) => w.id === missionId);
      const isCustom = customMissions.some((c) => (c.backendQuestId || c.id || c._id) === missionId);

      if (isDaily) {
        setDailyMissions((prev) =>
          prev.map((m) => ((m._id || m.id) === missionId ? { ...m, done: true } : m))
        );

        setWeeklyMissions((prev) =>
          prev.map((w) => {
            if (w.stat !== mission.stat || w.done) return w;
            const newProgress = Math.min(w.progress + (mission.weeklyIncrement || 1), w.total);
            return { ...w, progress: newProgress };
          })
        );

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

        if (onMissionDone) onMissionDone(mission, finalXp);
      }

      if (isCustom) {
        const found = customMissions.find((c) => (c.backendQuestId || c.id || c._id) === missionId);
        if (found && onCustomMissionComplete) {
          await onCustomMissionComplete(found, { finalXp, questId, gpsCoords });
        }

        if (setCustomMissions) {
          setCustomMissions((prev) =>
            prev.map((m) =>
              (m.backendQuestId || m.id || m._id) === missionId ? { ...m, done: true } : m
            )
          );
        }
      }

      if (isSpecial) {
        setSpecialDone(true);
        try {
          localStorage.setItem(`rpglog_sp_done_${userId}`, "1");
        } catch {}
        const next = Date.now();
        setSpecialResetAt(next);
        saveResetAt(userId, "special", next);
      }

      if (isWeekly) {
        setWeeklyMissions((prev) =>
          prev.map((m) => (m.id === missionId ? { ...m, done: true } : m))
        );
        if (onMissionDone) onMissionDone(mission, finalXp);
      }
    },
    [
      modal,
      dailyMissions,
      weeklyMissions,
      customMissions,
      isAuth,
      userId,
      onMissionDone,
      onCustomMissionComplete,
      setCustomMissions,
    ]
  );

  const doneCount = dailyMissions.filter((m) => m.done).length;
  const wDoneCount = weeklyMissions.filter((m) => m.done).length;
  const customActiveCount = customMissions.filter((m) => !m.done).length;

  const visibleDaily =
    filter === FILTER_ALL
      ? dailyMissions
      : filter === FILTER_CUSTOM
        ? []
        : dailyMissions.filter((m) => m.stat === filter);

  const visibleWeekly =
    filter === FILTER_ALL
      ? weeklyMissions
      : filter === FILTER_CUSTOM
        ? []
        : weeklyMissions.filter((m) => m.stat === filter);

  const visibleCustom =
    filter === FILTER_ALL
      ? customMissions.filter((m) => !m.done)
      : filter === FILTER_CUSTOM
        ? customMissions.filter((m) => !m.done)
        : [];

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

      {/* ── Misiones diarias + custom ───────────────────────── */}
      <div>
        <div className="section-header">
          <span className="section-title">▸ FEED DE MISIONES</span>
          <div className="section-line" />
          <span className="section-count">
            {doneCount}/{dailyMissions.length} · CUSTOM {customActiveCount}
          </span>
        </div>

        <FilterBar active={filter} onChange={setFilter} />

        <div className="refresh-bar">
          <div className="refresh-left">
            <div className="refresh-dot" />
            <span className="refresh-text">SE RENUEVAN EN</span>
          </div>
          <span className="refresh-timer">{formatTimeLeft(dailyLeft)}</span>
        </div>

        {!loadingDaily && (
          <div
            style={{
              fontFamily: "var(--pixel)",
              fontSize: ".38rem",
              color: "var(--text-dim)",
              padding: ".25rem .2rem .8rem .2rem",
            }}
          >
            El feed rota cada 30 minutos para que siempre tengas nuevas opciones. Tus misiones custom también aparecen aquí.
          </div>
        )}

        {loadingDaily && (
          <div
            style={{
              fontFamily: "var(--pixel)",
              fontSize: ".46rem",
              color: "var(--text-dim)",
              padding: "1.5rem",
              textAlign: "center",
            }}
          >
            ⏳ CARGANDO MISIONES...
          </div>
        )}

        {!loadingDaily && dailyError && (
          <div
            style={{
              fontFamily: "var(--pixel)",
              fontSize: ".4rem",
              color: "var(--orange)",
              padding: ".5rem 1rem",
            }}
          >
            ⚠ Sin conexión — misiones locales activas
          </div>
        )}

        {!loadingDaily && visibleDaily.length === 0 && visibleCustom.length === 0 && filter !== FILTER_CUSTOM && (
          <div
            style={{
              fontFamily: "var(--pixel)",
              fontSize: ".4rem",
              color: "var(--text-dim)",
              padding: "1rem",
              textAlign: "center",
            }}
          >
            SIN MISIONES PARA ESTE FILTRO
          </div>
        )}

        {!loadingDaily && filter === FILTER_CUSTOM && visibleCustom.length === 0 && (
          <div
            style={{
              fontFamily: "var(--pixel)",
              fontSize: ".4rem",
              color: "var(--text-dim)",
              padding: "1rem",
              textAlign: "center",
            }}
          >
            NO TIENES MISIONES CUSTOM ACTIVAS
          </div>
        )}

        {!loadingDaily &&
          visibleCustom.map((m) => (
            <MissionCardWithActions
              key={m.backendQuestId || m.id || m._id}
              mission={{
                ...m,
                id: m.backendQuestId || m.id || m._id,
                icon: "⚙️",
                color: "#f5c842",
                stat: "CUSTOM",
                unit: "vez",
                total: 1,
                progress: 0,
              }}
              type="daily"
              onComplete={setModal}
              onDelete={handleDeleteCustom}
              onSwap={() => {}}
              isCustom
              canSwap={false}
            />
          ))}

        {!loadingDaily &&
          visibleDaily.map((m) => (
            <MissionCardWithActions
              key={m._id || m.id}
              mission={m}
              type="daily"
              onComplete={setModal}
              onDelete={handleDelete}
              onSwap={handleSwap}
            />
          ))}

        {!loadingDaily && (
          <div style={{ textAlign: "center", marginTop: ".7rem" }}>
            <button
              onClick={() => {
                const fresh = getRandomDailyMissions(userId, Date.now());
                setDailyMissions(fresh);
                const now = Date.now();
                setDailyResetAt(now);
                saveResetAt(userId, "daily", now);
              }}
              style={{
                background: "rgba(91,141,217,.08)",
                border: "1px dashed var(--border)",
                fontFamily: "var(--pixel)",
                fontSize: ".4rem",
                color: "var(--text)",
                padding: ".6rem 1rem",
                cursor: "pointer",
                letterSpacing: ".04em",
              }}
            >
              🔄 MEZCLAR MISIONES DEL FEED
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

        {visibleWeekly.map((m) => (
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