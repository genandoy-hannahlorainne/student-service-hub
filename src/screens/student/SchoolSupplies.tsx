import { ChangeEvent, useEffect, useMemo, useState } from "react";
import {
  fetchSchoolSuppliesCatalog,
  SupplyProduct,
  SupplyShop,
} from "../../lib/api";
import {
  StudentLayout, WireBadge, WireBtn, WireCard, WireInput, WireSectionTitle,
} from "../../components/WireframeUI";
import bondPaperImage from "../../assets/school-supplies/bond-paper.jpg";
import indexCardImage from "../../assets/school-supplies/index-card.jpg";
import yellowPadImage from "../../assets/school-supplies/yellow-pad.jpg";
import plasticEnvelopeImage from "../../assets/school-supplies/plastic-envelope.jpg";
import pencilImage from "../../assets/school-supplies/pencil.jpg";
import folderImage from "../../assets/school-supplies/folder.jpg";
import brownEnvelopeImage from "../../assets/school-supplies/brown-envelope.jpg";
import ballpenImage from "../../assets/school-supplies/ballpen.png";

type PaymentMethod = "cash" | "gcash" | "maya";
type CartItem = { product: SupplyProduct; option: string; quantity: number };
const productImages: Record<string, string> = {
  "school-supplies/bond-paper.jpg": bondPaperImage,
  "school-supplies/index-card.jpg": indexCardImage,
  "school-supplies/yellow-pad.jpg": yellowPadImage,
  "school-supplies/plastic-envelope.jpg": plasticEnvelopeImage,
  "school-supplies/pencil.jpg": pencilImage,
  "school-supplies/folder.jpg": folderImage,
  "school-supplies/brown-envelope.jpg": brownEnvelopeImage,
  "school-supplies/ballpen.png": ballpenImage,
};

function optionLabel(product: SupplyProduct): string {
  if (product.category === "bond_paper") return "Size";
  if (product.category === "index_card") return "Color";
  return "Variant";
}

function optionsFor(product: SupplyProduct): string[] {
  return product.category === "bond_paper"
    ? product.options.sizes ?? []
    : product.category === "index_card"
      ? product.options.colors ?? []
      : [];
}

