import { useState } from "react";
import {
  AdminLayout, WireBtn, WireCard, WireBadge, WireTable, WireSectionTitle, WireModal, WireInput, WireSelect,
} from "../../components/WireframeUI";

const ORDERS = [
  { id: "ORD-2025-004", student: "Pedro Santos", provider: "Speedy Print Shop", service: "Printing", date: "Dec 11, 2025", amount: "₱55.00", payment: "Maya · Pending", fulfillment: "Delivery", status: "Processing" },
  { id: "ORD-2025-003", student: "Ana Reyes", provider: "Speedy Print Shop", service: "Printing", date: "Dec 11, 2025", amount: "₱95.00", payment: "Cash · COD", fulfillment: "Pickup", status: "Accepted" },
  { id: "ORD-2025-002", student: "Maria Cruz", provider: "PASOA Supplies", service: "Supplies", date: "Dec 11, 2025", amount: "₱240.00", payment: "Cash · COD", fulfillment: "Pickup", status: "Ready for Pickup" },
  { id: "ORD-2025-001", student: "Juan dela Cruz", provider: "Speedy Print Shop", service: "Printing", date: "Dec 10, 2025", amount: "₱70.00", payment: "GCash · Pending", fulfillment: "Delivery", status: "Processing" },
  { id: "ORD-2025-098", student: "Carla Tan", provider: "Taguig Print Center", service: "Printing", date: "Dec 8, 2025", amount: "₱120.00", payment: "GCash · Paid", fulfillment: "Delivery", status: "Completed" },
  { id: "ORD-2025-097", student: "Jose Lim", provider: "PASOA Supplies", service: "Supplies", date: "Dec 7, 2025", amount: "₱85.00", payment: "Cash · Paid", fulfillment: "Pickup", status: "Completed" },
];

const statusVariants: Record<string, "default" | "success" | "pending" | "rejected" | "active"> = {
  "Pending": "pending", "Accepted": "active", "Processing": "active",
  "Ready for Pickup": "active", "Out for Delivery": "active", "Completed": "success",
};

export default function AdminOrders({ navigate }: { navigate: (s: string) => void }) {
  const [viewOrder, setViewOrder] = useState<typeof ORDERS[0] | null>(null);
  const [statusFilter, setStatusFilter] = useState("All");

  const statuses = ["All", "Processing", "Accepted", "Ready for Pickup", "Out for Delivery", "Completed"];
  const filtered = statusFilter === "All" ? ORDERS : ORDERS.filter(o => o.status === statusFilter);

  return (
    <AdminLayout active="admin-orders" navigate={navigate}>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Order Management</h1>
            <p className="text-sm text-gray-500 mt-1">Monitor and manage all platform orders</p>
          </div>
          <WireInput placeholder="Search by order ID, student, provider..." className="w-64" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {statuses.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 text-xs border font-medium ${statusFilter === s ? "bg-gray-800 text-white border-gray-800" : "border-gray-300 text-gray-600 hover:bg-gray-50"}`}>
              {s}
            </button>
          ))}
        </div>

        {/* Table */}
        <WireCard className="p-0 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <WireSectionTitle>All Orders ({filtered.length})</WireSectionTitle>
          </div>
          <WireTable
            headers={["Order ID", "Student", "Provider", "Service", "Date", "Amount", "Payment", "Fulfillment", "Status", "Actions"]}
            rows={filtered.map((o) => [
              <span key={o.id} className="font-mono text-xs text-gray-600">{o.id}</span>,
              o.student,
              o.provider,
              o.service,
              o.date,
              <span key={o.amount} className="font-semibold">{o.amount}</span>,
              <span key={o.payment} className="text-xs">{o.payment}</span>,
              o.fulfillment,
              <WireBadge key={o.status} variant={statusVariants[o.status]}>{o.status}</WireBadge>,
              <WireBtn key="view" size="sm" variant="ghost" onClick={() => setViewOrder(o)}>View</WireBtn>,
            ])}
          />
        </WireCard>

        {/* Order Detail Modal */}
        {viewOrder && (
          <WireModal title={`Order Details — ${viewOrder.id}`} onClose={() => setViewOrder(null)}>
            <div className="flex flex-col gap-2 text-sm">
              {[
                ["Student", viewOrder.student],
                ["Provider", viewOrder.provider],
                ["Service", viewOrder.service],
                ["Order Date", viewOrder.date],
                ["Fulfillment", viewOrder.fulfillment],
                ["Payment", viewOrder.payment],
                ["Amount", viewOrder.amount],
                ["Status", viewOrder.status],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">{k}:</span>
                  <span className="font-medium text-gray-800">{v}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <WireBtn variant="secondary" className="flex-1" onClick={() => setViewOrder(null)}>Close</WireBtn>
              <WireBtn className="flex-1" onClick={() => navigate("transaction-receipt")}>View Receipt</WireBtn>
            </div>
          </WireModal>
        )}
      </div>
    </AdminLayout>
  );
}
