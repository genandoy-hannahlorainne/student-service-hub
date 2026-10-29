import { useState } from "react";
import {
  StudentLayout, WireBtn, WireCard, WirePlaceholder, WireInput,
  WireSelect, WireSectionTitle, WireTextarea, WireRadioGroup,
} from "../../components/WireframeUI";

const PRODUCTS = [
  { name: "Bond Paper (Short)", price: "₱180.00", unit: "per ream (500 sheets)", qty: 48, category: "Bond Paper" },
  { name: "Bond Paper (Long)", price: "₱200.00", unit: "per ream (500 sheets)", qty: 30, category: "Bond Paper" },
  { name: "Yellow Pad Paper", price: "₱25.00", unit: "per pad", qty: 64, category: "Yellow Pad" },
  { name: "Expandable Envelope (Long)", price: "₱18.00", unit: "each", qty: 90, category: "Envelopes" },
  { name: "Plain Folder (Long)", price: "₱12.00", unit: "each", qty: 72, category: "Folders" },
  { name: "Ballpen (Blue) — Stick", price: "₱8.00", unit: "each", qty: 200, category: "Pens" },
  { name: "Index Cards (4×6, 100 pcs)", price: "₱35.00", unit: "per pack", qty: 40, category: "Index Cards" },
  { name: "Highlighter Set (4 colors)", price: "₱55.00", unit: "per set", qty: 25, category: "Other" },
];

type CartItem = { name: string; price: number; qty: number };

