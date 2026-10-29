/**
 * register.ts — POST /.netlify/functions/register
 *
 * Called after the GoTrue account is confirmed (email verification or invite
 * acceptance). Creates the extended profile row and assigns the user's role.
 *
 * Security rules:
 *  - Requires a valid Netlify Identity JWT (injected by the Functions runtime
 *    via clientContext, or decoded from the Authorization header as fallback).
 *  - Passwords are NEVER accepted here — GoTrue owns all credentials.
 *  - Admin / co_admin roles cannot be self-assigned.
 *  - Student number format is validated server-side.
 *  - Duplicate registrations are handled gracefully (idempotent).
 */

import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { sql } from "./_db";
import { getIdentity, errorResponse, jsonResponse } from "./_auth";

interface RegisterBody {
  role: "student" | "provider" | "guest";
  display_name?: string;
  student_number?: string;
  phone?: string;
  // Provider-only
  business_name?: string;
  contact_person?: string;
  business_address?: string;
  service_type?: string;
  // Guest-only
  affiliation?: string;
}

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  if (event.httpMethod !== "POST") {
    return errorResponse(405, "Method not allowed");
  }

  // 1. Verify the GoTrue identity
  const identity = getIdentity(
    context as Parameters<typeof getIdentity>[0],
    (event.headers ?? {}) as Record<string, string | undefined>
  );
  if (!identity) {
    return errorResponse(401, "Unauthorized — missing or invalid Identity token");
  }

  // 2. Parse and validate body
  let body: RegisterBody;
  try {
    body = JSON.parse(event.body ?? "{}") as RegisterBody;
  } catch {
    return errorResponse(400, "Invalid JSON body");
  }

  const { role } = body;

  // Block admin self-registration
  if (!role || role === ("admin" as string) || role === ("co_admin" as string)) {
    return errorResponse(403, "This role cannot be self-registered");
  }

  if (!["student", "provider", "guest"].includes(role)) {
    return errorResponse(400, "Invalid role. Must be student, provider, or guest");
  }

  // Student number validation
  if (role === "student") {
    const STUDENT_NUM_RE = /^\d{4}-\d{5}-TG-[01]$/;
    if (!STUDENT_NUM_RE.test(body.student_number ?? "")) {
      return errorResponse(
        400,
        "Invalid student number format. Required: YYYY-NNNNN-TG-D (e.g. 2023-00438-TG-0)"
      );
    }
  }

  // Provider field check
  if (role === "provider") {
    if (!body.business_name || !body.contact_person || !body.business_address || !body.service_type) {
      return errorResponse(400, "Provider registration requires: business_name, contact_person, business_address, service_type");
    }
  }

  const userId = identity.sub;
  const email = identity.email;

  if (!process.env.DATABASE_URL) {
    console.error("[register] DATABASE_URL not set");
    return errorResponse(503, "Database not configured");
  }

  try {
    // 3. Idempotency — if the profile already exists, return success
    const existing = await sql`SELECT id FROM user_profiles WHERE id = ${userId}`;
    if (existing.rows.length > 0) {
      console.log("[register] Profile already exists for sub =", userId.slice(0, 8) + "...");
      return jsonResponse({ message: "Profile already exists", user_id: userId });
    }

    const accountStatus = role === "provider" ? "pending" : "active";
    const studentVerification = role === "student" ? "pending" : "not_required";

    const displayName =
      body.display_name ??
      identity.user_metadata?.full_name ??
      email.split("@")[0];

    // 4. Insert user_profiles
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

    // 5. Assign role
    await sql`
      INSERT INTO user_roles (user_id, role)
      VALUES (${userId}, ${role}::user_role)
      ON CONFLICT (user_id, role) DO NOTHING
    `;

    // 6. Provider record
    if (role === "provider") {
      await sql`
        INSERT INTO providers (user_id, business_name, contact_person, business_address, service_type, status)
        VALUES (
          ${userId}, ${body.business_name!}, ${body.contact_person!},
          ${body.business_address!}, ${body.service_type!}, 'pending_approval'
        )
      `;
    }

    // 7. Audit log
    await sql`
      INSERT INTO audit_events (actor_id, action, target_type, target_id, metadata)
      VALUES (
        ${userId}, 'register', 'user', ${userId},
        ${JSON.stringify({ role })}::jsonb
      )
    `;

    return jsonResponse({
      user_id: userId,
      email,
      role,
      account_status: accountStatus,
      message: role === "provider"
        ? "Provider application submitted. Pending admin approval."
        : "Registration successful.",
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[register] DB error:", msg);
    return errorResponse(500, "Internal server error");
  }
};
