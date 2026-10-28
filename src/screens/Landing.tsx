import organizationLogo from "../assets/images/org_ssh_logo.png";
import { WireBtn, WirePublicNav } from "../components/WireframeUI";

type LandingProps = { navigate: (screen: string) => void };

const services = [
  {
    icon: "bi-printer",
    eyebrow: "01 / PRINT",
    title: "Printing services",
    description: "Send documents to an approved shop, choose your print settings, then pick up or request delivery.",
    screen: "printing-service",
    tone: "bg-[#4B3621] text-white",
  },
  {
    icon: "bi-stars",
    eyebrow: "02 / SUPPLY",
    title: "School supplies",
    description: "Find everyday academic essentials from participating providers near PUP Taguig.",
    screen: "school-supplies",
    tone: "bg-[#E3C565] text-[#000000]",
  },
  {
    icon: "bi-box-arrow-up-right",
    eyebrow: "03 / SHARE",
    title: "Resource rental hub",
    description: "Find or offer typewriters, calculators, books, and other school-ready resources.",
    screen: "resource-rental",
    tone: "bg-white text-[#4B3621] ring-1 ring-[#4B3621]/20",
  },
];

const roles = [
  {
    icon: "bi-mortarboard",
    name: "PUPTian",
    label: "Full student access",
    description: "Order services, buy supplies, rent resources, and track every transaction.",
    action: "Login as PUPTian",
    screen: "login",
    actionClass: "bg-[#4B3621] text-white hover:bg-[#0b2b45]",
  },
  {
    icon: "bi-person",
    name: "Guest",
    label: "Explore first",
    description: "Browse services and approved resource posts before creating an account.",
    action: "Continue as Guest",
    screen: "login-guest",
    actionClass: "bg-white text-[#4B3621] border border-[#4B3621] hover:bg-[#E3C565]",
  },
  {
    icon: "bi-shop",
    name: "Provider",
    label: "University Organization collaborator",
    description: "Manage approved services, receive orders, and keep students updated.",
    action: "Provider login",
    screen: "login-provider",
    actionClass: "bg-white text-[#4B3621] border border-[#4B3621] hover:bg-[#E3C565]",
  },
];

const process = [
  ["01", "bi-search", "Browse", "Find a service or resource."],
  ["02", "bi-sliders", "Configure", "Add the details we need."],
  ["03", "bi-check2-circle", "Confirm", "Review the complete total."],
  ["04", "bi-graph-up-arrow", "Track", "Follow progress to completion."],
];

