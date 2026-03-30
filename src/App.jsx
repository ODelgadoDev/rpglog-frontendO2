/**
 * App.jsx — Componente raíz
 * ─────────────────────────────────────────────────────
 * Muestra los Términos y Condiciones la primera vez.
 * Una vez aceptados (flag en localStorage "rpglog_tos_accepted"),
 * pasa directamente a AuthScreen.
 */
import { useState } from "react";
import AuthScreen       from "./screens/AuthScreen";
import HomeScreen       from "./screens/HomeScreen";
import TermsModal       from "./components/TermsModal";
import PwaInstallPrompt from "./components/PwaInstallPrompt";

const TOS_KEY = "rpglog_tos_accepted";

export default function App() {
  const [tosAccepted, setTosAccepted] = useState(
    () => localStorage.getItem(TOS_KEY) === "1"
  );
  const [currentUser, setCurrentUser] = useState(null);

  const handleAcceptTos = () => {
    localStorage.setItem(TOS_KEY, "1");
    setTosAccepted(true);
  };

  const handleLogin  = (username, isNew = false) =>
    setCurrentUser({ name: username, isNewAccount: isNew });
  const handleLogout = () => setCurrentUser(null);

  let screen;

  // 1️⃣ Mostrar T&C si aún no se han aceptado
  if (!tosAccepted) {
    screen = <TermsModal onAccept={handleAcceptTos} />;
  }
  // 2️⃣ Login / Registro
  else if (!currentUser) {
    screen = <AuthScreen onLogin={handleLogin} />;
  }
  // 3️⃣ App principal
  else {
    screen = (
      <HomeScreen
        initialName={currentUser.name}
        isNewAccount={currentUser.isNewAccount}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <>
      {screen}
      <PwaInstallPrompt />
    </>
  );
}
