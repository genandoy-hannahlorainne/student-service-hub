import type { ReactNode } from "react";

/**
 * Skeletons.tsx
 *
 * Pixel-accurate skeleton stencils for every screen group.
 * Each component mirrors the real layout's structure — same nav height,
 * same sidebar width, same grid/card patterns — so the transition from
 * skeleton to loaded content is smooth with zero layout shift.
 *
 * Usage:
 *   import { AdminSkeleton } from "../components/Skeletons";
 *   if (loading) return <AdminSkeleton />;
 */

// ─── Shared primitives ────────────────────────────────────────────────────────

/** A single animated shimmer block. className controls size, shape, color. */
function S({ className }: { className: string }) {
  return <div className={`animate-pulse bg-[#E3C565] ${className}`} />;
}

/** A shimmer block in the brown/gold admin palette. */
function SA({ className }: { className: string }) {
  return <div className={`animate-pulse bg-[#E3C565]/15 ${className}`} />;
}

// ─── 1. Public / Landing Skeleton ────────────────────────────────────────────

export function LandingSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <div className="fixed inset-x-0 top-0 z-40 h-[70px] bg-[#E3C565] border-b border-[#4B3621] px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <S className="w-9 h-9 rounded-lg" />
          <S className="w-52 h-4 rounded-full" />
        </div>
        <div className="hidden lg:flex items-center gap-5">
          <S className="w-12 h-3.5 rounded-full" />
          <S className="w-16 h-3.5 rounded-full" />
          <S className="w-28 h-3.5 rounded-full" />
        </div>
        <div className="flex items-center gap-2">
          <S className="w-16 h-8 rounded-lg" />
          <S className="w-20 h-8 rounded-lg" />
        </div>
      </div>
      <div className="h-[70px]" />

      {/* Hero section */}
      <section className="px-4 pb-5 pt-5 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.45fr_0.55fr]">
          {/* Left hero card */}
          <div className="rounded-[28px] bg-[#E3C565] min-h-[510px] p-10 flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <S className="w-12 h-12 rounded-xl" />
              <div className="flex flex-col gap-1.5">
                <S className="w-20 h-2.5 rounded-full" />
                <S className="w-40 h-3 rounded-full" />
              </div>
            </div>
            <div className="flex flex-col gap-4 py-10">
              <S className="w-36 h-6 rounded-full" />
              <S className="w-full h-12 rounded-2xl" />
              <S className="w-4/5 h-12 rounded-2xl" />
              <S className="w-3/5 h-4 rounded-full mt-2" />
              <div className="flex gap-3 mt-2">
                <S className="w-36 h-11 rounded-xl" />
                <S className="w-32 h-11 rounded-xl" />
              </div>
            </div>
            <div className="flex gap-8 border-t border-[#4B3621] pt-4">
              {[80, 100, 80].map((w, i) => <S key={i} className={`w-${w === 80 ? "20" : "24"} h-3 rounded-full`} />)}
            </div>
          </div>
          {/* Right stacked cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-[28px] bg-[#E3C565] p-7 min-h-[240px] flex flex-col gap-4">
              <S className="w-10 h-10 rounded-xl" />
              <div className="mt-auto flex flex-col gap-2">
                <S className="w-3/4 h-6 rounded-full" />
                <S className="w-full h-3 rounded-full" />
                <S className="w-5/6 h-3 rounded-full" />
              </div>
            </div>
            <div className="rounded-[28px] bg-[#E3C565] p-7 min-h-[240px] flex flex-col gap-3">
              <S className="w-24 h-3 rounded-full" />
              {[1, 2, 3].map((i) => <S key={i} className="w-full h-10 rounded-2xl" />)}
            </div>
          </div>
        </div>
      </section>

      {/* Services 3-col grid */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex justify-between items-end">
            <div className="flex flex-col gap-2">
              <S className="w-28 h-3 rounded-full" />
              <S className="w-64 h-8 rounded-full" />
            </div>
            <S className="w-56 h-3 rounded-full hidden sm:block" />
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-[26px] bg-[#E3C565] min-h-[285px] p-7 flex flex-col justify-between" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex justify-between items-start">
                  <S className="w-9 h-9 rounded-xl" />
                  <S className="w-20 h-3 rounded-full" />
                </div>
                <div className="flex flex-col gap-2 mt-auto">
                  <S className="w-3/4 h-7 rounded-full" />
                  <S className="w-full h-3 rounded-full" />
                  <S className="w-5/6 h-3 rounded-full" />
                  <S className="w-24 h-4 rounded-full mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── 2. Auth Shell Skeleton (Login / Register — with public nav) ──────────────

export function AuthSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Public nav */}
      <div className="fixed inset-x-0 top-0 z-40 h-[70px] bg-[#E3C565] border-b border-[#4B3621] px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <S className="w-9 h-9 rounded-lg" />
          <S className="w-52 h-4 rounded-full" />
        </div>
        <div className="flex items-center gap-2">
          <S className="w-16 h-8 rounded-lg" />
          <S className="w-20 h-8 rounded-lg" />
        </div>
      </div>
      <div className="h-[70px]" />

      <div className="px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto grid min-h-[calc(100vh-96px)] max-w-6xl items-center gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Left hero panel */}
          <div className="rounded-[28px] bg-[#E3C565] min-h-[440px] p-10 flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <S className="w-12 h-12 rounded-xl" />
              <div className="flex flex-col gap-1.5">
                <S className="w-16 h-2.5 rounded-full" />
                <S className="w-36 h-3 rounded-full" />
              </div>
            </div>
            <div className="flex flex-col gap-4 py-12">
              <S className="w-40 h-6 rounded-full" />
              <S className="w-full h-10 rounded-2xl" />
              <S className="w-4/5 h-10 rounded-2xl" />
              <S className="w-3/5 h-3 rounded-full mt-2" />
            </div>
            <S className="w-full h-3 rounded-full border-t border-[#4B3621] pt-2" />
          </div>

          {/* Right form panel */}
          <div className="mx-auto w-full max-w-lg flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <S className="w-24 h-6 rounded-full" />
              <S className="w-48 h-8 rounded-full" />
              <S className="w-56 h-3 rounded-full" />
            </div>
            <div className="rounded-[26px] border border-[#4B3621] bg-[#E3C565] p-7 shadow-sm flex flex-col gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <S className="w-24 h-3 rounded-full" />
                  <S className="w-full h-10 rounded-xl" />
                </div>
              ))}
              <S className="w-full h-11 rounded-xl mt-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 3. Admin Login Skeleton (no public nav, black/dark left panel) ───────────

