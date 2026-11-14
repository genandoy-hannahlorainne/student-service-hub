import { useEffect, useState } from "react";
import { StudentLayout, WireBadge, WireBtn, WireCard } from "../components/WireframeUI";
import { fetchTransactions, ServiceTransaction } from "../lib/api";

export default function TransactionReceipt({ navigate }: { navigate: (s: string) => void }) {
  const [transactions, setTransactions] = useState<ServiceTransaction[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    void fetchTransactions()
      .then(({ transactions: loaded }) => setTransactions(loaded))
      .catch((error: unknown) => {
        console.error("[TransactionReceipt] failed to load transactions:", error);
        setLoadError("Transactions are temporarily unavailable.");
      });
  }, []);

  return (
    <StudentLayout active="transaction-receipt" navigate={navigate}>
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E3C565]">Student activity</p>
            <h1 className="mt-1 text-2xl font-bold text-[#4B3621]">Transactions</h1>
            <p className="mt-1 text-sm text-gray-500">Your payment and service records from the database.</p>
          </div>
          <WireBtn variant="outline" size="sm" onClick={() => navigate("order-tracking")}>Back to orders</WireBtn>
        </div>

        {loadError ? (
          <WireCard className="py-10 text-center"><p className="text-sm text-gray-600">{loadError}</p></WireCard>
        ) : transactions.length === 0 ? (
          <WireCard className="py-10 text-center">
            <i className="bi bi-receipt text-3xl text-[#E3C565]" aria-hidden="true" />
            <h2 className="mt-3 font-semibold text-gray-800">No transactions yet</h2>
            <p className="mt-1 text-sm text-gray-500">Completed payments and service transactions will appear here.</p>
            <WireBtn className="mt-4" onClick={() => navigate("browse-services")}>Browse services</WireBtn>
          </WireCard>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {transactions.map((transaction) => (
              <WireCard key={transaction.id} className="rounded-2xl border-0 shadow-sm ring-1 ring-[#4B3621]/10">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400">{transaction.service_type}</p>
                    <h2 className="mt-1 font-bold text-[#4B3621]">{transaction.reference_code}</h2>
                  </div>
                  <WireBadge variant={transaction.status.toLowerCase() === "paid" ? "success" : "pending"}>
                    {transaction.status}
                  </WireBadge>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-xs text-gray-400">Amount</p><p className="font-semibold text-gray-800">₱{Number(transaction.amount).toFixed(2)}</p></div>
                  <div><p className="text-xs text-gray-400">Payment</p><p className="font-semibold text-gray-800">{transaction.payment_method || "Not specified"}</p></div>
                  <div className="col-span-2"><p className="text-xs text-gray-400">Date</p><p className="text-gray-700">{new Date(transaction.created_at).toLocaleString()}</p></div>
                </div>
              </WireCard>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
