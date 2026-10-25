import {
  StudentLayout, WireBtn, WireCard, WireInput, WireSelect, WireTextarea,
  WireSectionTitle, WirePlaceholder,
} from "../../components/WireframeUI";

export default function CreateRentalPost({ navigate }: { navigate: (s: string) => void }) {
  return (
    <StudentLayout active="resource-rental" navigate={navigate}>
      <div className="flex flex-col gap-5 max-w-2xl">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Create Rental Post</h1>
          <p className="text-sm text-gray-500 mt-1">Share a resource for rent or post what you need</p>
        </div>

        <div className="border border-dashed border-gray-400 p-3 bg-gray-50 text-sm text-gray-600">
          <strong>Note:</strong> Your post will be reviewed by an Administrator before becoming publicly visible in the Student Resource Hub. This usually takes 1“2 business days.
        </div>

        <WireCard>
          <WireSectionTitle>Post Details</WireSectionTitle>
          <div className="flex flex-col gap-4">

            {/* Post type */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Post Type</p>
              <div className="flex gap-3">
                {["Looking For", "Available for Rent"].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer border border-gray-300 px-4 py-2.5 flex-1 hover:bg-gray-50">
                    <input type="radio" name="postType" className="w-4 h-4" defaultChecked={type === "Available for Rent"} />
                    <span className="text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <WireSelect
              label="Category"
              options={["Select category...", "Typewriter", "Calculator", "Laptop", "Projector", "Books", "School Equipment", "Project Materials", "Other School Resources"]}
            />

            <WireInput label="Post Title" placeholder="e.g. Typewriter available for rent â€” Good condition" />

            <WireTextarea
              label="Description (40“70 words recommended)"
              placeholder="Describe your item or what you are looking for. Include condition, availability, any special notes, and rental terms. Keep it clear and concise for other students."
              rows={5}
            />

            <WireInput label="Location" placeholder="e.g. PUP Taguig Campus, or Taguig City area" />

            <WireInput label="Rental Price / Rate" placeholder="e.g. â‚±50/day, â‚±200/week, or Free" />

            <WireInput label="Availability" placeholder="e.g. Dec 15“20, Weekdays only, After 5pm" />

            {/* Image upload */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Upload Image (Optional)</p>
              <div className="border-2 border-dashed border-gray-300 p-6 text-center bg-gray-50">
                <WirePlaceholder label="Click or drag image file here (JPG, PNG)" className="h-20 w-full mb-2" />
                <WireBtn variant="outline" size="sm">ðŸ“· Upload Image</WireBtn>
                <p className="text-xs text-gray-400 mt-2">Max 5MB Â· JPG or PNG</p>
              </div>
            </div>

          </div>
        </WireCard>

        <div className="flex gap-3 justify-between">
          <WireBtn variant="outline" onClick={() => navigate("resource-rental")}>â† Back to Hub</WireBtn>
          <WireBtn size="lg" onClick={() => navigate("rental-post-status")}>Submit for Approval</WireBtn>
        </div>
      </div>
    </StudentLayout>
  );
}
