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
  return <div className={`animate-pulse bg-gray-200 ${className}`} />;
}

/** A shimmer block in the brown/gold admin palette. */
function SA({ className }: { className: string }) {
  return <div className={`animate-pulse bg-white/15 ${className}`} />;
}

// ─── 1. Public / Landing Skeleton ────────────────────────────────────────────

export function LandingSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <div className="fixed inset-x-0 top-0 z-40 h-[70px] bg-white border-b border-gray-200 px-6 flex items-center justify-between shadow-sm">
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
          <div className="rounded-[28px] bg-gray-100 min-h-[510px] p-10 flex flex-col justify-between">
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
            <div className="flex gap-8 border-t border-gray-200 pt-4">
              {[80, 100, 80].map((w, i) => <S key={i} className={`w-${w === 80 ? "20" : "24"} h-3 rounded-full`} />)}
            </div>
          </div>
          {/* Right stacked cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-[28px] bg-gray-100 p-7 min-h-[240px] flex flex-col gap-4">
              <S className="w-10 h-10 rounded-xl" />
              <div className="mt-auto flex flex-col gap-2">
                <S className="w-3/4 h-6 rounded-full" />
                <S className="w-full h-3 rounded-full" />
                <S className="w-5/6 h-3 rounded-full" />
              </div>
            </div>
            <div className="rounded-[28px] bg-gray-100 p-7 min-h-[240px] flex flex-col gap-3">
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
              <div key={i} className="rounded-[26px] bg-gray-100 min-h-[285px] p-7 flex flex-col justify-between" style={{ animationDelay: `${i * 80}ms` }}>
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
      <div className="fixed inset-x-0 top-0 z-40 h-[70px] bg-white border-b border-gray-200 px-6 flex items-center justify-between shadow-sm">
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
          <div className="rounded-[28px] bg-gray-100 min-h-[440px] p-10 flex flex-col justify-between">
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
            <S className="w-full h-3 rounded-full border-t border-gray-200 pt-2" />
          </div>

          {/* Right form panel */}
          <div className="mx-auto w-full max-w-lg flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <S className="w-24 h-6 rounded-full" />
              <S className="w-48 h-8 rounded-full" />
              <S className="w-56 h-3 rounded-full" />
            </div>
            <div className="rounded-[26px] border border-gray-100 bg-white p-7 shadow-sm flex flex-col gap-4">
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
        <div className="rounded-[28px] bg-gray-900 min-h-[440px] p-10 flex flex-col justify-between">
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
          <div className="rounded-[26px] border border-gray-100 bg-white p-7 shadow-sm flex flex-col gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <S className="w-24 h-3 rounded-full" />
                <S className="w-full h-10 rounded-xl" />
              </div>
            ))}
            <S className="w-full h-11 rounded-xl mt-1" />
            <div className="rounded-xl bg-gray-50 p-3 flex gap-2">
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
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      {/* Topbar */}
      <div className="h-14 shrink-0 bg-gray-800 border-b border-gray-600 px-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <S className="w-9 h-9 rounded bg-gray-700" />
          <S className="w-7 h-7 rounded bg-gray-700" />
          <S className="w-52 h-4 rounded-full bg-gray-700 hidden sm:block" />
        </div>
        <div className="flex items-center gap-2">
          <S className="w-32 h-8 rounded bg-gray-700 hidden md:block" />
          <S className="w-8 h-8 rounded bg-gray-700" />
          <S className="w-8 h-8 rounded-full bg-gray-700" />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="hidden lg:flex w-48 shrink-0 bg-gray-100 border-r border-gray-300 flex-col py-3 gap-0.5">
          {[70, 90, 60, 55, 60, 75, 70, 65, 55, 50].map((w, i) => (
            <div key={i} className="mx-3 my-0.5">
              <S className={`h-8 rounded`} style={{ width: `${w}%`, animationDelay: `${i * 40}ms` }} />
            </div>
          ))}
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-5 flex flex-col gap-5">
          {/* Welcome row */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1.5">
              <S className="w-48 h-6 rounded-full" />
              <S className="w-56 h-3 rounded-full" />
            </div>
            <S className="w-32 h-9 rounded-xl" />
          </div>

          {/* Quick access 3 cards */}
          <div>
            <S className="w-24 h-3 rounded-full mb-3" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col gap-3" style={{ animationDelay: `${i * 60}ms` }}>
                  <S className="h-16 w-full rounded-lg" />
                  <S className="w-3/4 h-4 rounded-full" />
                  <S className="w-full h-3 rounded-full" />
                  <S className="w-20 h-8 rounded-lg" />
                </div>
              ))}
            </div>
          </div>

          {/* Stats 4 cards */}
          <div>
            <S className="w-20 h-3 rounded-full mb-3" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col gap-2" style={{ animationDelay: `${i * 50}ms` }}>
                  <S className="w-10 h-8 rounded-lg" />
                  <S className="w-20 h-3 rounded-full" />
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
                <div key={i} className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center justify-between gap-3" style={{ animationDelay: `${i * 60}ms` }}>
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="h-14 bg-gray-600 px-3 flex items-center justify-between sticky top-0 z-40 border-b border-gray-500">
        <div className="flex items-center gap-2">
          <S className="w-9 h-9 rounded bg-gray-500" />
          <S className="w-7 h-7 rounded bg-gray-500" />
          <S className="w-48 h-4 rounded-full bg-gray-500 hidden sm:block" />
          <S className="w-14 h-6 rounded bg-gray-500 ml-1" />
        </div>
        <div className="flex items-center gap-2">
          <S className="w-32 h-8 rounded bg-gray-500 hidden sm:block" />
          <S className="w-7 h-7 rounded-full bg-gray-500" />
        </div>
      </div>

      <div className="flex h-[calc(100vh-56px)] overflow-hidden">
        {/* Sidebar */}
        <div className="hidden lg:flex w-48 shrink-0 bg-gray-100 border-r border-gray-300 flex-col py-3 gap-0.5">
          {[75, 85, 80, 65, 75, 55].map((w, i) => (
            <div key={i} className="mx-3 my-0.5">
              <S className="h-8 rounded" style={{ width: `${w}%`, animationDelay: `${i * 45}ms` }} />
            </div>
          ))}
          <div className="mx-3 mt-4 rounded-lg border border-dashed border-gray-300 p-3 flex flex-col gap-1.5">
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
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex gap-3">
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
                  <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col gap-3" style={{ animationDelay: `${i * 60}ms` }}>
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
                  <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col gap-3">
                    <S className="h-12 w-full rounded-lg bg-gray-100" />
                    <S className="w-3/4 h-4 rounded-full" />
                    <S className="w-full h-3 rounded-full" />
                    <div className="rounded border border-dashed border-gray-300 h-8" />
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
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      {/* Topbar */}
      <div className="h-14 shrink-0 bg-gray-800 border-b border-gray-600 px-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <S className="w-9 h-9 rounded bg-gray-700" />
          <S className="w-7 h-7 rounded bg-gray-700" />
          <S className="w-52 h-4 rounded-full bg-gray-700 hidden sm:block" />
        </div>
        <div className="flex items-center gap-2">
          <S className="w-8 h-8 rounded bg-gray-700" />
          <S className="w-8 h-8 rounded-full bg-gray-700" />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="hidden lg:flex w-48 shrink-0 bg-gray-100 border-r border-gray-300 flex-col py-3 gap-0.5">
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
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col gap-2" style={{ animationDelay: `${i * 50}ms` }}>
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
                <div key={i} className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center justify-between gap-3" style={{ animationDelay: `${i * 60}ms` }}>
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
        <div className="h-14 shrink-0 bg-white border-b border-[#4B3621]/10 px-4 flex items-center justify-between gap-3">
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
              {["bg-[#E3C565]/30", "bg-[#4B3621]/20", "bg-white border border-gray-100"].map((cls, i) => (
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
              <div key={i} className="rounded-[20px] bg-white ring-1 ring-[#4B3621]/10 p-5 flex flex-col gap-3" style={{ animationDelay: `${i * 50}ms` }}>
                <S className="w-8 h-8 rounded-xl" />
                <S className="w-12 h-7 rounded-full" />
                <S className="w-24 h-2.5 rounded-full" />
              </div>
            ))}
          </div>

          {/* Row 3: 2 panel cards */}
          <div className="grid gap-4 lg:grid-cols-2">
            {[0, 1].map((col) => (
              <div key={col} className="rounded-[24px] bg-white ring-1 ring-[#4B3621]/10 p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <S className="w-8 h-8 rounded-xl" />
                    <S className="w-32 h-4 rounded-full" />
                  </div>
                  <S className="w-12 h-3 rounded-full" />
                </div>
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-center justify-between rounded-2xl bg-[#fdf8f0] px-4 py-3 gap-3" style={{ animationDelay: `${i * 50}ms` }}>
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
                <div key={i} className="rounded-2xl bg-white/40 p-4 flex flex-col gap-3" style={{ animationDelay: `${i * 60}ms` }}>
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

// ─── 9. Page Transition Overlay ───────────────────────────────────────────────
// A lightweight shimmer bar at the top of the page — used between navigations.

export function PageTransitionBar() {
  return (
    <div className="fixed inset-x-0 top-0 z-[100] h-[3px] overflow-hidden">
      <div
        className="h-full bg-[#E3C565] animate-[shimmer_0.9s_ease-in-out_infinite]"
        style={{
          backgroundImage: "linear-gradient(90deg, transparent 0%, #E3C565 40%, #fff8e1 60%, transparent 100%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 0.9s ease-in-out infinite",
        }}
      />
    </div>
  );
}
