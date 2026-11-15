/**
 * Resolves a valid student number to its Identity email.
 *
 * Passwords are intentionally not accepted here. Netlify Identity remains
 * responsible for credential verification after the email is resolved.
 */

import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { sql } from "./_db";
import { errorResponse, jsonResponse } from "./_auth";

const STUDENT_NUM_RE = /^\d{4}-\d{5}-TG-[01]$/;

export const handler: Handler = async (
  event: HandlerEvent,
  _context: HandlerContext
) => {
  if (event.httpMethod !== "POST") {
    return errorResponse(405, "Method not allowed");
  }

  let studentNumber: string;
  try {
    const body = JSON.parse(event.body ?? "{}") as { student_number?: unknown };
    studentNumber = typeof body.student_number === "string"
      ? body.student_number.trim().toUpperCase()
      : "";
  } catch {
    return errorResponse(400, "Invalid JSON body");
  }

  if (!STUDENT_NUM_RE.test(studentNumber)) {
    return errorResponse(400, "Invalid student number format.");
  }

  if (!process.env.DATABASE_URL) {
    console.error("[student-login] DATABASE_URL not set");
    return errorResponse(503, "Database not configured.");
  }

  try {
    const result = await sql`
      SELECT email
      FROM user_profiles
      WHERE student_number = ${studentNumber}
        AND account_status = 'active'::account_status
        AND EXISTS (
          SELECT 1
          FROM user_roles
          WHERE user_roles.user_id = user_profiles.id
            AND user_roles.role = 'student'::user_role
        )
      LIMIT 1
    `;

    if (result.rows.length === 0) {
      return errorResponse(404, "Invalid student number or password.");
    }

    return jsonResponse({ email: result.rows[0].email });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[student-login] DB error:", message);
    return errorResponse(500, "Could not resolve student account.");
  }
};
