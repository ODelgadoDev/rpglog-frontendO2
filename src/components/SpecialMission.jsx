/**
 * SpecialMission.jsx — Misión especial destacada
 * ─────────────────────────────────────────────────────
 * Componente visual diferenciado para la misión especial del día.
 * Se distingue del MissionCard normal por:
 *   • Borde con gradiente dorado animado (shimmer)
 *   • Partículas flotantes decorativas (⚡✨🌟)
 *   • Badge 2×XP pulsante
 *   • Ícono en panel cuadrado con efecto float
 *   • Capa de bloqueo si la misión ya está completada
 *
 * Props:
 *   mission   — objeto de misión especial (igual estructura que MissionCard)
 *   onComplete — callback al presionar completar
 *
 * Datos: PARTICLES (array de emojis decorativos) desde data/constants.js
 * Estilos: MissionsScreen.css (.special-wrapper, .special-card, etc.)
 */
import { PARTICLES } from "../data/constants";

export default function SpecialMission({ mission, onComplete }) {
  return (
    <div className="special-wrapper">
      <div className="special-glow" />
      <div
        className="special-card"
        onClick={!mission.locked ? () => onComplete(mission) : undefined}
      >
        {/* particles */}
        <div className="special-particles">
          {PARTICLES.map((p) => (
            <span
              key={p.id}
              className="s-particle"
              style={{
                left: `${p.x}%`,
                bottom: "10%",
                "--ps": p.ps,
                "--pd": p.pd,
                "--pdelay": p.pdelay,
              }}
            >
              {p.icon}
            </span>
          ))}
        </div>

        <div className="special-header">
          <div className="special-badge">★ ESPECIAL</div>
          <div className="special-badge-2x">2× XP</div>
          <div className="special-daily-tag">1 por día</div>
        </div>

        <div className="special-body">
          <div className="special-icon-wrap">{mission.icon}</div>
          <div className="special-info">
            <div className="special-stats-row">
              {mission.stats.map((s, i) => (
                <div key={i} className="special-stat-tag" style={{ "--sc": s.color }}>
                  {s.icon} {s.label}
                </div>
              ))}
            </div>
            <div className="special-name">{mission.name}</div>
            <div className="special-desc">{mission.desc}</div>
          </div>
        </div>

        <div className="special-bottom">
          <div className="special-rewards">
            <div className="special-reward-item">
              <div className="special-reward-label">EXPERIENCIA</div>
              <div className="special-reward-val">+{mission.xp} XP</div>
            </div>
            <div className="special-reward-item">
              <div className="special-reward-label">MONEDAS</div>
              <div className="special-reward-val coins">🪙 {mission.coins}</div>
            </div>
          </div>
          <button
            className="special-btn"
            onClick={(e) => {
              e.stopPropagation();
              onComplete(mission);
            }}
          >
            ⚡ ACEPTAR
          </button>
        </div>

        {mission.locked && (
          <div className="special-locked">
            <div className="locked-icon">🔒</div>
            <div className="locked-text">
              {mission.lockedReason === "done"
                ? "YA COMPLETADA\nHOY"
                : "SE DESBLOQUEA\nEN NIVEL 5"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
