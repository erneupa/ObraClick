"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/lib/actions";

function getServerErrorMsg(serverError?: string): string | null {
  if (!serverError) return null;
  if (serverError === "Configuration") {
    return "Error de configuración de Google: faltan las variables GOOGLE_CLIENT_ID o GOOGLE_CLIENT_SECRET en Render.";
  } else if (serverError === "OAuthSignin" || serverError === "OAuthCallback") {
    return "Error de sincronización con Google: comprueba que las URLs de redirección coincidan exactamente en Google Cloud Console.";
  } else if (serverError === "AccessDenied") {
    return "Acceso denegado: tu cuenta de Google no autorizó el acceso.";
  } else {
    return `Error de autenticación (${serverError}). Puedes crear una cuenta o entrar con correo y contraseña.`;
  }
}

export default function AuthForm({ serverError }: { serverError?: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(() => getServerErrorMsg(serverError));
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [cif, setCif] = useState("");
  const [role, setRole] = useState("Jefe de Obra");
  const [acceptTerms, setAcceptTerms] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        setSuccess("¡Acceso correcto! Entrando al panel...");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!cif.trim()) {
      setError("El CIF o NIF de la empresa/autónomo es obligatorio para la validez de los certificados.");
      return;
    }

    if (!acceptTerms) {
      setError("Debes aceptar el Aviso Legal, los Términos de Servicio y la Política de Privacidad para continuar (RGPD Art. 7).");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("companyName", companyName);
    formData.append("cif", cif.trim().toUpperCase());
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);

    try {
      const result = await registerUser(formData);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setSuccess("¡Cuenta creada con éxito! Iniciando sesión...");
      
      // Auto login after registration
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Cuenta creada, pero hubo un error al iniciar sesión automática. Por favor entra con tus datos.");
        setMode("login");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ width: "100%" }}>
      {/* Tab Switcher */}
      <div style={{
        display: "flex",
        background: "rgba(0, 0, 0, 0.3)",
        borderRadius: "10px",
        padding: "4px",
        marginBottom: "24px",
        border: "1px solid var(--surface-border)"
      }}>
        <button
          type="button"
          onClick={() => { setMode("login"); setError(null); }}
          style={{
            flex: 1,
            padding: "8px 12px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
            background: mode === "login" ? "var(--accent-primary)" : "transparent",
            color: mode === "login" ? "#fff" : "var(--text-secondary)",
            transition: "all 0.2s"
          }}
        >
          Iniciar Sesión
        </button>
        <button
          type="button"
          onClick={() => { setMode("register"); setError(null); }}
          style={{
            flex: 1,
            padding: "8px 12px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
            background: mode === "register" ? "var(--accent-primary)" : "transparent",
            color: mode === "register" ? "#fff" : "var(--text-secondary)",
            transition: "all 0.2s"
          }}
        >
          Crear Cuenta
        </button>
      </div>

      {/* Google Login Fast Button */}
      <button
        type="button"
        disabled={googleLoading || loading}
        onClick={async () => {
          setGoogleLoading(true);
          setError(null);
          try {
            await signIn("google", { callbackUrl: "/dashboard" });
          } catch (err: any) {
            setError(err.message || "Error al conectar con Google");
            setGoogleLoading(false);
          }
        }}
        className="btn-secondary"
        style={{
          width: "100%",
          padding: "11px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          fontSize: "14px",
          fontWeight: "600",
          marginBottom: "20px",
          opacity: googleLoading ? 0.7 : 1,
          cursor: googleLoading ? "wait" : "pointer"
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
          <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
          <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
          <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
          <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
        </svg>
        <span>
          {googleLoading 
            ? "Conectando con Google..." 
            : (mode === "login" ? "Continuar con Google" : "Registrarse con Google")}
        </span>
      </button>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
        <div style={{ flex: 1, height: "1px", background: "var(--surface-border)" }} />
        <span style={{ fontSize: "12px", color: "var(--text-secondary)", textTransform: "uppercase" }}>
          o con correo y contraseña
        </span>
        <div style={{ flex: 1, height: "1px", background: "var(--surface-border)" }} />
      </div>

      {/* Feedback alerts */}
      {error && (
        <div style={{
          padding: "10px 14px",
          borderRadius: "8px",
          background: "rgba(239, 68, 68, 0.15)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          color: "#f87171",
          fontSize: "13px",
          marginBottom: "16px",
          textAlign: "left"
        }}>
          ⚠️ {error}
        </div>
      )}
      {success && (
        <div style={{
          padding: "10px 14px",
          borderRadius: "8px",
          background: "rgba(16, 185, 129, 0.15)",
          border: "1px solid rgba(16, 185, 129, 0.3)",
          color: "#34d399",
          fontSize: "13px",
          marginBottom: "16px",
          textAlign: "left"
        }}>
          ✓ {success}
        </div>
      )}

      {/* Form */}
      {mode === "login" ? (
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "14px", textAlign: "left" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "4px" }}>
              Correo Electrónico
            </label>
            <input
              type="email"
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
                outline: "none"
              }}
            />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-secondary)" }}>
                Contraseña
              </label>
              <Link
                href="/recuperar-password"
                style={{ fontSize: "12px", color: "var(--accent-primary)", textDecoration: "none", transition: "opacity 0.2s" }}
              >
                ¿Has olvidado tu contraseña?
              </Link>
            </div>
            <input
              type="password"
              required
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
                outline: "none"
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
              marginTop: "6px"
            }}
          >
            {loading ? "Accediendo..." : "Entrar a mi Panel de Obra →"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "14px", textAlign: "left" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "4px" }}>
              Nombre y Apellidos *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Carlos Gómez"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid var(--surface-border)",
                background: "rgba(255, 255, 255, 0.05)",
                color: "#fff",
                fontSize: "14px",
                outline: "none"
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "4px" }}>
                Empresa / Constructora
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Ej: Construcciones Gómez S.L."
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--surface-border)",
                  background: "rgba(255, 255, 255, 0.05)",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "4px" }}>
                CIF / NIF Oficial *
              </label>
              <input
                type="text"
                required
                value={cif}
                onChange={(e) => setCif(e.target.value.toUpperCase())}
                placeholder="B12345678 ó 12345678Z"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--surface-border)",
                  background: "rgba(255, 255, 255, 0.05)",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase"
                }}
              />
            </div>
          </div>
          <p style={{ margin: "-6px 0 0 0", fontSize: "11px", color: "#94a3b8", display: "flex", alignItems: "center", gap: "5px" }}>
            🔒 <span>1 prueba de 14 días por CIF fiscal. Imprescindible para certificar partes de obra con validez oficial.</span>
          </p>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "4px" }}>
              Correo de Empresa *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contacto@obrasgomez.es"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid var(--surface-border)",
                background: "rgba(255, 255, 255, 0.05)",
                color: "#fff",
                fontSize: "14px",
                outline: "none"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "4px" }}>
              Perfil Profesional
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid var(--surface-border)",
                background: "rgba(15, 23, 42, 0.9)",
                color: "#fff",
                fontSize: "14px",
                outline: "none"
              }}
            >
              <option value="Jefe de Obra">Jefe de Obra</option>
              <option value="Arquitecto / Aparejador">Arquitecto / Aparejador</option>
              <option value="Empresa Constructora">Empresa Constructora / Reformas</option>
              <option value="Promotor Inmobiliario">Promotor Inmobiliario</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "4px" }}>
              Contraseña (mínimo 8 caracteres) *
            </label>
            <input
              type="password"
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
                outline: "none"
              }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginTop: "2px" }}>
            <input
              type="checkbox"
              id="acceptTerms"
              required
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              style={{ marginTop: "3px", cursor: "pointer", accentColor: "var(--accent-primary)" }}
            />
            <label htmlFor="acceptTerms" style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.4", cursor: "pointer" }}>
              He leído y acepto el{" "}
              <a href="/aviso-legal" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-primary)", textDecoration: "underline" }}>Aviso Legal</a>, los{" "}
              <a href="/terminos" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-primary)", textDecoration: "underline" }}>Términos de Servicio</a> y la{" "}
              <a href="/privacidad" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-primary)", textDecoration: "underline" }}>Política de Privacidad</a> (RGPD Art. 7).
            </label>
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
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
            }}
          >
            {loading ? "Creando cuenta..." : "Iniciar Prueba de 14 Días (1 Obra) 🚀"}
          </button>
        </form>
      )}
    </div>
  );
}
