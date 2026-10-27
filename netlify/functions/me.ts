/**
 * me.ts — GET /.netlify/functions/me
 *
 * Returns the authenticated user's profile, roles, and (for providers)
 * their provider record including approval status.
 *
 * The React client calls this on every app load to:
 *  - Determine which dashboard to show
 *  - Know if a provider is still pending
 *  - Gate admin routes
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
      // Profile not yet created — registration Function hasn't been called yet.
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
    console.error("[me] DB error:", err);
    return errorResponse(500, "Internal server error").then(toHandlerResponse);
  }
};

async function toHandlerResponse(res: Response) {
  const body = await res.text();
  const headers: Record<string, string> = {};
  res.headers.forEach((value, key) => { headers[key] = value; });
  return { statusCode: res.status, headers, body };
}
