import { useEffect, useState } from "react";
import { fetchTransactions, ServiceTransaction } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import {
  ProviderLayout, WireBtn, WireCard, WireBadge, WireStatCard,
  WireSectionTitle, WirePlaceholder, WireModal,
} from "../../components/WireframeUI";

const STATUS_FLOW = ["Accepted", "Processing", "Ready for Pickup", "Out for Delivery", "Completed"];

type Order = {
  id: string;
  student: string;
  service: string;
  items: string;
  file: string;
  fileSize: string;
  filePages: string;
  date: string;
  amount: string;
  payment: string;
  fulfillment: string;
  status: string;
};

function toOrder(transaction: ServiceTransaction): Order {
  const metadata = transaction.metadata ?? {};
  const files = Array.isArray(metadata.files) ? metadata.files as Array<{ name?: string; size?: number; copies?: number }> : [];
  const firstFile = files[0];
  const fileName = firstFile?.name ?? "Uploaded files";
  const copies = firstFile?.copies ?? 1;
  return {
    id: transaction.reference_code,
    student: transaction.student_name ?? "Student",
    service: transaction.service_type,
    items: `${fileName} · ${copies} copy/copies`,
    file: fileName,
    fileSize: firstFile?.size ? `${(firstFile.size / 1024 / 1024).toFixed(2)} MB` : "Size unavailable",
    filePages: `${files.length} file${files.length === 1 ? "" : "s"}`,
    date: new Date(transaction.created_at).toLocaleDateString(),
    amount: `₱${Number(transaction.amount).toFixed(2)}`,
    payment: transaction.payment_method ?? "Not specified",
    fulfillment: typeof metadata.fulfillment === "string" ? metadata.fulfillment : "Not specified",
    status: transaction.status,
  };
}