export default function SchoolSupplies({ navigate }: { navigate: (s: string) => void }) {
  const [shops, setShops] = useState<SupplyShop[]>([]);
  const [products, setProducts] = useState<SupplyProduct[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedShop, setSelectedShop] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [proof, setProof] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  const loadCatalog = async () => {
    setLoading(true);
    try {
      const catalog = await fetchSchoolSuppliesCatalog();
      setShops(catalog.shops);
      setProducts(catalog.products);
      setSelectedShop((current) => current && catalog.shops.some((shop) => shop.id === current) ? current : catalog.shops[0]?.id ?? "");
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load the catalog.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCatalog();
    const timer = window.setInterval(() => void loadCatalog(), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const selectedShopRecord = shops.find((shop) => shop.id === selectedShop);
  const subtotal = useMemo(
    () => cart.reduce((total, item) => total + item.product.unit_price * item.quantity, 0),
    [cart]
  );

  const addToCart = (product: SupplyProduct, option: string) => {
    setCart((current) => {
      const existing = current.find((item) => item.product.id === product.id && item.option === option);
      if (existing) {
        return current.map((item) => item === existing
          ? { ...item, quantity: Math.min(item.quantity + 1, product.stock_quantity) }
          : item);
      }
      return [...current, { product, option, quantity: 1 }];
    });
  };

  const updateQuantity = (item: CartItem, quantity: number) => {
    setCart((current) => current
      .map((currentItem) => currentItem === item ? { ...currentItem, quantity } : currentItem)
      .filter((currentItem) => currentItem.quantity > 0));
  };

  const handleProof = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setProof(file);
  };

  return (
    <StudentLayout active="school-supplies" navigate={navigate}>
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E3C565]">Student marketplace</p>
            <h1 className="mt-1 text-2xl font-bold text-[#4B3621]">School supplies</h1>
            <p className="mt-1 text-sm text-gray-500">Choose an accredited partner shop before adding items.</p>
          </div>
          <div className="flex items-center gap-3">
            <WireBadge variant="active">{cart.length} cart item{cart.length === 1 ? "" : "s"}</WireBadge>
            <span className="text-xs text-gray-500">Step {step} of 3</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {["Choose shop & items", "Review cart", "Payment details"].map((label, index) => {
            const current = index + 1;
            return (
              <button key={label} onClick={() => current <= step && setStep(current)} className={`rounded-lg px-3 py-2 text-left text-xs font-semibold ${step === current ? "bg-[#4B3621] text-white" : step > current ? "bg-[#E3C565]/50 text-[#4B3621]" : "bg-gray-100 text-gray-400"}`}>
                <span className="mr-1">{current}.</span>{label}
              </button>
            );
          })}
        </div>

        {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#4B3621]/10">
          <WireSectionTitle>1. Select an accredited supply shop</WireSectionTitle>
          {loading ? <p className="text-sm text-gray-500">Loading accredited shops…</p> : shops.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-[#faf9f7] p-5 text-sm text-gray-500">
              No accredited school-supply shops are published yet. An administrator must approve a partner shop before students can order.
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-3">
              {shops.map((shop) => (
                <button key={shop.id} onClick={() => setSelectedShop(shop.id)} className={`rounded-xl border p-4 text-left transition ${selectedShop === shop.id ? "border-[#4B3621] bg-[#E3C565]/20" : "border-gray-200 hover:border-[#E3C565]"}`}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-[#4B3621]">{shop.business_name}</p>
                    <div className="flex items-center gap-2">
                      {shop.is_draft && <WireBadge variant="pending">Draft</WireBadge>}
                      {selectedShop === shop.id && <i className="bi bi-check-circle-fill text-[#4B3621]" aria-hidden="true" />}
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{shop.location}</p>
                  <p className="mt-3 text-xs text-gray-600">Transaction fee: <strong>₱{shop.transaction_fee.toFixed(2)}</strong></p>
                  <p className="mt-1 text-xs text-gray-600">GCash: <strong>{shop.gcash_number || "Not published"}</strong></p>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-4">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#4B3621]/10">
              <WireSectionTitle>2. Add supplies</WireSectionTitle>
              {products.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-[#faf9f7] p-5 text-sm text-gray-500">
                  No products are available yet. Published products will appear here with their live stock and price.
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {products.map((product) => {
                    const options = optionsFor(product);
                    return (
                      <div key={product.id} className="rounded-xl border border-gray-200 p-4">
                        {product.image_path && productImages[product.image_path] && <img src={productImages[product.image_path]} alt="" className="mb-3 h-28 w-full rounded-lg object-cover" />}
                        <p className="font-semibold text-[#4B3621]">{product.name}</p>
                        <p className="mt-1 text-sm text-gray-500">₱{product.unit_price.toFixed(2)} each · {product.stock_quantity} available</p>
                        {options.length > 0 && (
                          <select
                            className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            value={selectedOptions[product.id] ?? options[0]}
                            onChange={(event) => setSelectedOptions((current) => ({ ...current, [product.id]: event.target.value }))}
                          >
                            {options.map((option) => <option key={option}>{option}</option>)}
                          </select>
                        )}
                        <WireBtn className="mt-3 w-full" size="sm" disabled={!selectedShop} onClick={() => { addToCart(product, selectedOptions[product.id] ?? options[0] ?? "Standard"); setStep(2); }}>
                          Add {product.category === "bond_paper" ? "sheet" : product.category === "index_card" ? "card" : "item"}
                        </WireBtn>
                        <p className="mt-2 text-[11px] text-gray-400">
                          {product.category === "bond_paper" ? "Select Short, A4, or Long and enter sheets in your cart." : product.category === "index_card" ? "Select a color and enter the number of cards, not packs." : "Quantity is entered per item."}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#4B3621]/10">
              <WireSectionTitle>3. Cart</WireSectionTitle>
              {cart.length === 0 ? <p className="text-sm text-gray-500">Your cart is empty.</p> : cart.map((item) => (
                <div key={`${item.product.id}-${item.option}`} className="flex flex-wrap items-center gap-3 border-b border-gray-100 py-3 last:border-0">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#4B3621]">{item.product.name}</p>
                    <p className="text-xs text-gray-500">{optionLabel(item.product)}: {item.option} · ₱{item.product.unit_price.toFixed(2)} each</p>
                  </div>
                  <WireInput type="number" label="Quantity" className="w-24" value={String(item.quantity)} onChange={(event) => updateQuantity(item, Math.max(0, Math.min(item.product.stock_quantity, Number(event.target.value))))} />
                  <p className="w-20 text-right text-sm font-bold">₱{(item.product.unit_price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#4B3621]/10">
              <WireSectionTitle>4. Payment</WireSectionTitle>
              <div className="grid gap-2">
                {(["cash", "gcash", "maya"] as PaymentMethod[]).map((method) => (
                  <button key={method} onClick={() => setPaymentMethod(method)} className={`rounded-lg border px-3 py-2 text-left text-sm capitalize ${paymentMethod === method ? "border-[#4B3621] bg-[#E3C565]/20 font-semibold" : "border-gray-200"}`}>
                    {method === "cash" ? "Cash on pickup/delivery" : method}
                  </button>
                ))}
              </div>
              {paymentMethod === "gcash" && (
                <div className="mt-4 space-y-3">
                  <div className="rounded-lg bg-[#faf9f7] p-3 text-xs text-gray-600">Send payment to: <strong>{selectedShopRecord?.gcash_number || "Shop GCash number not published"}</strong></div>
                  <WireInput label="Reference number" value={referenceNumber} onChange={(event) => setReferenceNumber(event.target.value)} placeholder="Enter your GCash reference number" />
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600">Proof of online payment<input className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-sm" type="file" accept="image/*" onChange={handleProof} /></label>
                  {proof && <p className="text-xs text-gray-500">Selected: {proof.name}</p>}
                </div>
              )}
              {paymentMethod === "maya" && (
                <div className="mt-4 space-y-3">
                  <WireInput label="Reference number" value={referenceNumber} onChange={(event) => setReferenceNumber(event.target.value)} placeholder="Enter your Maya reference number" />
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600">Proof of online payment<input className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-sm" type="file" accept="image/*" onChange={handleProof} /></label>
                  {proof && <p className="text-xs text-gray-500">Selected: {proof.name}</p>}
                </div>
              )}
              <div className="mt-5 space-y-2 border-t border-gray-200 pt-4 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><strong>₱{subtotal.toFixed(2)}</strong></div>
                <div className="flex justify-between"><span>Shop transaction fee</span><strong>₱{(selectedShopRecord?.transaction_fee ?? 0).toFixed(2)}</strong></div>
                <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-bold text-[#4B3621]"><span>Total</span><span>₱{(subtotal + (selectedShopRecord?.transaction_fee ?? 0)).toFixed(2)}</span></div>
              </div>
              <WireBtn className="mt-4 w-full" size="lg" disabled={!selectedShopRecord || cart.length === 0 || ((paymentMethod === "gcash" || paymentMethod === "maya") && (!referenceNumber.trim() || !proof))} onClick={() => { setStep(3); navigate("order-tracking"); }}>
                Review order
              </WireBtn>
            </div>
          </aside>
        </section>
      </div>
    </StudentLayout>
  );
}
