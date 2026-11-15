import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { sql } from "./_db";
import { getIdentity, errorResponse, hasRole, jsonResponse } from "./_auth";

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const identity = getIdentity(
    context as Parameters<typeof getIdentity>[0],
    (event.headers ?? {}) as Record<string, string | undefined>
  );
  if (!identity) return errorResponse(401, "Unauthorized");

  try {
    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body ?? "{}") as {
        service_type?: string;
        amount?: number;
        payment_method?: string;
        provider_id?: string | null;
        metadata?: Record<string, unknown>;
      };
      if (!body.service_type || typeof body.amount !== "number" || body.amount < 0) {
        return errorResponse(400, "A valid service type and amount are required.");
      }

      const provider = body.provider_id
        ? await sql`SELECT id FROM providers WHERE id = ${body.provider_id}::uuid AND status = 'active'::provider_status LIMIT 1`
        : await sql`SELECT id FROM providers WHERE status = 'active'::provider_status AND LOWER(service_type) IN ('printing', 'both') ORDER BY created_at ASC LIMIT 1`;
      const providerId = provider.rows[0]?.id ?? null;
      if (!providerId) {
        return errorResponse(409, "No active provider is available for this service.");
      }
      const referenceCode = `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      const inserted = await sql`
        INSERT INTO service_transactions (user_id, provider_id, service_type, reference_code, status, amount, payment_method, metadata)
        VALUES (${identity.sub}::uuid, ${providerId ? String(providerId) : null}::uuid, ${body.service_type}, ${referenceCode}, 'submitted', ${body.amount}, ${body.payment_method ?? null}, ${JSON.stringify(body.metadata ?? {})}::jsonb)
        RETURNING id, service_type, reference_code, status, amount, payment_method, created_at
      `;
      return jsonResponse({ transaction: inserted.rows[0] }, 201);
    }

    if (event.httpMethod === "PATCH") {
      const body = JSON.parse(event.body ?? "{}") as {
        reference_code?: string;
        status?: string;
      };
      const allowedStatuses = ["Accepted", "Processing", "Ready for Pickup", "Out for Delivery", "Completed", "Rejected"];
      if (!body.reference_code || !body.status || !allowedStatuses.includes(body.status)) {
        return errorResponse(400, "A valid reference code and order status are required.");
      }

      const roleResult = await sql`
        SELECT 1
        FROM user_roles
        WHERE role = 'provider'::user_role
          AND (
            user_id = ${identity.sub}::uuid
            OR user_id = (
              SELECT id FROM user_profiles WHERE email = ${identity.email} LIMIT 1
            )
          )
        LIMIT 1
      `;
      if (roleResult.rows.length === 0 && !hasRole(identity, "provider")) {
        return errorResponse(403, "Only service providers can update order status.");
      }

      const updated = await sql`
        UPDATE service_transactions st
        SET status = ${body.status}
        WHERE st.reference_code = ${body.reference_code}
          AND EXISTS (
            SELECT 1
            FROM providers p
            JOIN user_profiles provider_profile ON provider_profile.id = p.user_id
            WHERE p.status = 'active'::provider_status
              AND (provider_profile.id = ${identity.sub}::uuid OR provider_profile.email = ${identity.email})
              AND (
                p.id = st.provider_id
                OR (
                  st.provider_id IS NULL
                  AND (LOWER(p.service_type) = LOWER(st.service_type) OR LOWER(p.service_type) = 'both')
                )
              )
          )
        RETURNING id, service_type, reference_code, status, amount, payment_method, created_at, metadata
      `;
      if (updated.rows.length === 0) {
        return errorResponse(404, "Order not found for this provider.");
      }
      return jsonResponse({ transaction: updated.rows[0] });
    }

    if (event.httpMethod !== "GET") return errorResponse(405, "Method not allowed");
    const scope = new URL(event.rawUrl ?? "http://localhost").searchParams.get("scope");
    const roleResult = await sql`
      SELECT role
      FROM user_roles
      WHERE user_id = ${identity.sub}::uuid
         OR user_id = (
           SELECT id FROM user_profiles WHERE email = ${identity.email} LIMIT 1
         )
    `;
    const roles = roleResult.rows.map((row) => String(row.role));
    const adminView =
      scope === "admin" &&
      (roles.includes("admin") || roles.includes("co_admin") || hasRole(identity, "admin") || hasRole(identity, "co_admin"));
    const providerView =
      scope === "provider" &&
      (roles.includes("provider") || hasRole(identity, "provider"));
    let result;
    if (adminView) {
      result = await sql`
        SELECT st.id, st.service_type, st.reference_code, st.status, st.amount, st.payment_method, st.created_at,
               up.display_name AS student_name, p.business_name AS provider_name, st.metadata
        FROM service_transactions st
        JOIN user_profiles up ON up.id = st.user_id
        LEFT JOIN providers p ON p.id = st.provider_id
        ORDER BY st.created_at DESC
      `;
    } else if (providerView) {
      result = await sql`
        SELECT st.id, st.service_type, st.reference_code, st.status, st.amount, st.payment_method, st.created_at,
               up.display_name AS student_name, p.business_name AS provider_name, st.metadata
        FROM service_transactions st
        JOIN providers p
          ON p.status = 'active'::provider_status
         AND (
           p.id = st.provider_id
           OR (
             st.provider_id IS NULL
             AND (LOWER(p.service_type) = LOWER(st.service_type) OR LOWER(p.service_type) = 'both')
           )
         )
        JOIN user_profiles provider_profile
          ON provider_profile.id = p.user_id
         AND (provider_profile.id = ${identity.sub}::uuid OR provider_profile.email = ${identity.email})
        JOIN user_profiles up ON up.id = st.user_id
        ORDER BY st.created_at DESC
      `;
    } else {
      result = await sql`
        SELECT id, service_type, reference_code, status, amount, payment_method, created_at, metadata
        FROM service_transactions
        WHERE user_id = ${identity.sub}::uuid
        ORDER BY created_at DESC
      `;
    }
    return jsonResponse({ transactions: result.rows });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[transactions] query error:", message);
    if (message.includes("does not exist")) {
      return errorResponse(503, "Transaction data is not provisioned. Run migration 007_rentals_and_transactions.sql in Neon.");
    }
    return errorResponse(500, "Could not load transactions.");
  }
};
