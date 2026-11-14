import { useState } from "react";
import {
  StudentLayout, WireBtn, WireCard, WirePlaceholder,
  WireInput, WireSelect, WireTextarea, WireRadioGroup,
  WireSectionTitle, WireBadge,
  WireProgressTracker,
} from "../../components/WireframeUI";

export default function PrintingService({ navigate }: { navigate: (s: string) => void }) {
  const [fulfillment, setFulfillment] = useState<"pickup" | "delivery">("pickup");
  const [selectedShop, setSelectedShop] = useState<number | null>(null);

  const shops = [
    { name: "Speedy Print Shop", location: "Near PUP Taguig Main Gate", services: "Color, B&W, Binding", fee: "₱30", available: true },
    { name: "Taguig Print Center", location: "45 Central Bicutan, Taguig", services: "B&W, Lamination, Spiral", fee: "₱35", available: true },
    { name: "Campus Copy Express", location: "Western Bicutan, Taguig", services: "Color, B&W, Scanning", fee: "₱25", available: false },
  ];

  return (
    <StudentLayout active="printing-service" navigate={navigate}>
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-xl font-bold text-[#4B3621]">Printing Services</h1>
          <p className="text-sm text-[#4B3621] mt-1">Fill in your printing details and select a collaborating shop</p>
        </div>
        <WireCard className="rounded-2xl border-0 shadow-sm ring-1 ring-[#4B3621]/10">
          <WireProgressTracker steps={["File", "Details", "Shop", "Fulfillment", "Payment"]} current={0} />
        </WireCard>

        {/* ── Bento: top 2-col layout — file upload (wide) + printing details (narrow) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

          {/* Step 1: Upload File — 3 cols */}
          <WireCard className="lg:col-span-3">
            <WireSectionTitle>1. Upload File</WireSectionTitle>
            <div className="flex flex-col gap-3">
              <div className="border-2 border-dashed border-[#4B3621] p-6 text-center bg-[#E3C565]">
                <WirePlaceholder label="Click or drag file to upload (PDF, DOCX, JPEG)" className="h-20 w-full mb-3" />
                <WireBtn variant="outline">🔎 Choose File</WireBtn>
                <p className="text-xs text-[#4B3621] mt-2">Max file size: 20MB · Supported: PDF, DOCX, JPG, PNG</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <WireInput label="File Name" placeholder="document_name.pdf" />
                <WireInput label="File Type" placeholder="PDF / DOCX / JPG" />
              </div>
              <WirePlaceholder label="File Preview — Page 1 of document" className="h-40 w-full" />
            </div>
          </WireCard>

          {/* Step 2: Printing Details — 2 cols */}
          <WireCard className="lg:col-span-2">
            <WireSectionTitle>2. Printing Details</WireSectionTitle>
            <div className="flex flex-col gap-4">
              <WireInput label="Number of Copies" type="number" placeholder="e.g. 2" />
              <WireSelect label="Print Color" options={["Black & White", "Full Color"]} />
              <WireSelect label="Paper Size" options={["Short (8.5×11)", "Long (8.5×13)", "A4 (8.27×11.69)"]} />
              <WireSelect label="Sides" options={["Single-Sided", "Double-Sided"]} />
              <WireSelect label="Paper Type" options={["Standard (80gsm)", "Thick (120gsm)", "Glossy", "Matte"]} />
            </div>
          </WireCard>
        </div>

        {/* ── Bento: shop selector full width ── */}
        <WireCard>
          <WireSectionTitle>3. Select Printing Shop</WireSectionTitle>
          <p className="text-xs text-[#4B3621] mb-4 border border-dashed border-[#4B3621] p-2 bg-[#E3C565]">
            Only University Organization-approved collaborating printing shops are listed below. Shops must have an
            official agreement with University Organization to appear here.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {shops.map((shop, i) => (
              <div
                key={shop.name}
                onClick={() => shop.available && setSelectedShop(i)}
                className={`border p-3 flex flex-col gap-3 transition-colors ${
                  !shop.available
                    ? "opacity-50 cursor-not-allowed bg-[#E3C565] border-[#4B3621]"
                    : selectedShop === i
                    ? "border-gray-700 bg-[#E3C565] cursor-pointer"
                    : "border-[#4B3621] hover:border-gray-500 cursor-pointer"
                }`}
              >
                <WirePlaceholder label="🪟" className="w-full h-16" />
                <div className="flex flex-col gap-1 flex-1">
                  <p className="font-semibold text-[#4B3621] text-sm">{shop.name}</p>
                  <p className="text-xs text-[#4B3621]">📍 {shop.location}</p>
                  <p className="text-xs text-[#4B3621]">🖨 {shop.services}</p>
                  <p className="text-xs text-[#4B3621]">Delivery fee: <strong>{shop.fee}</strong></p>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <WireBadge variant={shop.available ? "success" : "rejected"}>
                    {shop.available ? "Available" : "Unavailable"}
                  </WireBadge>
                  {shop.available && (
                    <WireBtn
                      size="sm"
                      variant={selectedShop === i ? "primary" : "outline"}
                      onClick={() => setSelectedShop(i)}
                    >
                      {selectedShop === i ? "✓ Selected" : "Select"}
                    </WireBtn>
                  )}
                </div>
              </div>
            ))}
          </div>
        </WireCard>

        {/* ── Bento: notes + fulfillment side by side ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Step 4: Notes */}
          <WireCard>
            <WireSectionTitle>4. Notes / Special Instructions</WireSectionTitle>
            <WireTextarea
              placeholder="Example: Please staple each copy separately. Print portrait orientation only."
              rows={5}
            />
          </WireCard>

          {/* Step 5: Fulfillment */}
          <WireCard>
            <WireSectionTitle>5. Fulfillment Method</WireSectionTitle>
            <div className="flex gap-3 mb-4">
              {(["pickup", "delivery"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFulfillment(f)}
                  className={`flex-1 py-3 text-sm font-medium border capitalize transition-colors ${
                    fulfillment === f
                      ? "bg-[#4B3621] text-white border-gray-800"
                      : "border-[#4B3621] text-[#4B3621] hover:bg-[#E3C565]"
                  }`}
                >
                  {f === "pickup" ? "📦 Pickup" : "🚚 Delivery"}
                </button>
              ))}
            </div>
            {fulfillment === "delivery" ? (
              <div className="flex flex-col gap-3">
                <WireInput
                  label="Delivery Location / Address"
                  placeholder="Room or building within PUP Taguig campus or nearby area"
                />
                <div className="border border-[#4B3621] p-3 bg-[#E3C565] text-sm">
                  <span className="text-[#4B3621]">Agreed Delivery Fee: </span>
                  <strong className="text-[#4B3621]">₱30.00</strong>
                  <p className="text-xs text-[#4B3621] mt-0.5">Based on shop selection above</p>
                </div>
              </div>
            ) : (
              <div className="border border-[#4B3621] p-3 bg-[#E3C565] text-sm">
                <p className="text-[#4B3621]">
                  📍 Pickup Location:{" "}
                  <strong>Speedy Print Shop — Near PUP Taguig Main Gate</strong>
                </p>
                <p className="text-xs text-[#4B3621] mt-0.5">No delivery fee for pickup orders.</p>
              </div>
            )}
          </WireCard>
        </div>

        {/* ── Bento: payment full width ── */}
        <WireCard>
          <WireSectionTitle>6. Payment Method</WireSectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <WireRadioGroup name="payment" options={["Cash on Pickup/Delivery", "GCash", "Maya"]} />
            <div className="border border-[#4B3621] p-3 bg-[#E3C565] flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-[#4B3621]">Printing Fee (2 copies × B&W Short):</span>
                <span className="font-medium">₱40.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4B3621]">Delivery Fee:</span>
                <span className="font-medium">{fulfillment === "delivery" ? "₱30.00" : "₱0.00"}</span>
              </div>
              <div className="border-t border-[#4B3621] pt-2 flex justify-between font-bold text-[#4B3621]">
                <span>Total Amount:</span>
                <span>{fulfillment === "delivery" ? "₱70.00" : "₱40.00"}</span>
              </div>
            </div>
          </div>
        </WireCard>

        {/* ── CTA ── */}
        <div className="flex justify-end">
          <WireBtn size="lg" onClick={() => navigate("printing-confirmation")}>
            Review Order →
          </WireBtn>
        </div>
      </div>
    </StudentLayout>
  );
}
