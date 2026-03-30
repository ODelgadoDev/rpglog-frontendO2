/**
 * TetrisGame.jsx — Minijuego: PIXEL BLOCKS (Tetris)
 * ─────────────────────────────────────────────────────
 * Implementación de Tetris clásico en React.
 * Stats mejoradas: INTELIGENCIA + AGILIDAD
 *
 * Dificultad: FÁCIL con aceleración progresiva
 *   Velocidad inicial cómoda (800ms por caída).
 *   Cada 5000 puntos la velocidad aumenta 60ms hasta el mínimo de 80ms.
 *   Así el juego empieza fácil pero escala con la habilidad del jugador.
 *
 * Tablero: 10 columnas × 16 filas
 * Piezas:  7 tetrominós (I, O, T, S, Z, J, L)
 *
 * Controles:
 *   ← →     — mover pieza lateralmente
 *   ↓       — bajar más rápido (soft drop)
 *   ↑ / W   — rotar pieza
 *   Botones táctiles en pantalla para móvil
 *
 * Puntuación:
 *   1 línea  = 100pts
 *   2 líneas = 300pts
 *   3 líneas = 600pts
 *   4 líneas (Tetris) = 1000pts
 *
 * Estilos: MiniGamesScreen.css (.tetris-board, .tetris-cell, .tetris-controls)
 */
import { useState, useEffect, useRef, useCallback } from "react";

const TETRIS_COLS = 10;
const TETRIS_ROWS = 16;

// Velocidad base y aceleración
const BASE_SPEED       = 800;  // ms por caída — inicio cómodo (fácil)
const SPEED_STEP_PTS   = 5000; // cada cuántos puntos se acelera
const SPEED_REDUCTION  = 60;   // ms que se restan por escalón
const MIN_SPEED        = 80;   // límite mínimo de velocidad

const PIECES = [
  { shape: [[1,1,1,1]],           color: "#5b8dd9" }, // I
  { shape: [[1,1],[1,1]],         color: "#f5c842" }, // O
  { shape: [[0,1,0],[1,1,1]],     color: "#a855f7" }, // T
  { shape: [[1,0],[1,0],[1,1]],   color: "#f5853a" }, // L
  { shape: [[0,1],[0,1],[1,1]],   color: "#5b8dd9" }, // J
  { shape: [[0,1,1],[1,1,0]],     color: "#52c97a" }, // S
  { shape: [[1,1,0],[0,1,1]],     color: "#e05252" }, // Z
];

const emptyBoard = () => Array.from({ length: TETRIS_ROWS }, () => Array(TETRIS_COLS).fill(null));
const randPiece  = () => ({ ...PIECES[Math.floor(Math.random() * PIECES.length)], x: 3, y: 0 });

// Calcula la velocidad actual según los puntos acumulados
const calcSpeed = (score) =>
  Math.max(MIN_SPEED, BASE_SPEED - Math.floor(score / SPEED_STEP_PTS) * SPEED_REDUCTION);

