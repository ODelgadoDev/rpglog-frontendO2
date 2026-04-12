/**
 * Navbar.jsx — Barra de navegación superior
 * FIX: El logo "RPG LOG" navega a "home" al hacer clic (ya funcionaba,
 *      pero se asegura que también el texto del logo sea clickeable)
 */
import { NAV_ITEMS } from "../data/constants";
import AvatarDropdown    from "./settings/AvatarDropdown";
import NotificationPanel from "./NotificationPanel";

const NAV_LINKS = NAV_ITEMS.filter(n => n.id !== "settings");

export default function Navbar({
  active, setActive,
  coins = 0,
  showDropdown, setShowDropdown,
  showNotifPanel, setShowNotifPanel,
  showHamburger, setShowHamburger,
  unreadCount = 0,
  notifs = [], setNotifs,
  user,
}) {

  const displayUser = user || { avatar: "🧙", name: "Héroe", title: "", level: 1, coins };

  const handleNavClick = (id) => {
    setActive(id);
    setShowHamburger(false);
    if (setShowDropdown)   setShowDropdown(false);
    if (setShowNotifPanel) setShowNotifPanel(false);
  };

  const toggleNotifPanel = (e) => {
    e.stopPropagation();
    setShowHamburger(false);
    if (setShowDropdown) setShowDropdown(false);
    setShowNotifPanel(p => !p);
  };

  const toggleAvatarDrop = (e) => {
    e.stopPropagation();
    setShowHamburger(false);
    if (setShowNotifPanel) setShowNotifPanel(false);
    setShowDropdown(p => !p);
  };

  const toggleHamburger = (e) => {
    e.stopPropagation();
    if (setShowDropdown)   setShowDropdown(false);
    if (setShowNotifPanel) setShowNotifPanel(false);
    setShowHamburger(p => !p);
  };

  return (
    <>
      <nav className="navbar">
        {/* ✅ FIX: Logo y texto navegan a "home" al hacer clic */}
        <div
          className="nav-logo"
          onClick={() => handleNavClick("home")}
          style={{ cursor: "pointer" }}
          title="Ir al inicio"
        >
          <span className="nav-logo-icon">🗡️</span>
          <span className="nav-logo-text">RPG LOG</span>
        </div>

        {/* Nav links (ocultos en móvil) */}
        <div className="nav-links nav-links-desktop">
          {NAV_LINKS.map(n => (
            <button
              key={n.id}
              className={`nav-link${active === n.id ? " active" : ""}`}
              onClick={() => handleNavClick(n.id)}
            >
              {n.label}
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div className="nav-right">
          <div className="nav-coins">🪙 {coins.toLocaleString()}</div>

          {/* Campana */}
          <div style={{ position: "relative" }}>
            <button
              className={`nav-bell${showNotifPanel ? " active" : ""}`}
              onClick={toggleNotifPanel}
              aria-label="Notificaciones"
            >
              🔔
              {unreadCount > 0 && (
                <span className="nav-bell-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
              )}
            </button>
            {showNotifPanel && (
              <NotificationPanel
                notifs={notifs}
                setNotifs={setNotifs}
                onClose={() => setShowNotifPanel(false)}
              />
            )}
          </div>

          {/* Avatar */}
          <div style={{ position: "relative" }}>
            <div
              className={`nav-avatar${showDropdown ? " active" : ""}`}
              onClick={toggleAvatarDrop}
            >
              {displayUser.avatar}
              {unreadCount > 0 && <div className="nav-avatar-unread" />}
            </div>
            {showDropdown && (
              <AvatarDropdown
                setActivePage={setActive}
                setShowDropdown={setShowDropdown}
                unreadCount={unreadCount}
                user={{ ...displayUser, coins }}
              />
            )}
          </div>

          {/* Hamburger — solo visible en móvil */}
          <button
            className={`nav-hamburger${showHamburger ? " open" : ""}`}
            onClick={toggleHamburger}
            aria-label="Menú"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Menú desplegable móvil */}
      {showHamburger && (
        <div className="nav-mobile-menu" onClick={e => e.stopPropagation()}>
          {NAV_LINKS.map(n => (
            <button
              key={n.id}
              className={`nav-mobile-item${active === n.id ? " active" : ""}`}
              onClick={() => handleNavClick(n.id)}
            >
              <span className="nav-mobile-icon">{n.icon || "▸"}</span>
              {n.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
