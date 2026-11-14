import { useState } from "react";
import { createTransaction } from "../../lib/api";
import {
  StudentLayout, WireBtn, WireCard, WirePlaceholder,
  WireInput, WireSelect, WireTextarea, WireRadioGroup,
  WireSectionTitle, WireBadge,
  WireProgressTracker,
} from "../../components/WireframeUI";

export default function PrintingService({ navigate }: { navigate: (s: string) => void }) {
  const [files, setFiles] = useState<Array<{ id: number; name: string; size: number }>>([]);
  const [copies, setCopies] = useState<Record<number, number>>({});
  const [notes, setNotes] = useState("");
  const [fulfillment, setFulfillment] = useState<"pickup" | "delivery">("pickup");
  const [selectedShop, setSelectedShop] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("Cash on Pickup/Delivery");
  const [paymentProof, setPaymentProof] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [step, setStep] = useState(1);
  const steps = ["File", "Details", "Shop", "Fulfillment", "Payment"];

  const shops = [
    { name: "Charie Ledesma Printing Services", location: "PUP Taguig area", services: "Printing services", fee: "TBD", available: true },
  ];

  const addFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const additions = Array.from(selectedFiles).map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: file.size,
    }));
    setFiles((current) => [...current, ...additions]);
    setCopies((current) => additions.reduce((next, file) => ({ ...next, [file.id]: 1 }), current));
  };

  const removeFile = (id: number) => {
    setFiles((current) => current.filter((file) => file.id !== id));
    setCopies((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  };

  const submitOrder = async () => {
    setSubmitting(true);
    setSubmitError("");
    try {
      await createTransaction({
        service_type: "printing",
        amount: fulfillment === "delivery" ? 70 : 40,
        payment_method: paymentMethod,
        metadata: {
          files: files.map((file) => ({ name: file.name, size: file.size, copies: copies[file.id] ?? 1 })),
          notes,
          shop: selectedShop === null ? null : shops[selectedShop].name,
          fulfillment,
          payment_proof: paymentProof || null,
          payment_reference: paymentReference || null,
        },
      });
      navigate("transaction-receipt");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not submit the order.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StudentLayout active="printing-service" navigate={navigate}>
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-xl font-bold text-[#4B3621]">Printing Services</h1>
          <p className="text-sm text-[#4B3621] mt-1">Fill in your printing details and select a collaborating shop</p>
        </div>
        <WireCard className="rounded-2xl border-0 shadow-sm ring-1 ring-[#4B3621]/10">
          <WireProgressTracker steps={steps} current={step - 1} />
        </WireCard>

        {step === 1 && (
          <WireCard>
            <WireSectionTitle>1. Upload File</WireSectionTitle>
            <div className="flex flex-col gap-3">
              <div className="border-2 border-dashed border-[#4B3621] p-6 text-center bg-[#E3C565]">
                <WirePlaceholder label="PDF, DOCX, JPEG, or PNG" className="h-20 w-full mb-3" />
                <label className="inline-flex cursor-pointer items-center justify-center border border-[#4B3621] bg-white px-4 py-2 text-sm font-medium text-[#4B3621] hover:bg-[#E3C565]">
                  + Add file{files.length > 0 ? "s" : ""}
                  <input type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" className="hidden" onChange={(event) => addFiles(event.target.files)} />
                </label>
                <p className="text-xs text-[#4B3621] mt-2">Max file size: 20MB · Supported: PDF, DOCX, JPG, PNG</p>
              </div>
              {files.length > 0 && (
                <div className="flex flex-col gap-2">
                  {files.map((file) => (
                    <div key={file.id} className="flex items-center justify-between gap-3 border border-[#4B3621] bg-white p-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#4B3621]">{file.name}</p>
                        <p className="text-xs text-[#4B3621]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <WireBtn size="sm" variant="outline" onClick={() => removeFile(file.id)}>Remove</WireBtn>
                    </div>
                  ))}
                </div>
              )}
              <WireTextarea label="Notes for the printing shop" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Add instructions for the printing shop, such as stapling or page orientation." rows={4} />
            </div>
          </WireCard>
        )}

        {step === 2 && (
          <WireCard>
            <WireSectionTitle>2. Printing Details</WireSectionTitle>
            <div className="flex flex-col gap-4">
              <div className="border border-dashed border-[#4B3621] bg-[#E3C565] p-3 text-xs text-[#4B3621]">
                Set the number of copies for each uploaded file. Each file starts at 1 copy.
              </div>
              {files.map((file) => (
                <div key={file.id} className="flex items-center justify-between gap-3 border border-[#4B3621] p-3">
                  <span className="min-w-0 truncate text-sm font-medium text-[#4B3621]">{file.name}</span>
                  <WireInput label="Copies" type="number" min="1" value={copies[file.id] ?? 1} onChange={(event) => setCopies((current) => ({ ...current, [file.id]: Math.max(1, Number(event.target.value) || 1) }))} />
                </div>
              ))}
              <WireSelect label="Print Color" options={["Black & White", "Full Color"]} />
              <WireSelect label="Paper Size" options={["Short (8.5×11)", "Long (8.5×13)", "A4 (8.27×11.69)"]} />
              <WireSelect label="Sides" options={["Single-Sided", "Double-Sided"]} />
              <WireSelect label="Paper Type" options={["Standard (80gsm)", "Thick (120gsm)", "Glossy", "Matte"]} />
            </div>
          </WireCard>
        )}

        {step === 3 && <WireCard>
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
        </WireCard>}

        {step === 4 && <WireCard>
            <WireSectionTitle>4. Fulfillment Method</WireSectionTitle>
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
                  <strong>Charie Ledesma Printing Services — PUP Taguig area</strong>
                </p>
                <p className="text-xs text-[#4B3621] mt-0.5">No delivery fee for pickup orders.</p>
              </div>
            )}
          </WireCard>}

        {step === 5 && <WireCard>
          <WireSectionTitle>5. Payment Method</WireSectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <div>
              <WireRadioGroup name="payment" options={["Cash on Pickup/Delivery", "GCash", "Maya"]} value={paymentMethod} onChange={setPaymentMethod} />
              {paymentMethod === "GCash" && (
                <div className="mt-4 flex flex-col gap-3 border border-[#4B3621] bg-[#E3C565] p-3">
                  <p className="text-sm font-semibold text-[#4B3621]">GCash payment details</p>
                  <p className="text-xs text-[#4B3621]">Printing shop GCash number (draft): 09XX XXX XXXX</p>
                  <WireInput label="Payment reference number" value={paymentReference} onChange={(event) => setPaymentReference(event.target.value)} placeholder="Enter GCash reference number" />
                  <label className="text-xs font-semibold text-[#4B3621]">
                    Upload proof of payment
                    <input type="file" accept="image/*,.pdf" className="mt-1 block w-full border border-[#4B3621] bg-white p-2 text-sm font-normal" onChange={(event) => setPaymentProof(event.target.files?.[0]?.name ?? "")} />
                  </label>
                  {paymentProof && <p className="text-xs text-[#4B3621]">Selected: {paymentProof}</p>}
                </div>
              )}
            </div>
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
        </WireCard>}

        <div className="flex justify-between gap-3">
          <WireBtn variant="outline" disabled={step === 1} onClick={() => setStep((current) => Math.max(1, current - 1))}>
            ← Back
          </WireBtn>
          {step < steps.length ? (
            <WireBtn disabled={step === 1 && files.length === 0} size="lg" onClick={() => setStep((current) => Math.min(steps.length, current + 1))}>
              Next: {steps[step]} →
            </WireBtn>
          ) : (
            <WireBtn disabled={paymentMethod === "GCash" && (!paymentProof || !paymentReference)} size="lg" onClick={() => setShowConfirmation(true)}>
              Confirm Order →
            </WireBtn>
          )}
        </div>
      </div>
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000]/70 p-4" role="dialog" aria-modal="true">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto border-2 border-[#4B3621] bg-white p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#4B3621]">Confirm printing order</h2>
                <p className="mt-1 text-sm text-[#4B3621]">Review the details before submitting.</p>
              </div>
              <button type="button" className="text-xl text-[#4B3621]" onClick={() => setShowConfirmation(false)} aria-label="Close confirmation">×</button>
            </div>
            <div className="flex flex-col gap-2 border border-[#4B3621] p-4 text-sm text-[#4B3621]">
              <p><strong>Files:</strong> {files.length}</p>
              <p><strong>Shop:</strong> {selectedShop === null ? "Not selected" : shops[selectedShop].name}</p>
              <p><strong>Payment:</strong> {paymentMethod}</p>
              {paymentMethod === "GCash" && <p><strong>Reference:</strong> {paymentReference || "Not provided"}</p>}
              {notes && <p><strong>Notes:</strong> {notes}</p>}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <WireBtn variant="outline" onClick={() => setShowConfirmation(false)}>Back to payment</WireBtn>
              <WireBtn disabled={submitting} onClick={() => void submitOrder()}>{submitting ? "Submitting..." : "Submit Order"}</WireBtn>
            </div>
            {submitError && <p role="alert" className="mt-3 border border-[#4B3621] bg-[#E3C565] p-3 text-sm text-[#4B3621]">{submitError}</p>}
          </div>
        </div>
      )}
    </StudentLayout>
  );
}
