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
      <div className="flex flex-col gap-5 max-w-xl">
        {/* Actions — hidden on print */}
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
          <strong>To save as PDF:</strong> Click &ldquo;Print / Save as PDF&rdquo; → in your browser&apos;s print dialog, choose <strong>Save as PDF</strong> as the destination → click Save.
          The receipt will be formatted cleanly without the navigation and sidebar.
        </div>

        {/* ── Printable receipt ── */}
        <div id="receipt-printable">
          <WireCard>
            {/* Receipt Header */}
            <div className="text-center border-b-2 border-gray-200 pb-4 mb-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Official Receipt</p>
              <h2 className="text-lg font-bold text-gray-800">PASOA Student Services</h2>
              <p className="text-xs text-gray-500">PUP Taguig Campus · Taguig City, Metro Manila</p>
              <p className="text-xs text-gray-400 mt-1">pasoa@puptaguig.edu.ph</p>
            </div>

            {/* Transaction info */}
            <WireSectionTitle>Transaction Information</WireSectionTitle>
            <div className="flex flex-col gap-0 mb-5">
              {[
                ["Transaction ID", "TXN-2025-089"],
                ["Order Reference", "ORD-2025-001"],
                ["Transaction Date", "December 10, 2025 · 2:45 PM"],
                ["Payment Status", "__BADGE__"],
              ].map(([k, v]) => (
                <div key={k as string} className="flex justify-between py-2 border-b border-gray-100 text-sm">
                  <span className="text-gray-500">{k}:</span>
                  {v === "__BADGE__"
                    ? <WireBadge variant="success">Paid</WireBadge>
                    : <span className="font-medium text-gray-800 font-mono">{v}</span>}
                </div>
              ))}
            </div>

            {/* Parties */}
            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              <div className="border border-gray-200 p-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Student</p>
                <p className="font-semibold text-gray-800 text-sm">Juan dela Cruz</p>
                <p className="text-xs text-gray-500">Student No. 2021-00001</p>
                <p className="text-xs text-gray-500">juan.delacruz@pup.edu.ph</p>
              </div>
              <div className="border border-gray-200 p-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Service Provider</p>
                <p className="font-semibold text-gray-800 text-sm">Speedy Print Shop</p>
                <p className="text-xs text-gray-500">Western Bicutan, Taguig</p>
                <WireBadge variant="success">PASOA-Approved</WireBadge>
              </div>
            </div>

            {/* Service Details */}
            <WireSectionTitle>Service Details</WireSectionTitle>
            <div className="flex flex-col gap-0 text-sm mb-5">
              {[
                ["Service Type", "Printing Services"],
                ["File", "thesis_chapter1_final.pdf (12 pages)"],
                ["Specifications", "2 copies · Black & White · Single-sided · Short"],
                ["Paper Type", "Standard (80gsm)"],
                ["Fulfillment", "Delivery — Room 201, PUP Taguig Main Building"],
                ["Special Instructions", "Please staple each copy separately."],
              ].map(([k, v]) => (
                <div key={k as string} className="flex gap-2 py-2 border-b border-gray-100">
                  <span className="text-gray-500 w-40 shrink-0 text-xs">{k}:</span>
                  <span className="text-gray-800 text-sm">{v}</span>
                </div>
              ))}
            </div>

            {/* Cost summary */}
            <WireSectionTitle>Cost Summary</WireSectionTitle>
            <div className="border border-gray-200 bg-gray-50 p-4 mb-5">
              <div className="flex flex-col gap-1.5 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Printing Fee:</span><span>₱40.00</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Delivery Fee (agreed):</span><span>₱30.00</span></div>
                <div className="border-t border-gray-300 mt-2 pt-2 flex justify-between font-bold text-gray-900 text-base">
                  <span>Total Amount Paid:</span><span>₱70.00</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between text-sm">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium text-gray-800">GCash</span>
              </div>
            </div>

            {/* Footer note */}
            <div className="text-center border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-400">
                This receipt is automatically generated by PASOA Student Services.
              </p>
              <p className="text-xs text-gray-400">For concerns, contact pasoa@puptaguig.edu.ph.</p>

              {/* Print-only footer */}
              <p className="text-xs text-gray-300 mt-2 hidden print:block">
                Printed from PASOA Student Services · PUP Taguig · {new Date().toLocaleDateString()}
              </p>
            </div>
          </WireCard>
        </div>

        {/* Bottom actions — hidden on print */}
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