export default function Landing({ navigate }: LandingProps) {
  return (
    <div className="min-h-screen overflow-hidden bg-white text-[#000000]">
      <WirePublicNav navigate={navigate} />

      <main>
        <section className="px-4 pb-5 pt-5 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.45fr_0.55fr]">
            <div className="relative min-h-[510px] overflow-hidden rounded-[28px] bg-[#4B3621] p-7 text-white shadow-[0_22px_60px_rgba(75,54,33,0.18)] sm:p-12">
              <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border-[34px] border-[#E3C565]/50" />
              <div className="absolute -bottom-40 right-12 h-80 w-80 rounded-full border-[42px] border-[#E3C565]/20" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center ring-2 ring-white/20">
                    <img src={organizationLogo} alt="University Organization logo" className="h-full w-full object-contain" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#E3C565]">PUP Taguig</p>
                    <p className="font-semibold">University Organization Student Services Hub</p>
                  </div>
                </div>

                <div className="max-w-2xl py-16">
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-[#E3C565]">
                    <i className="bi bi-circle-fill text-[8px]" aria-hidden="true" />
                    One hub for campus essentials
                  </div>
                  <h1 className="max-w-3xl text-4xl font-bold leading-[1.05] tracking-[-0.04em] sm:text-6xl">
                    Make school days a little easier.
                  </h1>
                  <p className="mt-5 max-w-xl text-sm leading-6 text-[#E3C565] sm:text-base">
                    Printing, supplies, and academic resources brought together for the PUP Taguig community.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <WireBtn size="lg" onClick={() => navigate("register")} className="rounded-xl border-[#E3C565] bg-[#E3C565] px-6 font-semibold text-[#000000] hover:bg-[#E3C565]">
                      Get started <i className="bi bi-arrow-up-right ml-2" aria-hidden="true" />
                    </WireBtn>
                    <button onClick={() => navigate("public-services")} className="rounded-xl border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10">
                      Explore services
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-8 gap-y-3 border-t border-white/15 pt-5 text-xs text-[#E3C565]">
                  <span><strong className="text-white">3</strong> core services</span>
                  <span><strong className="text-white">Approved</strong> providers</span>
                  <span><strong className="text-white">Clear</strong> order tracking</span>
                </div>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[28px] bg-[#E3C565] p-7 shadow-[0_18px_40px_rgba(227,197,101,0.16)]">
                <div className="flex items-start justify-between">
                  <i className="bi bi-stars text-4xl" aria-hidden="true" />
                  <span className="rounded-full bg-[#000000]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">Student first</span>
                </div>
                <h2 className="mt-12 text-2xl font-bold tracking-tight">Everything you need, closer.</h2>
                <p className="mt-3 text-sm leading-6 text-[#4B3621]">Skip the scattered searching. Start with one organized place for your next academic requirement.</p>
              </div>
              <div className="rounded-[28px] bg-white p-7 ring-1 ring-[#4B3621]">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#4B3621]">Quick access</p>
                  <i className="bi bi-lightning-charge-fill text-[#E3C565]" aria-hidden="true" />
                </div>
                <div className="mt-6 space-y-3">
                  {[
                    ["Browse services", "public-services"],
                    ["How the University Organization hub works", "how-it-works"],
                    ["Become a provider", "provider-partnership"],
                  ].map(([label, screen]) => (
                    <button key={screen} onClick={() => navigate(screen)} className="flex w-full items-center justify-between rounded-2xl bg-[#E3C565] px-4 py-3 text-left text-sm font-semibold transition hover:bg-[#E3C565]">
                      {label}<i className="bi bi-arrow-up-right text-[#E3C565]" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#E3C565]">The service hub</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#4B3621] sm:text-4xl">Built around student needs.</h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-[#4B3621]">Simple services, approved partners, and transparent progress from request to completion.</p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {services.map((service, index) => (
                <button key={service.title} onClick={() => navigate(service.screen)} className={`group min-h-[285px] rounded-[26px] p-7 text-left transition duration-300 hover:-translate-y-1 hover:shadow-xl ${service.tone} ${index === 0 ? "shadow-[0_18px_40px_rgba(15,139,141,0.16)]" : ""}`}>
                  <div className="flex items-start justify-between">
                    <i className={`bi ${service.icon} text-3xl`} aria-hidden="true" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] opacity-70">{service.eyebrow}</span>
                  </div>
                  <div className="mt-20">
                    <h3 className="text-2xl font-bold tracking-tight">{service.title}</h3>
                    <p className="mt-2 max-w-sm text-sm leading-6 opacity-80">{service.description}</p>
                  </div>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold">Explore <i className="bi bi-arrow-right transition group-hover:translate-x-1" aria-hidden="true" /></span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.7fr_1.3fr]">
            <div className="rounded-[26px] bg-[#E3C565] p-7 sm:p-9">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#E3C565]">Choose your path</p>
              <h2 className="mt-3 text-3xl font-bold leading-tight text-[#4B3621]">The right tools for your role.</h2>
              <p className="mt-4 text-sm leading-6 text-[#4B3621]">Start where you are. Your workspace adapts to what you need to do.</p>
              <button onClick={() => navigate("about")} className="mt-8 text-sm font-bold text-[#4B3621] underline decoration-[#E3C565] decoration-2 underline-offset-4">Learn about the University Organization hub <i className="bi bi-arrow-right" aria-hidden="true" /></button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {roles.map((role) => (
                <div key={role.name} className="flex min-h-[260px] flex-col rounded-[24px] border border-[#4B3621] bg-[#E3C565] p-6 transition hover:border-[#E3C565] hover:shadow-lg">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4B3621] text-xl text-white"><i className={`bi ${role.icon}`} aria-hidden="true" /></span>
                  <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#E3C565]">{role.label}</p>
                  <h3 className="mt-2 text-xl font-bold text-[#4B3621]">{role.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-[#4B3621]">{role.description}</p>
                  <button onClick={() => navigate(role.screen)} className={`mt-5 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${role.actionClass}`}>{role.action}</button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-[28px] bg-[#E3C565] p-7 text-[#4B3621] sm:p-10">
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#4B3621]/70">A clearer way forward</p>
                <h2 className="mt-3 max-w-lg text-3xl font-bold tracking-tight sm:text-4xl">From “I need this” to “Done.”</h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-[#4B3621]">Every request has a next step, so you always know what is happening.</p>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {process.map(([number, icon, title, description]) => (
                <div key={number} className="rounded-2xl bg-white p-5 ring-1 ring-[#4B3621]/10">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4B3621] text-lg text-[#E3C565]">
                      <i className={`bi ${icon}`} aria-hidden="true" />
                    </span>
                    <span className="text-xs font-bold text-[#4B3621]/60">{number}</span>
                  </div>
                  <h3 className="mt-8 font-bold text-[#4B3621]">{title}</h3>
                  <p className="mt-2 text-sm leading-5 text-[#4B3621]/75">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── About ───────────────────────────────────────────────────── */}
        <section id="about" className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#E3C565]">About University Organization</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#4B3621] sm:text-4xl">Bringing campus essentials together.</h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#4B3621]">University Organization brings everyday student services and academic resources into one organized platform.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-[24px] border border-[#4B3621]/20 bg-white p-7">
                <h3 className="text-base font-bold text-[#4B3621] border-b border-[#4B3621]/10 pb-2 mb-4">What University Organization solves</h3>
                <p className="text-sm leading-7 text-[#4B3621]">
                  Students often need printing, school supplies, and academic resources at the same time.
                  University Organization gives them one trusted place to discover services, submit requests, and follow
                  updates without relying on scattered messages or posts.
                </p>
              </div>
              <div className="rounded-[24px] bg-[#E3C565] p-7">
                <h3 className="text-base font-bold text-[#4B3621] border-b border-[#4B3621]/20 pb-2 mb-4">Our focus</h3>
                <ul className="space-y-3 text-sm text-[#4B3621]">
                  <li className="flex items-start gap-2"><i className="bi bi-check2 mt-0.5 shrink-0" aria-hidden="true" /> Convenient student-first services</li>
                  <li className="flex items-start gap-2"><i className="bi bi-check2 mt-0.5 shrink-0" aria-hidden="true" /> Verified and accountable providers</li>
                  <li className="flex items-start gap-2"><i className="bi bi-check2 mt-0.5 shrink-0" aria-hidden="true" /> Clear order and request status updates</li>
                  <li className="flex items-start gap-2"><i className="bi bi-check2 mt-0.5 shrink-0" aria-hidden="true" /> A safer academic resource community</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              {[
                ["bi-mortarboard", "Student-first", "Designed around the daily needs of PUP Taguig students."],
                ["bi-people", "Community-based", "Connects students, guests, and local service providers."],
                ["bi-shield-check", "Managed", "Admin review helps keep providers and rental posts reliable."],
              ].map(([icon, title, description]) => (
                <div key={title} className="rounded-[22px] border border-[#4B3621]/10 bg-white p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4B3621] text-lg text-[#E3C565]">
                    <i className={`bi ${icon}`} aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-bold text-[#4B3621]">{title}</h3>
                  <p className="mt-2 text-sm text-[#4B3621]/70">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ─────────────────────────────────────────────── */}
        <section id="how-it-works" className="bg-[#4B3621] px-4 py-16 text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#E3C565]">How It Works</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Four simple steps.</h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#E3C565]">Choose your access level, select a service, and keep track of what happens next.</p>
            </div>
            <div className="grid gap-5 md:grid-cols-4">
              {[
                ["01", "bi-person-plus", "Create an account", "Choose PUPTian, Guest, or Provider access."],
                ["02", "bi-grid", "Choose a service", "Browse printing, supplies, or academic resources."],
                ["03", "bi-send", "Submit a request", "Provide the details needed to process your request."],
                ["04", "bi-graph-up-arrow", "Track updates", "See order status and next steps in your portal."],
              ].map(([number, icon, title, description]) => (
                <div key={number} className="rounded-[22px] bg-white/10 p-6 ring-1 ring-white/10">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E3C565] text-lg text-[#4B3621]">
                      <i className={`bi ${icon}`} aria-hidden="true" />
                    </span>
                    <span className="text-xs font-bold text-white/50">{number}</span>
                  </div>
                  <h3 className="mt-6 font-bold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#E3C565]/80">{description}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-[18px] border border-white/10 bg-white/5 p-5 text-sm text-[#E3C565]">
              <strong className="text-white">Note for guests:</strong> Guest accounts can browse services
              and submit public requests, while ordering and purchasing are reserved for PUPTian accounts.
            </div>
            <div className="mt-8 text-center">
              <WireBtn size="lg" onClick={() => navigate("register")} className="rounded-xl border-[#E3C565] bg-[#E3C565] px-6 font-semibold text-[#000000] hover:bg-[#E3C565]">
                Get started <i className="bi bi-arrow-up-right ml-2" aria-hidden="true" />
              </WireBtn>
            </div>
          </div>
        </section>

        {/* ── CTA / Community ──────────────────────────────────────────── */}
        <section className="px-4 pb-16 pt-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[26px] border border-[#4B3621] bg-white p-7 sm:p-9">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#E3C565]">A trusted campus network</p>
              <h2 className="mt-3 text-2xl font-bold text-[#4B3621]">Designed for the PUP Taguig community.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#4B3621]">The University Organization hub connects students with participating providers and keeps academic resource sharing focused, visible, and moderated.</p>
              <div className="mt-7 flex flex-wrap gap-2">
                {["Approved providers", "Pickup & delivery", "Order tracking", "Moderated listings"].map((item) => (
                  <span key={item} className="rounded-full bg-[#E3C565] px-3 py-2 text-xs font-semibold text-[#4B3621]">{item}</span>
                ))}
              </div>
            </div>
            <div className="rounded-[26px] bg-[#E3C565] p-7 sm:p-9">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#000000]/60">Ready when you are</p>
              <h2 className="mt-3 text-2xl font-bold text-[#000000]">Start with your next requirement.</h2>
              <p className="mt-3 text-sm leading-6 text-[#4B3621]">Create an account to unlock orders, rentals, and transaction tracking.</p>
              <WireBtn onClick={() => navigate("register")} className="mt-7 rounded-xl border-[#4B3621] bg-[#4B3621] text-white hover:bg-[#0b2b45]">Create an account <i className="bi bi-arrow-up-right ml-2" aria-hidden="true" /></WireBtn>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#4B3621] px-4 py-10 text-[#E3C565] sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center">
                <img src={organizationLogo} alt="" className="h-full w-full object-contain" />
              </span>
              <span className="font-bold text-white">University Organization Student Services Hub</span>
            </div>
            <p className="mt-3 max-w-sm text-xs leading-5">A student service and resource platform for PUP Taguig.</p>
          </div>
          <div className="text-left text-xs sm:text-right">
            <p>PUP Taguig Campus</p>
            <p className="mt-1">pasoa@puptaguig.edu.ph</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
