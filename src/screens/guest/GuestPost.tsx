import { useState } from "react";
import {
  WireBtn, WireCard, WirePlaceholder, WireBadge, WireSectionTitle,
  WireInput, WireSelect, WireTextarea, WireLabel,
} from "../../components/WireframeUI";

const GUEST_NAV_ITEMS = [
  { label: "Dashboard", icon: "bi-grid-1x2", screen: "guest-dashboard" },
  { label: "Browse Services", icon: "bi-grid", screen: "browse-services" },
  { label: "Post a Request", icon: "bi-envelope-plus", screen: "guest-post" },
  { label: "My Posts", icon: "bi-file-earmark-text", screen: "guest-my-posts" },
  { label: "Resource Hub", icon: "bi-box-seam", screen: "resource-rental" },
  { label: "Profile", icon: "bi-person", screen: "guest-dashboard" },
];

function GuestLayout({ children, navigate, active }: { children: React.ReactNode; navigate: (s: string) => void; active: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#4B3621] text-white px-3 py-2.5 flex items-center justify-between sticky top-0 z-40 border-b border-gray-500 h-14 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={() => setSidebarOpen(v => !v)} className="lg:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 border border-[#E3C565] hover:bg-[#E3C565] mr-1 shrink-0" aria-label="Toggle guest navigation">
            <span className="block w-5 h-0.5 bg-[#E3C565]" /><span className="block w-5 h-0.5 bg-[#E3C565]" /><span className="block w-5 h-0.5 bg-[#E3C565]" />
          </button>
          <WirePlaceholder label="LOGO" className="w-7 h-7 shrink-0" />
          <span className="font-bold text-sm hidden sm:block truncate">University Organization Student Services Hub</span>
          <span className="text-xs bg-[#E3C565] text-[#4B3621] px-2 py-0.5 ml-1 shrink-0">GUEST</span>
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
        <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-56 lg:w-48 shrink-0 bg-[#E3C565] border-r border-[#4B3621] flex flex-col py-3 overflow-y-auto transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
          <div className="lg:hidden flex items-center justify-between px-4 pb-3 mb-1 border-b border-[#4B3621]">
            <span className="text-xs font-bold text-[#4B3621] uppercase tracking-wide">Navigation</span>
            <button onClick={() => setSidebarOpen(false)} className="text-[#4B3621] hover:text-[#4B3621] text-xl leading-none">&times;</button>
          </div>
          {GUEST_NAV_ITEMS.map((item) => (
            <button key={item.label} onClick={() => { navigate(item.screen); setSidebarOpen(false); }} className={`flex items-center gap-3 text-left px-4 py-2.5 text-sm transition-colors ${active === item.screen ? "bg-[#E3C565] font-semibold text-[#000000] border-l-4 border-[#4B3621]" : "text-[#4B3621] hover:bg-[#E3C565]"}`}>
              <i className={`bi ${item.icon} w-4 text-center`} aria-hidden="true" /> {item.label}
            </button>
          ))}
          <div className="mt-4 mx-3 border border-dashed border-[#4B3621] p-2 text-xs text-[#4B3621]">
            <p className="font-semibold mb-1 text-[#4B3621]">Locked:</p>
            <p>âœ— Order Printing</p><p>âœ— Buy Supplies</p><p>âœ— Rental Posts</p>
          </div>
          <button onClick={() => navigate("landing")} className="text-left px-4 py-2.5 text-sm text-[#4B3621] hover:bg-[#E3C565] border-t border-[#4B3621] mt-auto">â— Logout</button>
        </aside>
        <main className="flex-1 overflow-y-auto bg-white p-4 lg:p-5">{children}</main>
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
          <h1 className="text-xl font-bold text-[#4B3621]">Post a Request</h1>
          <p className="text-sm text-[#4B3621] mt-1">Let students know what you need â€” they may be able to help</p>
        </div>

        <div className="border border-dashed border-[#4B3621] p-3 bg-white text-sm text-[#4B3621]">
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
              <div className="mt-2 border border-[#4B3621] px-4 py-3 bg-white flex items-center gap-2">
                <input type="radio" checked readOnly className="w-4 h-4" />
                <span className="text-sm text-[#4B3621] font-medium">Looking For / Need</span>
                <WireBadge variant="default">Guest limit</WireBadge>
              </div>
              <p className="text-xs text-[#4B3621] mt-1">Guests can only post requests. &ldquo;Available for Rent&rdquo; requires a PUPTian account.</p>
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
                  <label key={c} className="flex items-center gap-1.5 text-sm text-[#4B3621] cursor-pointer">
                    <input type="radio" name="contact" className="w-4 h-4" />
                    {c}
                  </label>
                ))}
              </div>
            </div>

            {/* Image upload (optional) */}
            <div>
              <WireLabel>Upload Reference Image (Optional)</WireLabel>
              <div className="border-2 border-dashed border-[#4B3621] p-5 text-center bg-white mt-2">
                <WirePlaceholder label="Click or drag image here" className="h-16 w-full mb-2" />
                <WireBtn variant="outline" size="sm">ðŸ“· Upload Image</WireBtn>
                <p className="text-xs text-[#4B3621] mt-2">Max 5MB Â· JPG or PNG</p>
              </div>
            </div>

          </div>
        </WireCard>

        <div className="border border-dashed border-[#4B3621] p-3 bg-white text-center">
          <p className="text-sm text-[#4B3621] font-medium">Your post will be reviewed by an Administrator before becoming publicly visible.</p>
          <p className="text-xs text-[#4B3621] mt-1">Review usually takes 1“2 business days.</p>
        </div>

        <div className="flex gap-3 justify-between">
          <WireBtn variant="outline" onClick={() => navigate("guest-dashboard")}>â† Back</WireBtn>
          <WireBtn size="lg" className="bg-[#4B3621] border-gray-700" onClick={() => navigate("guest-my-posts")}>
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
            <h1 className="text-xl font-bold text-[#4B3621]">My Posts</h1>
            <p className="text-sm text-[#4B3621] mt-1">Track the status of your guest request posts</p>
          </div>
          <WireBtn onClick={() => navigate("guest-post")}>+ New Post</WireBtn>
        </div>

        {/* Status guide */}
        <div className="flex flex-wrap gap-2 text-xs text-[#4B3621] border border-[#4B3621] p-3 bg-[#E3C565]">
          <span className="font-semibold text-[#4B3621] mr-1">Status:</span>
          <span className="border border-[#4B3621] px-2 py-0.5 bg-[#E3C565]">Pending â€” Awaiting admin review</span>
          <span className="border border-gray-500 px-2 py-0.5 bg-[#E3C565] font-semibold">Approved â€” Visible in resource hub</span>
          <span className="border border-gray-600 px-2 py-0.5 bg-gray-300">Rejected â€” See reason</span>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#4B3621] flex-wrap">
          {(["All", "Pending Admin Review", "Approved", "Rejected"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === t ? "border-gray-700 text-[#4B3621]" : "border-transparent text-[#4B3621] hover:text-[#4B3621]"}`}>
              {t}
              <span className="ml-1 text-xs text-[#4B3621]">({t === "All" ? GUEST_POSTS.length : GUEST_POSTS.filter(p => p.status === t).length})</span>
            </button>
          ))}
        </div>

        {/* Post list */}
        <div className="flex flex-col gap-3">
          {filtered.map((post) => (
            <WireCard key={post.id} className={post.status === "Rejected" ? "border-gray-500" : ""}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <span className="text-xs font-mono text-[#4B3621]">{post.id}</span>
                  <h3 className="font-semibold text-[#4B3621] text-sm mt-0.5">{post.title}</h3>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    <WireBadge variant="default">Looking For</WireBadge>
                    <WireBadge variant="default">{post.cat}</WireBadge>
                  </div>
                  <p className="text-xs text-[#4B3621] mt-1">Posted: {post.date}</p>
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
                <div className="mt-3 pt-3 border-t border-[#4B3621]">
                  <p className="text-xs font-semibold text-[#4B3621] uppercase mb-1">Rejection Reason</p>
                  <div className="bg-[#E3C565] border border-[#4B3621] p-2 text-xs text-[#4B3621] italic">
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
