/**
 * StatCards.jsx — Grid de tarjetas de estadísticas
 * ─────────────────────────────────────────────────────
 * Renderiza las 6 stats del personaje con sus niveles y XP reales.
 * Los datos ya no son estáticos — vienen por props desde HomeScreen.
 *
 * Props:
 *   stats (array) — array de objetos de stat:
 *     { id, name, icon, color, lv, xp, max }
 *     • Para cuenta nueva: todas en lv 1, xp 0, max 200
 *     • Para login demo:   datos de progreso de ejemplo
 *
 * La barra de cada stat se colorea con la variable CSS --stat-color
 * que se inyecta en el style del contenedor.
 */
export default function StatCards({ stats }) {
  return (
    <div>
      <div className="section-header">
        <span className="section-title">▸ ESTADÍSTICAS</span>
        <div className="section-line" />
      </div>

      <div className="stats-grid">
        {stats.map((s) => {
          const pct = s.max > 0 ? Math.min((s.xp / s.max) * 100, 100) : 0;

          return (
            <div
              key={s.id}
              className="stat-card"
              style={{ "--stat-color": s.color }}
            >
              <div className="stat-card-top">
                <span className="stat-icon">{s.icon}</span>
                <span className="stat-lv">LV {s.lv}</span>
              </div>
              <div className="stat-name">{s.name}</div>
              <div className="stat-xp-val">
                {s.xp > 0 ? `${s.xp} XP` : "0 XP"}
              </div>
              <div className="stat-bar-track">
                <div
                  className="stat-bar-fill"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
