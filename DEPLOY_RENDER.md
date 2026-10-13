# 🚀 Guía de Despliegue en Render (Render.com)

Esta guía explica cómo desplegar **ObraClick** en la nube de Render con base de datos PostgreSQL gestionada de forma automática y gratuita.

---

## Opción A: Despliegue Automático con Blueprint (Recomendado - 1 Clic)

El repositorio incluye un archivo [`render.yaml`](./render.yaml) preconfigurado que levanta tanto el servidor Next.js como la base de datos PostgreSQL europea de forma automática.

### Pasos:
1. Accede a tu panel en [dashboard.render.com](https://dashboard.render.com).
2. Haz clic en el botón superior **"New +"** y selecciona **"Blueprint"**.
3. Conecta tu cuenta de GitHub y selecciona el repositorio **`erneupa/ObraClick`**.
4. Render leerá automáticamente el archivo `render.yaml` y mostrará los dos recursos que creará:
   - **`obraclick-db`**: Base de datos PostgreSQL gratuita (Región Frankfurt / Europa).
   - **`obraclick`**: Web Service Node.js gratuito con Next.js 16.
5. Haz clic en **"Apply"** (o "Create Blueprint Instance").
6. ¡Listo! Render compilará el proyecto, creará las tablas automáticamente y te dará una URL pública tipo `https://obraclick.onrender.com`.

---

## Opción B: Despliegue Manual (Paso a paso)

Si prefieres crear los servicios manualmente en la interfaz de Render:

### Paso 1: Crear la Base de Datos PostgreSQL
1. En Render, clic en **"New +"** -> **"PostgreSQL"**.
2. **Name:** `obraclick-db`
3. **Database:** `obraclick_db`
4. **User:** `obraclick_user`
5. **Region:** `Frankfurt (EU Central)`
6. **Plan:** `Free`
7. Haz clic en **"Create Database"**.
8. Una vez creada, copia el valor de **"Internal Database URL"** (empieza por `postgres://...`).

### Paso 2: Crear el Web Service de Next.js
1. En Render, clic en **"New +"** -> **"Web Service"**.
2. Conecta tu repositorio de GitHub `erneupa/ObraClick`.
3. Configuración del servicio:
   - **Name:** `obraclick`
   - **Region:** `Frankfurt (EU Central)`
   - **Branch:** `main`
   - **Runtime:** `Node`
   - **Build Command:** `npm run build:render`
   - **Start Command:** `npm run start`
   - **Plan:** `Free`
4. En la sección **Environment Variables**, añade:
   - `NODE_ENV` = `production`
   - `DATABASE_URL` = *(Pega la Internal Database URL que copiaste en el Paso 1)*
   - `NEXTAUTH_SECRET` = *(Genera una clave aleatoria o pulsa Generate)*
   - `NEXTAUTH_URL` = `https://<el-nombre-de-tu-app>.onrender.com`
5. Haz clic en **"Create Web Service"**.

---

## ¿Qué hace automáticamente el comando `npm run build:render`?
1. Ejecuta `node scripts/switch-db.js postgresql` para adaptar Prisma a PostgreSQL en el contenedor de Render.
2. Ejecuta `npx prisma generate` para crear el cliente de base de datos nativo para Linux.
3. Ejecuta `npx prisma db push --accept-data-loss` para crear todas las tablas automáticamente en la base de datos de Render.
4. Ejecuta `next build` para compilar el frontend optimizado para producción.

---

## Configuración Opcional: Inicio de Sesión con Google
Si quieres habilitar el botón "Continuar con Google" en producción:
1. En Google Cloud Console, ve a tus Credenciales OAuth.
2. En **URIs de redireccionamiento autorizados**, añade:
   `https://tu-app.onrender.com/api/auth/callback/google`
3. En las variables de entorno de Render, añade:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
