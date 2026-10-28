/**
 * AuthContext.tsx
 *
 * Provides authentication state to the entire React application.
 *
 * State machine:
 *  initialising → (user found) → loading_profile → authenticated
 *              → (no user)    → unauthenticated
 *
 * The context exposes:
 *  - authStatus: current phase of the state machine
 *  - netlifyUser: raw Netlify Identity user (has JWT)
 *  - profile: extended profile from the /me Function
 *  - roles: array of UserRole values for the current user
 *  - primaryRole: the highest-priority single role
 *  - isAdmin / isStudent / isProvider / isGuest: convenience booleans
 *  - providerRecord: provider info (pending/active/rejected) when applicable
 *  - login / logout / register helpers
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
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

// ─── Types ───────────────────────────────────────────────────────────────────

export type AuthStatus =
  | "initialising"
  | "loading_profile"
  | "authenticated"
  | "unauthenticated";

export interface AuthContextValue {
  authStatus: AuthStatus;
  netlifyUser: NetlifyUser | null;
  profile: UserProfile | null;
  roles: UserRole[];
  primaryRole: UserRole | null;
  providerRecord: ProviderRecord | null;

  // Convenience
  isAdmin: boolean;
  isStudent: boolean;
  isProvider: boolean;
  isGuest: boolean;
  providerPending: boolean;

  // Actions
  login: (email: string, password: string) => Promise<UserRole[]>;
  logout: () => Promise<void>;
  registerAndCreateProfile: (
    email: string,
    password: string,
    displayName: string,
    payload: RegisterPayload
  ) => Promise<void>;

  /** Force-reload the /me profile (e.g. after admin approves a provider). */
  refreshProfile: () => Promise<void>;

  /** Last auth error, cleared on next action. */
  authError: string | null;
  clearAuthError: () => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Priority order for role resolution ──────────────────────────────────────

const ROLE_PRIORITY: UserRole[] = ["admin", "co_admin", "provider", "student", "guest"];

function primaryRoleOf(roles: UserRole[]): UserRole | null {
  for (const r of ROLE_PRIORITY) {
    if (roles.includes(r)) return r;
  }
  return null;
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authStatus, setAuthStatus] = useState<AuthStatus>("initialising");
  const [netlifyUser, setNetlifyUser] = useState<NetlifyUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [providerRecord, setProviderRecord] = useState<ProviderRecord | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // ── Load profile from /me ──────────────────────────────────────────────────
  const loadProfile = useCallback(async (user: NetlifyUser): Promise<UserRole[]> => {
    setAuthStatus("loading_profile");
    setNetlifyUser(user);
    try {
      const { profile: p, provider } = await fetchMe();
      setProfile(p);
      setProviderRecord(provider);
      setAuthStatus("authenticated");
      return (p.roles as UserRole[]) ?? [];
    } catch (err) {
      // Profile not yet created (first login after signup) — registration
      // Form will call registerAndCreateProfile to create it.
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("404") || msg.includes("Profile not found")) {
        // User signed up via Netlify Identity but hasn't called /register yet.
        // Stay in loading_profile so the app can redirect to finish registration.
        setAuthStatus("loading_profile");
      } else {
        console.error("[AuthContext] fetchMe error:", err);
        setAuthError("Could not load your profile. Please try again.");
        setAuthStatus("unauthenticated");
      }
      return [];
    }
  }, []);

  // ── Initialise on mount ────────────────────────────────────────────────────
  useEffect(() => {
    initIdentity();

    // Check for an already-logged-in user (persisted in localStorage by widget)
    const existing = currentUser();
    if (existing) {
      void loadProfile(existing);
    } else {
      setAuthStatus("unauthenticated");
    }

    // React to login events (e.g. from the Identity modal or other tabs)
    identity.on("login", (user) => {
      void loadProfile(user);
    });

    // Cross-tab logout: if the session is cleared in another tab, clear state here too.
    // (Single-tab logouts are handled by the logout() function itself.)
    identity.on("logout", () => {
      setNetlifyUser(null);
      setProfile(null);
      setProviderRecord(null);
      setAuthStatus("unauthenticated");
    });

    return () => {
      identity.off("login");
      identity.off("logout");
    };
  }, [loadProfile]);

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string): Promise<UserRole[]> => {
    setAuthError(null);
    try {
      const user = await loginWithEmail(email, password);
      return await loadProfile(user);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed. Please check your credentials.";
      setAuthError(msg);
      throw err;
    }
  }, [loadProfile]);

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback((): Promise<void> => {
    setAuthError(null);
    return new Promise<void>((resolve) => {
      // Listen for the GoTrue logout event which fires after the session is
      // fully cleared from localStorage. Only then do we update React state
      // and resolve so callers can safely navigate away.
      identity.on("logout", () => {
        setNetlifyUser(null);
        setProfile(null);
        setProviderRecord(null);
        setAuthStatus("unauthenticated");
        resolve();
      });
      identityLogout();
    });
  }, []);

  // ── Register + create profile ─────────────────────────────────────────────
  const registerAndCreateProfile = useCallback(
    async (
      email: string,
      password: string,
      displayName: string,
      payload: RegisterPayload
    ) => {
      setAuthError(null);
      try {
        // 1. Create Netlify Identity account
        const user = await signupWithEmail(email, password, {
          full_name: displayName,
        });
        setNetlifyUser(user);

        // 2. Wait for a JWT to be available (signup may need email confirmation
        //    before a token is issued — in that case, the user must click the
        //    confirmation link first).
        const token = await getToken().catch(() => null);
        if (!token) {
          // Email confirmation required — let the UI show a "check your email" message
          setAuthStatus("unauthenticated");
          setAuthError(
            "CONFIRMATION_REQUIRED: Check your email and click the confirmation link before continuing."
          );
          return;
        }

        // 3. Create extended profile via Netlify Function
        await registerProfile({ ...payload, display_name: displayName });

        // 4. Reload profile
        await loadProfile(user);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Registration failed.";
        setAuthError(msg);
        throw err;
      }
    },
    [loadProfile]
  );

  // ── Refresh profile ───────────────────────────────────────────────────────
  const refreshProfile = useCallback(async () => {
    if (!netlifyUser) return;
    await loadProfile(netlifyUser);
  }, [netlifyUser, loadProfile]);

  // ── Derived values ────────────────────────────────────────────────────────
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
    providerPending:
      providerRecord?.status === "pending_approval",
    login,
    logout,
    registerAndCreateProfile,
    refreshProfile,
    authError,
    clearAuthError: () => setAuthError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
