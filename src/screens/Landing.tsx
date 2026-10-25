import { WireBtn, WireCard, WirePlaceholder, WirePublicNav } from "../components/WireframeUI";

export default function Landing({ navigate }: { navigate: (s: string) => void }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <WirePublicNav navigate={navigate} />

      {/* Hero */}
      <section className="bg-[#0057B8] text-white py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <WirePlaceholder label="PASOA LOGO — 120×120" className="w-28 h-28 mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl font-bold mb-3">PASOA STUDENT SERVICES</h1>
          <p className="text-gray-300 text-base mb-2">A Web-Based Student Service and Resource Platform for PUP Taguig</p>
          <p className="text-gray-400 text-sm max-w-xl mx-auto mb-8">
            Students can easily access printing services, purchase school supplies, and rent academic
            resources — all in one convenient platform designed for PUP Taguig students.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <WireBtn size="lg" onClick={() => navigate("register")}>Get Started</WireBtn>
            <WireBtn variant="outline" size="lg" onClick={() => navigate("browse-services")} className="border-white bg-transparent text-white hover:bg-white/10">
              Browse Services
            </WireBtn>
          </div>
        </div>
      </section>

      {/* ── ROLE-BASED ENTRY PORTAL ── */}
      <section className="py-14 px-6 bg-white border-b-2 border-gray-300">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-1 text-center">Choose How to Access</h2>
          <p className="text-sm text-gray-500 text-center mb-8">Select your role to login or register</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {/* PUPTian */}
            <div className="border-2 border-gray-300 bg-white flex flex-col">
              <div className="bg-[#0057B8] text-white px-4 py-3 text-center">
                <WirePlaceholder label="🎓" className="w-12 h-12 mx-auto mb-2 text-xl" />
                <p className="font-bold text-sm">PUPTian</p>
                <p className="text-xs text-gray-300 mt-0.5">Registered Student</p>
              </div>
              <div className="p-4 flex-1 flex flex-col gap-2">
                <p className="text-xs text-gray-500 flex-1">
                  PUP Taguig students with full access to ordering printing, purchasing supplies, and
                  posting or renting academic resources.
                </p>
                <div className="flex flex-col gap-1.5 mt-2 pt-3 border-t border-gray-200">
                  {[
                    "✓ Order Printing",
                    "✓ Buy School Supplies",
                    "✓ Post / Rent Resources",
                    "✓ Track Orders",
                    "✓ View Transaction History",
                  ].map((f) => <span key={f} className="text-xs text-gray-600">{f}</span>)}
                </div>
              </div>
              <div className="p-4 pt-0 flex flex-col gap-2">
                <WireBtn className="w-full" onClick={() => navigate("login")}>Login as PUPTian</WireBtn>
                <WireBtn variant="outline" className="w-full" onClick={() => navigate("register")}>Register as PUPTian</WireBtn>
              </div>
            </div>

            {/* Guest */}
            <div className="border-2 border-gray-300 bg-white flex flex-col">
              <div className="bg-gray-500 text-white px-4 py-3 text-center">
                <WirePlaceholder label="👤" className="w-12 h-12 mx-auto mb-2 text-xl" />
                <p className="font-bold text-sm">Guest</p>
                <p className="text-xs text-gray-200 mt-0.5">Limited Access</p>
              </div>
              <div className="p-4 flex-1 flex flex-col gap-2">
                <p className="text-xs text-gray-500 flex-1">
                  Non-PUP users who can browse services and post public requests for items or
                  assistance they need — with admin approval required.
                </p>
                <div className="flex flex-col gap-1.5 mt-2 pt-3 border-t border-gray-200">
                  {[
                    "✓ Browse Services",
                    "✓ Post a Need / Request",
                    "✓ View Resource Hub",
                    "✗ Cannot Order Services",
                    "✗ Cannot Purchase Supplies",
                  ].map((f) => (
                    <span key={f} className={`text-xs ${f.startsWith("✗") ? "text-gray-400" : "text-gray-600"}`}>{f}</span>
                  ))}
                </div>
              </div>
              <div className="p-4 pt-0 flex flex-col gap-2">
                <WireBtn variant="secondary" className="w-full" onClick={() => navigate("login-guest")}>Login as Guest</WireBtn>
                <WireBtn variant="outline" className="w-full" onClick={() => navigate("register-guest")}>Register as Guest</WireBtn>
              </div>
            </div>

            {/* Service Provider */}
            <div className="border-2 border-gray-300 bg-white flex flex-col">
              <div className="bg-gray-600 text-white px-4 py-3 text-center">
                <WirePlaceholder label="🏪" className="w-12 h-12 mx-auto mb-2 text-xl" />
                <p className="font-bold text-sm">Service Provider</p>
                <p className="text-xs text-gray-200 mt-0.5">PASOA Collaborator</p>
              </div>
              <div className="p-4 flex-1 flex flex-col gap-2">
                <p className="text-xs text-gray-500 flex-1">
                  Officially approved printing shops and supply providers who have signed a
                  collaboration agreement with PASOA.
                </p>
                <div className="flex flex-col gap-1.5 mt-2 pt-3 border-t border-gray-200">
                  {[
                    "✓ Receive Student Orders",
                    "✓ Accept / Reject Orders",
                    "✓ Update Order Status",
                    "✓ View Transactions",
                    "✗ Requires PASOA Approval",
                  ].map((f) => (
                    <span key={f} className={`text-xs ${f.startsWith("✗") ? "text-gray-400" : "text-gray-600"}`}>{f}</span>
                  ))}
                </div>
              </div>
              <div className="p-4 pt-0 flex flex-col gap-2">
                <WireBtn variant="secondary" className="w-full" onClick={() => navigate("login-provider")}>Login as Provider</WireBtn>
                <WireBtn variant="outline" className="w-full" onClick={() => navigate("register")}>Apply as Provider</WireBtn>
              </div>
            </div>

            {/* Admin */}
            <div className="border-2 border-gray-700 bg-white flex flex-col">
              <div className="bg-gray-900 text-white px-4 py-3 text-center">
                <WirePlaceholder label="⚙" className="w-12 h-12 mx-auto mb-2 text-xl" />
                <p className="font-bold text-sm">Administrator</p>
                <p className="text-xs text-gray-300 mt-0.5">Internal Access Only</p>
              </div>
              <div className="p-4 flex-1 flex flex-col gap-2">
                <p className="text-xs text-gray-500 flex-1">
                  PASOA internal administrators only. Admin accounts are not publicly registered —
                  credentials are issued directly by PASOA management.
                </p>
                <div className="flex flex-col gap-1.5 mt-2 pt-3 border-t border-gray-200">
                  {[
                    "✓ Manage All Users",
                    "✓ Approve Providers",
                    "✓ Moderate Rental Posts",
                    "✓ Manage Orders",
                    "✓ Edit Website Content",
                  ].map((f) => <span key={f} className="text-xs text-gray-600">{f}</span>)}
                </div>
              </div>
              <div className="p-4 pt-0 flex flex-col gap-2">
                <WireBtn className="w-full bg-gray-900 border-gray-900" onClick={() => navigate("login-admin")}>
                  Admin Portal Login
                </WireBtn>
                <div className="border border-dashed border-gray-300 p-2 text-center">
                  <span className="text-xs text-gray-400">Not publicly registered</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-14 px-6 max-w-5xl mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">About the Website</h2>
        <div className="w-16 h-0.5 bg-gray-400 mx-auto mb-6" />
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <WirePlaceholder label="About Image Placeholder — 480×280" className="h-52 w-full" />
          <div>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              PASOA Student Services is an online platform created to support PUP Taguig students by
              providing easy access to essential academic services. Through this platform, students can
              request printing, buy school supplies, and rent academic equipment without leaving campus.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              Service providers are officially vetted and approved collaborators of PASOA, ensuring
              quality and reliability in every transaction. Guests may browse services and post basic
              requests, while registered PUPTians unlock full ordering and rental features.
            </p>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-14 px-6 bg-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">Main Services</h2>
          <div className="w-16 h-0.5 bg-gray-400 mx-auto mb-8" />
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { title: "Printing Services", desc: "Upload your documents and choose from PASOA-approved printing shops near PUP Taguig. Specify print settings, pickup or delivery, and payment method.", screen: "printing-service", cta: "View Service" },
              { title: "School Supplies", desc: "Browse and purchase academic materials including bond paper, folders, pens, index cards, and other school essentials directly from the platform.", screen: "school-supplies", cta: "Browse Supplies" },
              { title: "School Resource Rental", desc: "Post or find student-to-student rentals for typewriters, calculators, laptops, projectors, books, and other academic equipment.", screen: "resource-rental", cta: "Explore Resources" },
            ].map((s) => (
              <WireCard key={s.title} className="flex flex-col gap-3">
                <WirePlaceholder label={`${s.title} Icon`} className="h-24 w-full" />
                <h3 className="font-bold text-gray-800">{s.title}</h3>
                <p className="text-sm text-gray-600 flex-1">{s.desc}</p>
                <WireBtn variant="outline" onClick={() => navigate(s.screen)}>{s.cta}</WireBtn>
              </WireCard>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-14 px-6 max-w-5xl mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">How It Works</h2>
        <div className="w-16 h-0.5 bg-gray-400 mx-auto mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { step: "1", label: "Browse", desc: "Explore available services and products" },
            { step: "2", label: "Select Service", desc: "Choose printing, supplies, or rental" },
            { step: "3", label: "Confirm", desc: "Review and confirm your order details" },
            { step: "4", label: "Track", desc: "Monitor your order status in real time" },
            { step: "5", label: "Complete", desc: "Receive your order and mark as complete" },
          ].map((s) => (
            <div key={s.step} className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-gray-700 text-white flex items-center justify-center font-bold text-lg mb-3">{s.step}</div>
              <span className="font-semibold text-gray-800 text-sm mb-1">{s.label}</span>
              <span className="text-xs text-gray-500">{s.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* User Roles */}
      <section className="py-14 px-6 bg-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">User Roles</h2>
          <div className="w-16 h-0.5 bg-gray-400 mx-auto mb-8" />
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { role: "PUPTian", desc: "Registered PUP Taguig students with full access to order printing, purchase supplies, and post/browse rentals.", cta: "Register as PUPTian" },
              { role: "Guest", desc: "Non-PUP visitors who can browse services and post limited public requests for items they need — admin approval required.", cta: "Register as Guest" },
              { role: "Service Provider", desc: "PASOA-approved businesses offering printing or supply services through the platform.", cta: "Apply as Provider" },
              { role: "Administrator", desc: "Internal PASOA administrators who manage users, providers, orders, rental posts, and website content.", cta: "Internal Only" },
            ].map((r) => (
              <WireCard key={r.role} className="flex flex-col gap-2">
                <WirePlaceholder label={`${r.role} Icon`} className="h-14 w-full" />
                <h3 className="font-bold text-gray-800">{r.role}</h3>
                <p className="text-xs text-gray-600 flex-1">{r.desc}</p>
                <span className="text-xs border border-gray-300 px-2 py-1 text-gray-500 text-center">{r.cta}</span>
              </WireCard>
            ))}
          </div>
        </div>
      </section>

      {/* Project Team */}
      <section className="py-14 px-6 max-w-5xl mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">Project Team</h2>
        <div className="w-16 h-0.5 bg-gray-400 mx-auto mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
          {["Team Member 1", "Team Member 2", "Team Member 3", "Team Member 4", "Team Member 5"].map((m) => (
            <div key={m} className="flex flex-col items-center text-center gap-2">
              <WirePlaceholder label="Photo" className="w-20 h-20" />
              <span className="text-sm font-medium text-gray-700">{m}</span>
              <span className="text-xs text-gray-500">Role / Year</span>
            </div>
          ))}
        </div>
      </section>

      {/* Terms and Services */}
      <section className="py-14 px-6 bg-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">Terms and Services</h2>
          <div className="w-16 h-0.5 bg-gray-400 mx-auto mb-6" />
          <WireCard>
            {[
              "1. PUPTians must use their official PUP student credentials to register.",
              "2. Guest accounts are limited to browsing and posting public need requests. They cannot order services.",
              "3. Service Providers must be officially approved and affiliated with PASOA.",
              "4. Delivery fees are agreed upon between PASOA and Service Providers and cannot be unilaterally changed.",
              "5. All rental posts — from PUPTians and Guests — must be reviewed and approved by an Administrator before becoming publicly visible.",
              "6. All transactions are final once confirmed. Cancellations must be done before order acceptance.",
              "7. Users are responsible for the accuracy of information provided during registration.",
              "8. PASOA reserves the right to deactivate accounts that violate platform policies.",
              "9. The platform is for academic and school-related services only.",
            ].map((term) => (
              <p key={term} className="text-sm text-gray-700 py-2 border-b border-gray-100 last:border-0">{term}</p>
            ))}
          </WireCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0057B8] text-gray-300 py-10 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <WirePlaceholder label="LOGO" className="w-8 h-8" />
              <span className="font-bold text-white text-sm">PASOA Student Services</span>
            </div>
            <p className="text-xs text-gray-400">A Web-Based Student Service and Resource Platform for PUP Taguig</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2 text-sm">Quick Links</h4>
            <div className="flex flex-col gap-1">
              {["Home", "Services", "About", "How It Works", "Team", "Terms & Services"].map((l) => (
                <span key={l} className="text-xs text-gray-400 hover:text-white cursor-pointer">{l}</span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2 text-sm">Contact</h4>
            <p className="text-xs text-gray-400">PUP Taguig Campus</p>
            <p className="text-xs text-gray-400">Taguig City, Metro Manila</p>
            <p className="text-xs text-gray-400 mt-2">pasoa@puptaguig.edu.ph</p>
            <div className="flex gap-3 mt-3">
              {["FB", "IG", "TW"].map((s) => (
                <WirePlaceholder key={s} label={s} className="w-8 h-8 text-xs" />
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-xs text-gray-500">
          © 2025 PASOA Student Services — PUP Taguig. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
