/**
 * setup-admin.ts — ONE-TIME: set admin role in Netlify Identity + DB.
 * DELETE THIS FILE after it succeeds.
 *
 * Call while logged in as the admin user:
 *   GET /.netlify/functions/setup-admin?secret=uniserve-setup-2026
 */

import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { sql } from "./_db";
import { getIdentity } from "./_auth";

const TARGET_EMAIL = "genandoyhannahlorainne@gmail.com";
const TARGET_NAME  = "ADMIN";

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  if (event.queryStringParameters?.secret !== "uniserve-setup-2026") {
    return { statusCode: 403, body: JSON.stringify({ error: "Forbidden" }) };
  }

  const identity = getIdentity(
    context as Parameters<typeof getIdentity>[0],
    (event.headers ?? {}) as Record<string, string | undefined>
  );

  if (!identity) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: "Not logged in. Open the app, log in as the admin user, then call this URL in the same browser.",
      }),
    };
  }

  const diag: Record<string, unknown> = {
    caller_sub: identity.sub,
    caller_email: identity.email,
    caller_roles: identity.app_metadata?.roles ?? [],
    database_url_set: !!process.env.DATABASE_URL,
    jwt_secret_set: !!process.env.JWT_SECRET,
  };

  // ── Step 1: Set role in Netlify Identity via GoTrue admin API ─────────────
  const identityUrl = (process.env.URL ?? "https://organization-student-services-hub.netlify.app") + "/.netlify/identity";
  const jwtSecret = process.env.JWT_SECRET;
  let identityResult: unknown = null;

  if (jwtSecret) {
    try {
      const updateRes = await fetch(`${identityUrl}/admin/users/${identity.sub}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${jwtSecret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ app_metadata: { roles: ["admin"] } }),
      });
      const updateBody = await updateRes.text();
      identityResult = { status: updateRes.status, body: updateBody };
    } catch (e) {
      identityResult = { error: String(e) };
    }
  } else {
    identityResult = "JWT_SECRET not available — skipping Netlify Identity role update";
  }
  diag.identity_update = identityResult;

  // ── Step 2: Upsert profile + role in DB ───────────────────────────────────
  if (!process.env.DATABASE_URL) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "DATABASE_URL not set", diag }),
    };
  }

  try {
    await sql`
      INSERT INTO user_profiles (id, display_name, email, account_status, student_verification_status)
      VALUES (${identity.sub}, ${TARGET_NAME}, ${TARGET_EMAIL}, 'active'::account_status, 'not_required'::student_verification)
      ON CONFLICT (id) DO UPDATE
        SET display_name   = EXCLUDED.display_name,
            account_status = 'active',
            updated_at     = now()
    `;

    await sql`
      INSERT INTO user_roles (user_id, role)
      VALUES (${identity.sub}, 'admin'::user_role)
      ON CONFLICT (user_id, role) DO NOTHING
    `;

    const verify = await sql`
      SELECT up.id, up.email, up.account_status,
             COALESCE(
               json_agg(ur.role ORDER BY ur.created_at) FILTER (WHERE ur.role IS NOT NULL),
               '[]'::json
             ) AS roles
      FROM user_profiles up
      LEFT JOIN user_roles ur ON ur.user_id = up.id
      WHERE up.id = ${identity.sub}
      GROUP BY up.id
    `;

    diag.db_result = verify.rows[0] ?? "no row returned";

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "✓ DB profile + admin role set. Now log in again — you should reach the admin dashboard. Then delete setup-admin.ts.",
        diag,
      }),
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "DB error", detail: msg, diag }),
    };
  }
};
