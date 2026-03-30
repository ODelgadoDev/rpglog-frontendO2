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

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(`${process.env.PUBLIC_URL || ""}/service-worker.js`)
      .catch((error) => console.error("Error registrando el service worker:", error));
  });
}
