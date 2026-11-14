import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { fetchSchoolSuppliesCatalog, SupplyProduct, SupplyShop } from "../../lib/api";
import { StudentLayout, WireBadge, WireBtn, WireCard, WireInput, WireSectionTitle } from "../../components/WireframeUI";
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
const images: Record<string, string> = {
  "school-supplies/bond-paper.jpg": bondPaperImage,
  "school-supplies/index-card.jpg": indexCardImage,
  "school-supplies/yellow-pad.jpg": yellowPadImage,
  "school-supplies/plastic-envelope.jpg": plasticEnvelopeImage,
  "school-supplies/pencil.jpg": pencilImage,
  "school-supplies/folder.jpg": folderImage,
  "school-supplies/brown-envelope.jpg": brownEnvelopeImage,
  "school-supplies/ballpen.png": ballpenImage,
};

function optionsFor(product: SupplyProduct): string[] {
  if (product.category === "bond_paper") return product.options.sizes ?? [];
  if (product.category === "index_card") return product.options.colors ?? [];
  if (product.name.toLowerCase().includes("ballpen")) return product.options.colors ?? [];
  return [];
}

function optionLabel(product: SupplyProduct): string {
  if (product.category === "bond_paper") return "Size";
  if (product.category === "index_card" || product.name.toLowerCase().includes("ballpen")) return "Color";
  return "Variant";
}

