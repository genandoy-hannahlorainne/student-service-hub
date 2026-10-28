import { ReactNode, useRef, useState } from "react";
import { WireBtn, WireCard, WireInput, WirePublicNav, WireSectionTitle, WireTextarea } from "../components/WireframeUI";
import agreementFormPdf from "../documents/UNISERVE AGREEMENT FORM.pdf";

type PublicNavigate = (screen: string) => void;

function PublicShell({
  navigate,
  title,
  intro,
  children,
}: {
  navigate: PublicNavigate;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <WirePublicNav navigate={navigate} />
      <header className="bg-[#4B3621] px-6 py-14 text-center text-white">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#E3C565]">University Organization Student Services Hub</p>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-300">{intro}</p>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-12">{children}</main>
      <footer className="border-t border-gray-300 bg-white px-6 py-8 text-center text-xs text-gray-500">
        <p className="font-semibold text-gray-700">University Organization Student Services Hub</p>
        <p className="mt-1">A student service and resource platform for PUP Taguig.</p>
      </footer>
    </div>
  );
}

function PublicCards({ children }: { children: ReactNode }) {
  return <div className="grid gap-5 md:grid-cols-3">{children}</div>;
}

export function PublicServices({ navigate }: { navigate: PublicNavigate }) {
  return (
    <PublicShell
      navigate={navigate}
      title="Services"
      intro="Explore the services available to PUP Taguig students, guests, and approved service providers."
    >
      <PublicCards>
        {[
          ["Printing Services", "Submit documents for printing and track your order from request to release.", "printing-service"],
          ["School Supplies", "Browse essential school supplies from University Organization-approved providers.", "school-supplies"],
          ["Resource Rental", "Find, rent, or post academic resources for the PUP Taguig community.", "resource-rental"],
        ].map(([title, description, screen]) => (
          <WireCard key={title} className="flex flex-col">
            <h2 className="text-lg font-bold text-gray-800">{title}</h2>
            <p className="mt-2 flex-1 text-sm leading-6 text-gray-500">{description}</p>
            <WireBtn className="mt-5 w-full" onClick={() => navigate(screen)}>Explore service</WireBtn>
          </WireCard>
        ))}
      </PublicCards>
      <WireCard className="mt-8 bg-gray-100">
        <WireSectionTitle>Access by role</WireSectionTitle>
        <div className="grid gap-3 text-sm text-gray-600 sm:grid-cols-3">
          <p><strong className="text-gray-800">PUPTian:</strong> Full ordering and tracking access.</p>
          <p><strong className="text-gray-800">Guest:</strong> Browse services and post requests.</p>
          <p><strong className="text-gray-800">Provider:</strong> Manage approved service orders.</p>
        </div>
      </WireCard>
    </PublicShell>
  );
}

export function About({ navigate }: { navigate: PublicNavigate }) {
  return (
    <PublicShell
      navigate={navigate}
      title="About University Organization"
      intro="University Organization brings everyday student services and academic resources into one organized platform."
    >
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <WireSectionTitle>What University Organization solves</WireSectionTitle>
          <p className="text-sm leading-7 text-gray-600">
            Students often need printing, school supplies, and academic resources at the same time.
            University Organization gives them one trusted place to discover services, submit requests, and follow
            updates without relying on scattered messages or posts.
          </p>
        </div>
        <WireCard>
          <WireSectionTitle>Our focus</WireSectionTitle>
          <ul className="space-y-3 text-sm text-gray-600">
            <li>• Convenient student-first services</li>
            <li>• Verified and accountable providers</li>
            <li>• Clear order and request status updates</li>
            <li>• A safer academic resource community</li>
          </ul>
        </WireCard>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {[
          ["Student-first", "Designed around the daily needs of PUP Taguig students."],
          ["Community-based", "Connects students, guests, and local service providers."],
          ["Managed", "Admin review helps keep providers and rental posts reliable."],
        ].map(([title, description]) => (
          <WireCard key={title}><h2 className="font-bold text-gray-800">{title}</h2><p className="mt-2 text-sm text-gray-500">{description}</p></WireCard>
        ))}
      </div>
    </PublicShell>
  );
}

