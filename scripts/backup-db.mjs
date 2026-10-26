/**
 * backup-db.mjs — Exports ALL data from the Prisma Postgres cloud database to a JSON file.
 * Run with: node scripts/backup-db.mjs
 * The DATABASE_URL must point to the cloud Postgres instance.
 */

import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const db = new PrismaClient();

async function main() {
  console.log("📦 Starting full database backup...");
  console.log("   DB:", process.env.DATABASE_URL?.slice(0, 40) + "...");

  const backup = {
    exportedAt: new Date().toISOString(),
    tables: {},
  };

  const tables = [
    "admin",
    "adminSession",
    "marquee",
    "setting",
    "page",
    "achievement",
    "event",
    "registrationForm",
    "registrationField",
    "registrationSubmission",
    "notification",
    "financeEntry",
    "emergencyContact",
    "committee",
    "committeeMember",
    "intervention",
  ];

  for (const table of tables) {
    try {
      const data = await db[table].findMany();
      backup.tables[table] = data;
      console.log(`   ✓ ${table}: ${data.length} rows`);
    } catch (e) {
      console.warn(`   ⚠️  ${table}: ${e.message}`);
      backup.tables[table] = [];
    }
  }

  const outDir = path.join(process.cwd(), "prisma");
  const outFile = path.join(outDir, `backup-${new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)}.json`);
  fs.writeFileSync(outFile, JSON.stringify(backup, null, 2), "utf8");

  console.log("\n✅ Backup complete!");
  console.log(`   Saved to: ${outFile}`);
  console.log(`   Total tables: ${tables.length}`);

  const totalRows = Object.values(backup.tables).reduce((s, t) => s + t.length, 0);
  console.log(`   Total rows: ${totalRows}`);
}

main()
  .catch((e) => {
    console.error("❌ Backup failed:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
