/**
 * LoginForm.jsx — Formulario de inicio de sesión
 * ─────────────────────────────────────────────────────
 * Conectado al backend real via authApi.login().
 * En caso de error de red muestra un mensaje de error y no crea usuarios locales.
 *
 * Props:
 *   onSuccess(mode, username, authData?) — callback al login exitoso
 *     authData: { user, profile, stats } del backend
 */
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function LoginForm() {
  const [email,    setEmail]    = useState("");
  const [pass,     setPass]     = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const { login } = useAuth();

  const handleSubmit = async () => {
    setError("");
    if (!email || !pass)      { setError("▸ Completa todos los campos"); return; }
    if (!email.includes("@")) { setError("▸ Email inválido"); return; }

    setLoading(true);
    try {
      await login({ email, password: pass });
      // AuthProvider actualizará el estado global si el login es exitoso.
    } catch (err) {
      setError(`▸ ${err.message || "Error al conectar con el servidor"}`);
    } finally {
      setLoading(false);
    }
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

      {/* Guest mode removed: only registered users may log in to persist data */}
    </div>
  );
}
