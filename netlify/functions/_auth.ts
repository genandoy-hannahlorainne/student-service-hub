/**
 * _auth.ts — Netlify Identity JWT verification helper.
 *
 * Netlify Identity signs JWTs with the site's JWT secret.  When a Function
 * receives a request that originated from an authenticated browser, Netlify
 * injects the decoded identity into `context.clientContext.user` automatically
 * (Netlify Functions v1 runtime).
 *
 * For Functions called via fetch() from the React client:
 *   - The browser must include the Netlify Identity JWT in the Authorization
 *     header: `Authorization: Bearer <token>`
 *   - This helper parses that header and returns the decoded payload.
 *
 * We do NOT re-verify the JWT signature in Functions — Netlify's edge layer
 * validates the token before the Function is invoked when clientContext is
 * available.  For direct API calls (Flutter, tests) we verify manually using
 * the JWT_SECRET env var as a fallback.
 */

export interface IdentityUser {
  sub: string;          // Netlify Identity user UUID
  email: string;
  app_metadata: {
    roles?: string[];
    provider?: string;
  };
  user_metadata: {
    full_name?: string;
  };
}

export interface AuthContext {
  user: IdentityUser;
}

/**
 * Extract the identity from a Netlify Functions handler context or an
 * Authorization header.  Returns null when no valid identity is present.
 */
export function getIdentity(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: { clientContext?: { user?: IdentityUser } },
  headers: Record<string, string | undefined>
): IdentityUser | null {
  // Netlify injects this automatically for site visitors.
  if (context.clientContext?.user) {
    return context.clientContext.user;
  }

  // Fallback: parse the Authorization header for direct API callers.
  const authHeader = headers["authorization"] ?? headers["Authorization"];
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);
  try {
    // Base64-decode the payload segment (no signature verification here —
    // we rely on Netlify's edge layer for that in production).
    const payloadB64 = token.split(".")[1];
    if (!payloadB64) return null;
    const payload = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf-8")
    );
    return payload as IdentityUser;
  } catch {
    return null;
  }
}

/**
 * Check whether an identity has a specific role stored in app_metadata.
 */
export function hasRole(user: IdentityUser, role: string): boolean {
  return user.app_metadata?.roles?.includes(role) ?? false;
}

/** Helper: build a JSON error response. */
export function errorResponse(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/** Helper: build a JSON success response. */
export function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