export function AdminLoginSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        {/* Left — black panel */}
        <div className="rounded-[28px] bg-[#000000] min-h-[440px] p-10 flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <SA className="w-12 h-12 rounded-xl" />
            <SA className="w-36 h-3 rounded-full" />
          </div>
          <div className="flex flex-col gap-4 py-12">
            <SA className="w-36 h-6 rounded-full" />
            <SA className="w-full h-10 rounded-2xl" />
            <SA className="w-4/5 h-10 rounded-2xl" />
            <SA className="w-3/5 h-3 rounded-full mt-2" />
          </div>
          <div className="flex flex-col gap-2 border-t border-white/10 pt-4">
            <SA className="w-3/4 h-3 rounded-full" />
            <SA className="w-1/2 h-3 rounded-full" />
          </div>
        </div>
        {/* Right — form */}
        <div className="mx-auto w-full max-w-lg flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <S className="w-36 h-6 rounded-full" />
            <S className="w-48 h-8 rounded-full" />
            <S className="w-56 h-3 rounded-full" />
          </div>
          <div className="rounded-[26px] border border-[#4B3621] bg-[#E3C565] p-7 shadow-sm flex flex-col gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <S className="w-24 h-3 rounded-full" />
                <S className="w-full h-10 rounded-xl" />
              </div>
            ))}
            <S className="w-full h-11 rounded-xl mt-1" />
            <div className="rounded-xl bg-[#E3C565] p-3 flex gap-2">
              <S className="w-4 h-4 rounded shrink-0" />
              <div className="flex flex-col gap-1.5 flex-1">
                <S className="w-full h-2.5 rounded-full" />
                <S className="w-3/4 h-2.5 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 4. Admin Portal Landing Skeleton (dark full-page) ───────────────────────

