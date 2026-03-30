/**
 * RhythmGame.jsx — Minijuego: RHYTHM STRIKE (estilo Muse Dash)
 * ─────────────────────────────────────────────────────
 * Juego de ritmo con dos carriles horizontales.
 * Las notas aparecen por la derecha y se mueven hacia la izquierda.
 * El jugador debe golpearlas cuando lleguen al círculo de la izquierda.
 *
 * Controles:
 *   Teclado: D = carril superior (morado) | K = carril inferior (naranja)
 *   Táctil:  botones en pantalla bajo el escenario
 *
 * Constantes ajustables (arriba del componente):
 *   DURATION   — duración de la partida en segundos (default: 40)
 *   SPAWN_MS   — milisegundos entre cada nota (default: 600)
 *   NOTE_SPEED — velocidad en % del ancho por frame de 16ms (default: 3.8)
 *   HIT_X      — posición % donde está la zona de golpe (default: 10)
 *   HIT_WINDOW — margen de tolerancia ± en % (default: 7)
 *
 * Puntuación:
 *   PERFECT (+300pts) — si el hit es dentro del 40% central de la ventana
 *   GOOD    (+150pts) — si está dentro de la ventana pero no en el centro
 *   Bonus de combo: +50pts por cada 5 hits consecutivos
 *
 * Estilos: MiniGamesScreen.css (.musedash-wrapper, .md-stage, .md-note, etc.)
 */
import { useState, useEffect, useRef, useCallback } from "react";

const DURATION   = 40;
const SPAWN_MS   = 600;       // ms entre notas
const NOTE_SPEED = 2.5;       // % de ancho por frame (16ms) — velocidad moderada
const HIT_X      = 10;        // % desde la izquierda donde está la zona de golpe
const HIT_WINDOW = 7;         // ± % para considerar un hit
const COLORS     = ["#a855f7", "#f5853a"];
const KEYS_KB    = ["d", "k"]; // teclado: D = arriba, K = abajo
const LANE_ICONS = ["↑", "↓"];

