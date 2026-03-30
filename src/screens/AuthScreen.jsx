/**
 * AuthScreen.jsx — Pantalla de autenticación
 * ─────────────────────────────────────────────────────
 * Muestra login y registro con overlay de éxito animado.
 *
 * ── FOOTER ───────────────────────────────────────────────────────
 *   Dos links de texto minimalistas (subrayado suave, sin borde):
 *   • "TÉRMINOS Y CONDICIONES" → abre TosModal (modal scrollable)
 *   • "RESTABLECER CONTRASEÑA" → abre ResetModal (formulario de email)
 *   Ambos centrados horizontalmente. min-height: 44px para touch.
 *
 * ── TosModal ─────────────────────────────────────────────────────
 *   Modal con todos los términos. Títulos de sección en pixel font
 *   grande (.65rem) para facilitar la lectura. Texto en 1.2rem.
 *
 * ── ResetModal ───────────────────────────────────────────────────
 *   Formulario de email. En modo local (sin backend) simula el envío.
 *   Al conectar el backend, reemplazar el setTimeout por
 *   authApi.forgotPassword(email).
 *
 * Props:
 *   onLogin(username, isNew) — callback hacia App.jsx
 */
import { useState, useEffect } from "react";
import "../styles/globals.css";
import "../styles/AuthScreen.css";

import Stars      from "../components/Stars";
import LoginForm  from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

// Overlay de éxito al autenticarse
const SuccessOverlay = ({ mode, name }) => (
  <div className="success-overlay">
    <div className="success-icon">{mode === "login" ? "⚔️" : "🏆"}</div>
    <div className="success-text">
      {mode === "login"
        ? `¡BIENVENIDO DE VUELTA,\n${name.toUpperCase()}!`
        : `¡HÉROE CREADO!\n${name.toUpperCase()}`}
    </div>
    <div className="success-bar-wrap">
      <div className="success-bar" />
    </div>
  </div>
);

// Modal de T&C
const TosModal = ({ onClose }) => (
  <div className="auth-modal-overlay" onClick={onClose}>
    <div className="auth-modal" onClick={e => e.stopPropagation()}>
      <div className="auth-modal-header">
        <span>📜 TÉRMINOS Y CONDICIONES</span>
        <button className="auth-modal-close" onClick={onClose}>✕</button>
      </div>
      <div className="auth-modal-body">
        {[
          ["1. Aceptación", "Al usar la aplicación aceptas estos términos. Si no estás de acuerdo, no utilices la app."],
          ["2. ¿Qué es RPG LOG?", "Una plataforma de gamificación para el desarrollo personal. Incluye sistema de niveles y XP, misiones diarias y personalizadas, minijuegos, economía virtual de monedas y títulos desbloqueables. Tiene fines educativos y de mejora de hábitos."],
          ["3. Tu cuenta", "Eres responsable de mantener seguras tus credenciales y de toda actividad realizada desde tu cuenta. Proporciona información veraz. La app puede suspender cuentas por uso indebido."],
          ["4. Uso responsable", "Te comprometes a no manipular el sistema para obtener ventajas injustas, no introducir información falsa en misiones y no realizar acciones que afecten el funcionamiento de la plataforma."],
          ["5. Sistema de progreso", "La XP permite subir de nivel. Las monedas se obtienen como recompensa y se usan dentro de la app. Los títulos otorgan bonificaciones. La aplicación puede ajustar valores en cualquier momento."],
          ["6. Misiones", "Las normales se regeneran diariamente. Las especiales requieren nivel mínimo. Las personalizadas las crea el usuario con costo en monedas. No pueden completarse fuera de su ciclo."],
          ["7. Minijuegos", "Otorgan XP y monedas. Las recompensas varían según desempeño. Pueden existir límites de uso diario para mantener el balance."],
          ["8. Economía interna", "Las monedas son virtuales, no tienen valor real, no son transferibles y no pueden canjearse por dinero."],
          ["9. Contenido del usuario", "El contenido de las misiones personalizadas es responsabilidad del usuario. No debe incluir material ofensivo o ilegal."],
          ["10. Privacidad y datos", "La app puede recopilar datos de uso para el funcionamiento del sistema. La ubicación GPS solo se comparte al completar misiones que lo requieran, con consentimiento explícito del usuario."],
          ["11. Limitación de responsabilidad", "RPG LOG no garantiza resultados personales ni cambios de hábitos. No sustituye asesoramiento profesional. El servicio puede tener interrupciones por mantenimiento."],
          ["12. Cambios", "Estos términos pueden modificarse en cualquier momento. El uso continuo de la app implica la aceptación de los cambios."],
          ["13. Cancelación", "Puedes dejar de usar la app cuando quieras. La aplicación puede suspender cuentas por incumplimiento de estos términos."],
        ].map(([title, text]) => (
          <div key={title} className="auth-tos-section">
            <div className="auth-tos-title">{title}</div>
            <p className="auth-tos-text">{text}</p>
          </div>
        ))}
      </div>
      <div className="auth-modal-footer">
        <button className="auth-modal-accept" onClick={onClose}>✓ ENTENDIDO</button>
      </div>
    </div>
  </div>
);

