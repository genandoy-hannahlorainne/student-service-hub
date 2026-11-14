import { useEffect, useState } from "react";
import {
  StudentLayout, WireBtn, WireCard, WirePlaceholder, WireInput, WireBadge,
  WireModal, WireTextarea, WireRadioGroup, WireSectionTitle,
} from "../../components/WireframeUI";
import { fetchRentalPosts, RentalPost } from "../../lib/api";

const CATS = ["All", "Typewriter", "Calculator", "Laptop", "Projector", "Books", "School Equipment", "Project Materials", "Other"];

// ─── Contact / Request Modal ──────────────────────────────────────────────────

function ContactModal({ post, onClose }: { post: RentalPost; onClose: () => void }) {
  const isLookingFor = post.type === "Looking For";
  const [sent, setSent] = useState(false);

  return (
    <WireModal
      title={isLookingFor ? "Offer to Help" : "Request to Rent"}
      onClose={onClose}
    >
      {sent ? (
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="w-14 h-14 bg-gray-200 border-2 border-gray-600 flex items-center justify-center text-2xl">✓</div>
          <div>
            <p className="font-semibold text-gray-800">{isLookingFor ? "Offer sent!" : "Request sent!"}</p>
            <p className="text-sm text-gray-500 mt-1">
              {isLookingFor
                ? `${post.user} will be notified of your offer.`
                : `${post.user} will be notified of your rental request.`}
            </p>
          </div>
          <WireBtn className="w-full" onClick={onClose}>Close</WireBtn>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="border border-gray-200 p-3 bg-gray-50 flex gap-3">
            <WirePlaceholder label="IMG" className="w-12 h-12 shrink-0" />
            <div className="min-w-0">
              <div className="flex flex-wrap gap-1 mb-1">
                <WireBadge variant={isLookingFor ? "pending" : "success"}>{post.type}</WireBadge>
                <WireBadge variant="default">{post.category}</WireBadge>
              </div>
              <p className="font-semibold text-gray-800 text-sm leading-snug">{post.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Posted by <strong>{post.user}</strong> · {post.location} · {post.rental_rate}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Poster Contact</p>
            <div className="border border-dashed border-gray-300 p-2 bg-white text-sm text-gray-700">
              Contact details are shared after a verified request.
              <p className="text-xs text-gray-400 mt-0.5">Contact info is visible to verified PUPTians only.</p>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              {isLookingFor ? "When can you help?" : "Date(s) you need it"}
            </label>
            <input
              type="date"
              className="border border-gray-300 px-3 py-2 text-sm bg-white w-full focus:outline-none focus:border-gray-500"
            />
          </div>

          <WireInput label="Duration" placeholder='e.g. "2 days", "Dec 15 only", "This week"' />

          <WireTextarea
            label={isLookingFor ? "Your offer / message to poster" : "Your rental request message"}
            placeholder={
              isLookingFor
                ? `e.g. "Hi ${post.user}! I have a typewriter I can lend."`
                : `e.g. "Hi ${post.user}! I would like to rent your ${post.category}."`
            }
            rows={4}
          />

          <WireRadioGroup
            label="Preferred contact method"
            name="contact-pref"
            options={["Platform Message", "Facebook Messenger", "Phone / SMS"]}
          />

          <WireBtn size="lg" className="w-full" onClick={() => setSent(true)}>
            {isLookingFor ? "Send Offer to Help" : "Send Rental Request"}
          </WireBtn>

          <p className="text-xs text-gray-400 text-center">
            The poster will receive your message and can accept or decline your{" "}
            {isLookingFor ? "offer" : "request"}.
          </p>
        </div>
      )}
    </WireModal>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ResourceRental({ navigate }: { navigate: (s: string) => void }) {
  const [filter, setFilter] = useState<"all" | "available" | "looking">("all");
  const [category, setCategory] = useState("All");
  const [contactPost, setContactPost] = useState<RentalPost | null>(null);
  const [posts, setPosts] = useState<RentalPost[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    void fetchRentalPosts()
      .then(({ posts: loadedPosts }) => setPosts(loadedPosts))
      .catch((error: unknown) => {
        console.error("[ResourceRental] failed to load posts:", error);
        setLoadError("Rental posts are temporarily unavailable.");
      });
  }, []);

  const filtered = posts.filter((p) => {
    const typeMatch =
      filter === "all" ||
      (filter === "available" && p.type === "Available for Rent") ||
      (filter === "looking" && p.type === "Looking For");
    const catMatch = category === "All" || p.category === category;
    return typeMatch && catMatch;
  });

  return (
    <StudentLayout active="resource-rental" navigate={navigate}>
      <div className="flex flex-col gap-5">

        {/* ── Header banner ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Student Resource Hub</h1>
            <p className="text-sm text-gray-500 mt-1">Browse and post academic equipment for rent — student to student</p>
          </div>
          <div className="flex items-start sm:justify-end gap-2">
            <WireBtn onClick={() => navigate("create-rental-post")}>+ Create Post</WireBtn>
            <WireBtn variant="outline" onClick={() => navigate("rental-post-status")}>My Posts</WireBtn>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Type pills */}
          <div className="flex gap-2 flex-wrap">
            {(["all", "looking", "available"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-sm font-medium border capitalize transition-colors ${
                  filter === f ? "bg-gray-800 text-white border-gray-800" : "border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {f === "all" ? "All Posts" : f === "looking" ? "Looking For" : "Available for Rent"}
              </button>
            ))}
          </div>
          {/* Search */}
          <WireInput placeholder="Search posts, categories, items..." />
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-1.5">
          {CATS.slice(0, 5).map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-2.5 py-1.5 text-xs border transition-colors ${
                category === c ? "bg-gray-700 text-white border-gray-700" : "border-gray-300 text-gray-500 hover:bg-gray-50"
              }`}
            >
              {c}
            </button>
          ))}
          <button className="px-2.5 py-1.5 text-xs border border-gray-300 text-gray-500 hover:bg-gray-50">More ▾</button>
        </div>

        {/* ── Bento posts grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {loadError ? (
            <WireCard className="md:col-span-2 xl:col-span-3 text-center py-10">
              <p className="text-sm text-gray-600">{loadError}</p>
            </WireCard>
          ) : filtered.length === 0 ? (
            <WireCard className="md:col-span-2 xl:col-span-3 text-center py-10">
              <p className="font-semibold text-gray-800">No rental posts yet</p>
              <p className="mt-1 text-sm text-gray-500">Approved posts will appear here once students publish them.</p>
              <WireBtn className="mt-4" onClick={() => navigate("create-rental-post")}>Create the first post</WireBtn>
            </WireCard>
          ) : filtered.map((post) => (
            <WireCard key={post.title} className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <WirePlaceholder label="👤" className="w-8 h-8 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{post.user}</p>
                    <p className="text-xs text-gray-400">{post.date}</p>
                  </div>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  <WireBadge variant={post.type === "Available for Rent" ? "success" : "pending"}>{post.type}</WireBadge>
                  <WireBadge variant="default">{post.category}</WireBadge>
                </div>
              </div>

              <h3 className="font-semibold text-gray-800 text-sm leading-snug">{post.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 flex-1">{post.description}</p>

              <div className="flex flex-wrap gap-3 text-xs text-gray-500 border-t border-gray-100 pt-2">
                <span>📍 {post.location}</span>
                <span>💰 {post.rental_rate}</span>
              </div>

              <WireBtn
                size="sm"
                variant={post.type === "Available for Rent" ? "primary" : "outline"}
                className="w-full"
                onClick={() => setContactPost(post)}
              >
                {post.type === "Available for Rent" ? "Request to Rent" : "Offer to Help"}
              </WireBtn>
            </WireCard>
          ))}
        </div>
      </div>

      {contactPost && <ContactModal post={contactPost} onClose={() => setContactPost(null)} />}
    </StudentLayout>
  );
}
