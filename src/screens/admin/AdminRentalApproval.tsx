import { useState } from "react";
import {
  AdminLayout, WireBtn, WireCard, WireBadge, WireSectionTitle, WireModal, WireTextarea,
} from "../../components/WireframeUI";

const ALL_POSTS = [
  { id: "POST-2025-014", user: "Juan dela Cruz", type: "Available for Rent", cat: "Typewriter", title: "Typewriter for Rent â€” Good Working Condition", desc: "Typewriter available for rent, ideal for academic projects. Keys are fully functional and recently serviced. Available on weekdays. â‚±50/day. Can arrange campus meetup.", date: "Dec 8, 2025", status: "Pending" },
  { id: "POST-2025-013", user: "Ana Reyes", type: "Looking For", cat: "Laptop", title: "Need laptop for thesis presentation â€” Dec 18", desc: "Looking for a laptop to borrow for one day for a thesis presentation. Windows preferred. Willing to leave collateral. Please message as soon as possible.", date: "Dec 9, 2025", status: "Pending" },
  { id: "POST-2025-012", user: "Pedro Santos", type: "Available for Rent", cat: "Calculator", title: "Scientific Calculator Casio FX-991 for Rent", desc: "Casio FX-991ES Plus scientific calculator. Good condition. â‚±30/day. Available after 5pm weekdays and all day weekends. Ideal for engineering and math subjects.", date: "Dec 10, 2025", status: "Pending" },
  { id: "POST-2025-008", user: "Maria Cruz", type: "Available for Rent", cat: "Books", title: "Thermodynamics Textbook â€” Cengel 8th Edition", desc: "Complete Thermodynamics: An Engineering Approach by Cengel, 8th edition. All pages present. â‚±20/day, please return on agreed date.", date: "Nov 20, 2025", status: "Approved" },
  { id: "POST-2025-006", user: "Roberto Flores", type: "Looking For", cat: "Projector", title: "Need projector for club presentation Dec 20", desc: "Student org needs projector for presentation. Will return same day. MOU from adviser available.", date: "Nov 10, 2025", status: "Rejected", reason: "Post description needs exact specifications â€” resolution, connectivity type required, and proof of club authorization must be attached." },
];

type TabType = "Pending" | "Approved" | "Rejected";

export default function AdminRentalApproval({ navigate }: { navigate: (s: string) => void }) {
  const [tab, setTab] = useState<TabType>("Pending");
  const [rejectTarget, setRejectTarget] = useState<typeof ALL_POSTS[0] | null>(null);
  const [posts, setPosts] = useState(ALL_POSTS);

  const filtered = posts.filter((p) => p.status === tab);

  const approve = (id: string) => setPosts(prev => prev.map(p => p.id === id ? { ...p, status: "Approved" } : p));
  const reject = (id: string) => { setPosts(prev => prev.map(p => p.id === id ? { ...p, status: "Rejected", reason: "Reviewed and rejected by administrator." } : p)); setRejectTarget(null); };

  return (
    <AdminLayout active="admin-rental-approval" navigate={navigate}>
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Rental Post Approval</h1>
          <p className="text-sm text-gray-500 mt-1">Review and moderate student rental post submissions</p>
        </div>

        {/* Tab counts */}
        <div className="flex border-b border-gray-300">
          {(["Pending", "Approved", "Rejected"] as TabType[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === t ? "border-gray-800 text-gray-800" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            >
              {t}
              <span className="ml-1.5 text-xs text-gray-400">({posts.filter(p => p.status === t).length})</span>
            </button>
          ))}
        </div>

        {/* Posts */}
        <div className="flex flex-col gap-3">
          {filtered.length === 0 && (
            <div className="py-10 text-center text-gray-400 text-sm border border-dashed border-gray-300">
              No {tab.toLowerCase()} posts.
            </div>
          )}
          {filtered.map((post) => (
            <WireCard key={post.id} className={post.status === "Rejected" ? "border-gray-500" : ""}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <span className="text-xs font-mono text-gray-400">{post.id}</span>
                    <WireBadge variant={post.type === "Available for Rent" ? "success" : "pending"}>{post.type}</WireBadge>
                    <WireBadge variant="default">{post.cat}</WireBadge>
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">{post.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed mb-2">{post.desc}</p>
                  <p className="text-xs text-gray-400">Submitted by <strong>{post.user}</strong> on {post.date}</p>
                </div>
                <div className="flex flex-col gap-2 items-end shrink-0">
                  <WireBadge variant={post.status === "Approved" ? "success" : post.status === "Rejected" ? "rejected" : "pending"}>
                    {post.status}
                  </WireBadge>
                  <WireBtn size="sm" variant="ghost">View</WireBtn>
                  {post.status === "Pending" && (
                    <>
                      <WireBtn size="sm" onClick={() => approve(post.id)}>âœ“ Approve</WireBtn>
                      <WireBtn size="sm" variant="secondary" onClick={() => setRejectTarget(post)}>âœ• Reject</WireBtn>
                    </>
                  )}
                </div>
              </div>

              {post.status === "Rejected" && post.reason && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Rejection Reason</p>
                  <div className="bg-gray-100 border border-gray-300 p-2 text-xs text-gray-700 italic">
                    "{post.reason}"
                  </div>
                </div>
              )}
            </WireCard>
          ))}
        </div>

        {/* Reject Modal */}
        {rejectTarget && (
          <WireModal title="Reject Rental Post" onClose={() => setRejectTarget(null)}>
            <p className="text-sm text-gray-700 mb-1">Post: <strong>{rejectTarget.title}</strong></p>
            <p className="text-sm text-gray-700 mb-3">By: {rejectTarget.user}</p>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Rejection Reason</p>
            <WireTextarea placeholder="Explain why this post is being rejected and what the student should correct before resubmitting." rows={4} />
            <div className="flex gap-2 mt-4">
              <WireBtn variant="secondary" className="flex-1" onClick={() => setRejectTarget(null)}>Cancel</WireBtn>
              <WireBtn className="flex-1" onClick={() => reject(rejectTarget.id)}>Confirm Reject</WireBtn>
            </div>
          </WireModal>
        )}
      </div>
    </AdminLayout>
  );
}
