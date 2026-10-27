const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const m = env.match(/POSTGRES_PRISMA_URL="?([^"\n\r]+)"?/);
if (m) {
  process.env.DATABASE_URL = m[1].trim();
}
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const rows = await prisma.setting.findMany({
    where: { key: { startsWith: 'club:' } }
  });
  console.log('Club settings count:', rows.length);
  for (const r of rows) {
    console.log('KEY:', r.key);
    console.log('VALUE:', r.value);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
