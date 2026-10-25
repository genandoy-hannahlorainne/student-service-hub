import { ReactNode } from "react";
import { WireBtn, WireCard, WireInput, WirePublicNav, WireSectionTitle, WireTextarea } from "../components/WireframeUI";

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
  return (
    <PublicShell
      navigate={navigate}
      title="Provider Partnership"
      intro="Partner with University Organization to serve PUP Taguig students through a trusted, organized platform."
    >
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
            <li><strong>1.</strong> Submit your provider application.</li>
            <li><strong>2.</strong> University Organization reviews your business details.</li>
            <li><strong>3.</strong> Approved providers receive portal access.</li>
            <li><strong>4.</strong> Start managing student service orders.</li>
          </ol>
          <WireBtn className="mt-6 w-full" onClick={() => navigate("register")}>Apply as provider</WireBtn>
        </WireCard>
      </div>
    </PublicShell>
  );
}
