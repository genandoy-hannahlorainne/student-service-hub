/**
 * _db.ts — Neon PostgreSQL connection helper for Netlify Functions.
 *
 * Uses the `@neondatabase/serverless` driver which is optimised for
 * serverless environments (HTTP-based, no persistent connection pool).
 *
 * Usage:
 *   import { sql } from "./_db";
 *   const rows = await sql`SELECT * FROM user_profiles WHERE id = ${id}`;
 */

// Dynamic import so the module only fails at runtime when the env var is
// missing, not during cold-start of unrelated Functions.
type NeonQueryFunction = (
  strings: TemplateStringsArray,
  ...values: unknown[]
) => Promise<{ rows: Record<string, unknown>[] }>;

let _sql: NeonQueryFunction | null = null;

async function getClient(): Promise<NeonQueryFunction> {
  if (_sql) return _sql;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add it to your Netlify environment variables."
    );
  }

  // @neondatabase/serverless is installed as a Netlify Function dependency.
  // It is intentionally not in the React client package.json.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { neon } = await import("@neondatabase/serverless");
  _sql = neon(url) as NeonQueryFunction;
  return _sql;
}

export async function sql(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<{ rows: Record<string, unknown>[] }> {
  const client = await getClient();
  return client(strings, ...values);
}
