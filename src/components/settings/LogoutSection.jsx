/**
 * LogoutSection.jsx — Sección de cierre de sesión
 * ─────────────────────────────────────────────────────
 * Muestra un botón rojo de "CERRAR SESIÓN".
 * Al presionarlo, aparece un modal de confirmación (estilo peligro).
 *
 * El modal tiene dos opciones:
 *   SALIR    — llama a onLogout() que vuelve a AuthScreen en App.jsx
 *   CANCELAR — cierra el modal sin hacer nada
 *
 * Props:
 *   onLogout — callback de App.jsx que setIsAuthenticated(false)
 *
 * Estilos: SettingsScreen.css (.logout-btn, .logout-confirm-modal, .lcm-*)
 */
import { useState } from "react";

export default function LogoutSection({ onLogout }) {
  const [confirm, setConfirm] = useState(false);

  return (
    <div className="settings-block">
      <div className="settings-block-header">
        <span className="settings-block-icon">🚪</span>
        <span className="settings-block-title">SESIÓN</span>
      </div>
      <div className="settings-block-body">
        <div style={{ fontFamily: "var(--vt)", fontSize: "1.05rem", color: "var(--text-dim)", lineHeight: 1.5 }}>
          Al cerrar sesión se guardará tu progreso y podrás volver a iniciar sesión cuando quieras.
        </div>
        <button className="logout-btn" onClick={() => setConfirm(true)}>
          🚪 CERRAR SESIÓN
        </button>
      </div>

      {confirm && (
        <div className="logout-modal-overlay" onClick={() => setConfirm(false)}>
          <div className="logout-confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="lcm-corner-bl" />
            <div className="lcm-corner-br" />
            <div className="lcm-icon">🚪</div>
            <div className="lcm-title">¿CERRAR SESIÓN?</div>
            <div className="lcm-desc">
              Tu progreso está guardado.<br />
              Puedes volver cuando quieras.
            </div>
            <div className="lcm-btns">
              <button className="lcm-danger" onClick={onLogout}>SÍ, SALIR</button>
              <button className="lcm-cancel" onClick={() => setConfirm(false)}>CANCELAR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
