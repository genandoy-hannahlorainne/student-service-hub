import { useEffect, useState } from "react";
import React from "react";
import { fetchTransactions, ServiceTransaction } from "../../lib/api";
import { AdminLayout, WireModal } from "../../components/WireframeUI";

type Order = {
  id: string;
  student: string;
  provider: string;
  service: string;
  date: string;
  amount: string;
  payment: string;
  fulfillment: string;
  status: string;
};

function toOrder(transaction: ServiceTransaction): Order {
  const status = transaction.status.toLowerCase();
  return {
    id: transaction.reference_code,
    student: transaction.student_name ?? "Student",
    provider: transaction.provider_name ?? "Unassigned provider",
    service: transaction.service_type,
    date: new Date(transaction.created_at).toLocaleDateString(),
    amount: `₱${Number(transaction.amount).toFixed(2)}`,
    payment: transaction.payment_method ?? "Not specified",
    fulfillment: typeof transaction.metadata?.fulfillment === "string" ? transaction.metadata.fulfillment : "Not specified",
    status: status === "submitted" ? "processing" : status,
  };
}

const statusLabel: Record<string, string>  = { processing: "Processing", accepted: "Accepted", ready: "Ready for Pickup", completed: "Completed" };
const statusStyle: Record<string, string>  = {
  processing: "bg-[#E3C565] text-[#4B3621]",
  accepted:   "bg-[#E3C565] text-[#4B3621]",
  ready:      "bg-[#E3C565] text-[#4B3621]",
  completed:  "bg-[#E3C565] text-[#4B3621]",
};
const FILTERS = ["all", "processing", "accepted", "ready", "completed"];

