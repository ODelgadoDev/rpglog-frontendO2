/**
 * MissionBuilder.jsx — Constructor de misiones personalizadas
 * ─────────────────────────────────────────────────────
 * Modal que permite al usuario diseñar su propia misión custom.
 *
 * Campos del formulario:
 *   • Nombre de la misión (texto libre)
 *   • Stats asociadas (1 a 4 de las 6 disponibles)
 *   • Duración: 1H / 3H / 6H / 12H / 1D / 3D / 1W
 *
 * Cálculo de costo (datos en data/shop.js):
 *   XP base = BASE_XP × num_stats × duration_multiplier
 *   Costo🪙 = STAT_COSTS[num_stats] (escalonado: 50 / 120 / 220 / 350)
 *
 * Reglas adicionales:
 *   • 3+ stats → cooldown de 24h antes de poder crear otra
 *   • Sin fondos suficientes → botón CREAR deshabilitado con aviso
 *
 * Props:
 *   coins    — monedas actuales del usuario (para validar fondos)
 *   onClose  — cierra el modal sin crear
 *   onCreate — recibe el objeto de misión creado y las monedas gastadas
 *
 * Estilos: ShopScreen.css (.builder-modal, .stat-picker, .duration-grid, .cost-preview)
 */
import { useState } from "react";
import { SHOP_STATS, DURATIONS, STAT_COSTS, BASE_XP } from "../../data/shop";

export default function MissionBuilder({ coins, onClose, onCreate }) {
  const [name, setName]         = useState("");
  const [desc, setDesc]         = useState("");
  const [selStats, setSelStats] = useState([]);
  const [durIdx, setDurIdx]     = useState(0);
  const [wantPhoto,    setWantPhoto]    = useState(false);
  const [wantLocation, setWantLocation] = useState(false);

  const dur          = DURATIONS[durIdx];
  const cost         = STAT_COSTS[selStats.length] || 0;
  const xp           = selStats.length > 0 ? Math.round(BASE_XP * selStats.length * dur.mult) : 0;
  const hasCooldown  = selStats.length > 2;
  const canAfford    = coins >= cost;
  const canCreate    = name.trim() && selStats.length > 0 && canAfford;

  const toggleStat = (id) => {
    setSelStats(p =>
      p.includes(id)
        ? p.filter(s => s !== id)
        : p.length < 4 ? [...p, id] : p
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="builder-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-corner-bl" />
        <div className="modal-corner-br" />

        <div className="modal-header">
          <div className="modal-header-title">⚙️ CREAR MISIÓN CUSTOM</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">

          {/* Name */}
          <div className="field">
            <label className="field-label">▸ NOMBRE DE LA MISIÓN</label>
            <input
              className="field-input"
              placeholder="ej: Mi rutina épica"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={40}
            />
          </div>

          {/* Description */}
          <div className="field">
            <label className="field-label">▸ DESCRIPCIÓN</label>
            <textarea
              className="field-textarea"
              placeholder="Describe en qué consiste la misión..."
              value={desc}
              onChange={e => setDesc(e.target.value)}
              maxLength={160}
            />
          </div>

          {/* Stat picker */}
          <div className="field">
            <label className="field-label">▸ ESTADÍSTICAS ({selStats.length}/4)</label>
            <div className="stat-picker">
              {SHOP_STATS.map(s => (
                <button
                  key={s.id}
                  className={`stat-pick-btn${selStats.includes(s.id) ? " selected" : ""}`}
                  style={{ "--sc": s.color }}
                  onClick={() => toggleStat(s.id)}
                  disabled={!selStats.includes(s.id) && selStats.length >= 4}
                >
                  <span className="stat-pick-icon">{s.icon}</span>
                  {s.name}
                </button>
              ))}
            </div>
            {selStats.length > 2 && (
              <div style={{ fontFamily: "var(--pixel)", fontSize: ".32rem", color: "var(--orange)", marginTop: ".4rem" }}>
                ⚠ +3 stats → cooldown 24h al completar
              </div>
            )}
          </div>

          {/* Duration */}
          <div className="field">
            <label className="field-label">▸ DURACIÓN</label>
            <div className="duration-grid">
              {DURATIONS.map((d, i) => (
                <button
                  key={i}
                  className={`dur-btn${durIdx === i ? " selected" : ""}`}
                  onClick={() => setDurIdx(i)}
                >
                  <div>{d.label}</div>
                  <div
                    className="dur-btn-mult"
                    style={{ color: durIdx === i ? "var(--gold)" : "var(--text-dim)" }}
                  >
                    ×{d.mult}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Evidencia opcional */}
          <div className="field">
            <label className="field-label">▸ EVIDENCIA AL COMPLETAR</label>
            <div className="evidence-checks">
              <label className="evidence-check-row">
                <input
                  type="checkbox"
                  className="evidence-checkbox"
                  checked={wantPhoto}
                  onChange={e => setWantPhoto(e.target.checked)}
                />
                <span className="evidence-check-icon">📸</span>
                <div className="evidence-check-info">
                  <div className="evidence-check-title">FOTO DE EVIDENCIA</div>
                  <div className="evidence-check-desc">El usuario podrá tomar una foto como prueba al terminar</div>
                </div>
              </label>

              <label className="evidence-check-row">
                <input
                  type="checkbox"
                  className="evidence-checkbox"
                  checked={wantLocation}
                  onChange={e => setWantLocation(e.target.checked)}
                />
                <span className="evidence-check-icon">📍</span>
                <div className="evidence-check-info">
                  <div className="evidence-check-title">UBICACIÓN GPS</div>
                  <div className="evidence-check-desc">El usuario podrá compartir su posición al terminar</div>
                </div>
              </label>
            </div>
          </div>

          {/* Cost preview */}
          <div className="cost-preview">
            <div className="cost-row">
              <span className="cost-lbl">ESTADÍSTICAS</span>
              <span className="cost-val">{selStats.length} seleccionadas</span>
            </div>
            <div className="cost-row">
              <span className="cost-lbl">DURACIÓN</span>
              <span className="cost-val">{dur.label} (×{dur.mult} XP)</span>
            </div>
            <div className="cost-row">
              <span className="cost-lbl">XP ESTIMADA</span>
              <span className="cost-val xp">{xp > 0 ? `+${xp} XP` : "—"}</span>
            </div>
            {(wantPhoto || wantLocation) && (
              <div className="cost-row">
                <span className="cost-lbl">EVIDENCIA</span>
                <span className="cost-val" style={{ color: "#52c97a" }}>
                  {[wantPhoto && "📸 Foto", wantLocation && "📍 GPS"].filter(Boolean).join(" · ")}
                </span>
              </div>
            )}
            {hasCooldown && (
              <div className="cost-row">
                <span className="cost-lbl">COOLDOWN</span>
                <span className="cost-warning">24 HORAS</span>
              </div>
            )}
            <div className="cost-row">
              <span className="cost-lbl">COSTO TOTAL</span>
              <span className="cost-val gold" style={{ color: canAfford ? "var(--gold)" : "var(--red)" }}>
                🪙 {cost}
                {!canAfford && <span className="cost-no-funds">SIN FONDOS</span>}
              </span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>CANCELAR</button>
          <button
            className="btn-create"
            disabled={!canCreate}
            onClick={() => onCreate({
              name, desc, stats: selStats, dur, cost, xp,
              photoEvidenceEnabled:    wantPhoto,
              locationEvidenceEnabled: wantLocation,
            })}
          >
            ▶ CREAR ({cost === 0 ? "gratis" : `🪙${cost}`})
          </button>
        </div>
      </div>
    </div>
  );
}

