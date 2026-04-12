import { useState } from "react";

export default function ResetPasswordModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // null | "sending" | "sent"

  const handleSend = async () => {
    if (!email || !email.includes("@")) {
      setStatus("invalid");
      return;
    }
    setStatus("sending");
    // No endpoint available: simulate success
    setTimeout(() => setStatus("sent"), 800);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "min(600px, 94%)", background: "#0b0b0b", border: "2px solid #fff", padding: "1rem", borderRadius: 8, color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".6rem" }}>
          <div style={{ fontFamily: "var(--pixel)", fontSize: "1rem" }}>RESTABLECER CONTRASEÑA</div>
          <button className="save-btn" onClick={onClose}>CERRAR</button>
        </div>

        {status === "sent" ? (
          <div style={{ color: "#9be2a8" }}>Se ha enviado un enlace de restablecimiento a {email}. Revisa tu correo.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
            <div style={{ color: "#ddd" }}>Ingresa tu correo y te enviaremos instrucciones para restablecer tu contraseña.</div>
            <input
              className="field-input"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setStatus(null); }}
              style={{ padding: ".5rem", borderRadius: 6, border: "1px solid rgba(255,255,255,0.08)", background: "#0b0b0b", color: "#fff" }}
            />
            {status === "invalid" && <div style={{ color: "var(--orange)" }}>Correo inválido</div>}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: ".6rem" }}>
              <button className="save-btn" onClick={handleSend} disabled={status === "sending"}>
                {status === "sending" ? "ENVIANDO..." : "ENVIAR"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
