/**
 * NotificationPanel.jsx — Panel de notificaciones del Navbar
 * ─────────────────────────────────────────────────────
 * Dropdown que se abre al pulsar el ícono de campana en el Navbar.
 * Muestra la lista completa de notificaciones con acciones rápidas.
 *
 * Separado del AvatarDropdown para que sea accesible directamente
 * sin pasar por ajustes.
 *
 * Props:
 *   notifs      — array de notificaciones (estado desde HomeScreen)
 *   setNotifs   — actualiza el array (para marcar leídas / limpiar)
 *   onClose     — cierra el panel
 *
 * Estilos: SettingsScreen.css + clases nuevas (.notif-panel, .np-*)
 */
export default function NotificationPanel({ notifs, setNotifs, onClose }) {
  const unread  = notifs.filter(n => !n.read).length;

  const markAll = () => setNotifs(p => p.map(n => ({ ...n, read: true })));
  const markOne = (id) => setNotifs(p => p.map(n => n.id === id ? { ...n, read: true } : n));
  const clearAll = () => setNotifs([]);

  return (
    <div className="notif-panel" onClick={e => e.stopPropagation()}>
      {/* Esquinas pixel */}
      <div className="np-corner-tl" /><div className="np-corner-tr" />
      <div className="np-corner-bl" /><div className="np-corner-br" />

      {/* Header */}
      <div className="np-header">
        <div className="np-title">
          🔔 NOTIFICACIONES
          {unread > 0 && <span className="np-badge">{unread}</span>}
        </div>
        <div className="np-actions">
          {unread > 0 && (
            <button className="np-btn" onClick={markAll}>LEER TODO</button>
          )}
          {notifs.length > 0 && (
            <button className="np-btn danger" onClick={clearAll}>LIMPIAR</button>
          )}
        </div>
      </div>

      {/* Lista */}
      <div className="np-list">
        {notifs.length === 0 ? (
          <div className="np-empty">
            <div className="np-empty-icon">🔕</div>
            <div className="np-empty-text">SIN NOTIFICACIONES</div>
          </div>
        ) : (
          notifs.map(n => (
            <div
              key={n.id}
              className={`np-item${!n.read ? " unread" : ""}`}
              onClick={() => markOne(n.id)}
            >
              {!n.read && <div className="np-dot" />}
              <span className="np-item-icon">{n.icon}</span>
              <div className="np-item-body">
                <div className="np-item-title">{n.title}</div>
                <div className="np-item-desc">{n.desc}</div>
                <div className="np-item-time">{n.time}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
