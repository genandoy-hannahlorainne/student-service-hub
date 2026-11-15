import { useEffect, useState } from "react";
import { fetchTransactions, ServiceTransaction, updateTransactionStatus } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import {
  ProviderLayout, WireBtn, WireCard, WireBadge, WireStatCard,
  WireSectionTitle, WirePlaceholder, WireModal,
} from "../../components/WireframeUI";

const STATUS_FLOW = ["Accepted", "Processing", "Ready for Pickup", "Out for Delivery", "Completed"];
const STATUS_STEPS = ["Pending", ...STATUS_FLOW];
const STATUS_DETAILS: Record<string, { icon: string; label: string; help: string }> = {
  Pending: { icon: "bi-hourglass-split", label: "New order", help: "Review and accept this order" },
  Accepted: { icon: "bi-check-circle", label: "Accepted", help: "You accepted the order" },
  Processing: { icon: "bi-printer", label: "Printing", help: "The files are being printed" },
  "Ready for Pickup": { icon: "bi-box-seam", label: "Ready", help: "Student can collect the order" },
  "Out for Delivery": { icon: "bi-truck", label: "On the way", help: "Order is being delivered" },
  Completed: { icon: "bi-check2-all", label: "Completed", help: "Order has been released" },
};

type Order = {
  id: string;
  student: string;
  service: string;
  items: string;
  files: Array<{ name: string; size: number; copies: number; type?: string; content?: string }>;
  file: string;
  fileSize: string;
  filePages: string;
  totalCopies: number;
  createdAt: string;
  date: string;
  amount: string;
  payment: string;
  fulfillment: string;
  printColor: string;
  paperSize: string;
  sides: string;
  paperType: string;
  status: string;
};

function displayStatus(status: string) {
  if (status.toLowerCase() === "submitted" || status.toLowerCase() === "pending") return "Pending";
  return status;
}

