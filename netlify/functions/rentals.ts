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
      SELECT
        rp.id, rp.title, rp.description, rp.post_type, rp.category, rp.location,
        rp.rental_rate, rp.availability, rp.status, rp.rejection_reason,
        rp.created_at, up.display_name AS user_name
      FROM rental_posts rp
      JOIN user_profiles up ON up.id = rp.user_id
      WHERE rp.status = 'approved' OR rp.user_id = ${identity.sub}::uuid
      ORDER BY rp.created_at DESC
    `;
    return jsonResponse({
      posts: result.rows.map((post) => ({
        ...post,
        type: post.post_type === "looking_for" ? "Looking For" : "Available for Rent",
        user: post.user_name,
        date: new Date(String(post.created_at)).toLocaleDateString("en-US", {
          month: "short", day: "numeric", year: "numeric",
        }),
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[rentals] query error:", message);
    if (message.includes("does not exist")) {
      return errorResponse(503, "Rental data is not provisioned. Run migration 007_rentals_and_transactions.sql in Neon.");
    }
    return errorResponse(500, "Could not load rental posts.");
  }
};
