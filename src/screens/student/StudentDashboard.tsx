import { StudentLayout, WireBtn, WireCard, WirePlaceholder, WireStatCard, WireBadge } from "../../components/WireframeUI";

export default function StudentDashboard({ navigate }: { navigate: (s: string) => void }) {
  return (
    <StudentLayout active="student-dashboard" navigate={navigate}>
      <div className="flex flex-col gap-5">
        {/* Welcome */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Welcome back, Juan! 👋</h1>
            <p className="text-sm text-gray-500 mt-0.5">PUP Taguig — Student No. 2021-00001</p>
          </div>
          <WireBtn onClick={() => navigate("browse-services")}>Browse Services</WireBtn>
        </div>

        {/* Quick service cards */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Access</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: "Printing Services", desc: "Upload & print documents", screen: "printing-service", icon: "🖨" },
              { title: "School Supplies", desc: "Order academic materials", screen: "school-supplies", icon: "📚" },
              { title: "Resource Rental", desc: "Borrow or lend equipment", screen: "resource-rental", icon: "🔧" },
            ].map((s) => (
              <WireCard key={s.title} className="flex flex-col gap-2 cursor-pointer hover:bg-gray-50" onClick={() => navigate(s.screen)}>
                <WirePlaceholder label={s.icon} className="h-16 w-full text-2xl" />
                <h3 className="font-semibold text-gray-800 text-sm">{s.title}</h3>
                <p className="text-xs text-gray-500">{s.desc}</p>
                <WireBtn variant="outline" size="sm" onClick={() => navigate(s.screen)}>Go →</WireBtn>
              </WireCard>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">My Activity</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <WireStatCard label="Active Orders" value="2" />
            <WireStatCard label="Completed" value="14" />
            <WireStatCard label="Rental Posts" value="1" />
            <WireStatCard label="Pending" value="3" />
          </div>
        </section>

        {/* Active Orders */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Active Orders</h2>
            <WireBtn variant="ghost" size="sm" onClick={() => navigate("order-tracking")}>View All</WireBtn>
          </div>
          <div className="flex flex-col gap-2">
            {[
              { id: "ORD-2025-001", service: "Printing Services", provider: "Speedy Print Shop", status: "Processing", date: "Dec 10, 2025" },
              { id: "ORD-2025-002", service: "School Supplies", provider: "PASOA Supplies", status: "Accepted", date: "Dec 11, 2025" },
            ].map((o) => (
              <WireCard key={o.id} className="flex items-center justify-between gap-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-mono text-gray-500">{o.id}</span>
                  <span className="font-medium text-gray-800 text-sm">{o.service}</span>
                  <span className="text-xs text-gray-500">{o.provider} · {o.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <WireBadge variant="active">{o.status}</WireBadge>
                  <WireBtn size="sm" variant="outline" onClick={() => navigate("order-tracking")}>Track</WireBtn>
                </div>
              </WireCard>
            ))}
          </div>
        </section>

        {/* Recent Transactions */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Recent Transactions</h2>
            <WireBtn variant="ghost" size="sm" onClick={() => navigate("transaction-receipt")}>View All</WireBtn>
          </div>
          <div className="flex flex-col gap-2">
            {[
              { id: "TXN-2025-089", service: "Printing", amount: "₱85.00", date: "Dec 5, 2025", status: "Paid" },
              { id: "TXN-2025-074", service: "School Supplies", amount: "₱240.00", date: "Nov 28, 2025", status: "Paid" },
              { id: "TXN-2025-060", service: "Resource Rental", amount: "₱0.00", date: "Nov 20, 2025", status: "Free" },
            ].map((t) => (
              <WireCard key={t.id} className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-gray-500">{t.id}</span>
                  <p className="text-sm text-gray-700">{t.service} · {t.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800 text-sm">{t.amount}</span>
                  <WireBadge variant="success">{t.status}</WireBadge>
                </div>
              </WireCard>
            ))}
          </div>
        </section>

        {/* Pending Rental Posts */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">My Rental Posts</h2>
            <div className="flex gap-2">
              <WireBtn variant="ghost" size="sm" onClick={() => navigate("rental-post-status")}>View All</WireBtn>
              <WireBtn size="sm" onClick={() => navigate("create-rental-post")}>+ Create Post</WireBtn>
            </div>
          </div>
          <WireCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">Typewriter for Rent — Good Condition</p>
                <p className="text-xs text-gray-500 mt-0.5">Posted Dec 8, 2025 · Category: Typewriter · ₱50/day</p>
              </div>
              <WireBadge variant="pending">Pending Review</WireBadge>
            </div>
          </WireCard>
        </section>
      </div>
    </StudentLayout>
  );
}
