import { StudentLayout, WireBtn, WireCard, WirePlaceholder, WireInput } from "../../components/WireframeUI";

export default function BrowseServices({ navigate }: { navigate: (s: string) => void }) {
  return (
    <StudentLayout active="browse-services" navigate={navigate}>
      <div className="flex flex-col gap-5">

        {/* ── Page header ── */}
        <div>
          <h1 className="text-xl font-bold text-gray-800">Browse Services</h1>
          <p className="text-sm text-gray-500 mt-1">Explore University Organization&apos;s available student services</p>
        </div>

        {/* ── Search + filter ── */}
        <div className="flex gap-3 flex-wrap">
          <WireInput placeholder="Search services..." className="flex-1 min-w-48" />
          <div className="flex gap-2 flex-wrap">
            {["All", "Printing", "Supplies", "Rental"].map((f) => (
              <button
                key={f}
                className={`px-3 py-2 text-xs border font-medium transition-colors ${
                  f === "All"
                    ? "bg-gray-800 text-white border-gray-800"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* ── Bento service grid ── */}
        {/* On md+: Printing takes the tall left cell (row-span-2), Supplies + Rental stack on the right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Printing — tall card */}
          <WireCard className="flex flex-col gap-3 md:row-span-2">
            <WirePlaceholder label="Printing Services Banner" className="h-48 w-full" />
            <h2 className="text-base font-bold text-gray-800">Printing Services</h2>
            <p className="text-sm text-gray-600 flex-1">
              Upload your documents and have them printed by University Organization-approved printing shops near
              PUP Taguig. Choose color or B&amp;W, paper size, and pickup or delivery options.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {["File upload", "Multiple copies", "Color / B&W", "Pickup or Delivery"].map((f) => (
                <span key={f} className="text-xs border border-gray-300 px-2 py-0.5 text-gray-500">{f}</span>
              ))}
            </div>
            <WireBtn size="lg" onClick={() => navigate("printing-service")} className="w-full">
              View Service
            </WireBtn>
          </WireCard>

          {/* School Supplies */}
          <WireCard className="flex flex-col gap-3">
            <WirePlaceholder label="School Supplies Banner" className="h-28 w-full" />
            <h2 className="text-base font-bold text-gray-800">School Supplies</h2>
            <p className="text-sm text-gray-600 flex-1">
              Purchase essential academic materials including bond paper, yellow pad, folders, envelopes, pens,
              index cards, and other school supplies.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {["Various categories", "Add to cart", "Pickup or Delivery", "E-wallet or Cash"].map((f) => (
                <span key={f} className="text-xs border border-gray-300 px-2 py-0.5 text-gray-500">{f}</span>
              ))}
            </div>
            <WireBtn size="lg" onClick={() => navigate("school-supplies")} className="w-full">
              Browse Supplies
            </WireBtn>
          </WireCard>

          {/* Resource Rental */}
          <WireCard className="flex flex-col gap-3">
            <WirePlaceholder label="Resource Rental Banner" className="h-28 w-full" />
            <h2 className="text-base font-bold text-gray-800">School Resource Rental</h2>
            <p className="text-sm text-gray-600 flex-1">
              Student-to-student resource sharing hub. Post items available for rent or browse listings for
              equipment you need. Moderated by administrators.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {["Typewriters", "Calculators", "Laptops", "Books & Equipment"].map((f) => (
                <span key={f} className="text-xs border border-gray-300 px-2 py-0.5 text-gray-500">{f}</span>
              ))}
            </div>
            <WireBtn size="lg" onClick={() => navigate("resource-rental")} className="w-full">
              Explore Resources
            </WireBtn>
          </WireCard>
        </div>

        {/* ── Guest notice ── */}
        <div className="border border-dashed border-gray-400 p-4 bg-gray-50 text-center">
          <p className="text-sm text-gray-600">
            You are browsing as a <strong>Guest</strong>.{" "}
            <span className="underline cursor-pointer text-gray-800" onClick={() => navigate("register")}>
              Register as a PUPTian
            </span>{" "}
            to place orders and access all features.
          </p>
        </div>
      </div>
    </StudentLayout>
  );
}
