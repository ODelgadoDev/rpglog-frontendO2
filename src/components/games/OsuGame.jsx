/**
 * OsuGame.jsx — Minijuego: REFLEX BURST (estilo osu!)
 * ─────────────────────────────────────────────────────
 * Círculos de colores aparecen en posiciones aleatorias del canvas.
 * El jugador debe hacer clic sobre ellos antes de que desaparezcan.
 *
 * Mecánica:
 *   • Cada círculo tiene un lifetime aleatorio (1000–1800ms)
 *   • Si el jugador lo golpea → +10 puntos + efecto visual dorado
 *   • Si el círculo expira sin ser golpeado → cuenta como MISS
 *   • Partida de 30 segundos
 *
 * Constantes ajustables (arriba del componente):
 *   DURATION_OSU — duración total de la partida en segundos
 *
 * Estados:
 *   circles   — lista de círculos activos en pantalla
 *   feedbacks — mensajes flotantes (+10 / MISS) temporales
 *   score     — puntuación acumulada
 *   misses    — contador de fallos
 *   timer     — segundos restantes
 *   running   — si la partida está en curso
 *   started   — si ya se presionó INICIAR
 *
 * Estilos: MiniGamesScreen.css (.osu-wrapper, .osu-canvas, .osu-circle)
 */
import { useState, useEffect, useRef, useCallback } from "react";

const DURATION_OSU = 30;

export default function OsuGame({ onEnd }) {
  const [circles, setCircles]     = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [score, setScore]         = useState(0);
  const [misses, setMisses]       = useState(0);
  const [timer, setTimer]         = useState(DURATION_OSU);
  const [running, setRunning]     = useState(false);
  const [started, setStarted]     = useState(false);
  const nextId   = useRef(0);
  const spawnRef = useRef(null);

  const spawnCircle = useCallback(() => {
    const id       = nextId.current++;
    const x        = 8 + Math.random() * 84;
    const y        = 8 + Math.random() * 84;
    const colors   = ["#e05252","#5b8dd9","#52c97a","#a855f7","#f5853a","#f5c842"];
    const color    = colors[Math.floor(Math.random() * colors.length)];
    const lifetime = 1000 + Math.random() * 800;
    setCircles(p => [...p, { id, x, y, color, lifetime }]);
    setTimeout(() => {
      setCircles(p => {
        const still = p.find(c => c.id === id);
        if (still) {
          setMisses(m => m + 1);
          setFeedbacks(f => [...f, { id: Date.now(), x, y: y - 5, text: "MISS", color: "#e05252" }]);
        }
        return p.filter(c => c.id !== id);
      });
    }, lifetime);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const start = () => {
    setStarted(true); setRunning(true);
    setScore(0); setMisses(0); setTimer(DURATION_OSU); setCircles([]); setFeedbacks([]);
  };

  useEffect(() => {
    if (!running) return;
    spawnRef.current = setInterval(spawnCircle, 700);
    return () => clearInterval(spawnRef.current);
  }, [running, spawnCircle]);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setTimer(p => {
        if (p <= 1) { clearInterval(t); setRunning(false); clearInterval(spawnRef.current); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running]);

  useEffect(() => { if (started && !running && timer === 0) onEnd(score); }, [running]); // eslint-disable-line react-hooks/exhaustive-deps

  const hit = (id, x, y) => {
    setCircles(p => p.filter(c => c.id !== id));
    setScore(p => p + 10);
    setFeedbacks(f => [...f, { id: Date.now(), x, y: y - 5, text: "+10", color: "#f5c842" }]);
  };

  if (!started) {
    return (
      <div className="game-start-screen">
        <div className="game-start-hint">Toca los círculos antes de que desaparezcan. ¡Velocidad y reflejos al máximo!</div>
        <div className="game-instructions">
          <div className="game-instr-title">📋 CÓMO JUGAR</div>
          <div className="game-instr-row"><span className="game-instr-icon">⭕</span>Círculos aparecen en posiciones aleatorias de la pantalla.</div>
          <div className="game-instr-row"><span className="game-instr-icon">👆</span>Toca o haz clic en cada círculo antes de que su borde desaparezca.</div>
          <div className="game-instr-row"><span className="game-instr-icon">⏱</span>La partida dura {DURATION_OSU} segundos. Cada círculo da +10 puntos.</div>
          <div className="game-instr-row"><span className="game-instr-icon">🔥</span>Los círculos aparecen cada vez más rápido conforme avanza el tiempo.</div>
          <div className="game-instr-title" style={{marginTop:".3rem"}}>⌨ CONTROLES</div>
          <div className="game-instr-row"><span className="game-instr-icon">👆</span>Toca o haz clic sobre el círculo para anotarlo.</div>
        </div>
        <div className="game-reward-preview">
          <span className="game-reward-chip xp">+45 XP base</span>
          <span className="game-reward-chip coins">🪙 28 monedas</span>
          <span className="game-reward-chip stat">🟩 AGILIDAD</span>
        </div>
        <button className="btn-gold" onClick={start}>▶ INICIAR</button>
      </div>
    );
  }

  return (
    <div className="osu-wrapper">
      <div className="osu-canvas">
        {circles.map(c => (
          <div
            key={c.id}
            className="osu-circle"
            style={{
              left: `${c.x}%`, top: `${c.y}%`,
              width: 68, height: 68,
              background: `radial-gradient(circle at 35% 35%, ${c.color}ee, ${c.color}44)`,
              border: `3px solid ${c.color}`,
              boxShadow: `0 0 12px ${c.color}66`,
            }}
            onClick={() => hit(c.id, c.x, c.y)}
          >
            {/* Shrinking ring — shows time left */}
            <div style={{
              position: "absolute",
              width: "150%", height: "150%",
              borderRadius: "50%",
              border: `2px solid ${c.color}66`,
              animation: `ringIn ${c.lifetime}ms linear both`,
            }} />
          </div>
        ))}
        {feedbacks.map(f => (
          <div
            key={f.id}
            className={f.text === "MISS" ? "osu-miss" : "osu-hit"}
            style={{ left: `${f.x}%`, top: `${f.y}%`, color: f.color }}
          >
            {f.text}
          </div>
        ))}
      </div>
      <div className="osu-footer">
        <div className="osu-misses">
          Misses: <span style={{ color: "var(--red)" }}>{misses}</span>
        </div>
        <div className="osu-timer" style={{ color: timer <= 10 ? "var(--red)" : "var(--text-dim)" }}>
          {timer}s
        </div>
      </div>
    </div>
  );
}
