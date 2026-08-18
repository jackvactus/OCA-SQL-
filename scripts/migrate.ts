import { config } from "dotenv";
import { readFileSync } from "fs";
import { join } from "path";
import { Client } from "pg";

config({ path: join(__dirname, "..", ".env") });

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set (add it to .env)");
  }

  const sql = readFileSync(join(__dirname, "..", "db", "schema.sql"), "utf-8");
  const client = new Client({ connectionString });

  await client.connect();
  try {
    await client.query(sql);
    console.log("Migration applied successfully.");
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
