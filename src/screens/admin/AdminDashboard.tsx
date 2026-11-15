import { useEffect, useState } from "react";
import { fetchAdminData, fetchTransactions, AdminData, ServiceTransaction } from "../../lib/api";
import { AdminLayout } from "../../components/WireframeUI";
import organizationLogo from "../../assets/images/org_ssh_logo.png";

export default function AdminDashboard({ navigate }: { navigate: (s: string) => void }) {
  const [data, setData] = useState<AdminData | null>(null);
  const [transactions, setTransactions] = useState<ServiceTransaction[]>([]);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    void Promise.all([fetchAdminData(), fetchTransactions("admin")])
      .then(([adminData, transactionData]) => {
        setData(adminData);
        setTransactions(transactionData.transactions);
      })
      .catch((error) => setLoadError(error instanceof Error ? error.message : "Could not load admin data."));
  }, []);

  const pendingProviders = data?.providers.filter((provider) => provider.status === "pending_approval") ?? [];
  const activeProviders = data?.providers.filter((provider) => provider.status === "active") ?? [];
  const completedTransactions = transactions.filter((transaction) => transaction.status.toLowerCase() === "completed");
  return (
    <AdminLayout active="admin-dashboard" navigate={navigate}>
      <div className="flex flex-col gap-4 pb-4">
        {loadError && <p role="alert" className="border border-[#4B3621] bg-[#E3C565] p-3 text-sm text-[#4B3621]">{loadError}</p>}

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
                <p className="text-sm font-semibold">UniServe University Student Services Hub</p>
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
              { label: "Pending Approvals", value: pendingProviders.length, icon: "bi-hourglass-split", color: "bg-[#E3C565] text-[#4B3621]" },
              { label: "Active Orders",      value: transactions.filter((transaction) => transaction.status.toLowerCase() !== "completed").length, icon: "bi-bag-check", color: "bg-[#4B3621] text-white" },
              { label: "Active Providers",   value: activeProviders.length, icon: "bi-shop", color: "bg-[#E3C565] text-[#4B3621] ring-1 ring-[#4B3621]/15" },
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
            { label: "Total Users", value: data?.accounts.total ?? 0, icon: "bi-people", bg: "bg-[#E3C565] ring-1 ring-[#4B3621]/10" },
            { label: "Active Accounts", value: data?.accounts.active ?? 0, icon: "bi-mortarboard", bg: "bg-[#E3C565] ring-1 ring-[#4B3621]/10" },
            { label: "Available Supply Shops", value: data?.supplies.shops ?? 0, icon: "bi-shop", bg: "bg-[#E3C565] ring-1 ring-[#4B3621]/10" },
            { label: "Completed Transactions", value: completedTransactions.length, icon: "bi-receipt-cutoff", bg: "bg-[#E3C565]" },
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
          <div className="rounded-[24px] bg-[#E3C565] ring-1 ring-[#4B3621]/10 p-5 flex flex-col gap-4">
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
              {pendingProviders.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-2xl bg-[#E3C565] px-4 py-3 gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#4B3621]">{p.business_name}</p>
                    <p className="text-xs text-[#4B3621]/60">{p.service_type} · {new Date(p.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button className="rounded-lg bg-[#4B3621] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#3a2918] transition">
                      Approve
                    </button>
                    <button className="rounded-lg bg-[#E3C565] border border-[#4B3621]/20 px-3 py-1.5 text-xs font-semibold text-[#4B3621] hover:bg-[#E3C565] hover:border-[#4B3621] hover:text-[#4B3621] transition">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
              {/* empty state hint */}
              {pendingProviders.length === 0 && <p className="text-center text-xs text-[#4B3621]/40 pt-1">No pending provider approvals.</p>}
            </div>
          </div>

          {/* Recent orders */}
          <div className="rounded-[24px] bg-[#E3C565] ring-1 ring-[#4B3621]/10 p-5 flex flex-col gap-4">
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
              {transactions.slice(0, 3).map((o) => (
                <div key={o.id} className="flex items-center justify-between rounded-2xl bg-[#E3C565] px-4 py-3">
                  <div>
                    <p className="text-xs font-mono text-[#4B3621]/50">{o.reference_code}</p>
                    <p className="text-sm font-semibold text-[#4B3621]">{o.student_name ?? "Student"}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-bold text-[#4B3621]">₱{Number(o.amount).toFixed(2)}</span>
                    <span className="rounded-full bg-[#E3C565] px-2 py-0.5 text-[10px] font-semibold text-[#4B3621]">{o.status}</span>
                  </div>
                </div>
              ))}
              {transactions.length === 0 && <p className="text-center text-xs text-[#4B3621]/40 pt-1">No orders yet.</p>}
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
            <p className="col-span-full border border-dashed border-white/30 p-5 text-center text-sm text-white/70">
              Rental review data will appear here when the admin rental endpoint is connected.
            </p>
          </div>
        </div>

        {/* ── Row 5: Quick navigation bento tiles ───────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Manage Providers",  icon: "bi-shop",            screen: "admin-providers",       bg: "bg-[#E3C565] text-[#4B3621]" },
            { label: "Rental Approvals",  icon: "bi-box-seam",        screen: "admin-rental-approval", bg: "bg-[#E3C565] ring-1 ring-[#4B3621]/10 text-[#4B3621]" },
            { label: "All Orders",        icon: "bi-bag",             screen: "admin-orders",          bg: "bg-[#4B3621] text-white" },
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
