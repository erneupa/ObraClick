import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import PrivacyGdprSettings from "@/components/PrivacyGdprSettings";

export const instant = false;

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Fetch latest user data from DB
  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  async function updateProfile(formData: FormData) {
    "use server";
    const name = (formData.get("name") as string)?.trim();
    const role = formData.get("role") as string;
    const companyName = (formData.get("companyName") as string)?.trim();
    
    if (session?.user?.email) {
      await prisma.user.update({
        where: { email: session.user.email },
        data: { name, role, companyName }
      });
      revalidatePath("/dashboard/settings");
      revalidatePath("/dashboard");
    }
  }

  async function changePassword(formData: FormData) {
    "use server";
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!currentPassword || !newPassword) {
      throw new Error("Rellena todos los campos");
    }
    if (newPassword.length < 8) {
      throw new Error("La nueva contraseña debe tener al menos 8 caracteres");
    }
    if (newPassword.length > 72) {
      throw new Error("La nueva contraseña no puede superar los 72 caracteres");
    }
    if (newPassword !== confirmPassword) {
      throw new Error("Las contraseñas no coinciden");
    }

    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { password: true }
      });

      if (!user?.password) {
        throw new Error("Tu cuenta usa OAuth (Google). No puedes cambiar la contraseña desde aquí.");
      }

      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        throw new Error("Contraseña actual incorrecta");
      }

      const hashedNew = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { email: session.user.email },
        data: { password: hashedNew }
      });
      revalidatePath("/dashboard/settings");
    }
  }

  const isOAuth = !dbUser?.password;

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid var(--surface-border)",
    background: "rgba(0,0,0,0.2)",
    color: "white",
    fontSize: "15px",
    outline: "none",
  };

  const disabledInputStyle = {
    ...inputStyle,
    background: "rgba(255,255,255,0.05)",
    color: "var(--text-secondary)",
    cursor: "not-allowed",
  };

  const labelStyle = {
    display: "block" as const,
    fontSize: "14px",
    fontWeight: "600" as const,
    color: "var(--text-secondary)",
    marginBottom: "6px",
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div className="glass-panel slide-up" style={{ padding: "40px", width: "100%", maxWidth: "900px" }}>
        
        <header style={{ display: "flex", gap: "16px", alignItems: "center", borderBottom: "1px solid var(--surface-border)", paddingBottom: "20px", marginBottom: "30px" }}>
          <div>
            <h1 style={{ fontSize: "28px", margin: "0 0 4px 0" }}>⚙️ Ajustes de Cuenta</h1>
            <p className="text-secondary" style={{ margin: 0, fontSize: "16px" }}>Personaliza tu perfil, seguridad y preferencias</p>
          </div>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2.5fr", gap: "40px" }}>
          {/* Sidebar Menu */}
          <aside style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div className="btn-secondary" style={{ justifyContent: "flex-start", background: "rgba(255,255,255,0.1)", borderColor: "var(--accent-primary)", fontSize: "14px", padding: "10px 16px" }}>
              👤 Perfil
            </div>
            <Link href="/dashboard/suscripcion" className="btn-secondary" style={{ justifyContent: "flex-start", border: "none", textDecoration: "none", fontSize: "14px", padding: "10px 16px" }}>
              💳 Suscripción y Plan
            </Link>
            <div className="btn-secondary" style={{ justifyContent: "flex-start", border: "none", fontSize: "14px", padding: "10px 16px", opacity: 0.5 }}>
              🔔 Notificaciones (próximamente)
            </div>
          </aside>

          {/* Form */}
          <section style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {/* Profile Form */}
            <form action={updateProfile} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <h3 style={{ margin: "0 0 4px 0", fontSize: "18px", fontWeight: "700" }}>Datos Personales</h3>
              
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                {dbUser?.image ? (
                  <img 
                    src={dbUser.image} 
                    alt="Perfil" 
                    style={{ width: "72px", height: "72px", borderRadius: "50%", border: "2px solid var(--accent-primary)" }}
                  />
                ) : (
                  <div style={{
                    width: "72px", height: "72px", borderRadius: "50%",
                    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "28px", fontWeight: "700", color: "#fff",
                  }}>
                    {(dbUser?.name || "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div style={{ fontWeight: "700", fontSize: "16px", color: "#fff" }}>{dbUser?.name || "Usuario"}</div>
                  <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{dbUser?.email}</div>
                  <div style={{ fontSize: "12px", color: "#60a5fa", marginTop: "2px" }}>
                    {isOAuth ? "🔐 Cuenta vinculada con Google" : "🔑 Cuenta con email y contraseña"}
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={labelStyle}>Nombre Completo</label>
                  <input type="text" name="name" defaultValue={dbUser?.name || ""} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Correo Electrónico</label>
                  <input type="email" defaultValue={dbUser?.email || ""} disabled style={disabledInputStyle} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={labelStyle}>Rol en la obra</label>
                  <select 
                    name="role"
                    defaultValue={dbUser?.role || "cliente"}
                    style={{ ...inputStyle, background: "rgba(0,0,0,0.2)" }}
                  >
                    <option value="arquitecto">Arquitecto</option>
                    <option value="ingeniero">Ingeniero Residente</option>
                    <option value="maestro">Maestro de Obra</option>
                    <option value="cliente">Cliente / Propietario</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Empresa</label>
                  <input type="text" name="companyName" defaultValue={dbUser?.companyName || ""} placeholder="Nombre de tu empresa" style={inputStyle} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={labelStyle}>CIF / NIF</label>
                  <input type="text" defaultValue={dbUser?.cif || ""} disabled style={disabledInputStyle} />
                  <span style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "4px", display: "block" }}>
                    No modificable por trazabilidad y seguridad.
                  </span>
                </div>
                <div>
                  <label style={labelStyle}>Plan Actual</label>
                  <div style={{
                    ...disabledInputStyle,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 16px",
                  }}>
                    <span>{dbUser?.plan === "PRO" ? "⭐" : dbUser?.plan === "ENTERPRISE" ? "🏢" : "🆓"}</span>
                    <span style={{ fontWeight: "600", color: dbUser?.plan === "PRO" ? "#f59e0b" : "#fff" }}>
                      {dbUser?.plan || "FREE"}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button type="submit" className="btn-primary" style={{ padding: "10px 24px", fontSize: "14px" }}>
                  💾 Guardar Cambios
                </button>
              </div>
            </form>

            {/* Separator */}
            <div style={{ borderTop: "1px solid var(--surface-border)" }} />

            {/* Password Change (only for email accounts) */}
            <div>
              <h3 style={{ margin: "0 0 12px 0", fontSize: "18px", fontWeight: "700" }}>🔒 Seguridad — Cambiar Contraseña</h3>
              {isOAuth ? (
                <div style={{
                  background: "rgba(59,130,246,0.1)",
                  border: "1px solid rgba(59,130,246,0.25)",
                  borderRadius: "12px",
                  padding: "16px",
                  fontSize: "14px",
                  color: "#93c5fd",
                }}>
                  Tu cuenta está vinculada a <strong>Google OAuth</strong>. La contraseña se gestiona desde tu cuenta de Google.
                </div>
              ) : (
                <form action={changePassword} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label style={labelStyle}>Contraseña Actual</label>
                    <input type="password" name="currentPassword" required placeholder="••••••••" style={inputStyle} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={labelStyle}>Nueva Contraseña</label>
                      <input type="password" name="newPassword" required placeholder="Mínimo 6 caracteres" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Confirmar Contraseña</label>
                      <input type="password" name="confirmPassword" required placeholder="Repite la nueva contraseña" style={inputStyle} />
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button type="submit" className="btn-secondary" style={{ padding: "10px 20px", fontSize: "14px" }}>
                      🔐 Cambiar Contraseña
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Separator */}
            <div style={{ borderTop: "1px solid var(--surface-border)" }} />

            {/* GDPR Section */}
            <PrivacyGdprSettings />
          </section>
        </div>

      </div>
    </div>
  );
}
