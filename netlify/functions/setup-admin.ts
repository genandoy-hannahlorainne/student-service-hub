/**
 * setup-admin.ts — ONE-TIME function to set the admin role on a user.
 *
 * DELETE THIS FILE after running it once successfully.
 *
 * Usage (run from browser or curl):
 *   GET /.netlify/functions/setup-admin?email=genandoyhannahlorainne@gmail.com&secret=uniserve-setup-2026
 *
 * Netlify Functions automatically receive NETLIFY_IDENTITY_TOKEN in the
 * environment — a GoTrue admin JWT that can call the GoTrue admin API.
 */

import type { Handler, HandlerEvent } from "@netlify/functions";

export const handler: Handler = async (event: HandlerEvent) => {
  // Simple secret gate so this can't be called by anyone
  const secret = event.queryStringParameters?.secret;
  if (secret !== "uniserve-setup-2026") {
    return { statusCode: 403, body: JSON.stringify({ error: "Forbidden" }) };
  }

  const email = event.queryStringParameters?.email;
  if (!email) {
    return { statusCode: 400, body: JSON.stringify({ error: "email param required" }) };
  }

  const identityUrl = process.env.URL
    ? `${process.env.URL}/.netlify/identity`
    : "https://organization-student-services-hub.netlify.app/.netlify/identity";

  const adminToken = process.env.NETLIFY_IDENTITY_TOKEN;
  if (!adminToken) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "NETLIFY_IDENTITY_TOKEN not available in this environment" }),
    };
  }

  // 1. Find the user by email
  const listRes = await fetch(`${identityUrl}/admin/users?per_page=50`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });

  if (!listRes.ok) {
    const txt = await listRes.text();
    return { statusCode: 500, body: JSON.stringify({ error: "Failed to list users", detail: txt }) };
  }

  const { users } = await listRes.json() as { users: { id: string; email: string }[] };
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: `User not found: ${email}`, available: users.map((u) => u.email) }),
    };
  }

  // 2. Set app_metadata.roles = ["admin"]
  const updateRes = await fetch(`${identityUrl}/admin/users/${user.id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${adminToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ app_metadata: { roles: ["admin"] } }),
  });

  if (!updateRes.ok) {
    const txt = await updateRes.text();
    return { statusCode: 500, body: JSON.stringify({ error: "Failed to update user", detail: txt }) };
  }

  const updated = await updateRes.json();

  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      message: `✓ Admin role set for ${email}. DELETE netlify/functions/setup-admin.ts now.`,
      user_id: user.id,
      app_metadata: (updated as { app_metadata: unknown }).app_metadata,
    }),
  };
};
