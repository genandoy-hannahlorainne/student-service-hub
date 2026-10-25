import { useState } from "react";
import {
  WireBtn, WireCard, WirePlaceholder, WireBadge, WireSectionTitle,
  WireInput, WireSelect, WireTextarea, WireLabel,
} from "../../components/WireframeUI";

const GUEST_NAV_ITEMS = [
  { label: "Dashboard", icon: "âŠž", screen: "guest-dashboard" },
  { label: "Browse Services", icon: "â—«", screen: "browse-services" },
  { label: "Post a Request", icon: "âœ‰", screen: "guest-post" },
  { label: "My Posts", icon: "â—‰", screen: "guest-my-posts" },
  { label: "Resource Hub", icon: "â—ˆ", screen: "resource-rental" },
  { label: "Profile", icon: "â—Ž", screen: "guest-dashboard" },
];

function GuestLayout({ children, navigate, active }: { children: React.ReactNode; navigate: (s: string) => void; active: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-600 text-white px-3 py-2.5 flex items-center justify-between sticky top-0 z-40 border-b border-gray-500 h-14 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={() => setSidebarOpen(v => !v)} className="lg:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 border border-gray-500 hover:bg-gray-500 mr-1 shrink-0">
            <span className="block w-5 h-0.5 bg-white" /><span className="block w-5 h-0.5 bg-white" /><span className="block w-5 h-0.5 bg-white" />
          </button>
          <WirePlaceholder label="LOGO" className="w-7 h-7 shrink-0" />
          <span className="font-bold text-sm hidden sm:block truncate">University Organization Student Services Hub</span>
          <span className="text-xs bg-gray-500 px-2 py-0.5 ml-1 shrink-0">GUEST</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <WireBtn size="sm" variant="secondary" onClick={() => navigate("register")} className="hidden sm:inline-flex">Upgrade to PUPTian</WireBtn>
          <WirePlaceholder label="ðŸ‘¤" className="w-7 h-7 text-xs shrink-0" />
        </div>
      </header>
      <div className="flex h-[calc(100vh-56px)] overflow-hidden relative">
        {/* Backdrop */}
        {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
        {/* Sidebar */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-56 lg:w-48 shrink-0 bg-gray-100 border-r border-gray-300 flex flex-col py-3 overflow-y-auto transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
          <div className="lg:hidden flex items-center justify-between px-4 pb-3 mb-1 border-b border-gray-200">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Navigation</span>
            <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-gray-700 text-xl leading-none">&times;</button>
          </div>
          {GUEST_NAV_ITEMS.map((item) => (
            <button key={item.label} onClick={() => { navigate(item.screen); setSidebarOpen(false); }} className={`text-left px-4 py-2.5 text-sm transition-colors ${active === item.screen ? "bg-gray-300 font-semibold text-gray-900 border-l-4 border-gray-600" : "text-gray-700 hover:bg-gray-200"}`}>
              {item.icon} {item.label}
            </button>
          ))}
          <div className="mt-4 mx-3 border border-dashed border-gray-300 p-2 text-xs text-gray-400">
            <p className="font-semibold mb-1 text-gray-500">Locked:</p>
            <p>âœ— Order Printing</p><p>âœ— Buy Supplies</p><p>âœ— Rental Posts</p>
          </div>
          <button onClick={() => navigate("landing")} className="text-left px-4 py-2.5 text-sm text-gray-500 hover:bg-gray-200 border-t border-gray-300 mt-auto">â— Logout</button>
        </aside>
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-5">{children}</main>
      </div>
    </div>
  );
}

// â”€â”€â”€ Guest Post a Request â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function GuestPost({ navigate }: { navigate: (s: string) => void }) {
  return (
    <GuestLayout navigate={navigate} active="guest-post">
      <div className="flex flex-col gap-5 max-w-2xl">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Post a Request</h1>
          <p className="text-sm text-gray-500 mt-1">Let students know what you need â€” they may be able to help</p>
        </div>

        <div className="border border-dashed border-gray-400 p-3 bg-gray-50 text-sm text-gray-600">
          <strong>Guest Posting Rules:</strong>
          <ul className="mt-1 list-disc list-inside text-xs flex flex-col gap-0.5">
            <li>Posts must be for legitimate academic needs only</li>
            <li>All posts are reviewed by an administrator before becoming publicly visible</li>
            <li>Guests can only post <strong>Looking For / Need</strong> requests (not &ldquo;Available for Rent&rdquo;)</li>
            <li>Contact information will be visible to logged-in PUPTians who wish to help</li>
          </ul>
        </div>

        <WireCard>
          <WireSectionTitle>Request Details</WireSectionTitle>
          <div className="flex flex-col gap-4">

            {/* Post type â€” locked to Looking For */}
            <div>
              <WireLabel>Post Type</WireLabel>
              <div className="mt-2 border border-gray-300 px-4 py-3 bg-gray-100 flex items-center gap-2">
                <input type="radio" checked readOnly className="w-4 h-4" />
                <span className="text-sm text-gray-700 font-medium">Looking For / Need</span>
                <WireBadge variant="default">Guest limit</WireBadge>
              </div>
              <p className="text-xs text-gray-400 mt-1">Guests can only post requests. &ldquo;Available for Rent&rdquo; requires a PUPTian account.</p>
            </div>

            <WireSelect
              label="Category"
              options={["Select category...", "Typewriter", "Calculator", "Laptop", "Projector", "Books", "School Equipment", "Project Materials", "Other School Resources"]}
            />

            <WireInput label="Post Title" placeholder='e.g. "Need a typewriter for 2 days" or "Looking for engineering drawing set"' />

            <WireTextarea
              label="Description (40“70 words recommended)"
              placeholder="Describe what you need, when you need it, the purpose (e.g. academic requirement), any preferences, and how long you need it. Be clear and specific so other students can respond appropriately."
              rows={5}
            />

            <WireInput label="Location / Area" placeholder="e.g. PUP Taguig Campus area, Western Bicutan, Taguig" />

            <WireInput label="Budget / What you can offer" placeholder='e.g. "Willing to pay â‚±50/day" or "Can negotiate" or "Prefer free"' />

            <WireInput label="Date Needed" type="date" />

            <WireInput label="Duration Needed" placeholder='e.g. "2 days", "Dec 15“17", "This week only"' />

            {/* Contact preference */}
            <div>
              <WireLabel>Preferred Contact Method</WireLabel>
              <div className="flex gap-3 mt-2 flex-wrap">
                {["Platform Message", "Facebook Messenger", "Email", "Phone Call"].map((c) => (
                  <label key={c} className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer">
                    <input type="radio" name="contact" className="w-4 h-4" />
                    {c}
                  </label>
                ))}
              </div>
            </div>

            {/* Image upload (optional) */}
            <div>
              <WireLabel>Upload Reference Image (Optional)</WireLabel>
              <div className="border-2 border-dashed border-gray-300 p-5 text-center bg-gray-50 mt-2">
                <WirePlaceholder label="Click or drag image here" className="h-16 w-full mb-2" />
                <WireBtn variant="outline" size="sm">ðŸ“· Upload Image</WireBtn>
                <p className="text-xs text-gray-400 mt-2">Max 5MB Â· JPG or PNG</p>
              </div>
            </div>

          </div>
        </WireCard>

        <div className="border border-dashed border-gray-500 p-3 bg-gray-50 text-center">
          <p className="text-sm text-gray-700 font-medium">Your post will be reviewed by an Administrator before becoming publicly visible.</p>
          <p className="text-xs text-gray-400 mt-1">Review usually takes 1“2 business days.</p>
        </div>

        <div className="flex gap-3 justify-between">
          <WireBtn variant="outline" onClick={() => navigate("guest-dashboard")}>â† Back</WireBtn>
          <WireBtn size="lg" className="bg-gray-700 border-gray-700" onClick={() => navigate("guest-my-posts")}>
            Submit for Approval
          </WireBtn>
        </div>
      </div>
    </GuestLayout>
  );
}

// â”€â”€â”€ Guest My Posts (status tracking) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const GUEST_POSTS = [
  { id: "GPOST-2025-003", title: "Need a typewriter for 2 days â€” academic requirement", cat: "Typewriter", date: "Dec 10, 2025", status: "Pending Admin Review", reason: null },
  { id: "GPOST-2025-001", title: "Looking for engineering drawing set (T-square, triangles)", cat: "School Equipment", date: "Nov 25, 2025", status: "Approved", reason: null },
  { id: "GPOST-2025-000", title: "Need scientific calculator for 1 day", cat: "Calculator", date: "Nov 10, 2025", status: "Rejected", reason: "Post is too vague. Please specify the exact date, duration, and which subject/requirement this is for. Resubmit with complete details." },
];

