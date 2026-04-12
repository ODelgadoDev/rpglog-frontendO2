/**
 * services/api.js — Cliente centralizado del backend RPGLog
 * ─────────────────────────────────────────────────────────
 * URL base: import.meta.env.VITE_API_URL (.env) → https://rpglog-backend.onrender.com
 * Auth:     Bearer token en localStorage["rpglog_token"]
 *
 * IMPORTANTE PARA DEPLOY:
 *   El backend en Render necesita CORS_ORIGIN configurado con el dominio
 *   del frontend. En Render → tu servicio backend → Environment:
 *     CORS_ORIGIN = https://tu-frontend.onrender.com,http://localhost:3000
 *
 * Si el backend devuelve error CORS, la app funciona en modo local
 * (localStorage) sin datos del servidor.
 */

function getBaseUrl() {
  if (typeof process !== "undefined") {
    if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;
    if (process.env.VITE_API_URL) return process.env.VITE_API_URL;
  }

  try {
    if (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) {
      return import.meta.env.VITE_API_URL;
    }
    if (typeof import.meta !== "undefined" && import.meta.env?.REACT_APP_API_URL) {
      return import.meta.env.REACT_APP_API_URL;
    }
  } catch (_) {}

  return "http://localhost:3001";
}

const BASE = getBaseUrl();
// ── Token management ─────────────────────────────────────────────
export const TOKEN_KEY   = "rpglog_token";
export const getToken    = ()      => localStorage.getItem(TOKEN_KEY);
export const setToken    = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken  = ()      => localStorage.removeItem(TOKEN_KEY);

// ── Base fetch con manejo de CORS y errores ──────────────────────
async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  let res;
  try {
    res = await fetch(`${BASE}${path}`, { ...options, headers });
  } catch (err) {
    // Error de red / CORS bloqueado por el navegador
    const msg = err.message?.includes("Failed to fetch")
      ? "No se pudo conectar al servidor. Verifica que el backend esté activo y que CORS_ORIGIN incluya este dominio."
      : err.message;
    throw new Error(msg);
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok || !data.ok) {
    // Si el backend responde 401, limpiar token y avisar a la app
    if (res.status === 401) {
      try { clearToken(); } catch (_) {}
      try { window.dispatchEvent(new CustomEvent("rpglog:unauthorized")); } catch (_) {}
    }
    throw new Error(data.message || `Error ${res.status}`);
  }
  return data;
}

// ── Mapeo backend → frontend ─────────────────────────────────────
const STAT_META = {
  str: { name: "FUERZA",        icon: "🟥", color: "#e05252" },
  res: { name: "RESISTENCIA",   icon: "🟦", color: "#5b8dd9" },
  agi: { name: "AGILIDAD",      icon: "🟩", color: "#52c97a" },
  int: { name: "INTELIGENCIA",  icon: "🟪", color: "#a855f7" },
  cre: { name: "CREATIVIDAD",   icon: "🟨", color: "#f5c842" },
  com: { name: "COMUNICACIÓN",  icon: "🟧", color: "#f5853a" },
};

export function mapProfile(profile, user) {
  return {
    name:   user?.username  ?? "Héroe",
    avatar: "🧙",
    title:  profile?.equippedTitleId ? `"${profile.equippedTitleId}"` : '"Aventurero"',
    level:  profile?.level          ?? 1,
    xp:     profile?.xpCurrentLevel ?? 0,
    xpMax:  profile?.xpNextLevel    ?? 300,
    birthdate: user?.birthdate ? new Date(user.birthdate).toISOString().split("T")[0] : "",
  };
}

export function mapStats(stats = []) {
  const statKeys = ["agi", "com", "cre", "int", "res", "str"];
  const byKey = Object.fromEntries((stats || []).map(s => [s.statKey, s]));
  return statKeys.map(key => {
    const meta = STAT_META[key] || {};
    const s    = byKey[key] || {};
    return {
      id:    key,
      name:  meta.name,
      icon:  meta.icon,
      color: meta.color,
      lv:    s.level  ?? 1,
      xp:    s.xp     ?? 0,
      max:   s.xpMax  ?? 200,
    };
  });
}

