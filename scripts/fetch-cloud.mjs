import pg from "pg";
import fs from "fs";

const { Client } = pg;

const urls = [
  "postgres://3b2974e76f6aa61cc5c8f7e688a83461daa21710bc7064631b44873fe0156f68:sk_w5fNqOfUsqdzz2VrBKYI_@db.prisma.io:5432/postgres?sslmode=require",
  "postgres://3b2974e76f6aa61cc5c8f7e688a83461daa21710bc7064631b44873fe0156f68:sk_w5fNqOfUsqdzz2VrBKYI_@pooled.db.prisma.io:5432/postgres?sslmode=require",
  "postgres://3b2974e76f6aa61cc5c8f7e688a83461daa21710bc7064631b44873fe0156f68:sk_PBvjqTtrRJ7EQyjZWzTYu@db.prisma.io:5432/postgres?sslmode=require",
  "postgres://3b2974e76f6aa61cc5c8f7e688a83461daa21710bc7064631b44873fe0156f68:sk_PBvjqTtrRJ7EQyjZWzTYu@pooled.db.prisma.io:5432/postgres?sslmode=require",
];

async function tryConnect() {
  for (const url of urls) {
    console.log("Trying URL:", url.replace(/:[^:@]+@/, ":***@"));
    const client = new Client({
      connectionString: url,
      ssl: { rejectUnauthorized: false }
    });
    try {
      await client.connect();
      console.log("SUCCESSFULLY CONNECTED!");
      
      // List all tables
      const tablesRes = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
      `);
      console.log("Tables found:", tablesRes.rows.map(r => r.table_name));

      const backup = {};
      for (const row of tablesRes.rows) {
        const table = row.table_name;
        if (table === "_prisma_migrations") continue;
        const dataRes = await client.query(`SELECT * FROM "${table}"`);
        console.log(`Table ${table}: ${dataRes.rows.length} rows`);
        backup[table] = dataRes.rows;
      }

      fs.writeFileSync("cloud-db-backup.json", JSON.stringify(backup, null, 2), "utf8");
      console.log("Saved full backup to cloud-db-backup.json!");
      await client.end();
      return backup;
    } catch (err) {
      console.error("Failed with this URL:", err.message);
      try { await client.end(); } catch (e) {}
    }
  }
  throw new Error("Could not connect with any provided credentials.");
}

tryConnect().catch(console.error);
