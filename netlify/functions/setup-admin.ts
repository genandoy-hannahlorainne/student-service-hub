/**
 * setup-admin.ts — ONE-TIME function to set the admin role on a user.
 * DELETE THIS FILE after running it once successfully.
 *
 * Usage:
 *   GET /.netlify/functions/setup-admin?secret=uniserve-setup-2026
 */

import type { Handler, HandlerEvent } from "@netlify/functions";

const PAT = "nfp_Sx79fQD8EXuwfThhEXWpuLEubX4Vjct41c78";
const SITE_ID = "7522993f-ab3a-45b8-84ed-0c0b32feeb24";
const TARGET_EMAIL = "genandoyhannahlorainne@gmail.com";

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.queryStringParameters?.secret !== "uniserve-setup-2026") {
    return { statusCode: 403, body: JSON.stringify({ error: "Forbidden" }) };
  }

  // 1. List users via Netlify API
  const listRes = await fetch(
    `https://api.netlify.com/api/v1/sites/${SITE_ID}/identity/users?per_page=50`,
    { headers: { Authorization: `Bearer ${PAT}` } }
  );

  const listText = await listRes.text();

  if (!listRes.ok) {
    // Try GoTrue directly — some Netlify plans route it differently
    const identityUrl = "https://organization-student-services-hub.netlify.app/.netlify/identity";
    const listRes2 = await fetch(`${identityUrl}/admin/users?per_page=50`, {
      headers: { Authorization: `Bearer ${PAT}` },
    });
    const listText2 = await listRes2.text();
    return {
      statusCode: 200,
      body: JSON.stringify({
        netlify_api: { status: listRes.status, body: listText },
        gotrue_api: { status: listRes2.status, body: listText2 },
      }),
    };
  }

  const data = JSON.parse(listText) as { users?: { id: string; email: string; app_metadata?: unknown }[] };
  const users = data.users ?? [];
  const user = users.find((u) => u.email.toLowerCase() === TARGET_EMAIL.toLowerCase());

  if (!user) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: `User not found: ${TARGET_EMAIL}`,
        found_users: users.map((u) => u.email),
      }),
    };
  }

  // 2. Set app_metadata.roles = ["admin"]
  const updateRes = await fetch(
    `https://api.netlify.com/api/v1/sites/${SITE_ID}/identity/users/${user.id}`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${PAT}`, "Content-Type": "application/json" },
      body: JSON.stringify({ app_metadata: { roles: ["admin"] } }),
    }
  );

  const updateText = await updateRes.text();

  if (!updateRes.ok) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to update user", detail: updateText, status: updateRes.status }),
    };
  }

  const updated = JSON.parse(updateText) as { app_metadata?: unknown };

  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      message: `✓ Admin role set for ${TARGET_EMAIL}. DELETE setup-admin.ts now.`,
      user_id: user.id,
      app_metadata: updated.app_metadata,
    }),
  };
};
