/**
 * GET /.netlify/functions/school-supplies
 *
 * Returns only active, accredited supply shops and their published catalog.
 * The endpoint intentionally returns empty arrays until the admin provisions
 * real shop/product records in Neon.
 */
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
    const [shops, products] = await Promise.all([
      sql`
        SELECT id, business_name, location, gcash_number, transaction_fee, is_draft
        FROM supply_shops
        WHERE status = 'active' AND accredited = true
        ORDER BY business_name
      `,
      sql`
        SELECT id, name, category, unit_price, stock_quantity, options, image_path
        FROM supply_products
        WHERE status = 'active' AND stock_quantity > 0
        ORDER BY category, name
      `,
    ]);
    return jsonResponse({
      shops: shops.rows.map((shop) => ({
        ...shop,
        transaction_fee: Number(shop.transaction_fee),
      })),
      products: products.rows.map((product) => ({
        ...product,
        unit_price: Number(product.unit_price),
        stock_quantity: Number(product.stock_quantity),
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const databaseError = error as { code?: string };
    console.error("[school-supplies] catalog error:", message);
    if (databaseError.code === "42P01" || message.includes("does not exist")) {
      return errorResponse(503, "School supplies catalog is not provisioned. Run migration 005_school_supplies_catalog_repair.sql in Neon.");
    }
    return errorResponse(500, "Could not load the school supplies catalog. Check the Netlify function logs.");
  }
};
