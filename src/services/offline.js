/**
 * offline.js — Servicio de sincronización offline
 * ─────────────────────────────────────────────────────
 * Guarda acciones pendientes en IndexedDB cuando no hay internet.
 * El Service Worker las envía automáticamente al reconectarse.
 */

const DB_NAME    = "rpglog-offline";
const DB_VERSION = 1;
const STORE_NAME = "pending";

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

import { getToken } from "./api";

// Guardar una acción pendiente para cuando vuelva internet
export async function savePendingAction(action) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx    = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req   = store.add({
      ...action,
      savedAt: Date.now(),
      token: getToken(),
    });
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

// Obtener todas las acciones pendientes
export async function getPendingActions() {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx    = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req   = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror   = () => resolve([]);
  });
}

// Limpiar acciones procesadas
export async function clearPendingActions() {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).clear();
    tx.oncomplete = resolve;
  });
}

// Registrar sync con el Service Worker
export function requestBackgroundSync() {
  if ("serviceWorker" in navigator && "SyncManager" in window) {
    navigator.serviceWorker.ready
      .then(sw => sw.sync.register("rpglog-sync"))
      .catch(() => {});
  }
}

// Detectar si hay internet
export const isOnline = () => navigator.onLine;
