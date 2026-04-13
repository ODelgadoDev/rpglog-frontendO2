/**
 * TetrisGame.jsx — Minijuego: PIXEL BLOCKS (Tetris)
 * ─────────────────────────────────────────────────────
 * Implementación de Tetris clásico en React.
 * Stats mejoradas: INTELIGENCIA + AGILIDAD
 *
 * Dificultad: FÁCIL con aceleración progresiva
 *   Velocidad inicial cómoda (800ms por caída).
 *   Cada 5000 puntos la velocidad aumenta 60ms hasta el mínimo de 80ms.
 *
 * Música:
 *   Loop de fondo con botón mute/unmute.
 */
import { useState, useEffect, useRef, useCallback } from "react";
import pixelblocksLoop from "../../assets/audio/pixelblocks-loop.wav";

const TETRIS_COLS = 10;
const TETRIS_ROWS = 16;

// Velocidad base y aceleración
const BASE_SPEED = 800;
const SPEED_STEP_PTS = 5000;
const SPEED_REDUCTION = 60;
const MIN_SPEED = 80;

const AUDIO_STORAGE_KEY = "rpglog_audio_pixelblocks_muted";

const PIECES = [
  { shape: [[1, 1, 1, 1]], color: "#5b8dd9" }, // I
  { shape: [[1, 1], [1, 1]], color: "#f5c842" }, // O
  { shape: [[0, 1, 0], [1, 1, 1]], color: "#a855f7" }, // T
  { shape: [[1, 0], [1, 0], [1, 1]], color: "#f5853a" }, // L
  { shape: [[0, 1], [0, 1], [1, 1]], color: "#5b8dd9" }, // J
  { shape: [[0, 1, 1], [1, 1, 0]], color: "#52c97a" }, // S
  { shape: [[1, 1, 0], [0, 1, 1]], color: "#e05252" }, // Z
];

const emptyBoard = () => Array.from({ length: TETRIS_ROWS }, () => Array(TETRIS_COLS).fill(null));
const randPiece = () => ({ ...PIECES[Math.floor(Math.random() * PIECES.length)], x: 3, y: 0 });

const calcSpeed = (score) =>
  Math.max(MIN_SPEED, BASE_SPEED - Math.floor(score / SPEED_STEP_PTS) * SPEED_REDUCTION);