export default function SchoolSupplies({ navigate }: { navigate: (s: string) => void }) {
  const [shops, setShops] = useState<SupplyShop[]>([]);
  const [products, setProducts] = useState<SupplyProduct[]>([]);
  const [shopId, setShopId] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [options, setOptions] = useState<Record<string, string>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [step, setStep] = useState(1);
  const [payment, setPayment] = useState<PaymentMethod>("cash");
  const [reference, setReference] = useState("");
  const [proof, setProof] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchSchoolSuppliesCatalog();
      setShops(data.shops);
      setProducts(data.products);
      setShopId((current) => data.shops.some((shop) => shop.id === current) ? current : data.shops[0]?.id ?? "");
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load the catalog.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    const timer = window.setInterval(() => void load(), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const shop = shops.find((item) => item.id === shopId);
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.product.unit_price * item.quantity, 0), [cart]);

  const add = (product: SupplyProduct) => {
    const option = options[product.id] ?? optionsFor(product)[0] ?? "Standard";
    const amount = product.name.toLowerCase().includes("yellow pad") ? 1 : Math.max(1, quantities[product.id] ?? 1);
    setCart((current) => {
      const found = current.find((item) => item.product.id === product.id && item.option === option);
      if (found) return current.map((item) => item === found ? { ...item, quantity: Math.min(item.quantity + amount, product.stock_quantity) } : item);
      return [...current, { product, option, quantity: Math.min(amount, product.stock_quantity) }];
    });
  };

  const updateCartQuantity = (item: CartItem, value: number) => {
    setCart((current) => current.map((entry) => entry === item ? { ...entry, quantity: Math.max(1, Math.min(value, item.product.stock_quantity)) } : entry));
  };

  const onlinePayment = payment === "gcash" || payment === "maya";
  const steps = ["Shop & supplies", "Review cart", "Payment"];

  return (
    <StudentLayout active="school-supplies" navigate={navigate}>
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E3C565]">Student marketplace</p>
            <h1 className="mt-1 text-2xl font-bold text-[#4B3621]">School supplies</h1>
            <p className="mt-1 text-sm text-[#4B3621]">Complete each step before moving to the next.</p>
          </div>
          <WireBadge variant="active">{cart.length} item{cart.length === 1 ? "" : "s"}</WireBadge>
        </header>

        <div className="grid grid-cols-3 gap-2">
          {steps.map((label, index) => {
            const number = index + 1;
            return <button key={label} onClick={() => number < step && setStep(number)} className={`rounded-xl px-3 py-3 text-left text-xs font-bold ${step === number ? "bg-[#4B3621] text-white" : number < step ? "bg-[#E3C565]/60 text-[#4B3621]" : "bg-[#E3C565] text-[#4B3621]"}`}><span className="mr-1">{number}.</span>{label}</button>;
          })}
        </div>
        {error && <div role="alert" className="rounded-xl border border-[#4B3621] bg-[#E3C565] p-4 text-sm text-[#4B3621]">{error}</div>}

        {step === 1 && (
          <div className="space-y-5">
            <section className="rounded-2xl bg-[#E3C565] p-5 shadow-sm ring-1 ring-[#4B3621]/10">
              <WireSectionTitle>Step 1A — Select an accredited shop</WireSectionTitle>
              {loading ? <p className="text-sm text-[#4B3621]">Loading shops…</p> : shops.length === 0 ? <p className="rounded-xl border border-dashed p-5 text-sm text-[#4B3621]">No accredited shops are available yet.</p> : (
                <div className="grid gap-3 md:grid-cols-2">
                  {shops.map((item) => <button key={item.id} onClick={() => setShopId(item.id)} className={`rounded-xl border p-4 text-left ${shopId === item.id ? "border-[#4B3621] bg-[#E3C565]/20" : "border-[#4B3621]"}`}>
                    <div className="flex justify-between gap-2"><strong className="text-[#4B3621]">{item.business_name}</strong>{item.is_draft && <WireBadge variant="pending">Draft</WireBadge>}</div>
                    <p className="mt-1 text-xs text-[#4B3621]">{item.location}</p>
                    <p className="mt-2 text-xs text-[#4B3621]">Transaction fee: ₱{item.transaction_fee.toFixed(2)} · GCash: {item.gcash_number || "Not published"}</p>
                  </button>)}
                </div>
              )}
            </section>
            <section className="rounded-2xl bg-[#E3C565] p-5 shadow-sm ring-1 ring-[#4B3621]/10">
              <WireSectionTitle>Step 1B — Add supplies</WireSectionTitle>
              {loading ? <p className="text-sm text-[#4B3621]">Loading products…</p> : products.length === 0 ? <p className="rounded-xl border border-dashed p-5 text-sm text-[#4B3621]">No products are available yet.</p> : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {products.map((product) => {
                    const productOptions = optionsFor(product);
                    const needsQuantity = !product.name.toLowerCase().includes("yellow pad");
                    return <div key={product.id} className="rounded-xl border border-[#4B3621] p-3">
                      {product.image_path && images[product.image_path] && <img src={images[product.image_path]} alt={product.name} className="h-28 w-full rounded-lg object-cover" />}
                      <p className="mt-3 font-semibold text-[#4B3621]">{product.name}</p>
                      <p className="mt-1 text-xs text-[#4B3621]">₱{product.unit_price.toFixed(2)} each · {product.stock_quantity} available</p>
                      {productOptions.length > 0 && <select className="mt-3 w-full rounded-lg border px-2 py-2 text-sm" value={options[product.id] ?? productOptions[0]} onChange={(event) => setOptions((current) => ({ ...current, [product.id]: event.target.value }))}>{productOptions.map((option) => <option key={option}>{option}</option>)}</select>}
                      {needsQuantity && <WireInput label="Quantity" type="number" value={String(quantities[product.id] ?? 1)} onChange={(event) => setQuantities((current) => ({ ...current, [product.id]: Math.max(1, Math.min(product.stock_quantity, Number(event.target.value))) }))} className="mt-2" />}
                      <WireBtn className="mt-3 w-full" size="sm" disabled={!shopId} onClick={() => add(product)}>Add to cart</WireBtn>
                    </div>;
                  })}
                </div>
              )}
            </section>
            <div className="flex justify-end"><WireBtn size="lg" disabled={!shopId || cart.length === 0} onClick={() => setStep(2)}>Continue to cart <i className="bi bi-arrow-right ml-2" aria-hidden="true" /></WireBtn></div>
          </div>
        )}

        {step === 2 && (
          <section className="rounded-2xl bg-[#E3C565] p-5 shadow-sm ring-1 ring-[#4B3621]/10">
            <WireSectionTitle>Step 2 — Review your cart</WireSectionTitle>
            {cart.length === 0 ? <p className="text-sm text-[#4B3621]">Your cart is empty.</p> : <div className="space-y-2">{cart.map((item) => <div key={`${item.product.id}-${item.option}`} className="flex flex-wrap items-center gap-3 border-b py-3">
              <div className="min-w-0 flex-1"><p className="font-semibold text-[#4B3621]">{item.product.name}</p><p className="text-xs text-[#4B3621]">{optionLabel(item.product)}: {item.option} · ₱{item.product.unit_price.toFixed(2)} each</p></div>
              {item.product.name.toLowerCase().includes("yellow pad") ? <span className="text-xs text-[#4B3621]">1 pad</span> : <WireInput label="Quantity" type="number" value={String(item.quantity)} onChange={(event) => updateCartQuantity(item, Number(event.target.value))} className="w-24" />}
              <strong className="w-24 text-right">₱{(item.product.unit_price * item.quantity).toFixed(2)}</strong>
              <button onClick={() => setCart((current) => current.filter((entry) => entry !== item))} className="text-xs text-[#4B3621]">Remove</button>
            </div>)}</div>}
            <div className="mt-5 flex items-center justify-between border-t pt-4"><strong className="text-[#4B3621]">Subtotal: ₱{subtotal.toFixed(2)}</strong><WireBtn disabled={cart.length === 0} onClick={() => setStep(3)}>Continue to payment <i className="bi bi-arrow-right ml-2" aria-hidden="true" /></WireBtn></div>
          </section>
        )}

        {step === 3 && (
          <section className="grid gap-5 lg:grid-cols-[1fr_0.7fr]">
            <WireCard className="rounded-2xl border-0 shadow-sm ring-1 ring-[#4B3621]/10">
              <WireSectionTitle>Step 3 — Payment details</WireSectionTitle>
              <div className="grid gap-2">{(["cash", "gcash", "maya"] as PaymentMethod[]).map((method) => <button key={method} onClick={() => setPayment(method)} className={`rounded-lg border px-3 py-3 text-left text-sm capitalize ${payment === method ? "border-[#4B3621] bg-[#E3C565]/20 font-semibold" : "border-[#4B3621]"}`}>{method === "cash" ? "Cash on pickup/delivery" : method}</button>)}</div>
              {onlinePayment && <div className="mt-4 space-y-3"><div className="rounded-lg bg-[#faf9f7] p-3 text-sm">Send to GCash: <strong>{shop?.gcash_number || "Not published"}</strong></div><WireInput label="Reference number" value={reference} onChange={(event) => setReference(event.target.value)} placeholder="Enter reference number" /><label className="block text-xs font-semibold uppercase tracking-wide text-[#4B3621]">Proof of online payment<input className="mt-1 block w-full rounded-lg border p-2 text-sm" type="file" accept="image/*" onChange={(event: ChangeEvent<HTMLInputElement>) => setProof(event.target.files?.[0] ?? null)} /></label>{proof && <p className="text-xs text-[#4B3621]">{proof.name}</p>}</div>}
            </WireCard>
            <WireCard className="rounded-2xl border-0 bg-[#4B3621] text-white shadow-sm"><p className="text-xs font-bold uppercase tracking-wider text-[#E3C565]">Order total</p><p className="mt-4 text-sm text-white/70">Items: ₱{subtotal.toFixed(2)}</p><p className="mt-1 text-sm text-white/70">Shop fee: ₱{(shop?.transaction_fee ?? 0).toFixed(2)}</p><p className="mt-5 border-t border-white/20 pt-4 text-2xl font-bold">₱{(subtotal + (shop?.transaction_fee ?? 0)).toFixed(2)}</p><WireBtn className="mt-6 w-full" disabled={onlinePayment && (!reference.trim() || !proof)} onClick={() => navigate("order-tracking")}>Submit order</WireBtn></WireCard>
          </section>
        )}
      </div>
    </StudentLayout>
  );
}
