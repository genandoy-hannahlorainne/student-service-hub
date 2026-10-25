import { useState } from "react";
import {
  AdminLayout, WireBtn, WireCard, WireSectionTitle, WireTextarea, WireInput,
} from "../../components/WireframeUI";

const SECTIONS = ["Landing Page Content", "Services", "Announcements", "Terms and Services", "Project Team"];

export default function AdminWebsite({ navigate }: { navigate: (s: string) => void }) {
  const [active, setActive] = useState("Landing Page Content");

  return (
    <AdminLayout active="admin-website" navigate={navigate}>
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Website Content Management</h1>
          <p className="text-sm text-gray-500 mt-1">Edit and manage public-facing website content</p>
        </div>

        <div className="flex flex-col md:flex-row gap-5">
          {/* Section nav */}
          <aside className="w-full md:w-48 shrink-0">
            <div className="border border-gray-300 bg-white">
              {SECTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setActive(s)}
                  className={`w-full text-left px-4 py-3 text-sm border-b border-gray-200 last:border-0 transition-colors ${active === s ? "bg-gray-800 text-white font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </aside>

          {/* Editor panel */}
          <div className="flex-1 flex flex-col gap-4">
            <WireCard>
              <WireSectionTitle>Editing: {active}</WireSectionTitle>

              {active === "Landing Page Content" && (
                <div className="flex flex-col gap-4">
                  <WireInput label="Hero Headline" placeholder="PASOA STUDENT SERVICES" />
                  <WireInput label="Hero Subtitle" placeholder="A Web-Based Student Service and Resource Platform for PUP Taguig" />
                  <WireTextarea label="Hero Description" placeholder="Students can access printing, school supplies, and school-resource rentals." rows={3} />
                  <WireInput label="About Section Title" placeholder="About the Website" />
                  <WireTextarea label="About Section Content" rows={4} placeholder="About text..." />
                </div>
              )}

              {active === "Services" && (
                <div className="flex flex-col gap-5">
                  {["Printing Services", "School Supplies", "School Resource Rental"].map((svc) => (
                    <div key={svc} className="border border-gray-200 p-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-3">{svc}</p>
                      <WireInput label="Service Title" placeholder={svc} className="mb-3" />
                      <WireTextarea label="Service Description" rows={3} placeholder="Describe the service..." />
                    </div>
                  ))}
                </div>
              )}

              {active === "Announcements" && (
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold text-gray-700">Active Announcements</p>
                    <WireBtn size="sm">+ New Announcement</WireBtn>
                  </div>
                  {[
                    { title: "Holiday Schedule Notice", date: "Dec 5, 2025", status: "Published" },
                    { title: "New Printing Shop Partner", date: "Nov 28, 2025", status: "Published" },
                    { title: "System Maintenance — Dec 20", date: "Dec 8, 2025", status: "Draft" },
                  ].map((a) => (
                    <div key={a.title} className="border border-gray-200 p-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{a.title}</p>
                        <p className="text-xs text-gray-400">{a.date} · {a.status}</p>
                      </div>
                      <div className="flex gap-2">
                        <WireBtn size="sm" variant="outline">Edit</WireBtn>
                        <WireBtn size="sm" variant="secondary">Delete</WireBtn>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {active === "Terms and Services" && (
                <div className="flex flex-col gap-4">
                  <WireTextarea
                    label="Terms and Services Content"
                    rows={12}
                    placeholder={"1. PUPTians must use official PUP student credentials...\n2. Service Providers must be officially approved...\n3. Delivery fees are agreed upon between PASOA and providers...\n\nEdit and format full Terms and Services text here."}
                  />
                  <p className="text-xs text-gray-400">Last updated: December 1, 2025</p>
                </div>
              )}

              {active === "Project Team" && (
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold text-gray-700">Team Members</p>
                    <WireBtn size="sm">+ Add Member</WireBtn>
                  </div>
                  {["Team Member 1", "Team Member 2", "Team Member 3", "Team Member 4", "Team Member 5"].map((m, i) => (
                    <div key={m} className="border border-gray-200 p-3 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 border border-gray-300 flex items-center justify-center text-xs text-gray-400">{i + 1}</div>
                      <div className="flex flex-col gap-1 flex-1">
                        <WireInput placeholder="Full Name" className="mb-1" />
                        <WireInput placeholder="Role / Year Level" />
                      </div>
                      <WireBtn size="sm" variant="secondary">Remove</WireBtn>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 mt-5 pt-4 border-t border-gray-200">
                <WireBtn>Save Changes</WireBtn>
                <WireBtn variant="outline">Preview</WireBtn>
                <WireBtn variant="secondary">Reset</WireBtn>
              </div>
            </WireCard>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