export function HowItWorks({ navigate }: { navigate: PublicNavigate }) {
  return (
    <PublicShell
      navigate={navigate}
      title="How It Works"
      intro="Choose your access level, select a service, and keep track of what happens next."
    >
      <div className="grid gap-5 md:grid-cols-4">
        {[
          ["01", "Create an account", "Choose PUPTian, Guest, or Provider access."],
          ["02", "Choose a service", "Browse printing, supplies, or academic resources."],
          ["03", "Submit a request", "Provide the details needed to process your request."],
          ["04", "Track updates", "See order status and next steps in your portal."],
        ].map(([number, title, description]) => (
          <WireCard key={number}>
            <span className="mono text-2xl font-bold text-gray-400">{number}</span>
            <h2 className="mt-3 font-bold text-gray-800">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>
          </WireCard>
        ))}
      </div>
      <div className="mt-8 border border-dashed border-gray-400 bg-white p-5 text-sm text-gray-600">
        <strong className="text-gray-800">Note for guests:</strong> Guest accounts can browse services
        and submit public requests, while ordering and purchasing are reserved for PUPTian accounts.
      </div>
      <WireBtn className="mt-8" onClick={() => navigate("register")}>Get started</WireBtn>
    </PublicShell>
  );
}

export function Contact({ navigate }: { navigate: PublicNavigate }) {
  return (
    <PublicShell
      navigate={navigate}
      title="Contact and Support"
      intro="Need help with an order, account, or provider request? Send the University Organization team a message."
    >
      <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
        <WireCard>
          <WireSectionTitle>Send a message</WireSectionTitle>
          <form className="flex flex-col gap-4">
            <WireInput label="Name" placeholder="Your full name" />
            <WireInput label="Email address" type="email" placeholder="you@example.com" />
            <WireInput label="Subject" placeholder="How can we help?" />
            <WireTextarea label="Message" placeholder="Describe your concern or request" rows={5} />
            <WireBtn type="submit" onClick={() => {}}>Submit message</WireBtn>
          </form>
        </WireCard>
        <div className="space-y-5">
          <WireCard>
            <WireSectionTitle>Support channels</WireSectionTitle>
            <p className="text-sm text-gray-600">For order concerns, include your order number and registered email.</p>
            <p className="mt-4 text-sm text-gray-600"><strong>Email:</strong> support@pasoa.example</p>
            <p className="mt-2 text-sm text-gray-600"><strong>Location:</strong> PUP Taguig community</p>
          </WireCard>
          <WireCard className="bg-gray-100">
            <WireSectionTitle>Already have an account?</WireSectionTitle>
            <WireBtn variant="outline" onClick={() => navigate("login")}>Go to login</WireBtn>
          </WireCard>
        </div>
      </div>
    </PublicShell>
  );
}

