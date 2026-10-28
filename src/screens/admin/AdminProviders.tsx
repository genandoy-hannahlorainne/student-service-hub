import { useState } from "react";
import { AdminLayout, WireModal, WireTextarea } from "../../components/WireframeUI";

const PROVIDERS = [
  { name: "Speedy Print Shop",          type: "Printing",        location: "Western Bicutan, Taguig",  fee: "₱30", status: "active",  since: "Oct 2025" },
  { name: "Taguig Print Center",        type: "Printing",        location: "Central Bicutan, Taguig",  fee: "₱35", status: "active",  since: "Nov 2025" },
  { name: "Campus Copy Express",        type: "Printing",        location: "Western Bicutan, Taguig",  fee: "₱25", status: "inactive",since: "Oct 2025" },
  { name: "UniServe Supplies",          type: "School Supplies", location: "PUP Taguig Campus",        fee: "₱20", status: "active",  since: "Sep 2025" },
  { name: "Quick Copy Solutions",       type: "Printing",        location: "Ususan, Taguig",           fee: "TBD", status: "pending", since: "Oct 2025" },
  { name: "Campus Supplies Co.",        type: "School Supplies", location: "Fort Bonifacio, Taguig",   fee: "TBD", status: "pending", since: "Oct 2025" },
];

const FLOW_STEPS = [
  ["bi-telephone",       "UniServe contacts potential provider"],
  ["bi-handshake",       "Provider agrees to collaborate"],
  ["bi-chat-text",       "Terms and delivery fee discussed"],
  ["bi-currency-dollar", "Delivery fee agreed and recorded"],
  ["bi-person-plus",     "Provider registers an account"],
  ["bi-check2-circle",   "Admin activates the account"],
  ["bi-eye",             "Provider visible on the platform"],
];

const statusStyle: Record<string, string> = {
  active:   "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-500",
  pending:  "bg-[#E3C565]/40 text-[#4B3621]",
};

