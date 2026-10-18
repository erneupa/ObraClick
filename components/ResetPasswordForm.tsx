"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { requestPasswordReset, resetPasswordWithToken } from "@/lib/actions";
import { useToast } from "@/components/ToastProvider";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();

  const token = searchParams.get("token") || "";

  // Solicitud de enlace
  const [email, setEmail] = useState("");
  const [requestSent, setRequestSent] = useState(false);
  const [requestMsg, setRequestMsg] = useState("");

  // Cambio de contraseña
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Estados generales
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRequest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await requestPasswordReset(formData);
      if (!res.ok) {
        setError(res.error || "Ocurrió un error al enviar el enlace");
      } else {
        setRequestSent(true);
        setRequestMsg(res.message || "Enlace enviado si la cuenta existe.");
        showToast("Enlace de recuperación solicitado con éxito", "success");
      }
    } catch {
      setError("Error de conexión. Inténtalo de nuevo en unos minutos.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      setLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.set("token", token);

    try {
      const res = await resetPasswordWithToken(formData);
      if (!res.ok) {
        setError(res.error || "No se pudo actualizar la contraseña");
      } else {
        setIsSuccess(true);
        showToast("¡Contraseña actualizada con éxito!", "success");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch {
      setError("Error de conexión al guardar la nueva contraseña.");
    } finally {
      setLoading(false);
    }
  }

  // Vista 1: Viene con token en la URL (cambiar contraseña)
  if (token) {
    if (isSuccess) {
      return (
        <div style={{ textAlign: "center", padding: "10px 0" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "rgba(16, 185, 129, 0.2)",
              color: "#34d399",
              fontSize: "28px",
              marginBottom: "16px",
            }}
          >
            ✓
          </div>
          <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>
            ¡Contraseña actualizada!
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "20px" }}>
            Tu contraseña se ha modificado correctamente. Te estamos redirigiendo a la pantalla de acceso...
          </p>
          <Link
            href="/login"
            className="btn-primary"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              fontSize: "14px",
              textDecoration: "none",
            }}
          >
            Ir a Iniciar Sesión ahora
          </Link>
        </div>
      );
    }

    return (
      <form onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" }}>
        {error && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#f87171",
              fontSize: "13px",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "4px" }}>
            Nueva Contraseña (mínimo 8 caracteres) *
          </label>
          <input
            type="password"
            name="password"
            required
            minLength={8}
            maxLength={72}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid var(--surface-border)",
              background: "rgba(255, 255, 255, 0.05)",
              color: "#fff",
              fontSize: "14px",
              outline: "none",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "4px" }}>
            Confirmar Nueva Contraseña *
          </label>
          <input
            type="password"
            name="confirmPassword"
            required
            minLength={8}
            maxLength={72}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid var(--surface-border)",
              background: "rgba(255, 255, 255, 0.05)",
              color: "#fff",
              fontSize: "14px",
              outline: "none",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "14px",
            marginTop: "6px",
          }}
        >
          {loading ? "Actualizando contraseña..." : "Guardar Nueva Contraseña"}
        </button>

        <div style={{ textAlign: "center", marginTop: "8px" }}>
          <Link
            href="/login"
            style={{ fontSize: "13px", color: "var(--text-secondary)", textDecoration: "none" }}
          >
            ← Cancelar e ir al acceso
          </Link>
        </div>
      </form>
    );
  }

  // Vista 2: Solicitud de reseteo mediante email
  if (requestSent) {
    return (
      <div style={{ textAlign: "center", padding: "10px 0" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "rgba(59, 130, 246, 0.2)",
            color: "var(--accent-primary)",
            fontSize: "28px",
            marginBottom: "16px",
          }}
        >
          ✉️
        </div>
        <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>
          Revisa tu correo
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.5", marginBottom: "20px" }}>
          {requestMsg}
        </p>
        <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "24px" }}>
          El enlace será válido durante 1 hora. Si no lo ves en tu bandeja de entrada, revisa tu carpeta de Spam.
        </p>
        <Link
          href="/login"
          className="btn-secondary"
          style={{
            display: "inline-block",
            padding: "10px 20px",
            fontSize: "14px",
            textDecoration: "none",
          }}
        >
          ← Volver a Iniciar Sesión
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleRequest} style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" }}>
      {error && (
        <div
          style={{
            padding: "10px 14px",
            borderRadius: "8px",
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#f87171",
            fontSize: "13px",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      <div>
        <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "4px" }}>
          Correo Electrónico de tu Cuenta
        </label>
        <input
          type="email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@constructora.es"
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: "8px",
            border: "1px solid var(--surface-border)",
            background: "rgba(255, 255, 255, 0.05)",
            color: "#fff",
            fontSize: "14px",
            outline: "none",
          }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary"
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "14px",
          marginTop: "6px",
        }}
      >
        {loading ? "Enviando instrucciones..." : "Enviar Enlace de Recuperación"}
      </button>

      <div style={{ textAlign: "center", marginTop: "8px" }}>
        <Link
          href="/login"
          style={{ fontSize: "13px", color: "var(--text-secondary)", textDecoration: "none" }}
        >
          ← Volver a Iniciar Sesión
        </Link>
      </div>
    </form>
  );
}
