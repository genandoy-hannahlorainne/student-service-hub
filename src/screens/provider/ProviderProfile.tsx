import {
  ProviderLayout, WireCard, WireBadge, WireSectionTitle, WirePlaceholder, WireBtn,
} from "../../components/WireframeUI";

export default function ProviderProfile({ navigate }: { navigate: (s: string) => void }) {
  return (
    <ProviderLayout active="provider-profile" navigate={navigate}>
      <div className="flex flex-col gap-5 max-w-2xl">
        <h1 className="text-xl font-bold text-gray-800">Provider Profile</h1>

        {/* Provider identity */}
        <WireCard className="flex items-center gap-4">
          <WirePlaceholder label="Shop Logo" className="w-20 h-20 shrink-0" />
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold text-gray-800">Speedy Print Shop</h2>
            <WireBadge variant="success">âœ“ University Organization-approved Collaborator</WireBadge>
            <p className="text-xs text-gray-500 mt-1">Member since October 2025</p>
          </div>
        </WireCard>

        {/* Business Info */}
        <WireCard>
          <WireSectionTitle>Business Information</WireSectionTitle>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            {[
              ["Provider Name", "Speedy Print Shop"],
              ["Contact Person", "Ramon Villanueva"],
              ["Email Address", "speedyprint.taguig@gmail.com"],
              ["Contact Number", "0917-XXX-XXXX"],
              ["Business Address", "Purok 3, Western Bicutan, Taguig City (near PUP Taguig Main Gate)"],
              ["Service Type", "Printing Services"],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{k}</span>
                <span className="text-gray-800">{v}</span>
              </div>
            ))}
          </div>
        </WireCard>

        {/* Services Offered */}
        <WireCard>
          <WireSectionTitle>Services Offered</WireSectionTitle>
          <div className="flex flex-wrap gap-2">
            {["Black & White Printing", "Color Printing", "Document Binding (Spiral)", "Lamination", "Scanning", "Photo Printing"].map((s) => (
              <span key={s} className="border border-gray-300 px-3 py-1 text-sm text-gray-700">{s}</span>
            ))}
          </div>
        </WireCard>

        {/* Collaboration & Delivery */}
        <WireCard>
          <WireSectionTitle>Collaboration Status &amp; Delivery Fee</WireSectionTitle>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Collaboration Status:</span>
              <WireBadge variant="success">Active Collaborator</WireBadge>
            </div>

            <div className="border border-gray-200 p-3 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Agreed Delivery Fee:</span>
                <span className="text-lg font-bold text-gray-800">â‚±30.00</span>
              </div>
              <p className="text-xs text-gray-500">This fee was agreed upon between University Organization and Speedy Print Shop as of October 15, 2025.</p>
            </div>

            <div className="border border-dashed border-gray-400 p-3 bg-gray-50">
              <p className="text-xs text-gray-600">
                <strong>âš  Important Notice:</strong> The delivery fee displayed above is an <strong>agreed rate between University Organization and this Service Provider</strong>.
                The delivery fee <strong>cannot be changed independently</strong> by the Service Provider.
                Any changes to the delivery fee must be discussed with and approved by University Organization administration, and a new collaboration agreement must be signed.
              </p>
            </div>
          </div>
        </WireCard>

        {/* Availability */}
        <WireCard>
          <WireSectionTitle>Operating Hours &amp; Availability</WireSectionTitle>
          <div className="flex flex-col gap-2 text-sm">
            {[
              ["Monday “ Friday", "8:00 AM “ 7:00 PM"],
              ["Saturday", "8:00 AM “ 5:00 PM"],
              ["Sunday", "Closed"],
              ["Holidays", "By appointment only"],
            ].map(([day, hours]) => (
              <div key={day} className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-600">{day}</span>
                <span className="font-medium text-gray-800">{hours}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-gray-600">Current Status:</span>
            <WireBadge variant="success">Open</WireBadge>
          </div>
        </WireCard>

        <WireBtn variant="outline" className="self-start" onClick={() => navigate("provider-dashboard")}>
          â† Back to Dashboard
        </WireBtn>
      </div>
    </ProviderLayout>
  );
}
