/**
 * TitlesTab.jsx — Tab de títulos del perfil (Tienda)
 * ─────────────────────────────────────────────────────
 * Catálogo de títulos. El estado de propiedad y equipado ya NO
 * vive aquí — viene de HomeScreen via props para persistir entre
 * navegaciones y aplicar los bonus al perfil.
 *
 * Props:
 *   coins       — monedas actuales (para validar compras)
 *   setCoins    — descuenta el precio al comprar
 *   userLevel   — nivel del usuario (bloquea por minLv)
 *   ownedIds    — Set<string> de IDs de títulos ya comprados
 *   equippedId  — ID del título actualmente equipado (string)
 *   onBuyTitle(title)   — compra y desbloquea el título
 *   onEquipTitle(title) — equipa el título (actualiza user.title)
 *   onUnequipTitle()    — vuelve al título por defecto t0
 *
 * Estilos: ShopScreen.css (.titles-grid, .title-card, .title-action)
 */
import { useState } from "react";
import { TITLES_DATA } from "../../data/shop";
import ConfirmModal from "./ConfirmModal";

const FILTERS = ["ALL", "GRATIS", "COMÚN", "RARO", "ÉPICO"];

export default function TitlesTab({
  coins, setCoins, userLevel,
  ownedIds, equippedId,
  onBuyTitle, onEquipTitle, onUnequipTitle,
}) {
  const [filter,  setFilter]  = useState("ALL");
  const [confirm, setConfirm] = useState(null);

  const filtered = filter === "ALL" ? TITLES_DATA : TITLES_DATA.filter(t => t.rarity === filter);

  // Título actualmente equipado para el banner
  const equippedTitle = TITLES_DATA.find(t => t.id === equippedId) || TITLES_DATA[0];

  const handleBuy = (t) => {
    setCoins(p => p - t.price);
    onBuyTitle(t);
    setConfirm(null);
  };

  return (
    <>
      {/* ── Banner título equipado ───────────────── */}
      <div className="shop-section">
        <div className="shop-sec-header">
          <span className="shop-sec-title">👑 TÍTULO EQUIPADO</span>
          <div className="shop-sec-line" />
        </div>
        <div
          className="equipped-banner"
          style={{ "--banner-border": equippedTitle?.border || "var(--border)" }}
        >
          <div style={{ flex: 1 }}>
            <div className="equipped-banner-label">ACTUALMENTE:</div>
            <div
              className="equipped-banner-name"
              style={{ color: equippedTitle?.color || "var(--text)", textShadow: equippedTitle?.shadow || "none" }}
            >
              {equippedTitle?.name || "—"}
            </div>
            <div className="equipped-banner-preview">{equippedTitle?.preview}</div>
          </div>
          {equippedTitle && equippedTitle.id !== "t0" && (
            <button className="title-action unequip" onClick={onUnequipTitle}>DESEQUIPAR</button>
          )}
        </div>
      </div>

      {/* ── Filtros ──────────────────────────────── */}
      <div style={{ padding: "0 1.2rem", marginBottom: "0.2rem" }}>
        <div className="titles-filter">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`titles-filter-btn${filter === f ? " active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid de títulos ──────────────────────── */}
      <div className="shop-section" style={{ paddingTop: "0.8rem" }}>
        <div className="titles-grid">
          {filtered.map(t => {
            const isOwned    = ownedIds.has(t.id);
            const isEquipped = equippedId === t.id;
            const locked     = !isOwned && userLevel < t.minLv;
            const canBuy     = !isOwned && !locked && coins >= t.price;

            return (
              <div
                key={t.id}
                className={`title-card${isEquipped ? " equipped" : ""}${t.type === "epic" ? " epic-card" : ""}${locked ? " locked-card" : ""}`}
                style={{ "--tc-accent": t.accent, "--tc-border": isEquipped ? t.accent : t.border }}
              >
                <div className="title-card-top">
                  <span className="title-rarity" style={{ "--rc": t.rcColor }}>{t.rarity}</span>
                  {isEquipped && <span className="title-equipped-badge">EQUIPADO</span>}
                </div>

                <div className="title-name" style={{ color: t.color, textShadow: t.shadow || "none" }}>
                  {t.name}
                </div>
                <div className="title-preview">{t.preview}</div>

                {t.perks.length > 0 && (
                  <div className="title-perks">
                    {t.perks.map((p, i) => (
                      <div key={i} className="title-perk">
                        <div className="title-perk-dot" style={{ background: t.accent }} />
                        {p}
                      </div>
                    ))}
                  </div>
                )}

                <div className="title-footer">
                  {locked ? (
                    <>
                      <span className="title-lvreq">LV{t.minLv} mín.</span>
                      <button className="title-action locked-btn" disabled>🔒</button>
                    </>
                  ) : isOwned ? (
                    <>
                      <span className="title-price free">DESBLOQUEADO</span>
                      {isEquipped
                        ? <button className="title-action unequip" onClick={onUnequipTitle}>EQUIPADO ✓</button>
                        : <button className="title-action equip"   onClick={() => onEquipTitle(t)}>EQUIPAR</button>
                      }
                    </>
                  ) : (
                    <>
                      <span className="title-price" style={{ color: coins >= t.price ? "var(--gold)" : "var(--red)" }}>
                        🪙 {t.price}
                      </span>
                      <button
                        className="title-action buy"
                        disabled={!canBuy}
                        onClick={() => setConfirm({ title: t })}
                      >
                        COMPRAR
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {confirm && (
        <ConfirmModal
          icon={confirm.title.type === "epic" ? "⚡" : "🏷️"}
          title={`COMPRAR "${confirm.title.name}"`}
          desc={`¿Gastar 🪙${confirm.title.price} para obtener este título?\nSaldo actual: 🪙${coins}`}
          confirmLabel="🪙 COMPRAR"
          onConfirm={() => handleBuy(confirm.title)}
          onClose={() => setConfirm(null)}
        />
      )}
    </>
  );
}
