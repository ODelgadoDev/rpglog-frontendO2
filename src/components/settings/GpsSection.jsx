/**
 * GpsSection.jsx — Sección de configuración GPS
 * ─────────────────────────────────────────────────────
 * Permite al usuario activar o desactivar el rastreo de ubicación.
 *
 * ESTADOS DEL GPS:
 *   disabled  — el usuario lo tiene apagado (por defecto)
 *   requesting — se está solicitando el permiso al navegador
 *   active    — GPS activo, recibiendo coordenadas
 *   denied    — el usuario negó el permiso en el navegador
 *   unsupported — el dispositivo no tiene geolocalización
 *
 * Cuando el GPS está activo:
 *   • Se muestra la última ubicación conocida (lat/lng + precisión)
 *   • Las misiones con "bonus de ubicación" pueden reclamar el bonus
 *     automáticamente al completarlas sin que el usuario tenga que
 *     pulsar un botón extra
 *   • Se envía la ubicación al backend vía evidence/location
 *
 * Props:
 *   gpsEnabled       (boolean) — estado global desde HomeScreen
 *   gpsStatus        (string)  — "disabled"|"requesting"|"active"|"denied"|"unsupported"
 *   lastCoords       (object|null) — { latitude, longitude, accuracy }
 *   onToggleGps()    — activa o desactiva el GPS
 *
 * Estilos: SettingsScreen.css (.gps-section-*)
 */
export default function GpsSection({ gpsEnabled, gpsStatus, lastCoords, onToggleGps }) {
  const statusLabel = {
    disabled:    { icon: "📍", text: "GPS DESACTIVADO",           color: "var(--text-dim)" },
    requesting:  { icon: "🔄", text: "SOLICITANDO PERMISO...",    color: "var(--gold)"     },
    active:      { icon: "✅", text: "GPS ACTIVO",                color: "#52c97a"         },
    denied:      { icon: "⛔", text: "PERMISO DENEGADO",          color: "#e05252"         },
    unsupported: { icon: "❌", text: "DISPOSITIVO NO COMPATIBLE", color: "#e05252"         },
  }[gpsStatus] || { icon: "📍", text: "—", color: "var(--text-dim)" };

  return (
    <div className="settings-block">
      <div className="settings-block-header">
        <span className="settings-block-icon">📡</span>
        <span className="settings-block-title">RASTREO GPS</span>
      </div>

      <div className="settings-block-body" style={{ gap: "1rem" }}>

        {/* Estado actual */}
        <div className="gps-status-row">
          <span className="gps-status-icon">{statusLabel.icon}</span>
          <span className="gps-status-text" style={{ color: statusLabel.color }}>
            {statusLabel.text}
          </span>
        </div>

        {/* Última ubicación conocida */}
        {gpsStatus === "active" && lastCoords && (
          <div className="gps-coords-card">
            <div className="gps-coords-label">ÚLTIMA POSICIÓN</div>
            <div className="gps-coords-vals">
              <span>🌐 {lastCoords.latitude.toFixed(5)}, {lastCoords.longitude.toFixed(5)}</span>
              {lastCoords.accuracy && (
                <span className="gps-accuracy">± {Math.round(lastCoords.accuracy)}m</span>
              )}
            </div>
          </div>
        )}

        {/* Descripción del beneficio */}
        <div className="gps-desc">
          Activa el GPS para que las misiones de actividad física puedan verificar
          tu ubicación automáticamente y otorgarte el <strong>bonus de movimiento</strong>.
          Tus datos de ubicación solo se comparten con el servidor al completar una misión.
        </div>

        {/* Toggle principal */}
        {gpsStatus !== "unsupported" && (
          <button
            className={`gps-toggle-btn${gpsEnabled ? " active" : ""}`}
            onClick={onToggleGps}
            disabled={gpsStatus === "requesting"}
          >
            {gpsStatus === "requesting"
              ? "🔄 SOLICITANDO..."
              : gpsEnabled
                ? "📡 DESACTIVAR GPS"
                : "📡 ACTIVAR GPS"}
          </button>
        )}

        {/* Mensaje si fue denegado */}
        {gpsStatus === "denied" && (
          <div className="gps-denied-msg">
            Permiso denegado por el navegador. Para activarlo ve a Configuración
            del sitio en tu navegador y permite el acceso a la ubicación.
          </div>
        )}

        {/* Misiones que usan GPS */}
        <div className="gps-missions-info">
          <div className="gps-missions-title">▸ MISIONES CON BONUS GPS</div>
          <div className="gps-mission-item">🏃 30 min cardio — +25 XP · 🪙+10</div>
          <div className="gps-mission-item">⚡ Sprint de 100m — +20 XP · 🪙+8</div>
          <div className="gps-mission-item">⚡ Misión especial del día — +30 XP · 🪙+15</div>
        </div>
      </div>
    </div>
  );
}
