// Helper to switch Prisma datasource provider between sqlite (local dev) and postgresql (production)
const fs = require('fs');
const path = require('path');

const target = process.argv[2]?.toLowerCase();
if (!target || !['sqlite', 'postgresql', 'postgres'].includes(target)) {
  console.log('Uso: node scripts/switch-db.js [sqlite|postgresql]');
  process.exit(1);
}

const provider = target === 'postgres' ? 'postgresql' : target;
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

schema = schema.replace(
  /datasource db \{[\s\S]*?provider\s*=\s*["'](sqlite|postgresql)["'][\s\S]*?\}/,
  `datasource db {\n  provider = "${provider}"\n  url      = env("DATABASE_URL")\n}`
);

fs.writeFileSync(schemaPath, schema, 'utf8');
console.log(`✔ Prisma datasource provider cambiado a: "${provider}"`);
console.log(`Recuerda configurar DATABASE_URL en tu archivo .env o en el panel de Vercel/Supabase.`);
