/**
 * index.js — Punto de entrada de la aplicación React
 * ─────────────────────────────────────────────────────
 * Monta el componente raíz <App /> en el elemento #root del HTML.
 * Este archivo no debe modificarse salvo que se cambie la configuración
 * de React (ej: StrictMode, Suspense global, proveedores de contexto).
 */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";

// En modo desarrollo, desregistrar Service Workers existentes para evitar
// que el navegador sirva bundles cacheados de builds anteriores.
if (process.env.NODE_ENV === 'development' && 'serviceWorker' in navigator) {
	navigator.serviceWorker.getRegistrations().then(regs => {
		regs.forEach(r => r.unregister().catch(() => {}));
	}).catch(() => {});
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<AuthProvider>
		<App />
	</AuthProvider>
);