function getInitialMuted() {
  try {
    return localStorage.getItem(AUDIO_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export default function TetrisGame({ onEnd }) {
  const [board, setBoard] = useState(emptyBoard());
  const [piece, setPiece] = useState(null);
  const [next, setNext] = useState(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [started, setStarted] = useState(false);
  const [over, setOver] = useState(false);
  const [muted, setMuted] = useState(getInitialMuted);

  const boardRef = useRef(board);
  const pieceRef = useRef(piece);
  const audioRef = useRef(null);

  boardRef.current = board;
  pieceRef.current = piece;

  const collides = (b, p, dx = 0, dy = 0) => {
    if (!p) return false;
    for (let r = 0; r < p.shape.length; r++) {
      for (let c = 0; c < p.shape[r].length; c++) {
        if (p.shape[r][c]) {
          const nx = p.x + c + dx;
          const ny = p.y + r + dy;
          if (nx < 0 || nx >= TETRIS_COLS || ny >= TETRIS_ROWS) return true;
          if (ny >= 0 && b[ny][nx]) return true;
        }
      }
    }
    return false;
  };

  const merge = (b, p) => {
    const nb = b.map((r) => [...r]);
    for (let r = 0; r < p.shape.length; r++) {
      for (let c = 0; c < p.shape[r].length; c++) {
        if (p.shape[r][c] && p.y + r >= 0) nb[p.y + r][p.x + c] = p.color;
      }
    }
    return nb;
  };

  const clearLines = (b) => {
    const nb = b.filter((r) => r.some((c) => !c));
    const cleared = TETRIS_ROWS - nb.length;
    const empty = Array.from({ length: cleared }, () => Array(TETRIS_COLS).fill(null));
    return { board: [...empty, ...nb], cleared };
  };

  const lock = useCallback(() => {
    const p = pieceRef.current;
    const b = boardRef.current;
    if (!p) return;

    const merged = merge(b, p);
    const { board: nb, cleared } = clearLines(merged);
    const pts = [0, 100, 300, 500, 800][cleared] || 0;

    setBoard(nb);
    setScore((s) => s + pts + 10);
    setLines((l) => l + cleared);

    const np = next || randPiece();
    if (collides(nb, np)) {
      setOver(true);
      return;
    }

    setPiece(np);
    setNext(randPiece());
  }, [next]);

  useEffect(() => {
    if (!started || over || !piece) return;
    const t = setInterval(() => {
      const p = pieceRef.current;
      if (collides(boardRef.current, p, 0, 1)) lock();
      else setPiece((pr) => ({ ...pr, y: pr.y + 1 }));
    }, calcSpeed(score));
    return () => clearInterval(t);
  }, [started, over, lock, score]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (over) {
      try {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      } catch {}
      onEnd(score);
    }
  }, [over, onEnd, score]);

  useEffect(() => {
    if (!started) return;
    const onKey = (e) => {
      const p = pieceRef.current;
      const b = boardRef.current;
      if (!p) return;

      if (e.key === "ArrowLeft" && !collides(b, p, -1, 0)) {
        setPiece((pr) => ({ ...pr, x: pr.x - 1 }));
      }
      if (e.key === "ArrowRight" && !collides(b, p, 1, 0)) {
        setPiece((pr) => ({ ...pr, x: pr.x + 1 }));
      }
      if (e.key === "ArrowDown" && !collides(b, p, 0, 1)) {
        setPiece((pr) => ({ ...pr, y: pr.y + 1 }));
      }
      if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") {
        const rot = p.shape[0].map((_, i) => p.shape.map((r) => r[i]).reverse());
        if (!collides(b, { ...p, shape: rot })) setPiece((pr) => ({ ...pr, shape: rot }));
      }
      if (e.key === " ") {
        let dy = 0;
        while (!collides(b, p, 0, dy + 1)) dy++;
        setPiece((pr) => ({ ...pr, y: pr.y + dy }));
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started]); // eslint-disable-line react-hooks/exhaustive-deps

  const touchStartRef = useRef(null);

  const handleTouchStart = (e) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY, time: Date.now() };
  };

  const handleTouchEnd = (e) => {
    if (!touchStartRef.current || !started || over) return;

    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartRef.current.x;
    const dy = t.clientY - touchStartRef.current.y;
    const dt = Date.now() - touchStartRef.current.time;

    const p = pieceRef.current;
    const b = boardRef.current;
    if (!p) return;

    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (absDx < 15 && absDy < 15 && dt < 300) {
      const rot = p.shape[0].map((_, i) => p.shape.map((r) => r[i]).reverse());
      if (!collides(b, { ...p, shape: rot })) setPiece((pr) => ({ ...pr, shape: rot }));
      return;
    }

    if (absDx > absDy) {
      const steps = Math.max(1, Math.round(absDx / 30));
      const dir = dx > 0 ? 1 : -1;
      setPiece((pr) => {
        let nx = pr.x;
        for (let i = 0; i < steps; i++) {
          if (!collides(b, { ...pr, x: nx + dir })) nx += dir;
        }
        return { ...pr, x: nx };
      });
    } else {
      if (dy < -30) {
        const rot = p.shape[0].map((_, i) => p.shape.map((r) => r[i]).reverse());
        if (!collides(b, { ...p, shape: rot })) setPiece((pr) => ({ ...pr, shape: rot }));
      } else if (dy > 30) {
        let ddY = 0;
        while (!collides(b, p, 0, ddY + 1)) ddY++;
        setPiece((pr) => ({ ...pr, y: pr.y + ddY }));
      }
    }

    touchStartRef.current = null;
  };

  const startMusic = useCallback(() => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(pixelblocksLoop);
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
      if (audioRef.current) {
        audioRef.current.muted = muted;
      }
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

  const toggleMute = () => {
    setMuted((prev) => !prev);
  };

  const start = () => {
    const p = randPiece();
    setPiece(p);
    setNext(randPiece());
    setBoard(emptyBoard());
    setScore(0);
    setLines(0);
    setOver(false);
    setStarted(true);
    startMusic();
  };

  const ghostY = () => {
    if (!piece) return piece?.y;
    let dy = 0;
    while (!collides(board, piece, 0, dy + 1)) dy++;
    return piece.y + dy;
  };

  const renderBoard = () => {
    const grid = board.map((r) => [...r]);

    const gy = ghostY();
    if (piece) {
      piece.shape.forEach((r, ri) =>
        r.forEach((c, ci) => {
          if (c) {
            if (gy + ri >= 0 && gy + ri < TETRIS_ROWS) {
              grid[gy + ri][piece.x + ci] = { ghost: true, color: piece.color };
            }
            if (piece.y + ri >= 0) {
              grid[piece.y + ri][piece.x + ci] = { active: true, color: piece.color };
            }
          }
        })
      );
    }

    return grid;
  };

  if (!started) {
    return (
      <div className="game-start-screen">
        <div className="game-start-hint">
          ← → mover | ↑ rotar | ↓ bajar
          <br />
          ESPACIO caída rápida
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

  const grid = renderBoard();

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.8rem" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", width: "100%", maxWidth: "420px" }}>
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

      <div className="tetris-wrap">
        <div
          className="tetris-board"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{ touchAction: "none" }}
        >
          {grid.flat().map((cell, i) => (
            <div
              key={i}
              className={`tetris-cell${
                cell && cell.active ? " active" : cell && cell.ghost ? " ghost" : cell ? " filled" : ""
              }`}
              style={cell ? { "--cell-color": cell.color || cell } : {}}
            />
          ))}
        </div>

        <div className="tetris-side">
          <div className="tetris-next">
            <div className="tetris-next-title">SIGUIENTE</div>
            <div className="tetris-next-grid">
              {Array.from({ length: 16 }, (_, i) => {
                const r = Math.floor(i / 4);
                const c = i % 4;
                const f = next && next.shape[r] && next.shape[r][c];
                return (
                  <div
                    key={i}
                    className={`tetris-next-cell${f ? " filled" : ""}`}
                    style={f ? { "--cell-color": next.color } : {}}
                  />
                );
              })}
            </div>
          </div>

          <div className="tetris-info">
            <div className="tetris-info-label">PUNTOS</div>
            <div className="tetris-info-val">{score}</div>

            <div className="tetris-info-label">LÍNEAS</div>
            <div className="tetris-info-val">{lines}</div>

            <div className="tetris-info-label">VELOCIDAD</div>
            <div
              className="tetris-info-val"
              style={{
                color: score >= SPEED_STEP_PTS ? "#f5c842" : "var(--text-dim)",
                fontSize: ".9rem",
              }}
            >
              LV {Math.floor(score / SPEED_STEP_PTS) + 1}
            </div>

            <div className="tetris-ctrl">
              <span>← → mover</span>
              <span>↑ / W rotar</span>
              <span>↓ bajar</span>
              <span>SPC caída</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}