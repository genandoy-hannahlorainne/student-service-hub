/**
 * register.ts — POST /.netlify/functions/register
 *
 * Called AFTER Netlify Identity creates the auth user account.  This Function
 * writes the extended profile, assigns the correct role, and creates a provider
 * record when the registrant is applying as a service provider.
 *
 * Flow:
 *  1. Browser calls netlify-identity-widget to create the auth account.
 *  2. Browser calls this Function with the Identity JWT + registration payload.
 *  3. Function verifies identity, writes user_profiles + user_roles.
 *  4. For providers, also inserts into providers (status = pending_approval).
 *  5. Returns the created profile.
 *
 * Rules enforced here (server-side):
 *  - Guests receive role = 'guest'; they cannot self-assign 'student' or higher.
 *  - Students receive role = 'student' with account_status = 'active'.
 *  - Providers receive role = 'provider' with account_status = 'pending' until
 *    an admin approves them.
 *  - The 'admin' role CANNOT be self-registered — it is granted only by an
 *    existing admin through the approve-provider or a separate admin-grant flow.
 */

import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { sql } from "./_db";
import { getIdentity, errorResponse, jsonResponse } from "./_auth";

interface RegisterBody {
  role: "student" | "provider" | "guest";
  // PUPTian fields
  display_name?: string;
  student_number?: string;
  phone?: string;
  // Provider-specific fields
  business_name?: string;
  contact_person?: string;
  business_address?: string;
  service_type?: string;
  // Guest fields
  affiliation?: string;
}

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  if (event.httpMethod !== "POST") {
    return errorResponse(405, "Method not allowed").then(toHandlerResponse);
  }

  // 1. Verify identity
  const identity = getIdentity(
    context as Parameters<typeof getIdentity>[0],
    (event.headers ?? {}) as Record<string, string | undefined>
  );
  if (!identity) {
    return errorResponse(401, "Unauthorized — missing or invalid Identity token").then(toHandlerResponse);
  }

  // 2. Parse body
  let body: RegisterBody;
  try {
    body = JSON.parse(event.body ?? "{}") as RegisterBody;
  } catch {
    return errorResponse(400, "Invalid JSON body").then(toHandlerResponse);
  }

  const { role } = body;

  // Guard: block admin self-registration
  if (role === "admin" || (role as string) === "co_admin") {
    return errorResponse(403, "Admin accounts cannot be self-registered").then(toHandlerResponse);
  }

  if (!role || !["student", "provider", "guest"].includes(role)) {
    return errorResponse(400, "Invalid role. Must be student, provider, or guest").then(toHandlerResponse);
  }

  const userId = identity.sub;
  const email = identity.email;

  try {
    // 3. Check for duplicate registration
    const existing = await sql`
      SELECT id FROM user_profiles WHERE id = ${userId}
    `;
    if (existing.rows.length > 0) {
      return jsonResponse({ message: "Profile already exists", user_id: userId }).then(toHandlerResponse);
    }

    // 4. Determine account_status and student_verification
    const accountStatus =
      role === "provider" ? "pending" : "active";
    const studentVerification =
      role === "student" ? "pending" : "not_required";

    const displayName =
      body.display_name ??
      identity.user_metadata?.full_name ??
      email.split("@")[0];

    // 5. Insert user_profiles
    await sql`
      INSERT INTO user_profiles (
        id, display_name, email, phone, student_number,
        account_status, student_verification_status
      ) VALUES (
        ${userId}, ${displayName}, ${email},
        ${body.phone ?? null}, ${body.student_number ?? null},
        ${accountStatus}::account_status,
        ${studentVerification}::student_verification
      )
    `;

    // 6. Assign role
    await sql`
      INSERT INTO user_roles (user_id, role)
      VALUES (${userId}, ${role}::user_role)
    `;

    // 7. Provider record (pending admin approval)
    if (role === "provider") {
      if (
        !body.business_name ||
        !body.contact_person ||
        !body.business_address ||
        !body.service_type
      ) {
        return errorResponse(
          400,
          "Provider registration requires: business_name, contact_person, business_address, service_type"
        ).then(toHandlerResponse);
      }

      await sql`
        INSERT INTO providers (user_id, business_name, contact_person, business_address, service_type, status)
        VALUES (
          ${userId},
          ${body.business_name},
          ${body.contact_person},
          ${body.business_address},
          ${body.service_type},
          'pending_approval'
        )
      `;
    }

    // 8. Audit event
    await sql`
      INSERT INTO audit_events (actor_id, action, target_type, target_id, metadata)
      VALUES (
        ${userId}, 'register', 'user', ${userId},
        ${JSON.stringify({ role, email })}::jsonb
      )
    `;

    return jsonResponse({
      user_id: userId,
      email,
      role,
      account_status: accountStatus,
      message:
        role === "provider"
          ? "Provider application submitted. Pending admin approval."
          : "Registration successful.",
    }).then(toHandlerResponse);
  } catch (err) {
    console.error("[register] DB error:", err);
    return errorResponse(500, "Internal server error").then(toHandlerResponse);
  }
};

// Convert Web Response to Netlify Handler response shape
async function toHandlerResponse(res: Response) {
  const body = await res.text();
  const headers: Record<string, string> = {};
  res.headers.forEach((value, key) => {
    headers[key] = value;
  });
  return {
    statusCode: res.status,
    headers,
    body,
  };
}
