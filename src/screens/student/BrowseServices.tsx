import { StudentLayout, WireBtn, WireCard, WirePlaceholder, WireInput } from "../../components/WireframeUI";

export default function BrowseServices({ navigate }: { navigate: (s: string) => void }) {
  return (
    <StudentLayout active="browse-services" navigate={navigate}>
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Browse Services</h1>
          <p className="text-sm text-gray-500 mt-1">Explore University Organization&apos;s available student services</p>
        </div>

        {/* Search + filter */}
        <div className="flex gap-3 flex-wrap">
          <WireInput placeholder="Search services..." className="flex-1 min-w-48" />
          <div className="flex gap-2 flex-wrap">
            {["All", "Printing", "Supplies", "Rental"].map((f) => (
              <button
                key={f}
                className={`px-3 py-2 text-xs border font-medium ${f === "All" ? "bg-gray-800 text-white border-gray-800" : "border-gray-300 text-gray-600 hover:bg-gray-50"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Service cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              title: "Printing Services",
              desc: "Upload your documents and have them printed by University Organization-approved printing shops near PUP Taguig. Choose color or B&W, paper size, and pickup or delivery options.",
              screen: "printing-service",
              cta: "View Service",
              features: ["File upload", "Multiple copies", "Color / B&W", "Pickup or Delivery"],
            },
            {
              title: "School Supplies",
              desc: "Purchase essential academic materials including bond paper, yellow pad, folders, envelopes, pens, index cards, and other school supplies.",
              screen: "school-supplies",
              cta: "Browse Supplies",
              features: ["Various categories", "Add to cart", "Pickup or Delivery", "E-wallet or Cash"],
            },
            {
              title: "School Resource Rental",
              desc: "Student-to-student resource sharing hub. Post items available for rent or browse listings for equipment you need. Moderated by administrators.",
              screen: "resource-rental",
              cta: "Explore Resources",
              features: ["Typewriters", "Calculators", "Laptops", "Books & Equipment"],
            },
          ].map((s) => (
            <WireCard key={s.title} className="flex flex-col gap-3">
              <WirePlaceholder label={`${s.title} Banner`} className="h-36 w-full" />
              <h2 className="text-base font-bold text-gray-800">{s.title}</h2>
              <p className="text-sm text-gray-600 flex-1">{s.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {s.features.map((f) => (
                  <span key={f} className="text-xs border border-gray-300 px-2 py-0.5 text-gray-500">{f}</span>
                ))}
              </div>
              <WireBtn size="lg" onClick={() => navigate(s.screen)} className="w-full">{s.cta}</WireBtn>
            </WireCard>
          ))}
        </div>

        {/* Guest notice */}
        <div className="border border-dashed border-gray-400 p-4 bg-gray-50 text-center">
          <p className="text-sm text-gray-600">
            You are browsing as a <strong>Guest</strong>.{" "}
            <span className="underline cursor-pointer text-gray-800" onClick={() => navigate("register")}>Register as a PUPTian</span>{" "}
            to place orders and access all features.
          </p>
        </div>
      </div>
    </StudentLayout>
  );
}
