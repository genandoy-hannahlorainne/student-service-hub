import { useState } from "react";
import { AdminLayout, WireModal, WireTextarea } from "../../components/WireframeUI";

const INITIAL_POSTS = [
  { id: "POST-014", user: "Juan dela Cruz", type: "Available for Rent", cat: "Typewriter",  title: "Typewriter for Rent — Good Working Condition",         desc: "Typewriter available for rent, ideal for academic projects. Keys are fully functional. ₱50/day. Campus meetup available.", date: "Oct 28, 2026", status: "pending" },
  { id: "POST-013", user: "Ana Reyes",      type: "Looking For",        cat: "Laptop",      title: "Need laptop for thesis presentation",                  desc: "Looking for a laptop to borrow for one day. Windows preferred. Willing to leave collateral.", date: "Oct 27, 2026", status: "pending" },
  { id: "POST-012", user: "Pedro Santos",   type: "Available for Rent", cat: "Calculator",  title: "Scientific Calculator Casio FX-991 for Rent",          desc: "Casio FX-991ES Plus, good condition. ₱30/day. Available weekday evenings and weekends.", date: "Oct 26, 2026", status: "pending" },
  { id: "POST-008", user: "Maria Cruz",     type: "Available for Rent", cat: "Books",       title: "Thermodynamics Textbook — Cengel 8th Edition",         desc: "Complete textbook, all pages present. ₱20/day.", date: "Oct 20, 2026", status: "approved" },
  { id: "POST-006", user: "Roberto Flores", type: "Looking For",        cat: "Projector",   title: "Need projector for club presentation",                 desc: "Student org needs projector for one day. MOU from adviser available.", date: "Oct 10, 2026", status: "rejected", reason: "Missing exact specs and proof of club authorization." },
];

type Post = typeof INITIAL_POSTS[0];
type Tab = "pending" | "approved" | "rejected";

const catIcon: Record<string, string> = {
  Typewriter: "bi-keyboard", Laptop: "bi-laptop", Calculator: "bi-calculator",
  Books: "bi-book", Projector: "bi-projector", default: "bi-box-seam",
};
const typeColor: Record<string, string> = {
  "Available for Rent": "bg-green-100 text-green-700",
  "Looking For":        "bg-blue-100 text-blue-700",
};

