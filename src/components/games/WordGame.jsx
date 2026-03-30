/**
 * WordGame.jsx — Minijuego: WORD CHAOS (ordenar letras)
 * ─────────────────────────────────────────────────────
 * Se muestra una palabra mezclada (scrambled). El jugador debe
 * escribir la palabra correcta antes de que el tiempo se agote.
 *
 * TEMPORIZADOR VISIBLE:
 *   Se muestra una barra de tiempo + contador numérico siempre visible.
 *   La barra cambia de color según el tiempo restante:
 *     > 60%  → verde
 *     > 30%  → naranja
 *     ≤ 30%  → rojo pulsante
 *   Al presionar Enter con respuesta incorrecta se restan 5 segundos
 *   y se muestra una animación de penalización "−5s" en la barra.
 *
 * Mecánica:
 *   • Total: 45 segundos para responder el máximo de palabras
 *   • Cada acierto: 100pts + 20pts × racha consecutiva
 *   • Error (Enter): −5 segundos de penalización, racha se rompe
 *
 * Stats mejoradas: INTELIGENCIA
 *
 * Estilos: MiniGamesScreen.css (.word-box, .word-timer-bar, .word-penalty)
 */
import { useState, useEffect, useRef } from "react";

// Palabras sin tildes para evitar conflictos de acentuación en el teclado móvil.
// La comparación normaliza ambos lados para aceptar versiones con o sin tilde.
const WORDS = [
  "FUERZA","MENTE","LOGRO","MISION","NIVEL","HEROE","PODER",
  "RITMO","ORDEN","RETO","MAGIA","GOLPE","CAMINO","BRILLO",
  "SABER","VISTA","CLAVE","MARCA","VALOR","TURNO",
  "RAPIDO","AGIL","CRECER","LOGRAR","AVANCE","MENTE","FOCO",
];

// Normaliza texto: quita tildes y mayúsculas — comparación robusta en móvil
const normalize = (str) =>
  str.toUpperCase()
     .normalize("NFD")
     .replace(/[\u0300-\u036f]/g, "");

const scramble = (w) => {
  let arr = w.split("");
  // Asegurar que la versión mezclada siempre difiera de la original
  let attempts = 0;
  do { arr.sort(() => Math.random() - 0.5); attempts++; } while (arr.join("") === w && attempts < 20);
  return arr.join("");
};

const TOTAL_TIME = 45;
const PENALTY    = 5; // segundos de penalización por error