function OrderStatusBar({ status }: { status: string }) {
  const currentIndex = STATUS_STEPS.indexOf(status);
  return (
    <div className="mt-3 border-t border-[#4B3621]/30 pt-3">
      <p className="text-xs font-bold uppercase tracking-wide text-[#4B3621]">What happens next</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-3">
        {STATUS_STEPS.map((step, index) => {
          const detail = STATUS_DETAILS[step];
          const active = status === step;
          return (
          <div key={step} className={`flex items-start gap-2 border p-2 ${active ? "border-[#4B3621] bg-[#E3C565]" : currentIndex > index ? "border-[#4B3621]/40 bg-[#4B3621]/5" : "border-[#4B3621]/20 bg-white"}`}>
            <i className={`bi ${detail.icon} mt-0.5 text-lg text-[#4B3621]`} aria-hidden="true" />
            <div>
              <p className={`text-xs text-[#4B3621] ${active ? "font-bold" : "font-semibold"}`}>{detail.label}</p>
              <p className="text-[10px] leading-tight text-[#4B3621]">{detail.help}</p>
            </div>
          </div>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-[#4B3621]">Current status: <strong>{STATUS_DETAILS[status]?.label ?? status}</strong></p>
    </div>
  );
}

function toOrder(transaction: ServiceTransaction): Order {
  const metadata = transaction.metadata ?? {};
  const files = Array.isArray(metadata.files)
    ? (metadata.files as Array<{ name?: string; size?: number; copies?: number; type?: string; content?: string }>).map((file) => ({
      name: file.name ?? "Uploaded file",
      size: file.size ?? 0,
      copies: file.copies ?? 1,
      type: file.type,
      content: file.content,
    }))
    : [];
  const firstFile = files[0] ?? { name: "Uploaded files", size: 0, copies: 1 };
  const totalCopies = files.reduce((total, file) => total + file.copies, 0);
  return {
    id: transaction.reference_code,
    student: transaction.student_name ?? "Student",
    service: transaction.service_type,
    items: `${files.length || 1} file${files.length === 1 ? "" : "s"} · ${totalCopies} cop${totalCopies === 1 ? "y" : "ies"}`,
    files,
    file: firstFile.name,
    fileSize: firstFile.size ? `${(firstFile.size / 1024 / 1024).toFixed(2)} MB` : "Size unavailable",
    filePages: `${files.length || 1} file${files.length === 1 ? "" : "s"}`,
    totalCopies,
    createdAt: transaction.created_at,
    date: new Date(transaction.created_at).toLocaleDateString(),
    amount: `₱${Number(transaction.amount).toFixed(2)}`,
    payment: transaction.payment_method ?? "Not specified",
    fulfillment: typeof metadata.fulfillment === "string" ? metadata.fulfillment : "Not specified",
    printColor: typeof metadata.print_color === "string" ? metadata.print_color : "Not specified",
    paperSize: typeof metadata.paper_size === "string" ? metadata.paper_size : "Not specified",
    sides: typeof metadata.sides === "string" ? metadata.sides : "Not specified",
    paperType: typeof metadata.paper_type === "string" ? metadata.paper_type : "Not specified",
    status: displayStatus(transaction.status),
  };
}

function downloadOrderFile(file: { name: string; content?: string }) {
  if (!file.content) return;
  const link = document.createElement("a");
  link.href = file.content;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

// Modal shown right after accepting an order.
function FileDownloadModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const [downloaded, setDownloaded] = useState(false);

  return (
    <WireModal title={`Order Accepted - ${order.id}`} onClose={onClose}>
      <div className="flex flex-col gap-4">
        {/* Confirmation banner */}
        <div className="bg-[#E3C565] border border-[#4B3621] p-3 text-center">
          <p className="text-sm font-semibold text-[#4B3621]"><i className="bi bi-check-circle mr-1" aria-hidden="true" />Order accepted successfully</p>
          <p className="text-xs text-[#4B3621] mt-0.5">Student <strong>{order.student}</strong> has been notified.</p>
        </div>

        {/* File details */}
        <div>
          <p className="text-xs font-semibold text-[#4B3621] uppercase tracking-wide mb-2">Student&apos;s Uploaded Files</p>
          <div className="flex flex-col gap-2">
            {(order.files.length > 0 ? order.files : [{ name: order.file, size: 0, copies: order.totalCopies }]).map((file, index) => (
              <div key={`${file.name}-${index}`} className="border border-[#4B3621] p-3 flex items-center gap-3 bg-[#E3C565]">
                <WirePlaceholder label="FILE" className="w-12 h-12 shrink-0 text-[10px]" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#4B3621] text-sm truncate">{file.name}</p>
                  <p className="text-xs text-[#4B3621]">
                    {file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Size unavailable"} · {file.copies} cop{file.copies === 1 ? "y" : "ies"}
                  </p>
                  <p className="text-xs text-[#4B3621] mt-0.5">Uploaded by {order.student}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Print specs reminder */}
        <div className="border border-dashed border-[#4B3621] p-3 bg-[#E3C565] text-xs text-[#4B3621]">
          <p className="font-semibold mb-1.5">Print Specifications:</p>
          <div className="flex flex-col gap-1">
            {[
              ["Files", `${order.files.length || 1} file${order.files.length === 1 ? "" : "s"}`],
              ["Total copies", `${order.totalCopies} cop${order.totalCopies === 1 ? "y" : "ies"}`],
              ["Paper Size", order.paperSize],
              ["Color", order.printColor],
              ["Sides", order.sides],
              ["Paper Type", order.paperType],
              ["Fulfillment", order.fulfillment],
              ["Payment", `${order.payment} - ${order.amount}`],
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

        {/* Download button - main CTA */}
        <div className="border-2 border-dashed border-gray-600 p-4 text-center bg-[#E3C565]">
          <p className="text-xs text-[#4B3621] mb-3">
            Download the student&apos;s file to begin printing. You <strong>must download</strong> the file before you can process this order.
          </p>
          <WireBtn
            size="lg"
            className={`w-full ${downloaded ? "bg-[#E3C565]0 border-gray-500" : "bg-[#000000] border-gray-900"}`}
          onClick={() => {
            order.files.forEach((file) => downloadOrderFile(file));
            setDownloaded(true);
          }}
          >
            {downloaded ? "File downloaded - Ready to Print" : "Download Student File"}
          </WireBtn>
          {downloaded && (
            <p className="text-xs text-[#4B3621] mt-2">
              File saved. You can download the file again from the order details anytime.
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
    <WireModal title={`Update Order - ${order.id}`} onClose={onClose}>
      <div className="mb-3 border border-[#4B3621] bg-[#E3C565] p-3 text-sm text-[#4B3621]">
        <p><strong>Student:</strong> {order.student}</p>
        <p><strong>Order:</strong> {order.files.length || 1} file{order.files.length === 1 ? "" : "s"} · {order.totalCopies} cop{order.totalCopies === 1 ? "y" : "ies"}</p>
        <p><strong>Fulfillment:</strong> {order.fulfillment}</p>
        <p><strong>Total:</strong> {order.amount}</p>
      </div>

      {/* File download option for active orders */}
      <div className="border border-[#4B3621] p-3 bg-[#E3C565] mb-4">
        <p className="text-xs font-semibold text-[#4B3621] uppercase tracking-wide mb-2">Files to print</p>
        <div className="flex flex-col gap-2">
          {(order.files.length > 0 ? order.files : [{ name: order.file, size: 0, copies: order.totalCopies }]).map((file, index) => (
            <div key={`${file.name}-${index}`} className="flex items-center gap-3">
              <WirePlaceholder label="FILE" className="w-9 h-9 shrink-0 text-[9px]" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#4B3621] font-medium truncate">{file.name}</p>
                <p className="text-xs text-[#4B3621]">{file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Size unavailable"} · {file.copies} cop{file.copies === 1 ? "y" : "ies"}</p>
              </div>
            </div>
          ))}
        </div>
        <WireBtn
          size="sm"
          variant="outline"
          className="mt-3"
          onClick={() => order.files.forEach((file) => downloadOrderFile(file))}
          disabled={!order.files.some((file) => file.content)}
        >
          <i className="bi bi-download mr-1" aria-hidden="true" />Download Files
        </WireBtn>
      </div>

      <div className="mb-2">
        <p className="text-xs font-semibold text-[#4B3621] uppercase tracking-wide">Choose the next step</p>
        <p className="mt-1 text-xs text-[#4B3621]">Select only the next step after the current status.</p>
      </div>
      <div className="flex flex-col gap-2 mb-4">
        {STATUS_FLOW.map((s, index) => {
          const currentIndex = STATUS_FLOW.indexOf(order.status);
          const isCurrent = order.status === s;
          const isNext = index === currentIndex + 1;
          const detail = STATUS_DETAILS[s];
          return (
          <button
            key={s}
            type="button"
            disabled={!isNext}
            onClick={() => { onUpdate(order.id, s); onClose(); }}
            className={`flex items-center gap-3 border px-3 py-3 text-left text-sm ${
              isCurrent
                ? "border-[#4B3621] bg-[#4B3621] text-white"
                : isNext
                ? "border-[#4B3621] bg-white font-semibold text-[#4B3621] hover:bg-[#E3C565]"
                : "cursor-not-allowed border-[#4B3621]/20 bg-[#4B3621]/5 text-[#4B3621]/50"
            }`}
          >
            <i className={`bi ${detail.icon} text-lg`} aria-hidden="true" />
            <span className="flex-1">
              <span className="block">{detail.label}</span>
              <span className={`block text-xs ${isCurrent ? "text-white/80" : "text-[#4B3621]/70"}`}>
                {isCurrent ? "Current status" : isNext ? "Click to update" : "Not available yet"}
              </span>
            </span>
            {isCurrent && <i className="bi bi-check-circle-fill" aria-label="Current status" />}
            {isNext && <i className="bi bi-arrow-right-circle" aria-label="Next status" />}
          </button>
          );
        })}
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

  const acceptOrder = async (id: string) => {
    const order = orders.find(o => o.id === id);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "Accepted" } : o));
    if (order) {
      try {
        await updateTransactionStatus(id, "Accepted");
        setFileModal({ ...order, status: "Accepted" });
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : "Could not update the order.");
      }
    }
  };

  const rejectOrder = async (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "Rejected" } : o));
    try {
      await updateTransactionStatus(id, "Rejected");
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Could not update the order.");
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    try {
      await updateTransactionStatus(id, newStatus);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Could not update the order.");
    }
  };

  const pending = orders.filter(o => o.status === "Pending");
  const active = orders.filter(o => !["Pending", "Completed", "Rejected"].includes(o.status));

  return (
    <ProviderLayout active="provider-dashboard" navigate={navigate}>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-xl font-bold text-[#4B3621]">Provider Dashboard</h1>
            <p className="text-sm text-[#4B3621] mt-0.5">{providerRecord?.business_name ?? "Service Provider"} — UniServe Collaborating Provider</p>
          </div>
          <WireBadge variant="success"><i className="bi bi-circle-fill mr-1 text-[8px]" aria-hidden="true" />Active</WireBadge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <WireStatCard label="New Orders" value={pending.length} />
          <WireStatCard label="Active Orders" value={active.length} />
          <WireStatCard label="Ready / Out" value={orders.filter(o => ["Ready for Pickup","Out for Delivery"].includes(o.status)).length} />
          <WireStatCard label="Completed (month)" value={orders.filter((order) => order.status === "Completed" && new Date(order.createdAt).getMonth() === new Date().getMonth() && new Date(order.createdAt).getFullYear() === new Date().getFullYear()).length} />
        </div>

        {/* New / Pending Orders */}
        <section>
          <WireSectionTitle>New Orders - Awaiting Response</WireSectionTitle>
          {loadError && <p role="alert" className="mb-3 border border-[#4B3621] bg-[#E3C565] p-3 text-sm text-[#4B3621]">{loadError}</p>}
          {pending.length === 0 ? (
            <p className="text-sm text-[#4B3621] py-6 text-center border border-dashed border-[#4B3621]">No pending orders.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {pending.map((order) => (
                <WireCard key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex gap-3 min-w-0">
                    <WirePlaceholder label="FILE" className="w-10 h-10 shrink-0 text-[9px]" />
                    <div className="min-w-0">
                      <span className="text-xs font-mono text-[#4B3621]">{order.id}</span>
                      <p className="font-semibold text-[#4B3621] text-sm">{order.student}</p>
                      <p className="text-xs text-[#4B3621] truncate">{order.items}</p>
                      <p className="text-xs text-[#4B3621]">{order.fulfillment} - {order.payment} - {order.amount}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap shrink-0">
                    {/* Accept opens the file download modal. */}
                    <WireBtn size="sm" onClick={() => void acceptOrder(order.id)}><i className="bi bi-check-circle mr-1" aria-hidden="true" />Accept &amp; Download File</WireBtn>
                    <WireBtn size="sm" variant="secondary" onClick={() => setRejectModal(order)}><i className="bi bi-x-circle mr-1" aria-hidden="true" />Reject</WireBtn>
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
                <WireCard key={order.id}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <span className="text-xs font-mono text-[#4B3621]">{order.id}</span>
                      <p className="font-semibold text-[#4B3621] text-sm">{order.student} — <span className="font-normal text-[#4B3621]">{order.items}</span></p>
                      <p className="text-xs text-[#4B3621]">{order.date} · {order.fulfillment} · {order.amount}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap shrink-0">
                      <WireBadge variant="active">{order.status}</WireBadge>
                      <WireBtn size="sm" variant="outline" onClick={() => setStatusModal(order)}>Update Status</WireBtn>
                    </div>
                  </div>
                  <OrderStatusBar status={order.status} />
                </WireCard>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* File Download Modal - shown immediately after accepting */}
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
