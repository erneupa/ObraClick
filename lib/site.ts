/**
 * URL pública de la aplicación, sin barra final.
 *
 * Orden de preferencia:
 *  1. NEXT_PUBLIC_APP_URL (dominio propio, recomendado)
 *  2. NEXTAUTH_URL
 *  3. RENDER_EXTERNAL_URL (la URL *.onrender.com que Render define automáticamente)
 *  4. https://obraclick.com
 */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    process.env.RENDER_EXTERNAL_URL ||
    "https://certiobra.com";
  return raw.trim().replace(/\/+$/, "");
}
