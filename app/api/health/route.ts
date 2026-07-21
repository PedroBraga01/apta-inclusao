import { sql } from "drizzle-orm";
import { getDb } from "../../../db";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!process.env.DATABASE_URL?.trim()) {
    return Response.json(
      { status: "demo", database: "not_configured" },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    await getDb().execute(sql`select 1`);
    return Response.json(
      { status: "ok" },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { status: "unavailable" },
      {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
