import {
  StudentLayout, WireBtn, WireCard, WirePlaceholder, WireSectionTitle, WireBadge,
} from "../../components/WireframeUI";

export default function PrintingConfirmation({ navigate }: { navigate: (s: string) => void }) {
  return (
    <StudentLayout active="printing-service" navigate={navigate}>
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Review Your Order</h1>
          <p className="text-sm text-gray-500 mt-1">
            Please verify all details before confirming. This cannot be undone once submitted.
          </p>
        </div>

        {/* ── Bento top row: file preview (narrow) + shop + specs (wide) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

          {/* File preview — 2 cols */}
          <WireCard className="lg:col-span-2 flex flex-col gap-3">
            <WireSectionTitle>Uploaded File</WireSectionTitle>
            <WirePlaceholder label="File Preview" className="w-full flex-1 min-h-40" />
            <div className="text-sm text-gray-700">
              <p className="font-medium">thesis_chapter1_final.pdf</p>
              <p className="text-gray-500 text-xs mt-0.5">Type: PDF · Size: 3.2 MB · 12 pages</p>
            </div>
          </WireCard>

          {/* Printing specs — 3 cols */}
          <WireCard className="lg:col-span-3 flex flex-col gap-4">
            <WireSectionTitle>Printing Specifications</WireSectionTitle>
            <div className="grid grid-cols-2 gap-y-3 text-sm flex-1">
              {[
                ["Copies", "2 copies"],
                ["Color", "Black & White"],
                ["Paper Size", "Short (8.5×11)"],
                ["Sides", "Single-Sided"],
                ["Paper Type", "Standard (80gsm)"],
                ["Pages", "12 × 2 = 24 sheets"],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-col gap-0.5">
                  <span className="text-xs text-gray-400 uppercase tracking-wide font-semibold">{k}</span>
                  <span className="text-gray-800 font-medium">{v}</span>
                </div>
              ))}
            </div>

            {/* Printing shop inline */}
            <div className="border-t border-gray-100 pt-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Printing Shop</p>
              <div className="flex items-center gap-2">
                <WirePlaceholder label="🪟" className="w-10 h-10 shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold text-gray-800">Speedy Print Shop</p>
                  <p className="text-gray-500 text-xs">📍 Near PUP Taguig Main Gate</p>
                  <WireBadge variant="success">University Organization-approved Collaborator</WireBadge>
                </div>
              </div>
            </div>
          </WireCard>
        </div>

        {/* ── Bento bottom row: notes + fulfillment (wide) + payment (narrow) ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Special instructions */}
          <WireCard>
            <WireSectionTitle>Special Instructions</WireSectionTitle>
            <p className="text-sm text-gray-700 italic bg-gray-50 p-3 border border-gray-200 h-full">
              &ldquo;Please staple each copy separately.&rdquo;
            </p>
          </WireCard>

          {/* Fulfillment */}
          <WireCard>
            <WireSectionTitle>Fulfillment</WireSectionTitle>
            <div className="text-sm text-gray-700 flex flex-col gap-1">
              <p className="font-medium">🚚 Delivery</p>
              <p className="text-gray-500">Room 201, PUP Taguig Main Building</p>
              <p className="text-gray-500">Agreed Delivery Fee: ₱30.00</p>
            </div>
          </WireCard>

          {/* Payment */}
          <WireCard>
            <WireSectionTitle>Payment</WireSectionTitle>
            <p className="text-sm font-medium text-gray-700 mb-3">GCash</p>
            <div className="border border-gray-200 p-3 bg-gray-50 text-sm flex flex-col gap-1.5">
              <div className="flex justify-between">
                <span className="text-gray-600">Printing Fee:</span>
                <span>₱40.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee:</span>
                <span>₱30.00</span>
              </div>
              <div className="flex justify-between font-bold text-gray-800 text-base border-t border-gray-300 pt-2 mt-1">
                <span>Total:</span>
                <span>₱70.00</span>
              </div>
            </div>
          </WireCard>
        </div>

        {/* ── Confirm actions ── */}
        <div className="border-2 border-dashed border-gray-400 p-4 text-center bg-gray-50">
          <p className="text-sm text-gray-600 mb-1">
            <strong>Important:</strong> By clicking &ldquo;Confirm &amp; Submit Order&rdquo;, your order will be sent
            to the printing shop for acceptance.
          </p>
          <p className="text-xs text-gray-400">Cancellations must be made before the shop accepts your order.</p>
        </div>

        <div className="flex flex-wrap gap-3 justify-between">
          <div className="flex gap-2">
            <WireBtn variant="outline" onClick={() => navigate("printing-service")}>✎ Edit Order</WireBtn>
            <WireBtn variant="secondary" onClick={() => navigate("student-dashboard")}>✕ Cancel</WireBtn>
          </div>
          <WireBtn size="lg" onClick={() => navigate("order-tracking")} className="bg-gray-900 font-bold tracking-wide px-6">
            ✓ CONFIRM &amp; SUBMIT ORDER
          </WireBtn>
        </div>
      </div>
    </StudentLayout>
  );
}
