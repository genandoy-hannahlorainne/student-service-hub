import { useState } from "react";
import {
  StudentLayout, WireBtn, WireCard, WirePlaceholder, WireInput, WireBadge,
  WireModal, WireTextarea, WireRadioGroup, WireSectionTitle,
} from "../../components/WireframeUI";

const POSTS = [
  {
    user: "Maria Santos",
    type: "Available for Rent",
    category: "Typewriter",
    title: "Vintage Typewriter — Good Working Condition",
    desc: "Typewriter available for rent, ideal for academic projects. Keys are fully functional and recently serviced. Available on weekdays. ₱50/day. Can arrange campus meetup.",
    date: "Dec 8, 2025",
    location: "PUP Taguig Campus Area",
    price: "₱50/day",
    status: "Available",
    contact: "09XX-XXX-XXXX",
  },
  {
    user: "Pedro Reyes",
    type: "Looking For",
    category: "Laptop",
    title: "Need laptop for thesis presentation — Dec 18",
    desc: "Looking for a laptop to borrow for 1 day for a thesis presentation. Must be working. Windows preferred but any OS is fine. Willing to leave collateral. Please message ASAP.",
    date: "Dec 9, 2025",
    location: "PUP Taguig Campus",
    price: "Open to negotiation",
    status: "Looking",
    contact: "09XX-XXX-XXXX",
  },
  {
    user: "Ana Cruz",
    type: "Available for Rent",
    category: "Calculator",
    title: "Scientific Calculator Casio FX-991 for Rent",
    desc: "Casio FX-991ES Plus scientific calculator for rent. Good condition. Can be rented by the day or hour. Perfect for engineering and math subjects. Available after 5pm weekdays and all day weekends.",
    date: "Dec 7, 2025",
    location: "Near PUP Taguig",
    price: "₱30/day",
    status: "Available",
    contact: "09XX-XXX-XXXX",
  },
  {
    user: "Jose Lim",
    type: "Looking For",
    category: "Projector",
    title: "Need projector for club presentation — Dec 20",
    desc: "Our student organization needs a projector for a presentation on December 20. We will return it the same day. We have a signed MOU from the club adviser to guarantee return.",
    date: "Dec 10, 2025",
    location: "PUP Taguig",
    price: "Negotiable",
    status: "Looking",
    contact: "09XX-XXX-XXXX",
  },
  {
    user: "Carla Tan",
    type: "Available for Rent",
    category: "Books",
    title: "Thermodynamics textbook — Cengel 8th Edition",
    desc: "Thermodynamics: An Engineering Approach by Cengel, 8th edition. Complete pages, no missing chapters. Good binding. Ideal for ME/ChE students. Available daily, please return on agreed date.",
    date: "Dec 6, 2025",
    location: "PUP Taguig Campus",
    price: "₱20/day",
    status: "Available",
    contact: "09XX-XXX-XXXX",
  },
  {
    user: "Roberto Flores",
    type: "Available for Rent",
    category: "School Equipment",
    title: "T-square and Drafting Board Set for Rent",
    desc: "Full drafting set including T-square (90cm), drafting board, and triangles. Used only once. Perfect for engineering drawing subjects. Lending per day or per week basis available.",
    date: "Dec 5, 2025",
    location: "Taguig City, near campus",
    price: "₱40/day",
    status: "Available",
    contact: "09XX-XXX-XXXX",
  },
];

type Post = typeof POSTS[0];

const CATS = ["All", "Typewriter", "Calculator", "Laptop", "Projector", "Books", "School Equipment", "Project Materials", "Other"];

// ─── Contact / Request Modal ──────────────────────────────────────────────────

function ContactModal({ post, onClose }: { post: Post; onClose: () => void }) {
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
                Posted by <strong>{post.user}</strong> · {post.location} · {post.price}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Poster Contact</p>
            <div className="border border-dashed border-gray-300 p-2 bg-white text-sm text-gray-700">
              📞 {post.contact} &nbsp;|&nbsp; 📧 student@pup.edu.ph
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
  const [contactPost, setContactPost] = useState<Post | null>(null);

  const filtered = POSTS.filter((p) => {
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
          {filtered.map((post) => (
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
              <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 flex-1">{post.desc}</p>

              <div className="flex flex-wrap gap-3 text-xs text-gray-500 border-t border-gray-100 pt-2">
                <span>📍 {post.location}</span>
                <span>💰 {post.price}</span>
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
