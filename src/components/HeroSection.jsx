/**
 * HeroSection.jsx — Sección hero del dashboard
 * ─────────────────────────────────────────────────────
 * Muestra el saludo personalizado con los datos reales del usuario.
 * Ya no tiene datos hardcodeados — todo viene por props desde HomeScreen.
 *
 * Props:
 *   user {
 *     name   (string) — nombre del héroe (actualizable desde ProfileSection)
 *     title  (string) — título equipado ("SIN TÍTULO" en cuenta nueva)
 *     level  (number) — nivel actual (1 en cuenta nueva)
 *     xp     (number) — XP acumulada en el nivel actual
 *     xpMax  (number) — XP necesaria para el siguiente nivel
 *   }
 *
 * Calcula dinámicamente:
 *   • Saludo por hora del día (mañana / tarde / noche)
 *   • % de la barra de XP
 *   • XP restante para subir de nivel
 */
export default function HeroSection({ user }) {
  const { name, title, level, xp, xpMax } = user;

  // Saludo dinámico según la hora local
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "¡BUENOS DÍAS," :
    hour < 20 ? "¡BUENAS TARDES," :
               "¡BUENAS NOCHES,";

  const xpPct      = xpMax > 0 ? Math.min((xp / xpMax) * 100, 100) : 0;
  const xpRestante = Math.max(xpMax - xp, 0);

  return (
    <div className="hero">
      <div className="hero-top">
        <div className="hero-info">
          <div className="hero-greeting">{greeting}</div>
          <div className="hero-name">{name.toUpperCase()}</div>
          <div className="hero-title-badge">{title}</div>
        </div>
        <div className="hero-level-badge">
          <span className="level-label">NIVEL</span>
          <span className="level-num">{level}</span>
        </div>
      </div>

      <div className="xp-section">
        <div className="xp-meta">
          <span className="xp-label">▸ BARRA DE EXPERIENCIA</span>
          <span className="xp-value">
            {xp.toLocaleString()} / {xpMax.toLocaleString()} XP
          </span>
        </div>
        <div className="xp-track">
          <div className="xp-fill" style={{ width: `${xpPct}%` }} />
        </div>
        <div className="xp-next">
          {xpRestante > 0
            ? `${xpRestante.toLocaleString()} XP para nivel ${level + 1}`
            : "¡Listo para subir de nivel!"}
        </div>
      </div>
    </div>
  );
}
