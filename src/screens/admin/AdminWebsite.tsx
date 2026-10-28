import { useState } from "react";
import { AdminLayout, WireInput, WireTextarea } from "../../components/WireframeUI";

type Section = "landing" | "services" | "announcements" | "terms" | "team";

const NAV: { key: Section; label: string; icon: string }[] = [
  { key: "landing",       label: "Landing Page",    icon: "bi-house"              },
  { key: "services",      label: "Services",        icon: "bi-grid"               },
  { key: "announcements", label: "Announcements",   icon: "bi-megaphone"          },
  { key: "terms",         label: "Terms & Services",icon: "bi-file-earmark-text"  },
  { key: "team",          label: "Project Team",    icon: "bi-people"             },
];

const ANNOUNCEMENTS = [
  { title: "Holiday Schedule Notice",  date: "Oct 5, 2026",  status: "published" },
  { title: "New Printing Shop Partner",date: "Sep 28, 2026", status: "published" },
  { title: "System Maintenance",       date: "Oct 8, 2026",  status: "draft"     },
];

export default function AdminWebsite({ navigate }: { navigate: (s: string) => void }) {
  const [active, setActive] = useState<Section>("landing");
  const [saved,  setSaved]  = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <AdminLayout active="admin-website" navigate={navigate}>
      <div className="flex flex-col gap-4 pb-4">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="rounded-[24px] bg-[#4B3621] text-white p-6 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border-[24px] border-[#E3C565]/25 pointer-events-none" />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E3C565]">Admin · Website</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Website Content Management</h1>
          <p className="mt-1 text-sm text-[#E3C565]/70">Edit and manage public-facing content for UniServe.</p>
        </div>

        {/* ── Section nav tiles ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {NAV.map((n) => (
            <button
              key={n.key}
              onClick={() => setActive(n.key)}
              className={`rounded-[18px] p-4 flex flex-col gap-2 text-left transition hover:-translate-y-0.5 ${active === n.key ? "bg-[#4B3621] text-white shadow-lg" : "bg-white ring-1 ring-[#4B3621]/10 text-[#4B3621] hover:bg-[#fdf8f0]"}`}
            >
              <i className={`bi ${n.icon} text-xl`} />
              <span className="text-xs font-semibold leading-tight">{n.label}</span>
            </button>
          ))}
        </div>

        {/* ── Editor panel ────────────────────────────────────────────── */}
        <div className="rounded-[24px] bg-white ring-1 ring-[#4B3621]/10 p-6 flex flex-col gap-5">

          <div className="flex items-center gap-2 border-b border-[#4B3621]/10 pb-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E3C565] text-[#4B3621] text-sm shrink-0">
              <i className={`bi ${NAV.find(n => n.key === active)?.icon}`} />
            </span>
            <h2 className="font-bold text-[#4B3621]">{NAV.find(n => n.key === active)?.label}</h2>
          </div>

          {/* Landing */}
          {active === "landing" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2"><WireInput label="Hero Headline" placeholder="Make school days a little easier." /></div>
              <div className="sm:col-span-2"><WireInput label="Hero Subtitle" placeholder="Printing, supplies, and academic resources for PUP Taguig." /></div>
              <div className="sm:col-span-2"><WireTextarea label="Hero Description" rows={3} placeholder="Describe the platform briefly…" /></div>
              <WireInput label="About Section Title" placeholder="About UniServe" />
              <div className="sm:col-span-2"><WireTextarea label="About Section Content" rows={4} placeholder="About text…" /></div>
            </div>
          )}

          {/* Services */}
          {active === "services" && (
            <div className="flex flex-col gap-5">
              {["Printing Services", "School Supplies", "Resource Rental Hub"].map((svc) => (
                <div key={svc} className="rounded-2xl bg-[#fdf8f0] p-4 flex flex-col gap-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#4B3621]/50">{svc}</p>
                  <WireInput label="Service Title" placeholder={svc} />
                  <WireTextarea label="Description" rows={3} placeholder="Describe the service…" />
                </div>
              ))}
            </div>
          )}

          {/* Announcements */}
          {active === "announcements" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#4B3621]">Active Announcements</p>
                <button className="rounded-xl bg-[#4B3621] px-4 py-2 text-xs font-semibold text-white hover:bg-[#3a2918] transition">
                  <i className="bi bi-plus-lg mr-1.5" />New
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {ANNOUNCEMENTS.map((a) => (
                  <div key={a.title} className={`rounded-2xl p-4 flex flex-col gap-3 ${a.status === "draft" ? "bg-gray-50 ring-1 ring-gray-200" : "bg-[#fdf8f0]"}`}>
                    <div className="flex items-center justify-between">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${a.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>{a.status}</span>
                      <span className="text-[10px] text-[#4B3621]/40">{a.date}</span>
                    </div>
                    <p className="text-sm font-semibold text-[#4B3621] leading-snug">{a.title}</p>
                    <div className="flex gap-2 mt-auto">
                      <button className="flex-1 rounded-lg border border-[#4B3621]/15 py-1.5 text-xs font-medium text-[#4B3621] hover:bg-white transition">Edit</button>
                      <button className="flex-1 rounded-lg border border-red-200 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 transition">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Terms */}
          {active === "terms" && (
            <div className="flex flex-col gap-3">
              <WireTextarea
                label="Terms and Services Content"
                rows={14}
                placeholder={"1. PUPTians must use official PUP student credentials.\n2. Service Providers must be officially approved.\n3. Delivery fees are agreed upon between UniServe and providers.\n\nEdit and format full terms here."}
              />
              <p className="text-xs text-[#4B3621]/40">Last updated: October 1, 2026</p>
            </div>
          )}

          {/* Team */}
          {active === "team" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#4B3621]">Team Members</p>
                <button className="rounded-xl bg-[#4B3621] px-4 py-2 text-xs font-semibold text-white hover:bg-[#3a2918] transition">
                  <i className="bi bi-plus-lg mr-1.5" />Add Member
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="rounded-2xl bg-[#fdf8f0] p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#4B3621]/10 flex items-center justify-center text-sm font-bold text-[#4B3621] shrink-0">{i}</div>
                    <div className="flex flex-col gap-1.5 flex-1">
                      <WireInput placeholder="Full Name" />
                      <WireInput placeholder="Role / Year Level" />
                    </div>
                    <button className="rounded-lg border border-red-200 px-2 py-1.5 text-xs text-red-500 hover:bg-red-50 transition shrink-0">Remove</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Save bar */}
          <div className="flex gap-2 pt-4 border-t border-[#4B3621]/10">
            <button onClick={save} className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${saved ? "bg-green-600 text-white" : "bg-[#4B3621] text-white hover:bg-[#3a2918]"}`}>
              {saved ? "✓ Saved" : "Save Changes"}
            </button>
            <button className="rounded-xl border border-[#4B3621]/20 px-5 py-2.5 text-sm font-semibold text-[#4B3621] hover:bg-[#fdf8f0] transition">Preview</button>
            <button className="rounded-xl border border-[#4B3621]/20 px-5 py-2.5 text-sm font-semibold text-[#4B3621] hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition">Reset</button>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