export default function AdminOrders({ navigate }: { navigate: (s: string) => void }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadError, setLoadError] = useState("");
  const [filter,    setFilter]    = useState("all");
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [search,    setSearch]    = useState("");

  useEffect(() => {
    void fetchTransactions("admin")
      .then(({ transactions }) => setOrders(transactions.map(toOrder)))
      .catch((error) => setLoadError(error instanceof Error ? error.message : "Could not load orders."));
  }, []);

  const filtered = ORDERS.filter(o =>
    (filter === "all" || o.status === filter) &&
    (search === "" || [o.id, o.student, o.provider].some(v => v.toLowerCase().includes(search.toLowerCase())))
  );

  const total    = ORDERS.length;
  const active   = ORDERS.filter(o => ["processing","accepted","ready"].includes(o.status)).length;
  const done     = ORDERS.filter(o => o.status === "completed").length;
  const revenue  = ORDERS.filter(o => o.status === "completed").reduce((s, o) => s + parseFloat(o.amount.replace("₱","")), 0);

  return (
    <AdminLayout active="admin-orders" navigate={navigate}>
      <div className="flex flex-col gap-4 pb-4">

        {/* ── Header bento ───────────────────────────────────────────── */}
        <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="rounded-[24px] bg-[#4B3621] text-white p-6 flex flex-col justify-between min-h-[140px] relative overflow-hidden">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border-[24px] border-[#E3C565]/25 pointer-events-none" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E3C565]">Admin · Orders</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight">Order Management</h1>
              <p className="mt-1 text-sm text-[#E3C565]/70">Monitor all platform orders across providers and students.</p>
            </div>
            <div className="mt-4">
              <input
                value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                placeholder="Search by ID, student, or provider…"
                className="w-full rounded-xl border border-white/20 bg-[#E3C565]/10 px-4 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus:border-[#E3C565]"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Total Orders",  value: total,               bg: "bg-[#E3C565] text-[#4B3621]",             icon: "bi-bag" },
              { label: "Active",        value: active,              bg: "bg-[#E3C565] ring-1 ring-[#4B3621]/10 text-[#4B3621]", icon: "bi-arrow-repeat" },
              { label: "Completed",     value: done,                bg: "bg-[#E3C565] ring-1 ring-[#4B3621]/10 text-[#4B3621]", icon: "bi-check2-all" },
              { label: "Revenue",       value: `₱${revenue.toFixed(0)}`, bg: "bg-[#4B3621] text-white",           icon: "bi-cash-stack" },
            ].map((s) => (
              <div key={s.label} className={`rounded-[18px] p-3 flex flex-col gap-1 ${s.bg}`}>
                <i className={`bi ${s.icon} text-lg`} />
                <p className="text-xl font-bold leading-none">{s.value}</p>
                <p className="text-[10px] font-medium opacity-70">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Status filters ──────────────────────────────────────────── */}
        {loadError && <p role="alert" className="border border-[#4B3621] bg-[#E3C565] p-3 text-sm text-[#4B3621]">{loadError}</p>}
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition ${filter === f ? "bg-[#4B3621] text-white" : "bg-[#E3C565] text-[#4B3621] ring-1 ring-[#4B3621]/15 hover:bg-[#E3C565]"}`}
            >
              {f === "all" ? "All Orders" : statusLabel[f]}
              <span className="ml-1 opacity-50">({f === "all" ? ORDERS.length : ORDERS.filter(o => o.status === f).length})</span>
            </button>
          ))}
        </div>

        {/* ── Orders cards ────────────────────────────────────────────── */}
        <div className="rounded-[24px] bg-[#E3C565] ring-1 ring-[#4B3621]/10 p-5 flex flex-col gap-3">
          <h2 className="font-bold text-[#4B3621]">Orders <span className="text-[#4B3621]/40 font-normal text-sm">({filtered.length})</span></h2>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-[#4B3621]/10 py-12 text-center text-[#4B3621]/40 text-sm">No orders found.</div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((o) => (
                <div key={o.id} className="rounded-2xl bg-[#E3C565] p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#4B3621]/50">{o.id}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusStyle[o.status]}`}>{statusLabel[o.status]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#4B3621]">{o.student}</p>
                    <p className="text-xs text-[#4B3621]/60">{o.provider} · {o.service}</p>
                    <p className="text-[10px] text-[#4B3621]/40 mt-0.5">{o.date}</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#4B3621]/5">
                    <div>
                      <p className="text-lg font-bold text-[#4B3621]">{o.amount}</p>
                      <p className="text-[10px] text-[#4B3621]/50">{o.payment} · {o.fulfillment}</p>
                    </div>
                    <button onClick={() => setViewOrder(o)} className="rounded-lg border border-[#4B3621]/15 px-3 py-1.5 text-xs font-medium text-[#4B3621] hover:bg-[#E3C565] transition">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Order Detail Modal */}
      {viewOrder && (
        <WireModal title={`Order — ${viewOrder.id}`} onClose={() => setViewOrder(null)}>
          <div className="flex flex-col gap-0">
            {([["Student", viewOrder.student], ["Provider", viewOrder.provider], ["Service", viewOrder.service], ["Date", viewOrder.date], ["Fulfillment", viewOrder.fulfillment], ["Payment", viewOrder.payment], ["Amount", viewOrder.amount], ["Status", statusLabel[viewOrder.status]]] as [string,string][]).map(([k, v]) => (
              <div key={k} className="flex justify-between py-2.5 border-b border-[#4B3621] text-sm last:border-0">
                <span className="text-[#4B3621]">{k}</span>
                <span className="font-semibold text-[#4B3621]">{v}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => setViewOrder(null)} className="flex-1 rounded-xl border border-[#4B3621]/20 py-2.5 text-sm font-semibold text-[#4B3621] hover:bg-[#E3C565] transition">Close</button>
            <button onClick={() => navigate("transaction-receipt")} className="flex-1 rounded-xl bg-[#4B3621] py-2.5 text-sm font-semibold text-white hover:bg-[#3a2918] transition">View Receipt</button>
          </div>
        </WireModal>
      )}
    </AdminLayout>
  );
}
