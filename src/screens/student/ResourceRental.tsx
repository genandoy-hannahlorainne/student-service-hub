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
    title: "Vintage Typewriter â€” Good Working Condition",
    desc: "Typewriter available for rent, ideal for academic projects. Keys are fully functional and recently serviced. Available on weekdays. â‚±50/day. Can arrange campus meetup.",
    date: "Dec 8, 2025",
    location: "PUP Taguig Campus Area",
    price: "â‚±50/day",
    status: "Available",
    contact: "09XX-XXX-XXXX",
  },
  {
    user: "Pedro Reyes",
    type: "Looking For",
    category: "Laptop",
    title: "Need laptop for thesis presentation â€” Dec 18",
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
    price: "â‚±30/day",
    status: "Available",
    contact: "09XX-XXX-XXXX",
  },
  {
    user: "Jose Lim",
    type: "Looking For",
    category: "Projector",
    title: "Need projector for club presentation â€” Dec 20",
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
    title: "Thermodynamics textbook â€” Cengel 8th Edition",
    desc: "Thermodynamics: An Engineering Approach by Cengel, 8th edition. Complete pages, no missing chapters. Good binding. Ideal for ME/ChE students. Available daily, please return on agreed date.",
    date: "Dec 6, 2025",
    location: "PUP Taguig Campus",
    price: "â‚±20/day",
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
    price: "â‚±40/day",
    status: "Available",
    contact: "09XX-XXX-XXXX",
  },
];

type Post = typeof POSTS[0];

const CATS = ["All", "Typewriter", "Calculator", "Laptop", "Projector", "Books", "School Equipment", "Project Materials", "Other"];

// â”€â”€â”€ Contact / Request Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
          <div className="w-14 h-14 bg-gray-200 border-2 border-gray-600 flex items-center justify-center text-2xl">âœ“</div>
          <div>
            <p className="font-semibold text-gray-800">{isLookingFor ? "Offer sent!" : "Request sent!"}</p>
            <p className="text-sm text-gray-500 mt-1">
              {isLookingFor
                ? `${post.user} will be notified of your offer. Wait for their response.`
                : `${post.user} will be notified of your rental request. Wait for their response.`}
            </p>
          </div>
          <WireBtn className="w-full" onClick={onClose}>Close</WireBtn>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Post summary */}
          <div className="border border-gray-200 p-3 bg-gray-50 flex gap-3">
            <WirePlaceholder label="IMG" className="w-12 h-12 shrink-0" />
            <div className="min-w-0">
              <div className="flex flex-wrap gap-1 mb-1">
                <WireBadge variant={isLookingFor ? "pending" : "success"}>{post.type}</WireBadge>
                <WireBadge variant="default">{post.category}</WireBadge>
              </div>
              <p className="font-semibold text-gray-800 text-sm leading-snug">{post.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Posted by <strong>{post.user}</strong> Â· {post.location} Â· {post.price}
              </p>
            </div>
          </div>

          {/* Contact info (masked) */}
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Poster Contact</p>
            <div className="border border-dashed border-gray-300 p-2 bg-white text-sm text-gray-700">
              ðŸ“ž {post.contact} &nbsp;|&nbsp; ðŸ“§ student@pup.edu.ph
              <p className="text-xs text-gray-400 mt-0.5">Contact info is visible to verified PUPTians only.</p>
            </div>
          </div>

          {/* Date needed */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              {isLookingFor ? "When can you help?" : "Date(s) you need it"}
            </label>
            <input type="date" className="border border-gray-300 px-3 py-2 text-sm bg-white w-full focus:outline-none focus:border-gray-500" />
          </div>

          {/* Duration */}
          <WireInput label="Duration" placeholder='e.g. "2 days", "Dec 15 only", "This week"' />

          {/* Message */}
          <WireTextarea
            label={isLookingFor ? "Your offer / message to poster" : "Your rental request message"}
            placeholder={
              isLookingFor
                ? `e.g. "Hi ${post.user}! I have a typewriter I can lend. It's in good condition. When do you need it?"`
                : `e.g. "Hi ${post.user}! I'd like to rent your ${post.category}. Is it still available on Dec 18?"`
            }
            rows={4}
          />

          {/* Contact preference */}
          <WireRadioGroup
            label="Preferred contact method"
            name="contact-pref"
            options={["Platform Message", "Facebook Messenger", "Phone / SMS"]}
          />

          <WireBtn size="lg" className="w-full" onClick={() => setSent(true)}>
            {isLookingFor ? "Send Offer to Help" : "Send Rental Request"}
          </WireBtn>

          <p className="text-xs text-gray-400 text-center">
            The poster will receive your message and can accept or decline your {isLookingFor ? "offer" : "request"}.
          </p>
        </div>
      )}
    </WireModal>
  );
}

// â”€â”€â”€ Main Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Student Resource Hub</h1>
            <p className="text-sm text-gray-500 mt-1">Browse and post academic equipment for rent â€” student to student</p>
          </div>
          <WireBtn onClick={() => navigate("create-rental-post")}>+ Create Post</WireBtn>
        </div>

        {/* Type filter */}
        <div className="flex gap-2 flex-wrap">
          {(["all", "looking", "available"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium border capitalize ${filter === f ? "bg-gray-800 text-white border-gray-800" : "border-gray-300 text-gray-600 hover:bg-gray-50"}`}
            >
              {f === "all" ? "All Posts" : f === "looking" ? "Looking For" : "Available for Rent"}
            </button>
          ))}
        </div>

        {/* Search + Categories */}
        <div className="flex flex-wrap gap-3">
          <WireInput placeholder="Search posts, categories, items..." className="flex-1 min-w-48" />
          <div className="flex flex-wrap gap-1.5">
            {CATS.slice(0, 5).map((c) => (
              <button key={c} onClick={() => setCategory(c)} className={`px-2.5 py-1.5 text-xs border ${category === c ? "bg-gray-700 text-white border-gray-700" : "border-gray-300 text-gray-500 hover:bg-gray-50"}`}>{c}</button>
            ))}
            <button className="px-2.5 py-1.5 text-xs border border-gray-300 text-gray-500 hover:bg-gray-50">More â–¾</button>
          </div>
        </div>

        {/* Posts grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((post) => (
            <WireCard key={post.title} className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <WirePlaceholder label="ðŸ‘¤" className="w-8 h-8 shrink-0" />
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
              <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">{post.desc}</p>

              <div className="flex flex-wrap gap-3 text-xs text-gray-500 border-t border-gray-100 pt-2">
                <span>ðŸ“ {post.location}</span>
                <span>ðŸ’° {post.price}</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <WireBadge variant={post.status === "Available" ? "success" : "pending"}>{post.status}</WireBadge>
                {/* Opens the contact/request modal */}
                <WireBtn size="sm" variant="outline" onClick={() => setContactPost(post)}>
                  {post.type === "Available for Rent" ? "ðŸ“© Request to Rent" : "ðŸ™‹ I Can Help"}
                </WireBtn>
              </div>
            </WireCard>
          ))}
        </div>

        <p className="text-xs text-gray-400 text-center border-t border-gray-200 pt-3">
          All posts are reviewed and approved by an Administrator before becoming publicly visible.
        </p>
      </div>

      {/* Contact / Request Modal */}
      {contactPost && <ContactModal post={contactPost} onClose={() => setContactPost(null)} />}
    </StudentLayout>
  );
}