export default function SchoolSupplies({ navigate }: { navigate: (s: string) => void }) {
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [view, setView] = useState<"browse" | "cart" | "review">("browse");
  const [fulfillment, setFulfillment] = useState<"pickup" | "delivery">("pickup");

  const cats = ["All", "Bond Paper", "Yellow Pad", "Folders", "Envelopes", "Pens", "Index Cards", "Other"];
  const filtered = category === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === category);

  const addToCart = (p: typeof PRODUCTS[0]) => {
    setCart((prev) => {
      const exists = prev.find((c) => c.name === p.name);
      if (exists) return prev.map((c) => c.name === p.name ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { name: p.name, price: parseFloat(p.price.replace("₱", "")), qty: 1 }];
    });
  };

  const subtotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const deliveryFee = fulfillment === "delivery" ? 30 : 0;

  // ── Review view ──
  if (view === "review") {
    return (
      <StudentLayout active="school-supplies" navigate={navigate}>
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">Order Review — School Supplies</h1>
            <WireBtn variant="outline" size="sm" onClick={() => setView("cart")}>← Edit Cart</WireBtn>
          </div>

          {/* ── Bento: summary (wide) + fulfillment/payment (narrow) ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <WireCard className="md:col-span-2">
              <WireSectionTitle>Order Summary</WireSectionTitle>
              {cart.map((c) => (
                <div key={c.name} className="flex justify-between py-2 border-b border-gray-100 text-sm">
                  <span className="text-gray-700">{c.name} × {c.qty}</span>
                  <span className="font-medium">₱{(c.price * c.qty).toFixed(2)}</span>
                </div>
              ))}
              <div className="mt-3 flex flex-col gap-1 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Subtotal:</span><span>₱{subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Delivery Fee:</span><span>₱{deliveryFee.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-gray-800 text-base border-t border-gray-200 pt-2 mt-1">
                  <span>Total:</span><span>₱{(subtotal + deliveryFee).toFixed(2)}</span>
                </div>
              </div>
            </WireCard>

            <WireCard>
              <WireSectionTitle>Fulfillment &amp; Payment</WireSectionTitle>
              <div className="text-sm text-gray-700 flex flex-col gap-2">
                <p><strong>Fulfillment:</strong>{" "}
                  {fulfillment === "delivery"
                    ? "🚚 Delivery — PUP Taguig Campus"
                    : "📦 Pickup — University Organization Office"}
                </p>
                <p><strong>Payment:</strong> Cash on Pickup/Delivery</p>
              </div>
            </WireCard>
          </div>

          <div className="border-2 border-dashed border-gray-400 p-3 text-center text-sm text-gray-600 bg-gray-50">
            <strong>Confirm your order below.</strong> Orders cannot be modified once submitted.
          </div>
          <div className="flex justify-end">
            <WireBtn size="lg" onClick={() => navigate("order-tracking")}>✓ CONFIRM &amp; SUBMIT ORDER</WireBtn>
          </div>
        </div>
      </StudentLayout>
    );
  }

  // ── Cart view ──
  if (view === "cart") {
    return (
      <StudentLayout active="school-supplies" navigate={navigate}>
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">Cart ({cart.length} items)</h1>
            <WireBtn variant="ghost" size="sm" onClick={() => setView("browse")}>← Continue Shopping</WireBtn>
          </div>

          {/* ── Bento: cart items (wide) + fulfillment/payment (narrow) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
            <WireCard className="lg:col-span-2">
              <WireSectionTitle>Cart Items</WireSectionTitle>
              {cart.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">Your cart is empty.</p>
              ) : (
                cart.map((c) => (
                  <div key={c.name} className="flex items-center justify-between py-2 border-b border-gray-100 gap-3">
                    <span className="text-sm text-gray-700 flex-1">{c.name}</span>
                    <div className="flex items-center gap-2">
                      <button
                        className="w-6 h-6 border border-gray-300 text-gray-600 text-sm"
                        onClick={() => setCart(p => p.map(i => i.name === c.name ? { ...i, qty: Math.max(1, i.qty - 1) } : i))}
                      >−</button>
                      <span className="w-6 text-center text-sm font-mono">{c.qty}</span>
                      <button
                        className="w-6 h-6 border border-gray-300 text-gray-600 text-sm"
                        onClick={() => setCart(p => p.map(i => i.name === c.name ? { ...i, qty: i.qty + 1 } : i))}
                      >+</button>
                    </div>
                    <span className="text-sm font-medium w-20 text-right">₱{(c.price * c.qty).toFixed(2)}</span>
                    <button
                      className="text-gray-400 hover:text-gray-700 text-xs"
                      onClick={() => setCart(p => p.filter(i => i.name !== c.name))}
                    >✕</button>
                  </div>
                ))
              )}
            </WireCard>

            <WireCard>
              <WireSectionTitle>Fulfillment &amp; Payment</WireSectionTitle>
              <div className="flex gap-3 mb-4">
                {(["pickup", "delivery"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFulfillment(f)}
                    className={`flex-1 py-2.5 text-sm font-medium border capitalize transition-colors ${
                      fulfillment === f ? "bg-gray-800 text-white border-gray-800" : "border-gray-300 text-gray-600"
                    }`}
                  >
                    {f === "pickup" ? "📦 Pickup" : "🚚 Delivery"}
                  </button>
                ))}
              </div>
              {fulfillment === "delivery" && (
                <WireInput label="Delivery Address" placeholder="Within PUP Taguig campus area" className="mb-3" />
              )}
              <WireRadioGroup name="pay" label="Payment Method" options={["Cash on Pickup/Delivery", "GCash", "Maya"]} />
              <div className="mt-4 border border-gray-200 p-3 bg-gray-50 text-sm flex flex-col gap-1">
                <div className="flex justify-between"><span className="text-gray-500">Subtotal:</span><span>₱{subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Delivery:</span><span>₱{deliveryFee.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold border-t border-gray-200 pt-2 mt-1 text-gray-800">
                  <span>Total:</span><span>₱{(subtotal + deliveryFee).toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-4">
                <WireBtn size="lg" className="w-full" onClick={() => setView("review")} disabled={cart.length === 0}>
                  Review Order →
                </WireBtn>
              </div>
            </WireCard>
          </div>
        </div>
      </StudentLayout>
    );
  }

  // ── Browse view ──
  return (
    <StudentLayout active="school-supplies" navigate={navigate}>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">School Supplies</h1>
            <p className="text-sm text-gray-500 mt-1">Academic materials available from University Organization</p>
          </div>
          <WireBtn onClick={() => setView("cart")}>🛒 Cart ({cart.length})</WireBtn>
        </div>

        {/* Search + category filter */}
        <div className="flex flex-col gap-3">
          <WireInput placeholder="Search supplies..." />
          <div className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 text-xs border font-medium transition-colors ${
                  category === c ? "bg-gray-800 text-white border-gray-800" : "border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* ── Bento product grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <WireCard key={p.name} className="flex flex-col gap-2">
              <WirePlaceholder label="Product Image" className="h-24 w-full" />
              <p className="text-sm font-semibold text-gray-800 leading-snug flex-1">{p.name}</p>
              <p className="text-xs text-gray-500">{p.unit}</p>
              <p className="text-base font-bold text-gray-900">{p.price}</p>
              <p className="text-xs text-gray-400">Available: {p.qty}</p>
              <WireBtn size="sm" variant="outline" onClick={() => addToCart(p)}>+ Add to Cart</WireBtn>
            </WireCard>
          ))}
        </div>
      </div>
    </StudentLayout>
  );
}
