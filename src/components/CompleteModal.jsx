/**
 * CompleteModal.jsx — Modal de completar misión
 * ─────────────────────────────────────────────────────
 * Se muestra al confirmar una misión. Presenta las recompensas y
 * permite dos tipos de evidencia opcionales:
 *
 * 📸 FOTO (×2 XP):
 *   Si la misión tiene photoEvidenceEnabled → input de cámara.
 *   Al tomar foto: XP se duplica Y se llama a la API (en background).
 *
 * 📍 UBICACIÓN GPS (bonus extra):
 *   Si la misión tiene locationEvidenceEnabled → botón GPS.
 *   Usa navigator.geolocation para capturar lat/lng.
 *   Se envía al backend después de completar.
 *   Si el navegador no soporta GPS o el usuario lo niega → muestra mensaje.
 *
 * Props:
 *   mission   — objeto de la misión completada
 *   onClose   — cierra el modal SIN aplicar recompensas (tap en overlay)
 *   onDone(finalXp, questId, coords) — confirma recompensas.
 *              questId y coords se usan en MissionsScreen para llamar
 *              a los endpoints de evidencia del backend.
 *
 * Estilos: MissionsScreen.css
 */
import { useState, useRef } from "react";

export default function CompleteModal({ mission, onClose, onDone, gpsEnabled = false, lastCoords = null }) {
  const [photoTaken,   setPhotoTaken]   = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [gpsState,     setGpsState]     = useState("idle"); // idle | loading | ok | denied | unsupported
  const [gpsCoords,    setGpsCoords]    = useState(null);   // { latitude, longitude, accuracy }
  const fileInputRef = useRef(null);

  // Si el GPS está activo y la misión lo soporta, las coordenadas
  // se toman automáticamente de lastCoords sin acción del usuario.
  const autoGps = gpsEnabled && lastCoords && mission?.locationEvidenceEnabled && !mission?.locationBonusApplied;
  // Para GPS manual (GPS desactivado), se mantiene el flujo de botón.
  const showManualGps = !gpsEnabled && mission?.locationEvidenceEnabled && !mission?.locationBonusApplied;
  const [manualGpsState, setManualGpsState] = useState("idle");
  const [manualCoords,   setManualCoords]   = useState(null);

  if (!mission) return null;

  const isSpecial    = !!mission.stats;
  const hasPhoto     = mission.photoEvidenceEnabled     && !mission.photoBonusApplied;
  const hasLocation  = mission.locationEvidenceEnabled  && !mission.locationBonusApplied;

  const baseXp   = mission.xp;
  const finalXp  = photoTaken ? baseXp * 2 : baseXp;

  // ── Foto ──────────────────────────────────────────────────────
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
    setPhotoTaken(true);
  };

  // ── GPS ───────────────────────────────────────────────────────
  const handleManualGps = () => {
    if (!navigator.geolocation) { setManualGpsState("unsupported"); return; }
    setManualGpsState("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setManualCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude, accuracy: pos.coords.accuracy, capturedAt: new Date().toISOString() });
        setManualGpsState("ok");
      },
      () => setManualGpsState("denied"),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleGps = () => {
    if (!navigator.geolocation) {
      setGpsState("unsupported");
      return;
    }
    setGpsState("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsCoords({
          latitude:   pos.coords.latitude,
          longitude:  pos.coords.longitude,
          accuracy:   pos.coords.accuracy,
          capturedAt: new Date().toISOString(),
        });
        setGpsState("ok");
      },
      () => setGpsState("denied"),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // ── Confirmar ─────────────────────────────────────────────────
  const handleConfirm = () => {
    // Coordenadas: auto (GPS activo) > manual (botón pulsado) > null
    const coords = autoGps ? lastCoords : (manualCoords || gpsCoords);
    if (onDone) onDone(finalXp, mission._id || mission.id, coords);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-corner-bl" /><div className="modal-corner-br" />

        <div className="modal-icon">{isSpecial ? "⚡" : "🏆"}</div>
        <div className="modal-title">
          {isSpecial ? "¡MISIÓN ESPECIAL!" : "¡MISIÓN COMPLETADA!"}
        </div>
        <div className="modal-mission">{mission.name}</div>

        {/* Recompensas */}
        <div className="modal-rewards">
          <div className="modal-reward">
            <div className={`modal-reward-val${photoTaken ? " x2" : ""}`}>
              +{finalXp} XP {photoTaken && "✕2"}
            </div>
            <div className="modal-reward-label">EXPERIENCIA</div>
          </div>
          <div className="modal-reward">
            <div className="modal-reward-val coins">+{mission.coins} 🪙</div>
            <div className="modal-reward-label">MONEDAS</div>
          </div>
        </div>

        {/* ── Evidencia de foto ──────────────────────────────── */}
        {hasPhoto && (
          !photoTaken ? (
            <div className="modal-photo-section">
              <div className="modal-photo-title">📸 BONUS × 2 XP</div>
              <div className="modal-photo-desc">
                Toma una foto como evidencia y duplica tu XP ganada
              </div>
              <button className="modal-photo-btn" onClick={() => fileInputRef.current?.click()}>
                📷 TOMAR FOTO
              </button>
              <input
                ref={fileInputRef}
                className="photo-input"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoChange}
              />
            </div>
          ) : (
            <div className="modal-photo-section">
              {photoPreview && <img className="modal-photo-preview" src={photoPreview} alt="Evidencia" />}
              <div className="modal-photo-taken">
                <span>✅</span>
                <span className="modal-photo-taken-text">¡FOTO TOMADA! XP DUPLICADO</span>
              </div>
            </div>
          )
        )}

        {/* ── Evidencia de ubicación GPS ─────────────────────── */}
        {/* Auto GPS: GPS activo → muestra badge automático */}
        {autoGps && (
          <div className="modal-gps-section" style={{ background: "rgba(82,201,122,.08)", borderColor: "rgba(82,201,122,.35)" }}>
            <div className="modal-gps-status ok">
              📡 BONUS GPS AUTOMÁTICO
              <div className="modal-gps-coords">
                {lastCoords.latitude.toFixed(5)}, {lastCoords.longitude.toFixed(5)}
                {lastCoords.accuracy && ` (±${Math.round(lastCoords.accuracy)}m)`}
              </div>
            </div>
            <div style={{ fontFamily: "var(--vt)", fontSize: "1rem", color: "var(--text-dim)", textAlign: "center" }}>
              Tu ubicación se añadirá como evidencia al completar
            </div>
          </div>
        )}

        {/* Manual GPS: GPS desactivado → botón opcional */}
        {showManualGps && (
          <div className="modal-gps-section">
            {manualGpsState === "idle" && (
              <>
                <div className="modal-gps-title">📍 BONUS UBICACIÓN</div>
                <div className="modal-gps-desc">Activa GPS en Ajustes para captura automática, o presiona para hacerlo ahora</div>
                <button className="modal-gps-btn" onClick={handleManualGps}>📡 CAPTURAR UBICACIÓN</button>
              </>
            )}
            {manualGpsState === "loading" && <div className="modal-gps-status loading">🔄 Obteniendo ubicación...</div>}
            {manualGpsState === "ok" && (
              <div className="modal-gps-status ok">
                ✅ Ubicación capturada
                <div className="modal-gps-coords">
                  {manualCoords?.latitude?.toFixed(5)}, {manualCoords?.longitude?.toFixed(5)}
                  {manualCoords?.accuracy && ` (±${Math.round(manualCoords.accuracy)}m)`}
                </div>
              </div>
            )}
            {(manualGpsState === "denied" || manualGpsState === "unsupported") && (
              <div className="modal-gps-status denied">⚠ GPS no disponible. Puedes continuar sin el bonus.</div>
            )}
          </div>
        )}

        {/* Evidencia de ubicación GPS (flujo antiguo con gpsCoords) — para misiones del backend */}
        {!autoGps && !showManualGps && hasLocation && (
          <div className="modal-gps-section">
            {gpsState === "idle" && (
              <>
                <div className="modal-gps-title">📍 BONUS GPS</div>
                <div className="modal-gps-desc">
                  Comparte tu ubicación para verificar que saliste y obtén monedas extra
                </div>
                <button className="modal-gps-btn" onClick={handleGps}>
                  📡 COMPARTIR UBICACIÓN
                </button>
              </>
            )}
            {gpsState === "loading" && (
              <div className="modal-gps-status loading">
                🔄 Obteniendo ubicación...
              </div>
            )}
            {gpsState === "ok" && (
              <div className="modal-gps-status ok">
                ✅ Ubicación capturada
                <div className="modal-gps-coords">
                  {gpsCoords?.latitude?.toFixed(5)}, {gpsCoords?.longitude?.toFixed(5)}
                  {gpsCoords?.accuracy && ` (±${Math.round(gpsCoords.accuracy)}m)`}
                </div>
              </div>
            )}
            {gpsState === "denied" && (
              <div className="modal-gps-status denied">
                ⚠ Permiso de ubicación denegado. Puedes continuar sin este bonus.
              </div>
            )}
            {gpsState === "unsupported" && (
              <div className="modal-gps-status denied">
                ⚠ Tu dispositivo no soporta GPS.
              </div>
            )}
          </div>
        )}

        <div className="modal-xp-track">
          <div className="modal-xp-fill" />
        </div>

        <button className="modal-btn" onClick={handleConfirm}>
          ▶ CONTINUAR AVENTURA
        </button>
      </div>
    </div>
  );
}
