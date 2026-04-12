/**
 * SettingsScreen.jsx — Pantalla de configuración
 * ─────────────────────────────────────────────────────
 * Enruta hacia las diferentes secciones de ajustes según activePage.
 * No tiene navegación propia; usa el activePage de HomeScreen.
 *
 * Secciones disponibles:
 *   "settings-profile" → ProfileSection  (avatar, nombre de usuario)
 *   "settings-wallet"  → WalletSection   (saldo de monedas e historial)
 *   "settings-notifs"  → NotificationsSection (toggles e inbox)
 *   "settings-logout"  → LogoutSection   (botón de cierre de sesión)
 *
 * Props recibidos de HomeScreen:
 *   activePage, user, setUser, coins, notifs, setNotifs, onLogout
 *
 * Estilos: SettingsScreen.css (importado en este archivo)
 */
import "../styles/SettingsScreen.css";
import ProfileSection       from "../components/settings/ProfileSection";
import WalletSection        from "../components/settings/WalletSection";
import NotificationsSection from "../components/settings/NotificationsSection";
import LogoutSection        from "../components/settings/LogoutSection";
import GpsSection           from "../components/settings/GpsSection";

const SECTION_TITLES = {
  "settings-profile": "👤 PERFIL",
  "settings-wallet":  "🪙 MONEDERO",
  "settings-notifs":  "🔔 NOTIFICACIONES",
  "settings-logout":  "🚪 SESIÓN",
  "settings-gps":     "📡 GPS",
};

export default function SettingsScreen({
  section,
  user,
  setUser,
  notifs,
  setNotifs,
  notifPrefs,
  setNotifPrefs,
  walletHistory,
  weeklyCoins,
  onLogout,
  gpsEnabled,
  gpsStatus,
  lastCoords,
  onToggleGps,
}) {
  return (
    <div className="settings-page">

      {/* Breadcrumb */}
      <div className="settings-breadcrumb">
        <span>CONFIG</span>
        <span>›</span>
        <span className="settings-breadcrumb-active">{SECTION_TITLES[section]}</span>
      </div>

      {section === "settings-profile" && (
        <ProfileSection user={user} setUser={setUser} />
      )}
      {section === "settings-wallet" && (
        <WalletSection
          coins={user.coins}
          txHistory={walletHistory}
          weeklyCoins={weeklyCoins}
        />
      )}
      {section === "settings-notifs" && (
        <NotificationsSection
          notifs={notifs}
          setNotifs={setNotifs}
          prefs={notifPrefs}
          setPrefs={setNotifPrefs}
        />
      )}
      {section === "settings-logout" && (
        <LogoutSection onLogout={onLogout} />
      )}
      {section === "settings-gps" && (
        <GpsSection
          gpsEnabled={gpsEnabled}
          gpsStatus={gpsStatus}
          lastCoords={lastCoords}
          onToggleGps={onToggleGps}
        />
      )}
    </div>
  );
}
