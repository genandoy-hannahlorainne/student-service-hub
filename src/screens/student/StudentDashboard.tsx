import { useEffect, useState } from "react";
import { StudentLayout, WireBtn, WireCard, WireBadge } from "../../components/WireframeUI";
import { useAuth } from "../../context/AuthContext";

const services = [
  {
    title: "Printing services",
    description: "Upload documents and configure your print order.",
    icon: "bi-printer",
    screen: "printing-service",
    tone: "bg-[#4B3621] text-white",
  },
  {
    title: "School supplies",
    description: "Browse academic essentials when providers publish them.",
    icon: "bi-stars",
    screen: "school-supplies",
    tone: "bg-[#E3C565] text-[#000000]",
  },
  {
    title: "Resource rental",
    description: "Find or share school-ready resources.",
    icon: "bi-box-arrow-up-right",
    screen: "resource-rental",
    tone: "bg-white text-[#4B3621] ring-1 ring-[#4B3621]/20",
  },
];

export default function StudentDashboard({ navigate }: { navigate: (s: string) => void }) {
  const { profile, refreshProfile } = useAuth();
  const [lastUpdated, setLastUpdated] = useState(() => new Date());

  useEffect(() => {
    const refresh = () => {
      void refreshProfile()
        .then(() => setLastUpdated(new Date()))
        .catch((error: unknown) => {
          console.error("[StudentDashboard] profile refresh failed:", error);
        });
    };
    const interval = window.setInterval(refresh, 30_000);
    return () => window.clearInterval(interval);
  }, [refreshProfile]);

  const displayName = profile?.display_name || "Student";
  const studentNumber = profile?.student_number || "Student number not available";

  return (
    <StudentLayout active="student-dashboard" navigate={navigate}>
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        <section className="grid gap-5 lg:grid-cols-[1.45fr_0.55fr]">
          <div className="relative min-h-[330px] overflow-hidden rounded-[28px] bg-[#4B3621] p-7 text-white shadow-[0_22px_60px_rgba(75,54,33,0.18)] sm:p-10">
            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border-[34px] border-[#E3C565]/50" />
            <div className="absolute -bottom-40 right-12 h-80 w-80 rounded-full border-[42px] border-[#E3C565]/20" />
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#E3C565]">Student dashboard</p>
                  <p className="mt-1 text-sm text-white/70">PUP Taguig · Live account data</p>
                </div>
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#E3C565]">
                  <i className="bi bi-circle-fill mr-1 text-[7px]" aria-hidden="true" /> Connected
                </span>
              </div>
              <div className="relative py-10">
                <p className="text-sm text-[#E3C565]">Welcome back</p>
                <h1 className="mt-2 max-w-2xl text-4xl font-bold leading-tight tracking-[-0.04em] sm:text-5xl">
                  {displayName}
                </h1>
                <p className="mt-4 text-sm text-white/75">{studentNumber}</p>
                <WireBtn
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate("browse-services")}
                  className="mt-7 rounded-xl"
                >
                  Browse services <i className="bi bi-arrow-up-right ml-2" aria-hidden="true" />
                </WireBtn>
              </div>
              <p className="border-t border-white/15 pt-4 text-xs text-white/60">
                Last account sync: {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-[28px] bg-[#E3C565] p-7">
              <div className="flex items-start justify-between">
                <i className="bi bi-lightning-charge-fill text-4xl" aria-hidden="true" />
                <span className="rounded-full bg-black/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">Live</span>
              </div>
              <h2 className="mt-10 text-2xl font-bold tracking-tight">Your hub at a glance.</h2>
              <p className="mt-3 text-sm leading-6 text-[#4B3621]">
                Orders, rentals, and transactions will appear here as soon as you use the services.
              </p>
            </div>
            <div className="rounded-[28px] bg-white p-7 ring-1 ring-[#4B3621]">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#4B3621]">Account status</p>
              <div className="mt-5 flex items-center justify-between">
                <span className="text-sm font-semibold text-[#4B3621]">Student account</span>
                <WireBadge variant={profile?.account_status === "active" ? "success" : "pending"}>
                  {profile?.account_status ?? "Loading"}
                </WireBadge>
              </div>
              <p className="mt-4 text-xs leading-5 text-gray-500">
                This status is loaded from your current profile in the database.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#E3C565]">Student services</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#4B3621]">Start with what you need.</h2>
            </div>
            <button onClick={() => navigate("browse-services")} className="hidden text-sm font-semibold text-[#4B3621] underline sm:block">
              View all
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {services.map((service) => (
              <button
                key={service.title}
                onClick={() => navigate(service.screen)}
                className={`group rounded-[24px] p-6 text-left transition hover:-translate-y-0.5 hover:shadow-lg ${service.tone}`}
              >
                <i className={`bi ${service.icon} text-3xl`} aria-hidden="true" />
                <h3 className="mt-12 text-xl font-bold">{service.title}</h3>
                <p className="mt-2 text-sm leading-6 opacity-75">{service.description}</p>
                <span className="mt-5 inline-flex items-center text-xs font-bold uppercase tracking-wider">
                  Open service <i className="bi bi-arrow-up-right ml-2 transition group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          {[
            ["Active orders", "No orders yet", "Your live orders will appear here.", "order-tracking"],
            ["Rental posts", "No rental posts yet", "Create a post when you have a resource to share.", "rental-post-status"],
            ["Transactions", "No transactions yet", "Completed payments will appear here.", "transaction-receipt"],
          ].map(([label, emptyTitle, description, screen]) => (
            <WireCard key={label} className="rounded-[24px] border-[#4B3621]/15 p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#4B3621]">{label}</p>
                <i className="bi bi-arrow-up-right text-[#E3C565]" aria-hidden="true" />
              </div>
              <div className="mt-8 rounded-2xl border border-dashed border-[#4B3621]/25 bg-[#faf9f7] p-5">
                <p className="font-semibold text-[#4B3621]">{emptyTitle}</p>
                <p className="mt-1 text-sm leading-5 text-gray-500">{description}</p>
              </div>
              <button onClick={() => navigate(screen)} className="mt-4 text-xs font-bold uppercase tracking-wider text-[#4B3621] underline">
                Open {label}
              </button>
            </WireCard>
          ))}
        </section>
      </div>
    </StudentLayout>
  );
}
