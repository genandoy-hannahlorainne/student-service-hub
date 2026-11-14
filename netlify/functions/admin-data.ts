import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { sql } from "./_db";
import { errorResponse, getIdentity, hasRole, jsonResponse } from "./_auth";

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod !== "GET") return errorResponse(405, "Method not allowed");
  const identity = getIdentity(context as Parameters<typeof getIdentity>[0], (event.headers ?? {}) as Record<string, string | undefined>);
  if (!identity || (!hasRole(identity, "admin") && !hasRole(identity, "co_admin"))) return errorResponse(403, "Admin access required.");

  try {
    const [providers, accounts, supplies] = await Promise.all([
      sql`SELECT id, business_name, contact_person, business_address, service_type, status, created_at FROM providers ORDER BY created_at DESC`,
      sql`
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE account_status = 'active')::int AS active,
          COUNT(*) FILTER (WHERE account_status = 'pending')::int AS pending
        FROM user_profiles
      `,
      sql`
        SELECT
          (SELECT COUNT(*)::int FROM supply_shops WHERE status = 'active'::supply_shop_status AND accredited = true) AS shops,
          (SELECT COUNT(*)::int FROM supply_products WHERE status = 'active'::supply_product_status AND stock_quantity > 0) AS products
      `,
    ]);
    return jsonResponse({ providers: providers.rows, accounts: accounts.rows[0], supplies: supplies.rows[0] });
  } catch (error) {
    console.error("[admin-data] query error:", error instanceof Error ? error.message : String(error));
    return errorResponse(500, "Could not load admin data.");
  }
};
