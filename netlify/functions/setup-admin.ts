/**
 * setup-admin.ts — ONE-TIME diagnostic + admin role setup function.
 * DELETE THIS FILE after running it once successfully.
 *
 * Usage:
 *   GET /.netlify/functions/setup-admin?secret=uniserve-setup-2026
 *
 * This function:
 *  1. Checks if DATABASE_URL is set
 *  2. Inserts the admin profile + role directly into the DB (bypasses GoTrue API)
 *  3. Returns a full diagnostic so you can see exactly what happened
 */

import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { sql } from "./_db";
import { getIdentity } from "./_auth";

const TARGET_EMAIL = "genandoyhannahlorainne@gmail.com";
const TARGET_NAME = "ADMIN";

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  if (event.queryStringParameters?.secret !== "uniserve-setup-2026") {
    return { statusCode: 403, body: JSON.stringify({ error: "Forbidden" }) };
  }

  const diag: Record<string, unknown> = {
    database_url_set: !!process.env.DATABASE_URL,
    database_url_preview: process.env.DATABASE_URL
      ? process.env.DATABASE_URL.substring(0, 40) + "..."
      : null,
  };

  // Check if caller is authenticated (if so, use their sub as the admin ID)
  const identity = getIdentity(
    context as Parameters<typeof getIdentity>[0],
    (event.headers ?? {}) as Record<string, string | undefined>
  );
  diag.caller_identity = identity
    ? { sub: identity.sub, email: identity.email, roles: identity.app_metadata?.roles }
    : null;

  if (!process.env.DATABASE_URL) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "DATABASE_URL is not set in this environment", diag }),
    };
  }

  try {
    // 1. Check if a profile already exists for this email
    const existing = await sql`
      SELECT up.id, up.email, array_agg(ur.role) as roles
      FROM user_profiles up
      LEFT JOIN user_roles ur ON ur.user_id = up.id
      WHERE up.email = ${TARGET_EMAIL}
      GROUP BY up.id
    `;
    diag.existing_profile = existing.rows[0] ?? null;

    if (identity) {
      // Caller is logged in — use their real Netlify Identity sub as the profile ID
      diag.strategy = "upsert_with_real_sub";

      await sql`
        INSERT INTO user_profiles (id, display_name, email, account_status, student_verification_status)
        VALUES (${identity.sub}, ${TARGET_NAME}, ${TARGET_EMAIL}, 'active', 'not_required')
        ON CONFLICT (id) DO UPDATE
          SET display_name = EXCLUDED.display_name,
              account_status = 'active',
              updated_at = now()
      `;
      await sql`
        INSERT INTO user_roles (user_id, role)
        VALUES (${identity.sub}, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING
      `;

      const verify = await sql`
        SELECT up.id, up.email, up.account_status,
               array_agg(ur.role) as roles
        FROM user_profiles up
        LEFT JOIN user_roles ur ON ur.user_id = up.id
        WHERE up.id = ${identity.sub}
        GROUP BY up.id
      `;
      diag.result = verify.rows[0];

    } else if (existing.rows.length > 0) {
      // Profile exists by email but we don't have a sub — just ensure admin role
      diag.strategy = "add_role_to_existing";
      const existingId = existing.rows[0].id as string;
      await sql`
        UPDATE user_profiles SET account_status = 'active', updated_at = now()
        WHERE id = ${existingId}
      `;
      await sql`
        INSERT INTO user_roles (user_id, role)
        VALUES (${existingId}, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING
      `;
      diag.result = "Role added to existing profile";

    } else {
      diag.strategy = "none";
      diag.message = "Not logged in and no existing profile found. Please call this endpoint while logged into the app (open app first, log in, then call this URL).";
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: diag.strategy !== "none", diag }),
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "DB error", detail: msg, diag }),
    };
  }
};
