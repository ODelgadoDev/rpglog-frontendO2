/**
 * MiniGamesScreen.jsx - Pantalla de minijuegos
 * FIXES:
 *  - Intentos se guardan por userId (no global) → cada cuenta tiene sus propios intentos
 *  - Máximo 3 intentos, cooldown de 3 horas
 *  - Al agotar intentos al reintentar, regresa al lobby con mensaje claro
 */
import { useEffect, useMemo, useState } from "react";
import "../styles/MiniGamesScreen.css";
import { GAMES } from "../data/games";
import GameWrapper from "../components/GameWrapper";

const MAX_ATTEMPTS = 3;
const COOLDOWN_MS  = 3 * 60 * 60 * 1000; // 3 horas

function getAttemptsKey(userId) {
  // ✅ FIX: clave por usuario para no mezclar intentos entre cuentas
  return `rpglog_game_attempts_${userId || "guest"}`;
}

function normalizeAttempts(attempts) {
  const now = Date.now();
  return Object.fromEntries(
    Object.entries(attempts || {}).filter(([, entry]) => {
      if (!entry) return false;
      return now - entry.resetAt < COOLDOWN_MS && entry.count > 0;
    })
  );
}

function getGameAttemptInfo(attempts, gameId) {
  const entry = attempts[gameId];
  if (!entry) return { count: 0, canPlay: true, timeLeft: 0 };
  const timeSinceReset = Date.now() - entry.resetAt;
  if (timeSinceReset >= COOLDOWN_MS) return { count: 0, canPlay: true, timeLeft: 0 };
  return {
    count:    entry.count,
    canPlay:  entry.count < MAX_ATTEMPTS,
    timeLeft: COOLDOWN_MS - timeSinceReset,
  };
}

function consumeAttempt(attempts, gameId) {
  const sanitized = normalizeAttempts(attempts);
  const info      = getGameAttemptInfo(sanitized, gameId);
  if (!info.canPlay) return { nextAttempts: sanitized, canPlay: false, info };

  const now     = Date.now();
  const current = sanitized[gameId];
  const nextAttempts = {
    ...sanitized,
    [gameId]: current
      ? { count: current.count + 1, resetAt: current.resetAt }
      : { count: 1, resetAt: now },
  };
  return { nextAttempts, canPlay: true, info: getGameAttemptInfo(nextAttempts, gameId) };
}

function formatTimeLeft(ms) {
  if (ms <= 0) return "00:00:00";
  const totalSec = Math.floor(ms / 1000);
  const hrs  = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  return `${String(hrs).padStart(2,"0")}:${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;
}

const GamesLobby = ({ onSelect, attempts, statusMessage }) => (
  <div className="minigames-page">
    <div>
      <div className="mg-header">
        <span className="mg-title">🎮 MINI JUEGOS</span>
        <div className="mg-line" />
      </div>
      <div className="mg-subtitle">
        Juega para ganar XP y monedas extra. Cada juego entrena un atributo distinto.
        Tienes <strong>{MAX_ATTEMPTS} intentos</strong> por juego. El cooldown dura 3 horas.
      </div>
      {statusMessage && (
        <div style={{ marginTop:".7rem", fontFamily:"var(--pixel)", fontSize:".38rem", color:"var(--orange)", letterSpacing:".04em" }}>
          {statusMessage}
        </div>
      )}
      <div className="games-grid">
        {GAMES.map((g) => {
          const hasGrad   = !!g.color2;
          const cardStyle = hasGrad
            ? { "--gc": g.color, "--gc2": g.color2, background: `linear-gradient(135deg, color-mix(in srgb, ${g.color} 10%, transparent), color-mix(in srgb, ${g.color2} 10%, transparent))` }
            : { "--gc": g.color };
          const info = getGameAttemptInfo(attempts, g.id);

          return (
            <div
              key={g.id}
              className={`game-card${hasGrad ? " game-card-multi" : ""}${!info.canPlay ? " game-card-locked" : ""}`}
              style={cardStyle}
              onClick={() => onSelect(g)}
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
                    const c = i === 0 ? g.color : g.color2 || g.color;
                    return <span key={s} className="game-stat-tag" style={{ "--gc": c }}>{s}</span>;
                  })}
                </div>
                <span className="game-rewards">+{g.xp} XP 🪙 {g.coins}</span>
              </div>
              <div className="game-attempts-bar">
                {info.canPlay ? (
                  <span className="game-attempts-text">
                    {MAX_ATTEMPTS - info.count}/{MAX_ATTEMPTS} intentos
                  </span>
                ) : (
                  <span className="game-attempts-cooldown">
                    ⏳ {formatTimeLeft(info.timeLeft)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

export default function MiniGamesScreen({ onGameDone, userId }) {
  // ✅ FIX: clave de intentos por usuario
  const attemptsKey = getAttemptsKey(userId);

  const [activeGame, setActiveGame] = useState(null);
  const [attempts,   setAttempts]   = useState(() => {
    try {
      const raw = localStorage.getItem(attemptsKey);
      if (!raw) return {};
      return JSON.parse(raw) || {};
    } catch { return {}; }
  });
  const [statusMessage, setStatusMessage] = useState("");

  // Persistir intentos en localStorage
  useEffect(() => {
    try { localStorage.setItem(attemptsKey, JSON.stringify(attempts || {})); }
    catch {}
  }, [attempts, attemptsKey]);

  // Limpiar intentos expirados cada segundo
  useEffect(() => {
    const id = setInterval(() => {
      setAttempts(prev => {
        const next = normalizeAttempts(prev);
        return JSON.stringify(next) === JSON.stringify(prev) ? prev : next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const selectGame = (game) => {
    const { nextAttempts, canPlay, info } = consumeAttempt(attempts, game.id);
    if (!canPlay) {
      setAttempts(normalizeAttempts(attempts));
      setStatusMessage(`Sin intentos para ${game.name}. Vuelve en ${formatTimeLeft(info.timeLeft)}.`);
      return;
    }
    setAttempts(nextAttempts);
    setStatusMessage("");
    setActiveGame(game);
  };

  const handleReplayRequest = (game) => {
    const { nextAttempts, canPlay, info } = consumeAttempt(attempts, game.id);
    if (!canPlay) {
      setAttempts(normalizeAttempts(attempts));
      setActiveGame(null);
      setStatusMessage(`Agotaste los intentos de ${game.name}. Vuelve en ${formatTimeLeft(info.timeLeft)}.`);
      return false;
    }
    setAttempts(nextAttempts);
    setStatusMessage("");
    return true;
  };

  const handleGameDone = (xp, coins, stat, gameId, score) => {
    onGameDone && onGameDone(xp, coins, stat, gameId, score);
  };

  const currentAttempts = useMemo(() => normalizeAttempts(attempts), [attempts]);

  if (activeGame) {
    return (
      <GameWrapper
        game={activeGame}
        onBack={() => setActiveGame(null)}
        onGameDone={handleGameDone}
        onReplayRequest={handleReplayRequest}
      />
    );
  }

  return (
    <GamesLobby
      onSelect={selectGame}
      attempts={currentAttempts}
      statusMessage={statusMessage}
    />
  );
}
