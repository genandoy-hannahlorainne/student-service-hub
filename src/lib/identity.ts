/**
 * identity.ts — Netlify Identity client wrapper.
 *
 * Initialises netlify-identity-widget once and exposes a typed promise-based
 * API that the AuthContext uses.  The widget manages token refresh, localStorage
 * persistence, and the Netlify Identity UI modal automatically.
 */

import netlifyIdentity, { type User as NetlifyIdentityUser } from "netlify-identity-widget";

export type NetlifyUser = NetlifyIdentityUser;

let _initialised = false;

/** Call once at app startup (inside main.tsx or AuthProvider). */
export function initIdentity(): void {
  if (_initialised) return;
  _initialised = true;
  netlifyIdentity.init({
    // In local dev, `netlify dev` sets the Identity URL automatically.
    // In production, the Netlify site URL is detected from window.location.
  });
}

/** Open the sign-up modal. */
export function openSignup(): void {
  netlifyIdentity.open("signup");
}

/** Open the sign-in modal. */
export function openLogin(): void {
  netlifyIdentity.open("login");
}

/** Close the Identity modal. */
export function closeModal(): void {
  netlifyIdentity.close();
}

/**
 * Programmatic email/password login (no modal).
 * Returns the Netlify user on success.
 */
export async function loginWithEmail(
  email: string,
  password: string
): Promise<NetlifyUser> {
  return new Promise((resolve, reject) => {
    netlifyIdentity.on("login", (user) => {
      netlifyIdentity.off("login");
      resolve(user);
    });
    netlifyIdentity.on("error", (err) => {
      netlifyIdentity.off("error");
      reject(err);
    });
    // Trigger login — netlify-identity-widget does not expose a direct
    // programmatic login method in v1.  We use the modal-less approach by
    // calling the underlying GoTrue client that the widget wraps.
    const goTrue = (netlifyIdentity as unknown as { gotrue: { login: (email: string, password: string) => Promise<NetlifyUser> } }).gotrue;
    if (goTrue?.login) {
      goTrue.login(email, password).then(resolve).catch(reject);
    } else {
      // Fallback: open the modal pre-filled (user still has to submit)
      reject(new Error("Direct login not available; use openLogin() instead."));
    }
  });
}

/**
 * Sign up a new user via email/password.
 * After this succeeds, call the /register Function to persist the profile.
 */
export async function signupWithEmail(
  email: string,
  password: string,
  data?: Record<string, unknown>
): Promise<NetlifyUser> {
  const goTrue = (netlifyIdentity as unknown as { gotrue: { signup: (email: string, password: string, data?: Record<string, unknown>) => Promise<NetlifyUser> } }).gotrue;
  if (!goTrue?.signup) {
    throw new Error("GoTrue signup not available. Ensure netlify-identity-widget is initialised.");
  }
  return goTrue.signup(email, password, data);
}

/** Log out the current user. */
export function logout(): void {
  netlifyIdentity.logout();
}

/** Returns the currently logged-in user, or null. */
export function currentUser(): NetlifyUser | null {
  return netlifyIdentity.currentUser();
}

/**
 * Get a fresh JWT for the current user.
 * Refreshes automatically if the stored token is expired.
 */
export async function getToken(): Promise<string | null> {
  const user = currentUser();
  if (!user) return null;
  try {
    const jwt = await user.jwt();
    return jwt;
  } catch {
    return null;
  }
}

/**
 * Attach event listeners.  The AuthContext uses these to react to
 * login / logout events triggered by the widget modal or by other tabs.
 */
export const identity = netlifyIdentity;