export default function WordGame({ onEnd }) {
  const [wordIdx,   setWordIdx]   = useState(0);
  const [current,   setCurrent]   = useState(() => {
    const w = WORDS[0]; return { word: w, sc: scramble(w) };
  });
  const [input,     setInput]     = useState("");
  const [status,    setStatus]    = useState("idle");   // idle | correct | wrong
  const [score,     setScore]     = useState(0);
  const [timer,     setTimer]     = useState(TOTAL_TIME);
  const [running,   setRunning]   = useState(false);
  const [started,   setStarted]   = useState(false);
  const [streak,    setStreak]    = useState(0);
  const [penalty,   setPenalty]   = useState(false);   // animación "−5s"
  const inputRef  = useRef(null);
  const timerRef  = useRef(TOTAL_TIME);

  // Fracción de tiempo restante (0‥1) para la barra
  const fraction = timer / TOTAL_TIME;
  const barColor  = fraction > 0.6 ? "#52c97a" : fraction > 0.3 ? "#f5853a" : "#e05252";

  const nextWord = (idx) => {
    const nIdx = (idx + 1) % WORDS.length;
    setWordIdx(nIdx);
    const w = WORDS[nIdx];
    setCurrent({ word: w, sc: scramble(w) });
    setInput(""); setStatus("idle");
    inputRef.current?.focus();
  };

  const start = () => {
    setStarted(true); setRunning(true);
    inputRef.current?.focus();
  };

  // Tick del temporizador
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setTimer(p => {
        const next = p - 1;
        timerRef.current = next;
        if (next <= 0) { setRunning(false); return 0; }
        return next;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running]);

  // Cuando se acaba el tiempo
  useEffect(() => {
    if (started && !running && timer === 0) onEnd(score);
  }, [running]); // eslint-disable-line react-hooks/exhaustive-deps

  // Verificar respuesta al escribir
  const check = (val) => {
    setInput(val.toUpperCase());
    if (normalize(val) === normalize(current.word)) {
      setScore(p => p + 100 + streak * 20);
      setStreak(p => p + 1);
      setStatus("correct");
      setTimeout(() => nextWord(wordIdx), 300);
    }
  };

  // Enter → penalización si la respuesta es incorrecta
  const onKey = (e) => {
    if (e.key === "Enter" && normalize(input) !== normalize(current.word)) {
      // Restar 5s con mínimo de 1
      setTimer(p => Math.max(1, p - PENALTY));
      setStreak(0);
      setStatus("wrong");
      // Mostrar animación de penalización
      setPenalty(true);
      setTimeout(() => setPenalty(false), 600);
      setTimeout(() => { setStatus("idle"); setInput(""); }, 400);
    }
  };

  if (!started) {
    return (
      <div className="game-start-screen">
        <div className="game-start-hint">Descifra palabras mezcladas antes de que el tiempo se agote.</div>
        <div className="game-instructions">
          <div className="game-instr-title">📋 CÓMO JUGAR</div>
          <div className="game-instr-row"><span className="game-instr-icon">🔀</span>Verás una palabra con sus letras en desorden. Escribe la palabra correcta.</div>
          <div className="game-instr-row"><span className="game-instr-icon">⏱</span>Tienes {TOTAL_TIME} segundos. Cada respuesta correcta da puntos.</div>
          <div className="game-instr-row"><span className="game-instr-icon">❌</span>Un error quita {PENALTY} segundos del cronómetro.</div>
          <div className="game-instr-row"><span className="game-instr-icon">🔤</span>Palabras en español. Los acentos son opcionales — el juego los acepta igual.</div>
          <div className="game-instr-title" style={{marginTop:".3rem"}}>⌨ CONTROLES</div>
          <div className="game-instr-row"><span className="game-instr-icon">⌨</span>Escribe la respuesta y presiona Enter para confirmar.</div>
        </div>
        <div className="game-reward-preview">
          <span className="game-reward-chip xp">+50 XP base</span>
          <span className="game-reward-chip coins">🪙 30 monedas</span>
          <span className="game-reward-chip stat">🟪 INTELIGENCIA</span>
        </div>
        <button className="btn-gold" onClick={start}>▶ INICIAR</button>
      </div>
    );
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"0.8rem", width:"100%", maxWidth:"340px" }}>

      {/* ── Temporizador visible ──────────────────── */}
      <div className="word-timer-wrap">
        <div className="word-timer-row">
          <span className="word-timer-label">TIEMPO</span>
          <span className={`word-timer-value${timer <= TOTAL_TIME * 0.3 ? " danger" : ""}`}>
            {String(Math.floor(timer / 60)).padStart(2,"0")}:{String(timer % 60).padStart(2,"0")}
          </span>
          {penalty && <span className="word-penalty">−{PENALTY}s</span>}
        </div>
        <div className="word-timer-track">
          <div
            className="word-timer-fill"
            style={{
              width: `${fraction * 100}%`,
              background: barColor,
              transition: "width 0.9s linear, background 0.3s ease",
            }}
          />
        </div>
      </div>

      {/* ── Palabra a ordenar ──────────────────────── */}
      <div className="word-box">
        <div className="word-label">ORDENA ESTA PALABRA:</div>
        <div className="scrambled-word">{current.sc}</div>
      </div>

      {/* ── Input de respuesta ─────────────────────── */}
      <div className="word-input-wrap">
        <input
          ref={inputRef}
          className={`word-input${status === "correct" ? " correct" : status === "wrong" ? " wrong" : ""}`}
          value={input}
          onChange={e => check(e.target.value)}
          onKeyDown={onKey}
          placeholder="escribe aquí..."
          autoComplete="off"
          spellCheck="false"
        />
      </div>

      {streak > 1 && <div className="word-streak">🔥 RACHA ×{streak}</div>}

      <div className="word-hint">ENTER para omitir (−{PENALTY}s)</div>
    </div>
  );
}
