/**
 * ShopScreen.jsx — Pantalla de tienda
 * ─────────────────────────────────────────────────────
 * Puente entre HomeScreen y los dos tabs de la tienda.
 * Recibe todo el estado de títulos y misiones custom desde HomeScreen
 * para garantizar persistencia entre navegaciones.
 *
 * Props desde HomeScreen:
 *   coins / setCoins       — monedero del usuario
 *   userLevel              — nivel (bloquea títulos por minLv)
 *   ownedIds / equippedId  — estado de títulos
 *   onBuyTitle / onEquipTitle / onUnequipTitle — gestión de títulos
 *   customMissions / setCustomMissions — misiones custom activas
 *   onMissionComplete(m)   — propaga recompensas al completar custom
 *   unlockedSlots          — Set<number> de slots comprados {0,1,2}
 *   setUnlockedSlots       — desbloquea un slot al comprarlo
 */
import { useState } from "react";
import "../styles/ShopScreen.css";
import CustomMissionsTab from "../components/shop/CustomMissionsTab";
import TitlesTab         from "../components/shop/TitlesTab";

export default function ShopScreen({
  coins, setCoins,
  userLevel = 1,
  ownedIds, equippedId,
  onBuyTitle, onEquipTitle, onUnequipTitle,
  customMissions, setCustomMissions,
  onMissionComplete,
  unlockedSlots, setUnlockedSlots,
}) {
  const [shopTab, setShopTab] = useState("missions");

  return (
    <div className="shop-page">
      <div className="shop-tabs">
        <button className={`shop-tab${shopTab === "missions" ? " active" : ""}`} onClick={() => setShopTab("missions")}>
          ⚙️ MISIONES CUSTOM
        </button>
        <button className={`shop-tab${shopTab === "titles" ? " active" : ""}`} onClick={() => setShopTab("titles")}>
          👑 TÍTULOS
        </button>
      </div>

      {shopTab === "missions" ? (
        <CustomMissionsTab
          coins={coins}
          setCoins={setCoins}
          customMissions={customMissions}
          setCustomMissions={setCustomMissions}
          onMissionComplete={onMissionComplete}
          unlockedSlots={unlockedSlots}
          setUnlockedSlots={setUnlockedSlots}
        />
      ) : (
        <TitlesTab
          coins={coins}
          setCoins={setCoins}
          userLevel={userLevel}
          ownedIds={ownedIds}
          equippedId={equippedId}
          onBuyTitle={onBuyTitle}
          onEquipTitle={onEquipTitle}
          onUnequipTitle={onUnequipTitle}
        />
      )}
    </div>
  );
}
