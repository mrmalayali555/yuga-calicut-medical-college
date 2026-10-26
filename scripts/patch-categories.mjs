import { PrismaClient } from "@prisma/client";
import pg from "pg";

const prisma = new PrismaClient();

const updates = [
  {
    slug: "representation-regarding-early-publication-of-final-year-mbbs-results",
    category: "Academic & Welfare",
    pinned: true,
  },
  {
    slug: "representation-regarding-the-delay-in-e-grantz-scholarship",
    category: "Scholarships & Welfare",
    pinned: true,
  },
  {
    slug: "representation-regarding-the-proposed-increase-in-working-hours-of-jrs-under-the-drp",
    category: "Resident Welfare",
    pinned: true,
  },
];

async function patch() {
  console.log("Updating local SQLite interventions...");
  for (const u of updates) {
    await prisma.intervention.updateMany({
      where: { slug: u.slug },
      data: { category: u.category, pinned: u.pinned, published: true },
    });
  }
  // Delete test item "hnh" if present
  await prisma.intervention.deleteMany({ where: { slug: "hnh" } }).catch(() => {});
  console.log("Local SQLite updated!");

  // Also update cloud PostgreSQL
  const cloudUrl = "postgres://3b2974e76f6aa61cc5c8f7e688a83461daa21710bc7064631b44873fe0156f68:sk_w5fNqOfUsqdzz2VrBKYI_@db.prisma.io:5432/postgres?sslmode=require";
  const { Client } = pg;
  const client = new Client({ connectionString: cloudUrl, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    console.log("Connected to cloud PostgreSQL...");
    for (const u of updates) {
      await client.query(
        `UPDATE "Intervention" SET category = $1, pinned = $2, published = true WHERE slug = $3`,
        [u.category, u.pinned, u.slug]
      );
    }
    await client.query(`DELETE FROM "Intervention" WHERE slug = 'hnh'`).catch(() => {});
    console.log("Cloud PostgreSQL successfully updated!");
    await client.end();
  } catch (err) {
    console.warn("Could not patch cloud DB (will rely on build sync):", err.message);
  }
}

patch()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
