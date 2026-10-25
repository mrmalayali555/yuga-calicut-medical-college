import { execSync } from "child_process";

const url =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL;

if (
  url &&
  (url.startsWith("postgres://") ||
    url.startsWith("postgresql://") ||
    url.startsWith("prisma+postgres://"))
) {
  console.log("⚡ [ensure-db] Cloud PostgreSQL connection detected!");
  process.env.DATABASE_URL = url;

  try {
    console.log("⚡ [ensure-db] Running prisma db push to ensure cloud tables exist...");
    execSync("npx prisma db push --skip-generate --accept-data-loss", {
      stdio: "inherit",
      env: { ...process.env, DATABASE_URL: url },
    });
    console.log("✅ [ensure-db] Cloud database tables ready!");

    try {
      console.log("⚡ [ensure-db] Ensuring initial data seed...");
      execSync("node prisma/seed.mjs", {
        stdio: "inherit",
        env: { ...process.env, DATABASE_URL: url },
      });
      console.log("✅ [ensure-db] Cloud database seed complete!");
    } catch (seedErr) {
      console.warn("⚠️ [ensure-db] Seed notice:", seedErr.message);
    }
  } catch (err) {
    console.warn("⚠️ [ensure-db] Warning: Could not push schema to DB during build:", err.message);
  }
} else {
  console.log("ℹ️ [ensure-db] No remote PostgreSQL URL detected; skipping cloud db push.");
}
