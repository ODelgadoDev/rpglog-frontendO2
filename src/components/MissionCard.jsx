/**
 * MissionCard.jsx — Tarjeta individual de misión
 * ─────────────────────────────────────────────────────
 * Toda la información y controles están DENTRO del mismo contenedor.
 *
 * ── ESTRUCTURA VISUAL ────────────────────────────────────────────
 *   mission-top  → stat tag + nombre + descripción + recompensas (XP, monedas, GPS bonus)
 *   mission-bottom → barra de progreso (solo semanales) + fila de acciones
 *
 * ── BOTÓN ABANDONAR ──────────────────────────────────────────────
 *   Solo aparece en misiones diarias no completadas cuando se pasa
 *   la prop onAbandon. Está al lado del botón "COMPLETAR" en la misma fila.
 *   Al presionarlo muestra un menú desplegable con:
 *     • 🗑 Eliminar — oculta la misión hasta mañana (ignoredIds en MissionsScreen)
 *     • 🔄 Cambiar  — reemplaza por otra misión del pool no usada hoy
 *   El menú usa fuentes y padding grandes para ser cómodo en móvil (min-height: 60px).
 *
 * ── EVIDENCIAS ───────────────────────────────────────────────────
 *   Si la misión tiene locationEvidenceEnabled y el bonus no se ha aplicado,
 *   se muestra un badge "📍 +X XP" en la sección de recompensas.
 *   El CompleteModal (abierto al presionar COMPLETAR) gestiona la captura
 *   de foto y/o GPS para aplicar los bonos correspondientes.
 *
 * Props:
 *   mission    — objeto de misión con todos sus campos
 *   type       — "daily" | "weekly"
 *   onComplete — callback(mission) al presionar COMPLETAR
 *   onAbandon  — callback(mission, "delete"|"swap") — opcional, solo diarias
 */
import { useState } from "react";

export default function MissionCard({ mission, type = "daily", onComplete, onAbandon }) {
  const [showAbandOpts, setShowAbandOpts] = useState(false);

  const pct         = Math.min((mission.progress / mission.total) * 100, 100);
  const isWeekly    = type === "weekly";
  const canComplete = isWeekly
    ? (mission.progress >= mission.total && !mission.done)
    : !mission.done;
  const showAbandon = onAbandon && !isWeekly && !mission.done;

  const handleAbandon = (action) => {
    setShowAbandOpts(false);
    onAbandon(mission, action);
  };

  return (
    <div
      className={`mission-card${mission.done ? " done" : ""}`}
      style={{ "--stat-color": mission.color }}
      onClick={() => showAbandOpts && setShowAbandOpts(false)}
    >
      {/* ── Info: stat + nombre + descripción + recompensas ── */}
      <div className="mission-top">
        <div className="mission-left">
          <div className="mission-stat-tag">
            {mission.icon} {mission.stat}
          </div>
          <div className="mission-name-text">{mission.name}</div>
          <div className="mission-desc">{mission.desc}</div>
        </div>

        <div className="mission-rewards">
          <div className="reward-xp">+{mission.xp} XP</div>
          <div className="reward-coins">🪙 {mission.coins}</div>
          {/* Badge GPS bonus — visible si la misión lo admite y aún no se aplicó */}
          {mission.locationEvidenceEnabled && !mission.locationBonusApplied && (
            <div className="reward-gps" title="Bonus GPS disponible">
              📍 +{mission.locationBonusXp || 0} XP
            </div>
          )}
        </div>
      </div>

      {/* ── Controles: barra progreso + acciones ── */}
      {!mission.done && (
        <div className="mission-bottom">

          {/* Barra de progreso solo en semanales */}
          {isWeekly && (
            <div className="mission-progress-wrap">
              <div className="mission-progress-label">
                {mission.progress}/{mission.total} {mission.unit}
              </div>
              <div className="mission-progress-track">
                <div className="mission-progress-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )}

          {/* Fila de acciones: COMPLETAR + ABANDONAR lado a lado */}
          <div className="mission-actions">
            {canComplete && (
              <button
                className="mission-btn"
                onClick={e => { e.stopPropagation(); onComplete(mission); }}
              >
                ▶ COMPLETAR
              </button>
            )}

            {isWeekly && !canComplete && (
              <div className="mission-in-progress">
                EN PROGRESO — {mission.total - mission.progress} {mission.unit} restantes
              </div>
            )}

            {/* Botón ABANDONAR con menú desplegable grande y accesible */}
            {showAbandon && (
              <div className="mission-abandon-inline" onClick={e => e.stopPropagation()}>
                <button
                  className="mission-btn-abandon"
                  onClick={() => setShowAbandOpts(v => !v)}
                >
                  ABANDONAR
                </button>
                {showAbandOpts && (
                  <div className="mission-abandon-opts">
                    <button className="abandon-opt-inline" onClick={() => handleAbandon("delete")}>
                      🗑 Eliminar misión
                    </button>
                    <button className="abandon-opt-inline" onClick={() => handleAbandon("swap")}>
                      🔄 Cambiar por otra
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
