/**
 * ProfileSection.jsx — Sección de perfil en ajustes
 * ─────────────────────────────────────────────────────
 * Permite al usuario personalizar su identidad en la app:
 *
 *   • Selector de avatar (grid de 12 emojis)
 *   • Campo de nombre de usuario (máx. 20 caracteres)
 *   • Botón GUARDAR con feedback de éxito temporal
 *
 * El avatar y nombre cambian de inmediato en el estado local.
 * Al integrar backend, el botón GUARDAR debería hacer PATCH /users/:id/profile.
 *
 * Props:
 *   user    — objeto actual { name, avatar, title, level }
 *   setUser — actualiza el usuario en HomeScreen (estado compartido)
 *
 * Datos: AVATARS (array de emojis) desde data/settings.js
 * Estilos: SettingsScreen.css (.avatar-grid, .avatar-opt, .field-wrap)
 */
import { useEffect, useState } from "react";
import { AVATARS } from "../../data/settings";
import { authApi, getToken } from "../../services/api";

export default function ProfileSection({ user, setUser }) {
  const [name, setName]     = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);
  const [birthdate, setBirthdate] = useState(user.birthdate || "");
  const [saved, setSaved]   = useState(false);

  useEffect(() => {
    setName(user.name);
    setAvatar(user.avatar);
    setBirthdate(user.birthdate || "");
  }, [user.name, user.avatar, user.birthdate]);

  const normalizedName = name.trim();
  const dirty = normalizedName !== user.name || avatar !== user.avatar || birthdate !== (user.birthdate || "");
  const canSave = normalizedName.length > 0 && !!birthdate && dirty;

  const save = async () => {
    if (!canSave) return;

    const hasToken = !!getToken();
    if (hasToken) {
      try {
        const data = await authApi.updateProfile({ username: normalizedName, birthdate });
        if (data.user) {
          setUser((p) => ({
            ...p,
            name: data.user.username || p.name,
            avatar,
            birthdate: data.user.birthdate
              ? new Date(data.user.birthdate).toISOString().split("T")[0]
              : birthdate,
          }));
        }
      } catch (err) {
        // Fallback to local
        setUser((p) => ({ ...p, name: normalizedName || p.name, avatar, birthdate }));
      }
    } else {
      setUser((p) => ({ ...p, name: normalizedName || p.name, avatar, birthdate }));
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="settings-block">
      <div className="settings-block-header">
        <span className="settings-block-icon">🧙</span>
        <span className="settings-block-title">PERFIL Y AVATAR</span>
      </div>
      <div className="settings-block-body">

        {/* Current preview */}
        <div className="avatar-row">
          <div className="avatar-big">
            {avatar}
            <div className="avatar-big-edit">✏️</div>
          </div>
          <div>
            <div className="avatar-info-username">{name || user.name}</div>
            <div className="avatar-info-title">{user.title}</div>
            <div className="avatar-info-level">NIVEL {user.level}</div>
          </div>
        </div>

        {/* Avatar picker */}
        <div>
          <div className="avatar-picker-label">▸ ELIGE TU AVATAR</div>
          <div className="avatar-grid">
            {AVATARS.map(a => (
              <button
                key={a}
                className={`avatar-opt${avatar === a ? " selected" : ""}`}
                onClick={() => setAvatar(a)}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Name input */}
        <div className="field-row">
          <label className="field-label-settings">▸ NOMBRE DE HÉROE</label>
          <div className="field-wrap">
            <input
              className="field-input-settings"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={20}
              placeholder={user.name}
            />
          </div>
          <div className="field-char-limit">{name.length}/20</div>
        </div>

        {/* Birthdate input */}
        <div className="field-row">
          <label className="field-label-settings">▸ FECHA DE NACIMIENTO</label>
          <div className="field-wrap">
            <input
              className="field-input-settings"
              type="date"
              value={birthdate}
              onChange={e => setBirthdate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: ".8rem" }}>
          <button className="save-btn" disabled={!canSave} onClick={save}>
            💾 GUARDAR CAMBIOS
          </button>
          {saved && <span className="save-success">✓ GUARDADO</span>}
        </div>
        {!birthdate && (
          <div className="field-char-limit" style={{ color: "var(--orange)" }}>
            La fecha de nacimiento es obligatoria para guardar el perfil.
          </div>
        )}
      </div>
    </div>
  );
}
