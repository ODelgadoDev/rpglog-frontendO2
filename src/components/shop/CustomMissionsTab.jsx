/**
 * CustomMissionsTab.jsx — Tab de misiones personalizadas (Tienda)
 * ─────────────────────────────────────────────────────
 * Gestiona los 3 slots de misiones custom. NINGUNO viene desbloqueado
 * por defecto — el usuario debe comprar cada slot antes de poder usarlo.
 *
 * PRECIOS DE SLOTS (SLOT_PRICES de data/shop.js):
 *   Slot 1 → 150🪙   Slot 2 → 300🪙   Slot 3 → 500🪙
 *
 * FLUJO:
 *   1. Slot bloqueado → card con precio → botón DESBLOQUEAR
 *   2. Slot desbloqueado y vacío → botón CREAR MISIÓN CUSTOM
 *   3. Slot con misión activa → muestra timer + info + botón COMPLETAR al llegar a 0
 *
 * TIMER:
 *   Al crear una misión se guarda startedAt (timestamp ms) y durationMs.
 *   MissionTimer actualiza el tiempo restante cada segundo con setInterval.
 *   Cuando llega a 0 el botón COMPLETAR se activa.
 *
 * PERSISTENCIA:
 *   El estado de slots comprados (unlockedSlots: Set de índices) y las
 *   misiones activas (customMissions) se persisten en HomeScreen via props.
 *   HomeScreen los guarda en localStorage bajo clave por usuario.
 *
 * Props:
 *   coins / setCoins          — monedero del usuario
 *   customMissions            — array de misiones activas (desde HomeScreen)
 *   setCustomMissions         — actualiza el array en HomeScreen
 *   onMissionComplete(m)      — propaga XP+monedas completadas a HomeScreen
 *   unlockedSlots             — Set<number> de índices de slots comprados {0,1,2}
 *   setUnlockedSlots          — actualiza los slots desbloqueados
 */
import { useState, useEffect, useRef } from "react";
import { SHOP_STATS, SLOT_PRICES } from "../../data/shop";
import MissionBuilder from "./MissionBuilder";
import ConfirmModal   from "./ConfirmModal";
import CompleteModal  from "../CompleteModal";

const TOTAL_SLOTS = 3; // número fijo de slots

