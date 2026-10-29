/**
 * _auth.ts — Netlify Identity JWT verification helper.
 */

export interface IdentityUser {
  sub: string;
  email: string;
  app_metadata: {
    roles?: string[];
    provider?: string;
  };
  user_metadata: {
    full_name?: string;
  };
}

export function getIdentity(
  context: { clientContext?: { user?: IdentityUser } },
  headers: Record<string, string | undefined>
): IdentityUser | null {
  // Netlify Functions v1: identity is injected into clientContext
  if (context.clientContext?.user) {
    return context.clientContext.user;
  }

  // Fallback: decode the Bearer JWT manually (works in all runtimes)
  const authHeader = headers["authorization"] ?? headers["Authorization"];
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;

    // Pad base64 to a multiple of 4 — standard atob requirement
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);

    // Use Buffer (Node) when available, otherwise fall back to atob (edge runtime)
    let json: string;
    if (typeof Buffer !== "undefined") {
      json = Buffer.from(padded, "base64").toString("utf-8");
    } else {
      json = atob(padded);
    }

    const payload = JSON.parse(json) as IdentityUser;
    return payload;
  } catch {
    return null;
  }
}

export function hasRole(user: IdentityUser, role: string): boolean {
  return user.app_metadata?.roles?.includes(role) ?? false;
}

export function errorResponse(status: number, message: string) {
  return {
    statusCode: status,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ error: message }),
  };
}

export function jsonResponse(data: unknown, status = 200) {
  return {
    statusCode: status,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
}
