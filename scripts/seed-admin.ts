import { config } from "dotenv";
import { join } from "path";
import { Client } from "pg";
import bcrypt from "bcryptjs";

config({ path: join(__dirname, "..", ".env") });

/**
 * Crée — ou promeut — le compte administrateur.
 *
 * Les identifiants sont lus dans l'environnement : aucun mot de passe n'est
 * écrit dans le dépôt (constat SEC-02 de `docs/AUDIT-SYSTEME.md`).
 *
 *   ADMIN_EMAIL=vous@exemple.com ADMIN_PASSWORD='…' npm run db:seed-admin
 *
 * Par défaut, le script ne réécrit jamais le mot de passe d'un compte qui
 * existe déjà : il se contente de lui rendre le rôle admin. Passez `--force`
 * pour réinitialiser volontairement le mot de passe.
 */

const MIN_PASSWORD_LENGTH = 12;
const BCRYPT_COST = 12;

const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_NAME = process.env.ADMIN_NAME?.trim() || "Administrateur";
const FORCE_PASSWORD_RESET = process.argv.includes("--force");

function assertConfig() {
  const problems: string[] = [];

  if (!ADMIN_EMAIL) {
    problems.push("ADMIN_EMAIL est requis (ajoutez-le à .env).");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ADMIN_EMAIL)) {
    problems.push(`ADMIN_EMAIL n'est pas une adresse valide : ${ADMIN_EMAIL}`);
  }

  if (!ADMIN_PASSWORD) {
    problems.push("ADMIN_PASSWORD est requis (ajoutez-le à .env).");
  } else if (ADMIN_PASSWORD.length < MIN_PASSWORD_LENGTH) {
    problems.push(`ADMIN_PASSWORD doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`);
  } else if (/^(oci\.com|password|admin|123456|changeme)$/i.test(ADMIN_PASSWORD)) {
    problems.push("ADMIN_PASSWORD est un mot de passe trivial : choisissez-en un autre.");
  }

  if (problems.length > 0) {
    throw new Error(`Configuration invalide :\n  - ${problems.join("\n  - ")}`);
  }
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set (add it to .env)");
  }
  assertConfig();

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD as string, BCRYPT_COST);
  const client = new Client({ connectionString });
  await client.connect();

  try {
    const existing = await client.query<{ id: string }>(
      "select id from users where email = $1",
      [ADMIN_EMAIL],
    );

    if (existing.rows.length > 0 && !FORCE_PASSWORD_RESET) {
      // Le compte existe : on lui rend le rôle admin sans toucher au mot de passe.
      const result = await client.query<{ id: string }>(
        `update users
            set role = 'admin',
                is_active = true,
                display_name = coalesce(display_name, $2),
                updated_at = now()
          where email = $1
      returning id`,
        [ADMIN_EMAIL, ADMIN_NAME],
      );
      await client.query("insert into user_progress (user_id) values ($1) on conflict do nothing", [
        result.rows[0].id,
      ]);
      console.log(`Compte promu administrateur (mot de passe inchangé) : ${ADMIN_EMAIL}`);
      console.log("Utilisez --force pour réinitialiser volontairement le mot de passe.");
      return;
    }

    const result = await client.query<{ id: string }>(
      `insert into users (email, password_hash, display_name, role, is_active)
       values ($1, $2, $3, 'admin', true)
       on conflict (email) do update set
         password_hash = excluded.password_hash,
         role = 'admin',
         is_active = true,
         display_name = coalesce(users.display_name, excluded.display_name),
         updated_at = now()
       returning id`,
      [ADMIN_EMAIL, passwordHash, ADMIN_NAME],
    );
    await client.query("insert into user_progress (user_id) values ($1) on conflict do nothing", [
      result.rows[0].id,
    ]);
    console.log(
      existing.rows.length > 0
        ? `Mot de passe administrateur réinitialisé : ${ADMIN_EMAIL}`
        : `Compte administrateur créé : ${ADMIN_EMAIL}`,
    );
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("Admin seed failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
