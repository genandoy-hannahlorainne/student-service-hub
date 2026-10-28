/**
 * _db.ts — Neon PostgreSQL connection helper for Netlify Functions.
 *
 * Uses a static import so esbuild can bundle it correctly.
 * The DATABASE_URL env var must be set in Netlify environment variables.
 */

import { neon } from "@neondatabase/serverless";

type SqlQuery = ReturnType<typeof neon>;

let _sql: SqlQuery | null = null;

export function getSql(): SqlQuery {
  if (_sql) return _sql;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set in Netlify environment variables.");
  }
  _sql = neon(url);
  return _sql;
}

/**
 * Tagged-template SQL helper. Usage:
 *   const result = await sql`SELECT * FROM user_profiles WHERE id = ${id}`;
 *   result.rows[0]
 */
export async function sql(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<{ rows: Record<string, unknown>[] }> {
  const client = getSql();
  const result = await client(strings, ...values);
  // neon() returns rows directly as an array — wrap it to match existing usage
  return { rows: result as Record<string, unknown>[] };
}
