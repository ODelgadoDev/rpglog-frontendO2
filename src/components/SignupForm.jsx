import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { AVATARS } from "../data/settings";

export default function SignupForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [avatar, setAvatar] = useState("🧙");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();

  const handleSubmit = async () => {
    setError("");

    if (!username || username.trim().length < 2) {
      setError("▸ Elige un nombre de héroe (mín. 2 caracteres)");
      return;
    }
    if (!email.includes("@")) {
      setError("▸ Email inválido");
      return;
    }
    if (!birthdate) {
      setError("▸ La fecha de nacimiento es obligatoria");
      return;
    }
    if (pass.length < 6) {
      setError("▸ Contraseña muy corta (mín. 6)");
      return;
    }
    if (pass !== confirm) {
      setError("▸ Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      await register({
        username: username.trim(),
        email,
        password: pass,
        birthdate,
        avatar
      });
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
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
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
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="field">
        <label className="field-label">▸ FECHA DE NACIMIENTO</label>
        <div className="field-wrap">
          <span className="field-icon">📅</span>
          <input
            className="field-input"
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
          />
        </div>
      </div>

      <div className="field">
        <label className="field-label">▸ ELIGE TU AVATAR</label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: "8px",
            marginTop: "8px"
          }}
        >
          {AVATARS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAvatar(a)}
              style={{
                padding: "10px",
                fontSize: "1.4rem",
                borderRadius: "10px",
                border: avatar === a ? "2px solid #f5c842" : "1px solid #666",
                background: avatar === a ? "rgba(245,200,66,0.18)" : "transparent",
                cursor: "pointer"
              }}
            >
              {a}
            </button>
          ))}
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
            onChange={(e) => setPass(e.target.value)}
          />
          <button type="button" className="eye-btn" onClick={() => setShowPass((p) => !p)}>
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
            onChange={(e) => setConfirm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <button type="button" className="eye-btn" onClick={() => setShowConfirm((p) => !p)}>
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