import { useEffect, useState } from "react";
import { StudentLayout, WireBadge, WireBtn, WireCard } from "../../components/WireframeUI";
import { useAuth } from "../../context/AuthContext";

const serviceCards = [
  ["Printing", "bi-printer", "Send documents to print", "printing-service"],
  ["School supplies", "bi-bag", "Find academic essentials", "school-supplies"],
  ["Resource rental", "bi-box-seam", "Borrow or share resources", "resource-rental"],
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
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="flex flex-col justify-between gap-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#4B3621]/10 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E3C565]">Student overview</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#4B3621]">Hi, {name}</h1>
            <p className="mt-1 text-sm text-gray-500">
              {profile?.student_number || "Student number unavailable"} · Your services and activity in one place.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E3C565] font-bold text-[#4B3621]">{initials}</div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Account status</p>
              <WireBadge variant={profile?.account_status === "active" ? "success" : "pending"}>{profile?.account_status || "Loading"}</WireBadge>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {[
            ["Active orders", "0", "No order records yet", "order-tracking"],
            ["Rental posts", "0", "No rental records yet", "rental-post-status"],
            ["Transactions", "0", "No transaction records yet", "transaction-receipt"],
          ].map(([label, value, note, screen]) => (
            <button key={label} onClick={() => navigate(screen)} className="rounded-2xl bg-white p-5 text-left shadow-sm ring-1 ring-[#4B3621]/10 transition hover:-translate-y-0.5 hover:ring-[#E3C565]">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-500">{label}</p>
              <p className="mt-3 text-3xl font-bold text-[#4B3621]">{value}</p>
              <p className="mt-1 text-xs text-gray-400">{note}</p>
            </button>
          ))}
        </section>

        <section>
          <div className="mb-3 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E3C565]">Services</p>
              <h2 className="mt-1 text-xl font-bold text-[#4B3621]">What do you need today?</h2>
            </div>
            <WireBtn variant="outline" size="sm" onClick={() => navigate("browse-services")}>Browse all</WireBtn>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {serviceCards.map(([title, icon, description, screen], index) => (
              <button key={title} onClick={() => navigate(screen)} className={`rounded-2xl p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md ${index === 0 ? "bg-[#4B3621] text-white" : index === 1 ? "bg-[#E3C565] text-[#4B3621]" : "bg-white text-[#4B3621] ring-1 ring-[#4B3621]/15"}`}>
                <i className={`bi ${icon} text-2xl`} aria-hidden="true" />
                <h3 className="mt-8 font-bold">{title}</h3>
                <p className="mt-1 text-sm opacity-70">{description}</p>
                <span className="mt-5 inline-flex text-xs font-bold uppercase tracking-wider">Open <i className="bi bi-arrow-up-right ml-2" aria-hidden="true" /></span>
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
          <WireCard className="rounded-2xl border-0 p-6 shadow-sm ring-1 ring-[#4B3621]/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-500">Recent activity</p>
                <h2 className="mt-1 text-lg font-bold text-[#4B3621]">Nothing here yet</h2>
              </div>
              <i className="bi bi-clock-history text-2xl text-[#E3C565]" aria-hidden="true" />
            </div>
            <p className="mt-5 rounded-xl border border-dashed border-gray-300 bg-[#faf9f7] p-5 text-sm text-gray-500">
              Your orders, posts, and completed transactions will appear here once they exist in the database.
            </p>
          </WireCard>
          <WireCard className="rounded-2xl border-0 bg-[#4B3621] p-6 text-white shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#E3C565]">Data status</p>
            <h2 className="mt-2 text-lg font-bold">Live profile connected</h2>
            <p className="mt-2 text-sm leading-5 text-white/70">Last synced at {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.</p>
          </WireCard>
        </section>
      </div>
    </StudentLayout>
  );
}
