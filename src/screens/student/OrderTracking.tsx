import { useState } from "react";
import {
  StudentLayout, WireBtn, WireCard, WireBadge, WireProgressTracker, WireSectionTitle,
} from "../../components/WireframeUI";

const ORDERS = [
  {
    id: "ORD-2025-001",
    service: "Printing Services",
    provider: "Speedy Print Shop",
    date: "Dec 10, 2025",
    items: "thesis_chapter1_final.pdf · 2 copies · B&W · Single-sided",
    payment: "GCash · ₱70.00",
    paymentStatus: "Pending",
    fulfillment: "Delivery — Room 201, PUP Taguig Main Building",
    step: 2,
    status: "Processing",
  },
  {
    id: "ORD-2025-002",
    service: "School Supplies",
    provider: "PASOA Supplies",
    date: "Dec 11, 2025",
    items: "Bond Paper (1 ream), Blue Ballpen ×5, Yellow Pad ×2",
    payment: "Cash · ₱240.00",
    paymentStatus: "Pending",
    fulfillment: "Pickup — PASOA Office, PUP Taguig",
    step: 1,
    status: "Accepted",
  },
];

const STEPS = ["Order Placed", "Accepted", "Processing", "Ready / Out for Delivery", "Completed"];

export default function OrderTracking({ navigate }: { navigate: (s: string) => void }) {
  const [selected, setSelected] = useState(0);
  const order = ORDERS[selected];

  return (
    <StudentLayout active="order-tracking" navigate={navigate}>
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Order Tracking</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor the status of your active and recent orders</p>
        </div>

        {/* Order selector */}
        <div className="flex flex-col gap-2">
          {ORDERS.map((o, i) => (
            <div
              key={o.id}
              onClick={() => setSelected(i)}
              className={`border p-3 cursor-pointer transition-colors flex items-center justify-between ${
                selected === i ? "border-gray-700 bg-gray-50" : "border-gray-300 hover:border-gray-500 bg-white"
              }`}
            >
              <div>
                <span className="text-xs font-mono text-gray-500">{o.id}</span>
                <p className="font-medium text-gray-800 text-sm">{o.service} — {o.provider}</p>
                <p className="text-xs text-gray-500">{o.date}</p>
              </div>
              <WireBadge variant="active">{o.status}</WireBadge>
            </div>
          ))}
        </div>

        {/* Selected order detail */}
        <WireCard>
          <WireSectionTitle>Order Details — {order.id}</WireSectionTitle>

          {/* Progress tracker */}
          <div className="py-6 px-2 border border-gray-200 bg-gray-50 mb-5">
            <WireProgressTracker steps={STEPS} current={order.step} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            {[
              ["Order Number", order.id],
              ["Service Provider", order.provider],
              ["Order Date", order.date],
              ["Current Status", order.status],
              ["Items / Details", order.items],
              ["Fulfillment", order.fulfillment],
              ["Payment", order.payment],
              ["Payment Status", order.paymentStatus],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</span>
                <span className="text-gray-800">{value}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex gap-2">
            <WireBtn variant="outline" onClick={() => navigate("transaction-receipt")}>View Receipt</WireBtn>
            <WireBtn variant="secondary">Contact Provider</WireBtn>
          </div>
        </WireCard>
      </div>
    </StudentLayout>
  );
}
