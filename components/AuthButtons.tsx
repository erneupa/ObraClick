"use client";

import { signIn, signOut } from "next-auth/react";

export function LoginButton({ text = "Continuar con Google" }: { text?: string }) {
  return (
    <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })} className="btn-primary fade-in">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
      </svg>
      {text}
    </button>
  );
}

export function LogoutButton({ showText = false }: { showText?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      title="Cerrar sesión"
      aria-label="Cerrar sesión"
      className="btn-logout-icon"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        width: showText ? "auto" : "38px",
        height: "38px",
        padding: showText ? "0 14px" : "0",
        borderRadius: "10px",
        border: "1px solid var(--surface-border)",
        background: "rgba(255, 255, 255, 0.05)",
        color: "var(--text-secondary)",
        cursor: "pointer",
        transition: "all 0.2s ease",
        flexShrink: 0,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ display: "block" }}
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
      {showText && <span style={{ fontSize: "14px", fontWeight: "600" }}>Cerrar sesión</span>}
    </button>
  );
}
