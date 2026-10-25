import { useState } from "react";
import {
  WireBtn, WireCard, WirePlaceholder, WireBadge, WireSectionTitle,
} from "../../components/WireframeUI";

const GUEST_NAV = [
  { label: "Dashboard", icon: "⊞", screen: "guest-dashboard" },
  { label: "Browse Services", icon: "◫", screen: "browse-services" },
  { label: "Post a Request", icon: "✉", screen: "guest-post" },
  { label: "My Posts", icon: "◉", screen: "guest-my-posts" },
  { label: "Resource Hub", icon: "◈", screen: "resource-rental" },
  { label: "Profile", icon: "◎", screen: "guest-dashboard" },
];

function GuestSidebar({ active, navigate, open, onClose }: { active: string; navigate: (s: string) => void; open: boolean; onClose: () => void }) {
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={onClose} />}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-56 lg:w-48 shrink-0 bg-gray-100 border-r border-gray-300 flex flex-col py-3 overflow-y-auto transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="lg:hidden flex items-center justify-between px-4 pb-3 mb-1 border-b border-gray-200">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Navigation</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl leading-none">&times;</button>
        </div>
        {GUEST_NAV.map((item) => (
          <button
            key={item.label}
            onClick={() => { navigate(item.screen); onClose(); }}
            className={`text-left px-4 py-2.5 text-sm transition-colors ${active === item.screen ? "bg-gray-300 font-semibold text-gray-900 border-l-4 border-gray-600" : "text-gray-700 hover:bg-gray-200"}`}
          >
            {item.icon} {item.label}
          </button>
        ))}
        <div className="mt-4 mx-3 border border-dashed border-gray-300 p-2 text-xs text-gray-400">
          <p className="font-semibold mb-1 text-gray-500">Locked (PUPTian only):</p>
          <p>✗ Order Printing</p>
          <p>✗ Buy Supplies</p>
          <p>✗ Create Rental Posts</p>
          <p>✗ Track Orders</p>
        </div>
        <button onClick={() => navigate("landing")} className="text-left px-4 py-2.5 text-sm text-gray-500 hover:bg-gray-200 border-t border-gray-300 mt-auto">
          ◁ Logout
        </button>
      </aside>
    </>
  );
}

export default function GuestDashboard({ navigate }: { navigate: (s: string) => void }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Guest Header */}
      <header className="bg-gray-600 text-white px-3 py-2.5 flex items-center justify-between sticky top-0 z-40 border-b border-gray-500 h-14 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          {/* Hamburger */}
          <button
            onClick={() => setSidebarOpen(v => !v)}
            className="lg:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 border border-gray-500 hover:bg-gray-500 mr-1 shrink-0"
          >
            <span className="block w-5 h-0.5 bg-white" />
            <span className="block w-5 h-0.5 bg-white" />
            <span className="block w-5 h-0.5 bg-white" />
          </button>
          <WirePlaceholder label="LOGO" className="w-7 h-7 shrink-0" />
          <span className="font-bold text-sm hidden sm:block truncate">PASOA Student Services</span>
          <span className="text-xs bg-gray-500 px-2 py-0.5 ml-1 shrink-0">GUEST</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <WireBtn size="sm" variant="secondary" onClick={() => navigate("register")} className="hidden sm:inline-flex">Upgrade to PUPTian</WireBtn>
          <WirePlaceholder label="👤" className="w-7 h-7 text-xs shrink-0" />
        </div>
      </header>

      <div className="flex h-[calc(100vh-56px)] overflow-hidden relative">
        <GuestSidebar active="guest-dashboard" navigate={navigate} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-5">
          <div className="flex flex-col gap-5 max-w-4xl">

            {/* Welcome + upgrade banner */}
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Welcome, Guest! 👋</h1>
                  <p className="text-sm text-gray-500 mt-0.5">You have limited access. Browse services or post a request.</p>
                </div>
                <WireBtn onClick={() => navigate("guest-post")} className="shrink-0">+ Post a Request</WireBtn>
              </div>

              {/* Upgrade CTA */}
              <div className="border-2 border-dashed border-gray-400 p-4 bg-white flex flex-col sm:flex-row items-start gap-3">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-sm">Are you a PUP Taguig student?</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Register as a <strong>PUPTian</strong> to unlock full access — order printing, purchase supplies,
                    create rental posts, and track your orders.
                  </p>
                </div>
                <WireBtn variant="outline" size="sm" onClick={() => navigate("register")} className="shrink-0">Upgrade to PUPTian →</WireBtn>
              </div>

              {/* Mobile upgrade shortcut */}
              <WireBtn variant="secondary" className="sm:hidden w-full" onClick={() => navigate("register")}>Upgrade to PUPTian Account</WireBtn>
            </div>

            {/* Available features */}
            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Available to You</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: "◫", title: "Browse Services", desc: "Explore printing, school supplies, and the resource rental hub", cta: "Browse Now", screen: "browse-services" },
                  { icon: "✉", title: "Post a Request", desc: "Post what you need — typewriter, calculator, books, etc. Students may respond.", cta: "Post a Request", screen: "guest-post" },
                  { icon: "◈", title: "Resource Hub", desc: "View student rental posts and browse available academic equipment.", cta: "View Hub", screen: "resource-rental" },
                ].map((item) => (
                  <WireCard key={item.title} className="flex flex-col gap-2">
                    <WirePlaceholder label={item.icon} className="h-12 w-full text-2xl" />
                    <h3 className="font-semibold text-gray-800 text-sm">{item.title}</h3>
                    <p className="text-xs text-gray-500 flex-1">{item.desc}</p>
                    <WireBtn size="sm" onClick={() => navigate(item.screen)}>{item.cta}</WireBtn>
                  </WireCard>
                ))}
              </div>
            </section>

            {/* Locked features */}
            <section>
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Requires PUPTian Account</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 opacity-60">
                {[
                  { icon: "🖨", title: "Order Printing", desc: "Upload and order documents from approved shops" },
                  { icon: "📦", title: "Purchase Supplies", desc: "Buy bond paper, folders, pens, and more" },
                  { icon: "📋", title: "Create Rental Posts", desc: "List your equipment for rent to other students" },
                ].map((item) => (
                  <WireCard key={item.title} className="flex flex-col gap-2 cursor-not-allowed">
                    <WirePlaceholder label={item.icon} className="h-12 w-full text-2xl bg-gray-100" />
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-semibold text-gray-600 text-sm">{item.title}</h3>
                      <WireBadge variant="rejected">Locked</WireBadge>
                    </div>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                    <div className="border border-dashed border-gray-300 py-1.5 text-center text-xs text-gray-400">PUPTian Only</div>
                  </WireCard>
                ))}
              </div>
            </section>

            {/* My recent posts */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <WireSectionTitle>My Recent Posts</WireSectionTitle>
                <WireBtn size="sm" variant="ghost" onClick={() => navigate("guest-my-posts")}>View All</WireBtn>
              </div>
              <WireCard>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Looking for a typewriter to rent for 2 days</p>
                    <p className="text-xs text-gray-500 mt-0.5">Posted Dec 10, 2025 · Category: Typewriter · PUP Taguig area</p>
                  </div>
                  <WireBadge variant="pending">Pending Review</WireBadge>
                </div>
              </WireCard>
              <p className="text-xs text-gray-400 mt-3 text-center">
                Guest posts are reviewed by an administrator before becoming publicly visible.
              </p>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}
