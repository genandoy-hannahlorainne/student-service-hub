import pasoaLogo from "../assets/images/PASOA_logo.jpg";
import { WireBtn, WirePublicNav } from "../components/WireframeUI";

type LandingProps = { navigate: (screen: string) => void };

const services = [
  {
    icon: "▣",
    eyebrow: "01 / PRINT",
    title: "Printing services",
    description: "Send documents to an approved shop, choose your print settings, then pick up or request delivery.",
    screen: "printing-service",
    tone: "bg-[#0F8B8D] text-white",
  },
  {
    icon: "✦",
    eyebrow: "02 / SUPPLY",
    title: "School supplies",
    description: "Find everyday academic essentials from participating providers near PUP Taguig.",
    screen: "school-supplies",
    tone: "bg-[#F4B942] text-[#102A43]",
  },
  {
    icon: "↗",
    eyebrow: "03 / SHARE",
    title: "Resource rental hub",
    description: "Find or offer typewriters, calculators, books, and other school-ready resources.",
    screen: "resource-rental",
    tone: "bg-[#DCEFF2] text-[#123B5D]",
  },
];

const roles = [
  {
    icon: "🎓",
    name: "PUPTian",
    label: "Full student access",
    description: "Order services, buy supplies, rent resources, and track every transaction.",
    action: "Login as PUPTian",
    screen: "login",
    actionClass: "bg-[#123B5D] text-white hover:bg-[#0b2b45]",
  },
  {
    icon: "◌",
    name: "Guest",
    label: "Explore first",
    description: "Browse services and approved resource posts before creating an account.",
    action: "Continue as Guest",
    screen: "login-guest",
    actionClass: "bg-white text-[#123B5D] border border-[#123B5D] hover:bg-[#eef7f8]",
  },
  {
    icon: "▤",
    name: "Provider",
    label: "PASOA collaborator",
    description: "Manage approved services, receive orders, and keep students updated.",
    action: "Provider login",
    screen: "login-provider",
    actionClass: "bg-white text-[#123B5D] border border-[#123B5D] hover:bg-[#eef7f8]",
  },
];

const process = [
  ["01", "Browse", "Find a service or resource."],
  ["02", "Configure", "Add the details we need."],
  ["03", "Confirm", "Review the complete total."],
  ["04", "Track", "Follow progress to completion."],
];