export default function AdminProviders({ navigate }: { navigate: (s: string) => void }) {
  const [rejectModal, setRejectModal] = useState<string | null>(null);
  const [viewFlow, setViewFlow] = useState(false);

  const active  = PROVIDERS.filter(p => p.status === "active").length;
  const pending = PROVIDERS.filter(p => p.status === "pending").length;

  return (
    <AdminLayout active="admin-providers" navigate={navigate}>
      <div className="flex flex-col gap-4 pb-4">

        {/* ── Header bento ───────────────────────────────────────────── */}
        <div className="grid gap-4 lg:grid-cols-[1.5fr_0.5fr]">
          <div className="rounded-[24px] bg-[#4B3621] text-white p-6 flex flex-col justify-between min-h-[140px] relative overflow-hidden">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border-[24px] border-[#E3C565]/25 pointer-events-none" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E3C565]">Admin · Providers</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight">Service Provider Management</h1>
              <p className="mt-1 text-sm text-[#E3C565]/70">Manage collaborating printing shops and supply providers.</p>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setViewFlow(true)} className="rounded-xl border border-white/30 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 transition">
                <i className="bi bi-diagram-3 mr-1.5" />Approval Flow
              </button>
              <button className="rounded-xl bg-[#E3C565] px-4 py-2 text-xs font-semibold text-[#4B3621] hover:bg-[#d4b555] transition">
                <i className="bi bi-plus-lg mr-1.5" />Add Provider
              </button>
            </div>
          </div>

          <div className="grid grid-rows-2 gap-4">
            <div className="rounded-[20px] bg-[#E3C565] p-4 flex items-center gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4B3621] text-[#E3C565] text-lg shrink-0">
                <i className="bi bi-shop" />
              </span>
              <div>
                <p className="text-3xl font-bold text-[#4B3621]">{active}</p>
                <p className="text-xs font-medium text-[#4B3621]/70">Active Providers</p>
              </div>
            </div>
            <div className="rounded-[20px] bg-white ring-1 ring-[#4B3621]/10 p-4 flex items-center gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4B3621]/10 text-[#4B3621] text-lg shrink-0">
                <i className="bi bi-hourglass-split" />
              </span>
              <div>
                <p className="text-3xl font-bold text-[#4B3621]">{pending}</p>
                <p className="text-xs font-medium text-[#4B3621]/60">Pending Approval</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Policy notice ───────────────────────────────────────────── */}
        <div className="rounded-[18px] border border-[#E3C565] bg-[#fffdf0] px-5 py-3 flex items-start gap-3 text-sm text-[#4B3621]">
          <i className="bi bi-info-circle mt-0.5 shrink-0 text-[#4B3621]" />
          <p><strong>Platform Policy:</strong> Only officially approved providers appear on the student-facing platform. Delivery fees are part of the collaboration agreement and cannot be modified independently by providers.</p>
        </div>

        {/* ── Pending approvals ───────────────────────────────────────── */}
        {pending > 0 && (
          <div className="rounded-[24px] bg-white ring-1 ring-[#4B3621]/10 p-5 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E3C565] text-[#4B3621] text-sm">
                <i className="bi bi-hourglass-split" />
              </span>
              <h2 className="font-bold text-[#4B3621]">Pending Applications</h2>
              <span className="ml-auto rounded-full bg-[#E3C565] px-2 py-0.5 text-[10px] font-bold text-[#4B3621]">{pending}</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {PROVIDERS.filter(p => p.status === "pending").map((p) => (
                <div key={p.name} className="rounded-2xl bg-[#fdf8f0] p-4 flex flex-col gap-3">
                  <div>
                    <p className="font-semibold text-[#4B3621]">{p.name}</p>
                    <p className="text-xs text-[#4B3621]/60">{p.type} · {p.location}</p>
                    <p className="text-xs text-[#4B3621]/50 mt-0.5">Applied {p.since}</p>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <button className="flex-1 rounded-lg bg-[#4B3621] px-3 py-2 text-xs font-semibold text-white hover:bg-[#3a2918] transition">Approve</button>
                    <button onClick={() => setRejectModal(p.name)} className="flex-1 rounded-lg border border-[#4B3621]/20 px-3 py-2 text-xs font-semibold text-[#4B3621] hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── All providers grid ──────────────────────────────────────── */}
        <div className="rounded-[24px] bg-white ring-1 ring-[#4B3621]/10 p-5 flex flex-col gap-4">
          <h2 className="font-bold text-[#4B3621]">All Providers <span className="text-[#4B3621]/40 font-normal text-sm">({PROVIDERS.length})</span></h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PROVIDERS.map((p) => (
              <div key={p.name} className="rounded-2xl border border-[#4B3621]/10 p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${statusStyle[p.status]}`}>{p.status}</span>
                  <span className="text-[10px] text-[#4B3621]/40 font-medium">{p.type}</span>
                </div>
                <div>
                  <p className="font-semibold text-[#4B3621]">{p.name}</p>
                  <p className="text-xs text-[#4B3621]/60 mt-0.5">{p.location}</p>
                </div>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#4B3621]/5">
                  <div>
                    <p className="text-[10px] text-[#4B3621]/40">Agreed fee</p>
                    <p className="text-sm font-bold text-[#4B3621]">{p.fee}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <button className="rounded-lg border border-[#4B3621]/15 px-3 py-1.5 text-xs font-medium text-[#4B3621] hover:bg-[#fdf8f0] transition">Edit</button>
                    <button className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${p.status === "active" ? "bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600" : "bg-[#4B3621] text-white hover:bg-[#3a2918]"}`}>
                      {p.status === "active" ? "Deactivate" : p.status === "inactive" ? "Activate" : "Review"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Approval Flow Modal */}
      {viewFlow && (
        <WireModal title="Provider Approval Flow" onClose={() => setViewFlow(false)}>
          <p className="text-xs text-gray-500 mb-4">Standard process for onboarding a new provider to UniServe.</p>
          <div className="flex flex-col gap-2">
            {FLOW_STEPS.map(([icon, step], i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#4B3621] text-[#E3C565] text-sm">
                  <i className={`bi ${icon}`} />
                </span>
                <span className="text-sm text-gray-700">{step}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setViewFlow(false)} className="mt-5 w-full rounded-xl bg-[#4B3621] py-2.5 text-sm font-semibold text-white hover:bg-[#3a2918] transition">Close</button>
        </WireModal>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <WireModal title={`Reject — ${rejectModal}`} onClose={() => setRejectModal(null)}>
          <p className="text-sm text-gray-600 mb-3">Provide a reason for rejecting this provider application:</p>
          <WireTextarea placeholder="e.g. Incomplete requirements. Missing business permit." rows={3} />
          <div className="flex gap-2 mt-4">
            <button onClick={() => setRejectModal(null)} className="flex-1 rounded-xl border border-[#4B3621]/20 py-2.5 text-sm font-semibold text-[#4B3621] hover:bg-gray-50 transition">Cancel</button>
            <button onClick={() => setRejectModal(null)} className="flex-1 rounded-xl bg-[#4B3621] py-2.5 text-sm font-semibold text-white hover:bg-[#3a2918] transition">Confirm Reject</button>
          </div>
        </WireModal>
      )}
    </AdminLayout>
  );
}
