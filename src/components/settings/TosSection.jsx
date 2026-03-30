/**
 * TosSection.jsx — Términos y Condiciones (modo lectura)
 * Versión embebida en ajustes, sin overlay de modal.
 */
export default function TosSection() {
  const SECTIONS = [
    ["1. Aceptación", "Al usar la aplicación aceptas estos términos. Si no estás de acuerdo, no utilices la app."],
    ["2. ¿Qué es RPG LOG?", "Una plataforma de gamificación para el desarrollo personal. Incluye sistema de niveles y XP, misiones diarias y personalizadas, minijuegos, economía virtual de monedas y títulos desbloqueables. Tiene fines educativos y de mejora de hábitos."],
    ["3. Tu cuenta", "Eres responsable de mantener seguras tus credenciales y de toda actividad realizada desde tu cuenta. Proporciona información veraz. La app puede suspender cuentas por uso indebido."],
    ["4. Uso responsable", "Te comprometes a no manipular el sistema para obtener ventajas injustas, no introducir información falsa en misiones y no realizar acciones que afecten el funcionamiento de la plataforma."],
    ["5. Sistema de progreso", "La XP permite subir de nivel. Las monedas se obtienen como recompensa y se usan dentro de la app. Los títulos otorgan bonificaciones. La aplicación puede ajustar valores en cualquier momento."],
    ["6. Misiones", "Las normales se regeneran diariamente. Las especiales requieren nivel mínimo. Las personalizadas las crea el usuario con costo en monedas. No pueden completarse fuera de su ciclo."],
    ["7. Minijuegos", "Otorgan XP y monedas. Las recompensas varían según desempeño. Pueden existir límites de uso diario para mantener el balance."],
    ["8. Economía interna", "Las monedas son virtuales, no tienen valor real, no son transferibles y no pueden canjearse por dinero."],
    ["9. Contenido del usuario", "El contenido de las misiones personalizadas es responsabilidad del usuario. No debe incluir material ofensivo o ilegal."],
    ["10. Privacidad y datos", "La app puede recopilar datos de uso para el funcionamiento del sistema. La ubicación GPS, cuando se activa voluntariamente, solo se comparte al completar misiones que lo requieran."],
    ["11. Limitación de responsabilidad", "RPG LOG no garantiza resultados personales ni cambios de hábitos. No sustituye asesoramiento profesional. El servicio puede tener interrupciones por mantenimiento."],
    ["12. Cambios", "Estos términos pueden modificarse en cualquier momento. El uso continuo de la app implica la aceptación de los cambios."],
    ["13. Cancelación", "Puedes dejar de usar la app cuando quieras. La aplicación puede suspender cuentas por incumplimiento de estos términos."],
  ];

  return (
    <div className="settings-block">
      <div className="settings-block-header">
        <span className="settings-block-icon">📜</span>
        <span className="settings-block-title">TÉRMINOS Y CONDICIONES</span>
      </div>
      <div className="settings-block-body about-body">
        <p style={{ color:"var(--text-dim)", fontStyle:"italic" }}>
          RPG LOG · Aplicación de productividad gamificada
        </p>
        {SECTIONS.map(([title, text]) => (
          <div key={title} className="tos-section">
            <div className="tos-section-title">{title}</div>
            <p>{text}</p>
          </div>
        ))}
        <div className="about-note" style={{ marginTop:".5rem" }}>
          Al usar la aplicación confirmas haber leído y aceptado estos términos.
        </div>
      </div>
    </div>
  );
}
