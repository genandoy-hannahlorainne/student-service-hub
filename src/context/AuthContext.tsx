/**
 * AuthContext.tsx — Application authentication state machine.
 *
 * State machine (authStatus):
 *
 *   "initialising"        App just mounted; checking localStorage for a persisted session.
 *   "loading_profile"     GoTrue session found/created; fetching the DB profile from /me.
 *   "needs_registration"  GoTrue account exists + token is valid, but no DB profile yet.
 *                         Happens when: (a) email confirmed but browser was closed before
 *                         completing the registration form, or (b) admin invited the user.
 *   "authenticated"       DB profile loaded; user has a role and can access protected screens.
 *   "unauthenticated"     No session, or the session was cleared.
 *
 * Security invariants enforced here:
 *  - Passwords never pass through this context.
 *  - The JWT is attached to every API call inside api.ts; this context never
 *    reads or stores the raw token.
 *  - Role resolution is derived exclusively from the server-side profile,
 *    never from the GoTrue JWT payload (which is client-readable and unverified
 *    from the app's perspective).
 *  - loadProfile() is the single gate: a user is only "authenticated" once
 *    the DB profile is successfully fetched and its roles confirmed.
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import {
  initIdentity,
  currentUser,
  loginWithEmail,
  signupWithEmail,
  logout as identityLogout,
  getToken,
  identity,
  NetlifyUser,
} from "../lib/identity";
import {
  fetchMe,
  registerProfile,
  RegisterPayload,
  UserProfile,
  UserRole,
  ProviderRecord,
} from "../lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AuthStatus =
  | "initialising"
  | "loading_profile"
  | "needs_registration"
  | "authenticated"
  | "unauthenticated";

export interface AuthContextValue {
  authStatus: AuthStatus;
  netlifyUser: NetlifyUser | null;
  profile: UserProfile | null;
  roles: UserRole[];
  primaryRole: UserRole | null;
  providerRecord: ProviderRecord | null;

  isAdmin: boolean;
  isStudent: boolean;
  isProvider: boolean;
  isGuest: boolean;
  providerPending: boolean;

  /** Email+password login. Returns the user's roles on success. */
  login: (email: string, password: string) => Promise<UserRole[]>;
  /** Clears the session both in GoTrue and in React state. */
  logout: () => Promise<void>;
  /**
   * Complete registration after a GoTrue account is confirmed.
   * Caller supplies profile metadata; passwords stay in GoTrue.
   * Works for three cases:
   *   1. Normal new signup (no existing session).
   *   2. Email confirmation return (confirmed, no DB profile yet).
   *   3. Admin invite acceptance (confirmed, no DB profile yet).
   */
  completeRegistration: (
    email: string,
    password: string | null,
    displayName: string,
    payload: RegisterPayload
  ) => Promise<void>;
  refreshProfile: () => Promise<void>;

  authError: string | null;
  clearAuthError: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Role priority ────────────────────────────────────────────────────────────

const ROLE_PRIORITY: UserRole[] = ["admin", "co_admin", "provider", "student", "guest"];