export default function Landing({ navigate }: LandingProps) {
  return (
    <div className="min-h-screen overflow-hidden bg-[#F3F7FA] text-[#102A43]">
      <WirePublicNav navigate={navigate} />

      <main>
        <section className="px-4 pb-5 pt-5 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.45fr_0.55fr]">
            <div className="relative min-h-[510px] overflow-hidden rounded-[28px] bg-[#123B5D] p-7 text-white shadow-[0_22px_60px_rgba(18,59,93,0.18)] sm:p-12">
              <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border-[34px] border-[#0F8B8D]/50" />
              <div className="absolute -bottom-40 right-12 h-80 w-80 rounded-full border-[42px] border-[#F4B942]/20" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-center gap-3">
                  <img src={pasoaLogo} alt="PASOA logo" className="h-12 w-12 rounded-2xl object-cover ring-2 ring-white/20" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#B8E4E5]">PUP Taguig</p>
                    <p className="font-semibold">PASOA Student Services</p>
                  </div>
                </div>

                <div className="max-w-2xl py-16">
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-[#DCEFF2]">
                    <span className="h-2 w-2 rounded-full bg-[#F4B942]" />
                    One hub for campus essentials
                  </div>
                  <h1 className="max-w-3xl text-4xl font-bold leading-[1.05] tracking-[-0.04em] sm:text-6xl">
                    Make school days a little easier.
                  </h1>
                  <p className="mt-5 max-w-xl text-sm leading-6 text-[#DCE7EF] sm:text-base">
                    Printing, supplies, and academic resources brought together for the PUP Taguig community.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <WireBtn size="lg" onClick={() => navigate("register")} className="rounded-xl border-[#F4B942] bg-[#F4B942] px-6 font-semibold text-[#102A43] hover:bg-[#ffd265]">
                      Get started <span className="ml-2">↗</span>
                    </WireBtn>
                    <button onClick={() => navigate("public-services")} className="rounded-xl border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10">
                      Explore services
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-8 gap-y-3 border-t border-white/15 pt-5 text-xs text-[#B8CAD8]">
                  <span><strong className="text-white">3</strong> core services</span>
                  <span><strong className="text-white">Approved</strong> providers</span>
                  <span><strong className="text-white">Clear</strong> order tracking</span>
                </div>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[28px] bg-[#F4B942] p-7 shadow-[0_18px_40px_rgba(244,185,66,0.16)]">
                <div className="flex items-start justify-between">
                  <span className="text-4xl">✦</span>
                  <span className="rounded-full bg-[#102A43]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">Student first</span>
                </div>
                <h2 className="mt-12 text-2xl font-bold tracking-tight">Everything you need, closer.</h2>
                <p className="mt-3 text-sm leading-6 text-[#31506A]">Skip the scattered searching. Start with one organized place for your next academic requirement.</p>
              </div>
              <div className="rounded-[28px] bg-white p-7 ring-1 ring-[#D9E2EC]">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#627D98]">Quick access</p>
                  <span className="text-[#0F8B8D]">●</span>
                </div>
                <div className="mt-6 space-y-3">
                  {[
                    ["Browse services", "public-services"],
                    ["How PASOA works", "how-it-works"],
                    ["Become a provider", "provider-partnership"],
                  ].map(([label, screen]) => (
                    <button key={screen} onClick={() => navigate(screen)} className="flex w-full items-center justify-between rounded-2xl bg-[#F3F7FA] px-4 py-3 text-left text-sm font-semibold transition hover:bg-[#DCEFF2]">
                      {label}<span className="text-[#0F8B8D]">↗</span>
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
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#0F8B8D]">The service hub</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#123B5D] sm:text-4xl">Built around student needs.</h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-[#627D98]">Simple services, approved partners, and transparent progress from request to completion.</p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {services.map((service, index) => (
                <button key={service.title} onClick={() => navigate(service.screen)} className={`group min-h-[285px] rounded-[26px] p-7 text-left transition duration-300 hover:-translate-y-1 hover:shadow-xl ${service.tone} ${index === 0 ? "shadow-[0_18px_40px_rgba(15,139,141,0.16)]" : ""}`}>
                  <div className="flex items-start justify-between">
                    <span className="text-3xl">{service.icon}</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] opacity-70">{service.eyebrow}</span>
                  </div>
                  <div className="mt-20">
                    <h3 className="text-2xl font-bold tracking-tight">{service.title}</h3>
                    <p className="mt-2 max-w-sm text-sm leading-6 opacity-80">{service.description}</p>
                  </div>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold">Explore <span className="transition group-hover:translate-x-1">→</span></span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.7fr_1.3fr]">
            <div className="rounded-[26px] bg-[#DCEFF2] p-7 sm:p-9">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#0F8B8D]">Choose your path</p>
              <h2 className="mt-3 text-3xl font-bold leading-tight text-[#123B5D]">The right tools for your role.</h2>
              <p className="mt-4 text-sm leading-6 text-[#31506A]">Start where you are. Your workspace adapts to what you need to do.</p>
              <button onClick={() => navigate("about")} className="mt-8 text-sm font-bold text-[#123B5D] underline decoration-[#0F8B8D] decoration-2 underline-offset-4">Learn about PASOA →</button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {roles.map((role) => (
                <div key={role.name} className="flex min-h-[260px] flex-col rounded-[24px] border border-[#D9E2EC] bg-[#F9FCFD] p-6 transition hover:border-[#0F8B8D] hover:shadow-lg">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#123B5D] text-xl text-white">{role.icon}</span>
                  <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#0F8B8D]">{role.label}</p>
                  <h3 className="mt-2 text-xl font-bold text-[#123B5D]">{role.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-[#627D98]">{role.description}</p>
                  <button onClick={() => navigate(role.screen)} className={`mt-5 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${role.actionClass}`}>{role.action}</button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-[28px] bg-[#102A43] p-7 text-white sm:p-10">
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#F4B942]">A clearer way forward</p>
                <h2 className="mt-3 max-w-lg text-3xl font-bold tracking-tight sm:text-4xl">From “I need this” to “Done.”</h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-[#B8CAD8]">Every request has a next step, so you always know what is happening.</p>
            </div>
            <div className="mt-10 grid gap-px overflow-hidden rounded-2xl bg-white/15 sm:grid-cols-2 lg:grid-cols-4">
              {process.map(([number, title, description]) => (
                <div key={number} className="bg-[#102A43] p-5">
                  <span className="text-xs font-bold text-[#F4B942]">{number}</span>
                  <h3 className="mt-10 font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-5 text-[#B8CAD8]">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[26px] border border-[#D9E2EC] bg-white p-7 sm:p-9">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#0F8B8D]">A trusted campus network</p>
              <h2 className="mt-3 text-2xl font-bold text-[#123B5D]">Designed for the PUP Taguig community.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#627D98]">PASOA connects students with participating providers and keeps academic resource sharing focused, visible, and moderated.</p>
              <div className="mt-7 flex flex-wrap gap-2">
                {["Approved providers", "Pickup & delivery", "Order tracking", "Moderated listings"].map((item) => (
                  <span key={item} className="rounded-full bg-[#F3F7FA] px-3 py-2 text-xs font-semibold text-[#31506A]">{item}</span>
                ))}
              </div>
            </div>
            <div className="rounded-[26px] bg-[#F4B942] p-7 sm:p-9">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#102A43]/60">Ready when you are</p>
              <h2 className="mt-3 text-2xl font-bold text-[#102A43]">Start with your next requirement.</h2>
              <p className="mt-3 text-sm leading-6 text-[#31506A]">Create an account to unlock orders, rentals, and transaction tracking.</p>
              <WireBtn onClick={() => navigate("register")} className="mt-7 rounded-xl border-[#123B5D] bg-[#123B5D] text-white hover:bg-[#0b2b45]">Create an account ↗</WireBtn>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#123B5D] px-4 py-10 text-[#B8CAD8] sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-3">
              <img src={pasoaLogo} alt="" className="h-10 w-10 rounded-xl object-cover" />
              <span className="font-bold text-white">PASOA Student Services</span>
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