export default function AdminRentalApproval({ navigate }: { navigate: (s: string) => void }) {
  const [tab, setTab]             = useState<Tab>("pending");
  const [posts, setPosts]         = useState(INITIAL_POSTS);
  const [rejectTarget, setRejectTarget] = useState<Post | null>(null);

  const counts = { pending: posts.filter(p => p.status === "pending").length, approved: posts.filter(p => p.status === "approved").length, rejected: posts.filter(p => p.status === "rejected").length };
  const filtered = posts.filter(p => p.status === tab);

  const approve = (id: string) => setPosts(prev => prev.map(p => p.id === id ? { ...p, status: "approved" } : p));
  const reject  = (id: string) => { setPosts(prev => prev.map(p => p.id === id ? { ...p, status: "rejected", reason: "Reviewed and rejected by administrator." } : p)); setRejectTarget(null); };

  return (
    <AdminLayout active="admin-rental-approval" navigate={navigate}>
      <div className="flex flex-col gap-4 pb-4">

        {/* ── Header bento ───────────────────────────────────────────── */}
        <div className="grid gap-4 lg:grid-cols-[1.5fr_0.5fr]">
          <div className="rounded-[24px] bg-[#4B3621] text-white p-6 flex flex-col justify-between min-h-[140px] relative overflow-hidden">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border-[24px] border-[#E3C565]/25 pointer-events-none" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E3C565]">Admin · Rentals</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight">Rental Post Approval</h1>
              <p className="mt-1 text-sm text-[#E3C565]/70">Review and moderate student rental and looking-for posts.</p>
            </div>
          </div>
          <div className="grid grid-rows-3 gap-4">
            {(["pending", "approved", "rejected"] as Tab[]).map((t) => {
              const styles = { pending: "bg-[#E3C565] text-[#4B3621]", approved: "bg-[#4B3621] text-white", rejected: "bg-white ring-1 ring-[#4B3621]/10 text-[#4B3621]" };
              const icons  = { pending: "bi-hourglass-split", approved: "bi-check2-circle", rejected: "bi-x-circle" };
              return (
                <button key={t} onClick={() => setTab(t)} className={`rounded-[18px] p-3 flex items-center gap-3 text-left transition hover:-translate-y-0.5 ${styles[t]} ${tab === t ? "ring-2 ring-offset-1 ring-[#4B3621]" : ""}`}>
                  <i className={`bi ${icons[t]} text-xl shrink-0`} />
                  <div>
                    <p className="text-xl font-bold leading-none">{counts[t]}</p>
                    <p className="text-[10px] font-medium mt-0.5 opacity-80 capitalize">{t}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Post cards ─────────────────────────────────────────────── */}
        <div className="rounded-[24px] bg-white ring-1 ring-[#4B3621]/10 p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#4B3621] text-[#E3C565] text-sm">
              <i className="bi bi-box-seam" />
            </span>
            <h2 className="font-bold text-[#4B3621] capitalize">{tab} Posts</h2>
            <span className="ml-auto rounded-full bg-[#E3C565] px-2 py-0.5 text-[10px] font-bold text-[#4B3621]">{filtered.length}</span>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-[#4B3621]/10 py-12 text-center text-[#4B3621]/40 text-sm">
              No {tab} posts.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((post) => (
                <div key={post.id} className={`rounded-2xl p-4 flex flex-col gap-3 ${post.status === "rejected" ? "bg-red-50 ring-1 ring-red-200" : "bg-[#fdf8f0]"}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#4B3621] text-[#E3C565] text-sm">
                        <i className={`bi ${catIcon[post.cat] ?? catIcon.default}`} />
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${typeColor[post.type]}`}>{post.type}</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#4B3621]/40">{post.id}</span>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-semibold text-[#4B3621] leading-snug">{post.title}</p>
                    <p className="text-xs text-[#4B3621]/60 line-clamp-2 leading-relaxed">{post.desc}</p>
                    <p className="text-[10px] text-[#4B3621]/40 mt-1">{post.user} · {post.date}</p>
                  </div>

                  {post.status === "rejected" && post.reason && (
                    <div className="rounded-xl bg-red-100 px-3 py-2 text-xs text-red-700 italic">
                      "{post.reason}"
                    </div>
                  )}

                  {post.status === "pending" && (
                    <div className="flex gap-2 mt-auto">
                      <button onClick={() => approve(post.id)} className="flex-1 rounded-lg bg-[#4B3621] px-2 py-2 text-xs font-semibold text-white hover:bg-[#3a2918] transition">Approve</button>
                      <button onClick={() => setRejectTarget(post)} className="flex-1 rounded-lg border border-[#4B3621]/15 px-2 py-2 text-xs font-semibold text-[#4B3621] hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition">Reject</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Reject Modal */}
      {rejectTarget && (
        <WireModal title="Reject Rental Post" onClose={() => setRejectTarget(null)}>
          <p className="text-sm text-gray-600 mb-1">Post: <strong>{rejectTarget.title}</strong></p>
          <p className="text-xs text-gray-400 mb-3">By: {rejectTarget.user}</p>
          <WireTextarea placeholder="Explain why this post is being rejected and what the student should correct." rows={4} />
          <div className="flex gap-2 mt-4">
            <button onClick={() => setRejectTarget(null)} className="flex-1 rounded-xl border border-[#4B3621]/20 py-2.5 text-sm font-semibold text-[#4B3621] hover:bg-gray-50 transition">Cancel</button>
            <button onClick={() => reject(rejectTarget.id)} className="flex-1 rounded-xl bg-[#4B3621] py-2.5 text-sm font-semibold text-white hover:bg-[#3a2918] transition">Confirm Reject</button>
          </div>
        </WireModal>
      )}
    </AdminLayout>
  );
}