function primaryRoleOf(roles: UserRole[]): UserRole | null {
  for (const r of ROLE_PRIORITY) {
    if (roles.includes(r)) return r;
  }
  return null;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authStatus, setAuthStatus] = useState<AuthStatus>("initialising");
  const [netlifyUser, setNetlifyUser] = useState<NetlifyUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [providerRecord, setProviderRecord] = useState<ProviderRecord | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // Monotonic session counter — each loadProfile() call gets a unique ID.
  // Stale results (from calls superseded by a newer call) are discarded without
  // touching React state, eliminating the boolean-guard race conditions.
  const sessionCounterRef = useRef(0);

  // ── loadProfile ────────────────────────────────────────────────────────────
  const loadProfile = useCallback(async (user: NetlifyUser): Promise<UserRole[]> => {
    // Each call gets a unique session ID. Any result arriving after a newer call
    // has started will be discarded — no boolean guard, no manual resets needed.
    const sessionId = ++sessionCounterRef.current;

    setAuthStatus("loading_profile");
    setNetlifyUser(user);

    try {
      const { profile: p, provider } = await fetchMe();

      // Discard this result if a newer loadProfile call has already started.
      if (sessionId !== sessionCounterRef.current) {
        return (p.roles as UserRole[]) ?? [];
      }

      setProfile(p);
      setProviderRecord(provider ?? null);
      setAuthStatus("authenticated");
      return (p.roles as UserRole[]) ?? [];
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);

      // Discard stale error — don't corrupt auth state for an older session.
      if (sessionId !== sessionCounterRef.current) {
        return [];
      }

      if (msg.includes("404") || msg.toLowerCase().includes("profile not found")) {
        // Valid GoTrue session but no DB profile.
        // RouteGuard will redirect to the registration screen.
        setAuthStatus("needs_registration");
        return [];
      }

      // Any other error (network, 5xx) — surface it and sign out.
      console.error("[AuthContext] loadProfile error:", msg);
      setAuthError("Could not load your profile. Please try again.");
      setAuthStatus("unauthenticated");
      return [];
    }
  }, []);

  // ── Initialise on mount ────────────────────────────────────────────────────
  useEffect(() => {
    initIdentity();

    // If the widget found a persisted session in localStorage, load the profile.
    const existing = currentUser();
    if (existing) {
      void loadProfile(existing);
    } else {
      setAuthStatus("unauthenticated");
    }

    // The widget fires "login" for:
    //   - invite-acceptance redirects
    //   - confirmation-link redirects
    //   - any other tab logging in
    // The session counter ensures only the most recent call's result is applied.
    const onLogin = (user: NetlifyUser) => {
      void loadProfile(user);
    };

    const onLogout = () => {
      setNetlifyUser(null);
      setProfile(null);
      setProviderRecord(null);
      setAuthStatus("unauthenticated");
    };

    identity.on("login", onLogin);
    identity.on("logout", onLogout);

    return () => {
      identity.off("login");
      identity.off("logout");
    };
  }, [loadProfile]);

  // ── login ──────────────────────────────────────────────────────────────────
  /**
   * Authenticate with GoTrue then load the DB profile.
   *
   * Returns the user's roles on success so the caller can navigate to the
   * correct dashboard.
   *
   * Throws with a user-facing message on failure. The thrown error is also
   * stored in authError so callers that don't catch can still surface it.
   *
   * If the DB profile doesn't exist yet (404 from /me), sets authStatus to
   * "needs_registration" and throws so the form handler knows not to navigate.
   */
  const login = useCallback(
    async (email: string, password: string): Promise<UserRole[]> => {
      setAuthError(null);

      // Step 1 — authenticate with GoTrue
      const user = await loginWithEmail(email, password).catch((err: unknown) => {
        const raw = err instanceof Error ? err.message : String(err);
        const msg =
          raw.toLowerCase().includes("invalid") ||
          raw.toLowerCase().includes("email") ||
          raw.toLowerCase().includes("password") ||
          raw.toLowerCase().includes("no user found") ||
          raw.toLowerCase().includes("failed")
            ? "Invalid email or password."
            : "Login failed. Please try again.";
        setAuthError(msg);
        throw new Error(msg);
      });

      // Step 2 — fetch DB profile. This is the authoritative source of roles.
      // loadProfile returns [] and sets needs_registration if no profile row exists.
      const roles = await loadProfile(user);

      // Step 3 — if no profile row exists, the user needs to complete registration.
      // Throw so the Login form handler knows not to navigate anywhere.
      if (roles.length === 0) {
        // authStatus is already "needs_registration" — RouteGuard will redirect.
        throw new Error("NEEDS_REGISTRATION");
      }

      return roles;
    },
    [loadProfile]
  );

  // ── logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(async (): Promise<void> => {
    setAuthError(null);
    setNetlifyUser(null);
    setProfile(null);
    setProviderRecord(null);
    setAuthStatus("unauthenticated");
    // Fire GoTrue logout in the background — don't await so the UI is instant.
    identityLogout();
  }, []);

  // ── completeRegistration ───────────────────────────────────────────────────
  /**
   * Three-path registration:
   *
   * Path A — New signup (no existing session):
   *   1. Create GoTrue account via signupWithEmail.
   *   2. GoTrue sends a confirmation email.
   *   3. Return with CONFIRMATION_REQUIRED — app shows "check your email".
   *   4. User clicks confirmation link → browser returns → widget fires "login"
   *      → loadProfile → 404 → needs_registration → Register screen again.
   *   5. This function is called again (path B).
   *
   * Path B — Email confirmed, no DB profile (confirmation-link return):
   *   1. currentUser() returns the confirmed user with a valid token.
   *   2. Skip signupWithEmail.
   *   3. POST /register with profile metadata.
   *   4. loadProfile → authenticated.
   *
   * Path C — Admin invite accepted (same as Path B):
   *   Netlify fires a "login" event on invite acceptance. By the time the
   *   user reaches the Register form, currentUser() is set and the token
   *   is valid. Identical to Path B.
   */
  const completeRegistration = useCallback(
    async (
      email: string,
      password: string | null,
      displayName: string,
      payload: RegisterPayload
    ): Promise<void> => {
      setAuthError(null);

      // Always read the live widget state — avoids stale React closure on netlifyUser.
      const liveUser = currentUser();

      if (liveUser) {
        // Path B / C: already have a confirmed session — go straight to profile creation.
        const token = await getToken().catch(() => null);
        if (!token) {
          // Session expired mid-flow — ask them to log in again.
          setAuthStatus("unauthenticated");
          setAuthError("Your session expired. Please log in again.");
          return;
        }

        // Session counter handles deduplication automatically — no manual reset needed.
        try {
          await registerProfile({ ...payload, display_name: displayName });
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Registration failed.";
          setAuthError(msg);
          throw err;
        }
        await loadProfile(liveUser);
        return;
      }

      // Path A: no session — create the GoTrue account.
      if (!password) {
        setAuthError("Password is required for new registrations.");
        throw new Error("Password required");
      }

      await signupWithEmail(email, password, { full_name: displayName }).catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "Signup failed.";
        setAuthError(msg);
        throw err;
      });

      // At this point the user is NOT yet confirmed. getToken() will return null.
      // Signal the UI to show "check your email".
      setAuthStatus("unauthenticated");
      // Throw so the caller can show the right message.
      throw new Error("CONFIRMATION_REQUIRED");
    },
    [loadProfile]
  );

  // ── refreshProfile ─────────────────────────────────────────────────────────
  const refreshProfile = useCallback(async () => {
    const user = currentUser();
    if (!user) return;
    await loadProfile(user);
  }, [loadProfile]);

  // ── Derived values ─────────────────────────────────────────────────────────
  const roles: UserRole[] = (profile?.roles as UserRole[]) ?? [];
  const primaryRole = primaryRoleOf(roles);

  const value: AuthContextValue = {
    authStatus,
    netlifyUser,
    profile,
    roles,
    primaryRole,
    providerRecord,
    isAdmin: roles.includes("admin") || roles.includes("co_admin"),
    isStudent: roles.includes("student"),
    isProvider: roles.includes("provider"),
    isGuest: roles.includes("guest"),
    providerPending: providerRecord?.status === "pending_approval",
    login,
    logout,
    completeRegistration,
    refreshProfile,
    authError,
    clearAuthError: () => setAuthError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