export function AdminLandingSkeleton() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
        <SA className="w-9 h-9 rounded-xl" />
        <div className="flex flex-col gap-1.5">
          <SA className="w-16 h-2.5 rounded-full" />
          <SA className="w-32 h-3 rounded-full" />
        </div>
        <SA className="ml-auto w-24 h-6 rounded-full" />
      </div>
      {/* Hero centered */}
      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4">
        <SA className="w-28 h-28 rounded-full" />
        <div className="flex flex-col items-center gap-3">
          <SA className="w-44 h-6 rounded-full" />
          <SA className="w-64 h-10 rounded-full" />
          <SA className="w-56 h-10 rounded-full" />
          <SA className="w-72 h-3 rounded-full mt-2" />
          <SA className="w-56 h-3 rounded-full" />
        </div>
        <SA className="w-52 h-13 rounded-2xl mt-4" />
      </main>
    </div>
  );
}

// ─── 5. Student App Skeleton ──────────────────────────────────────────────────

export function StudentSkeleton() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f5f3f0]">
      {/* Topbar */}
      <div className="h-16 shrink-0 bg-[#E3C565] border-b border-[#4B3621]/15 px-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <S className="w-9 h-9 rounded bg-[#E3C565]" />
          <S className="w-7 h-7 rounded bg-[#E3C565]" />
          <S className="w-40 h-4 rounded-full bg-[#E3C565] hidden sm:block" />
        </div>
        <div className="flex items-center gap-2">
          <S className="w-32 h-8 rounded bg-[#E3C565] hidden md:block" />
          <S className="w-8 h-8 rounded bg-[#E3C565]" />
          <S className="w-8 h-8 rounded-full bg-[#E3C565]/50" />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="hidden lg:flex w-48 shrink-0 bg-[#E3C565] border-r border-[#4B3621]/10 flex-col py-3 gap-0.5">
          {[70, 90, 60, 55, 60, 75, 70, 65, 55, 50].map((w, i) => (
            <div key={i} className="mx-3 my-0.5">
              <S className={`h-8 rounded`} style={{ width: `${w}%`, animationDelay: `${i * 40}ms` }} />
            </div>
          ))}
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-5 flex flex-col gap-5">
          {/* Account overview */}
          <div className="rounded-2xl bg-[#E3C565] p-6 shadow-sm ring-1 ring-[#4B3621]/10">
            <S className="w-28 h-3 rounded-full" />
            <S className="mt-3 w-64 h-8 rounded-full" />
            <S className="mt-2 w-72 h-3 rounded-full" />
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-[#E3C565] rounded-2xl p-5 shadow-sm ring-1 ring-[#4B3621]/10">
                <S className="w-24 h-3 rounded-full" />
                <S className="mt-3 w-12 h-8 rounded-lg" />
                <S className="mt-2 w-32 h-3 rounded-full" />
              </div>
            ))}
          </div>

          {/* Services */}
          <div>
            <S className="w-24 h-3 rounded-full mb-3" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="bg-[#E3C565] rounded-2xl p-5 flex flex-col gap-3 shadow-sm" style={{ animationDelay: `${i * 60}ms` }}>
                  <S className="h-7 w-7 rounded-lg" />
                  <S className="mt-5 w-3/4 h-4 rounded-full" />
                  <S className="w-full h-3 rounded-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Orders list */}
          <div>
            <div className="flex justify-between mb-3">
              <S className="w-28 h-3 rounded-full" />
              <S className="w-16 h-3 rounded-full" />
            </div>
            <div className="flex flex-col gap-2">
              {[0, 1].map((i) => (
                <div key={i} className="bg-[#E3C565] rounded-xl border border-[#4B3621] px-4 py-3 flex items-center justify-between gap-3" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="flex flex-col gap-1.5">
                    <S className="w-28 h-2.5 rounded-full" />
                    <S className="w-40 h-3.5 rounded-full" />
                    <S className="w-48 h-2.5 rounded-full" />
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <S className="w-20 h-6 rounded-full" />
                    <S className="w-16 h-8 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ─── 6. Guest App Skeleton ────────────────────────────────────────────────────

export function GuestSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="h-14 bg-[#4B3621] px-3 flex items-center justify-between sticky top-0 z-40 border-b border-gray-500">
        <div className="flex items-center gap-2">
          <S className="w-9 h-9 rounded bg-[#E3C565]0" />
          <S className="w-7 h-7 rounded bg-[#E3C565]0" />
          <S className="w-48 h-4 rounded-full bg-[#E3C565]0 hidden sm:block" />
          <S className="w-14 h-6 rounded bg-[#E3C565]0 ml-1" />
        </div>
        <div className="flex items-center gap-2">
          <S className="w-32 h-8 rounded bg-[#E3C565]0 hidden sm:block" />
          <S className="w-7 h-7 rounded-full bg-[#E3C565]0" />
        </div>
      </div>

      <div className="flex h-[calc(100vh-56px)] overflow-hidden">
        {/* Sidebar */}
        <div className="hidden lg:flex w-48 shrink-0 bg-[#E3C565] border-r border-[#4B3621] flex-col py-3 gap-0.5">
          {[75, 85, 80, 65, 75, 55].map((w, i) => (
            <div key={i} className="mx-3 my-0.5">
              <S className="h-8 rounded" style={{ width: `${w}%`, animationDelay: `${i * 45}ms` }} />
            </div>
          ))}
          <div className="mx-3 mt-4 rounded-lg border border-dashed border-[#4B3621] p-3 flex flex-col gap-1.5">
            {[60, 50, 70, 55].map((w, i) => <S key={i} className="h-2 rounded-full" style={{ width: `${w}%` }} />)}
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-4 lg:p-5">
          <div className="flex flex-col gap-5 max-w-4xl">
            {/* Welcome + upgrade */}
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div className="flex flex-col gap-1.5">
                  <S className="w-44 h-6 rounded-full" />
                  <S className="w-64 h-3 rounded-full" />
                </div>
                <S className="w-32 h-9 rounded-xl" />
              </div>
              <div className="border-2 border-dashed border-[#4B3621] rounded-xl p-4 flex gap-3">
                <div className="flex flex-col gap-2 flex-1">
                  <S className="w-48 h-4 rounded-full" />
                  <S className="w-full h-3 rounded-full" />
                  <S className="w-4/5 h-3 rounded-full" />
                </div>
                <S className="w-32 h-8 rounded-lg shrink-0" />
              </div>
            </div>

            {/* Available features — 3 cards */}
            <div>
              <S className="w-32 h-3 rounded-full mb-3" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="bg-[#E3C565] rounded-xl border border-[#4B3621] p-4 flex flex-col gap-3" style={{ animationDelay: `${i * 60}ms` }}>
                    <S className="h-12 w-full rounded-lg" />
                    <S className="w-3/4 h-4 rounded-full" />
                    <S className="w-full h-3 rounded-full" />
                    <S className="w-20 h-8 rounded-lg" />
                  </div>
                ))}
              </div>
            </div>

            {/* Locked features — muted 3 cards */}
            <div className="opacity-60">
              <S className="w-48 h-3 rounded-full mb-3" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="bg-[#E3C565] rounded-xl border border-[#4B3621] p-4 flex flex-col gap-3">
                    <S className="h-12 w-full rounded-lg bg-[#E3C565]" />
                    <S className="w-3/4 h-4 rounded-full" />
                    <S className="w-full h-3 rounded-full" />
                    <div className="rounded border border-dashed border-[#4B3621] h-8" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ─── 7. Provider App Skeleton ─────────────────────────────────────────────────

