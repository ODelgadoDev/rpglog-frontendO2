/**
 * ConfirmModal.jsx — Modal de confirmación de compra
 * ─────────────────────────────────────────────────────
 * Modal genérico reutilizable para confirmar acciones en la tienda.
 * Usado para: comprar un título, equipar un título, comprar un slot, etc.
 *
 * Diseño: panel centrado con esquinas doradas, ícono grande,
 * título, descripción y dos botones (confirmar / cancelar).
 *
 * Props:
 *   icon         — emoji que representa la acción
 *   title        — título del modal
 *   desc         — descripción / pregunta de confirmación
 *   confirmLabel — texto del botón de acción (ej: "COMPRAR", "EQUIPAR")
 *   onConfirm    — ejecuta la acción y cierra el modal
 *   onClose      — cierra sin ejecutar
 *
 * Estilos: ShopScreen.css (.confirm-modal, .cm-btns, .cm-confirm)
 */
export default function ConfirmModal({ icon, title, desc, confirmLabel, onConfirm, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="confirm-modal" onClick={e => e.stopPropagation()}>
        <div className="cm-corner-bl" />
        <div className="cm-corner-br" />
        <div className="cm-icon">{icon}</div>
        <div className="cm-title">{title}</div>
        <div className="cm-desc">{desc}</div>
        <div className="cm-btns">
          <button className="cm-confirm" onClick={onConfirm}>{confirmLabel}</button>
          <button className="cm-cancel"  onClick={onClose}>CANCELAR</button>
        </div>
      </div>
    </div>
  );
}
