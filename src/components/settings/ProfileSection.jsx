/**
 * ProfileSection.jsx — Perfil del héroe
 * ─────────────────────────────────────────────────────
 * Campos editables:
 *   • Avatar (selector de emojis)
 *   • Nombre de héroe (máx. 20 caracteres)
 *   • Fecha de nacimiento — la edad se calcula automáticamente
 *     (solo se muestra "Edad: 22", sin texto "calculada" ni emojis)
 *   • Propósito personal (por qué usas la app, máx. 200 caracteres)
 *
 * Persistencia: localStorage["rpglog_profile_{userId}"] = { birthday, purpose }
 *
 * Cumpleaños: si hoy coincide con el día/mes de la fecha de nacimiento,
 * se muestra un banner dorado animado de felicitación.
 *
 * Superusuario: toggle discreto al final del formulario.
 * Los superusuarios pueden jugar minijuegos sin límite de partidas.
 * Se activa desde esta pantalla y se persiste en localStorage.
 */
import { useState, useEffect } from "react";
import { AVATARS } from "../../data/settings";

const lsProfileKey = (name) => `rpglog_profile_${(name||"user").toLowerCase().replace(/\s+/g,"_")}`;

function loadExtra(name) {
  try { return JSON.parse(localStorage.getItem(lsProfileKey(name))) || {}; }
  catch { return {}; }
}
function saveExtra(name, data) {
  localStorage.setItem(lsProfileKey(name), JSON.stringify(data));
}

function isBirthdayToday(dateStr) {
  if (!dateStr) return false;
  try {
    const [, month, day] = dateStr.split("-");
    const now = new Date();
    return parseInt(month) === now.getMonth() + 1 && parseInt(day) === now.getDate();
  } catch { return false; }
}

export default function ProfileSection({ user, setUser, isSuperUser = false, onToggleSuperUser }) {
  const extra = loadExtra(user.name);

  const [name,     setName]     = useState(user.name);
  const [avatar,   setAvatar]   = useState(user.avatar);
  const [birthday, setBirthday] = useState(extra.birthday || "");
  // Edad se calcula automáticamente desde la fecha de nacimiento
  const calcAge = (bday) => {
    if (!bday) return null;
    const born = new Date(bday);
    const today = new Date();
    let age = today.getFullYear() - born.getFullYear();
    const m = today.getMonth() - born.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < born.getDate())) age--;
    return age > 0 ? age : null;
  };
  const calculatedAge = calcAge(birthday);
  const [purpose,  setPurpose]  = useState(extra.purpose  || "");
  const [saved,    setSaved]    = useState(false);

  const dirty = name !== user.name || avatar !== user.avatar ||
    birthday !== (extra.birthday||"") ||
    purpose !== (extra.purpose||"");

  const todayIsBirthday = isBirthdayToday(birthday);

  const save = () => {
    setUser(p => ({ ...p, name: name.trim() || p.name, avatar }));
    saveExtra(name.trim() || user.name, { birthday, purpose });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>

      {/* 🎂 Banner de cumpleaños */}
      {todayIsBirthday && (
        <div className="birthday-banner">
          🎂 ¡Feliz cumpleaños, {name || user.name}! Que este nivel sea el mejor hasta ahora. 🎉
        </div>
      )}

      <div className="settings-block">
        <div className="settings-block-header">
          <span className="settings-block-icon">🧙</span>
          <span className="settings-block-title">PERFIL Y AVATAR</span>
        </div>
        <div className="settings-block-body">

          {/* Preview */}
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

          {/* Nombre */}
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

          {/* Fecha de nacimiento */}
          <div className="field-row">
            <label className="field-label-settings">▸ FECHA DE NACIMIENTO</label>
            <div className="field-wrap">
              <input
                className="field-input-settings"
                type="date"
                value={birthday}
                onChange={e => setBirthday(e.target.value)}
              />
            </div>
            {calculatedAge !== null && (
              <div className="field-char-limit" style={{ color:"var(--text-dim)" }}>
                Edad: {calculatedAge}
              </div>
            )}
          </div>

          {/* Propósito */}
          <div className="field-row">
            <label className="field-label-settings">▸ ¿POR QUÉ USAS RPG LOG?</label>
            <textarea
              className="field-input-settings"
              style={{ minHeight:"72px", resize:"vertical", lineHeight:1.5 }}
              value={purpose}
              onChange={e => setPurpose(e.target.value)}
              maxLength={200}
              placeholder="ej: Quiero crear hábitos de ejercicio y lectura diaria..."
            />
            <div className="field-char-limit">{purpose.length}/200</div>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:".8rem" }}>
            <button className="save-btn" disabled={!dirty} onClick={save}>
              💾 GUARDAR CAMBIOS
            </button>
            {saved && <span className="save-success">✓ GUARDADO</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
