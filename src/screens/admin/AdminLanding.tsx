/**
 * AdminLanding.tsx
 *
 * The dedicated entry-point for the admin world.
 * Accessible only via  /#/admin  — never linked from public-facing pages.
 *
 * This page:
 *  - Identifies itself as a restricted internal portal
 *  - Provides the single CTA: "Sign in to Admin Panel"
 *  - Has no links to the public site, student portals, or registration
 */

import organizationLogo from "../../assets/images/org_ssh_logo.png";

export default function AdminLanding({ navigate }: { navigate: (s: string) => void }) {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col">

      {/* ── Minimal top bar ────────────────────────────────────────────────── */}
      <header className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl overflow-hidden ring-1 ring-white/20">
          <img src={organizationLogo} alt="UniServe logo" className="h-full w-full object-contain" />
        </span>
        <div className="flex flex-col leading-none">
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#E3C565]">UniServe</span>
          <span className="text-xs font-semibold text-white/70">Internal Administration</span>
        </div>
        {/* Restricted badge */}
        <span className="ml-auto flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-[10px] font-semibold text-red-400">
          <i className="bi bi-shield-exclamation" aria-hidden="true" />
          RESTRICTED
        </span>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">

        {/* Decorative ring */}
        <div className="relative mb-10 flex h-28 w-28 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-[3px] border-[#E3C565]/20 animate-pulse" />
          <div className="absolute inset-3 rounded-full border-[2px] border-[#E3C565]/30" />
          <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E3C565]/10 ring-1 ring-[#E3C565]/30">
            <i className="bi bi-shield-lock-fill text-2xl text-[#E3C565]" aria-hidden="true" />
          </span>
        </div>

        {/* Copy */}
        <div className="text-center max-w-md">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E3C565]/25 bg-[#E3C565]/10 px-4 py-1.5 text-xs font-semibold text-[#E3C565]">
            <i className="bi bi-lock-fill" aria-hidden="true" />
            Administrator Portal Only
          </div>
          <h1 className="text-4xl font-bold tracking-tight leading-tight">
            University Organization<br />
            <span className="text-[#E3C565]">Admin Panel</span>
          </h1>
          <p className="mt-5 text-sm leading-6 text-white/50">
            This portal is exclusively for authorised University Organization administrators.
            Credentials are issued by management only and all activity is logged.
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate("login-admin")}
          className="mt-10 flex items-center gap-3 rounded-2xl bg-[#E3C565] px-8 py-4 text-sm font-bold text-[#000000] shadow-[0_8px_32px_rgba(227,197,101,0.25)] transition hover:bg-[#d4b555] hover:shadow-[0_12px_40px_rgba(227,197,101,0.35)] active:scale-[0.98]"
        >
          <i className="bi bi-box-arrow-in-right text-base" aria-hidden="true" />
          Sign in to Admin Panel
        </button>

        {/* Assurance row */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/30">
          <span className="flex items-center gap-1.5">
            <i className="bi bi-activity" aria-hidden="true" />
            All sessions monitored
          </span>
          <span className="flex items-center gap-1.5">
            <i className="bi bi-clock-history" aria-hidden="true" />
            Activity logged
          </span>
          <span className="flex items-center gap-1.5">
            <i className="bi bi-person-lock" aria-hidden="true" />
            Credentials issued by management
          </span>
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/10 px-6 py-4 text-center text-[10px] text-white/20">
        University Organization Student Services Hub &mdash; Internal Use Only
      </footer>
    </div>
  );
}
