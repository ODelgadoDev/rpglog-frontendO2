/**
 * Stars.jsx — Fondo de estrellas animadas
 * ─────────────────────────────────────────────────────
 * Genera 60 estrellas en posiciones y tamaños aleatorios,
 * cada una con animación de parpadeo (twinkle) de duración variable.
 * También genera 8 emojis de píxeles decorativos flotantes.
 *
 * Usado exclusivamente en AuthScreen como decoración de fondo.
 * Es un componente puramente visual, sin estado ni props.
 *
 * Estilos: AuthScreen.css (.stars, .star, .pixel-deco)
 */
export default function Stars() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() < 0.3 ? 2 : 1,
    d: `${2 + Math.random() * 4}s`,
    delay: `${Math.random() * 4}s`,
  }));

  const decos = ["⚔️", "🛡️", "✨", "💎", "⭐", "🗡️", "🏆"].map((icon, i) => ({
    id: i,
    icon,
    x: 5 + Math.random() * 90,
    fd: `${10 + Math.random() * 8}s`,
    fdelay: `${Math.random() * 6}s`,
    size: 14 + Math.random() * 10,
  }));

  return (
    <>
      <div className="stars">
        {stars.map((s) => (
          <div
            key={s.id}
            className="star"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              "--d": s.d,
              "--delay": s.delay,
            }}
          />
        ))}
      </div>
      {decos.map((d) => (
        <div
          key={d.id}
          className="pixel-deco"
          style={{
            left: `${d.x}%`,
            bottom: 0,
            fontSize: d.size,
            "--fd": d.fd,
            "--fdelay": d.fdelay,
          }}
        >
          {d.icon}
        </div>
      ))}
    </>
  );
}
