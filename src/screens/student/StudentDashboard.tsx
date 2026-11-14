import { useEffect, useState } from "react";
import { StudentLayout, WireBadge, WireBtn, WireCard } from "../../components/WireframeUI";
import { useAuth } from "../../context/AuthContext";

const serviceCards = [
  { title: "Printing", icon: "bi-printer", description: "Send documents to print", screen: "printing-service", tone: "dark" },
  { title: "School supplies", icon: "bi-bag", description: "Find academic essentials", screen: "school-supplies", tone: "orange" },
  { title: "Resource rental", icon: "bi-box-seam", description: "Borrow or share resources", screen: "resource-rental", tone: "purple" },
];

const stats = [
  { label: "Active orders", icon: "bi-receipt", screen: "order-tracking", note: "No order records yet" },
  { label: "Rental posts", icon: "bi-box-seam", screen: "rental-post-status", note: "No rental records yet" },
  { label: "Transactions", icon: "bi-arrow-left-right", screen: "transaction-receipt", note: "No transaction records yet" },
];

export default function StudentDashboard({ navigate }: { navigate: (s: string) => void }) {
  const { profile, refreshProfile } = useAuth();
  const [lastUpdated, setLastUpdated] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      void refreshProfile()
        .then(() => setLastUpdated(new Date()))
        .catch((error: unknown) => console.error("[StudentDashboard] profile refresh failed:", error));
    }, 30_000);
    return () => window.clearInterval(timer);
  }, [refreshProfile]);

  const name = profile?.display_name || "Student";
  const initials = name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  return (
    <StudentLayout active="student-dashboard" navigate={navigate}>
      <div className="mx-auto max-w-[1440px] space-y-6">
        <section className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff765e]">Student dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#1d1b20] sm:text-4xl">Good morning, {name}</h1>
            <p className="mt-2 text-sm text-[#68636d]">Stay on top of your services, requests, and student activity.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1d1b20] text-sm font-bold text-white">{initials}</div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#9a959e]">Account status</p>
              <WireBadge variant={profile?.account_status === "active" ? "success" : "pending"}>{profile?.account_status || "Loading"}</WireBadge>
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
          <WireCard className="relative overflow-hidden border-0 bg-[#1d1b20] p-6 text-white shadow-[0_14px_35px_rgba(29,27,32,0.12)] sm:p-8">
            <div className="absolute -right-12 -top-14 h-44 w-44 rounded-full bg-[#ff765e]/20" />
            <div className="relative">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">Your student account</p>
                <i className="bi bi-wallet2 text-xl text-[#ff765e]" aria-hidden="true" />
              </div>
              <p className="mt-8 text-4xl font-semibold tracking-tight">Ready to serve</p>
              <p className="mt-2 max-w-md text-sm leading-6 text-white/60">
                Access printing, supplies, rentals, and your service records from one place.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <WireBtn onClick={() => navigate("browse-services")} className="rounded-xl bg-[#ff765e] px-5 text-white hover:bg-[#e85b46]">
                  Browse services <i className="bi bi-arrow-up-right ml-2" aria-hidden="true" />
                </WireBtn>
                <WireBtn variant="ghost" onClick={() => navigate("transaction-receipt")} className="rounded-xl text-white/75 hover:bg-white/10 hover:text-white">
                  View activity
                </WireBtn>
              </div>
            </div>
          </WireCard>

          <WireCard className="border-0 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9a959e]">Profile sync</p>
                <h2 className="mt-1 text-lg font-semibold text-[#1d1b20]">Live connection</h2>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff0ed] text-[#ff765e]"><i className="bi bi-broadcast-pin" aria-hidden="true" /></span>
            </div>
            <div className="mt-7 flex items-end justify-between">
              <div>
                <p className="text-3xl font-semibold text-[#1d1b20]">Online</p>
                <p className="mt-1 text-xs text-[#9a959e]">Last synced {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
              </div>
              <i className="bi bi-check-circle-fill text-2xl text-[#6f62d8]" aria-hidden="true" />
            </div>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#f1eff3]"><div className="h-full w-full rounded-full bg-[#6f62d8]" /></div>
          </WireCard>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <button key={stat.label} onClick={() => navigate(stat.screen)} className="group rounded-2xl border border-[#e7e3e9] bg-white p-5 text-left shadow-[0_8px_24px_rgba(29,27,32,0.04)] transition hover:-translate-y-1 hover:border-[#ff765e]">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f6f5f7] text-[#68636d] transition group-hover:bg-[#fff0ed] group-hover:text-[#ff765e]"><i className={`bi ${stat.icon}`} aria-hidden="true" /></span>
                <i className="bi bi-arrow-up-right text-[#b8b3bb] transition group-hover:text-[#ff765e]" aria-hidden="true" />
              </div>
              <p className="mt-7 text-xs font-bold uppercase tracking-[0.16em] text-[#9a959e]">{stat.label}</p>
              <p className="mt-1 text-3xl font-semibold text-[#1d1b20]">0</p>
              <p className="mt-1 text-xs text-[#9a959e]">{stat.note}</p>
            </button>
          ))}
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff765e]">Services</p>
              <h2 className="mt-1 text-xl font-semibold text-[#1d1b20]">What do you need today?</h2>
            </div>
            <WireBtn variant="outline" size="sm" onClick={() => navigate("browse-services")} className="rounded-xl">View all</WireBtn>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {serviceCards.map((service) => (
              <button key={service.title} onClick={() => navigate(service.screen)} className={`group rounded-2xl p-6 text-left transition hover:-translate-y-1 hover:shadow-lg ${service.tone === "dark" ? "bg-[#1d1b20] text-white" : service.tone === "orange" ? "bg-[#ff765e] text-white" : "bg-[#756be2] text-white"}`}>
                <div className="flex items-center justify-between">
                  <i className={`bi ${service.icon} text-2xl`} aria-hidden="true" />
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 transition group-hover:bg-white/25"><i className="bi bi-arrow-up-right" aria-hidden="true" /></span>
                </div>
                <h3 className="mt-12 font-semibold">{service.title}</h3>
                <p className="mt-1 text-sm text-white/70">{service.description}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
          <WireCard className="border-0 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9a959e]">Recent activity</p>
                <h2 className="mt-1 text-lg font-semibold text-[#1d1b20]">No activity yet</h2>
              </div>
              <button onClick={() => navigate("order-tracking")} className="text-xs font-semibold text-[#ff765e]">See all <i className="bi bi-arrow-right ml-1" aria-hidden="true" /></button>
            </div>
            <div className="mt-5 rounded-2xl border border-dashed border-[#d9d4dc] bg-[#faf9fb] p-8 text-center">
              <i className="bi bi-activity text-2xl text-[#b8b3bb]" aria-hidden="true" />
              <p className="mt-3 text-sm text-[#68636d]">Your orders, posts, and completed transactions will appear here.</p>
            </div>
          </WireCard>
          <WireCard className="border-0 bg-[#fff4e8] p-6">
            <i className="bi bi-lightbulb text-2xl text-[#f39a33]" aria-hidden="true" />
            <h2 className="mt-8 text-lg font-semibold text-[#1d1b20]">Need something?</h2>
            <p className="mt-2 text-sm leading-6 text-[#68636d]">Explore all available student services and find what fits your task.</p>
            <button onClick={() => navigate("browse-services")} className="mt-6 text-sm font-bold text-[#1d1b20]">Explore now <i className="bi bi-arrow-up-right ml-1" aria-hidden="true" /></button>
          </WireCard>
        </section>
      </div>
    </StudentLayout>
  );
}
