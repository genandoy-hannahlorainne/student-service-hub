/**
 * Auth.tsx — Login and Registration screens
 *
 * All forms now submit to real backend endpoints via AuthContext:
 *  - Login    → netlifyIdentity.login → fetchMe → route to correct dashboard
 *  - Register → netlifyIdentity.signup → POST /register → route to dashboard
 *
 * Roles and their post-auth destinations:
 *  student   → student-dashboard
 *  provider  → provider-dashboard  (pending: provider-pending screen)
 *  guest     → guest-dashboard
 *  admin     → admin-dashboard     (cannot self-register)
 */

import { useState, useEffect, FormEvent } from "react";
import organizationLogo from "../assets/images/org_ssh_logo.png";
import {
  WireBtn, WireCard, WirePublicNav, WireSelect,
} from "../components/WireframeUI";
import { useAuth } from "../context/AuthContext";

// ─── Shared shell ─────────────────────────────────────────────────────────────

function AuthShell({
  navigate,
  roleBadge,
  roleColor,
  title,
  subtitle,
  formTitle = "Welcome back",
  formSubtitle = "Enter your details to continue.",
  children,
}: {
  navigate: (s: string) => void;
  roleBadge: string;
  roleColor: string;
  title: string;
  subtitle: string;
  formTitle?: string;
  formSubtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-[#000000]">
      <WirePublicNav navigate={navigate} />
      <div className="px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto grid min-h-[calc(100vh-96px)] max-w-6xl items-center gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Left hero panel */}
          <div className="relative min-h-[440px] overflow-hidden rounded-[28px] bg-[#4B3621] p-7 text-white shadow-[0_22px_60px_rgba(75,54,33,0.18)] sm:p-10">
            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border-[34px] border-[#E3C565]/50" />
            <div className="absolute -bottom-40 right-0 h-80 w-80 rounded-full border-[42px] border-[#E3C565]/20" />
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center ring-2 ring-white/20">
                  <img src={organizationLogo} alt="University Organization logo" className="h-full w-full object-contain" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#E3C565]">PUP Taguig</p>
                  <p className="font-semibold">Student Services Hub</p>
                </div>
              </div>
              <div className="relative py-12">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-[#E3C565]">
                  <i className="bi bi-shield-check" aria-hidden="true" />
                  Secure access portal
                </div>
                <h1 className="max-w-md text-3xl font-bold leading-tight tracking-[-0.04em] sm:text-5xl">{title}</h1>
                <p className="mt-5 max-w-sm text-sm leading-6 text-[#E3C565]">{subtitle}</p>
              </div>
              <div className="border-t border-white/15 pt-5 text-xs text-[#E3C565]">
                <strong className="text-white">One hub.</strong> Printing, supplies, and academic resources for the PUP Taguig community.
              </div>
            </div>
          </div>

          {/* Right form panel */}
          <div className="mx-auto w-full max-w-lg">
            <div className="mb-5">
              <div className={`mb-2 inline-block rounded-full px-3 py-1 text-xs font-bold text-white ${roleColor}`}>
                {roleBadge}
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-[#4B3621]">{formTitle}</h2>
              <p className="mt-1 text-sm text-gray-500">{formSubtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Error alert ──────────────────────────────────────────────────────────────

function ErrorAlert({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {message}
    </div>
  );
}

// ─── 1. PUPTian Login ─────────────────────────────────────────────────────────

export function Login({ navigate }: { navigate: (s: string) => void }) {
  const { login, authError, clearAuthError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError("");
    clearAuthError();

    if (!email.trim() || !password) {
      setLocalError("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      // AuthContext sets roles; navigate based on primary role
      navigate("student-dashboard");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed.";
      setLocalError(msg);
    } finally {
      setLoading(false);
    }
  };

  const displayError = localError || authError || "";

  return (
    <AuthShell
      navigate={navigate}
      roleBadge="PUPTian Login"
      roleColor="bg-[#4B3621]"
      title="University Organization Student Services Hub"
      subtitle="Sign in with your student account"
    >
      <WireCard className="rounded-[26px] border-[#4B3621]/20 p-5 shadow-[0_18px_40px_rgba(75,54,33,0.10)] sm:p-7">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          {displayError && <ErrorAlert message={displayError} />}

          <div className="flex flex-col gap-1">
            <label htmlFor="login-email" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Student Number / Email
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="username"
              placeholder="e.g. 2021-00001 or juan@pup.edu.ph"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:border-gray-500 w-full rounded-lg"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="login-password" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:border-gray-500 w-full rounded-lg"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 border border-gray-400" />
              <span>Remember Me</span>
            </label>
            <button type="button" className="text-xs text-gray-500 hover:text-gray-800 underline">
              Forgot Password?
            </button>
          </div>

          <WireBtn type="submit" size="lg" className="w-full mt-1" disabled={loading}>
            {loading ? "Signing in…" : "Login as PUPTian"}
          </WireBtn>
        </form>

        <div className="border-t border-gray-200 mt-4 pt-4 text-center">
          <p className="text-sm text-gray-500 mb-3">No account yet?</p>
          <WireBtn variant="outline" className="w-full" onClick={() => navigate("register")}>
            Register as PUPTian
          </WireBtn>
        </div>
      </WireCard>

      <div className="mt-4 flex flex-col gap-2">
        <p className="text-xs text-gray-400 text-center mb-1">Other login portals:</p>
        <div className="grid grid-cols-2 gap-2">
          <WireBtn variant="secondary" size="sm" onClick={() => navigate("login-guest")}>Guest</WireBtn>
          <WireBtn variant="secondary" size="sm" onClick={() => navigate("login-provider")}>Provider</WireBtn>
        </div>
        <p className="text-center text-xs text-gray-400 mt-1">
          <span className="underline cursor-pointer" onClick={() => navigate("landing")}>&larr; Back to Landing</span>
        </p>
      </div>
    </AuthShell>
  );
}

// ─── 2. Guest Login ───────────────────────────────────────────────────────────

export function GuestLogin({ navigate }: { navigate: (s: string) => void }) {
  const { login, authError, clearAuthError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError("");
    clearAuthError();

    if (!email.trim() || !password) {
      setLocalError("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate("guest-dashboard");
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const displayError = localError || authError || "";

  return (
    <AuthShell
      navigate={navigate}
      roleBadge="Guest Login"
      roleColor="bg-[#E3C565] text-[#000000]"
      title="University Organization Student Services Hub"
      subtitle="Limited access — browse and post requests"
    >
      <div className="mb-4 rounded-2xl border border-[#4B3621]/15 bg-[#E3C565]/35 p-4 text-xs text-[#4B3621]">
        <strong>Guest Access:</strong> You can browse services and post public need requests.
        Full ordering features require a PUPTian account.
      </div>

      <WireCard className="rounded-[26px] border-[#4B3621]/20 p-5 shadow-[0_18px_40px_rgba(75,54,33,0.10)] sm:p-7">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          {displayError && <ErrorAlert message={displayError} />}

          <div className="flex flex-col gap-1">
            <label htmlFor="guest-email" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Email Address</label>
            <input id="guest-email" type="email" autoComplete="username" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:border-gray-500 w-full rounded-lg" required />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="guest-password" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Password</label>
            <input id="guest-password" type="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:border-gray-500 w-full rounded-lg" required />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 border border-gray-400" />
              <span>Remember Me</span>
            </label>
            <button type="button" className="text-xs text-gray-500 hover:text-gray-800 underline">Forgot Password?</button>
          </div>

          <WireBtn type="submit" size="lg" className="w-full mt-1 bg-gray-600 border-gray-600" disabled={loading}>
            {loading ? "Signing in…" : "Login as Guest"}
          </WireBtn>
        </form>

        <div className="border-t border-gray-200 mt-4 pt-4 text-center">
          <p className="text-sm text-gray-500 mb-3">No guest account?</p>
          <WireBtn variant="outline" className="w-full" onClick={() => navigate("register-guest")}>Register as Guest</WireBtn>
        </div>
      </WireCard>

      <div className="mt-4 flex flex-col gap-2">
        <p className="text-xs text-gray-400 text-center mb-1">Other login portals:</p>
        <div className="grid grid-cols-2 gap-2">
          <WireBtn variant="secondary" size="sm" onClick={() => navigate("login")}>PUPTian</WireBtn>
          <WireBtn variant="secondary" size="sm" onClick={() => navigate("login-provider")}>Provider</WireBtn>
        </div>
        <p className="text-center text-xs text-gray-400 mt-1">
          <span className="underline cursor-pointer" onClick={() => navigate("landing")}>&larr; Back to Landing</span>
        </p>
      </div>
    </AuthShell>
  );
}

// ─── 3. Provider Login ────────────────────────────────────────────────────────

export function ProviderLogin({ navigate }: { navigate: (s: string) => void }) {
  const { login, authError, clearAuthError, providerPending } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError("");
    clearAuthError();

    if (!email.trim() || !password) {
      setLocalError("Business email and password are required.");
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      if (providerPending) {
        navigate("provider-pending");
      } else {
        navigate("provider-dashboard");
      }
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const displayError = localError || authError || "";

  return (
    <AuthShell
      navigate={navigate}
      roleBadge="Service Provider Login"
      roleColor="bg-[#4B3621]"
      title="University Organization Student Services Hub"
      subtitle="Collaborating provider portal"
    >
      <div className="mb-4 rounded-2xl border border-[#4B3621]/15 bg-[#E3C565]/35 p-4 text-xs text-[#4B3621]">
        <strong>Providers:</strong> Only University Organization-approved collaborating businesses can access this portal.
        Contact University Organization if you wish to become a provider.
      </div>

      <WireCard className="rounded-[26px] border-[#4B3621]/20 p-5 shadow-[0_18px_40px_rgba(75,54,33,0.10)] sm:p-7">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          {displayError && <ErrorAlert message={displayError} />}

          <div className="flex flex-col gap-1">
            <label htmlFor="provider-email" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Business Email</label>
            <input id="provider-email" type="email" autoComplete="username" placeholder="your.shop@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:border-gray-500 w-full rounded-lg" required />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="provider-password" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Password</label>
            <input id="provider-password" type="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:border-gray-500 w-full rounded-lg" required />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 border border-gray-400" />
              <span>Remember Me</span>
            </label>
            <button type="button" className="text-xs text-gray-500 hover:text-gray-800 underline">Forgot Password?</button>
          </div>

          <WireBtn type="submit" size="lg" className="w-full mt-1 bg-gray-700 border-gray-700" disabled={loading}>
            {loading ? "Signing in…" : "Login as Provider"}
          </WireBtn>
        </form>

        <div className="border-t border-gray-200 mt-4 pt-4 text-center">
          <p className="text-sm text-gray-500 mb-3">Not yet a collaborator?</p>
          <WireBtn variant="outline" className="w-full" onClick={() => navigate("register")}>Apply as Provider</WireBtn>
        </div>
      </WireCard>

      <div className="mt-4 flex flex-col gap-2">
        <p className="text-xs text-gray-400 text-center mb-1">Other login portals:</p>
        <div className="grid grid-cols-2 gap-2">
          <WireBtn variant="secondary" size="sm" onClick={() => navigate("login")}>PUPTian</WireBtn>
          <WireBtn variant="secondary" size="sm" onClick={() => navigate("login-guest")}>Guest</WireBtn>
        </div>
        <p className="text-center text-xs text-gray-400 mt-1">
          <span className="underline cursor-pointer" onClick={() => navigate("landing")}>&larr; Back to Landing</span>
        </p>
      </div>
    </AuthShell>
  );
}

// ─── 4. Admin Login ───────────────────────────────────────────────────────────

/**
 * Rate-limit constants for the admin login form.
 * After MAX_ATTEMPTS failed tries the form locks for LOCKOUT_SECONDS.
 */
const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 30;

export function AdminLogin({ navigate }: { navigate: (s: string) => void }) {
  const { login, authError, clearAuthError, logout } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  // Rate-limiting state
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(0);

  // Count down the lockout timer every second
  useEffect(() => {
    if (lockedUntil === null) return;
    const tick = () => {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        setLockedUntil(null);
        setCountdown(0);
        setFailedAttempts(0);
        setLocalError("");
      } else {
        setCountdown(remaining);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lockedUntil]);

  const isLocked = lockedUntil !== null && Date.now() < lockedUntil;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError("");
    clearAuthError();

    if (isLocked) return;

    if (!username.trim() || !password) {
      setLocalError("Admin username and password are required.");
      return;
    }

    setLoading(true);
    try {
      const roles = await login(username.trim(), password);

      if (!roles.includes("admin") && !roles.includes("co_admin")) {
        // Logged in successfully but wrong role — sign them back out immediately
        // so no session is left open for a non-admin account.
        await logout();
        const next = failedAttempts + 1;
        setFailedAttempts(next);
        if (next >= MAX_ATTEMPTS) {
          setLockedUntil(Date.now() + LOCKOUT_SECONDS * 1000);
          setLocalError(`Too many failed attempts. Try again in ${LOCKOUT_SECONDS} seconds.`);
        } else {
          setLocalError("Invalid credentials or insufficient privileges.");
        }
        return;
      }

      // Success — reset rate-limit state and go to dashboard
      setFailedAttempts(0);
      setLockedUntil(null);
      navigate("admin-dashboard");
    } catch {
      // Use a generic message to avoid confirming whether an email exists
      const next = failedAttempts + 1;
      setFailedAttempts(next);
      if (next >= MAX_ATTEMPTS) {
        setLockedUntil(Date.now() + LOCKOUT_SECONDS * 1000);
        setLocalError(`Too many failed attempts. Try again in ${LOCKOUT_SECONDS} seconds.`);
      } else {
        const remaining = MAX_ATTEMPTS - next;
        setLocalError(
          `Invalid credentials. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining before temporary lockout.`
        );
      }
      // Clear the password field on every failure
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  const displayError = localError || (!localError ? authError : "") || "";

  return (
    <div className="min-h-screen bg-white text-[#000000]">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        {/* Left panel */}
        <div className="relative min-h-[440px] overflow-hidden rounded-[28px] bg-[#000000] p-7 text-white shadow-[0_22px_60px_rgba(0,0,0,0.18)] sm:p-10">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border-[34px] border-[#E3C565]/40" />
          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center ring-2 ring-white/20">
                <img src={organizationLogo} alt="University Organization logo" className="h-full w-full object-contain" />
              </span>
              <p className="font-semibold">Student Services Hub</p>
            </div>
            <div className="py-12">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E3C565]/30 bg-[#E3C565]/10 px-3 py-1.5 text-xs font-medium text-[#E3C565]">
                <i className="bi bi-lock-fill" aria-hidden="true" />
                Restricted access
              </div>
              <h1 className="text-4xl font-bold leading-tight tracking-[-0.04em]">University Organization Admin Access</h1>
              <p className="mt-5 text-sm leading-6 text-[#E3C565]">Internal operations for approvals, providers, orders, and platform content.</p>
            </div>
            <div className="border-t border-white/15 pt-5 space-y-1.5">
              <p className="text-xs text-gray-400">Administrator credentials are issued by University Organization management only.</p>
              <p className="text-xs text-[#E3C565]/70 flex items-center gap-1.5">
                <i className="bi bi-shield-lock-fill" aria-hidden="true" />
                All admin activity is logged and monitored.
              </p>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="mx-auto w-full max-w-lg">
          <div className="mb-5">
            <div className="mb-2 inline-block rounded-full bg-[#000000] px-3 py-1 text-xs font-bold text-[#E3C565]">ADMINISTRATOR PORTAL</div>
            <h2 className="text-2xl font-bold tracking-tight text-[#4B3621]">Sign in securely</h2>
            <p className="mt-1 text-sm text-gray-500">Enter your administrator credentials to continue.</p>
          </div>

          <div className="rounded-[26px] border border-[#4B3621]/20 bg-white p-5 shadow-[0_18px_40px_rgba(75,54,33,0.10)] sm:p-7">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate autoComplete="off">
              {displayError && (
                <div role="alert" className={`flex items-start gap-2 rounded-xl px-3 py-2.5 text-sm ${isLocked ? "bg-red-100 border border-red-300 text-red-700" : "bg-red-50 border border-red-200 text-red-600"}`}>
                  <i className={`bi ${isLocked ? "bi-lock-fill" : "bi-exclamation-triangle-fill"} mt-0.5 shrink-0`} aria-hidden="true" />
                  <span>
                    {isLocked
                      ? `Account temporarily locked. Try again in ${countdown}s.`
                      : displayError}
                  </span>
                </div>
              )}

              {/* Attempt counter warning (shows after 2 failures) */}
              {!isLocked && failedAttempts >= 2 && !displayError && (
                <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-700">
                  <i className="bi bi-exclamation-circle shrink-0" aria-hidden="true" />
                  {MAX_ATTEMPTS - failedAttempts} attempt{MAX_ATTEMPTS - failedAttempts === 1 ? "" : "s"} remaining before temporary lockout.
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label htmlFor="admin-username" className="text-xs font-semibold uppercase tracking-wide text-[#4B3621]">Admin Username</label>
                <input
                  id="admin-username"
                  type="email"
                  autoComplete="off"
                  placeholder="admin@uniserve.pup.edu.ph"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLocked || loading}
                  className="w-full rounded-xl border border-[#4B3621]/20 bg-[#fffdf5] px-3 py-2.5 text-sm text-[#000000] placeholder-gray-400 focus:border-[#E3C565] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="admin-password" className="text-xs font-semibold uppercase tracking-wide text-[#4B3621]">Admin Password</label>
                <div className="relative">
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLocked || loading}
                    className="w-full rounded-xl border border-[#4B3621]/20 bg-[#fffdf5] px-3 py-2.5 pr-10 text-sm text-[#000000] placeholder-gray-400 focus:border-[#E3C565] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((v) => !v)}
                    disabled={isLocked || loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#4B3621] transition disabled:opacity-30"
                  >
                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} text-base`} aria-hidden="true" />
                  </button>
                </div>
              </div>

              <WireBtn
                type="submit"
                size="lg"
                className="mt-1 w-full rounded-xl border-[#4B3621] bg-[#4B3621] text-white hover:bg-[#000000] disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={loading || isLocked}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Verifying…
                  </span>
                ) : isLocked ? (
                  `Locked — wait ${countdown}s`
                ) : (
                  "Access Admin Panel"
                )}
              </WireBtn>
            </form>

            {/* Security notice */}
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#fffdf5] border border-[#4B3621]/10 px-3 py-2.5 text-xs text-gray-500">
              <i className="bi bi-info-circle shrink-0 mt-0.5 text-[#4B3621]/50" aria-hidden="true" />
              <span>
                Sessions are tied to this device and browser. Always{" "}
                <strong className="text-[#4B3621]">log out</strong> when you leave.
                This portal is restricted to authorised administrators only.
              </span>
            </div>
          </div>

          <button onClick={() => navigate("landing")} className="mt-5 block mx-auto text-xs text-gray-500 underline hover:text-[#4B3621]">
            &larr; Back to Landing Page
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Password strength helpers ────────────────────────────────────────────────

/**
 * Password must be 8+ chars and contain at least one:
 * uppercase, lowercase, digit, and special character.
 */
const PASSWORD_RULES = [
  { re: /.{8,}/, label: "At least 8 characters" },
  { re: /[A-Z]/, label: "One uppercase letter (A–Z)" },
  { re: /[a-z]/, label: "One lowercase letter (a–z)" },
  { re: /[0-9]/, label: "One number (0–9)" },
  { re: /[^A-Za-z0-9]/, label: "One special character (!@#$…)" },
];

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  const passed = PASSWORD_RULES.filter((r) => r.re.test(pw)).length;
  if (passed <= 1) return { score: passed, label: "Very weak", color: "bg-red-500" };
  if (passed === 2) return { score: passed, label: "Weak", color: "bg-orange-400" };
  if (passed === 3) return { score: passed, label: "Fair", color: "bg-yellow-400" };
  if (passed === 4) return { score: passed, label: "Strong", color: "bg-blue-500" };
  return { score: passed, label: "Very strong", color: "bg-green-500" };
}

function isPasswordValid(pw: string): boolean {
  return PASSWORD_RULES.every((r) => r.re.test(pw));
}

function PasswordStrengthMeter({ password }: { password: string }) {
  if (!password) return null;
  const { score, label, color } = getPasswordStrength(password);
  const bars = 5;
  return (
    <div className="mt-1.5 flex flex-col gap-1">
      <div className="flex gap-1">
        {Array.from({ length: bars }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all ${i < score ? color : "bg-gray-200"}`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${score >= 4 ? "text-green-600" : score >= 3 ? "text-yellow-600" : "text-red-500"}`}>
        {label}
      </p>
      <ul className="mt-0.5 flex flex-col gap-0.5">
        {PASSWORD_RULES.map((r) => (
          <li key={r.label} className={`flex items-center gap-1.5 text-xs ${r.re.test(password) ? "text-green-600" : "text-gray-400"}`}>
            <span>{r.re.test(password) ? "✓" : "○"}</span>
            {r.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Student number formatter ─────────────────────────────────────────────────
// Format: YYYY-NNNNN-TG-D  e.g. 2023-00438-TG-0
// Displayed as typed sections: [2023] - [00438] - TG - [0]

const STUDENT_NUM_RE = /^\d{4}-\d{5}-TG-[01]$/;

function formatStudentNumber(raw: string): string {
  // Strip everything non-digit, keep only digits
  const digits = raw.replace(/\D/g, "");
  // Piece together: YYYY-NNNNN-TG-D
  let out = "";
  if (digits.length > 0) out += digits.slice(0, 4);
  if (digits.length > 4) out += "-" + digits.slice(4, 9);
  if (digits.length > 9) out += "-TG-" + digits.slice(9, 10);
  return out;
}

// ─── 5. PUPTian / Provider Registration ───────────────────────────────────────

export function Register({ navigate }: { navigate: (s: string) => void }) {
  const { registerAndCreateProfile, authError, clearAuthError } = useAuth();
  const [role, setRole] = useState<"puptian" | "provider">("puptian");
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Shared fields
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedTerms, setAgreedTerms] = useState(false);

  // PUPTian-only — split name
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [studentNumber, setStudentNumber] = useState("");

  // Provider-only
  const [businessName, setBusinessName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [serviceType, setServiceType] = useState("Printing Services");

  const handleStudentNumberInput = (val: string) => {
    // Allow user to type digits freely; auto-insert dashes and TG
    const digits = val.replace(/\D/g, "").slice(0, 10); // max 10 digits: 4+5+1
    setStudentNumber(formatStudentNumber(digits));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError("");
    clearAuthError();
    setSuccessMsg("");

    // ── Password validation ───────────────────────────────────────────────
    if (!isPasswordValid(password)) {
      setLocalError("Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character.");
      return;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }
    if (!agreedTerms) {
      setLocalError("You must agree to the Terms and Services.");
      return;
    }

    if (role === "puptian") {
      if (!lastName.trim() || !firstName.trim()) {
        setLocalError("Last name and first name are required.");
        return;
      }
      if (!STUDENT_NUM_RE.test(studentNumber)) {
        setLocalError("Student number must follow the format: YYYY-NNNNN-TG-D (e.g. 2023-00438-TG-0). Last digit must be 0 or 1.");
        return;
      }
      if (!email.trim()) {
        setLocalError("Email address is required.");
        return;
      }
    } else {
      if (!businessName.trim() || !contactPerson.trim() || !email.trim() || !businessAddress.trim()) {
        setLocalError("All provider fields are required.");
        return;
      }
    }

    // Build display name from split fields
    const displayName = role === "puptian"
      ? `${lastName.trim()}, ${firstName.trim()}${middleName.trim() ? " " + middleName.trim().charAt(0).toUpperCase() + "." : ""}`
      : contactPerson.trim();

    setLoading(true);
    try {
      if (role === "puptian") {
        await registerAndCreateProfile(email.trim(), password, displayName, {
          role: "student",
          password,
          student_number: studentNumber,
          phone: phone.trim() || undefined,
        });
        navigate("student-dashboard");
      } else {
        await registerAndCreateProfile(email.trim(), password, displayName, {
          role: "provider",
          password,
          business_name: businessName.trim(),
          contact_person: contactPerson.trim(),
          business_address: businessAddress.trim(),
          service_type: serviceType,
          phone: phone.trim() || undefined,
        });
        setSuccessMsg(
          "Provider application submitted! Your account is pending admin approval. You will receive an email once approved."
        );
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Registration failed.";
      if (msg.includes("CONFIRMATION_REQUIRED")) {
        setSuccessMsg("Check your email and click the confirmation link to activate your account.");
      } else {
        setLocalError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const displayError = localError || authError || "";

  return (
    <AuthShell
      navigate={navigate}
      roleBadge="Registration"
      roleColor="bg-[#4B3621]"
      title="Join the student services hub."
      subtitle="Choose the account that matches how you want to participate in the PUP Taguig community."
      formTitle="Create an Account"
      formSubtitle="Join University Organization Student Services Hub"
    >
      {/* Role tabs */}
      <div className="mb-5 flex overflow-hidden rounded-2xl border border-[#4B3621]/20 bg-white p-1 shadow-sm">
        <button type="button" onClick={() => setRole("puptian")} className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors ${role === "puptian" ? "bg-[#4B3621] text-white" : "text-gray-600 hover:bg-[#E3C565]/30"}`}>
          PUPTian (Student)
        </button>
        <button type="button" onClick={() => setRole("provider")} className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors ${role === "provider" ? "bg-[#4B3621] text-white" : "text-gray-600 hover:bg-[#E3C565]/30"}`}>
          Service Provider
        </button>
      </div>

      <div className="mb-4 flex justify-center">
        <button
          type="button"
          onClick={() => navigate("register-guest")}
          className="inline-flex items-center gap-2 rounded-full border border-[#4B3621]/20 bg-[#E3C565]/20 px-4 py-2 text-xs font-semibold text-[#4B3621] transition-colors hover:bg-[#E3C565]/50"
        >
          <i className="bi bi-person-plus" aria-hidden="true" />
          Registering as a Guest?
          <span className="underline underline-offset-2">Guest Registration →</span>
        </button>
      </div>

      {/* Success banner */}
      {successMsg && (
        <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {successMsg}
        </div>
      )}

      <WireCard className="rounded-[26px] border-[#4B3621]/20 p-5 shadow-[0_18px_40px_rgba(75,54,33,0.10)] sm:p-7">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          {displayError && <ErrorAlert message={displayError} />}

          {role === "puptian" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="text-xs font-semibold uppercase tracking-wide border-b border-gray-100 pb-2 mb-1 md:col-span-2 text-gray-500">
                PUPTian — Student Information
              </div>

              {/* Last name */}
              <div className="flex flex-col gap-1">
                <label htmlFor="reg-lastname" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input id="reg-lastname" type="text" autoComplete="family-name" placeholder="e.g. dela Cruz" value={lastName} onChange={(e) => setLastName(e.target.value)} className="border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#4B3621] w-full rounded-lg" required />
              </div>

              {/* First name */}
              <div className="flex flex-col gap-1">
                <label htmlFor="reg-firstname" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input id="reg-firstname" type="text" autoComplete="given-name" placeholder="e.g. Juan" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#4B3621] w-full rounded-lg" required />
              </div>

              {/* Middle name */}
              <div className="flex flex-col gap-1">
                <label htmlFor="reg-middlename" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Middle Name <span className="text-gray-400 font-normal normal-case">(optional)</span>
                </label>
                <input id="reg-middlename" type="text" autoComplete="additional-name" placeholder="e.g. Santos" value={middleName} onChange={(e) => setMiddleName(e.target.value)} className="border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#4B3621] w-full rounded-lg" />
              </div>

              {/* Student number */}
              <div className="flex flex-col gap-1">
                <label htmlFor="reg-studnum" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Student Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="reg-studnum"
                  type="text"
                  inputMode="numeric"
                  placeholder="2023-00438-TG-0"
                  value={studentNumber}
                  onChange={(e) => handleStudentNumberInput(e.target.value)}
                  maxLength={17}
                  className={`border px-3 py-2 text-sm bg-white focus:outline-none w-full rounded-lg font-mono ${
                    studentNumber && !STUDENT_NUM_RE.test(studentNumber)
                      ? "border-red-400 focus:border-red-500"
                      : "border-gray-300 focus:border-[#4B3621]"
                  }`}
                  required
                />
                {studentNumber && !STUDENT_NUM_RE.test(studentNumber) && (
                  <p className="text-xs text-red-500 mt-0.5">Format: YYYY-NNNNN-TG-0 or TG-1</p>
                )}
                {STUDENT_NUM_RE.test(studentNumber) && (
                  <p className="text-xs text-green-600 mt-0.5">✓ Valid student number</p>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <label htmlFor="reg-email" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input id="reg-email" type="email" autoComplete="email" placeholder="Official PUP or personal email" value={email} onChange={(e) => setEmail(e.target.value)} className="border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#4B3621] w-full rounded-lg" required />
              </div>

              {/* Contact number */}
              <div className="flex flex-col gap-1">
                <label htmlFor="reg-phone" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Contact Number <span className="text-gray-400 font-normal normal-case">(optional)</span>
                </label>
                <input id="reg-phone" type="tel" autoComplete="tel" placeholder="09XXXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} className="border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#4B3621] w-full rounded-lg" />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1 md:col-span-2">
                <label htmlFor="reg-password" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Min. 8 chars with uppercase, number & special character"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-300 px-3 py-2 pr-10 text-sm bg-white focus:outline-none focus:border-[#4B3621] w-full rounded-lg"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xs" aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <PasswordStrengthMeter password={password} />
              </div>

              {/* Confirm password */}
              <div className="flex flex-col gap-1 md:col-span-2">
                <label htmlFor="reg-confirm" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="reg-confirm"
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`border px-3 py-2 pr-10 text-sm bg-white focus:outline-none w-full rounded-lg ${
                      confirmPassword && confirmPassword !== password
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-300 focus:border-[#4B3621]"
                    }`}
                    required
                  />
                  <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xs" aria-label={showConfirm ? "Hide" : "Show"}>
                    {showConfirm ? "Hide" : "Show"}
                  </button>
                </div>
                {confirmPassword && confirmPassword !== password && (
                  <p className="text-xs text-red-500 mt-0.5">Passwords do not match</p>
                )}
                {confirmPassword && confirmPassword === password && isPasswordValid(password) && (
                  <p className="text-xs text-green-600 mt-0.5">✓ Passwords match</p>
                )}
              </div>

              <div className="mt-1 md:col-span-2">
                <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={agreedTerms} onChange={(e) => setAgreedTerms(e.target.checked)} className="w-4 h-4 border border-gray-400 mt-0.5 shrink-0" />
                  <span>I have read and agree to the Terms and Services</span>
                </label>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="text-xs font-semibold uppercase tracking-wide border-b border-gray-100 pb-2 mb-1 md:col-span-2 text-gray-500">
                Service Provider — Business Information
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="prov-bizname" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Business / Provider Name</label>
                <input id="prov-bizname" type="text" placeholder="Official business name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:border-gray-500 w-full rounded-lg" required />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="prov-contact" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Contact Person</label>
                <input id="prov-contact" type="text" autoComplete="name" placeholder="Name of authorized representative" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} className="border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:border-gray-500 w-full rounded-lg" required />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="prov-email" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Email Address</label>
                <input id="prov-email" type="email" autoComplete="email" placeholder="Business email" value={email} onChange={(e) => setEmail(e.target.value)} className="border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:border-gray-500 w-full rounded-lg" required />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="prov-phone" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Contact Number</label>
                <input id="prov-phone" type="tel" autoComplete="tel" placeholder="09XXXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} className="border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:border-gray-500 w-full rounded-lg" />
              </div>

              <div className="flex flex-col gap-1 md:col-span-2">
                <label htmlFor="prov-address" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Business Address</label>
                <input id="prov-address" type="text" placeholder="Complete address" value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} className="border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:border-gray-500 w-full rounded-lg" required />
              </div>

              <div className="flex flex-col gap-1 md:col-span-2">
                <label htmlFor="prov-service" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Service Type</label>
                <select id="prov-service" value={serviceType} onChange={(e) => setServiceType(e.target.value)} className="border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:border-gray-500 w-full rounded-lg">
                  <option>Printing Services</option>
                  <option>School Supplies</option>
                  <option>Both</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="prov-password" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Password</label>
                <input id="prov-password" type="password" autoComplete="new-password" placeholder="Minimum 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} className="border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:border-gray-500 w-full rounded-lg" required />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="prov-confirm" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Confirm Password</label>
                <input id="prov-confirm" type="password" autoComplete="new-password" placeholder="Re-enter your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:border-gray-500 w-full rounded-lg" required />
              </div>

              <div className="border border-dashed border-gray-300 bg-gray-50 p-3 text-xs text-gray-500 md:col-span-2 rounded-lg">
                <strong>Note:</strong> Provider accounts require University Organization approval before activation.
              </div>

              <div className="mt-1 md:col-span-2">
                <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={agreedTerms} onChange={(e) => setAgreedTerms(e.target.checked)} className="w-4 h-4 border border-gray-400 mt-0.5 shrink-0" />
                  <span>I have read and agree to the Terms and Services</span>
                </label>
              </div>
            </div>
          )}

          <WireBtn type="submit" size="lg" className="w-full mt-2" disabled={loading || !!successMsg}>
            {loading
              ? "Creating account…"
              : role === "puptian"
              ? "Register as PUPTian"
              : "Submit Provider Application"}
          </WireBtn>
        </form>

        <div className="border-t border-gray-200 mt-4 pt-4 text-center">
          <WireBtn variant="ghost" onClick={() => navigate("login")} className="text-sm text-gray-500">
            &larr; Back to Login
          </WireBtn>
        </div>
      </WireCard>
    </AuthShell>
  );
}

// ─── 6. Guest Registration ────────────────────────────────────────────────────

export function GuestRegister({ navigate }: { navigate: (s: string) => void }) {
  const { registerAndCreateProfile, authError, clearAuthError } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [affiliation, setAffiliation] = useState("Non-PUP Student");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedLimitations, setAgreedLimitations] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError("");
    clearAuthError();

    if (!fullName.trim() || !email.trim()) {
      setLocalError("Full name and email are required.");
      return;
    }
    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }
    if (!agreedLimitations || !agreedTerms) {
      setLocalError("Please accept both checkboxes to continue.");
      return;
    }

    setLoading(true);
    try {
      await registerAndCreateProfile(email.trim(), password, fullName.trim(), {
        role: "guest",
        phone: phone.trim() || undefined,
        affiliation,
      });
      navigate("guest-dashboard");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Registration failed.";
      if (msg.includes("CONFIRMATION_REQUIRED")) {
        setSuccessMsg("Check your email and click the confirmation link to activate your account.");
      } else {
        setLocalError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const displayError = localError || authError || "";

  return (
    <AuthShell
      navigate={navigate}
      roleBadge="Guest Registration"
      roleColor="bg-[#E3C565] text-[#000000]"
      title="Explore first. Join when ready."
      subtitle="Create a limited guest account to browse services and post public requests before committing to a full student account."
      formTitle="Create a Guest Account"
      formSubtitle="Browse services and post requests"
    >
      <div className="mb-4 rounded-2xl border border-[#4B3621]/15 bg-[#E3C565]/35 p-4 text-xs text-[#4B3621]">
        <p className="font-semibold mb-1">Guest Account Limitations:</p>
        <ul className="list-disc list-inside flex flex-col gap-0.5">
          <li>Can browse all available services</li>
          <li>Can post &ldquo;Need / Request&rdquo; posts (admin approval required)</li>
          <li>Cannot order printing or purchase supplies</li>
          <li>Cannot create rental posts (PUPTian only)</li>
          <li>Cannot track orders</li>
        </ul>
      </div>

      {successMsg && (
        <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {successMsg}
        </div>
      )}

      <WireCard className="rounded-[26px] border-[#4B3621]/20 p-5 shadow-[0_18px_40px_rgba(75,54,33,0.10)] sm:p-7">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          {displayError && <ErrorAlert message={displayError} />}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="text-xs font-semibold uppercase tracking-wide border-b border-gray-100 pb-2 mb-1 md:col-span-2 text-gray-500">
              Guest — Basic Information
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="guest-reg-name" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Full Name</label>
              <input id="guest-reg-name" type="text" autoComplete="name" placeholder="Your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:border-gray-500 w-full rounded-lg" required />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="guest-reg-email" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Email Address</label>
              <input id="guest-reg-email" type="email" autoComplete="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:border-gray-500 w-full rounded-lg" required />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="guest-reg-phone" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Contact Number</label>
              <input id="guest-reg-phone" type="tel" autoComplete="tel" placeholder="09XXXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} className="border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:border-gray-500 w-full rounded-lg" />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="guest-reg-affil" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Purpose / Affiliation</label>
              <select id="guest-reg-affil" value={affiliation} onChange={(e) => setAffiliation(e.target.value)} className="border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:border-gray-500 w-full rounded-lg">
                <option>Non-PUP Student</option>
                <option>Faculty / Staff</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="guest-reg-pw" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Password</label>
              <input id="guest-reg-pw" type="password" autoComplete="new-password" placeholder="Minimum 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} className="border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:border-gray-500 w-full rounded-lg" required />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="guest-reg-confirm" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Confirm Password</label>
              <input id="guest-reg-confirm" type="password" autoComplete="new-password" placeholder="Re-enter your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:border-gray-500 w-full rounded-lg" required />
            </div>

            <div className="mt-1 md:col-span-2 flex flex-col gap-2">
              <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={agreedLimitations} onChange={(e) => setAgreedLimitations(e.target.checked)} className="w-4 h-4 border border-gray-400 mt-0.5 shrink-0" />
                <span>I understand guest accounts have limited access</span>
              </label>
              <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={agreedTerms} onChange={(e) => setAgreedTerms(e.target.checked)} className="w-4 h-4 border border-gray-400 mt-0.5 shrink-0" />
                <span>I have read and agree to the Terms and Services</span>
              </label>
            </div>
          </div>

          <WireBtn type="submit" size="lg" className="w-full mt-2 bg-gray-600 border-gray-600" disabled={loading || !!successMsg}>
            {loading ? "Creating account…" : "Register as Guest"}
          </WireBtn>
        </form>

        <div className="border-t border-gray-200 mt-4 pt-4 text-center flex flex-col gap-2">
          <p className="text-xs text-gray-500">PUP Taguig student?</p>
          <WireBtn variant="outline" className="w-full" onClick={() => navigate("register")}>Register as PUPTian instead</WireBtn>
          <WireBtn variant="ghost" onClick={() => navigate("login-guest")} className="text-sm text-gray-500">&larr; Back to Guest Login</WireBtn>
        </div>
      </WireCard>
    </AuthShell>
  );
}