export function ProviderPartnership({ navigate }: { navigate: PublicNavigate }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [businessEmail, setBusinessEmail] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessEmail || !uploadedFile) return;
    setSubmitted(true);
  };

  return (
    <PublicShell
      navigate={navigate}
      title="Provider Partnership"
      intro="Partner with University Organization to serve PUP Taguig students through a trusted, organized platform."
    >
      {/* Why partner */}
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <WireSectionTitle>Why partner with University Organization?</WireSectionTitle>
          <ul className="space-y-4 text-sm leading-6 text-gray-600">
            <li>• Reach students looking for printing, supplies, and academic resources.</li>
            <li>• Receive structured orders instead of scattered chat requests.</li>
            <li>• Update order status so students know what to expect.</li>
            <li>• Build trust through an approval and provider profile process.</li>
          </ul>
        </div>
        <WireCard>
          <WireSectionTitle>Partnership steps</WireSectionTitle>
          <ol className="space-y-3 text-sm text-gray-600">
            <li><strong>1.</strong> Download and fill out the UniServe Agreement Form.</li>
            <li><strong>2.</strong> Submit the completed form along with your business email.</li>
            <li><strong>3.</strong> University Organization reviews your application.</li>
            <li><strong>4.</strong> Approved providers receive portal access.</li>
            <li><strong>5.</strong> Start managing student service orders.</li>
          </ol>
        </WireCard>
      </div>

      {/* Step 1 & 2 — two-column side by side */}
      <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:items-start">

        {/* Step 1 — Download form */}
        <div className="flex flex-col gap-4 rounded-2xl border border-[#4B3621]/20 bg-[#fdf8f0] p-6 h-full">
          <div className="flex items-center gap-2 border-b border-[#4B3621]/10 pb-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#4B3621] text-xs font-bold text-[#E3C565]">1</span>
            <h3 className="font-semibold text-[#4B3621]">Download the Agreement Form</h3>
          </div>
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#4B3621] text-xl text-[#E3C565]">
              <i className="bi bi-file-earmark-pdf" aria-hidden="true" />
            </span>
            <div>
              <p className="font-semibold text-[#4B3621]">UniServe Agreement Form</p>
              <p className="mt-0.5 text-xs text-gray-500">PDF document — fill out and sign before uploading</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 leading-6">
            Download the form, complete all required fields, sign it, then come back here to submit your application in Step 2.
          </p>
          <a
            href={agreementFormPdf}
            download="UNISERVE AGREEMENT FORM.pdf"
            className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#4B3621] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3a2918]"
          >
            <i className="bi bi-download" aria-hidden="true" />
            Download Form
          </a>
        </div>

        {/* Step 2 — Submit application */}
        <div className="flex flex-col gap-4 h-full">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#4B3621] text-xs font-bold text-[#E3C565]">2</span>
            <h3 className="font-semibold text-[#4B3621]">Submit Your Application</h3>
          </div>

          {submitted ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-green-200 bg-green-50 p-8 text-center flex-1">
              <span className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-green-100 text-2xl text-green-600">
                <i className="bi bi-check2-circle" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-green-800">Application submitted!</h3>
              <p className="mt-2 text-sm text-green-700">
                We received your form and business email. The University Organization team will review your application and reach out to <strong>{businessEmail}</strong>.
              </p>
              <button
                onClick={() => { setSubmitted(false); setBusinessEmail(""); setUploadedFile(null); }}
                className="mt-5 text-xs text-green-700 underline hover:text-green-900"
              >
                Submit another application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex-1">
              {/* Business email */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Business Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="your-business@example.com"
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#4B3621] focus:outline-none focus:ring-1 focus:ring-[#4B3621]"
                />
                <p className="text-xs text-gray-400">We will send your approval notification to this email.</p>
              </div>

              {/* Upload completed form */}
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Upload Completed Agreement Form <span className="text-red-500">*</span>
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-6 transition ${
                    uploadedFile
                      ? "border-[#4B3621] bg-[#fdf8f0]"
                      : "border-gray-300 bg-gray-50 hover:border-[#4B3621] hover:bg-[#fdf8f0]"
                  }`}
                >
                  {uploadedFile ? (
                    <>
                      <i className="bi bi-file-earmark-check text-3xl text-[#4B3621]" aria-hidden="true" />
                      <p className="text-sm font-semibold text-[#4B3621]">{uploadedFile.name}</p>
                      <p className="text-xs text-gray-400">{(uploadedFile.size / 1024).toFixed(1)} KB — click to replace</p>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-cloud-upload text-3xl text-gray-400" aria-hidden="true" />
                      <p className="text-sm font-semibold text-gray-600">Click to upload your filled-out form</p>
                      <p className="text-xs text-gray-400">PDF, JPG, or PNG accepted</p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => setUploadedFile(e.target.files?.[0] ?? null)}
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-1">
                <p className="text-xs text-gray-400">
                  <i className="bi bi-info-circle mr-1" aria-hidden="true" />
                  Fill out and sign the form before uploading.
                </p>
                <button
                  type="submit"
                  disabled={!businessEmail || !uploadedFile}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4B3621] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3a2918] disabled:cursor-not-allowed disabled:opacity-40 shrink-0"
                >
                  <i className="bi bi-send" aria-hidden="true" />
                  Submit Application
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </PublicShell>
  );
}
