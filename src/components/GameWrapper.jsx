/**
 * GameWrapper.jsx — Contenedor genérico para minijuegos
 * ─────────────────────────────────────────────────────
 * Envuelve cualquier minijuego con topbar, HUD y ResultScreen.
 *
 * Fases:
 *   "playing" — juego activo
 *   "result"  — ResultScreen con las recompensas
 *
 * Propaga recompensas hacia HomeScreen via onGameDone:
 *   Al terminar el juego → ResultScreen calcula XP y monedas →
 *   llama onGameDone(xp, coins, stat) → GameWrapper lo sube a
 *   MiniGamesScreen → HomeScreen actualiza user.xp, stats y coins.
 *
 * Props:
 *   game        — objeto del juego { id, name, icon, xp, coins, stat }
 *   onBack      — regresa al lobby
 *   onGameDone(xp, coins, stat) — propaga recompensas hacia HomeScreen
 *
 * Estilos: MiniGamesScreen.css (.game-screen, .game-topbar, .game-area)
 */
import { useState } from "react";
import OsuGame     from "./games/OsuGame";
import WordGame    from "./games/WordGame";
import SimonGame   from "./games/SimonGame";
import TetrisGame  from "./games/TetrisGame";
import RhythmGame  from "./games/RhythmGame";
import ResultScreen from "./games/ResultScreen";

// Mapa id → componente del juego
const GAME_COMPONENTS = {
  osu:    OsuGame,
  word:   WordGame,
  simon:  SimonGame,
  tetris: TetrisGame,
  rhythm: RhythmGame,
};

export default function GameWrapper({ game, onBack, onGameDone }) {
  const [phase, setPhase] = useState("playing"); // "playing" | "result"
  const [score, setScore] = useState(0);
  const [key,   setKey]   = useState(0);         // fuerza remount al reiniciar

  const GameComp = GAME_COMPONENTS[game.id];

  const handleEnd = (s) => {
    setScore(s);
    setPhase("result");
  };

  // Reiniciar: nueva partida sin volver al lobby (no aplica recompensas de nuevo)
  const handleReplay = () => {
    setKey(p => p + 1);
    setPhase("playing");
    setScore(0);
  };

  return (
    <div className="game-screen">
      {/* ── Topbar ── */}
      <div className="game-topbar">
        <button className="game-back" onClick={onBack}>← SALIR</button>
        <div className="game-title-bar">{game.icon} {game.name}</div>
        <div className="game-hud">
          {phase === "playing" && game.id !== "tetris" && game.id !== "simon" && (
            <div className="hud-item">
              <div className="hud-label">PUNTOS</div>
              <div className="hud-val">{score}</div>
            </div>
          )}
        </div>
      </div>

      {/* ── Área de juego / resultados ── */}
      <div className="game-area">
        {phase === "playing" ? (
          <GameComp key={key} onEnd={handleEnd} />
        ) : (
          <ResultScreen
            game={game}
            score={score}
            onReplay={handleReplay}
            onBack={onBack}
            onGameDone={onGameDone}  // propaga XP+monedas hacia HomeScreen
          />
        )}
      </div>
    </div>
  );
}
