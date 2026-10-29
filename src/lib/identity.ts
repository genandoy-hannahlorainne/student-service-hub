/**
 * identity.ts — Netlify Identity (GoTrue) client wrapper.
 *
 * Single responsibility: wrap netlify-identity-widget with a clean,
 * promise-based API. All auth state management lives in AuthContext.
 *
 * Design decisions:
 *  - initIdentity() is idempotent — safe to call multiple times.
 *  - loginWithEmail() uses the underlying GoTrue client directly so we
 *    never have to fight the widget's event system for programmatic flows.
 *  - The widget modal is suppressed — the app owns all UI.
 */

import netlifyIdentity, { type User as NetlifyIdentityUser } from "netlify-identity-widget";

export type NetlifyUser = NetlifyIdentityUser;

let _initialised = false;

// ─── Initialisation ───────────────────────────────────────────────────────────

export function initIdentity(): void {
  if (_initialised) return;
  _initialised = true;

  netlifyIdentity.init({
    // In production, the site URL is auto-detected from window.location.
    // In local dev with `netlify dev`, the Identity proxy is set automatically.
  });

  // Suppress the built-in widget popup after every auth event.
  // The app handles all routing — we never want the widget's own modals.
  netlifyIdentity.on("login", () => netlifyIdentity.close());
  netlifyIdentity.on("signup", () => netlifyIdentity.close());
}

// ─── Synchronous helpers ──────────────────────────────────────────────────────

/** Returns the currently logged-in user from localStorage, or null. */
export function currentUser(): NetlifyUser | null {
  return netlifyIdentity.currentUser();
}

/** Returns a fresh JWT for the current user, or null if none / expired. */
export async function getToken(): Promise<string | null> {
  const user = netlifyIdentity.currentUser();
  if (!user) return null;
  try {
    return await user.jwt();
  } catch {
    return null;
  }
}

// ─── Auth actions ─────────────────────────────────────────────────────────────

/**
 * Programmatic email/password login — no widget modal.
 *
 * Uses the underlying GoTrue client that netlify-identity-widget wraps.
 * Returns the Netlify user on success; throws on failure.
 */
export async function loginWithEmail(email: string, password: string): Promise<NetlifyUser> {
  const goTrue = getGoTrue();
  // GoTrue.login() returns a GoTrueUser which is the same shape as NetlifyUser.
  return goTrue.login(email, password, false) as Promise<NetlifyUser>;
}

/**
 * Create a new Identity account via email/password.
 *
 * IMPORTANT: After this call succeeds, GoTrue sends a confirmation email.
 * The user must click that link before getToken() will return a JWT.
 * Do NOT call /register until the token is available.
 */
export async function signupWithEmail(
  email: string,
  password: string,
  data?: Record<string, unknown>
): Promise<NetlifyUser> {
  const goTrue = getGoTrue();
  return goTrue.signup(email, password, data) as Promise<NetlifyUser>;
}

/** Log out the current user. Clears the GoTrue session and localStorage. */
export function logout(): void {
  netlifyIdentity.logout();
}

// ─── Event bus (re-exported for AuthContext) ──────────────────────────────────

export const identity = netlifyIdentity;

// ─── Internal helpers ─────────────────────────────────────────────────────────

interface GoTrueClient {
  login(email: string, password: string, remember: boolean): Promise<unknown>;
  signup(email: string, password: string, data?: Record<string, unknown>): Promise<unknown>;
}

function getGoTrue(): GoTrueClient {
  const gt = (netlifyIdentity as unknown as { gotrue?: GoTrueClient }).gotrue;
  if (!gt?.login || !gt?.signup) {
    throw new Error(
      "GoTrue client unavailable. Ensure initIdentity() was called and " +
      "netlify-identity-widget is loaded."
    );
  }
  return gt;
}
