/**
 * me.ts — GET /.netlify/functions/me
 * v5 — plain-object responses, no .then() wrappers
 */

import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { sql } from "./_db";
import { getIdentity, errorResponse, jsonResponse } from "./_auth";

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  if (event.httpMethod !== "GET") return errorResponse(405, "Method not allowed");

  const identity = getIdentity(
    context as Parameters<typeof getIdentity>[0],
    (event.headers ?? {}) as Record<string, string | undefined>
  );
  if (!identity) return errorResponse(401, "Unauthorized");

  if (!process.env.DATABASE_URL) {
    console.error("[me] DATABASE_URL not set");
    return errorResponse(503, "Database not configured.");
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
      // Auto-seed admin if Netlify Identity app_metadata has the role
      const identityRoles: string[] = identity.app_metadata?.roles ?? [];
      if (identityRoles.includes("admin") || identityRoles.includes("co_admin")) {
        const role = identityRoles.includes("admin") ? "admin" : "co_admin";
        const displayName =
          identity.user_metadata?.full_name ??
          identity.email.split("@")[0];

        await sql`
          INSERT INTO user_profiles (id, display_name, email, account_status, student_verification_status)
          VALUES (${identity.sub}, ${displayName}, ${identity.email}, 'active'::account_status, 'not_required'::student_verification)
          ON CONFLICT (id) DO NOTHING
        `;
        await sql`
          INSERT INTO user_roles (user_id, role)
          VALUES (${identity.sub}, ${role}::user_role)
          ON CONFLICT (user_id, role) DO NOTHING
        `;

        const seeded = await sql`
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
        return jsonResponse({ profile: seeded.rows[0], provider: null });
      }

      return errorResponse(404, "Profile not found. Complete registration first.");
    }

    const profile = profileResult.rows[0];
    const roles = profile.roles as string[];

    let provider = null;
    if (roles.includes("provider")) {
      const providerResult = await sql`
        SELECT id, business_name, contact_person, business_address,
               service_type, status, approved_at, rejection_reason
        FROM providers
        WHERE user_id = ${identity.sub}
        LIMIT 1
      `;
      if (providerResult.rows.length > 0) {
        provider = providerResult.rows[0];
      }
    }

    return jsonResponse({ profile, provider });

  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[me] error:", msg);
    return errorResponse(500, `Server error: ${msg}`);
  }
};