export function mapQuest(q) {
  const firstStat = q.statRewards?.[0];
  const statKey   = firstStat?.statKey || null;
  const meta      = statKey ? (STAT_META[statKey] || {}) : {};
  return {
    _id:   q._id,
    id:    q._id,
    name:  q.title,
    desc:  q.description || "",
    stat:  meta.name  || "GENERAL",
    icon:  meta.icon  || "⚔️",
    color: meta.color || "#e8e0d0",
    xp:        q.globalXpReward ?? q.xpReward ?? 10,
    coins:     q.coinReward ?? 0,
    progress:  0,
    total:     1,
    unit:      "vez",
    done:      q.completed || false,
    type:      q.type,
    dayKey:    q.dayKey || null,
    photoEvidenceEnabled:  q.photoEvidenceEnabled   || false,
    photoBonusApplied:     q.photoBonusApplied       || false,
    photoBonusXp:          q.photoBonusXp            || 0,
    photoBonusCoins:       q.photoBonusCoins         || 0,
    locationEvidenceEnabled: q.locationEvidenceEnabled || false,
    locationBonusApplied:    q.locationBonusApplied    || false,
    locationBonusXp:         q.locationBonusXp         || 0,
    locationBonusCoins:      q.locationBonusCoins       || 0,
  };
}

// ════════════════════════════════════════════════════════════════
// Auth API
// ════════════════════════════════════════════════════════════════
export const authApi = {
  async register({ username, email, password }) {
    const data = await apiFetch("/api/auth/register", {
      method: "POST",
      body:   JSON.stringify({ username, email, password }),
    });
    if (data.token) setToken(data.token);
    return data;
  },

  async login({ email, password }) {
    const data = await apiFetch("/api/auth/login", {
      method: "POST",
      body:   JSON.stringify({ email, password }),
    });
    if (data.token) setToken(data.token);
    return data;
  },

  async me() {
    return apiFetch("/api/auth/me");
  },

  async updateProfile(payload) {
    return apiFetch("/api/auth/profile", {
      method: "PATCH",
      body: JSON.stringify(payload || {}),
    });
  },

  logout() {
    clearToken();
  },
};

// ════════════════════════════════════════════════════════════════
// Progress API
// ════════════════════════════════════════════════════════════════
export const progressApi = {
  async getSummary() {
    return apiFetch("/api/progress/summary");
  },

  async addGameReward({ xp, coins, statKey }) {
    return apiFetch("/api/progress/game-reward", {
      method: "POST",
      body: JSON.stringify({ xp, coins, statKey }),
    });
  },

  async spendCoins({ amount }) {
    return apiFetch("/api/progress/spend-coins", {
      method: "POST",
      body: JSON.stringify({ amount }),
    });
  },
};

// ════════════════════════════════════════════════════════════════
// Quests API
// ════════════════════════════════════════════════════════════════
export const questsApi = {
  async list() {
    return apiFetch("/api/quests/");
  },

  async seedDaily() {
    return apiFetch("/api/quests/seed-daily", { method: "POST" });
  },

  async complete(questId) {
    return apiFetch(`/api/quests/${questId}/complete`, { method: "PATCH" });
  },

  async submitPhotoEvidence(questId) {
    return apiFetch(`/api/quests/${questId}/evidence/photo`, {
      method: "POST",
      body:   JSON.stringify({ photoTaken: true }),
    });
  },

  async submitLocationEvidence(questId, coords) {
    return apiFetch(`/api/quests/${questId}/evidence/location`, {
      method: "POST",
      body:   JSON.stringify({
        latitude:   coords.latitude,
        longitude:  coords.longitude,
        accuracy:   coords.accuracy   || null,
        capturedAt: coords.capturedAt || new Date().toISOString(),
      }),
    });
  },

  async listCustom() {
    return apiFetch("/api/quests/custom");
  },

  async createCustom({
    title,
    description,
    xpReward,
    globalXpReward,
    coinReward,
    statRewards,
    photoEvidenceEnabled,
    locationEvidenceEnabled,
    photoBonusXp,
    photoBonusCoins,
    photoBonusStatRewards,
    locationBonusXp,
    locationBonusCoins,
    locationBonusStatRewards,
  }) {
    return apiFetch("/api/quests/custom", {
      method: "POST",
      body:   JSON.stringify({
        title,
        description,
        xpReward,
        globalXpReward,
        coinReward,
        statRewards,
        photoEvidenceEnabled,
        locationEvidenceEnabled,
        photoBonusXp,
        photoBonusCoins,
        photoBonusStatRewards,
        locationBonusXp,
        locationBonusCoins,
        locationBonusStatRewards,
      }),
    });
  },

  async deleteCustom(questId) {
    return apiFetch(`/api/quests/custom/${questId}`, { method: "DELETE" });
  },
};
