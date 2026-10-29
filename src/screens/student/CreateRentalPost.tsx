import {
  StudentLayout, WireBtn, WireCard, WireInput, WireSelect, WireTextarea,
  WireSectionTitle, WirePlaceholder,
} from "../../components/WireframeUI";

export default function CreateRentalPost({ navigate }: { navigate: (s: string) => void }) {
  return (
    <StudentLayout active="resource-rental" navigate={navigate}>
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Create Rental Post</h1>
          <p className="text-sm text-gray-500 mt-1">Share a resource for rent or post what you need</p>
        </div>

        <div className="border border-dashed border-gray-400 p-3 bg-gray-50 text-sm text-gray-600">
          <strong>Note:</strong> Your post will be reviewed by an Administrator before becoming publicly visible
          in the Student Resource Hub. This usually takes 1–2 business days.
        </div>

        {/* ── Bento: left (post type + category + title + image) | right (description + details) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">

          {/* Left column — 2 cols */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Post Type */}
            <WireCard>
              <WireSectionTitle>Post Type</WireSectionTitle>
              <div className="flex flex-col gap-2">
                {["Looking For", "Available for Rent"].map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 cursor-pointer border border-gray-300 px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <input type="radio" name="postType" className="w-4 h-4" defaultChecked={type === "Available for Rent"} />
                    <span className="text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </WireCard>

            {/* Category */}
            <WireCard>
              <WireSectionTitle>Category</WireSectionTitle>
              <WireSelect
                options={[
                  "Select category...", "Typewriter", "Calculator", "Laptop",
                  "Projector", "Books", "School Equipment", "Project Materials", "Other School Resources",
                ]}
              />
            </WireCard>

            {/* Image upload */}
            <WireCard>
              <WireSectionTitle>Upload Image (Optional)</WireSectionTitle>
              <div className="border-2 border-dashed border-gray-300 p-5 text-center bg-gray-50">
                <WirePlaceholder label="Click or drag image file here (JPG, PNG)" className="h-24 w-full mb-2" />
                <WireBtn variant="outline" size="sm">📷 Upload Image</WireBtn>
                <p className="text-xs text-gray-400 mt-2">Max 5MB · JPG or PNG</p>
              </div>
            </WireCard>
          </div>

          {/* Right column — 3 cols */}
          <WireCard className="lg:col-span-3">
            <WireSectionTitle>Post Details</WireSectionTitle>
            <div className="flex flex-col gap-4">
              <WireInput label="Post Title" placeholder="e.g. Typewriter available for rent — Good condition" />

              <WireTextarea
                label="Description (40–70 words recommended)"
                placeholder="Describe your item or what you are looking for. Include condition, availability, any special notes, and rental terms. Keep it clear and concise for other students."
                rows={6}
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <WireInput label="Location" placeholder="e.g. PUP Taguig Campus" />
                <WireInput label="Rental Price / Rate" placeholder="e.g. ₱50/day, or Free" />
              </div>

              <WireInput label="Availability" placeholder="e.g. Dec 15–20, Weekdays only, After 5pm" />
            </div>
          </WireCard>
        </div>

        {/* ── Actions ── */}
        <div className="flex gap-3 justify-between">
          <WireBtn variant="outline" onClick={() => navigate("resource-rental")}>← Back to Hub</WireBtn>
          <WireBtn size="lg" onClick={() => navigate("rental-post-status")}>Submit for Approval</WireBtn>
        </div>
      </div>
    </StudentLayout>
  );
}
