import { useEffect, useState } from "react";
import { ProviderLayout, StudentLayout, WireBadge, WireBtn, WireCard } from "../components/WireframeUI";
import { fetchTransactions, ServiceTransaction } from "../lib/api";

const ORDER_STEPS = ["Pending", "Accepted", "Processing", "Ready for Pickup", "Out for Delivery", "Completed"];

function normalizedStatus(status: string) {
  return status.toLowerCase() === "submitted" ? "Pending" : status;
}

function getPrintFiles(transaction: ServiceTransaction) {
  const files = transaction.metadata?.files;
  return Array.isArray(files)
    ? files as Array<{ name?: string; size?: number; copies?: number }>
    : [];
}

function OrderStatusBar({ status }: { status: string }) {
  const currentStatus = normalizedStatus(status);
  const currentIndex = ORDER_STEPS.indexOf(currentStatus);
  const isRejected = currentStatus === "Rejected";
  return (
    <div className="mt-5 border border-[#4B3621] bg-[#E3C565] p-3">
      <p className="text-xs font-bold uppercase tracking-wide text-[#4B3621]">Order progress</p>
      {isRejected ? (
        <p className="mt-2 border border-[#4B3621] bg-white px-3 py-2 text-sm font-semibold text-[#4B3621]">Order rejected</p>
      ) : (
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {ORDER_STEPS.map((step, index) => {
            const completed = currentIndex >= index;
            const current = currentStatus === step;
            return (
              <div key={step} className="text-center">
                <div className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold ${
                  completed ? "border-[#4B3621] bg-[#4B3621] text-white" : "border-[#4B3621] bg-white text-[#4B3621]"
                }`}>
                  {completed ? "✓" : index + 1}
                </div>
                <p className={`mt-1 text-[10px] leading-tight text-[#4B3621] ${current ? "font-bold" : ""}`}>{step}</p>
              </div>
            );
          })}
        </div>
      )}
      <p className="mt-3 text-sm text-[#4B3621]">Current status: <strong>{currentStatus}</strong></p>
    </div>
  );
}

function PrintOrderSummary({ transaction }: { transaction: ServiceTransaction }) {
  const metadata = transaction.metadata ?? {};
  const files = getPrintFiles(transaction);
  const totalCopies = files.reduce((total, file) => total + (file.copies ?? 1), 0);
  const fulfillment = typeof metadata.fulfillment === "string" ? metadata.fulfillment : "Not specified";
  return (
    <div className="mt-5 border border-[#4B3621] p-3 text-sm text-[#4B3621]">
      <p className="text-xs font-bold uppercase tracking-wide">Order summary</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        <p><strong>Files:</strong> {files.length || 1} file{files.length === 1 ? "" : "s"}</p>
        <p><strong>Total copies:</strong> {totalCopies || 1}</p>
        <p><strong>Fulfillment:</strong> {fulfillment}</p>
        <p><strong>Payment:</strong> {transaction.payment_method || "Not specified"}</p>
      </div>
      <div className="mt-3 border-t border-[#4B3621] pt-2">
        <p className="font-semibold">Files to print</p>
        <div className="mt-1 flex flex-col gap-1">
          {(files.length > 0 ? files : [{ name: "Uploaded files", size: 0, copies: totalCopies || 1 }]).map((file, index) => (
            <div key={`${file.name}-${index}`} className="flex items-center justify-between gap-3">
              <span className="min-w-0 truncate">{file.name}</span>
              <span className="shrink-0">{file.copies ?? 1} cop{(file.copies ?? 1) === 1 ? "y" : "ies"}</span>
            </div>
          ))}
        </div>
      </div>
      {typeof metadata.notes === "string" && metadata.notes && (
        <p className="mt-3 border-t border-[#4B3621] pt-2"><strong>Notes:</strong> {metadata.notes}</p>
      )}
    </div>
  );
}

export default function TransactionReceipt({ navigate, portal = "student" }: { navigate: (s: string) => void; portal?: "student" | "provider" }) {
  const [transactions, setTransactions] = useState<ServiceTransaction[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadTransactions = () => fetchTransactions(portal === "provider" ? "provider" : undefined)
      .then(({ transactions: loaded }) => {
        if (mounted) {
          setTransactions(loaded);
          setLoadError(null);
        }
      })
      .catch((error: unknown) => {
        console.error("[TransactionReceipt] failed to load transactions:", error);
        if (mounted) setLoadError("Transactions are temporarily unavailable.");
      });
    void loadTransactions();
    const refreshTimer = window.setInterval(loadTransactions, 10000);
    return () => {
      mounted = false;
      window.clearInterval(refreshTimer);
    };
  }, [portal]);

  return (
    portal === "provider" ? (
    <ProviderLayout active="provider-transaction-history" navigate={navigate}>
      <TransactionContent transactions={transactions} loadError={loadError} navigate={navigate} portal={portal} />
    </ProviderLayout>
    ) : (
    <StudentLayout active="transaction-receipt" navigate={navigate}>
      <TransactionContent transactions={transactions} loadError={loadError} navigate={navigate} portal={portal} />
    </StudentLayout>
    )
  );
}

