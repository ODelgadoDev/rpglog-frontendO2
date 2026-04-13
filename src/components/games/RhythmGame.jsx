/**
 * RhythmGame.jsx — Minijuego: RHYTHM STRIKE (estilo Muse Dash)
 * ─────────────────────────────────────────────────────
 * Juego de ritmo con dos carriles horizontales.
 * Las notas aparecen por la derecha y se mueven hacia la izquierda.
 * El jugador debe golpearlas cuando lleguen al círculo de la izquierda.
 *
 * Música:
 *   Loop de fondo con botón mute/unmute.
 */
import { useState, useEffect, useRef, useCallback } from "react";
import rhythmStrikeLoop from "../../assets/audio/rhythm-strike-loop.ogg";

const DURATION = 40;
const SPAWN_MS = 600;
const NOTE_SPEED = 2.5;
const HIT_X = 10;
const HIT_WINDOW = 7;
const COLORS = ["#a855f7", "#f5853a"];
const KEYS_KB = ["d", "k"];
const LANE_ICONS = ["↑", "↓"];
const AUDIO_STORAGE_KEY = "rpglog_audio_rhythmstrike_muted";

function getInitialMuted() {
  try {
    return localStorage.getItem(AUDIO_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export default function RhythmGame({ onEnd }) {
  const [notes, setNotes] = useState([]);
  const [pressed, setPressed] = useState([false, false]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timer, setTimer] = useState(DURATION);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(getInitialMuted);

  const noteId = useRef(0);
  const comboRef = useRef(0);
  const audioRef = useRef(null);

  const startMusic = useCallback(() => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(rhythmStrikeLoop);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.28;
      }

      audioRef.current.muted = muted;
      audioRef.current.currentTime = 0;

      const playPromise = audioRef.current.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
    } catch {}
  }, [muted]);

  useEffect(() => {
    try {
      localStorage.setItem(AUDIO_STORAGE_KEY, muted ? "1" : "0");
    } catch {}

    try {
      if (audioRef.current) audioRef.current.muted = muted;
    } catch {}
  }, [muted]);

  useEffect(() => {
    return () => {
      try {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      } catch {}
    };
  }, []);

  // ── Spawn notes from the right ──────────────────────────────────
  useEffect(() => {
    if (!running) return;
    const spawn = setInterval(() => {
      const lanesThisSpawn =
        Math.random() < 0.15 ? [0, 1] : [Math.floor(Math.random() * 2)];

      lanesThisSpawn.forEach((lane, i) => {
        setTimeout(() => {
          setNotes((p) => [...p, { id: noteId.current++, lane, x: 102 }]);
        }, i * 120);
      });
    }, SPAWN_MS);

    return () => clearInterval(spawn);
  }, [running]);

  // ── Move notes left each frame ───────────────────────────────────
  useEffect(() => {
    if (!running) return;
    const frame = setInterval(() => {
      setNotes((prev) => {
        const moved = prev.map((n) => ({ ...n, x: n.x - NOTE_SPEED }));
        const missed = moved.filter((n) => n.x < HIT_X - HIT_WINDOW - 2);

        if (missed.length > 0) {
          comboRef.current = 0;
          setCombo(0);
        }

        return moved.filter((n) => n.x > -5);
      });
    }, 16);

    return () => clearInterval(frame);
  }, [running]);

  // ── Timer ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setTimer((p) => {
        if (p <= 1) {
          setRunning(false);
          return 0;
        }
        return p - 1;
      });
    }, 1000);

    return () => clearInterval(t);
  }, [running]);

  useEffect(() => {
    if (started && !running && timer === 0) {
      try {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      } catch {}
      onEnd(score);
    }
  }, [started, running, timer, onEnd, score]);

  // ── Hit logic ────────────────────────────────────────────────────
  const hitLane = useCallback((lane) => {
    setPressed((p) => {
      const n = [...p];
      n[lane] = true;
      return n;
    });

    setTimeout(() => {
      setPressed((p) => {
        const n = [...p];
        n[lane] = false;
        return n;
      });
    }, 130);

    setNotes((prev) => {
      const candidates = prev.filter(
        (n) =>
          n.lane === lane &&
          n.x >= HIT_X - HIT_WINDOW &&
          n.x <= HIT_X + HIT_WINDOW
      );

      if (candidates.length === 0) {
        comboRef.current = 0;
        setCombo(0);
        setFeedbacks((f) => [
          ...f,
          { id: Date.now() + Math.random(), lane, text: "MISS", color: "#e05252" },
        ]);
        return prev;
      }

      const hit = candidates.reduce((a, b) =>
        Math.abs(a.x - HIT_X) < Math.abs(b.x - HIT_X) ? a : b
      );

      const diff = Math.abs(hit.x - HIT_X);
      const perfect = diff < HIT_WINDOW * 0.4;
      const pts = perfect ? 300 : 150;

      comboRef.current += 1;
      const newCombo = comboRef.current;
      setCombo(newCombo);

      const comboBonus = Math.floor(newCombo / 5) * 50;
      setScore((s) => s + pts + comboBonus);

      setFeedbacks((f) => [
        ...f,
        {
          id: Date.now() + Math.random(),
          lane,
          text: perfect ? "PERFECT!" : "GOOD",
          color: perfect ? "#f5c842" : "#52c97a",
        },
      ]);

      return prev.filter((n) => n.id !== hit.id);
    });
  }, []);

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

  const toggleMute = () => {
    setMuted((prev) => !prev);
  };

  const start = () => {
    setStarted(true);
    setRunning(true);
    setScore(0);
    setCombo(0);
    setNotes([]);
    setFeedbacks([]);
    setTimer(DURATION);
    comboRef.current = 0;
    startMusic();
  };

  if (!started) {
    return (
      <div className="game-start-screen">
        <div className="game-start-hint">
          Las notas vienen de la derecha.
          <br />
          Golpéalas cuando lleguen al círculo.
          <br />
          <br />
          <span style={{ letterSpacing: "0.1em" }}>
            Carril superior → <strong>D</strong> &nbsp;|&nbsp; Carril inferior → <strong>K</strong>
          </span>
        </div>

        <button
          onClick={toggleMute}
          style={{
            marginBottom: ".7rem",
            background: "rgba(255,255,255,.06)",
            border: "1px solid rgba(255,255,255,.18)",
            color: "var(--text)",
            padding: ".5rem .8rem",
            cursor: "pointer",
            fontFamily: "var(--pixel)",
            fontSize: ".38rem",
            letterSpacing: ".04em",
          }}
        >
          {muted ? "🔇 MÚSICA OFF" : "🔊 MÚSICA ON"}
        </button>

        <button className="btn-gold" onClick={start}>
          ▶ INICIAR
        </button>
      </div>
    );
  }

  return (
    <div className="musedash-wrapper">
      <div style={{ display: "flex", justifyContent: "flex-end", width: "100%", marginBottom: ".35rem" }}>
        <button
          onClick={toggleMute}
          style={{
            background: "rgba(255,255,255,.06)",
            border: "1px solid rgba(255,255,255,.18)",
            color: "var(--text)",
            padding: ".45rem .7rem",
            cursor: "pointer",
            fontFamily: "var(--pixel)",
            fontSize: ".36rem",
            letterSpacing: ".04em",
          }}
        >
          {muted ? "🔇" : "🔊"}
        </button>
      </div>

      {/* Score + combo HUD */}
      <div className="md-hud">
        <div className="md-hud-score">{score.toLocaleString()}</div>
        <div className="md-hud-timer" style={{ color: timer <= 10 ? "var(--red)" : "var(--text-dim)" }}>
          {timer}s
        </div>
        {combo > 1 && <div className="md-combo">🔥 ×{combo}</div>}
      </div>

      {/* Main play area */}
      <div className="md-stage">
        <div className="md-lane md-lane-top" />
        <div className="md-lane-divider" />
        <div className="md-lane md-lane-bot" />

        <div className="md-hit-zone">
          <div
            className="md-hit-circle md-hit-circle-top"
            style={{
              borderColor: pressed[0] ? COLORS[0] : "rgba(255,255,255,0.25)",
              boxShadow: pressed[0] ? `0 0 16px ${COLORS[0]}` : "none",
            }}
          />
          <div
            className="md-hit-circle md-hit-circle-bot"
            style={{
              borderColor: pressed[1] ? COLORS[1] : "rgba(255,255,255,0.25)",
              boxShadow: pressed[1] ? `0 0 16px ${COLORS[1]}` : "none",
            }}
          />
        </div>

        <div className="md-hit-line" />

        {notes.map((n) => (
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

        {feedbacks.slice(-4).map((f) => (
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
          onTouchStart={(e) => {
            e.preventDefault();
            hitLane(0);
          }}
        >
          <span className="md-btn-key">D</span>
          <span className="md-btn-label">ARRIBA</span>
        </div>

        <div
          className={`md-btn md-btn-bot${pressed[1] ? " pressed" : ""}`}
          onMouseDown={() => hitLane(1)}
          onTouchStart={(e) => {
            e.preventDefault();
            hitLane(1);
          }}
        >
          <span className="md-btn-key">K</span>
          <span className="md-btn-label">ABAJO</span>
        </div>
      </div>
    </div>
  );
}