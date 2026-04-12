/**
 * AvatarDropdown.jsx — FIXED: agrega opción "Instalar aplicación" antes de cerrar sesión
 *
 * Cambio: recibe canInstall y onInstall como props opcionales.
 * Si canInstall=true muestra el item de instalación PWA.
 */
export default function AvatarDropdown({
  setActivePage,
  setShowDropdown,
  unreadCount,
  user,
  // PWA props nuevas:
  canInstall = false,
  onInstall,
}) {
  const go = (page) => { setActivePage(page); setShowDropdown(false); };

  return (
    <div className="dropdown-panel">
      <div className="dp-corner-bl" />
      <div className="dp-corner-br" />

      {/* User header */}
      <div className="dp-header">
        <div className="dp-header-top">
          <span className="dp-avatar-lg">{user.avatar}</span>
          <div>
            <div className="dp-username">{user.name}</div>
            <div className="dp-title-tag">{user.title}</div>
          </div>
        </div>
        <div className="dp-level">NIVEL {user.level} · 🪙 {(user.coins || 0).toLocaleString()}</div>
      </div>

      {/* Menu items */}
      <button className="dp-item" onClick={() => go("settings-profile")}>
        <span className="dp-item-icon">🧙</span>
        <span className="dp-item-label">PERFIL Y AVATAR</span>
        <span className="dp-item-arrow">›</span>
      </button>

      <button className="dp-item" onClick={() => go("settings-wallet")}>
        <span className="dp-item-icon">🪙</span>
        <span className="dp-item-label">MONEDERO</span>
        <span className="dp-item-arrow">›</span>
      </button>

      <button className="dp-item" onClick={() => go("settings-notifs")}>
        <span className="dp-item-icon">🔔</span>
        <span className="dp-item-label">NOTIFICACIONES</span>
        {unreadCount > 0
          ? <div className="dp-notif-dot" />
          : <span className="dp-item-arrow">›</span>
        }
      </button>

      <button className="dp-item" onClick={() => go("settings-gps")}>
        <span className="dp-item-icon">📡</span>
        <span className="dp-item-label">GPS</span>
        <span className="dp-item-arrow">›</span>
      </button>

      {/* ── NUEVO: Instalar PWA (solo si canInstall) ── */}
      {canInstall && (
        <button
          className="dp-item"
          onClick={() => { setShowDropdown(false); onInstall?.(); }}
        >
          <span className="dp-item-icon">📲</span>
          <span className="dp-item-label">INSTALAR APLICACIÓN</span>
          <span className="dp-item-arrow">›</span>
        </button>
      )}

      <button className="dp-item danger" onClick={() => go("settings-logout")}>
        <span className="dp-item-icon">🚪</span>
        <span className="dp-item-label">CERRAR SESIÓN</span>
      </button>
    </div>
  );
}