/**
 * WalletSection.jsx — Sección de monedero en ajustes
 * ─────────────────────────────────────────────────────
 * Muestra el estado financiero del usuario en la app:
 *
 *   • Balance actual de 🪙 monedas con efecto glow dorado
 *   • Monedas ganadas esta semana
 *   • Historial de transacciones (últimas N operaciones)
 *     → cada fila tiene: ícono, descripción, fecha, monto ±
 *     → verde para ingresos, rojo para gastos
 *
 * Props:
 *   user — objeto que contiene user.coins (balance actual)
 *
 * Datos: TX_HISTORY desde data/settings.js (demo estático)
 * Al conectar el backend: GET /wallet/history
 *
 * Estilos: SettingsScreen.css (.wallet-hero, .tx-row, .wallet-history)
 */
import { TX_HISTORY } from "../../data/settings";

export default function WalletSection({ user }) {
  return (
    <div className="settings-block">
      <div className="settings-block-header">
        <span className="settings-block-icon">🪙</span>
        <span className="settings-block-title">MONEDERO</span>
      </div>
      <div className="settings-block-body">

        {/* Balance hero */}
        <div className="wallet-hero">
          <div className="wallet-icon">🪙</div>
          <div style={{ flex: 1 }}>
            <div className="wallet-label">SALDO ACTUAL</div>
            <div className="wallet-amount">{user.coins.toLocaleString()}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <div className="wallet-week-label">ESTA SEMANA</div>
            <div className="wallet-week-amount">+490🪙</div>
          </div>
        </div>

        {/* Transaction history */}
        <div className="wallet-history-label">▸ HISTORIAL RECIENTE</div>
        <div className="wallet-history">
          {TX_HISTORY.map((tx, i) => (
            <div key={i} className="tx-row" style={{ "--tx-color": tx.color }}>
              <span className="tx-icon">{tx.icon}</span>
              <div style={{ flex: 1 }}>
                <div className="tx-label">{tx.label}</div>
                <div className="tx-date">{tx.date}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: ".1rem" }}>
                {tx.amount && <div className="tx-amount">{tx.amount}</div>}
                <div className="tx-coins">{tx.coins}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
