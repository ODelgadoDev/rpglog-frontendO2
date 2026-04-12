/**
 * NotificationsSection.jsx - Seccion de notificaciones en ajustes
 */
import { NOTIF_SETTINGS } from "../../data/settings";

const Toggle = ({ checked, onChange }) => (
  <label className="toggle-wrap">
    <input
      type="checkbox"
      className="toggle-input"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
    <span className="toggle-track" />
  </label>
);

export default function NotificationsSection({
  notifs,
  setNotifs,
  prefs,
  setPrefs,
}) {
  const unread = notifs.filter((n) => !n.read);
  const markAll = () => setNotifs((p) => p.map((n) => ({ ...n, read: true })));
  const markOne = (id) =>
    setNotifs((p) => p.map((n) => (n.id === id ? { ...n, read: true } : n)));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div className="settings-block">
        <div className="settings-block-header">
          <span className="settings-block-icon">⚙️</span>
          <span className="settings-block-title">PREFERENCIAS</span>
        </div>
        <div
          className="settings-block-body"
          style={{ gap: 0, padding: ".55rem 1.1rem" }}
        >
          {NOTIF_SETTINGS.map((n) => (
            <div key={n.id} className="notif-toggle-row">
              <div className="notif-info">
                <div className="notif-name">{n.name}</div>
                <div className="notif-desc">{n.desc}</div>
              </div>
              <Toggle
                checked={prefs?.[n.id] !== false}
                onChange={(value) =>
                  setPrefs((prev) => ({ ...prev, [n.id]: value }))
                }
              />
            </div>
          ))}
        </div>
      </div>

      <div className="settings-block">
        <div className="settings-block-header">
          <span className="settings-block-icon">🔔</span>
          <span className="settings-block-title">
            BANDEJA
            {unread.length > 0 && (
              <span className="notif-badge">
                {unread.length} nueva{unread.length !== 1 ? "s" : ""}
              </span>
            )}
          </span>
        </div>

        {unread.length > 0 && (
          <div
            style={{
              padding: ".55rem 1.1rem .3rem",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button className="notif-clear" onClick={markAll}>
              MARCAR TODO LEIDO
            </button>
          </div>
        )}

        <div className="notif-list">
          {notifs.map((n) => (
            <div
              key={n.id}
              className={`notif-item${!n.read ? " unread" : ""}`}
              onClick={() => markOne(n.id)}
            >
              <div className={`notif-dot${n.read ? " read" : ""}`} />
              <span className="notif-item-icon">{n.icon}</span>
              <div>
                <div className="notif-item-title">{n.title}</div>
                <div className="notif-item-desc">{n.desc}</div>
                <div className="notif-item-time">{n.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
