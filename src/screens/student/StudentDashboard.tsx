import { StudentLayout, WireBtn, WireCard, WirePlaceholder, WireStatCard, WireBadge } from "../../components/WireframeUI";

export default function StudentDashboard({ navigate }: { navigate: (s: string) => void }) {
  return (
    <StudentLayout active="student-dashboard" navigate={navigate}>
      <div className="flex flex-col gap-5">

        {/* ── Bento row 1: Welcome (wide) + quick stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Welcome banner — spans full width on mobile, 2 cols on sm+ */}
          <div className="col-span-2 sm:col-span-4 bg-[#4B3621] text-white rounded-none p-5 flex items-center justify-between gap-4 border border-[#4B3621]">
            <div>
              <h1 className="text-xl font-bold">Welcome back, Juan! 👋</h1>
              <p className="text-sm text-[#E3C565] mt-0.5">PUP Taguig · Student No. 2021-00001</p>
            </div>
            <WireBtn variant="secondary" onClick={() => navigate("browse-services")}>Browse Services</WireBtn>
          </div>

          {/* 4 stat cards */}
          <WireStatCard label="Active Orders" value="2" />
          <WireStatCard label="Completed" value="14" />
          <WireStatCard label="Rental Posts" value="1" />
          <WireStatCard label="Pending" value="3" />
        </div>

        {/* ── Bento row 2: Quick Access services ── */}
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Access</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: "Printing Services", desc: "Upload & print documents", screen: "printing-service", icon: "🖨" },
              { title: "School Supplies", desc: "Order academic materials", screen: "school-supplies", icon: "📚" },
              { title: "Resource Rental", desc: "Borrow or lend equipment", screen: "resource-rental", icon: "🔧" },
            ].map((s) => (
              <WireCard
                key={s.title}
                className="flex flex-col gap-2 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => navigate(s.screen)}
              >
                <WirePlaceholder label={s.icon} className="h-20 w-full text-2xl" />
                <h3 className="font-semibold text-gray-800 text-sm">{s.title}</h3>
                <p className="text-xs text-gray-500 flex-1">{s.desc}</p>
                <WireBtn variant="outline" size="sm" onClick={() => navigate(s.screen)}>
                  Go →
                </WireBtn>
              </WireCard>
            ))}
          </div>
        </div>

        {/* ── Bento row 3: Active orders (wide) + Rental post (narrow) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Active Orders — takes 2 of 3 cols */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Active Orders</h2>
              <WireBtn variant="ghost" size="sm" onClick={() => navigate("order-tracking")}>View All</WireBtn>
            </div>
            {[
              { id: "ORD-2025-001", service: "Printing Services", provider: "Speedy Print Shop", status: "Processing", date: "Dec 10, 2025" },
              { id: "ORD-2025-002", service: "School Supplies", provider: "University Organization Supplies", status: "Accepted", date: "Dec 11, 2025" },
            ].map((o) => (
              <WireCard key={o.id} className="flex items-center justify-between gap-3">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-xs font-mono text-gray-500">{o.id}</span>
                  <span className="font-medium text-gray-800 text-sm truncate">{o.service}</span>
                  <span className="text-xs text-gray-500 truncate">{o.provider} · {o.date}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <WireBadge variant="active">{o.status}</WireBadge>
                  <WireBtn size="sm" variant="outline" onClick={() => navigate("order-tracking")}>Track</WireBtn>
                </div>
              </WireCard>
            ))}
          </div>

          {/* My Rental Post — 1 col */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">My Rental Posts</h2>
              <div className="flex gap-1">
                <WireBtn variant="ghost" size="sm" onClick={() => navigate("rental-post-status")}>All</WireBtn>
                <WireBtn size="sm" onClick={() => navigate("create-rental-post")}>+ New</WireBtn>
              </div>
            </div>
            <WireCard className="flex flex-col gap-2 h-full">
              <p className="text-sm font-medium text-gray-800 leading-snug">
                Typewriter for Rent — Good Condition
              </p>
              <p className="text-xs text-gray-500">Posted Dec 8, 2025 · ₱50/day</p>
              <WireBadge variant="pending">Pending Review</WireBadge>
            </WireCard>
          </div>
        </div>

        {/* ── Bento row 4: Recent Transactions ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Recent Transactions</h2>
            <WireBtn variant="ghost" size="sm" onClick={() => navigate("transaction-receipt")}>View All</WireBtn>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: "TXN-2025-089", service: "Printing", amount: "₱85.00", date: "Dec 5, 2025", status: "Paid" },
              { id: "TXN-2025-074", service: "School Supplies", amount: "₱240.00", date: "Nov 28, 2025", status: "Paid" },
              { id: "TXN-2025-060", service: "Resource Rental", amount: "₱0.00", date: "Nov 20, 2025", status: "Free" },
            ].map((t) => (
              <WireCard key={t.id} className="flex flex-col gap-1">
                <span className="text-xs font-mono text-gray-400">{t.id}</span>
                <p className="text-sm text-gray-700 font-medium">{t.service}</p>
                <p className="text-xs text-gray-400">{t.date}</p>
                <div className="flex items-center justify-between mt-auto pt-2">
                  <span className="font-bold text-gray-800 text-base">{t.amount}</span>
                  <WireBadge variant="success">{t.status}</WireBadge>
                </div>
              </WireCard>
            ))}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
