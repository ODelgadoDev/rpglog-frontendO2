/**
 * useOfflineSync.js — Hook de sincronización offline
 * ─────────────────────────────────────────────────────
 * Detecta cambios de conectividad y sincroniza automáticamente.
 * Muestra un banner cuando el usuario está offline.
 */
import { useState, useEffect, useCallback } from "react";
import { savePendingAction, requestBackgroundSync, isOnline } from "../services/offline";
import { getToken } from "../services/api";

export function useOfflineSync() {
  const [online, setOnline] = useState(isOnline());
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const goOnline  = () => { setOnline(true);  requestBackgroundSync(); };
    const goOffline = () => setOnline(false);
    window.addEventListener("online",  goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online",  goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  // Envolver llamadas a la API con fallback offline
  const safeApiCall = useCallback(async (apiCall, offlineAction = null) => {
    if (!isOnline()) {
      if (offlineAction) {
        await savePendingAction(offlineAction);
        requestBackgroundSync();
      }
      return null;
    }
    try {
      return await apiCall();
    } catch (err) {
      if (offlineAction) {
        await savePendingAction(offlineAction);
        requestBackgroundSync();
      }
      throw err;
    }
  }, []);

  return { online, syncing, safeApiCall };
}
