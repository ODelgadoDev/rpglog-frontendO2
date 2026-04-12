/**
 * OfflineBanner.jsx — Banner de estado de conexión
 * ─────────────────────────────────────────────────────
 * Se muestra en la parte superior cuando el usuario está sin internet.
 * Desaparece automáticamente al reconectarse.
 */

export default function OfflineBanner({ online }) {
  if (online) return null;
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0,
      zIndex: 999,
      background: "#e05252",
      fontFamily: "var(--pixel)",
      fontSize: "0.46rem",
      color: "#fff",
      textAlign: "center",
      padding: "0.5rem",
      letterSpacing: "0.05em",
    }}>
      📡 SIN CONEXIÓN — TUS ACCIONES SE GUARDARÁN Y SINCRONIZARÁN AL RECONECTARTE
    </div>
  );
}
