/**
 * AboutSection.jsx — ¿Qué es RPG LOG?
 * ─────────────────────────────────────────────────────
 * Página informativa accesible desde el menú de ajustes.
 * Explica la filosofía, cómo funcionan las stats, las misiones
 * y los minijuegos. Sin props — es contenido estático.
 */
export default function AboutSection() {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>

      {/* Hero */}
      <div className="about-hero">
        <div className="about-hero-icon">🗡️</div>
        <div className="about-hero-title">RPG LOG</div>
        <div className="about-hero-sub">Tu vida como aventura. Tu progreso como poder.</div>
      </div>

      {/* ¿Qué es? */}
      <div className="settings-block">
        <div className="settings-block-header">
          <span className="settings-block-icon">❓</span>
          <span className="settings-block-title">¿QUÉ ES RPG LOG?</span>
        </div>
        <div className="settings-block-body about-body">
          <p>RPG LOG es una aplicación de productividad gamificada que convierte tus hábitos del mundo real en progreso dentro de un juego de rol.</p>
          <p>Cada misión que completas, cada hábito que repites y cada minijuego que dominas hace crecer a tu personaje. No se trata de puntos vacíos — cada stat representa una capacidad real que estás desarrollando.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="settings-block">
        <div className="settings-block-header">
          <span className="settings-block-icon">📊</span>
          <span className="settings-block-title">LAS 6 ESTADÍSTICAS</span>
        </div>
        <div className="settings-block-body" style={{ gap:0, padding:".55rem 1.1rem" }}>
          {[
            { icon:"🟥", stat:"FUERZA",       desc:"Ejercicio físico, disciplina corporal y actividad deportiva." },
            { icon:"🟦", stat:"RESISTENCIA",   desc:"Constancia, hábitos de salud y actividades de larga duración." },
            { icon:"🟩", stat:"AGILIDAD",      desc:"Velocidad de reacción, coordinación y movimiento." },
            { icon:"🟪", stat:"INTELIGENCIA",  desc:"Lectura, aprendizaje, estudio y resolución de problemas." },
            { icon:"🟨", stat:"CREATIVIDAD",   desc:"Arte, escritura, diseño y pensamiento innovador." },
            { icon:"🟧", stat:"COMUNICACIÓN",  desc:"Habilidades sociales, conversación y expresión." },
          ].map(s => (
            <div key={s.stat} className="about-stat-row">
              <span className="about-stat-icon">{s.icon}</span>
              <div>
                <div className="about-stat-name">{s.stat}</div>
                <div className="about-stat-desc">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Misiones */}
      <div className="settings-block">
        <div className="settings-block-header">
          <span className="settings-block-icon">⚔️</span>
          <span className="settings-block-title">SISTEMA DE MISIONES</span>
        </div>
        <div className="settings-block-body about-body">
          {[
            { icon:"🌅", tipo:"MISIONES DIARIAS",      desc:"Se regeneran cada día. Son la base del progreso constante. Cubre las 6 stats con actividades cotidianas." },
            { icon:"📅", tipo:"MISIONES SEMANALES",    desc:"Se completan acumulando avances durante la semana. Requieren consistencia para lograrlas." },
            { icon:"⚡", tipo:"MISIÓN ESPECIAL",        desc:"Una misión de alto XP que requiere esfuerzo doble. Se desbloquea al alcanzar nivel 5." },
            { icon:"🛒", tipo:"MISIONES PERSONALIZADAS",desc:"Las diseñas tú desde la Tienda. Defines el nombre, las stats, la duración y el costo en monedas. Son tuyas." },
          ].map(m => (
            <div key={m.tipo} className="about-mission-row">
              <span className="about-mission-icon">{m.icon}</span>
              <div>
                <div className="about-mission-tipo">{m.tipo}</div>
                <div className="about-stat-desc">{m.desc}</div>
              </div>
            </div>
          ))}
          <div className="about-note">
            💡 Algunas misiones admiten evidencia de foto o GPS para obtener XP y monedas bonus.
          </div>
        </div>
      </div>

      {/* Minijuegos */}
      <div className="settings-block">
        <div className="settings-block-header">
          <span className="settings-block-icon">🎮</span>
          <span className="settings-block-title">MINIJUEGOS</span>
        </div>
        <div className="settings-block-body about-body">
          <p>Los minijuegos son una forma de ganar XP y monedas extra entrenando una stat específica. No reemplazan las misiones — son un complemento.</p>
          {[
            { icon:"🎯", name:"REFLEX BURST",   stat:"Agilidad",     desc:"Toca los círculos antes de que desaparezcan." },
            { icon:"📝", name:"WORD CHAOS",      stat:"Inteligencia", desc:"Descifra palabras mezcladas contra el reloj." },
            { icon:"🔲", name:"SIMON GLITCH",    stat:"Inteligencia", desc:"Memoriza y repite secuencias de colores." },
            { icon:"🧱", name:"PIXEL BLOCKS",    stat:"Intel + Agi",  desc:"Clásico Tetris con velocidad progresiva." },
            { icon:"🎵", name:"RHYTHM STRIKE",   stat:"Agilidad",     desc:"Golpea las notas al ritmo exacto." },
          ].map(g => (
            <div key={g.name} className="about-game-row">
              <span className="about-mission-icon">{g.icon}</span>
              <div>
                <div className="about-mission-tipo">{g.name} <span style={{color:"var(--text-dim)",fontFamily:"var(--vt)",fontSize:"1rem",fontWeight:"normal"}}>— {g.stat}</span></div>
                <div className="about-stat-desc">{g.desc}</div>
              </div>
            </div>
          ))}
          <div className="about-note">
            ⏳ Próximamente: límite de partidas por día para mantener el balance del sistema.
          </div>
        </div>
      </div>

      {/* Economía */}
      <div className="settings-block">
        <div className="settings-block-header">
          <span className="settings-block-icon">🪙</span>
          <span className="settings-block-title">ECONOMÍA INTERNA</span>
        </div>
        <div className="settings-block-body about-body">
          <p>Las <strong>monedas</strong> se obtienen completando misiones y minijuegos. Se usan para comprar slots de misiones personalizadas y desbloquear títulos en la Tienda.</p>
          <p>Los <strong>títulos</strong> son más que cosméticos — al equiparlos otorgan bonificaciones de XP y monedas en misiones específicas. Solo puedes equipar uno a la vez.</p>
          <div className="about-note">🔒 Las monedas no tienen valor real y no son canjeables fuera de la app.</div>
        </div>
      </div>

      {/* Versión */}
      <div style={{ textAlign:"center", fontFamily:"var(--pixel)", fontSize:".34rem", color:"var(--text-dim)", paddingBottom:"1rem" }}>
        RPG LOG · v1.0 · UTCH 2026
      </div>
    </div>
  );
}
