/**
 * PWAInstallBanner.jsx — Popup de instalación PWA al inicio
 *
 * Se muestra UNA sola vez por sesión cuando el evento beforeinstallprompt
 * está disponible. El usuario puede:
 *   ▶ Instalar aplicación → dispara el prompt nativo
 *   ✕ Ahora no           → cierra y guarda en sessionStorage para no volver a mostrar
 */
import { useState, useEffect } from "react";

export default function PWAInstallBanner({ canInstall, onInstall }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!canInstall) return;
    // Solo mostrar una vez por sesión
    const dismissed = sessionStorage.getItem("pwa_banner_dismissed");
    if (!dismissed) setVisible(true);
  }, [canInstall]);

  if (!visible) return null;

  const handleInstall = async () => {
    setVisible(false);
    await onInstall();
  };

  const handleDismiss = () => {
    sessionStorage.setItem("pwa_banner_dismissed", "1");
    setVisible(false);
  };

  return (
    <div style={{
      position:   "fixed",
      bottom:     "1.2rem",
      left:       "50%",
      transform:  "translateX(-50%)",
      zIndex:     500,
      width:      "min(420px, 92vw)",
      background: "var(--panel)",
      border:     "2px solid var(--gold)",
      padding:    "1rem 1.2rem",
      boxShadow:  "0 8px 32px rgba(0,0,0,.7)",
      animation:  "pwaSlideUp .35s cubic-bezier(.16,1,.3,1) both",
    }}>
      {/* Esquinas pixel */}
      {["tl","tr","bl","br"].map(c => (
        <div key={c} style={{
          position: "absolute",
          width: 7, height: 7,
          background: "var(--gold)",
          ...(c === "tl" ? { top: -1, left: -1 }
            : c === "tr" ? { top: -1, right: -1 }
            : c === "bl" ? { bottom: -1, left: -1 }
            :               { bottom: -1, right: -1 }),
        }} />
      ))}

      <div style={{ display: "flex", alignItems: "flex-start", gap: ".9rem" }}>
        <span style={{ fontSize: "2rem", flexShrink: 0 }}>📲</span>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "var(--pixel)", fontSize: ".5rem",
            color: "var(--gold)", marginBottom: ".35rem", letterSpacing: ".04em",
          }}>
            INSTALAR RPG LOG
          </div>
          <div style={{
            fontFamily: "var(--vt)", fontSize: "1.05rem",
            color: "var(--text-dim)", lineHeight: 1.4, marginBottom: ".75rem",
          }}>
            Agrégala a tu pantalla de inicio para acceder más rápido y jugar sin conexión.
          </div>
          <div style={{ display: "flex", gap: ".6rem" }}>
            <button
              onClick={handleInstall}
              style={{
                background: "var(--gold)", border: "none",
                borderBottom: "3px solid var(--gold-dim)",
                fontFamily: "var(--pixel)", fontSize: ".46rem",
                color: "#0a0a0f", padding: ".55rem 1rem",
                cursor: "pointer", letterSpacing: ".04em",
                flex: 1,
              }}
            >
              ▶ INSTALAR
            </button>
            <button
              onClick={handleDismiss}
              style={{
                background: "none",
                border: "2px solid var(--border)",
                fontFamily: "var(--pixel)", fontSize: ".44rem",
                color: "var(--text-dim)", padding: ".55rem .9rem",
                cursor: "pointer", letterSpacing: ".04em",
              }}
            >
              AHORA NO
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pwaSlideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}