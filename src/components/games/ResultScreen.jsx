/**
 * ResultScreen.jsx — Pantalla de resultados post-juego
 * ─────────────────────────────────────────────────────
 * Se muestra al terminar una partida. Calcula las recompensas,
 * las muestra visualmente y propaga el resultado hacia HomeScreen.
 *
 * Fórmula de recompensas (escalan con el score):
 *   xpFinal    = round(game.xp    × (1 + score / 200))
 *   coinsFinal = round(game.coins × (1 + score / 300))
 *
 * Al montarse llama onGameDone(xpFinal, coinsFinal, game.stat)
 * una sola vez para que HomeScreen actualice el estado global.
 *
 * Props:
 *   game        — objeto del juego { id, name, icon, xp, coins, stat }
 *   score       — puntuación obtenida
 *   onReplay    — reinicia la partida
 *   onBack      — regresa al lobby
 *   onGameDone(xp, coins, stat) — callback al HomeScreen (se llama una vez al montar)
 *
 * Estilos: MiniGamesScreen.css (.result-screen, .result-reward-val, etc.)
 */
import { useEffect, useRef } from "react";

export default function ResultScreen({ game, score, onReplay, onBack, onGameDone }) {
  // XP nerfada: multiplicador reducido (÷800 en vez de ÷200), cap de 2× el base
  // Esto evita que los juegos superen la XP de las misiones reales
  const xpRaw      = Math.round(game.xp    * (1 + score / 800));
  const xpFinal    = Math.min(xpRaw, Math.round(game.xp * 2));   // máx ×2
  const coinsFinal = Math.min(
    Math.round(game.coins * (1 + score / 1000)),
    Math.round(game.coins * 1.5)                                   // máx ×1.5
  );

  // Llamar onGameDone UNA sola vez al montar (evita doble aplicación si re-render)
  const called = useRef(false);
  useEffect(() => {
    if (!called.current && onGameDone) {
      called.current = true;
      onGameDone(xpFinal, coinsFinal, game.stat, game.id, score);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Rango del score para mostrar medalla
  const medal =
    score >= 800 ? { icon: "🥇", label: "¡EXCELENTE!" } :
    score >= 400 ? { icon: "🥈", label: "¡BIEN HECHO!" } :
                   { icon: "🥉", label: "COMPLETADO"   };

  return (
    <div className="result-screen">
      <div className="result-medal">{medal.icon}</div>
      <div className="result-title">{medal.label}</div>
      <div className="result-game-name">{game.icon} {game.name}</div>

      {/* Puntuación */}
      <div className="result-score-wrap">
        <div className="result-score-label">PUNTUACIÓN</div>
        <div className="result-score-val">{score.toLocaleString()}</div>
      </div>

      {/* Recompensas ganadas */}
      <div className="result-rewards-title">▸ RECOMPENSAS OBTENIDAS</div>
      <div className="result-rewards">
        <div className="result-reward">
          <div className="result-reward-val xp">+{xpFinal} XP</div>
          <div className="result-reward-lbl">EXPERIENCIA</div>
          <div className="result-reward-stat">{game.stat}</div>
        </div>
        <div className="result-reward">
          <div className="result-reward-val coins">🪙 +{coinsFinal}</div>
          <div className="result-reward-lbl">MONEDAS</div>
          <div className="result-reward-stat">MONEDERO</div>
        </div>
      </div>

      {/* Barra de XP animada — visual, no funcional */}
      <div className="result-xp-wrap">
        <div className="result-xp-label">XP SUMADA AL PERFIL</div>
        <div className="result-xp-track">
          <div className="result-xp-fill" />
        </div>
      </div>

      <div className="result-actions">
        <button className="btn-gold"    onClick={onReplay}>▶ JUGAR DE NUEVO</button>
        <button className="btn-outline" onClick={onBack}>← VOLVER</button>
      </div>
    </div>
  );
}
