"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";

const emptySubscribe = () => () => {};

export default function CookieBanner() {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const initialConsent = useSyncExternalStore(
    emptySubscribe,
    () => localStorage.getItem("obraclick_cookie_consent"),
    () => "server"
  );

  const [dismissed, setDismissed] = useState(false);

  function handleAcceptAll() {
    localStorage.setItem("obraclick_cookie_consent", "all");
    setDismissed(true);
  }

  function handleAcceptEssential() {
    localStorage.setItem("obraclick_cookie_consent", "essential");
    setDismissed(true);
  }

  if (!isMounted || initialConsent || dismissed) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "calc(100% - 40px)",
      maxWidth: "880px",
      zIndex: 999,
      background: "rgba(15, 23, 42, 0.95)",
      backdropFilter: "blur(16px)",
      border: "1px solid rgba(59, 130, 246, 0.3)",
      borderRadius: "16px",
      padding: "20px 24px",
      boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "16px",
      animation: "fadeIn 0.3s ease-out"
    }}>
      <div style={{ flex: "1 1 450px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <span style={{ fontSize: "18px" }}>🍪</span>
          <strong style={{ fontSize: "14px", color: "#fff" }}>Configuración de Privacidad y Cookies</strong>
        </div>
        <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
          Utilizamos cookies técnicas necesarias para el funcionamiento seguro de la plataforma y el mantenimiento de tu sesión. No vendemos ni compartimos datos con terceros. Puedes consultar los detalles en nuestra{" "}
          <Link href="/cookies" style={{ color: "var(--accent-primary)", textDecoration: "underline" }}>
            Política de Cookies
          </Link>{" "}
          y{" "}
          <Link href="/privacidad" style={{ color: "var(--accent-primary)", textDecoration: "underline" }}>
            Política de Privacidad
          </Link>.
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <button
          onClick={handleAcceptEssential}
          className="btn-secondary"
          style={{ padding: "8px 16px", fontSize: "13px" }}
        >
          Solo Esenciales
        </button>
        <button
          onClick={handleAcceptAll}
          className="btn-primary"
          style={{ padding: "8px 20px", fontSize: "13px", background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" }}
        >
          Aceptar Todas ✓
        </button>
      </div>
    </div>
  );
}
