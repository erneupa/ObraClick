// Servicio de Emails Transaccionales para ObraClick
// Compatible con Resend API y modo desarrollo/simulación

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<{ success: boolean; id?: string }> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log(`[EMAIL SIMULADO - OBRACLICK DEV]`);
    console.log(`Destinatario: ${to}`);
    console.log(`Asunto: ${subject}`);
    console.log(`[Contenido HTML generado correctamente]`);
    return { success: true, id: `dev_sim_${Date.now()}` };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "ObraClick <notificaciones@obraclick.es>",
        to: [to],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("[RESEND ERROR]", err);
      return { success: false };
    }

    const data = await res.json();
    return { success: true, id: data.id };
  } catch (error) {
    console.error("[EMAIL ERROR]", error);
    return { success: false };
  }
}

// 1. Email de Bienvenida
export async function sendWelcomeEmail(to: string, userName: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://obraclick.es";
  const html = `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8" /></head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f8fafc; padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: #131d31; border: 1px solid #1e293b; border-radius: 16px; padding: 36px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          <div style="text-align: center; margin-bottom: 28px;">
            <h1 style="color: #3b82f6; font-size: 26px; margin: 0; font-weight: 800;">🏗️ ObraClick</h1>
            <p style="color: #94a3b8; font-size: 13px; margin-top: 4px;">Control & Certificación de Obras en la Nube</p>
          </div>

          <h2 style="color: #ffffff; font-size: 20px;">¡Bienvenido a ObraClick, ${userName}!</h2>
          <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">
            Tu cuenta ha sido creada con éxito. Ya puedes gestionar tus obras, crear partes diarios con fotos en tiempo real y controlar presupuestos con alertas de sobrecostes.
          </p>

          <div style="background: rgba(59, 130, 246, 0.1); border-left: 4px solid #3b82f6; padding: 16px; border-radius: 8px; margin: 24px 0;">
            <p style="margin: 0; color: #93c5fd; font-weight: 600; font-size: 14px;">
              🎁 Tienes 14 días de prueba completa sin tarjeta de crédito.
            </p>
            <p style="margin: 6px 0 0 0; color: #cbd5e1; font-size: 13px;">
              Aprovecha para crear tu primer proyecto y exportar una certificación de prueba en PDF.
            </p>
          </div>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${appUrl}/dashboard" style="background: #3b82f6; color: #ffffff; padding: 14px 28px; border-radius: 10px; font-weight: 700; text-decoration: none; display: inline-block; font-size: 15px;">
              Acceder a mi Panel de Control →
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #1e293b; margin: 28px 0;" />
          <p style="color: #64748b; font-size: 12px; text-align: center; margin: 0;">
            © ${new Date().getFullYear()} ObraClick · Todos los derechos reservados.
          </p>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: "Bienvenido a ObraClick 🏗️ Tu cuenta está lista",
    html,
  });
}

// 2. Alerta de Incidencia Urgente
export async function sendUrgentIncidentEmail(
  to: string,
  projectName: string,
  incidentTitle: string,
  priority: string,
  assignedTo?: string | null
) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://obraclick.es";
  const html = `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8" /></head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f8fafc; padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: #131d31; border: 1px solid #dc2626; border-radius: 16px; padding: 36px;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
            <span style="font-size: 28px;">🚨</span>
            <div>
              <h2 style="color: #ef4444; font-size: 20px; margin: 0;">ALERTA DE INCIDENCIA EN OBRA</h2>
              <span style="color: #94a3b8; font-size: 13px;">Proyecto: <strong>${projectName}</strong></span>
            </div>
          </div>

          <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 10px; padding: 18px; margin: 20px 0;">
            <div style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 8px;">
              ${incidentTitle}
            </div>
            <div style="font-size: 13px; color: #cbd5e1;">
              <strong>Prioridad:</strong> <span style="color: #f87171; font-weight: 700;">${priority}</span><br />
              <strong>Responsable asignado:</strong> ${assignedTo || "Sin asignar"}
            </div>
          </div>

          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
            Se ha registrado una incidencia crítica en la obra que requiere atención técnica o coordinación con la subcontrata implicada.
          </p>

          <div style="text-align: center; margin: 28px 0;">
            <a href="${appUrl}/dashboard" style="background: #dc2626; color: #ffffff; padding: 12px 24px; border-radius: 8px; font-weight: 700; text-decoration: none; display: inline-block; font-size: 14px;">
              Revisar Incidencia en ObraClick →
            </a>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: `🚨 [INCIDENCIA ${priority}] en ${projectName}`,
    html,
  });
}

// 3. Aviso de Prueba por Expirar
export async function sendTrialExpiringEmail(to: string, userName: string, daysLeft: number) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://obraclick.es";
  const html = `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8" /></head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f8fafc; padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: #131d31; border: 1px solid #f59e0b; border-radius: 16px; padding: 36px;">
          <h2 style="color: #f59e0b; font-size: 20px; margin-top: 0;">⏳ Tu prueba gratuita en ObraClick finaliza en ${daysLeft} días</h2>
          <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">
            Hola ${userName}, tu período de evaluación de 14 días está a punto de concluir. Para seguir certificando obras sin marca de agua y con almacenamiento ilimitado de partes diarios, activa el Plan PRO.
          </p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${appUrl}/dashboard" style="background: #f59e0b; color: #000; padding: 12px 24px; border-radius: 8px; font-weight: 700; text-decoration: none; display: inline-block; font-size: 14px;">
              Activar Plan PRO ⭐
            </a>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: `⏳ Tu prueba de ObraClick expira en ${daysLeft} días`,
    html,
  });
}