function TransactionContent({ transactions, loadError, navigate, portal }: { transactions: ServiceTransaction[]; loadError: string | null; navigate: (s: string) => void; portal: "student" | "provider" }) {
  return (
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E3C565]">{portal === "provider" ? "Provider activity" : "Student activity"}</p>
            <h1 className="mt-1 text-2xl font-bold text-[#4B3621]">{portal === "provider" ? "Transaction history" : "Transactions"}</h1>
            <p className="mt-1 text-sm text-[#4B3621]">{portal === "provider" ? "Orders assigned to your provider account." : "Your payment and service records from the database."}</p>
          </div>
          <WireBtn variant="outline" size="sm" onClick={() => navigate(portal === "provider" ? "provider-dashboard" : "order-tracking")}>Back to orders</WireBtn>
        </div>

        {loadError ? (
          <WireCard className="py-10 text-center"><p className="text-sm text-[#4B3621]">{loadError}</p></WireCard>
        ) : transactions.length === 0 ? (
          <WireCard className="py-10 text-center">
            <i className="bi bi-receipt text-3xl text-[#E3C565]" aria-hidden="true" />
            <h2 className="mt-3 font-semibold text-[#4B3621]">No transactions yet</h2>
            <p className="mt-1 text-sm text-[#4B3621]">Completed payments and service transactions will appear here.</p>
            <WireBtn className="mt-4" onClick={() => navigate(portal === "provider" ? "provider-dashboard" : "browse-services")}>{portal === "provider" ? "Back to dashboard" : "Browse services"}</WireBtn>
          </WireCard>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {transactions.map((transaction) => (
              <WireCard key={transaction.id} className="rounded-2xl border-0 shadow-sm ring-1 ring-[#4B3621]/10">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-[#4B3621]">{transaction.service_type}</p>
                    <h2 className="mt-1 font-bold text-[#4B3621]">{transaction.reference_code}</h2>
                  </div>
                  <WireBadge variant={["completed", "paid"].includes(transaction.status.toLowerCase()) ? "success" : "pending"}>
                    {normalizedStatus(transaction.status)}
                  </WireBadge>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-xs text-[#4B3621]">Amount</p><p className="font-semibold text-[#4B3621]">₱{Number(transaction.amount).toFixed(2)}</p></div>
                  <div><p className="text-xs text-[#4B3621]">Payment</p><p className="font-semibold text-[#4B3621]">{transaction.payment_method || "Not specified"}</p></div>
                  <div className="col-span-2"><p className="text-xs text-[#4B3621]">Date</p><p className="text-[#4B3621]">{new Date(transaction.created_at).toLocaleString()}</p></div>
                </div>
                <OrderStatusBar status={transaction.status} />
                <PrintOrderSummary transaction={transaction} />
              </WireCard>
            ))}
          </div>
        )}
      </div>
  );
}
