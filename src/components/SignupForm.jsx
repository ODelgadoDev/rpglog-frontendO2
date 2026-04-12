/**
 * SignupForm.jsx — Formulario de registro
 * ─────────────────────────────────────────────────────
 * Conectado al backend real via authApi.register().
 *
 * Props:
 *   onSuccess(mode, username, authData?) — callback al registro exitoso
 */
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function SignupForm() {
  const [username,    setUsername]    = useState("");
  const [email,       setEmail]       = useState("");
  const [pass,        setPass]        = useState("");
  const [confirm,     setConfirm]     = useState("");
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const { register } = useAuth();

  const handleSubmit = async () => {
    setError("");
    if (!username || username.trim().length < 2) { setError("▸ Elige un nombre de héroe (mín. 2 caracteres)"); return; }
    if (!email.includes("@"))                    { setError("▸ Email inválido"); return; }
    if (pass.length < 6)                         { setError("▸ Contraseña muy corta (mín. 6)"); return; }
    if (pass !== confirm)                        { setError("▸ Las contraseñas no coinciden"); return; }

    setLoading(true);
    try {
      await register({ username: username.trim(), email, password: pass });
      // AuthProvider sets global state; nothing else required here.
    } catch (err) {
      setError(`▸ ${err.message || "Error al crear la cuenta"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-body">
      <div className="field">
        <label className="field-label">▸ NOMBRE DE HÉROE</label>
        <div className="field-wrap">
          <span className="field-icon">⚔️</span>
          <input
            className="field-input"
            type="text"
            placeholder="ej: DragonSlayer99"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
          />
        </div>
      </div>

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
          />
          <button className="eye-btn" onClick={() => setShowPass(p => !p)}>
            {showPass ? "🙈" : "👁️"}
          </button>
        </div>
      </div>

      <div className="field">
        <label className="field-label">▸ CONFIRMAR CONTRASEÑA</label>
        <div className="field-wrap">
          <span className="field-icon">🔑</span>
          <input
            className="field-input"
            type={showConfirm ? "text" : "password"}
            placeholder="••••••••"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
          />
          <button className="eye-btn" onClick={() => setShowConfirm(p => !p)}>
            {showConfirm ? "🙈" : "👁️"}
          </button>
        </div>
      </div>

      {error && <div className="error-msg">{error}</div>}

      <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
        {loading
          ? <span>CREANDO HÉROE<span className="btn-loading">...</span></span>
          : "▶ CREAR PERSONAJE"}
      </button>
    </div>
  );
}