const statusVariant: Record<string, "default" | "success" | "pending" | "rejected"> = {
  "Draft": "default",
  "Pending Admin Review": "pending",
  "Approved": "success",
  "Rejected": "rejected",
};

export function GuestMyPosts({ navigate }: { navigate: (s: string) => void }) {
  const [tab, setTab] = useState<"All" | "Pending Admin Review" | "Approved" | "Rejected">("All");
  const filtered = tab === "All" ? GUEST_POSTS : GUEST_POSTS.filter(p => p.status === tab);

  return (
    <GuestLayout navigate={navigate} active="guest-my-posts">
      <div className="flex flex-col gap-5 max-w-3xl">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-800">My Posts</h1>
            <p className="text-sm text-gray-500 mt-1">Track the status of your guest request posts</p>
          </div>
          <WireBtn onClick={() => navigate("guest-post")}>+ New Post</WireBtn>
        </div>

        {/* Status guide */}
        <div className="flex flex-wrap gap-2 text-xs text-gray-500 border border-gray-200 p-3 bg-white">
          <span className="font-semibold text-gray-600 mr-1">Status:</span>
          <span className="border border-gray-300 px-2 py-0.5 bg-gray-100">Pending â€” Awaiting admin review</span>
          <span className="border border-gray-500 px-2 py-0.5 bg-gray-200 font-semibold">Approved â€” Visible in resource hub</span>
          <span className="border border-gray-600 px-2 py-0.5 bg-gray-300">Rejected â€” See reason</span>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-300 flex-wrap">
          {(["All", "Pending Admin Review", "Approved", "Rejected"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === t ? "border-gray-700 text-gray-800" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
              {t}
              <span className="ml-1 text-xs text-gray-400">({t === "All" ? GUEST_POSTS.length : GUEST_POSTS.filter(p => p.status === t).length})</span>
            </button>
          ))}
        </div>

        {/* Post list */}
        <div className="flex flex-col gap-3">
          {filtered.map((post) => (
            <WireCard key={post.id} className={post.status === "Rejected" ? "border-gray-500" : ""}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <span className="text-xs font-mono text-gray-400">{post.id}</span>
                  <h3 className="font-semibold text-gray-800 text-sm mt-0.5">{post.title}</h3>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    <WireBadge variant="default">Looking For</WireBadge>
                    <WireBadge variant="default">{post.cat}</WireBadge>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Posted: {post.date}</p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <WireBadge variant={statusVariant[post.status]}>{post.status}</WireBadge>
                  {post.status === "Approved" && (
                    <WireBtn size="sm" variant="ghost" onClick={() => navigate("resource-rental")}>View in Hub â†’</WireBtn>
                  )}
                  {post.status === "Rejected" && (
                    <WireBtn size="sm" variant="outline" onClick={() => navigate("guest-post")}>Edit &amp; Resubmit</WireBtn>
                  )}
                </div>
              </div>

              {post.status === "Rejected" && post.reason && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Rejection Reason</p>
                  <div className="bg-gray-100 border border-gray-300 p-2 text-xs text-gray-700 italic">
                    &ldquo;{post.reason}&rdquo;
                  </div>
                </div>
              )}
            </WireCard>
          ))}
        </div>
      </div>
    </GuestLayout>
  );
}
