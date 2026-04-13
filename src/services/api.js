/**
 * services/api.js — Cliente centralizado del backend RPGLog
 * ─────────────────────────────────────────────────────────
 * URL base:
 *   1) process.env.REACT_APP_API_URL   (CRA / Netlify)
 *   2) http://localhost:3001           (fallback local)
 *
 * Auth: Bearer token en localStorage["rpglog_token"]
 *
 * IMPORTANTE PARA DEPLOY:
 *   El backend en Render necesita CORS_ORIGIN configurado con el dominio
 *   del frontend. En Render → tu servicio backend → Environment:
 *     CORS_ORIGIN=http://localhost:3000,https://tu-frontend.netlify.app
 */

import { TITLES_DATA } from "../data/shop";

const BASE = (process.env.REACT_APP_API_URL || "http://localhost:3001").replace(/\/+$/, "");

console.log("API BASE:", BASE);

// ── Token management ─────────────────────────────────────────────
export const TOKEN_KEY = "rpglog_token";
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// ── Helpers ──────────────────────────────────────────────────────
function buildUrl(path) {
  if (!path) return BASE;
  return `${BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

function isSuccessResponse(res, data) {
  if (!res.ok) return false;

  if (typeof data?.ok === "boolean") return data.ok;

  return true;
}

// ── Base fetch con manejo de errores ─────────────────────────────
async function apiFetch(path, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  let res;
  try {
    res = await fetch(buildUrl(path), {
      ...options,
      headers,
    });
  } catch (err) {
    const msg =
      err?.message?.includes("Failed to fetch") ||
      err?.message?.includes("NetworkError") ||
      err?.message?.includes("ERR_CONNECTION_REFUSED")
        ? `No se pudo conectar al servidor. BASE actual: ${BASE}`
        : err?.message || "Error de red al conectar con el servidor.";
    throw new Error(msg);
  }

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  let data = {};
  try {
    data = isJson ? await res.json() : {};
  } catch (_) {
    data = {};
  }

  if (!isSuccessResponse(res, data)) {
    if (res.status === 401) {
      try {
        clearToken();
      } catch (_) {}

      try {
        window.dispatchEvent(new CustomEvent("rpglog:unauthorized"));
      } catch (_) {}
    }

    throw new Error(
      data?.message ||
        data?.error ||
        data?.msg ||
        `Error ${res.status}${res.statusText ? `: ${res.statusText}` : ""}`
    );
  }

  return data;
}

// ── Mapeo backend → frontend ─────────────────────────────────────
const STAT_META = {
  str: { name: "FUERZA", icon: "🟥", color: "#e05252" },
  res: { name: "RESISTENCIA", icon: "🟦", color: "#5b8dd9" },
  agi: { name: "AGILIDAD", icon: "🟩", color: "#52c97a" },
  int: { name: "INTELIGENCIA", icon: "🟪", color: "#a855f7" },
  cre: { name: "CREATIVIDAD", icon: "🟨", color: "#f5c842" },
  com: { name: "COMUNICACIÓN", icon: "🟧", color: "#f5853a" },
};

export function mapProfile(profile, user) {
  const equipped = TITLES_DATA.find((t) => t.id === profile?.equippedTitleId) || TITLES_DATA[0];

  return {
    name: user?.username ?? "Héroe",
    avatar: user?.avatar || "🧙",
    title: equipped?.preview || '"Aventurero"',
    level: profile?.level ?? 1,
    xp: profile?.xpCurrentLevel ?? 0,
    xpMax: profile?.xpNextLevel ?? 300,
    birthdate: user?.birthdate
      ? new Date(user.birthdate).toISOString().split("T")[0]
      : "",
  };
}

export function mapStats(stats = []) {
  const statKeys = ["agi", "com", "cre", "int", "res", "str"];
  const byKey = Object.fromEntries((stats || []).map((s) => [s.statKey, s]));

  return statKeys.map((key) => {
    const meta = STAT_META[key] || {};
    const s = byKey[key] || {};

    return {
      id: key,
      name: meta.name,
      icon: meta.icon,
      color: meta.color,
      lv: s.level ?? 1,
      xp: s.xp ?? 0,
      max: s.xpMax ?? 200,
    };
  });
}

export function mapQuest(q) {
  const firstStat = q.statRewards?.[0];
  const statKey = firstStat?.statKey || null;
  const meta = statKey ? STAT_META[statKey] || {} : {};

  return {
    _id: q._id,
    id: q._id,
    name: q.title,
    desc: q.description || "",
    stat: meta.name || "GENERAL",
    icon: meta.icon || "⚔️",
    color: meta.color || "#e8e0d0",
    xp: q.globalXpReward ?? q.xpReward ?? 10,
    coins: q.coinReward ?? 0,
    progress: 0,
    total: 1,
    unit: "vez",
    done: q.completed || false,
    type: q.type,
    dayKey: q.dayKey || null,
    photoEvidenceEnabled: q.photoEvidenceEnabled || false,
    photoBonusApplied: q.photoBonusApplied || false,
    photoBonusXp: q.photoBonusXp || 0,
    photoBonusCoins: q.photoBonusCoins || 0,
    locationEvidenceEnabled: q.locationEvidenceEnabled || false,
    locationBonusApplied: q.locationBonusApplied || false,
    locationBonusXp: q.locationBonusXp || 0,
    locationBonusCoins: q.locationBonusCoins || 0,
  };
}

// ════════════════════════════════════════════════════════════════
// Auth API
// ════════════════════════════════════════════════════════════════
export const authApi = {
  async register({ username, email, password, birthdate, avatar }) {
    const data = await apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password, birthdate, avatar }),
    });

    const token = data?.token || data?.data?.token;
    if (token) setToken(token);

    return data;
  },

  async login({ email, password }) {
    const data = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const token = data?.token || data?.data?.token;
    if (token) setToken(token);

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

  async buyTitle({ titleId, price }) {
    return apiFetch("/api/progress/buy-title", {
      method: "POST",
      body: JSON.stringify({ titleId, price }),
    });
  },

  async equipTitle({ titleId }) {
    return apiFetch("/api/progress/equip-title", {
      method: "POST",
      body: JSON.stringify({ titleId }),
    });
  },

  async buyCustomSlot({ slotIdx, price }) {
    return apiFetch("/api/progress/buy-custom-slot", {
      method: "POST",
      body: JSON.stringify({ slotIdx, price }),
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
      body: JSON.stringify({ photoTaken: true }),
    });
  },

  async submitLocationEvidence(questId, coords) {
    return apiFetch(`/api/quests/${questId}/evidence/location`, {
      method: "POST",
      body: JSON.stringify({
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy || null,
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
    slotIdx,
    durationMs,
    startedAt,
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
      body: JSON.stringify({
        title,
        description,
        xpReward,
        globalXpReward,
        coinReward,
        statRewards,
        slotIdx,
        durationMs,
        startedAt,
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