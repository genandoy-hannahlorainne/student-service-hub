import { useState } from "react";
import {
  ProviderLayout, WireBtn, WireCard, WireBadge, WireStatCard,
  WireSectionTitle, WirePlaceholder, WireModal,
} from "../../components/WireframeUI";

const ORDERS = [
  { id: "ORD-2025-001", student: "Juan dela Cruz", service: "Printing", items: "thesis_chapter1_final.pdf Â· 2Ã—B&W Short", file: "thesis_chapter1_final.pdf", fileSize: "3.2 MB", filePages: "12 pages", date: "Dec 10, 2025", amount: "â‚±70.00", payment: "GCash", fulfillment: "Delivery", status: "Pending" },
  { id: "ORD-2025-003", student: "Ana Reyes", service: "Printing", items: "resume.docx Â· 5Ã—Color Short", file: "resume.docx", fileSize: "0.8 MB", filePages: "2 pages", date: "Dec 11, 2025", amount: "â‚±95.00", payment: "Cash", fulfillment: "Pickup", status: "Pending" },
  { id: "ORD-2025-004", student: "Pedro Santos", service: "Printing", items: "project_report.pdf Â· 1Ã—Color Long", file: "project_report.pdf", fileSize: "5.1 MB", filePages: "20 pages", date: "Dec 11, 2025", amount: "â‚±55.00", payment: "Maya", fulfillment: "Delivery", status: "Processing" },
  { id: "ORD-2025-002", student: "Maria Cruz", service: "Printing", items: "assignment1.pdf Â· 3Ã—B&W Short", file: "assignment1.pdf", fileSize: "1.4 MB", filePages: "6 pages", date: "Dec 9, 2025", amount: "â‚±90.00", payment: "Cash", fulfillment: "Pickup", status: "Ready for Pickup" },
];

const STATUS_FLOW = ["Accepted", "Processing", "Ready for Pickup", "Out for Delivery", "Completed"];

type Order = typeof ORDERS[0];

