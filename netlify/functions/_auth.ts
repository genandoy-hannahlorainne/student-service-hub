/**
 * _auth.ts — Netlify Identity JWT verification helper.
 * Compatible with Netlify Functions v2 runtime (runtimeAPIVersion: 1).
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
  if (context.clientContext?.user) {
    return context.clientContext.user;
  }

  const authHeader = headers["authorization"] ?? headers["Authorization"];
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);
  try {
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

export function hasRole(user: IdentityUser, role: string): boolean {
  return user.app_metadata?.roles?.includes(role) ?? false;
}

/** Plain object response — compatible with both v1 and v2 Netlify Functions runtime. */
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