export function ProviderSkeleton() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#E3C565]">
      {/* Topbar */}
      <div className="h-14 shrink-0 bg-[#4B3621] border-b border-gray-600 px-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <S className="w-9 h-9 rounded bg-[#4B3621]" />
          <S className="w-7 h-7 rounded bg-[#4B3621]" />
          <S className="w-52 h-4 rounded-full bg-[#4B3621] hidden sm:block" />
        </div>
        <div className="flex items-center gap-2">
          <S className="w-8 h-8 rounded bg-[#4B3621]" />
          <S className="w-8 h-8 rounded-full bg-[#4B3621]" />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="hidden lg:flex w-48 shrink-0 bg-[#E3C565] border-r border-[#4B3621] flex-col py-3 gap-0.5">
          {[70, 60, 65, 70, 75, 60, 55, 50].map((w, i) => (
            <div key={i} className="mx-3 my-0.5">
              <S className="h-8 rounded" style={{ width: `${w}%`, animationDelay: `${i * 40}ms` }} />
            </div>
          ))}
        </div>

        <main className="flex-1 overflow-y-auto p-4 lg:p-5 flex flex-col gap-5">
          {/* Header row */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex flex-col gap-1.5">
              <S className="w-40 h-6 rounded-full" />
              <S className="w-56 h-3 rounded-full" />
            </div>
            <S className="w-20 h-6 rounded-full" />
          </div>

          {/* Stats 4 cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="bg-[#E3C565] rounded-xl border border-[#4B3621] p-4 flex flex-col gap-2" style={{ animationDelay: `${i * 50}ms` }}>
                <S className="w-10 h-8 rounded-lg" />
                <S className="w-20 h-3 rounded-full" />
              </div>
            ))}
          </div>

          {/* Order rows */}
          <div>
            <S className="w-48 h-3 rounded-full mb-3" />
            <div className="flex flex-col gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="bg-[#E3C565] rounded-xl border border-[#4B3621] px-4 py-3 flex items-center justify-between gap-3" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="flex gap-3 items-center">
                    <S className="w-10 h-10 rounded-lg shrink-0" />
                    <div className="flex flex-col gap-1.5">
                      <S className="w-28 h-2.5 rounded-full" />
                      <S className="w-40 h-3.5 rounded-full" />
                      <S className="w-52 h-2.5 rounded-full" />
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <S className="w-28 h-8 rounded-lg" />
                    <S className="w-20 h-8 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ─── 8. Admin App Skeleton ────────────────────────────────────────────────────

export function AdminSkeleton() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f3f0]">

      {/* Sidebar */}
      <div className="hidden lg:flex w-56 shrink-0 flex-col bg-[#4B3621]">
        {/* Logo area */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
          <SA className="w-8 h-8 rounded-xl shrink-0" />
          <div className="flex flex-col gap-1.5">
            <SA className="w-14 h-2 rounded-full" />
            <SA className="w-20 h-3 rounded-full" />
          </div>
        </div>
        {/* Nav items */}
        <nav className="flex flex-col gap-1 p-3 flex-1">
          {[80, 65, 75, 55].map((w, i) => (
            <SA key={i} className="h-10 rounded-xl" style={{ width: `${w}%`, animationDelay: `${i * 60}ms` }} />
          ))}
        </nav>
        {/* Bottom badge */}
        <div className="p-3 border-t border-white/10">
          <SA className="w-full h-10 rounded-xl" />
        </div>
      </div>

      {/* Right column */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        {/* Topbar */}
        <div className="h-14 shrink-0 bg-[#E3C565] border-b border-[#4B3621]/10 px-4 flex items-center justify-between gap-3">
          <S className="w-9 h-9 rounded-lg lg:hidden" />
          <S className="w-32 h-4 rounded-full" />
          <div className="flex items-center gap-2 ml-auto">
            <S className="w-8 h-8 rounded-xl" />
            <S className="w-24 h-8 rounded-xl" />
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-5 flex flex-col gap-4">

          {/* Row 1: hero bento + 3 KPI stack */}
          <div className="grid gap-4 lg:grid-cols-[1.6fr_0.4fr]">
            <S className="rounded-[24px] min-h-[180px]" />
            <div className="grid grid-rows-3 gap-4">
              {["bg-[#E3C565]/30", "bg-[#4B3621]/20", "bg-[#E3C565] border border-[#4B3621]"].map((cls, i) => (
                <div key={i} className={`rounded-[20px] p-4 flex items-center gap-4 ${cls}`} style={{ animationDelay: `${i * 60}ms` }}>
                  <SA className="w-10 h-10 rounded-xl bg-black/10" />
                  <div className="flex flex-col gap-1.5">
                    <S className="w-10 h-5 rounded-full" />
                    <S className="w-24 h-2.5 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: 4 stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="rounded-[20px] bg-[#E3C565] ring-1 ring-[#4B3621]/10 p-5 flex flex-col gap-3" style={{ animationDelay: `${i * 50}ms` }}>
                <S className="w-8 h-8 rounded-xl" />
                <S className="w-12 h-7 rounded-full" />
                <S className="w-24 h-2.5 rounded-full" />
              </div>
            ))}
          </div>

          {/* Row 3: 2 panel cards */}
          <div className="grid gap-4 lg:grid-cols-2">
            {[0, 1].map((col) => (
              <div key={col} className="rounded-[24px] bg-[#E3C565] ring-1 ring-[#4B3621]/10 p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <S className="w-8 h-8 rounded-xl" />
                    <S className="w-32 h-4 rounded-full" />
                  </div>
                  <S className="w-12 h-3 rounded-full" />
                </div>
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-center justify-between rounded-2xl bg-[#E3C565] px-4 py-3 gap-3" style={{ animationDelay: `${i * 50}ms` }}>
                    <div className="flex flex-col gap-1.5">
                      <S className="w-36 h-3.5 rounded-full" />
                      <S className="w-28 h-2.5 rounded-full" />
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <S className="w-16 h-7 rounded-lg" />
                      <S className="w-14 h-7 rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Row 4: full-width dark panel */}
          <div className="rounded-[24px] bg-[#4B3621]/20 p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <S className="w-8 h-8 rounded-xl" />
                <S className="w-44 h-4 rounded-full" />
              </div>
              <S className="w-12 h-3 rounded-full" />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-2xl bg-[#E3C565]/40 p-4 flex flex-col gap-3" style={{ animationDelay: `${i * 60}ms` }}>
                  <S className="w-16 h-2.5 rounded-full" />
                  <S className="w-full h-3.5 rounded-full" />
                  <S className="w-3/4 h-3.5 rounded-full" />
                  <S className="w-24 h-2.5 rounded-full" />
                  <div className="flex gap-2 mt-1">
                    <S className="flex-1 h-8 rounded-lg" />
                    <S className="flex-1 h-8 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

type PageSkeletonProps = {
  role: "student" | "guest" | "provider" | "admin";
  variant: string;
};

function PageChrome({ role, children }: { role: PageSkeletonProps["role"]; children: ReactNode }) {
  const darkSidebar = role === "admin" || role === "provider";
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <aside className={`hidden w-48 shrink-0 flex-col border-r border-[#4B3621] py-3 lg:flex ${darkSidebar ? "bg-[#4B3621]" : "bg-white"}`}>
        <S className={`mx-3 mb-4 h-10 ${darkSidebar ? "bg-[#E3C565]" : "bg-[#E3C565]"}`} />
        {[1, 2, 3, 4, 5, 6, 7].map((item) => <S key={item} className={`mx-3 my-1 h-9 ${darkSidebar ? "bg-[#E3C565]/30" : "bg-[#E3C565]"}`} />)}
      </aside>
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className={`${darkSidebar ? "bg-[#4B3621]" : "bg-white"} flex h-16 shrink-0 items-center justify-between border-b border-[#4B3621] px-4`}>
          <div className="flex items-center gap-2"><S className="h-9 w-9 bg-[#E3C565]" /><S className="h-4 w-44 bg-[#E3C565]" /></div>
          <div className="flex items-center gap-2"><S className="h-8 w-24 bg-[#E3C565]" /><S className="h-8 w-8 bg-[#E3C565]" /></div>
        </header>
        <main className="flex-1 overflow-y-auto bg-white p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

function TitleSkeleton({ width = "w-56" }: { width?: string }) {
  return <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div className="flex flex-col gap-2"><S className="h-3 w-32" /><S className={`h-8 ${width}`} /><S className="h-3 w-72" /></div><S className="h-9 w-32" /></div>;
}

function SkeletonCards({ count = 3, className = "" }: { count?: number; className?: string }) {
  return <div className={`grid gap-4 ${count === 4 ? "md:grid-cols-4" : "md:grid-cols-3"} ${className}`}>{Array.from({ length: count }, (_, index) => <div key={index} className="border-2 border-[#4B3621] bg-white p-5"><S className="h-8 w-8" /><S className="mt-6 h-5 w-3/4" /><S className="mt-3 h-3 w-full" /><S className="mt-2 h-3 w-2/3" /></div>)}</div>;
}

export function PageSkeleton({ role, variant }: PageSkeletonProps) {
  const content = (() => {
    if (role === "student" && variant === "dashboard") return <><TitleSkeleton width="w-72" /><SkeletonCards count={3} /><SkeletonCards count={3} /></>;
    if (role === "student" && (variant === "printing" || variant === "printing-confirmation")) return <><TitleSkeleton /><div className="mb-5 h-12 border-2 border-[#4B3621] bg-[#E3C565] p-3"><S className="h-5 w-full" /></div><div className="grid gap-5 lg:grid-cols-5"><div className="lg:col-span-3 border-2 border-[#4B3621] bg-white p-5"><S className="mb-5 h-6 w-40" /><S className="h-40 w-full" /><div className="mt-4 grid grid-cols-2 gap-3"><S className="h-10 w-full" /><S className="h-10 w-full" /></div></div><div className="lg:col-span-2 border-2 border-[#4B3621] bg-white p-5"><S className="mb-5 h-6 w-40" />{[1, 2, 3, 4, 5].map((item) => <S key={item} className="mb-3 h-10 w-full" />)}</div></div></>;
    if (role === "student" && variant === "supplies") return <><TitleSkeleton /><div className="mb-5 grid grid-cols-3 gap-2"><S className="h-12 w-full" /><S className="h-12 w-full" /><S className="h-12 w-full" /></div><div className="border-2 border-[#4B3621] bg-white p-5"><S className="mb-5 h-6 w-64" /><SkeletonCards count={4} /></div></>;
    if (role === "student" && (variant === "rentals" || variant === "rental-posts")) return <><TitleSkeleton /><div className="mb-5 flex gap-2"><S className="h-9 w-28" /><S className="h-9 w-28" /><S className="h-9 w-28" /></div><SkeletonCards count={3} /></>;
    if (role === "student" && variant === "create-rental") return <><TitleSkeleton /><div className="grid gap-5 lg:grid-cols-5"><div className="space-y-4 lg:col-span-2"><div className="border-2 border-[#4B3621] p-5">{[1, 2, 3].map((item) => <S key={item} className="mb-3 h-12 w-full" />)}</div></div><div className="border-2 border-[#4B3621] p-5 lg:col-span-3"><S className="mb-5 h-6 w-40" />{[1, 2, 3, 4].map((item) => <S key={item} className="mb-4 h-11 w-full" />)}</div></div></>;
    if (role === "student" && (variant === "orders" || variant === "transactions")) return <><TitleSkeleton /><div className="space-y-3">{[1, 2, 3, 4].map((item) => <div key={item} className="flex items-center justify-between border-2 border-[#4B3621] bg-white p-4"><div><S className="h-3 w-28" /><S className="mt-2 h-5 w-64" /><S className="mt-2 h-3 w-40" /></div><S className="h-8 w-24" /></div>)}</div></>;
    if (role === "guest" && variant === "post") return <><TitleSkeleton /><div className="mb-5 border-2 border-dashed border-[#4B3621] p-4"><S className="h-4 w-52" /><S className="mt-2 h-3 w-full" /></div><div className="max-w-2xl border-2 border-[#4B3621] bg-white p-5">{[1, 2, 3, 4, 5, 6].map((item) => <S key={item} className="mb-4 h-11 w-full" />)}</div></>;
    if (role === "admin") return <><TitleSkeleton /><SkeletonCards count={4} /><div className="mt-5 grid gap-4 lg:grid-cols-2"><div className="border-2 border-[#4B3621] p-5">{[1, 2, 3].map((item) => <S key={item} className="mb-3 h-12 w-full" />)}</div><div className="border-2 border-[#4B3621] p-5">{[1, 2, 3].map((item) => <S key={item} className="mb-3 h-12 w-full" />)}</div></div></>;
    if (role === "provider") return <><TitleSkeleton /><SkeletonCards count={4} /><div className="mt-5 space-y-3">{[1, 2, 3].map((item) => <div key={item} className="border-2 border-[#4B3621] p-4"><S className="h-5 w-56" /><S className="mt-3 h-3 w-80" /></div>)}</div></>;
    return <><TitleSkeleton /><SkeletonCards count={3} /></>;
  })();
  return <PageChrome role={role}>{content}</PageChrome>;
}

// ─── 9. Page Transition Overlay ───────────────────────────────────────────────
// A lightweight shimmer bar at the top of the page — used between navigations.

export function PageTransitionBar() {
  return (
    <div className="fixed inset-x-0 top-0 z-[100] h-[3px] overflow-hidden">
      <div
        className="h-full bg-[#E3C565] animate-[shimmer_0.9s_ease-in-out_infinite]"
        style={{
          backgroundColor: "#E3C565",
          backgroundSize: "200% 100%",
          animation: "shimmer 0.9s ease-in-out infinite",
        }}
      />
    </div>
  );
}
