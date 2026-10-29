import { useState } from "react";
import { StudentLayout, WireBtn, WireCard, WireBadge, WireSectionTitle } from "../components/WireframeUI";

// Inject print CSS once
function usePrintStyles() {
  if (typeof document !== "undefined" && !document.getElementById("receipt-print-style")) {
    const style = document.createElement("style");
    style.id = "receipt-print-style";
    style.textContent = `
      @media print {
        body * { visibility: hidden !important; }
        #receipt-printable, #receipt-printable * { visibility: visible !important; }
        #receipt-printable { position: fixed; top: 0; left: 0; width: 100%; padding: 24px; background: white; }
        .no-print { display: none !important; }
      }
    `;
    document.head.appendChild(style);
  }
}

export default function TransactionReceipt({ navigate }: { navigate: (s: string) => void }) {
  const [downloaded, setDownloaded] = useState(false);
  usePrintStyles();

  const handleDownload = () => {
    setDownloaded(true);
    window.print();
  };

  return (
    <StudentLayout active="transaction-receipt" navigate={navigate}>
      <div className="flex flex-col gap-5">

        {/* ── Actions bar — hidden on print ── */}
        <div className="flex items-center justify-between flex-wrap gap-3 no-print">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Transaction Receipt</h1>
            <p className="text-sm text-gray-500 mt-1">Official record of completed transaction</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <WireBtn variant="outline" size="sm" onClick={() => navigate("order-tracking")}>← Back to Orders</WireBtn>
            <WireBtn size="sm" onClick={handleDownload}>
              🖨 {downloaded ? "Print / Save Again" : "Print / Save as PDF"}
            </WireBtn>
          </div>
        </div>

        {/* Download tip */}
        <div className="border border-dashed border-gray-400 p-3 bg-white text-xs text-gray-600 no-print">
          <strong>To save as PDF:</strong> Click &ldquo;Print / Save as PDF&rdquo; → in your browser&apos;s print
          dialog, choose <strong>Save as PDF</strong> as the destination → click Save.
        </div>

        {/* ── Printable receipt ── */}
        <div id="receipt-printable">

          {/* ── Bento top row: receipt header (wide) + transaction info (narrow) ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

            {/* Header */}
            <WireCard className="md:col-span-2 flex flex-col items-center justify-center text-center gap-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Official Receipt</p>
              <h2 className="text-lg font-bold text-gray-800">University Organization Student Services Hub</h2>
              <p className="text-xs text-gray-500">PUP Taguig Campus · Taguig City, Metro Manila</p>
              <p className="text-xs text-gray-400">uniserve@puptaguig.edu.ph</p>
            </WireCard>

            {/* Transaction summary */}
            <WireCard className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100 pb-2">Transaction</p>
              {[
                ["ID", "TXN-2025-089"],
                ["Order Ref", "ORD-2025-001"],
                ["Date", "Dec 10, 2025 · 2:45 PM"],
              ].map(([k, v]) => (
                <div key={k as string} className="flex flex-col gap-0.5">
                  <span className="text-xs text-gray-400 uppercase tracking-wide font-semibold">{k}</span>
                  <span className="text-sm font-mono text-gray-800">{v}</span>
                </div>
              ))}
              <div className="pt-1">
                <WireBadge variant="success">Paid</WireBadge>
              </div>
            </WireCard>
          </div>

          {/* ── Bento middle row: student + provider ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <WireCard>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Student</p>
              <p className="font-semibold text-gray-800 text-sm">Juan dela Cruz</p>
              <p className="text-xs text-gray-500">Student No. 2021-00001</p>
              <p className="text-xs text-gray-500">juan.delacruz@pup.edu.ph</p>
            </WireCard>
            <WireCard>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Service Provider</p>
              <p className="font-semibold text-gray-800 text-sm">Speedy Print Shop</p>
              <p className="text-xs text-gray-500">Western Bicutan, Taguig</p>
              <div className="mt-1">
                <WireBadge variant="success">University Organization-approved</WireBadge>
              </div>
            </WireCard>
          </div>

          {/* ── Bento bottom row: service details (wide) + cost summary (narrow) ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Service details */}
            <WireCard className="md:col-span-2">
              <SectionTitle>Service Details</SectionTitle>
              <div className="flex flex-col gap-0 text-sm">
                {[
                  ["Service Type", "Printing Services"],
                  ["File", "thesis_chapter1_final.pdf (12 pages)"],
                  ["Specifications", "2 copies · Black & White · Single-sided · Short"],
                  ["Paper Type", "Standard (80gsm)"],
                  ["Fulfillment", "Delivery — Room 201, PUP Taguig Main Building"],
                  ["Special Instructions", "Please staple each copy separately."],
                ].map(([k, v]) => (
                  <div key={k as string} className="flex gap-2 py-2 border-b border-gray-100 last:border-0">
                    <span className="text-gray-500 w-36 shrink-0 text-xs">{k}:</span>
                    <span className="text-gray-800 text-sm">{v}</span>
                  </div>
                ))}
              </div>
            </WireCard>

            {/* Cost summary */}
            <WireCard>
              <SectionTitle>Cost Summary</SectionTitle>
              <div className="flex flex-col gap-1.5 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Printing Fee:</span><span>₱40.00</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Delivery Fee:</span><span>₱30.00</span></div>
                <div className="border-t border-gray-300 mt-2 pt-2 flex justify-between font-bold text-gray-900 text-base">
                  <span>Total Paid:</span><span>₱70.00</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between text-sm">
                <span className="text-gray-600">Payment:</span>
                <span className="font-medium text-gray-800">GCash</span>
              </div>

              {/* Footer note */}
              <div className="mt-4 pt-3 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-400">
                  Automatically generated by University Organization Student Services Hub.
                </p>
                <p className="text-xs text-gray-300 mt-1 hidden print:block">
                  Printed · PUP Taguig · {new Date().toLocaleDateString()}
                </p>
              </div>
            </WireCard>
          </div>
        </div>

        {/* ── Bottom actions — hidden on print ── */}
        <div className="flex flex-wrap gap-3 no-print">
          <WireBtn variant="outline" onClick={() => navigate("order-tracking")}>← Back to Orders</WireBtn>
          <WireBtn onClick={handleDownload}>
            🖨 {downloaded ? "Print / Save Again" : "Print / Save as PDF"}
          </WireBtn>
          {downloaded && (
            <span className="text-xs text-gray-500 self-center">
              ✓ Print dialog opened. Choose &ldquo;Save as PDF&rdquo; in the destination.
            </span>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}

// Inline helper to avoid importing WireSectionTitle for a minor style variant
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-sm font-bold text-gray-700 mb-3 border-b border-gray-100 pb-1.5">{children}</h2>;
}
