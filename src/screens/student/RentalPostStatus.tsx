import { useState } from "react";
import {
  StudentLayout, WireBtn, WireCard, WireBadge, WireSectionTitle, WirePlaceholder,
} from "../../components/WireframeUI";

const POSTS = [
  {
    id: "POST-2025-014",
    title: "Typewriter for Rent — Good Condition",
    type: "Available for Rent",
    category: "Typewriter",
    date: "Dec 8, 2025",
    status: "Pending Admin Review",
    reason: null,
  },
  {
    id: "POST-2025-009",
    title: "Scientific Calculator for Rent — Casio FX-991",
    type: "Available for Rent",
    category: "Calculator",
    date: "Nov 20, 2025",
    status: "Approved",
    reason: null,
  },
  {
    id: "POST-2025-006",
    title: "Need laptop for research project",
    type: "Looking For",
    category: "Laptop",
    date: "Nov 10, 2025",
    status: "Rejected",
    reason: "Post description is too vague. Please specify the exact dates you need the laptop, the purpose, and your contact preference. Resubmit with complete details.",
  },
  {
    id: "POST-2025-003",
    title: "T-square and drafting tools available",
    type: "Available for Rent",
    category: "School Equipment",
    date: "Oct 25, 2025",
    status: "Draft",
    reason: null,
  },
];

const statusVariants: Record<string, "default" | "success" | "pending" | "rejected" | "active"> = {
  "Draft": "default",
  "Pending Admin Review": "pending",
  "Approved": "success",
  "Rejected": "rejected",
};

const tabs = ["All", "Draft", "Pending Admin Review", "Approved", "Rejected"];

export default function RentalPostStatus({ navigate }: { navigate: (s: string) => void }) {
  const [tab, setTab] = useState("All");
  const filtered = tab === "All" ? POSTS : POSTS.filter((p) => p.status === tab);

  return (
    <StudentLayout active="rental-post-status" navigate={navigate}>
      <div className="flex flex-col gap-5">

        {/* ── Header bento row: title + stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Title — full width on mobile, 2 cols on sm+ */}
          <div className="col-span-2 sm:col-span-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800">My Rental Posts</h1>
              <p className="text-sm text-gray-500 mt-1">Track the approval status of your rental posts</p>
            </div>
            <WireBtn onClick={() => navigate("create-rental-post")}>+ Create Post</WireBtn>
          </div>

          {/* Status summary mini-cards */}
          {[
            { label: "Draft", variant: "default" as const },
            { label: "Pending", variant: "pending" as const },
            { label: "Approved", variant: "success" as const },
            { label: "Rejected", variant: "rejected" as const },
          ].map(({ label, variant }) => {
            const key = label === "Pending" ? "Pending Admin Review" : label;
            const count = POSTS.filter((p) => p.status === key).length;
            return (
              <WireCard key={label} className="flex flex-col gap-1 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setTab(key)}>
                <span className="text-2xl font-bold text-gray-800">{count}</span>
                <WireBadge variant={variant}>{label}</WireBadge>
              </WireCard>
            );
          })}
        </div>

        {/* ── Status legend ── */}
        <div className="flex flex-wrap gap-2 text-xs text-gray-500 border border-gray-200 p-3 bg-white">
          <span className="font-semibold text-gray-600 mr-1">Status Guide:</span>
          <span className="border border-gray-300 px-2 py-0.5 bg-gray-100">Draft — Saved, not submitted</span>
          <span className="border border-gray-400 px-2 py-0.5 italic">Pending — Awaiting admin review</span>
          <span className="border border-gray-500 px-2 py-0.5 bg-gray-200 font-semibold">Approved — Visible in hub</span>
          <span className="border border-gray-600 px-2 py-0.5 bg-gray-300">Rejected — See reason below</span>
        </div>

        {/* ── Tabs ── */}
        <div className="flex flex-wrap border-b border-gray-300">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                tab === t ? "border-gray-800 text-gray-800" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t}
              <span className="ml-1.5 text-xs text-gray-400">
                ({t === "All" ? POSTS.length : POSTS.filter((p) => p.status === t).length})
              </span>
            </button>
          ))}
        </div>

        {/* ── Bento post cards grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((post) => (
            <WireCard
              key={post.id}
              className={`flex flex-col gap-3 ${post.status === "Rejected" ? "border-gray-500" : ""}`}
            >
              <div className="flex gap-3">
                <WirePlaceholder label="IMG" className="w-16 h-16 shrink-0" />
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <span className="text-xs font-mono text-gray-400">{post.id}</span>
                  <h3 className="font-semibold text-gray-800 text-sm leading-snug">{post.title}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    <WireBadge variant="default">{post.type}</WireBadge>
                    <WireBadge variant="default">{post.category}</WireBadge>
                  </div>
                  <span className="text-xs text-gray-400">Posted: {post.date}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 border-t border-gray-100 pt-3">
                <WireBadge variant={statusVariants[post.status]}>{post.status}</WireBadge>
                <div className="flex gap-2">
                  {post.status === "Draft" && (
                    <WireBtn size="sm" variant="outline" onClick={() => navigate("create-rental-post")}>
                      Edit &amp; Submit
                    </WireBtn>
                  )}
                  {post.status === "Approved" && (
                    <WireBtn size="sm" variant="ghost" onClick={() => navigate("resource-rental")}>
                      View in Hub →
                    </WireBtn>
                  )}
                  {post.status === "Rejected" && (
                    <WireBtn size="sm" variant="outline" onClick={() => navigate("create-rental-post")}>
                      Edit &amp; Resubmit
                    </WireBtn>
                  )}
                </div>
              </div>

              {post.status === "Rejected" && post.reason && (
                <div className="border-t border-gray-200 pt-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Rejection Reason:</p>
                  <div className="bg-gray-100 border border-gray-300 p-3 text-sm text-gray-700 italic">
                    &ldquo;{post.reason}&rdquo;
                  </div>
                </div>
              )}
            </WireCard>
          ))}
        </div>
      </div>
    </StudentLayout>
  );
}
