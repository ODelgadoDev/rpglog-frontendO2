/**
 * pushNotifications.js — Servicio de notificaciones push
 * ─────────────────────────────────────────────────────
 * Solicita permiso, obtiene la VAPID key del backend
 * y registra la suscripción del navegador.
 */
import { getToken } from "./api";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function subscribeToPush() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.warn("Push notifications no soportadas");
    return false;
  }

  try {
    // Pedir permiso al usuario
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return false;

    // Obtener VAPID key del backend
    const res  = await fetch(`${BASE}/api/push/vapid-key`);
    const data = await res.json();
    if (!data.publicKey) return false;

    // Registrar suscripción
    const sw  = await navigator.serviceWorker.ready;
    const sub = await sw.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(data.publicKey),
    });

    // Enviar suscripción al backend
    await fetch(`${BASE}/api/push/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`,
      },
      body: JSON.stringify(sub.toJSON()),
    });

    return true;
  } catch (err) {
    console.error("Error suscribiendo a push:", err);
    return false;
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64  = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw     = atob(base64);
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}
