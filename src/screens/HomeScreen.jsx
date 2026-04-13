/**
 * HomeScreen.jsx — FIXED
 *
 * Fixes aplicados:
 *  1. Wallet: buildWalletEntry garantiza coinsChange como número
 *  2. Wallet: coins siempre tiene fallback a 0 (nunca undefined)
 *  3. PWA: integra usePWAInstall + pasa props a Navbar y PWAInstallBanner
 *  4. weeklyCoins: cálculo seguro con fallback a 0
 *  5. Persistencia real de títulos comprados y equipados desde backend
 *  6. Persistencia real de slots custom desde backend
 *  7. Recarga de misiones custom activas desde backend
 *  8. Notificaciones y récords persistidos en localStorage real
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "../styles/globals.css";
import "../styles/HomeScreen.css";

import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import StatCards from "../components/StatCards";
import ProgressSection from "../components/ProgressSection";
import MissionsScreen from "./MissionsScreen";
import MiniGamesScreen from "./MiniGamesScreen";
import ShopScreen from "./ShopScreen";
import SettingsScreen from "./SettingsScreen";
import OfflineBanner from "../components/OfflineBanner";
import PWAInstallBanner from "../components/PWAInstallBanner";

import { NOTIFICATIONS_DATA, NOTIF_SETTINGS } from "../data/settings";
import { INITIAL_STATS } from "../data/constants";
import { TITLES_DATA } from "../data/shop";
import { mapProfile, mapStats, progressApi, questsApi, authApi } from "../services/api";
import { useOfflineSync } from "../hooks/useOfflineSync";
import { subscribeToPush } from "../services/pushNotifications";
import { useAuth } from "../contexts/AuthContext";
import { usePWAInstall } from "../hooks/usePWAInstall";

const sanitize = (name) => (name || "user").toLowerCase().replace(/\s+/g, "_");

const lsNotifs = (u) => `rpglog_notifs_${u}`;
const lsNotifPrefs = (u) => `rpglog_notif_prefs_${u}`;
const lsRecords = (u) => `rpglog_records_${u}`;

function lsGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function lsSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function applyXpGain(currentXp, gained, currentMax, currentLevel, maxMult) {
  let xp = currentXp + gained;
  let level = currentLevel;
  let max = currentMax;
  while (xp >= max) {
    xp -= max;
    level++;
    max = Math.round(max * maxMult);
  }
  return { newXp: xp, newLevel: level, newMax: max };
}

const buildNewUser = (name) => ({
  name,
  avatar: "🧙",
  title: '"Aventurero"',
  level: 1,
  xp: 0,
  xpMax: 300,
  birthdate: "",
});

function nowLabel() {
  const d = new Date();
  return `HOY ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function formatWalletDate(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return `HOY ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  }
  return date
    .toLocaleString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(",", "");
}

function buildWalletEntry({ icon, label, amount = "", coinsChange, timestamp = Date.now(), color }) {
  const safeChange = Number(coinsChange ?? 0);
  const absCoins = Math.abs(safeChange);
  return {
    id: `${timestamp}_${Math.random().toString(36).slice(2, 8)}`,
    icon: icon ?? "🪙",
    label: label ?? "Transacción",
    amount: amount ?? "",
    date: formatWalletDate(timestamp),
    coins: `${safeChange >= 0 ? "+" : "-"}${absCoins.toLocaleString()}🪙`,
    coinsChange: safeChange,
    timestamp,
    color: color || (safeChange >= 0 ? "#52c97a" : "#e05252"),
  };
}

let notifCounter = Date.now();
const nextNotifId = () => ++notifCounter;

export default function HomeScreen({ onLogout }) {
  const { user: authUser, profile: authProfile, stats: authStats } = useAuth();
  const { canInstall, install } = usePWAInstall();

  const userId = useMemo(() => {
    const id = authUser?._id || authUser?.id;
    if (id) return sanitize(id);
    return sanitize(authUser?.username || "user");
  }, [authUser]);

  const isAuthenticated = !!authUser;
  const { online, safeApiCall } = useOfflineSync();

  const [activePage, setActivePage] = useState("home");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [showHamburger, setShowHamburger] = useState(false);
  const [completedToday, setCompletedToday] = useState([]);

  const [user, setUser] = useState(() => {
    if (authProfile && authUser) return mapProfile(authProfile, authUser);
    return buildNewUser(authUser?.username || "Héroe");
  });

  const [stats, setStats] = useState(() => {
    if (authStats?.length) return mapStats(authStats);
    return INITIAL_STATS.map((s) => ({ ...s }));
  });

  const [coins, setCoins] = useState(() => Number(authProfile?.coins ?? 0));
  const coinsRef = useRef(coins);
  useEffect(() => {
    coinsRef.current = coins;
  }, [coins]);

  const [notifs, setNotifsRaw] = useState(() => lsGet(lsNotifs(userId), NOTIFICATIONS_DATA));

  const setNotifs = useCallback(
    (value) => {
      setNotifsRaw((prev) => {
        const next = typeof value === "function" ? value(prev) : value;
        lsSet(lsNotifs(userId), next);
        return next;
      });
    },
    [userId]
  );

  const [notifPrefs, setNotifPrefsRaw] = useState(() => {
    const defaults = Object.fromEntries(NOTIF_SETTINGS.map((item) => [item.id, true]));
    const saved = lsGet(lsNotifPrefs(userId), null);
    const serverPrefs = authProfile?.notifPrefs;

    if (saved && typeof saved === "object") {
      return { ...defaults, ...saved };
    }

    if (serverPrefs && typeof serverPrefs === "object" && Object.keys(serverPrefs).length) {
      return { ...defaults, ...serverPrefs };
    }

    return { ...defaults };
  });

  const setNotifPrefs = useCallback(
    (value) => {
      setNotifPrefsRaw((prev) => {
        const next = typeof value === "function" ? value(prev) : value;
        lsSet(lsNotifPrefs(userId), next);
        if (isAuthenticated) authApi.updateProfile({ notifPrefs: next }).catch(() => {});
        return next;
      });
    },
    [userId, isAuthenticated]
  );

  const [walletHistory, setWalletHistory] = useState(() => {
    try {
      const raw = localStorage.getItem(`rpglog_wallet_${userId}`);
      if (!raw) return [];
      return (JSON.parse(raw) || []).slice(0, 100);
    } catch {
      return [];
    }
  });

  const setWalletHistorySafe = useCallback(
    (updater) => {
      setWalletHistory((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        try {
          localStorage.setItem(`rpglog_wallet_${userId}`, JSON.stringify((next || []).slice(0, 100)));
        } catch {}
        return next;
      });
    },
    [userId]
  );

  const [records, setRecords] = useState(() => lsGet(lsRecords(userId), {}));
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [gpsStatus, setGpsStatus] = useState("disabled");
  const [lastCoords, setLastCoords] = useState(null);
  const gpsWatchRef = useRef(null);
  const pendingSyncRef = useRef(null);

  const [titlesState, setTitlesState] = useState(() => ({
    ownedIds: new Set(authProfile?.ownedTitleIds || ["t0", "t1", "t2"]),
    equippedId: authProfile?.equippedTitleId || "t0",
  }));
  const { ownedIds, equippedId } = titlesState;

  const [customMissions, setCustomMissions] = useState([]);
  const [unlockedSlots, setUnlockedSlots] = useState(() => {
    const slots = Number(authProfile?.customSlots || 1);
    return new Set(Array.from({ length: slots }, (_, i) => i));
  });

  useEffect(() => {
    setNotifsRaw(lsGet(lsNotifs(userId), NOTIFICATIONS_DATA));
    setRecords(lsGet(lsRecords(userId), {}));

    const defaults = Object.fromEntries(NOTIF_SETTINGS.map((item) => [item.id, true]));
    const savedPrefs = lsGet(lsNotifPrefs(userId), null);
    setNotifPrefsRaw(savedPrefs && typeof savedPrefs === "object" ? { ...defaults, ...savedPrefs } : { ...defaults });

    try {
      const rawWallet = localStorage.getItem(`rpglog_wallet_${userId}`);
      setWalletHistory(rawWallet ? (JSON.parse(rawWallet) || []).slice(0, 100) : []);
    } catch {
      setWalletHistory([]);
    }
  }, [userId]);

  const titleBonus = useMemo(() => {
    const eq = TITLES_DATA.find((t) => t.id === equippedId) || TITLES_DATA[0];
    return eq.bonus || { xpGlobal: 1, coinBonus: 0, xpStat: null, xpStatMult: 1 };
  }, [equippedId]);

  const syncProgressState = useCallback((data) => {
    if (data?.profile) {
      setUser((prev) => ({
        ...prev,
        level: data.profile.level ?? prev.level,
        xp: data.profile.xpCurrentLevel ?? prev.xp,
        xpMax: data.profile.xpNextLevel ?? prev.xpMax,
      }));

      if (typeof data.profile.coins === "number") {
        setCoins(data.profile.coins);
      }

      if (Array.isArray(data.profile.ownedTitleIds)) {
        setTitlesState((prev) => ({
          ownedIds: new Set(data.profile.ownedTitleIds),
          equippedId: data.profile.equippedTitleId || prev.equippedId || "t0",
        }));
      }

      if (typeof data.profile.customSlots === "number") {
        setUnlockedSlots(new Set(Array.from({ length: data.profile.customSlots }, (_, i) => i)));
      }

      const eq = TITLES_DATA.find((t) => t.id === (data.profile.equippedTitleId || "t0")) || TITLES_DATA[0];
      setUser((prev) => ({
        ...prev,
        title: eq.preview,
      }));
    }

    if (data?.stats?.length) setStats(mapStats(data.stats));
  }, []);

  const refreshProgress = useCallback(async () => {
    const data = await progressApi.getSummary();
    syncProgressState(data);
    return data;
  }, [syncProgressState]);

  useEffect(() => {
    if (!isAuthenticated) return;
    refreshProgress().catch(() => {});
  }, [isAuthenticated, refreshProgress]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const t = setTimeout(() => subscribeToPush(), 3000);
    return () => clearTimeout(t);
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    questsApi
      .listCustom()
      .then((data) => {
        const quests = Array.isArray(data?.quests) ? data.quests : [];
        const mapped = quests
          .filter((q) => !q.completed && !q.deleted)
          .map((q) => ({
            name: q.title,
            desc: q.description || "",
            xp: q.globalXpReward ?? q.xpReward ?? 10,
            cost: q.coinReward ?? 0,
            stats: [],
            dur: {
              hours: Math.round((q.customDurationMs || 3600000) / 3600000),
              label: `${Math.round((q.customDurationMs || 3600000) / 3600000)}h`,
            },
            slotIdx: q.customSlotIndex ?? 0,
            startedAt: q.customStartedAt ? new Date(q.customStartedAt).getTime() : Date.now(),
            durationMs: q.customDurationMs || 3600000,
            done: q.completed || false,
            backendQuestId: q._id,
            photoEvidenceEnabled: !!q.photoEvidenceEnabled,
            locationEvidenceEnabled: !!q.locationEvidenceEnabled,
          }));

        setCustomMissions(mapped);
      })
      .catch(() => {});
  }, [isAuthenticated]);

  const addNotification = useCallback(
    (notif, prefId) => {
      if (prefId && notifPrefs[prefId] === false) return;
      setNotifs((prev) =>
        [
          { ...notif, id: nextNotifId(), read: false, time: nowLabel() },
          ...prev,
        ].slice(0, 50)
      );
    },
    [notifPrefs, setNotifs]
  );

  const addWalletEntry = useCallback(
    (entry) => {
      setWalletHistorySafe((prev) => [entry, ...(prev || [])].slice(0, 100));
    },
    [setWalletHistorySafe]
  );

  const prevLevelRef = useRef(user.level);
  useEffect(() => {
    const prevLevel = prevLevelRef.current;
    if (prevLevel < user.level) {
      addNotification(
        { icon: "⬆️", title: "SUBISTE DE NIVEL", desc: `Ahora eres nivel ${user.level}.` },
        "levelup"
      );
    }
    if (prevLevel < 5 && user.level >= 5) {
      addNotification(
        { icon: "⚡", title: "MISION ESPECIAL DESBLOQUEADA", desc: "Nivel 5 alcanzado." },
        "special"
      );
    }
    prevLevelRef.current = user.level;
  }, [addNotification, user.level]);

  useEffect(() => {
    if (!gpsEnabled) {
      if (gpsWatchRef.current !== null) {
        navigator.geolocation?.clearWatch(gpsWatchRef.current);
        gpsWatchRef.current = null;
      }
      setGpsStatus("disabled");
      setLastCoords(null);
      return;
    }

    if (!navigator.geolocation) {
      setGpsStatus("unsupported");
      return;
    }

    setGpsStatus("requesting");
    gpsWatchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setGpsStatus("active");
        setLastCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          capturedAt: new Date().toISOString(),
        });
      },
      () => {
        setGpsStatus("denied");
        setGpsEnabled(false);
      },
      { enableHighAccuracy: true, maximumAge: 30000, timeout: 15000 }
    );

    return () => {
      if (gpsWatchRef.current !== null) {
        navigator.geolocation?.clearWatch(gpsWatchRef.current);
        gpsWatchRef.current = null;
      }
    };
  }, [gpsEnabled]);

  const handleToggleGps = useCallback(() => {
    setGpsEnabled((p) => !p);
  }, []);

  const spendCoins = useCallback(
    async ({ amount, label, icon } = {}) => {
      if (!isAuthenticated) return false;
      const safeAmount = Number(amount || 0);
      if (safeAmount <= 0) return true;
      if (coinsRef.current < safeAmount) return false;

      if (pendingSyncRef.current) {
        try {
          await pendingSyncRef.current;
        } catch {}
      }
      if (coinsRef.current < safeAmount) return false;

      try {
        const data = await safeApiCall(
          () => progressApi.spendCoins({ amount: safeAmount }),
          { url: "/api/progress/spend-coins", method: "POST", body: { amount: safeAmount } }
        );

        if (data === null) {
          setCoins((prev) => prev - safeAmount);
        } else if (typeof data?.profile?.coins === "number") {
          setCoins(data.profile.coins);
        } else {
          setCoins((prev) => prev - safeAmount);
        }

        addWalletEntry(buildWalletEntry({ icon, label, coinsChange: -safeAmount }));
        return true;
      } catch {
        return false;
      }
    },
    [isAuthenticated, safeApiCall, addWalletEntry]
  );

  const applyRewards = useCallback(
    (xp, coinAmt, statName, statId) => {
      const boostedXp = Math.round(xp * titleBonus.xpGlobal);
      const finalXp =
        titleBonus.xpStat && titleBonus.xpStat === statId
          ? Math.round(boostedXp * titleBonus.xpStatMult)
          : boostedXp;
      const finalCoins = Number(coinAmt || 0) + titleBonus.coinBonus;

      if (statName || statId) {
        setStats((prev) =>
          prev.map((stat) => {
            const matches = statId ? stat.id === statId : stat.name === statName;
            if (!matches) return stat;
            const { newXp, newLevel, newMax } = applyXpGain(stat.xp, finalXp, stat.max, stat.lv, 1.4);
            return { ...stat, xp: newXp, lv: newLevel, max: newMax };
          })
        );
      }

      setUser((prev) => {
        const { newXp, newLevel, newMax } = applyXpGain(prev.xp, finalXp, prev.xpMax, prev.level, 1.5);
        return { ...prev, xp: newXp, level: newLevel, xpMax: newMax };
      });

      setCoins((prev) => prev + finalCoins);
      return { finalXp, finalCoins };
    },
    [titleBonus]
  );

  const handleMissionDone = useCallback(
    (mission, rawXp) => {
      const statNames = mission.stats ? mission.stats.map((s) => s.label) : [mission.stat];
      const xpPerStat = Math.round(rawXp / statNames.length);

      setStats((prev) =>
        prev.map((stat) => {
          if (!statNames.includes(stat.name)) return stat;
          const boostedXp = Math.round(
            xpPerStat * titleBonus.xpGlobal * (titleBonus.xpStat === stat.id ? titleBonus.xpStatMult : 1)
          );
          const { newXp, newLevel, newMax } = applyXpGain(stat.xp, boostedXp, stat.max, stat.lv, 1.4);
          return { ...stat, xp: newXp, lv: newLevel, max: newMax };
        })
      );

      const finalXp = Math.round(rawXp * titleBonus.xpGlobal);
      const finalCoins = Number(mission.coins || 0) + titleBonus.coinBonus;

      setUser((prev) => {
        const { newXp, newLevel, newMax } = applyXpGain(prev.xp, finalXp, prev.xpMax, prev.level, 1.5);
        return { ...prev, xp: newXp, level: newLevel, xpMax: newMax };
      });

      setCoins((prev) => prev + finalCoins);

      addWalletEntry(
        buildWalletEntry({
          icon: mission.stats ? "⚡" : mission.icon || "⚔️",
          label: mission.name,
          amount: `+${finalXp} XP`,
          coinsChange: finalCoins,
          color: mission.stats ? "#f5c842" : mission.color,
        })
      );

      setCompletedToday((prev) => [
        ...prev,
        {
          id: mission.id,
          name: mission.name,
          stat: statNames[0],
          icon: mission.stats ? mission.stats[0].icon : mission.icon,
          color: mission.stats ? mission.stats[0].color : mission.color,
          earnedXp: finalXp,
          coins: finalCoins,
        },
      ]);

      addNotification(
        {
          icon: mission.stats ? "⚡" : mission.icon || "⚔️",
          title: "MISION COMPLETADA",
          desc: `"${mission.name}" - +${finalXp} XP y 🪙 +${finalCoins}`,
        },
        "missions"
      );

      if (isAuthenticated) setTimeout(() => refreshProgress().catch(() => {}), 500);
    },
    [addNotification, addWalletEntry, isAuthenticated, refreshProgress, titleBonus]
  );

  const handleGameDone = useCallback(
    (xp, gameCoins, statName, gameId, score) => {
      const { finalXp, finalCoins } = applyRewards(xp, gameCoins, statName, null);

      addWalletEntry(
        buildWalletEntry({
          icon: "🎮",
          label: `Mini juego: ${gameId || statName}`,
          amount: `+${finalXp} XP`,
          coinsChange: finalCoins,
          color: "#52c97a",
        })
      );

      addNotification(
        {
          icon: "🎮",
          title: "PARTIDA TERMINADA",
          desc: `+${finalXp} XP en ${statName} y 🪙 +${finalCoins}. Puntuación: ${score || xp}`,
        },
        "games"
      );

      if (gameId && score !== undefined) {
        const prevRecord = records[gameId] || 0;
        if (score > prevRecord) {
          const next = { ...records, [gameId]: score };
          setRecords(next);
          lsSet(lsRecords(userId), next);
          addNotification(
            { icon: "🏆", title: "NUEVO RÉCORD", desc: `Superaste tu récord en ${gameId}: ${score} pts` },
            "record"
          );
        }
      }

      if (isAuthenticated) {
        const statKeyMap = {
          FUERZA: "str",
          RESISTENCIA: "res",
          AGILIDAD: "agi",
          INTELIGENCIA: "int",
          CREATIVIDAD: "cre",
          COMUNICACIÓN: "com",
        };
        const statKey = statKeyMap[statName] || null;

        pendingSyncRef.current = (async () => {
          try {
            const data = await safeApiCall(
              () => progressApi.addGameReward({ xp: finalXp, coins: finalCoins, statKey }),
              { url: "/api/progress/game-reward", method: "POST", body: { xp: finalXp, coins: finalCoins, statKey } }
            );
            if (data) syncProgressState(data);
          } finally {
            pendingSyncRef.current = null;
          }
        })();
      }
    },
    [addNotification, addWalletEntry, applyRewards, isAuthenticated, records, safeApiCall, syncProgressState, userId]
  );

  const handleCustomMissionComplete = useCallback(
    async (mission, extra = {}) => {
      const appliedXp = extra.finalXp ?? mission.xp;
      const { finalXp, finalCoins } = applyRewards(appliedXp, mission.cost, null, null);

      addWalletEntry(
        buildWalletEntry({
          icon: "⚙️",
          label: mission.name,
          amount: `+${finalXp} XP`,
          coinsChange: finalCoins,
          color: "#f5c842",
        })
      );

      addNotification(
        {
          icon: "⚙️",
          title: "MISION CUSTOM COMPLETADA",
          desc: `"${mission.name}" - +${finalXp} XP y 🪙 +${finalCoins}`,
        },
        "missions"
      );

      const backendQuestId = extra.questId || mission.backendQuestId;
      if (!isAuthenticated || !backendQuestId) return;

      try {
        await safeApiCall(
          () => questsApi.complete(backendQuestId),
          { url: `/api/quests/${backendQuestId}/complete`, method: "PATCH", body: {} }
        ).catch(() => {});
        await refreshProgress().catch(() => {});
      } catch {}
    },
    [addNotification, addWalletEntry, applyRewards, isAuthenticated, refreshProgress, safeApiCall]
  );

  const handleBuyTitle = useCallback(
    async (title) => {
      if (ownedIds.has(title.id)) return true;

      try {
        const data = await safeApiCall(
          () => progressApi.buyTitle({ titleId: title.id, price: title.price }),
          { url: "/api/progress/buy-title", method: "POST", body: { titleId: title.id, price: title.price } }
        );

        if (data?.profile) {
          syncProgressState(data);
          addWalletEntry(
            buildWalletEntry({
              icon: "🏷️",
              label: `Título: ${title.name}`,
              coinsChange: -title.price,
            })
          );
          addNotification(
            { icon: "🏷️", title: "TITULO DESBLOQUEADO", desc: `Obtuviste "${title.name}".` },
            "levelup"
          );
          return true;
        }

        return false;
      } catch {
        return false;
      }
    },
    [ownedIds, safeApiCall, syncProgressState, addWalletEntry, addNotification]
  );

  const handleEquipTitle = useCallback(
    async (title) => {
      try {
        const data = await safeApiCall(
          () => progressApi.equipTitle({ titleId: title.id }),
          { url: "/api/progress/equip-title", method: "POST", body: { titleId: title.id } }
        );

        if (data?.profile) {
          syncProgressState(data);
          setUser((prev) => ({ ...prev, title: title.preview }));
          addNotification(
            { icon: "👑", title: "TITULO EQUIPADO", desc: `Ahora llevas ${title.name}.` },
            "levelup"
          );
        }
      } catch {}
    },
    [safeApiCall, syncProgressState, addNotification]
  );

  const handleUnequipTitle = useCallback(async () => {
    const def = TITLES_DATA[0];
    try {
      const data = await safeApiCall(
        () => progressApi.equipTitle({ titleId: def.id }),
        { url: "/api/progress/equip-title", method: "POST", body: { titleId: def.id } }
      );

      if (data?.profile) {
        syncProgressState(data);
        setUser((prev) => ({ ...prev, title: def.preview }));
      }
    } catch {}
  }, [safeApiCall, syncProgressState]);

  const handleUnlockSlot = useCallback(
    async (slotIdx, price) => {
      if (unlockedSlots.has(slotIdx)) return true;

      try {
        const data = await safeApiCall(
          () => progressApi.buyCustomSlot({ slotIdx, price }),
          { url: "/api/progress/buy-custom-slot", method: "POST", body: { slotIdx, price } }
        );

        if (data?.profile) {
          syncProgressState(data);
          addWalletEntry(
            buildWalletEntry({
              icon: "🧩",
              label: `Espacio custom ${slotIdx + 1}`,
              coinsChange: -price,
            })
          );
          return true;
        }

        return false;
      } catch {
        return false;
      }
    },
    [unlockedSlots, safeApiCall, syncProgressState, addWalletEntry]
  );

  const handleCreateCustomMission = useCallback(
    async (mission, targetSlot) => {
      const spent = await spendCoins({
        amount: mission.cost,
        label: `Crear mision: ${mission.name}`,
        icon: "⚙️",
      });
      if (!spent) return null;

      let backendQuestId = null;
      let createdQuest = null;

      if (isAuthenticated) {
        try {
          const data = await safeApiCall(
            () =>
              questsApi.createCustom({
                title: mission.name,
                description: mission.desc,
                xpReward: mission.xp,
                globalXpReward: mission.xp,
                coinReward: mission.cost,
                statRewards: [],
                slotIdx: targetSlot,
                durationMs: mission.dur.hours * 3600000,
                startedAt: new Date().toISOString(),
                photoEvidenceEnabled: mission.photoEvidenceEnabled,
                locationEvidenceEnabled: mission.locationEvidenceEnabled,
                photoBonusXp: mission.photoEvidenceEnabled ? mission.xp : 0,
                photoBonusCoins: 0,
                photoBonusStatRewards: [],
                locationBonusXp: 0,
                locationBonusCoins: 0,
                locationBonusStatRewards: [],
              }),
            { url: "/api/quests/custom", method: "POST", body: {} }
          );

          backendQuestId = data?.quest?._id || null;
          createdQuest = data?.quest || null;
        } catch {}
      }

      return {
        ...mission,
        slotIdx: targetSlot,
        startedAt: createdQuest?.customStartedAt ? new Date(createdQuest.customStartedAt).getTime() : Date.now(),
        durationMs: createdQuest?.customDurationMs || mission.dur.hours * 3600000,
        done: false,
        backendQuestId,
      };
    },
    [isAuthenticated, safeApiCall, spendCoins]
  );

  const handleAppClick = useCallback(() => {
    if (showDropdown) setShowDropdown(false);
    if (showNotifPanel) setShowNotifPanel(false);
    if (showHamburger) setShowHamburger(false);
  }, [showDropdown, showHamburger, showNotifPanel]);

  const unreadCount = notifs.filter((n) => !n.read).length;
  const isSettingsPage = activePage.startsWith("settings");

  const weeklyCoins = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 3600000;
    return (walletHistory || []).reduce((total, entry) => {
      if (!entry?.timestamp || entry.timestamp < weekAgo) return total;
      return total + Number(entry.coinsChange || 0);
    }, 0);
  }, [walletHistory]);

  return (
    <div className="app" onClick={handleAppClick}>
      <OfflineBanner online={online} />
      <div className="scanlines" />

      <PWAInstallBanner canInstall={canInstall} onInstall={install} />

      <Navbar
        active={activePage}
        setActive={setActivePage}
        coins={Number(coins || 0)}
        showDropdown={showDropdown}
        setShowDropdown={setShowDropdown}
        showNotifPanel={showNotifPanel}
        setShowNotifPanel={setShowNotifPanel}
        showHamburger={showHamburger}
        setShowHamburger={setShowHamburger}
        unreadCount={unreadCount}
        notifs={notifs}
        setNotifs={setNotifs}
        user={user}
        canInstall={canInstall}
        onInstall={install}
      />

      {activePage === "home" && (
        <div className="page">
          <HeroSection user={user} />
          <StatCards stats={stats} />
          <ProgressSection completedToday={completedToday} />
        </div>
      )}

    {activePage === "missions" && (
  <MissionsScreen
    onMissionDone={handleMissionDone}
    onCustomMissionComplete={handleCustomMissionComplete}
    customMissions={customMissions}
    setCustomMissions={setCustomMissions}
    userLevel={user.level}
    userId={userId}
    gpsEnabled={gpsEnabled}
    lastCoords={lastCoords}
  />
)}

      {activePage === "minigames" && (
        <MiniGamesScreen onGameDone={handleGameDone} userId={userId} />
      )}

      {activePage === "shop" && (
        <ShopScreen
          coins={Number(coins || 0)}
          userLevel={user.level}
          ownedIds={ownedIds}
          equippedId={equippedId}
          onBuyTitle={handleBuyTitle}
          onEquipTitle={handleEquipTitle}
          onUnequipTitle={handleUnequipTitle}
          customMissions={customMissions}
          setCustomMissions={setCustomMissions}
          onMissionComplete={handleCustomMissionComplete}
          unlockedSlots={unlockedSlots}
          setUnlockedSlots={setUnlockedSlots}
          onUnlockSlot={handleUnlockSlot}
          onCreateCustomMission={handleCreateCustomMission}
        />
      )}

      {isSettingsPage && (
        <SettingsScreen
          section={activePage}
          user={{ ...user, coins: Number(coins || 0) }}
          setUser={setUser}
          notifs={notifs}
          setNotifs={setNotifs}
          notifPrefs={notifPrefs}
          setNotifPrefs={setNotifPrefs}
          walletHistory={walletHistory}
          weeklyCoins={weeklyCoins}
          onLogout={onLogout}
          gpsEnabled={gpsEnabled}
          gpsStatus={gpsStatus}
          lastCoords={lastCoords}
          onToggleGps={handleToggleGps}
        />
      )}
    </div>
  );
}