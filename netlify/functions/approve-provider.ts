/**
 * approve-provider.ts — POST /.netlify/functions/approve-provider
 *
 * Admin-only endpoint to approve or reject a pending provider application.
 *
 * Body: { provider_id: string, action: "approve" | "reject", reason?: string }
 *
 * Rules:
 *  - Only users with the 'admin' or 'co_admin' role can call this.
 *  - Approving: sets providers.status = 'active', user_profiles.account_status = 'active'.
 *  - Rejecting: sets providers.status = 'rejected' + rejection_reason,
 *               user_profiles.account_status = 'rejected'.
 *  - Both actions are logged to audit_events.
 */

import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { sql } from "./_db";
import { getIdentity, hasRole, errorResponse, jsonResponse } from "./_auth";

interface ApproveBody {
  provider_id: string;
  action: "approve" | "reject";
  reason?: string;
}

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  if (event.httpMethod !== "POST") {
    return errorResponse(405, "Method not allowed");
  }

  // 1. Verify identity
  const identity = getIdentity(
    context as Parameters<typeof getIdentity>[0],
    (event.headers ?? {}) as Record<string, string | undefined>
  );
  if (!identity) {
    return errorResponse(401, "Unauthorized");
  }

  // 2. Authorize — admin or co_admin only
  const isAdmin =
    hasRole(identity, "admin") || hasRole(identity, "co_admin");
  if (!isAdmin) {
    // Also check DB roles (in case app_metadata is not yet synced)
    const roleCheck = await sql`
      SELECT role FROM user_roles
      WHERE user_id = ${identity.sub}
        AND role IN ('admin', 'co_admin')
      LIMIT 1
    `;
    if (roleCheck.rows.length === 0) {
      return errorResponse(403, "Forbidden — admin access required");
    }
  }

  // 3. Parse body
  let body: ApproveBody;
  try {
    body = JSON.parse(event.body ?? "{}") as ApproveBody;
  } catch {
    return errorResponse(400, "Invalid JSON");
  }

  const { provider_id, action, reason } = body;

  if (!provider_id || !["approve", "reject"].includes(action)) {
    return errorResponse(400, "provider_id and action (approve|reject) are required");
  }

  try {
    // 4. Load provider record
    const providerResult = await sql`
      SELECT id, user_id, status FROM providers WHERE id = ${provider_id} LIMIT 1
    `;
    if (providerResult.rows.length === 0) {
      return errorResponse(404, "Provider not found");
    }

    const provider = providerResult.rows[0];

    if (provider.status !== "pending_approval") {
      return errorResponse(409, `Provider is already ${provider.status}`);
    }

    const actorId = identity.sub;
    const targetUserId = provider.user_id as string;

    if (action === "approve") {
      // 5a. Activate provider
      await sql`
        UPDATE providers
        SET status = 'active', approved_by = ${actorId}, approved_at = now(), updated_at = now()
        WHERE id = ${provider_id}
      `;
      await sql`
        UPDATE user_profiles
        SET account_status = 'active', updated_at = now()
        WHERE id = ${targetUserId}
      `;
    } else {
      // 5b. Reject provider
      await sql`
        UPDATE providers
        SET status = 'rejected', rejection_reason = ${reason ?? null}, updated_at = now()
        WHERE id = ${provider_id}
      `;
      await sql`
        UPDATE user_profiles
        SET account_status = 'rejected', updated_at = now()
        WHERE id = ${targetUserId}
      `;
    }

    // 6. Audit log
    await sql`
      INSERT INTO audit_events (actor_id, action, target_type, target_id, metadata)
      VALUES (
        ${actorId},
        ${action === "approve" ? "approve_provider" : "reject_provider"},
        'provider',
        ${provider_id}::uuid,
        ${JSON.stringify({ reason: reason ?? null })}::jsonb
      )
    `;

    return jsonResponse({
      provider_id,
      action,
      message:
        action === "approve"
          ? "Provider approved and account activated."
          : "Provider application rejected.",
    });
  } catch (err) {
    console.error("[approve-provider] DB error:", err);
    return errorResponse(500, "Internal server error");
  }
};
