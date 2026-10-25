import {
  AdminLayout, WireStatCard, WireCard, WireBadge, WireBtn, WireSectionTitle,
} from "../../components/WireframeUI";

export default function AdminDashboard({ navigate }: { navigate: (s: string) => void }) {
  return (
    <AdminLayout active="admin-dashboard" navigate={navigate}>
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">PASOA Student Services — Internal Management Panel</p>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <WireStatCard label="Total Users" value="347" />
          <WireStatCard label="PUPTians" value="312" />
          <WireStatCard label="Service Providers" value="5" />
          <WireStatCard label="Pending Approvals" value="3" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <WireStatCard label="Pending Rental Posts" value="8" />
          <WireStatCard label="Active Orders" value="14" />
          <WireStatCard label="Completed Transactions" value="892" />
        </div>

        {/* Pending provider approvals */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <WireSectionTitle>Pending Provider Approvals</WireSectionTitle>
            <WireBtn size="sm" variant="outline" onClick={() => navigate("admin-providers")}>View All</WireBtn>
          </div>
          <div className="flex flex-col gap-2">
            {[
              { name: "Quick Copy Solutions", type: "Printing", date: "Dec 9, 2025" },
              { name: "Campus Supplies Co.", type: "School Supplies", date: "Dec 10, 2025" },
            ].map((p) => (
              <WireCard key={p.name} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.type} · Applied: {p.date}</p>
                </div>
                <div className="flex gap-2">
                  <WireBtn size="sm">Approve</WireBtn>
                  <WireBtn size="sm" variant="secondary">Reject</WireBtn>
                </div>
              </WireCard>
            ))}
          </div>
        </section>

        {/* Pending rental posts */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <WireSectionTitle>Pending Rental Post Reviews</WireSectionTitle>
            <WireBtn size="sm" variant="outline" onClick={() => navigate("admin-rental-approval")}>View All</WireBtn>
          </div>
          <div className="flex flex-col gap-2">
            {[
              { user: "Juan dela Cruz", title: "Typewriter for Rent — Good Condition", cat: "Typewriter", date: "Dec 8, 2025" },
              { user: "Ana Reyes", title: "Need a Laptop for thesis — Dec 18", cat: "Laptop", date: "Dec 9, 2025" },
              { user: "Pedro Santos", title: "Scientific Calculator available", cat: "Calculator", date: "Dec 10, 2025" },
            ].map((post) => (
              <WireCard key={post.title} className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{post.title}</p>
                  <p className="text-xs text-gray-500">{post.user} · {post.cat} · {post.date}</p>
                </div>
                <div className="flex gap-2">
                  <WireBtn size="sm">Approve</WireBtn>
                  <WireBtn size="sm" variant="secondary">Reject</WireBtn>
                </div>
              </WireCard>
            ))}
          </div>
        </section>

        {/* Recent orders */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <WireSectionTitle>Recent Orders</WireSectionTitle>
            <WireBtn size="sm" variant="outline" onClick={() => navigate("admin-orders")}>View All</WireBtn>
          </div>
          <div className="flex flex-col gap-2">
            {[
              { id: "ORD-2025-004", student: "Pedro Santos", provider: "Speedy Print Shop", amount: "₱55.00", status: "Processing" },
              { id: "ORD-2025-003", student: "Ana Reyes", provider: "Speedy Print Shop", amount: "₱95.00", status: "Accepted" },
              { id: "ORD-2025-002", student: "Maria Cruz", provider: "PASOA Supplies", amount: "₱240.00", status: "Ready for Pickup" },
            ].map((o) => (
              <WireCard key={o.id} className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-gray-400">{o.id}</span>
                  <p className="text-sm text-gray-700">{o.student} → {o.provider}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-800">{o.amount}</span>
                  <WireBadge variant="active">{o.status}</WireBadge>
                </div>
              </WireCard>
            ))}
          </div>
        </section>

        {/* Quick nav links */}
        <section>
          <WireSectionTitle>Quick Management Links</WireSectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Manage Users", screen: "admin-dashboard" },
              { label: "Manage Providers", screen: "admin-providers" },
              { label: "Rental Posts", screen: "admin-rental-approval" },
              { label: "Orders", screen: "admin-orders" },
              { label: "Transactions", screen: "transaction-receipt" },
              { label: "Website Content", screen: "admin-website" },
              { label: "Settings", screen: "admin-dashboard" },
            ].map((link) => (
              <WireBtn key={link.label} variant="outline" onClick={() => navigate(link.screen)} className="justify-center">{link.label}</WireBtn>
            ))}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
