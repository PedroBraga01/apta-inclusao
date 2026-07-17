import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

type DatabaseGlobals = typeof globalThis & {
  aptaPostgresPool?: Pool;
};

const databaseGlobals = globalThis as DatabaseGlobals;

function databaseUrl(): string {
  const value = process.env.DATABASE_URL?.trim();
  if (!value) {
    throw new Error(
      "DATABASE_URL is not configured. Link the Render Postgres database to the web service or define DATABASE_URL locally.",
    );
  }
  return value;
}

function getPool(): Pool {
  if (!databaseGlobals.aptaPostgresPool) {
    databaseGlobals.aptaPostgresPool = new Pool({
      connectionString: databaseUrl(),
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    });
  }
  return databaseGlobals.aptaPostgresPool;
}

export function getDb() {
  return drizzle(getPool(), { schema });
}

export async function closeDb(): Promise<void> {
  if (databaseGlobals.aptaPostgresPool) {
    await databaseGlobals.aptaPostgresPool.end();
    databaseGlobals.aptaPostgresPool = undefined;
  }
}
