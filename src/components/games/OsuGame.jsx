/**
 * OsuGame.jsx — Minijuego: REFLEX BURST (estilo osu!)
 * ─────────────────────────────────────────────────────
 * Círculos de colores aparecen en posiciones aleatorias del canvas.
 * El jugador debe hacer clic sobre ellos antes de que desaparezcan.
 *
 * Música:
 *   Loop de fondo con botón mute/unmute.
 */
import { useState, useEffect, useRef, useCallback } from "react";
import reflexBurstLoop from "../../assets/audio/reflex-burst-loop.mp3";

const DURATION_OSU = 30;
const AUDIO_STORAGE_KEY = "rpglog_audio_reflexburst_muted";

function getInitialMuted() {
  try {
    return localStorage.getItem(AUDIO_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export default function OsuGame({ onEnd }) {
  const [circles, setCircles] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [timer, setTimer] = useState(DURATION_OSU);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(getInitialMuted);

  const nextId = useRef(0);
  const spawnRef = useRef(null);
  const audioRef = useRef(null);

  const spawnCircle = useCallback(() => {
    const id = nextId.current++;
    const x = 8 + Math.random() * 84;
    const y = 8 + Math.random() * 84;
    const colors = ["#e05252", "#5b8dd9", "#52c97a", "#a855f7", "#f5853a", "#f5c842"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const lifetime = 1000 + Math.random() * 800;

    setCircles((p) => [...p, { id, x, y, color, lifetime }]);

    setTimeout(() => {
      setCircles((p) => {
        const still = p.find((c) => c.id === id);
        if (still) {
          setMisses((m) => m + 1);
          setFeedbacks((f) => [...f, { id: Date.now() + Math.random(), x, y: y - 5, text: "MISS", color: "#e05252" }]);
        }
        return p.filter((c) => c.id !== id);
      });
    }, lifetime);
  }, []);

  const startMusic = useCallback(() => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(reflexBurstLoop);
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

  const start = () => {
    setStarted(true);
    setRunning(true);
    setScore(0);
    setMisses(0);
    setTimer(DURATION_OSU);
    setCircles([]);
    setFeedbacks([]);
    startMusic();
  };

  useEffect(() => {
    if (!running) return;
    spawnRef.current = setInterval(spawnCircle, 700);
    return () => clearInterval(spawnRef.current);
  }, [running, spawnCircle]);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setTimer((p) => {
        if (p <= 1) {
          clearInterval(t);
          setRunning(false);
          clearInterval(spawnRef.current);
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

  const hit = (id, x, y) => {
    setCircles((p) => p.filter((c) => c.id !== id));
    setScore((p) => p + 10);
    setFeedbacks((f) => [...f, { id: Date.now() + Math.random(), x, y: y - 5, text: "+10", color: "#f5c842" }]);
  };

  const toggleMute = () => {
    setMuted((prev) => !prev);
  };

  if (!started) {
    return (
      <div className="game-start-screen">
        <div className="game-start-hint">
          Pulsa los círculos antes de que desaparezcan.
          <br />
          Tienes {DURATION_OSU} segundos.
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
    <div className="osu-wrapper">
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

      <div className="osu-canvas">
        {circles.map((c) => (
          <div
            key={c.id}
            className="osu-circle"
            style={{
              left: `${c.x}%`,
              top: `${c.y}%`,
              width: 68,
              height: 68,
              background: `radial-gradient(circle at 35% 35%, ${c.color}ee, ${c.color}44)`,
              border: `3px solid ${c.color}`,
              boxShadow: `0 0 12px ${c.color}66`,
            }}
            onClick={() => hit(c.id, c.x, c.y)}
          >
            <div
              style={{
                position: "absolute",
                width: "150%",
                height: "150%",
                borderRadius: "50%",
                border: `2px solid ${c.color}66`,
                animation: `ringIn ${c.lifetime}ms linear both`,
              }}
            />
          </div>
        ))}

        {feedbacks.map((f) => (
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