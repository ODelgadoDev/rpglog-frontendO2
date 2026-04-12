/**
 * WalletSection.jsx — FIXED
 *
 * BUG ORIGINAL: Cannot read properties of undefined (reading 'toLocaleString')
 *
 * CAUSA: El componente antiguo recibía props { coins, txHistory, weeklyCoins }
 * pero HomeScreen en algunos casos pasaba coins=undefined (antes de que el
 * estado se inicializara) o txHistory con entries que tenían coinsChange=undefined.
 *
 * FIX APLICADO:
 *  1. El componente ahora acepta AMBAS firmas de props (antigua y nueva del zip)
 *  2. Todos los valores numéricos tienen fallback a 0 con ?? 0
 *  3. Cada tx.coins / tx.amount tiene guard antes de renderizar
 *  4. Se llama a la API para obtener datos reales si hay token
 */
import { useState, useEffect } from "react";
import { progressApi, getToken } from "../../services/api";

export default function WalletSection({
  // Props de la firma ANTIGUA (HomeScreen actual):
  coins: coinsProp,
  txHistory = [],
  weeklyCoins: weeklyProp,
  // Props de la firma NUEVA (zip):
  user,
}) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!getToken()) return;
    setLoading(true);
    progressApi
      .getSummary()
      .then((data) => {
        if (data?.profile) setProfile(data.profile);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Valores seguros — nunca undefined
  const balance = Number(profile?.coins ?? coinsProp ?? user?.coins ?? 0);
  const earned  = Number(profile?.coinsEarnedTotal ?? 0);
  const spent   = Number(profile?.coinsSpentTotal  ?? 0);
  const weekly  = Number(weeklyProp ?? 0);

  // Historial seguro: filtra entries inválidos y garantiza campos
  const safeHistory = (txHistory || [])
    .filter(Boolean)
    .map((tx) => ({
      id:          tx.id          ?? Math.random(),
      icon:        tx.icon        ?? "🪙",
      label:       tx.label       ?? "Transacción",
      amount:      tx.amount      ?? "",
      coins:       tx.coins       ?? (tx.coinsChange != null
                     ? `${Number(tx.coinsChange) >= 0 ? "+" : ""}${Number(tx.coinsChange).toLocaleString()}🪙`
                     : ""),
      date:        tx.date        ?? "",
      color:       tx.color       ?? "var(--gold)",
      coinsChange: Number(tx.coinsChange ?? 0),
    }))
    .slice(0, 30);

  const hasHistory = safeHistory.length > 0;

  return (
    <div className="settings-block">
      <div className="settings-block-header">
        <span className="settings-block-icon">🪙</span>
        <span className="settings-block-title">MONEDERO</span>
      </div>
      <div className="settings-block-body">

        {/* ── Balance hero ── */}
        <div className="wallet-hero">
          <div className="wallet-icon">🪙</div>
          <div style={{ flex: 1 }}>
            <div className="wallet-label">SALDO ACTUAL</div>
            <div className="wallet-amount">
              {loading ? "..." : balance.toLocaleString()}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: ".3rem" }}>
            {/* Si tenemos datos de la API mostramos earned/spent, si no usamos weeklyCoins */}
            {profile ? (
              <>
                <div>
                  <div className="wallet-week-label">GANADAS TOTAL</div>
                  <div className="wallet-week-amount">+{earned.toLocaleString()}🪙</div>
                </div>
                <div>
                  <div className="wallet-week-label" style={{ color: "var(--red,#e05252)" }}>GASTADAS TOTAL</div>
                  <div style={{ fontFamily: "var(--pixel)", fontSize: "0.44rem", color: "var(--red,#e05252)" }}>
                    -{spent.toLocaleString()}🪙
                  </div>
                </div>
              </>
            ) : (
              <div>
                <div className="wallet-week-label">ESTA SEMANA</div>
                <div className="wallet-week-amount">
                  {weekly >= 0 ? "+" : ""}{weekly.toLocaleString()}🪙
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Historial ── */}
        <div className="wallet-history-label">▸ HISTORIAL RECIENTE</div>
        <div className="wallet-history">
          {hasHistory ? (
            safeHistory.map((tx) => (
              <div
                key={tx.id}
                className="tx-row"
                style={{ "--tx-color": tx.color }}
              >
                <span className="tx-icon">{tx.icon}</span>
                <div style={{ flex: 1 }}>
                  <div className="tx-label">{tx.label}</div>
                  <div className="tx-date">{tx.date}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: ".1rem" }}>
                  {tx.amount ? <div className="tx-amount">{tx.amount}</div> : null}
                  {tx.coins  ? <div className="tx-coins">{tx.coins}</div>  : null}
                </div>
              </div>
            ))
          ) : (
            <div className="tx-row" style={{ "--tx-color": "var(--border2)" }}>
              <span className="tx-icon">🧾</span>
              <div style={{ flex: 1 }}>
                <div className="tx-label">SIN MOVIMIENTOS AÚN</div>
                <div className="tx-date">Tus ganancias y gastos aparecerán aquí.</div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}