export default function RhythmGame({ onEnd }) {
  const [notes, setNotes]         = useState([]);
  const [pressed, setPressed]     = useState([false, false]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [score, setScore]         = useState(0);
  const [combo, setCombo]         = useState(0);
  const [timer, setTimer]         = useState(DURATION);
  const [running, setRunning]     = useState(false);
  const [started, setStarted]     = useState(false);
  const noteId   = useRef(0);
  const comboRef = useRef(0);    // ref para acceder al combo actual dentro de callbacks

  // ── Spawn notes from the right ──────────────────────────────────
  useEffect(() => {
    if (!running) return;
    const spawn = setInterval(() => {
      // Sometimes spawn both lanes at once for patterns
      const lanesThisSpawn = Math.random() < 0.15
        ? [0, 1]
        : [Math.floor(Math.random() * 2)];
      lanesThisSpawn.forEach((lane, i) => {
        setTimeout(() => {
          setNotes(p => [...p, { id: noteId.current++, lane, x: 102 }]);
        }, i * 120);
      });
    }, SPAWN_MS);
    return () => clearInterval(spawn);
  }, [running]);

  // ── Move notes left each frame ───────────────────────────────────
  useEffect(() => {
    if (!running) return;
    const frame = setInterval(() => {
      setNotes(prev => {
        const moved = prev.map(n => ({ ...n, x: n.x - NOTE_SPEED }));
        // Notes that passed the hit zone without being hit
        const missed = moved.filter(n => n.x < HIT_X - HIT_WINDOW - 2);
        if (missed.length > 0) {
          comboRef.current = 0;
          setCombo(0);
        }
        return moved.filter(n => n.x > -5);
      });
    }, 16);
    return () => clearInterval(frame);
  }, [running]);

  // ── Timer ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setTimer(p => {
        if (p <= 1) { setRunning(false); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running]);

  useEffect(() => {
    if (started && !running && timer === 0) onEnd(score);
  }, [running]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Hit logic ────────────────────────────────────────────────────
  const hitLane = useCallback((lane) => {
    setPressed(p => { const n = [...p]; n[lane] = true; return n; });
    setTimeout(() => setPressed(p => { const n = [...p]; n[lane] = false; return n; }), 130);

    setNotes(prev => {
      // Find closest note in this lane near the hit zone
      const candidates = prev.filter(
        n => n.lane === lane &&
             n.x >= HIT_X - HIT_WINDOW &&
             n.x <= HIT_X + HIT_WINDOW
      );
      if (candidates.length === 0) {
        // Miss — pressed with no note
        comboRef.current = 0;
        setCombo(0);
        setFeedbacks(f => [...f, { id: Date.now(), lane, text: "MISS", color: "#e05252" }]);
        return prev;
      }

      // Hit the closest one
      const hit = candidates.reduce((a, b) =>
        Math.abs(a.x - HIT_X) < Math.abs(b.x - HIT_X) ? a : b
      );
      const diff    = Math.abs(hit.x - HIT_X);
      const perfect = diff < HIT_WINDOW * 0.4;
      const pts     = perfect ? 300 : 150;

      comboRef.current += 1;
      const newCombo = comboRef.current;
      setCombo(newCombo);

      const comboBonus = Math.floor(newCombo / 5) * 50;
      setScore(s => s + pts + comboBonus);

      setFeedbacks(f => [...f, {
        id: Date.now(), lane,
        text: perfect ? "PERFECT!" : "GOOD",
        color: perfect ? "#f5c842" : "#52c97a",
      }]);

      return prev.filter(n => n.id !== hit.id);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Keyboard support ─────────────────────────────────────────────
  useEffect(() => {
    if (!started) return;
    const onKey = (e) => {
      if (e.repeat) return;
      const idx = KEYS_KB.indexOf(e.key.toLowerCase());
      if (idx !== -1) hitLane(idx);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started, hitLane]);

  const start = () => {
    setStarted(true); setRunning(true);
    setScore(0); setCombo(0);
    setNotes([]); setFeedbacks([]); setTimer(DURATION);
    comboRef.current = 0;
  };

  if (!started) {
    return (
      <div className="game-start-screen">
        <div className="game-start-hint">Golpea las notas exactamente cuando lleguen a la zona marcada. ¡El timing lo es todo!</div>
        <div className="game-instructions">
          <div className="game-instr-title">📋 CÓMO JUGAR</div>
          <div className="game-instr-row"><span className="game-instr-icon">🎵</span>Las notas viajan de derecha a izquierda en dos carriles.</div>
          <div className="game-instr-row"><span className="game-instr-icon">🎯</span>Presiona el botón cuando la nota llegue al círculo del lado izquierdo.</div>
          <div className="game-instr-row"><span className="game-instr-icon">⭐</span><strong>PERFECT</strong> (+300 pts) con timing exacto. <strong>GOOD</strong> (+150 pts) si está cerca.</div>
          <div className="game-instr-row"><span className="game-instr-icon">🔥</span>El combo multiplica tus puntos. Cada 5 hits seguidos da +50 pts extra.</div>
          <div className="game-instr-row"><span className="game-instr-icon">⏱</span>La partida dura {DURATION} segundos.</div>
          <div className="game-instr-title" style={{marginTop:".3rem"}}>⌨ TECLADO &nbsp;|&nbsp; 👆 MÓVIL</div>
          <div className="game-instr-row"><span className="game-instr-icon">D</span>Tecla D o botón ARRIBA → carril superior (morado).</div>
          <div className="game-instr-row"><span className="game-instr-icon">K</span>Tecla K o botón ABAJO → carril inferior (naranja).</div>
        </div>
        <div className="game-reward-preview">
          <span className="game-reward-chip xp">+70 XP base</span>
          <span className="game-reward-chip coins">🪙 45 monedas</span>
          <span className="game-reward-chip stat">🟩 AGILIDAD</span>
        </div>
        <button className="btn-gold" onClick={start}>▶ INICIAR</button>
      </div>
    );
  }

  return (
    <div className="musedash-wrapper">
      {/* Score + combo HUD */}
      <div className="md-hud">
        <div className="md-hud-score">{score.toLocaleString()}</div>
        <div className="md-hud-timer" style={{ color: timer <= 10 ? "var(--red)" : "var(--text-dim)" }}>
          {timer}s
        </div>
        {combo > 1 && (
          <div className="md-combo">🔥 ×{combo}</div>
        )}
      </div>

      {/* Main play area */}
      <div className="md-stage">

        {/* Lane backgrounds */}
        <div className="md-lane md-lane-top" />
        <div className="md-lane-divider" />
        <div className="md-lane md-lane-bot" />

        {/* Hit zone — left side */}
        <div className="md-hit-zone">
          <div className="md-hit-circle md-hit-circle-top"
               style={{ borderColor: pressed[0] ? COLORS[0] : "rgba(255,255,255,0.25)",
                        boxShadow: pressed[0] ? `0 0 16px ${COLORS[0]}` : "none" }} />
          <div className="md-hit-circle md-hit-circle-bot"
               style={{ borderColor: pressed[1] ? COLORS[1] : "rgba(255,255,255,0.25)",
                        boxShadow: pressed[1] ? `0 0 16px ${COLORS[1]}` : "none" }} />
        </div>

        {/* Vertical hit line */}
        <div className="md-hit-line" />

        {/* Notes */}
        {notes.map(n => (
          <div
            key={n.id}
            className={`md-note md-note-${n.lane === 0 ? "top" : "bot"}`}
            style={{
              left: `${n.x}%`,
              "--nc": COLORS[n.lane],
            }}
          >
            {LANE_ICONS[n.lane]}
          </div>
        ))}

        {/* Feedback text */}
        {feedbacks.slice(-4).map(f => (
          <div
            key={f.id}
            className={`md-feedback md-feedback-${f.lane === 0 ? "top" : "bot"}`}
            style={{ color: f.color }}
          >
            {f.text}
          </div>
        ))}
      </div>

      {/* Touch / click buttons */}
      <div className="md-buttons">
        <div
          className={`md-btn md-btn-top${pressed[0] ? " pressed" : ""}`}
          onMouseDown={() => hitLane(0)}
          onTouchStart={(e) => { e.preventDefault(); hitLane(0); }}
        >
          <span className="md-btn-key">D</span>
          <span className="md-btn-label">ARRIBA</span>
        </div>
        <div
          className={`md-btn md-btn-bot${pressed[1] ? " pressed" : ""}`}
          onMouseDown={() => hitLane(1)}
          onTouchStart={(e) => { e.preventDefault(); hitLane(1); }}
        >
          <span className="md-btn-key">K</span>
          <span className="md-btn-label">ABAJO</span>
        </div>
      </div>
    </div>
  );
}
