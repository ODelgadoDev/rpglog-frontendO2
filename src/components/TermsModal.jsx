import React from "react";

export default function TermsModal({ onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "min(900px, 92%)", maxHeight: "80vh", overflowY: "auto", background: "#0b0b0b", border: "2px solid #fff", padding: "1rem", borderRadius: 8, color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".6rem" }}>
          <div style={{ fontFamily: "var(--pixel)", fontSize: "1rem" }}>TÉRMINOS Y CONDICIONES</div>
          <button className="save-btn" onClick={onClose}>CERRAR</button>
        </div>

        <div style={{ lineHeight: 1.4, fontSize: ".9rem", color: "#ddd" }}>
          <p><strong>RPG LOG — Términos de uso</strong></p>
          <p>Bienvenido a RPG LOG. Este texto es un placeholder de los términos y condiciones. Aquí se debe incluir la información legal sobre el uso de la aplicación, protección de datos y responsabilidades.</p>
          <p>Al usar la aplicación aceptas los términos establecidos por el servicio. Para despliegues reales, sustituye este contenido por el texto legal proporcionado por el equipo legal.</p>
          <hr style={{ borderColor: "rgba(255,255,255,0.08)" }} />
          <p>Contacto: soporte@rpglog.example</p>
        </div>
      </div>
    </div>
  );
}
