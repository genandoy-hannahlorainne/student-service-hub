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
        : await sql`SELECT id FROM providers WHERE status = 'active'::provider_status AND service_type IN ('printing', 'both') ORDER BY created_at ASC LIMIT 1`;
      const providerId = provider.rows[0]?.id ?? null;
      const referenceCode = `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      const inserted = await sql`
        INSERT INTO service_transactions (user_id, provider_id, service_type, reference_code, status, amount, payment_method, metadata)
        VALUES (${identity.sub}::uuid, ${providerId ? String(providerId) : null}::uuid, ${body.service_type}, ${referenceCode}, 'submitted', ${body.amount}, ${body.payment_method ?? null}, ${JSON.stringify(body.metadata ?? {})}::jsonb)
        RETURNING id, service_type, reference_code, status, amount, payment_method, created_at
      `;
      return jsonResponse({ transaction: inserted.rows[0] }, 201);
    }

    if (event.httpMethod !== "GET") return errorResponse(405, "Method not allowed");
    const scope = new URL(event.rawUrl ?? "http://localhost").searchParams.get("scope");
    const adminView = scope === "admin" && (hasRole(identity, "admin") || hasRole(identity, "co_admin"));
    const providerView = scope === "provider" && hasRole(identity, "provider");
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
        JOIN providers p ON p.id = st.provider_id AND p.user_id = ${identity.sub}::uuid
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