export default function TetrisGame({ onEnd }) {
  const [board, setBoard]     = useState(emptyBoard());
  const [piece, setPiece]     = useState(null);
  const [next, setNext]       = useState(null);
  const [score, setScore]     = useState(0);
  const [lines, setLines]     = useState(0);
  const [started, setStarted] = useState(false);
  const [over, setOver]       = useState(false);

  const boardRef = useRef(board);
  const pieceRef = useRef(piece);
  boardRef.current = board;
  pieceRef.current = piece;

  const collides = (b, p, dx = 0, dy = 0) => {
    if (!p) return false;
    for (let r = 0; r < p.shape.length; r++)
      for (let c = 0; c < p.shape[r].length; c++)
        if (p.shape[r][c]) {
          const nx = p.x + c + dx, ny = p.y + r + dy;
          if (nx < 0 || nx >= TETRIS_COLS || ny >= TETRIS_ROWS) return true;
          if (ny >= 0 && b[ny][nx]) return true;
        }
    return false;
  };

  const merge = (b, p) => {
    const nb = b.map(r => [...r]);
    for (let r = 0; r < p.shape.length; r++)
      for (let c = 0; c < p.shape[r].length; c++)
        if (p.shape[r][c] && p.y + r >= 0) nb[p.y + r][p.x + c] = p.color;
    return nb;
  };

  const clearLines = (b) => {
    const nb      = b.filter(r => r.some(c => !c));
    const cleared = TETRIS_ROWS - nb.length;
    const empty   = Array.from({ length: cleared }, () => Array(TETRIS_COLS).fill(null));
    return { board: [...empty, ...nb], cleared };
  };

  const lock = useCallback(() => {
    const p = pieceRef.current; const b = boardRef.current;
    if (!p) return;
    const merged              = merge(b, p);
    const { board: nb, cleared } = clearLines(merged);
    const pts = [0, 100, 300, 500, 800][cleared] || 0;
    setBoard(nb); setScore(s => s + pts + 10); setLines(l => l + cleared);
    const np = next || randPiece();
    if (collides(nb, np)) { setOver(true); return; }
    setPiece(np); setNext(randPiece());
  }, [next]);

  useEffect(() => {
    if (!started || over || !piece) return;
    const t = setInterval(() => {
      const p = pieceRef.current;
      if (collides(boardRef.current, p, 0, 1)) lock();
      else setPiece(pr => ({ ...pr, y: pr.y + 1 }));
    }, calcSpeed(score));
    return () => clearInterval(t);
  }, [started, over, lock, score]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (over) onEnd(score); }, [over]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Controles de teclado ─────────────────────────────────────
  useEffect(() => {
    if (!started) return;
    const onKey = (e) => {
      const p = pieceRef.current; const b = boardRef.current;
      if (!p) return;
      if (e.key === "ArrowLeft"  && !collides(b, p, -1, 0)) setPiece(pr => ({ ...pr, x: pr.x - 1 }));
      if (e.key === "ArrowRight" && !collides(b, p, 1, 0))  setPiece(pr => ({ ...pr, x: pr.x + 1 }));
      if (e.key === "ArrowDown"  && !collides(b, p, 0, 1))  setPiece(pr => ({ ...pr, y: pr.y + 1 }));
      if (e.key === "ArrowUp") {
        const rot = p.shape[0].map((_, i) => p.shape.map(r => r[i]).reverse());
        if (!collides(b, { ...p, shape: rot })) setPiece(pr => ({ ...pr, shape: rot }));
      }
      if (e.key === " ") {
        let dy = 0; while (!collides(b, p, 0, dy + 1)) dy++;
        setPiece(pr => ({ ...pr, y: pr.y + dy }));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Controles táctiles (swipe) ───────────────────────────────
  // Swipe izquierda/derecha → mover | Swipe arriba → rotar | Swipe abajo → caída rápida | Tap → rotar
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
    const p = pieceRef.current; const b = boardRef.current;
    if (!p) return;

    const absDx = Math.abs(dx), absDy = Math.abs(dy);

    // Tap (movimiento < 15px, tiempo < 300ms) → rotar
    if (absDx < 15 && absDy < 15 && dt < 300) {
      const rot = p.shape[0].map((_, i) => p.shape.map(r => r[i]).reverse());
      if (!collides(b, { ...p, shape: rot })) setPiece(pr => ({ ...pr, shape: rot }));
      return;
    }

    if (absDx > absDy) {
      // Horizontal — mover
      const steps = Math.max(1, Math.round(absDx / 30));
      const dir = dx > 0 ? 1 : -1;
      setPiece(pr => {
        let nx = pr.x;
        for (let i = 0; i < steps; i++) {
          if (!collides(b, { ...pr, x: nx + dir })) nx += dir;
        }
        return { ...pr, x: nx };
      });
    } else {
      // Vertical
      if (dy < -30) {
        // Swipe arriba → rotar
        const rot = p.shape[0].map((_, i) => p.shape.map(r => r[i]).reverse());
        if (!collides(b, { ...p, shape: rot })) setPiece(pr => ({ ...pr, shape: rot }));
      } else if (dy > 30) {
        // Swipe abajo → hard drop
        let ddY = 0; while (!collides(b, p, 0, ddY + 1)) ddY++;
        setPiece(pr => ({ ...pr, y: pr.y + ddY }));
      }
    }
    touchStartRef.current = null;
  };

  const start = () => {
    const p = randPiece();
    setPiece(p); setNext(randPiece()); setBoard(emptyBoard());
    setScore(0); setLines(0); setOver(false); setStarted(true);
  };

  const ghostY = () => {
    if (!piece) return piece?.y;
    let dy = 0;
    while (!collides(board, piece, 0, dy + 1)) dy++;
    return piece.y + dy;
  };

  const renderBoard = () => {
    const grid = board.map(r => [...r]);
    const gy   = ghostY();
    if (piece) {
      piece.shape.forEach((r, ri) => r.forEach((c, ci) => {
        if (c) {
          if (gy + ri >= 0 && gy + ri < TETRIS_ROWS) grid[gy + ri][piece.x + ci] = { ghost: true, color: piece.color };
          if (piece.y + ri >= 0) grid[piece.y + ri][piece.x + ci] = { active: true, color: piece.color };
        }
      }));
    }
    return grid;
  };

  if (!started) {
    return (
      <div className="game-start-screen">
        <div className="game-start-hint">Encaja las piezas y borra líneas completas. ¡La velocidad aumenta progresivamente!</div>
        <div className="game-instructions">
          <div className="game-instr-title">📋 CÓMO JUGAR</div>
          <div className="game-instr-row"><span className="game-instr-icon">🧱</span>Las piezas caen desde arriba. Llena líneas horizontales completas para borrarlas.</div>
          <div className="game-instr-row"><span className="game-instr-icon">✨</span>Cada línea completa suma puntos. El juego termina cuando los bloques llegan arriba.</div>
          <div className="game-instr-row"><span className="game-instr-icon">⚡</span>La velocidad aumenta cada 5 000 puntos.</div>
          <div className="game-instr-title" style={{marginTop:".3rem"}}>⌨ TECLADO</div>
          <div className="game-instr-row"><span className="game-instr-icon">◀▶</span>Flechas izquierda/derecha para mover.</div>
          <div className="game-instr-row"><span className="game-instr-icon">🔼</span>Flecha arriba → rotar · Abajo → bajar · Espacio → caída instantánea.</div>
          <div className="game-instr-title" style={{marginTop:".3rem"}}>👆 MÓVIL (swipe)</div>
          <div className="game-instr-row"><span className="game-instr-icon">↔</span>Desliza izq/der para mover. Arriba para rotar. Abajo para caída rápida. Toca para rotar.</div>
        </div>
        <div className="game-reward-preview">
          <span className="game-reward-chip xp">+60 XP base</span>
          <span className="game-reward-chip coins">🪙 38 monedas</span>
          <span className="game-reward-chip stat">🟪 INT</span>
          <span className="game-reward-chip stat">🟩 AGI</span>
        </div>
        <button className="btn-gold" onClick={start}>▶ INICIAR</button>
      </div>
    );
  }

  const grid = renderBoard();

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.8rem" }}>
      <div className="tetris-wrap">
        <div
          className="tetris-board"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{ touchAction: "none" }}  /* evita scroll mientras se juega */
        >
          {grid.flat().map((cell, i) => (
            <div
              key={i}
              className={`tetris-cell${cell && cell.active ? " active" : cell && cell.ghost ? " ghost" : cell ? " filled" : ""}`}
              style={cell ? { "--cell-color": cell.color || cell } : {}}
            />
          ))}
        </div>

        <div className="tetris-side">
          <div className="tetris-next">
            <div className="tetris-next-title">SIGUIENTE</div>
            <div className="tetris-next-grid">
              {Array.from({ length: 16 }, (_, i) => {
                const r = Math.floor(i / 4), c = i % 4;
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
            <div className="tetris-info-val" style={{ color: score >= SPEED_STEP_PTS ? "#f5c842" : "var(--text-dim)", fontSize: ".9rem" }}>
              LV {Math.floor(score / SPEED_STEP_PTS) + 1}
            </div>
            <div className="tetris-ctrl">
              <span>← → mover</span>
              <span>↑ rotar</span>
              <span>↓ bajar</span>
              <span>SPC caída</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
