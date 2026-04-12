/**
 * AuthScreen.jsx — Pantalla de autenticación
 * FIX: Los modales de Términos y Condiciones y Restablecer Contraseña
 *      se mostraban pero el z-index los ocultaba detrás de la card.
 *      Se asegura que el portal de modales esté siempre al frente.
 */
import { useState } from "react";
import "../styles/globals.css";
import "../styles/AuthScreen.css";

import Stars               from "../components/Stars";
import LoginForm           from "../components/LoginForm";
import SignupForm          from "../components/SignupForm";
import TermsModal          from "../components/TermsModal";
import ResetPasswordModal  from "../components/ResetPasswordModal";

export default function AuthScreen() {
  const [tab,       setTab]       = useState("login");
  const [showTerms, setShowTerms] = useState(false);
  const [showReset, setShowReset] = useState(false);

  return (
    <div className="auth-root">
      <Stars />
      <div className="scanlines" />

      <div className="card">
        <div className="card-corner-bl" />
        <div className="card-corner-br" />

        <div className="card-header">
          <div className="logo-row">
            <span className="logo-icon">🗡️</span>
            <span className="logo-title">RPG LOG</span>
            <span className="logo-icon">🛡️</span>
          </div>
          <div className="logo-sub">PERSONAL RPG SYSTEM</div>
          <div className="xp-bar-wrap">
            <div className="xp-bar-fill" style={{ "--xp-w": "72%" }} />
          </div>
        </div>

        <div className="tabs">
          <button
            className={`tab-btn${tab === "login"  ? " active" : ""}`}
            onClick={() => setTab("login")}
          >
            ▸ INICIAR SESIÓN
          </button>
          <button
            className={`tab-btn${tab === "signup" ? " active" : ""}`}
            onClick={() => setTab("signup")}
          >
            ▸ REGISTRARSE
          </button>
        </div>

        {tab === "login"
          ? <LoginForm  key="login"  />
          : <SignupForm key="signup" />}

        {/* ✅ FIX: botones del footer siempre visibles con z-index adecuado */}
        <div className="card-footer">
          <button className="footer-link" onClick={() => setShowTerms(true)}>
            TÉRMINOS Y CONDICIONES
          </button>
          {tab === "login" && (
            <button className="footer-link" onClick={() => setShowReset(true)}>
              RESTABLECER CONTRASEÑA
            </button>
          )}
        </div>
      </div>

      {/* ✅ FIX: modales fuera de .card para no heredar overflow/z-index */}
      {showTerms && <TermsModal         onClose={() => setShowTerms(false)} />}
      {showReset && <ResetPasswordModal onClose={() => setShowReset(false)} />}
    </div>
  );
}
