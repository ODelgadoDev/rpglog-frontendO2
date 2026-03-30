/**
 * ProgressSection.jsx — Sección de progreso del dashboard
 * ─────────────────────────────────────────────────────
 * Muestra únicamente las misiones completadas hoy.
 * Los datos son reactivos: vienen del estado real de MissionsScreen
 * a través de HomeScreen, por lo que se actualizan al instante
 * cuando el usuario completa una misión.
 *
 * Props:
 *   completedToday (array) — misiones completadas en la sesión actual
 *     Cada elemento: { id, name, stat, icon, color, xp, coins }
 *
 * Si no hay misiones completadas muestra un estado vacío con mensaje motivador.
 *
 * Estilos: HomeScreen.css (.progress-grid, .prog-card, .mission-row)
 */
export default function ProgressSection({ completedToday = [] }) {
  return (
    <div>
      <div className="section-header">
        <span className="section-title">▸ PROGRESO DE HOY</span>
        <div className="section-line" />
        {completedToday.length > 0 && (
          <span className="section-count">{completedToday.length} completadas</span>
        )}
      </div>

      <div className="progress-grid">
        <div className="prog-card prog-card-full">
          <div className="prog-title" style={{ "--accent": "#52c97a" }}>
            <div className="prog-title-dot" />
            MISIONES COMPLETADAS HOY
          </div>

          {completedToday.length === 0 ? (
            /* Estado vacío — motivador */
            <div className="missions-empty">
              <div className="missions-empty-icon">⚔️</div>
              <div className="missions-empty-text">¡NINGUNA AÚN!</div>
              <div className="missions-empty-sub">Completa una misión para verla aquí</div>
            </div>
          ) : (
            <div className="missions-today">
              {completedToday.map((m) => (
                <div key={m.id} className="mission-row">
                  {/* Checkmark verde */}
                  <div className="mission-check done" />
                  <div className="mission-info">
                    <div className="mission-name done">{m.name}</div>
                    <div className="mission-stat" style={{ color: m.color }}>
                      {m.icon} {m.stat}
                    </div>
                  </div>
                  <div className="mission-xp-earned">
                    <span className="mission-xp">+{m.earnedXp} XP</span>
                    <span className="mission-coins-earned">🪙 +{m.coins}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
