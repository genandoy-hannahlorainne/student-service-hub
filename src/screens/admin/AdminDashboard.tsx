import { AdminLayout } from "../../components/WireframeUI";
import organizationLogo from "../../assets/images/org_ssh_logo.png";

export default function AdminDashboard({ navigate }: { navigate: (s: string) => void }) {
  return (
    <AdminLayout active="admin-dashboard" navigate={navigate}>
      <div className="flex flex-col gap-4 pb-4">

        {/* ── Row 1: Hero + KPIs ─────────────────────────────────────── */}
        <div className="grid gap-4 lg:grid-cols-[1.6fr_0.4fr]">

          {/* Hero bento */}
          <div className="relative overflow-hidden rounded-[24px] bg-[#4B3621] p-7 text-white min-h-[180px] flex flex-col justify-between">
            <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border-[28px] border-[#E3C565]/30 pointer-events-none" />
            <div className="absolute -bottom-16 right-8 h-40 w-40 rounded-full border-[24px] border-[#E3C565]/15 pointer-events-none" />
            <div className="relative flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center ring-2 ring-white/20 rounded-lg overflow-hidden">
                <img src={organizationLogo} alt="UniServe logo" className="h-full w-full object-contain" />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E3C565]">UniServe Admin</p>
                <p className="text-sm font-semibold">University Organization Student Services Hub</p>
              </div>
            </div>
            <div className="relative mt-6">
              <h1 className="text-2xl font-bold tracking-tight">Internal Management Panel</h1>
              <p className="mt-1 text-sm text-[#E3C565]/80">Providers, approvals, orders, and platform oversight.</p>
            </div>
          </div>

          {/* Quick KPIs stacked */}
          <div className="grid grid-rows-3 gap-4">
            {[
              { label: "Pending Approvals", value: "3", icon: "bi-hourglass-split", color: "bg-[#E3C565] text-[#4B3621]" },
              { label: "Active Orders",      value: "14", icon: "bi-bag-check",        color: "bg-[#4B3621] text-white" },
              { label: "Active Providers",   value: "5",  icon: "bi-shop",             color: "bg-white text-[#4B3621] ring-1 ring-[#4B3621]/15" },
            ].map((kpi) => (
              <div key={kpi.label} className={`rounded-[20px] p-4 flex items-center gap-4 ${kpi.color}`}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/10 text-xl">
                  <i className={`bi ${kpi.icon}`} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-2xl font-bold leading-none">{kpi.value}</p>
                  <p className="text-xs font-medium mt-0.5 opacity-80">{kpi.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Row 2: Platform stats ──────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Users",            value: "347", icon: "bi-people",            bg: "bg-white ring-1 ring-[#4B3621]/10" },
            { label: "PUPTians",               value: "312", icon: "bi-mortarboard",        bg: "bg-white ring-1 ring-[#4B3621]/10" },
            { label: "Pending Rental Posts",   value: "8",   icon: "bi-box-seam",           bg: "bg-white ring-1 ring-[#4B3621]/10" },
            { label: "Completed Transactions", value: "892", icon: "bi-receipt-cutoff",     bg: "bg-[#E3C565]" },
          ].map((s) => (
            <div key={s.label} className={`rounded-[20px] p-5 flex flex-col gap-3 ${s.bg}`}>
              <i className={`bi ${s.icon} text-2xl text-[#4B3621]`} aria-hidden="true" />
              <p className="text-3xl font-bold text-[#4B3621] leading-none">{s.value}</p>
              <p className="text-xs text-[#4B3621]/70 font-medium leading-tight">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Row 3: Pending approvals + Recent orders ───────────────── */}
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">

          {/* Pending provider approvals */}
          <div className="rounded-[24px] bg-white ring-1 ring-[#4B3621]/10 p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#4B3621] text-[#E3C565] text-sm">
                  <i className="bi bi-shop" aria-hidden="true" />
                </span>
                <h2 className="font-bold text-[#4B3621]">Provider Approvals</h2>
              </div>
              <button onClick={() => navigate("admin-providers")} className="text-xs font-semibold text-[#4B3621] underline underline-offset-2 hover:text-[#E3C565]">
                View all
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { name: "Quick Copy Solutions", type: "Printing",       date: "Oct 28, 2026" },
                { name: "Campus Supplies Co.",  type: "School Supplies", date: "Oct 27, 2026" },
              ].map((p) => (
                <div key={p.name} className="flex items-center justify-between rounded-2xl bg-[#fdf8f0] px-4 py-3 gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#4B3621]">{p.name}</p>
                    <p className="text-xs text-[#4B3621]/60">{p.type} · {p.date}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button className="rounded-lg bg-[#4B3621] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#3a2918] transition">
                      Approve
                    </button>
                    <button className="rounded-lg bg-white border border-[#4B3621]/20 px-3 py-1.5 text-xs font-semibold text-[#4B3621] hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
              {/* empty state hint */}
              <p className="text-center text-xs text-[#4B3621]/40 pt-1">2 pending — review required</p>
            </div>
          </div>

          {/* Recent orders */}
          <div className="rounded-[24px] bg-white ring-1 ring-[#4B3621]/10 p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E3C565] text-[#4B3621] text-sm">
                  <i className="bi bi-bag-check" aria-hidden="true" />
                </span>
                <h2 className="font-bold text-[#4B3621]">Recent Orders</h2>
              </div>
              <button onClick={() => navigate("admin-orders")} className="text-xs font-semibold text-[#4B3621] underline underline-offset-2 hover:text-[#E3C565]">
                View all
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { id: "ORD-004", student: "Pedro Santos",  amount: "₱55.00",  status: "Processing",       statusColor: "bg-yellow-100 text-yellow-700" },
                { id: "ORD-003", student: "Ana Reyes",     amount: "₱95.00",  status: "Accepted",         statusColor: "bg-blue-100 text-blue-700" },
                { id: "ORD-002", student: "Maria Cruz",    amount: "₱240.00", status: "Ready for Pickup", statusColor: "bg-green-100 text-green-700" },
              ].map((o) => (
                <div key={o.id} className="flex items-center justify-between rounded-2xl bg-[#fdf8f0] px-4 py-3">
                  <div>
                    <p className="text-xs font-mono text-[#4B3621]/50">{o.id}</p>
                    <p className="text-sm font-semibold text-[#4B3621]">{o.student}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-bold text-[#4B3621]">{o.amount}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${o.statusColor}`}>{o.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Row 4: Pending rental posts ────────────────────────────── */}
        <div className="rounded-[24px] bg-[#4B3621] text-white p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E3C565] text-[#4B3621] text-sm">
                <i className="bi bi-box-seam" aria-hidden="true" />
              </span>
              <h2 className="font-bold">Pending Rental Post Reviews</h2>
            </div>
            <button onClick={() => navigate("admin-rental-approval")} className="text-xs font-semibold text-[#E3C565] underline underline-offset-2 hover:text-white">
              View all
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { user: "Juan dela Cruz", title: "Typewriter for Rent — Good Condition", cat: "Typewriter" },
              { user: "Ana Reyes",      title: "Need a Laptop for thesis — Dec 18",    cat: "Laptop" },
              { user: "Pedro Santos",   title: "Scientific Calculator available",       cat: "Calculator" },
            ].map((post) => (
              <div key={post.title} className="rounded-2xl bg-white/10 p-4 flex flex-col gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#E3C565]/70">{post.cat}</span>
                  <p className="text-sm font-semibold mt-1 leading-snug">{post.title}</p>
                  <p className="text-xs text-white/60 mt-0.5">{post.user}</p>
                </div>
                <div className="flex gap-2 mt-auto">
                  <button className="flex-1 rounded-lg bg-[#E3C565] px-2 py-1.5 text-xs font-semibold text-[#4B3621] hover:bg-[#d4b555] transition">
                    Approve
                  </button>
                  <button className="flex-1 rounded-lg bg-white/10 border border-white/20 px-2 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Row 5: Quick navigation bento tiles ───────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Manage Providers",  icon: "bi-shop",            screen: "admin-providers",       bg: "bg-[#E3C565] text-[#4B3621]" },
            { label: "Rental Approvals",  icon: "bi-box-seam",        screen: "admin-rental-approval", bg: "bg-white ring-1 ring-[#4B3621]/10 text-[#4B3621]" },
            { label: "All Orders",        icon: "bi-bag",             screen: "admin-orders",          bg: "bg-white ring-1 ring-[#4B3621]/10 text-[#4B3621]" },
            { label: "Website Content",   icon: "bi-layout-text-window", screen: "admin-website",      bg: "bg-[#4B3621] text-white" },
          ].map((tile) => (
            <button
              key={tile.label}
              onClick={() => navigate(tile.screen)}
              className={`group rounded-[20px] p-5 flex flex-col gap-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg ${tile.bg}`}
            >
              <i className={`bi ${tile.icon} text-2xl`} aria-hidden="true" />
              <div className="flex items-center justify-between mt-auto">
                <span className="text-sm font-bold">{tile.label}</span>
                <i className="bi bi-arrow-up-right text-sm opacity-60 group-hover:opacity-100 transition" aria-hidden="true" />
              </div>
            </button>
          ))}
        </div>

      </div>
    </AdminLayout>
  );
}
