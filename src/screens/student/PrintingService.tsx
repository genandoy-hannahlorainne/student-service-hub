import { useState } from "react";
import {
  StudentLayout, WireBtn, WireCard, WirePlaceholder,
  WireInput, WireSelect, WireTextarea, WireRadioGroup,
  WireSectionTitle, WireBadge,
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
      <div className="flex flex-col gap-5 max-w-3xl">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Printing Services</h1>
          <p className="text-sm text-gray-500 mt-1">Fill in your printing details and select a collaborating shop</p>
        </div>

        {/* Step 1: Upload File */}
        <WireCard>
          <WireSectionTitle>1. Upload File</WireSectionTitle>
          <div className="flex flex-col gap-3">
            <div className="border-2 border-dashed border-gray-400 p-8 text-center bg-gray-50">
              <WirePlaceholder label="Click or drag file to upload (PDF, DOCX, JPEG)" className="h-20 w-full mb-3" />
              <WireBtn variant="outline">📎 Choose File</WireBtn>
              <p className="text-xs text-gray-400 mt-2">Max file size: 20MB · Supported: PDF, DOCX, JPG, PNG</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <WireInput label="File Name" placeholder="document_name.pdf" />
              <WireInput label="File Type" placeholder="PDF / DOCX / JPG" />
            </div>
            <WirePlaceholder label="File Preview — Page 1 of document" className="h-40 w-full" />
          </div>
        </WireCard>

        {/* Step 2: Printing Details */}
        <WireCard>
          <WireSectionTitle>2. Printing Details</WireSectionTitle>
          <div className="grid sm:grid-cols-2 gap-4">
            <WireInput label="Number of Copies" type="number" placeholder="e.g. 2" />
            <WireSelect label="Print Color" options={["Black & White", "Full Color"]} />
            <WireSelect label="Paper Size" options={["Short (8.5×11)", "Long (8.5×13)", "A4 (8.27×11.69)"]} />
            <WireSelect label="Sides" options={["Single-Sided", "Double-Sided"]} />
            <WireSelect label="Paper Type" options={["Standard (80gsm)", "Thick (120gsm)", "Glossy", "Matte"]} />
          </div>
        </WireCard>

        {/* Step 3: Select Printing Shop */}
        <WireCard>
          <WireSectionTitle>3. Select Printing Shop</WireSectionTitle>
          <p className="text-xs text-gray-500 mb-4 border border-dashed border-gray-300 p-2 bg-gray-50">
            Only PASOA-approved collaborating printing shops are listed below. Shops must have an official agreement with PASOA to appear here.
          </p>
          <div className="flex flex-col gap-3">
            {shops.map((shop, i) => (
              <div
                key={shop.name}
                onClick={() => shop.available && setSelectedShop(i)}
                className={`border p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                  !shop.available ? "opacity-50 cursor-not-allowed bg-gray-100 border-gray-200"
                  : selectedShop === i ? "border-gray-700 bg-gray-50 cursor-pointer"
                  : "border-gray-300 hover:border-gray-500 cursor-pointer"
                }`}
              >
                <div className="flex gap-3 items-start">
                  <WirePlaceholder label="🏪" className="w-10 h-10 shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{shop.name}</p>
                    <p className="text-xs text-gray-500">📍 {shop.location}</p>
                    <p className="text-xs text-gray-500">🖨 {shop.services}</p>
                    <p className="text-xs text-gray-600">Delivery fee: <strong>{shop.fee}</strong></p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                  <WireBadge variant={shop.available ? "success" : "rejected"}>
                    {shop.available ? "Available" : "Unavailable"}
                  </WireBadge>
                  {shop.available && (
                    <WireBtn
                      size="sm"
                      variant={selectedShop === i ? "primary" : "outline"}
                      onClick={() => { setSelectedShop(i); }}
                    >
                      {selectedShop === i ? "✓ Selected" : "Select"}
                    </WireBtn>
                  )}
                </div>
              </div>
            ))}
          </div>
        </WireCard>

        {/* Step 4: Notes */}
        <WireCard>
          <WireSectionTitle>4. Notes / Special Instructions</WireSectionTitle>
          <WireTextarea
            placeholder="Example: Please staple each copy separately. Print portrait orientation only."
            rows={4}
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
                  fulfillment === f ? "bg-gray-800 text-white border-gray-800" : "border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {f === "pickup" ? "📦 Pickup" : "🚚 Delivery"}
              </button>
            ))}
          </div>
          {fulfillment === "delivery" ? (
            <div className="flex flex-col gap-3">
              <WireInput label="Delivery Location / Address" placeholder="Room or building within PUP Taguig campus or nearby area" />
              <div className="border border-gray-200 p-3 bg-gray-50 text-sm">
                <span className="text-gray-500">Agreed Delivery Fee: </span>
                <strong className="text-gray-800">₱30.00</strong>
                <p className="text-xs text-gray-400 mt-0.5">Based on shop selection above</p>
              </div>
            </div>
          ) : (
            <div className="border border-gray-200 p-3 bg-gray-50 text-sm">
              <p className="text-gray-600">📍 Pickup Location: <strong>Speedy Print Shop — Near PUP Taguig Main Gate</strong></p>
              <p className="text-xs text-gray-400 mt-0.5">No delivery fee for pickup orders.</p>
            </div>
          )}
        </WireCard>

        {/* Step 6: Payment */}
        <WireCard>
          <WireSectionTitle>6. Payment Method</WireSectionTitle>
          <WireRadioGroup name="payment" options={["Cash on Pickup/Delivery", "GCash", "Maya"]} />
          <div className="mt-4 border border-gray-200 p-3 bg-gray-50 flex flex-col gap-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Printing Fee (2 copies × B&W Short):</span>
              <span className="font-medium">₱40.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee:</span>
              <span className="font-medium">{fulfillment === "delivery" ? "₱30.00" : "₱0.00"}</span>
            </div>
            <div className="border-t border-gray-300 pt-2 flex justify-between font-bold text-gray-800">
              <span>Total Amount:</span>
              <span>{fulfillment === "delivery" ? "₱70.00" : "₱40.00"}</span>
            </div>
          </div>
        </WireCard>

        {/* Review Order */}
        <div className="flex justify-end">
          <WireBtn size="lg" onClick={() => navigate("printing-confirmation")}>
            Review Order →
          </WireBtn>
        </div>
      </div>
    </StudentLayout>
  );
}