// Modal shown right after accepting an order â€” provider downloads the student's file
function FileDownloadModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const [downloaded, setDownloaded] = useState(false);

  return (
    <WireModal title={`Order Accepted â€” ${order.id}`} onClose={onClose}>
      <div className="flex flex-col gap-4">
        {/* Confirmation banner */}
        <div className="bg-[#E3C565] border border-[#4B3621] p-3 text-center">
          <p className="text-sm font-semibold text-[#4B3621]">âœ“ Order accepted successfully</p>
          <p className="text-xs text-[#4B3621] mt-0.5">Student <strong>{order.student}</strong> has been notified.</p>
        </div>

        {/* File details */}
        <div>
          <p className="text-xs font-semibold text-[#4B3621] uppercase tracking-wide mb-2">Student&apos;s Uploaded File</p>
          <div className="border border-[#4B3621] p-3 flex items-center gap-3 bg-[#E3C565]">
            <WirePlaceholder label="ðŸ“„" className="w-12 h-12 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#4B3621] text-sm truncate">{order.file}</p>
              <p className="text-xs text-[#4B3621]">{order.fileSize} Â· {order.filePages}</p>
              <p className="text-xs text-[#4B3621] mt-0.5">Uploaded by {order.student}</p>
            </div>
          </div>
        </div>

        {/* Print specs reminder */}
        <div className="border border-dashed border-[#4B3621] p-3 bg-[#E3C565] text-xs text-[#4B3621]">
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
                <span className="text-[#4B3621] w-24 shrink-0">{k}:</span>
                <span className="font-medium text-[#4B3621]">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Special instructions */}
        <div>
          <p className="text-xs font-semibold text-[#4B3621] uppercase tracking-wide mb-1">Special Instructions</p>
          <div className="border border-[#4B3621] bg-[#E3C565] p-2 text-sm text-[#4B3621] italic">
            &ldquo;Please staple each copy separately.&rdquo;
          </div>
        </div>

        {/* Download button â€” main CTA */}
        <div className="border-2 border-dashed border-gray-600 p-4 text-center bg-[#E3C565]">
          <p className="text-xs text-[#4B3621] mb-3">
            Download the student&apos;s file to begin printing. You <strong>must download</strong> the file before you can process this order.
          </p>
          <WireBtn
            size="lg"
            className={`w-full ${downloaded ? "bg-[#E3C565]0 border-gray-500" : "bg-[#000000] border-gray-900"}`}
            onClick={() => setDownloaded(true)}
          >
            {downloaded ? "âœ“ File Downloaded â€” Ready to Print" : "â¬‡ Download Student File"}
          </WireBtn>
          {downloaded && (
            <p className="text-xs text-[#4B3621] mt-2">
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
      <p className="text-sm text-[#4B3621] mb-1"><strong>Student:</strong> {order.student}</p>
      <p className="text-sm text-[#4B3621] mb-3"><strong>Items:</strong> {order.items}</p>

      {/* Re-download option for active orders */}
      <div className="border border-[#4B3621] p-3 bg-[#E3C565] mb-4 flex items-center gap-3">
        <WirePlaceholder label="ðŸ“„" className="w-9 h-9 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-[#4B3621] font-medium truncate">{order.file}</p>
          <p className="text-xs text-[#4B3621]">{order.fileSize} Â· {order.filePages}</p>
        </div>
        <WireBtn size="sm" variant="outline">â¬‡ Re-download</WireBtn>
      </div>

      <p className="text-xs font-semibold text-[#4B3621] uppercase tracking-wide mb-2">Set New Status</p>
      <div className="flex flex-col gap-2 mb-4">
        {STATUS_FLOW.map((s) => (
          <button
            key={s}
            onClick={() => { onUpdate(order.id, s); onClose(); }}
            className={`text-left px-3 py-2 border text-sm ${order.status === s ? "border-gray-700 bg-[#E3C565] font-semibold" : "border-[#4B3621] hover:bg-[#E3C565]"}`}
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
      <p className="text-sm text-[#4B3621] mb-3">
        Rejecting order <strong>{order.id}</strong> from {order.student}. Please provide a reason:
      </p>
      <textarea rows={3} placeholder="e.g. Currently unavailable, fully booked today." className="border border-[#4B3621] p-2 w-full text-sm mb-4 resize-none" />
      <div className="flex gap-2">
        <WireBtn className="flex-1" variant="secondary" onClick={onClose}>Cancel</WireBtn>
        <WireBtn className="flex-1" onClick={() => { onReject(order.id); onClose(); }}>Confirm Reject</WireBtn>
      </div>
    </WireModal>
  );
}

export default function ProviderDashboard({ navigate }: { navigate: (s: string) => void }) {
  const { providerRecord } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadError, setLoadError] = useState("");
  const [fileModal, setFileModal] = useState<Order | null>(null);    // shown after accepting
  const [statusModal, setStatusModal] = useState<Order | null>(null);
  const [rejectModal, setRejectModal] = useState<Order | null>(null);

  useEffect(() => {
    void fetchTransactions("provider")
      .then(({ transactions }) => setOrders(transactions.map(toOrder)))
      .catch((error) => setLoadError(error instanceof Error ? error.message : "Could not load provider orders."));
  }, []);

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
            <h1 className="text-xl font-bold text-[#4B3621]">Provider Dashboard</h1>
            <p className="text-sm text-[#4B3621] mt-0.5">{providerRecord?.business_name ?? "Service Provider"} — University Organization Collaborating Provider</p>
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
          {loadError && <p role="alert" className="mb-3 border border-[#4B3621] bg-[#E3C565] p-3 text-sm text-[#4B3621]">{loadError}</p>}
          {pending.length === 0 ? (
            <p className="text-sm text-[#4B3621] py-6 text-center border border-dashed border-[#4B3621]">No pending orders.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {pending.map((order) => (
                <WireCard key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex gap-3 min-w-0">
                    <WirePlaceholder label="ðŸ“„" className="w-10 h-10 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-xs font-mono text-[#4B3621]">{order.id}</span>
                      <p className="font-semibold text-[#4B3621] text-sm">{order.student}</p>
                      <p className="text-xs text-[#4B3621] truncate">{order.items}</p>
                      <p className="text-xs text-[#4B3621]">{order.fulfillment} Â· {order.payment} Â· {order.amount}</p>
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
            <p className="text-sm text-[#4B3621] py-4 text-center border border-dashed border-[#4B3621]">No active orders.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {active.map((order) => (
                <WireCard key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-xs font-mono text-[#4B3621]">{order.id}</span>
                    <p className="font-semibold text-[#4B3621] text-sm">{order.student} â€” <span className="font-normal text-[#4B3621]">{order.items}</span></p>
                    <p className="text-xs text-[#4B3621]">{order.date} Â· {order.fulfillment} Â· {order.amount}</p>
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
