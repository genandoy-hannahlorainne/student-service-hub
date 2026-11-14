import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { sql } from "./_db";
import { getIdentity, errorResponse, jsonResponse } from "./_auth";

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod !== "GET") return errorResponse(405, "Method not allowed");
  const identity = getIdentity(
    context as Parameters<typeof getIdentity>[0],
    (event.headers ?? {}) as Record<string, string | undefined>
  );
  if (!identity) return errorResponse(401, "Unauthorized");

  try {
    const result = await sql`
      SELECT id, service_type, reference_code, status, amount, payment_method, created_at
      FROM service_transactions
      WHERE user_id = ${identity.sub}::uuid
      ORDER BY created_at DESC
    `;
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
