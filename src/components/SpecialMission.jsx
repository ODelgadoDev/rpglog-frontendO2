/**
 * SpecialMission.jsx — Misión especial destacada
 */
import { PARTICLES } from "../data/constants";

export default function SpecialMission({ mission, onComplete }) {
  // Guard: si no hay misión o stats es null/undefined, no renderizar
  if (!mission) return null;
  const stats = Array.isArray(mission.stats) ? mission.stats : [];

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
            {stats.length > 0 && (
              <div className="special-stats-row">
                {stats.map((s, i) => (
                  <div key={i} className="special-stat-tag" style={{ "--sc": s.color }}>
                    {s.icon} {s.label}
                  </div>
                ))}
              </div>
            )}
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
          {!mission.locked && (
            <button
              className="special-btn"
              onClick={(e) => {
                e.stopPropagation();
                onComplete(mission);
              }}
            >
              ⚡ ACEPTAR
            </button>
          )}
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
