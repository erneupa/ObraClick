/**
 * Script Keep-Alive para Render (Plan Free)
 * Realiza una petición cada 12 minutos para evitar que la instancia entre en reposo.
 * 
 * Uso:
 *   node scripts/keep-alive.js
 * O pasando tu URL personalizada:
 *   node scripts/keep-alive.js https://certiobra.es/api/health
 */

const TARGET_URL = process.argv[2] || process.env.PING_URL || "https://obraclick.onrender.com/api/health";
const INTERVAL_MINUTES = 12; // Render duerme a los 15 minutos de inactividad
const INTERVAL_MS = INTERVAL_MINUTES * 60 * 1000;

console.log(`\n======================================================`);
console.log(`🚀 Render Keep-Alive iniciado`);
console.log(`🎯 Objetivo: ${TARGET_URL}`);
console.log(`⏱️ Intervalo: cada ${INTERVAL_MINUTES} minutos`);
console.log(`======================================================\n`);

async function ping() {
  const time = new Date().toLocaleTimeString();
  try {
    const start = Date.now();
    const res = await fetch(TARGET_URL, {
      method: "GET",
      headers: { "User-Agent": "CertiObra-KeepAlive/1.0" },
    });
    const duration = Date.now() - start;

    if (res.ok) {
      console.log(`[${time}] ✅ Ping exitoso (${res.status} OK) en ${duration}ms`);
    } else {
      console.warn(`[${time}] ⚠️ Servidor respondió con código: ${res.status}`);
    }
  } catch (error) {
    console.error(`[${time}] ❌ Error conectando con ${TARGET_URL}:`, error.message);
  }
}

// Primer ping inmediato al arrancar
ping();

// Pings periódicos
setInterval(ping, INTERVAL_MS);
