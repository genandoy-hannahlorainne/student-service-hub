/**
 * me.ts — GET /.netlify/functions/me
 * v3 — robust DB guard, detailed error logging
 */

import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { sql } from "./_db";
import { getIdentity, errorResponse, jsonResponse } from "./_auth";

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  if (event.httpMethod !== "GET") {
    return errorResponse(405, "Method not allowed").then(toHandlerResponse);
  }

  const identity = getIdentity(
    context as Parameters<typeof getIdentity>[0],
    (event.headers ?? {}) as Record<string, string | undefined>
  );
  if (!identity) {
    return errorResponse(401, "Unauthorized").then(toHandlerResponse);
  }

  // Guard: check DATABASE_URL before attempting any DB call
  if (!process.env.DATABASE_URL) {
    console.error("[me] DATABASE_URL env var is not set");
    return errorResponse(503, "Database not configured. Contact administrator.").then(toHandlerResponse);
  }

  try {
    const profileResult = await sql`
      SELECT
        up.id, up.display_name, up.email, up.phone,
        up.student_number, up.account_status,
        up.student_verification_status, up.created_at,
        COALESCE(
          json_agg(ur.role ORDER BY ur.created_at) FILTER (WHERE ur.role IS NOT NULL),
          '[]'::json
        ) AS roles
      FROM user_profiles up
      LEFT JOIN user_roles ur ON ur.user_id = up.id
      WHERE up.id = ${identity.sub}
      GROUP BY up.id
    `;

    if (profileResult.rows.length === 0) {
      // Check if this is an admin user set up via Netlify Identity app_metadata.
      // If so, auto-seed the profile and role so they don't need to run SQL manually.
      const identityRoles: string[] = identity.app_metadata?.roles ?? [];
      if (identityRoles.includes("admin") || identityRoles.includes("co_admin")) {
        const role = identityRoles.includes("admin") ? "admin" : "co_admin";
        const displayName =
          identity.user_metadata?.full_name ??
          identity.email.split("@")[0];

        await sql`
          INSERT INTO user_profiles (
            id, display_name, email, account_status, student_verification_status
          ) VALUES (
            ${identity.sub}, ${displayName}, ${identity.email},
            'active', 'not_required'
          )
          ON CONFLICT (id) DO NOTHING
        `;
        await sql`
          INSERT INTO user_roles (user_id, role)
          VALUES (${identity.sub}, ${role}::user_role)
          ON CONFLICT (user_id, role) DO NOTHING
        `;
        await sql`
          INSERT INTO audit_events (actor_id, action, target_type, target_id, metadata)
          VALUES (
            ${identity.sub}, 'auto_seed_admin', 'user', ${identity.sub},
            ${JSON.stringify({ role, email: identity.email, source: "me_auto_seed" })}::jsonb
          )
        `;

        // Re-fetch the freshly created profile
        const seededResult = await sql`
          SELECT
            up.id, up.display_name, up.email, up.phone,
            up.student_number, up.account_status,
            up.student_verification_status, up.created_at,
            COALESCE(
              json_agg(ur.role ORDER BY ur.created_at) FILTER (WHERE ur.role IS NOT NULL),
              '[]'::json
            ) AS roles
          FROM user_profiles up
          LEFT JOIN user_roles ur ON ur.user_id = up.id
          WHERE up.id = ${identity.sub}
          GROUP BY up.id
        `;
        return jsonResponse({ profile: seededResult.rows[0], provider: null }).then(toHandlerResponse);
      }

      // Not an admin — profile not yet created, registration still needed.
      return errorResponse(404, "Profile not found. Complete registration first.").then(toHandlerResponse);
    }

    const profile = profileResult.rows[0];
    const roles = profile.roles as string[];

    // Attach provider record if applicable
    let provider = null;
    if (roles.includes("provider")) {
      const providerResult = await sql`
        SELECT
          id, business_name, contact_person, business_address,
          service_type, status, approved_at, rejection_reason
        FROM providers
        WHERE user_id = ${identity.sub}
        LIMIT 1
      `;
      if (providerResult.rows.length > 0) {
        provider = providerResult.rows[0];
      }
    }

    return jsonResponse({ profile, provider }).then(toHandlerResponse);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[me] DB error:", msg);
    return errorResponse(500, `Database error: ${msg}`).then(toHandlerResponse);
  }
};

async function toHandlerResponse(res: Response) {
  const body = await res.text();
  const headers: Record<string, string> = {};
  res.headers.forEach((value, key) => { headers[key] = value; });
  return { statusCode: res.status, headers, body };
}
