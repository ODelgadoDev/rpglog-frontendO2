/**
 * MiniGamesScreen.jsx — Pantalla de minijuegos
 * ─────────────────────────────────────────────────────
 * Lobby de juegos + lanzador. Puente entre HomeScreen y GameWrapper.
 *
 * ── LÍMITE DE PARTIDAS ───────────────────────────────────────────
 *   MAX_PLAYS = 3 partidas por juego cada 24h (usuarios normales).
 *   Cada tarjeta muestra: "▶ 3/3" (libre) o "🔒 HH:MM:SS" (bloqueado).
 *   El indicador usa font-size grande (.50rem) para visibilidad en móvil.
 *
 * ── SUPERUSUARIO ─────────────────────────────────────────────────
 *   Los superusuarios (isSuperUser = true) no tienen límite de partidas.
 *   Se activa desde Perfil → toggle "MODO SUPERUSUARIO".
 *   Badge "⭐ SUPERUSUARIO — sin límite" visible en el lobby.
 *
 * ── XP NERFADA ───────────────────────────────────────────────────
 *   Los juegos dan menos XP que las misiones para mantener el balance.
 *   Fórmula: xpFinal = min(xpBase × (1 + score/800), xpBase × 2)
 *   Monedas:  coinsFinal = min(coinsBase × (1 + score/1000), coinsBase × 1.5)
 *
 * Props:
 *   onGameDone(xp, coins, stat, gameId, score) — propagado a HomeScreen
 *   gamePlays   — { [gameId]: { count, resetAt } } desde localStorage
 *   setGamePlays — actualiza el estado de partidas jugadas
 *   isSuperUser  — sin límite de partidas
 */
import { useState } from "react";
import "../styles/MiniGamesScreen.css";
import { GAMES } from "../data/games";
import GameWrapper from "../components/GameWrapper";

const MAX_PLAYS   = 3;
const MS_24H      = 24 * 60 * 60 * 1000;

function fmtTimeLeft(ms) {
  if (ms <= 0) return "00:00:00";
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sc = s % 60;
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(sc).padStart(2,"0")}`;
}

function getPlayInfo(gamePlays, gameId) {
  const now  = Date.now();
  const data = gamePlays?.[gameId] || { count: 0, resetAt: now };
  // si pasaron 24h → resetear
  if (now - data.resetAt >= MS_24H) return { count: 0, resetAt: now, timeLeft: 0 };
  return {
    count:    data.count,
    resetAt:  data.resetAt,
    timeLeft: Math.max(0, MS_24H - (now - data.resetAt)),
  };
}

// ── Lobby ─────────────────────────────────────────────────────────
function GamesLobby({ onSelect, gamePlays, isSuperUser }) {
  return (
    <div className="minigames-page">
      <div>
        <div className="mg-header">
          <span className="mg-title">🎮 MINI JUEGOS</span>
          <div className="mg-line" />
        </div>
        <div className="mg-subtitle">
          Juega para ganar XP y monedas extra. Cada juego entrena un atributo distinto.
          {!isSuperUser && (
            <span className="mg-limit-note"> · Máximo {MAX_PLAYS} partidas por juego cada 24h.</span>
          )}
          {isSuperUser && (
            <span className="mg-super-note"> · ⭐ SUPERUSUARIO — sin límite de partidas.</span>
          )}
        </div>
        <div className="games-grid">
          {GAMES.map(g => {
            const { count, timeLeft } = getPlayInfo(gamePlays, g.id);
            const playsLeft = isSuperUser ? Infinity : Math.max(0, MAX_PLAYS - count);
            const isLocked  = !isSuperUser && playsLeft === 0;
            const hasGrad   = !!g.color2;
            const cardStyle = hasGrad
              ? { "--gc": g.color, "--gc2": g.color2, background: `linear-gradient(135deg, color-mix(in srgb, ${g.color} 10%, transparent), color-mix(in srgb, ${g.color2} 10%, transparent))` }
              : { "--gc": g.color };

            return (
              <div
                key={g.id}
                className={`game-card${hasGrad ? " game-card-multi" : ""}${isLocked ? " game-card-locked" : ""}`}
                style={cardStyle}
                onClick={() => !isLocked && onSelect(g)}
              >
                <div className="game-card-top">
                  <span className="game-icon">{g.icon}</span>
                  <span className="game-diff">{g.diff}</span>
                </div>
                <div className="game-name">{g.name}</div>
                <div className="game-desc">{g.desc}</div>
                <div className="game-footer">
                  <div className="game-stat-tags">
                    {(g.stats || [g.stat]).map((s, i) => {
                      const c = i === 0 ? g.color : (g.color2 || g.color);
                      return <span key={s} className="game-stat-tag" style={{ "--gc": c }}>{s}</span>;
                    })}
                  </div>
                  {!isSuperUser && (
                    <span className={`game-plays-left${isLocked ? " locked" : playsLeft === 1 ? " warn" : ""}`}>
                      {isLocked
                        ? `🔒 ${fmtTimeLeft(timeLeft)}`
                        : `▶ ${playsLeft}/${MAX_PLAYS}`}
                    </span>
                  )}
                  {isSuperUser && <span className="game-rewards">+{g.xp} XP 🪙 {g.coins}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────
export default function MiniGamesScreen({ onGameDone, gamePlays = {}, setGamePlays, isSuperUser = false }) {
  const [activeGame, setActiveGame] = useState(null);

  const handleSelectGame = (g) => {
    const { count, resetAt, timeLeft } = getPlayInfo(gamePlays, g.id);
    if (!isSuperUser && count >= MAX_PLAYS && timeLeft > 0) return;
    setActiveGame(g);
  };

  const handleGameDone = (xp, coins, stat, gameId, score) => {
    // Registrar partida jugada
    if (setGamePlays && gameId) {
      setGamePlays(prev => {
        const now = Date.now();
        const existing = prev?.[gameId] || { count: 0, resetAt: now };
        const reset = now - existing.resetAt >= MS_24H;
        return {
          ...prev,
          [gameId]: {
            count:   reset ? 1 : existing.count + 1,
            resetAt: reset ? now : existing.resetAt,
          },
        };
      });
    }
    if (onGameDone) onGameDone(xp, coins, stat, gameId, score);
  };

  if (activeGame) {
    return (
      <GameWrapper
        game={activeGame}
        onBack={() => setActiveGame(null)}
        onGameDone={handleGameDone}
      />
    );
  }

  return (
    <GamesLobby
      onSelect={handleSelectGame}
      gamePlays={gamePlays}
      isSuperUser={isSuperUser}
    />
  );
}
