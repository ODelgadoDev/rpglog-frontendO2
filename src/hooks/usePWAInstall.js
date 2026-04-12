/**
 * usePWAInstall.js — Hook para manejar el prompt de instalación PWA
 *
 * Uso:
 *   const { canInstall, install } = usePWAInstall();
 *
 *   canInstall → boolean: true cuando el navegador disparó beforeinstallprompt
 *   install()  → muestra el popup nativo de instalación
 */
import { useState, useEffect, useCallback } from "react";

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstall,     setCanInstall]     = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();            // evita que el navegador muestre el prompt solo
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Detectar si ya está instalada (standalone mode)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setCanInstall(false);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt) return false;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setCanInstall(false);
    return outcome === "accepted";
  }, [deferredPrompt]);

  return { canInstall, install };
}