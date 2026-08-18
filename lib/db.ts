import { Pool, type QueryResultRow } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

function createPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  return new Pool({ connectionString, max: 5 });
}

// Lazily create the pool on first real use instead of at module import
// time. Next.js imports route handler modules during the build's "collect
// page data" step even though nothing is actually invoked, so throwing
// eagerly here (e.g. when DATABASE_URL isn't present in the build
// environment) would fail the whole build rather than just requests that
// touch the database.
export function getPool(): Pool {
  if (!global.__pgPool) {
    global.__pgPool = createPool();
  }
  return global.__pgPool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
) {
  return getPool().query<T>(text, params);
}
