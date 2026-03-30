/**
 * PwaInstallPrompt.jsx — Banner para instalar la app como PWA
 * ─────────────────────────────────────────────────────────────
 * Muestra un CTA de instalación en desktop/android y una guía
 * rápida en iOS para “Añadir a pantalla de inicio”.
 */
import { useEffect, useMemo, useState } from "react";

const DISMISS_KEY = "rpglog_pwa_prompt_dismissed";

const isStandalone = () =>
  window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator.standalone === true;

const isIOS = () => /iphone|ipad|ipod/i.test(window.navigator.userAgent);

export async function promptPwaInstall() {
  const deferredPrompt = window.__rpglogDeferredPrompt;

  if (deferredPrompt) {
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    window.__rpglogDeferredPrompt = null;
    return true;
  }

  if (isIOS()) {
    window.alert("Para instalar RPG LOG en iPhone o iPad: abre Safari, toca Compartir y luego 'Añadir a pantalla de inicio'.");
    return false;
  }

  window.alert("Si no aparece la instalación automática, abre el menú de tu navegador y elige 'Instalar app' o 'Añadir a escritorio'.");
  return false;
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  const ios = useMemo(() => {
    if (typeof window === "undefined") return false;
    return isIOS();
  }, []);

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISS_KEY) === "1";

    if (!dismissed && !isStandalone() && ios) {
      setVisible(true);
    }

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      window.__rpglogDeferredPrompt = event;
      setDeferredPrompt(event);
      if (!dismissed && !isStandalone()) setVisible(true);
    };

    const handleAppInstalled = () => {
      localStorage.removeItem(DISMISS_KEY);
      window.__rpglogDeferredPrompt = null;
      setVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [ios]);

  const closePrompt = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await promptPwaInstall();
    setDeferredPrompt(null);
    setVisible(false);
  };

  if (!visible || isStandalone()) return null;

  return (
    <aside className="pwa-install-card" aria-live="polite">
      <div className="pwa-install-copy">
        <span className="pwa-install-badge">📲 PWA</span>
        <h3>Instala RPG LOG</h3>
        <p>
          {ios
            ? "En iPhone o iPad: abre Safari, toca Compartir y luego “Añadir a pantalla de inicio”."
            : "Instálala en tu computadora o móvil para abrirla como una app y usarla más rápido."}
        </p>
      </div>

      <div className="pwa-install-actions">
        {!ios && deferredPrompt && (
          <button className="pwa-install-btn primary" onClick={handleInstall}>
            Instalar
          </button>
        )}
        <button className="pwa-install-btn" onClick={closePrompt}>
          Cerrar
        </button>
      </div>
    </aside>
  );
}
