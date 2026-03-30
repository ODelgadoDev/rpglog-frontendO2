/**
 * TermsModal.jsx — Términos y Condiciones de uso
 * ─────────────────────────────────────────────────────
 * Se muestra la primera vez que el usuario abre la app (flag en
 * localStorage "rpglog_tos_accepted"). Hasta que no acepte, no puede
 * acceder. El rechazo simplemente vuelve a mostrar el modal.
 *
 * Props:
 *   onAccept() — el usuario acepta y puede continuar
 */
export default function TermsModal({ onAccept }) {
  return (
    <div className="tos-overlay">
      <div className="tos-modal">
        <div className="modal-corner-bl" /><div className="modal-corner-br" />

        <div className="tos-header">
          <span className="tos-icon">📜</span>
          <div className="tos-title">TÉRMINOS Y CONDICIONES</div>
          <div className="tos-sub">RPG LOG · Aplicación de productividad gamificada</div>
        </div>

        <div className="tos-body">

          <div className="tos-section">
            <div className="tos-section-title">1. Aceptación</div>
            <p>Al usar la aplicación aceptas estos términos. Si no estás de acuerdo, no utilices la app.</p>
          </div>

          <div className="tos-section">
            <div className="tos-section-title">2. ¿Qué es RPG LOG?</div>
            <p>Una plataforma de gamificación para el desarrollo personal. Incluye sistema de niveles y XP, misiones diarias y personalizadas, minijuegos, economía virtual de monedas y títulos desbloqueables. Tiene fines educativos y de mejora de hábitos.</p>
          </div>

          <div className="tos-section">
            <div className="tos-section-title">3. Tu cuenta</div>
            <p>Eres responsable de mantener seguras tus credenciales y de toda actividad realizada desde tu cuenta. Proporciona información veraz. La app puede suspender cuentas por uso indebido.</p>
          </div>

          <div className="tos-section">
            <div className="tos-section-title">4. Uso responsable</div>
            <p>Te comprometes a no manipular el sistema para obtener ventajas injustas, no introducir información falsa en misiones y no realizar acciones que afecten el funcionamiento de la plataforma.</p>
          </div>

          <div className="tos-section">
            <div className="tos-section-title">5. Sistema de progreso</div>
            <p>La XP permite subir de nivel al completar misiones o minijuegos. Las monedas se obtienen como recompensa y se usan dentro de la app. Los títulos otorgan bonificaciones y son cosméticos. <strong>La aplicación puede ajustar valores de XP, recompensas o balance en cualquier momento.</strong></p>
          </div>

          <div className="tos-section">
            <div className="tos-section-title">6. Misiones</div>
            <p>Las misiones normales se regeneran diariamente. Las especiales requieren nivel mínimo. Las personalizadas son creadas por el usuario con costo en monedas. Las misiones no pueden completarse fuera de su ciclo ni repetirse injustamente.</p>
          </div>

          <div className="tos-section">
            <div className="tos-section-title">7. Minijuegos</div>
            <p>Los minijuegos otorgan XP y monedas. Las recompensas varían según el desempeño. Pueden existir límites de uso diario para mantener el balance. El sistema puede ser ajustado en cualquier actualización.</p>
          </div>

          <div className="tos-section">
            <div className="tos-section-title">8. Economía interna</div>
            <p>Las monedas son virtuales, <strong>no tienen valor real</strong>, no son transferibles fuera de la aplicación y no pueden canjearse por dinero.</p>
          </div>

          <div className="tos-section">
            <div className="tos-section-title">9. Contenido del usuario</div>
            <p>El contenido de las misiones personalizadas es responsabilidad del usuario. No debe incluir material ofensivo, ilegal o inapropiado. La app puede eliminar contenido que incumpla estas normas.</p>
          </div>

          <div className="tos-section">
            <div className="tos-section-title">10. Privacidad y datos</div>
            <p>La app puede recopilar datos de uso para el funcionamiento del sistema y la personalización de la experiencia. La ubicación GPS, cuando se activa voluntariamente, solo se comparte al completar misiones que lo requieran. Los datos se manejan conforme a la política de privacidad aplicable.</p>
          </div>

          <div className="tos-section">
            <div className="tos-section-title">11. Limitación de responsabilidad</div>
            <p>RPG LOG no garantiza resultados personales ni cambios de hábitos. No sustituye asesoramiento profesional. No es responsable del uso indebido por parte del usuario. El servicio puede tener interrupciones por mantenimiento o actualizaciones.</p>
          </div>

          <div className="tos-section">
            <div className="tos-section-title">12. Cambios</div>
            <p>Estos términos pueden modificarse en cualquier momento. El uso continuo de la aplicación implica la aceptación de los cambios.</p>
          </div>

          <div className="tos-section">
            <div className="tos-section-title">13. Cancelación</div>
            <p>Puedes dejar de usar la app cuando quieras. La aplicación puede suspender cuentas por incumplimiento de estos términos.</p>
          </div>

        </div>

        <div className="tos-footer">
          <p className="tos-footer-text">Al presionar <strong>ACEPTAR</strong> confirmas que has leído y aceptas los términos y condiciones de RPG LOG.</p>
          <button className="tos-accept-btn" onClick={onAccept}>
            ✅ ACEPTO LOS TÉRMINOS
          </button>
        </div>
      </div>
    </div>
  );
}