// Modal de restablecer contraseña (local — sin backend activo)
const ResetModal = ({ onClose }) => {
  const [email,   setEmail]   = useState("");
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    if (!email.includes("@")) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1000);
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal auth-modal-sm" onClick={e => e.stopPropagation()}>
        <div className="auth-modal-header">
          <span>🔑 RESTABLECER CONTRASEÑA</span>
          <button className="auth-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="auth-modal-body">
          {!sent ? (
            <>
              <p className="auth-tos-text" style={{ marginBottom: "1rem" }}>
                Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
              </p>
              <div className="field">
                <label className="field-label">▸ CORREO ELECTRÓNICO</label>
                <div className="field-wrap">
                  <span className="field-icon">📧</span>
                  <input
                    className="field-input"
                    type="email"
                    placeholder="heroe@quest.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSend()}
                  />
                </div>
              </div>
              <button
                className="submit-btn"
                style={{ marginTop: "1rem" }}
                onClick={handleSend}
                disabled={loading || !email.includes("@")}
              >
                {loading ? "ENVIANDO..." : "📨 ENVIAR ENLACE"}
              </button>
              <p className="auth-tos-text" style={{ marginTop: ".7rem", fontSize: "1rem", color: "var(--text-dim)" }}>
                Nota: la función de restablecimiento requiere el backend activo. Al conectarlo, este formulario enviará un correo real.
              </p>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "1rem 0" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: ".5rem" }}>✅</div>
              <div style={{ fontFamily: "var(--pixel)", fontSize: ".5rem", color: "#52c97a", letterSpacing: ".04em" }}>
                ¡ENLACE ENVIADO!
              </div>
              <p className="auth-tos-text" style={{ marginTop: ".5rem" }}>
                Si el correo está registrado recibirás un enlace de recuperación en los próximos minutos.
              </p>
              <button className="auth-modal-accept" style={{ marginTop: "1rem" }} onClick={onClose}>
                VOLVER AL LOGIN
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function AuthScreen({ onLogin }) {
  const [tab,        setTab]        = useState("login");
  const [success,    setSuccess]    = useState(null);
  const [showTos,    setShowTos]    = useState(false);
  const [showReset,  setShowReset]  = useState(false);

  const handleSuccess = (mode, username) => {
    setSuccess({ mode, name: username });
    setTimeout(() => onLogin(username, mode === "signup"), 2100);
  };

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(null), 2100);
    return () => clearTimeout(t);
  }, [success]);

  return (
    <div className="auth-root">
      <Stars />
      <div className="scanlines" />

      <div className="card">
        {success && <SuccessOverlay mode={success.mode} name={success.name} />}
        <div className="card-corner-bl" />
        <div className="card-corner-br" />

        {/* Header */}
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

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab-btn${tab === "login" ? " active" : ""}`}
            onClick={() => { setTab("login"); setSuccess(null); }}
          >
            ▸ INICIAR SESIÓN
          </button>
          <button
            className={`tab-btn${tab === "signup" ? " active" : ""}`}
            onClick={() => { setTab("signup"); setSuccess(null); }}
          >
            ▸ REGISTRARSE
          </button>
        </div>

        {tab === "login"
          ? <LoginForm  key="login"  onSuccess={handleSuccess} />
          : <SignupForm key="signup" onSuccess={handleSuccess} />}

        {/* Footer con botones grandes */}
        <div className="card-footer">
          <button className="footer-link" onClick={() => setShowTos(true)}>TÉRMINOS Y CONDICIONES</button>
          {tab === "login" && (
            <button className="footer-link" onClick={() => setShowReset(true)}>RESTABLECER CONTRASEÑA</button>
          )}
        </div>
      </div>

      {showTos   && <TosModal   onClose={() => setShowTos(false)}   />}
      {showReset && <ResetModal onClose={() => setShowReset(false)} />}
    </div>
  );
}
