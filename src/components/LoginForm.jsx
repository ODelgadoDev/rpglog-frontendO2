/**
 * LoginForm.jsx — Formulario de inicio de sesión (modo local)
 * ─────────────────────────────────────────────────────
 * Modo frontend puro: simula autenticación con setTimeout.
 * No requiere backend activo.
 *
 * Props:
 *   onSuccess(mode, username) — callback al login exitoso
 */
import { useState } from "react";

export default function LoginForm({ onSuccess }) {
  const [email,    setEmail]    = useState("");
  const [pass,     setPass]     = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleSubmit = () => {
    setError("");
    if (!email || !pass)      { setError("▸ Completa todos los campos"); return; }
    if (!email.includes("@")) { setError("▸ Email inválido"); return; }

    setLoading(true);
    // Simula llamada al backend — reemplazar con authApi.login() al conectar
    setTimeout(() => {
      setLoading(false);
      const displayName = email.split("@")[0];
      onSuccess("login", displayName);
    }, 1200);
  };

  return (
    <div className="form-body">
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
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
          />
        </div>
      </div>

      <div className="field">
        <label className="field-label">▸ CONTRASEÑA</label>
        <div className="field-wrap">
          <span className="field-icon">🔒</span>
          <input
            className="field-input"
            type={showPass ? "text" : "password"}
            placeholder="••••••••"
            value={pass}
            onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
          />
          <button className="eye-btn" onClick={() => setShowPass(p => !p)}>
            {showPass ? "🙈" : "👁️"}
          </button>
        </div>
      </div>

      {error && <div className="error-msg">{error}</div>}

      <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
        {loading
          ? <span>ENTRANDO<span className="btn-loading">...</span></span>
          : "▶ INICIAR AVENTURA"}
      </button>

      <div className="divider">
        <div className="divider-line" />
        <span className="divider-text">O</span>
        <div className="divider-line" />
      </div>

      <button className="guest-btn" onClick={() => onSuccess("login", "Invitado")}>
        👤 CONTINUAR COMO INVITADO
      </button>
    </div>
  );
}
