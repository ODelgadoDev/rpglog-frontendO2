/**
 * App.jsx — Componente raíz de la aplicación
 * ─────────────────────────────────────────────────────
 * Ya NO es "modo 100% frontend". Ahora maneja authData del backend
 * y lo pasa a HomeScreen.
 *
 * Estado:
 *   currentUser (object | null)
 *     null → no autenticado → muestra AuthScreen
 *     { name, isNewAccount } → autenticado → muestra HomeScreen
 */
import React from "react";
import AuthScreen from "./screens/AuthScreen";
import HomeScreen from "./screens/HomeScreen";
import { useAuth } from "./contexts/AuthContext";

export default function App() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div style={{ fontFamily: "var(--pixel)", padding: "2rem", textAlign: "center" }}>
        ⏳ CARGANDO...
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return <HomeScreen onLogout={logout} />;
}
