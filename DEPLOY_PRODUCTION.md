# 🚀 Guía de Despliegue en Producción — ObraClick

Esta guía resume los pasos para publicar ObraClick en producción en **Vercel** conectado a una base de datos **PostgreSQL** gratuita y gestionada (como **Supabase** o **Neon**).

---

## 1. Crear la Base de Datos PostgreSQL
1. Crea un proyecto en [Supabase](https://supabase.com) o [Neon](https://neon.tech).
2. Copia la cadena de conexión (`Connection String / Transaction pooler`), que tiene este formato:
   ```env
   DATABASE_URL="postgresql://usuario:contraseña@ep-xyz.eu-central-1.aws.neon.tech/neondb?sslmode=require"
   ```

---

## 2. Cambiar Prisma a PostgreSQL
Hemos creado un script automático para que no tengas que editar archivos manualmente:
```bash
node scripts/switch-db.js postgresql
```
*(Si alguna vez quieres volver a SQLite en local: `node scripts/switch-db.js sqlite`)*.

Luego ejecuta:
```bash
npx prisma db push
```
Esto creará todas las tablas e índices en tu base de datos PostgreSQL de producción.

---

## 3. Variables de Entorno en Vercel
En el panel de tu proyecto en Vercel (`Settings` > `Environment Variables`), añade:

| Variable | Descripción | Ejemplo / Valor |
|---|---|---|
| `DATABASE_URL` | Cadena de conexión PostgreSQL | `postgresql://...` |
| `NEXTAUTH_SECRET` | Clave secreta para tokens JWT | Cadena aleatoria de 32 caracteres |
| `NEXTAUTH_URL` | URL pública de tu dominio | `https://tu-dominio.com` o URL de Vercel |
| `GOOGLE_CLIENT_ID` | Client ID de Google Cloud OAuth | `118093...apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Client Secret de Google Cloud | `GOCSPX-...` |
| `NEXT_PUBLIC_APP_URL` | URL canónica para SEO y PWA | `https://tu-dominio.com` |
| `RESEND_API_KEY` | *(Opcional)* Para envío real de emails | `re_123456...` |

---

## 4. Despliegue con Git
1. Sube tu repositorio a GitHub o GitLab.
2. Importa el repositorio en Vercel.
3. El comando de build configurado en Next.js se encargará de compilar y optimizar la plataforma automáticamente.

---

## 5. PWA (Instalación en Smartphones de Obra)
ObraClick ya cuenta con:
- `manifest.ts` configurado para modo `standalone`.
- Iconos dinámicos adaptativos (`/icon` y `/apple-icon`).
- Meta tags de pantalla completa para iOS y Android.
Cualquier jefe de obra o cliente puede pulsar en su navegador móvil **"Añadir a la pantalla de inicio"** para usarla como una aplicación nativa.
