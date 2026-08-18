import { config } from "dotenv";
import { join } from "path";
import { Client } from "pg";
import bcrypt from "bcryptjs";

config({ path: join(__dirname, "..", ".env") });

const ADMIN_EMAIL = "admin@oci.com";
const ADMIN_PASSWORD = "oci.com";
const ADMIN_NAME = "Administrateur";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set (add it to .env)");
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const client = new Client({ connectionString });
  await client.connect();

  try {
    const result = await client.query<{ id: string }>(
      `insert into users (email, password_hash, display_name, role, is_active)
       values ($1, $2, $3, 'admin', true)
       on conflict (email) do update set
         role = 'admin',
         is_active = true,
         display_name = coalesce(users.display_name, excluded.display_name)
       returning id`,
      [ADMIN_EMAIL, passwordHash, ADMIN_NAME],
    );
    const userId = result.rows[0].id;
    await client.query(`insert into user_progress (user_id) values ($1) on conflict do nothing`, [userId]);
    console.log(`Admin account ready: ${ADMIN_EMAIL}`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("Admin seed failed:", err);
  process.exit(1);
});