// Formatea ms → "HH:MM:SS"
function fmtMs(ms) {
  if (ms <= 0) return "00:00:00";
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sc = s % 60;
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(sc).padStart(2,"0")}`;
}

// Subcomponente de timer individual por misión activa.
// Llama onReady() una sola vez cuando el tiempo llega a 0
// para notificar al padre y forzar su re-render.
function MissionTimer({ startedAt, durationMs, onReady }) {
  const [left, setLeft] = useState(() => Math.max(0, durationMs - (Date.now() - startedAt)));
  const notified = useRef(false);

  useEffect(() => {
    const id = setInterval(() => {
      const remaining = Math.max(0, durationMs - (Date.now() - startedAt));
      setLeft(remaining);
      if (remaining === 0 && !notified.current) {
        notified.current = true;
        onReady && onReady();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [startedAt, durationMs, onReady]);

  // Si ya estaba listo al montar (recarga de página), notificar de inmediato
  useEffect(() => {
    if (left === 0 && !notified.current) {
      notified.current = true;
      onReady && onReady();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const done = left === 0;
  return (
    <div className={`am-timer${done ? " am-timer-done" : ""}`}>
      {done ? "⏰ LISTO PARA COMPLETAR" : `⏱ ${fmtMs(left)}`}
    </div>
  );
}

export default function CustomMissionsTab({
  coins,
  customMissions, setCustomMissions,
  onMissionComplete,
  unlockedSlots, setUnlockedSlots,
  onUnlockSlot,
  onCreateCustomMission,
}) {
  const [showBuilder,  setShowBuilder]  = useState(false);
  const [targetSlot,   setTargetSlot]   = useState(null); // índice del slot donde crear
  const [confirmBuy,   setConfirmBuy]   = useState(null); // { slotIdx, price }
  const [confirmDone,  setConfirmDone]  = useState(null); // { mission, mIdx }

  // Set de índices de misiones listas — se puebla via callback desde MissionTimer.
  // Necesario porque MissionTimer tiene su propio estado y no re-renderiza el padre
  // al llegar a 0; el callback fuerza el re-render aquí para mostrar el botón COMPLETAR.
  const [readyMissions, setReadyMissions] = useState(() => {
    const initial = new Set();
    customMissions.forEach((m, i) => {
      if (!m.done && (Date.now() - m.startedAt) >= m.durationMs) initial.add(i);
    });
    return initial;
  });

  const markReady = (mIdx) =>
    setReadyMissions(prev => prev.has(mIdx) ? prev : new Set([...prev, mIdx]));

  // Comprar un slot → descontar monedas y añadir al set
  const handleBuySlot = async () => {
    const { slotIdx, price } = confirmBuy;
    const unlocked = await onUnlockSlot(slotIdx, price);
    if (!unlocked) return;
    setUnlockedSlots((prev) => new Set([...prev, slotIdx]));
    setConfirmBuy(null);
  };

  // Crear misión en el slot seleccionado
  const handleCreate = async (mission) => {
    const createdMission = await onCreateCustomMission(mission, targetSlot);
    if (!createdMission) return;

    setCustomMissions((prev) => [...prev, createdMission]);
    setShowBuilder(false);
    setTargetSlot(null);
  };

  // Completar misión → propaga recompensas
  const handleComplete = async (mission, mIdx, extra = {}) => {
    setCustomMissions((prev) =>
      prev.map((m, i) => (i === mIdx ? { ...m, done: true } : m))
    );
    if (onMissionComplete) await onMissionComplete(mission, extra);
    setConfirmDone(null);
  };

  // Abandonar misión sin recompensas
  const handleAbandon = (mIdx) => setCustomMissions(prev => prev.filter((_, i) => i !== mIdx));

  // Misión activa para un slot dado (no completada)
  const missionForSlot = (slotIdx) => {
    const idx = customMissions.findIndex(m => m.slotIdx === slotIdx && !m.done);
    return idx >= 0 ? { mission: customMissions[idx], mIdx: idx } : null;
  };

  return (
    <>
      {/* ── Sección de slots ─────────────────────── */}
      <div className="shop-section">
        <div className="shop-sec-header">
          <span className="shop-sec-title">⚙️ ESPACIOS DE MISIÓN</span>
          <div className="shop-sec-line" />
          <span className="shop-sec-count">{unlockedSlots.size}/{TOTAL_SLOTS}</span>
        </div>

        {Array.from({ length: TOTAL_SLOTS }, (_, slotIdx) => {
          const price     = SLOT_PRICES[slotIdx];
          const unlocked  = unlockedSlots.has(slotIdx);
          const active    = missionForSlot(slotIdx);
          const canAfford = coins >= price;

          // ── SLOT BLOQUEADO ─────────────────────────
          if (!unlocked) {
            return (
              <div key={slotIdx} className="slot-card slot-locked-card">
                <div className="slot-header">
                  <div className="slot-title">ESPACIO {slotIdx + 1}</div>
                  <div className="slot-badge slot-badge-locked">🔒 BLOQUEADO</div>
                </div>
                <div className="slot-buy-row">
                  <div className="slot-buy-desc">
                    Desbloquea este espacio para crear una misión personalizada adicional.
                  </div>
                  <button
                    className="btn-buy"
                    disabled={!canAfford}
                    style={!canAfford ? { opacity: .5, cursor: "not-allowed" } : {}}
                    onClick={() => setConfirmBuy({ slotIdx, price })}
                  >
                    {canAfford ? `🪙 ${price}` : `Sin fondos (🪙${price})`}
                  </button>
                </div>
              </div>
            );
          }

          // ── SLOT DESBLOQUEADO CON MISIÓN ACTIVA ───
          if (active) {
            const { mission, mIdx } = active;
            const statObjs = SHOP_STATS.filter(s => mission.stats.includes(s.id));
            const ready    = readyMissions.has(mIdx);

            return (
              <div key={slotIdx} className="slot-card">
                <div className="slot-header">
                  <div className="slot-title">{mission.name}</div>
                  <div className="slot-badge">ACTIVA</div>
                </div>
                <div className="active-mission">
                  {mission.desc && <div className="am-desc">{mission.desc}</div>}
                  <div className="am-tags">
                    {statObjs.map(s => (
                      <div key={s.id} className="am-tag" style={{ "--tc": s.color }}>{s.icon} {s.name}</div>
                    ))}
                  </div>
                  <div className="am-meta">
                    <div className="am-meta-item">
                      <div className="am-meta-lbl">DURACIÓN</div>
                      <div className="am-meta-val">{mission.dur.label}</div>
                    </div>
                    <div className="am-meta-item">
                      <div className="am-meta-lbl">XP AL COMPLETAR</div>
                      <div className="am-meta-val" style={{ color:"var(--purple)" }}>+{mission.xp} XP</div>
                    </div>
                    <div className="am-meta-item">
                      <div className="am-meta-lbl">MONEDAS</div>
                      <div className="am-meta-val" style={{ color:"var(--gold)" }}>🪙 +{mission.cost}</div>
                    </div>
                  </div>

                  {/* Timer dinámico */}
                  <div className="am-timer-wrap">
                    <div className="am-meta-lbl">TIEMPO RESTANTE</div>
                    <MissionTimer
                      startedAt={mission.startedAt}
                      durationMs={mission.durationMs}
                      onReady={() => markReady(mIdx)}
                    />
                  </div>

                  {/* Badges de evidencia configurados al crear */}
                  {(mission.photoEvidenceEnabled || mission.locationEvidenceEnabled) && (
                    <div className="am-evidence-badges">
                      {mission.photoEvidenceEnabled && (
                        <span className="am-evidence-badge photo">📸 Foto</span>
                      )}
                      {mission.locationEvidenceEnabled && (
                        <span className="am-evidence-badge gps">📍 GPS</span>
                      )}
                    </div>
                  )}

                  {/* Botones de acción — siempre visibles */}
                  <div className="am-actions-row">
                    {/* COMPLETAR: verde brillante si timer llegó a 0, gris si es antes de tiempo */}
                    <button
                      className={`btn-complete-mission${ready ? "" : " btn-complete-early"}`}
                      onClick={() => setConfirmDone({ mission, mIdx })}
                      title={ready ? "¡Timer completado!" : "Completar antes de que termine el tiempo"}
                    >
                      {ready ? "✅ COMPLETAR" : "✔ COMPLETAR AHORA"}
                    </button>

                    <button
                      className="btn-outline-sm"
                      onClick={() => handleAbandon(mIdx)}
                    >
                      ABANDONAR
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          // ── SLOT DESBLOQUEADO Y VACÍO ──────────────
          return (
            <div key={slotIdx}>
              <button className="empty-slot" onClick={() => { setTargetSlot(slotIdx); setShowBuilder(true); }}>
                <div className="empty-slot-icon">➕</div>
                <div className="empty-slot-text">CREAR MISIÓN — ESPACIO {slotIdx + 1}</div>
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Reglas ───────────────────────────────── */}
      <div className="shop-section" style={{ paddingTop: 0 }}>
        <div className="rules-card">
          <div className="rules-title">▸ REGLAS DE MISIONES CUSTOM</div>
          {[
            "Máximo 4 estadísticas por misión",
            "+3 stats activa cooldown de 24h",
            `Precios de espacios: 🪙${SLOT_PRICES[0]} / 🪙${SLOT_PRICES[1]} / 🪙${SLOT_PRICES[2]}`,
            "Costo de creación: 1 stat=50🪙  2=120🪙  3=220🪙  4=350🪙",
            "XP = Base × stats × multiplicador de duración",
            "El botón COMPLETAR aparece cuando el tiempo llega a 0",
          ].map((r, i) => (
            <div key={i} className="rules-item"><span className="rules-arrow">▸</span> {r}</div>
          ))}
        </div>
      </div>

      {/* ── Modales ──────────────────────────────── */}
      {showBuilder && (
        <MissionBuilder coins={coins} onClose={() => { setShowBuilder(false); setTargetSlot(null); }} onCreate={handleCreate} />
      )}

      {confirmBuy && (
        <ConfirmModal
          icon="🔓"
          title={`DESBLOQUEAR ESPACIO ${confirmBuy.slotIdx + 1}`}
          desc={`¿Gastar 🪙${confirmBuy.price} para desbloquear este espacio de misión custom?\nSaldo actual: 🪙${coins}`}
          confirmLabel={`🪙 COMPRAR (${confirmBuy.price})`}
          onConfirm={handleBuySlot}
          onClose={() => setConfirmBuy(null)}
        />
      )}

      {/* Si la misión tiene foto o GPS → usar CompleteModal completo con evidencia.
          Si no → ConfirmModal simple de confirmación. */}
      {confirmDone && (confirmDone.mission.photoEvidenceEnabled || confirmDone.mission.locationEvidenceEnabled) ? (
        <CompleteModal
          mission={{
            ...confirmDone.mission,
            name:  confirmDone.mission.name,
            xp:    confirmDone.mission.xp,
            coins: confirmDone.mission.cost,
            photoEvidenceEnabled:    confirmDone.mission.photoEvidenceEnabled,
            locationEvidenceEnabled: confirmDone.mission.locationEvidenceEnabled,
            photoBonusApplied:    false,
            locationBonusApplied: false,
          }}
          onClose={() => setConfirmDone(null)}
          onDone={(finalXp, questId, gpsCoords) =>
            handleComplete(
              { ...confirmDone.mission, xp: finalXp },
              confirmDone.mIdx,
              { finalXp, questId, gpsCoords }
            )
          }
        />
      ) : confirmDone ? (
        <ConfirmModal
          icon="✅"
          title="COMPLETAR MISIÓN"
          desc={`¿Reclamar las recompensas de "${confirmDone.mission.name}"?\n+${confirmDone.mission.xp} XP · 🪙${confirmDone.mission.cost}`}
          confirmLabel="✅ RECLAMAR"
          onConfirm={() =>
            handleComplete(confirmDone.mission, confirmDone.mIdx, {
              finalXp: confirmDone.mission.xp,
              questId: confirmDone.mission.backendQuestId || null,
            })
          }
          onClose={() => setConfirmDone(null)}
        />
      ) : null}
    </>
  );
}
