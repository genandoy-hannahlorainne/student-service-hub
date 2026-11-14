import { useEffect, useState } from "react";
import {
  StudentLayout, WireBtn, WireCard, WireBadge, WireSectionTitle, WirePlaceholder,
} from "../../components/WireframeUI";
import { fetchRentalPosts, RentalPost } from "../../lib/api";

const statusVariants: Record<RentalPost["status"], "default" | "success" | "pending" | "rejected" | "active"> = {
  draft: "default",
  pending: "pending",
  approved: "success",
  rejected: "rejected",
};

const tabs: Array<"All" | RentalPost["status"]> = ["All", "draft", "pending", "approved", "rejected"];

export default function RentalPostStatus({ navigate }: { navigate: (s: string) => void }) {
  const [tab, setTab] = useState("All");
  const [posts, setPosts] = useState<RentalPost[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  useEffect(() => {
    void fetchRentalPosts()
      .then(({ posts: loadedPosts }) => setPosts(loadedPosts))
      .catch((error: unknown) => {
        console.error("[RentalPostStatus] failed to load posts:", error);
        setLoadError("Your rental posts are temporarily unavailable.");
      });
  }, []);
  const filtered = tab === "All" ? posts : posts.filter((p) => p.status === tab);

  return (
    <StudentLayout active="rental-post-status" navigate={navigate}>
      <div className="flex flex-col gap-5">

        {/* ── Header bento row: title + stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Title — full width on mobile, 2 cols on sm+ */}
          <div className="col-span-2 sm:col-span-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-[#4B3621]">My Rental Posts</h1>
              <p className="text-sm text-[#4B3621] mt-1">Track the approval status of your rental posts</p>
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
            const key = label === "Pending" ? "pending" : label.toLowerCase() as RentalPost["status"];
            const count = posts.filter((p) => p.status === key).length;
            return (
              <WireCard key={label} className="flex flex-col gap-1 cursor-pointer hover:bg-[#E3C565] transition-colors" onClick={() => setTab(key)}>
                <span className="text-2xl font-bold text-[#4B3621]">{count}</span>
                <WireBadge variant={variant}>{label}</WireBadge>
              </WireCard>
            );
          })}
        </div>

        {/* ── Status legend ── */}
        <div className="flex flex-wrap gap-2 text-xs text-[#4B3621] border border-[#4B3621] p-3 bg-[#E3C565]">
          <span className="font-semibold text-[#4B3621] mr-1">Status Guide:</span>
          <span className="border border-[#4B3621] px-2 py-0.5 bg-[#E3C565]">Draft — Saved, not submitted</span>
          <span className="border border-[#4B3621] px-2 py-0.5 italic">Pending — Awaiting admin review</span>
          <span className="border border-gray-500 px-2 py-0.5 bg-[#E3C565] font-semibold">Approved — Visible in hub</span>
          <span className="border border-gray-600 px-2 py-0.5 bg-gray-300">Rejected — See reason below</span>
        </div>

        {/* ── Tabs ── */}
        <div className="flex flex-wrap border-b border-[#4B3621]">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                tab === t ? "border-gray-800 text-[#4B3621]" : "border-transparent text-[#4B3621] hover:text-[#4B3621]"
              }`}
            >
              {t}
              <span className="ml-1.5 text-xs text-[#4B3621]">
                ({t === "All" ? posts.length : posts.filter((p) => p.status === t).length})
              </span>
            </button>
          ))}
        </div>

        {/* ── Bento post cards grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loadError ? (
            <WireCard className="md:col-span-2 text-center py-10"><p className="text-sm text-[#4B3621]">{loadError}</p></WireCard>
          ) : filtered.length === 0 ? (
            <WireCard className="md:col-span-2 text-center py-10">
              <p className="font-semibold text-[#4B3621]">No rental posts yet</p>
              <p className="mt-1 text-sm text-[#4B3621]">Posts you create will appear here with their review status.</p>
              <WireBtn className="mt-4" onClick={() => navigate("create-rental-post")}>Create a post</WireBtn>
            </WireCard>
          ) : filtered.map((post) => (
            <WireCard
              key={post.id}
              className={`flex flex-col gap-3 ${post.status === "rejected" ? "border-gray-500" : ""}`}
            >
              <div className="flex gap-3">
                <WirePlaceholder label="IMG" className="w-16 h-16 shrink-0" />
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <span className="text-xs font-mono text-[#4B3621]">{post.id.slice(0, 8).toUpperCase()}</span>
                  <h3 className="font-semibold text-[#4B3621] text-sm leading-snug">{post.title}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    <WireBadge variant="default">{post.type}</WireBadge>
                    <WireBadge variant="default">{post.category}</WireBadge>
                  </div>
                  <span className="text-xs text-[#4B3621]">Posted: {post.date}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 border-t border-[#4B3621] pt-3">
                <WireBadge variant={statusVariants[post.status]}>{post.status}</WireBadge>
                <div className="flex gap-2">
                  {post.status === "draft" && (
                    <WireBtn size="sm" variant="outline" onClick={() => navigate("create-rental-post")}>
                      Edit &amp; Submit
                    </WireBtn>
                  )}
                  {post.status === "approved" && (
                    <WireBtn size="sm" variant="ghost" onClick={() => navigate("resource-rental")}>
                      View in Hub →
                    </WireBtn>
                  )}
                  {post.status === "rejected" && (
                    <WireBtn size="sm" variant="outline" onClick={() => navigate("create-rental-post")}>
                      Edit &amp; Resubmit
                    </WireBtn>
                  )}
                </div>
              </div>

              {post.status === "rejected" && post.rejection_reason && (
                <div className="border-t border-[#4B3621] pt-3">
                  <p className="text-xs font-semibold text-[#4B3621] uppercase tracking-wide mb-1">Rejection Reason:</p>
                  <div className="bg-[#E3C565] border border-[#4B3621] p-3 text-sm text-[#4B3621] italic">
                  &ldquo;{post.rejection_reason}&rdquo;
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