// Modal shown right after accepting an order â€” provider downloads the student's file
function FileDownloadModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const [downloaded, setDownloaded] = useState(false);

  return (
    <WireModal title={`Order Accepted â€” ${order.id}`} onClose={onClose}>
      <div className="flex flex-col gap-4">
        {/* Confirmation banner */}
        <div className="bg-gray-100 border border-gray-300 p-3 text-center">
          <p className="text-sm font-semibold text-gray-800">âœ“ Order accepted successfully</p>
          <p className="text-xs text-gray-500 mt-0.5">Student <strong>{order.student}</strong> has been notified.</p>
        </div>

        {/* File details */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Student&apos;s Uploaded File</p>
          <div className="border border-gray-300 p-3 flex items-center gap-3 bg-white">
            <WirePlaceholder label="ðŸ“„" className="w-12 h-12 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 text-sm truncate">{order.file}</p>
              <p className="text-xs text-gray-500">{order.fileSize} Â· {order.filePages}</p>
              <p className="text-xs text-gray-400 mt-0.5">Uploaded by {order.student}</p>
            </div>
          </div>
        </div>

        {/* Print specs reminder */}
        <div className="border border-dashed border-gray-400 p-3 bg-gray-50 text-xs text-gray-700">
          <p className="font-semibold mb-1.5">Print Specifications:</p>
          <div className="flex flex-col gap-1">
            {[
              ["Copies", order.items.split("Â·")[1]?.trim() ?? "â€”"],
              ["Paper Size", "Short (8.5Ã—11)"],
              ["Color", "Black & White"],
              ["Sides", "Single-Sided"],
              ["Paper Type", "Standard (80gsm)"],
              ["Fulfillment", order.fulfillment],
              ["Payment", `${order.payment} Â· ${order.amount}`],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-2">
                <span className="text-gray-500 w-24 shrink-0">{k}:</span>
                <span className="font-medium text-gray-800">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Special instructions */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Special Instructions</p>
          <div className="border border-gray-200 bg-gray-50 p-2 text-sm text-gray-700 italic">
            &ldquo;Please staple each copy separately.&rdquo;
          </div>
        </div>

        {/* Download button â€” main CTA */}
        <div className="border-2 border-dashed border-gray-600 p-4 text-center bg-white">
          <p className="text-xs text-gray-500 mb-3">
            Download the student&apos;s file to begin printing. You <strong>must download</strong> the file before you can process this order.
          </p>
          <WireBtn
            size="lg"
            className={`w-full ${downloaded ? "bg-gray-500 border-gray-500" : "bg-gray-900 border-gray-900"}`}
            onClick={() => setDownloaded(true)}
          >
            {downloaded ? "âœ“ File Downloaded â€” Ready to Print" : "â¬‡ Download Student File"}
          </WireBtn>
          {downloaded && (
            <p className="text-xs text-gray-500 mt-2">
              File saved. You can also re-download it from the order details anytime.
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <WireBtn variant="secondary" className="flex-1" onClick={onClose}>Close</WireBtn>
          {downloaded && (
            <WireBtn className="flex-1" onClick={onClose}>Go to Active Orders</WireBtn>
          )}
        </div>
      </div>
    </WireModal>
  );
}

// Modal for updating status of an in-progress order
function StatusModal({ order, onUpdate, onClose }: { order: Order; onUpdate: (id: string, status: string) => void; onClose: () => void }) {
  return (
    <WireModal title={`Update Order â€” ${order.id}`} onClose={onClose}>
      <p className="text-sm text-gray-700 mb-1"><strong>Student:</strong> {order.student}</p>
      <p className="text-sm text-gray-700 mb-3"><strong>Items:</strong> {order.items}</p>

      {/* Re-download option for active orders */}
      <div className="border border-gray-200 p-3 bg-gray-50 mb-4 flex items-center gap-3">
        <WirePlaceholder label="ðŸ“„" className="w-9 h-9 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-700 font-medium truncate">{order.file}</p>
          <p className="text-xs text-gray-400">{order.fileSize} Â· {order.filePages}</p>
        </div>
        <WireBtn size="sm" variant="outline">â¬‡ Re-download</WireBtn>
      </div>

      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Set New Status</p>
      <div className="flex flex-col gap-2 mb-4">
        {STATUS_FLOW.map((s) => (
          <button
            key={s}
            onClick={() => { onUpdate(order.id, s); onClose(); }}
            className={`text-left px-3 py-2 border text-sm ${order.status === s ? "border-gray-700 bg-gray-100 font-semibold" : "border-gray-300 hover:bg-gray-50"}`}
          >
            {s}
          </button>
        ))}
      </div>
      <WireBtn variant="secondary" className="w-full" onClick={onClose}>Cancel</WireBtn>
    </WireModal>
  );
}

// Modal for rejecting an order
function RejectModal({ order, onReject, onClose }: { order: Order; onReject: (id: string) => void; onClose: () => void }) {
  return (
    <WireModal title="Reject Order" onClose={onClose}>
      <p className="text-sm text-gray-700 mb-3">
        Rejecting order <strong>{order.id}</strong> from {order.student}. Please provide a reason:
      </p>
      <textarea rows={3} placeholder="e.g. Currently unavailable, fully booked today." className="border border-gray-300 p-2 w-full text-sm mb-4 resize-none" />
      <div className="flex gap-2">
        <WireBtn className="flex-1" variant="secondary" onClick={onClose}>Cancel</WireBtn>
        <WireBtn className="flex-1" onClick={() => { onReject(order.id); onClose(); }}>Confirm Reject</WireBtn>
      </div>
    </WireModal>
  );
}

export default function ProviderDashboard({ navigate }: { navigate: (s: string) => void }) {
  const [orders, setOrders] = useState(ORDERS);
  const [fileModal, setFileModal] = useState<Order | null>(null);    // shown after accepting
  const [statusModal, setStatusModal] = useState<Order | null>(null);
  const [rejectModal, setRejectModal] = useState<Order | null>(null);

  const acceptOrder = (id: string) => {
    const order = orders.find(o => o.id === id);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "Accepted" } : o));
    if (order) setFileModal(order); // open file download modal immediately
  };

  const rejectOrder = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "Rejected" } : o));
  };

  const updateStatus = (id: string, newStatus: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const pending = orders.filter(o => o.status === "Pending");
  const active = orders.filter(o => !["Pending", "Completed", "Rejected"].includes(o.status));

  return (
    <ProviderLayout active="provider-dashboard" navigate={navigate}>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Provider Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">Speedy Print Shop â€” University Organization Collaborating Provider</p>
          </div>
          <WireBadge variant="success">â— Active</WireBadge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <WireStatCard label="New Orders" value={pending.length} />
          <WireStatCard label="Active Orders" value={active.length} />
          <WireStatCard label="Ready / Out" value={orders.filter(o => ["Ready for Pickup","Out for Delivery"].includes(o.status)).length} />
          <WireStatCard label="Completed (month)" value="28" />
        </div>

        {/* New / Pending Orders */}
        <section>
          <WireSectionTitle>New Orders â€” Awaiting Response</WireSectionTitle>
          {pending.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center border border-dashed border-gray-300">No pending orders.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {pending.map((order) => (
                <WireCard key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex gap-3 min-w-0">
                    <WirePlaceholder label="ðŸ“„" className="w-10 h-10 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-xs font-mono text-gray-400">{order.id}</span>
                      <p className="font-semibold text-gray-800 text-sm">{order.student}</p>
                      <p className="text-xs text-gray-500 truncate">{order.items}</p>
                      <p className="text-xs text-gray-500">{order.fulfillment} Â· {order.payment} Â· {order.amount}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap shrink-0">
                    {/* Accept â†’ triggers file download modal */}
                    <WireBtn size="sm" onClick={() => acceptOrder(order.id)}>âœ“ Accept &amp; Download File</WireBtn>
                    <WireBtn size="sm" variant="secondary" onClick={() => setRejectModal(order)}>âœ• Reject</WireBtn>
                  </div>
                </WireCard>
              ))}
            </div>
          )}
        </section>

        {/* Active Orders */}
        <section>
          <WireSectionTitle>Active Orders</WireSectionTitle>
          {active.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center border border-dashed border-gray-300">No active orders.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {active.map((order) => (
                <WireCard key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-xs font-mono text-gray-400">{order.id}</span>
                    <p className="font-semibold text-gray-800 text-sm">{order.student} â€” <span className="font-normal text-gray-600">{order.items}</span></p>
                    <p className="text-xs text-gray-500">{order.date} Â· {order.fulfillment} Â· {order.amount}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap shrink-0">
                    <WireBadge variant="active">{order.status}</WireBadge>
                    <WireBtn size="sm" variant="outline" onClick={() => setStatusModal(order)}>Update Status</WireBtn>
                  </div>
                </WireCard>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* File Download Modal â€” shown immediately after accepting */}
      {fileModal && <FileDownloadModal order={fileModal} onClose={() => setFileModal(null)} />}

      {/* Status Update Modal */}
      {statusModal && (
        <StatusModal
          order={statusModal}
          onUpdate={updateStatus}
          onClose={() => setStatusModal(null)}
        />
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <RejectModal
          order={rejectModal}
          onReject={rejectOrder}
          onClose={() => setRejectModal(null)}
        />
      )}
    </ProviderLayout>
  );
}
