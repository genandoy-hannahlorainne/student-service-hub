import { useState } from "react";
import organizationLogo from "../assets/images/org_ssh_logo.png";
import {
  WireBtn, WireCard, WireCheckbox, WireInput,
  WirePublicNav, WireSelect,
} from "../components/WireframeUI";

// â”€â”€â”€ Shared form shell â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function AuthShell({
  navigate,
  roleBadge,
  roleColor,
  title,
  subtitle,
  formTitle = "Welcome back",
  formSubtitle = "Enter your details to continue.",
  children,
}: {
  navigate: (s: string) => void;
  roleBadge: string;
  roleColor: string;
  title: string;
  subtitle: string;
  formTitle?: string;
  formSubtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-[#000000]">
      <WirePublicNav navigate={navigate} />
      <div className="px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto grid min-h-[calc(100vh-96px)] max-w-6xl items-center gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="relative min-h-[440px] overflow-hidden rounded-[28px] bg-[#4B3621] p-7 text-white shadow-[0_22px_60px_rgba(75,54,33,0.18)] sm:p-10">
            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border-[34px] border-[#E3C565]/50" />
            <div className="absolute -bottom-40 right-0 h-80 w-80 rounded-full border-[42px] border-[#E3C565]/20" />
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center ring-2 ring-white/20">
                  <img src={organizationLogo} alt="University Organization logo" className="h-full w-full object-contain" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#E3C565]">PUP Taguig</p>
                  <p className="font-semibold">Student Services Hub</p>
                </div>
              </div>
              <div className="relative py-12">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-[#E3C565]">
                  <i className="bi bi-shield-check" aria-hidden="true" />
                  Secure access portal
                </div>
                <h1 className="max-w-md text-3xl font-bold leading-tight tracking-[-0.04em] sm:text-5xl">{title}</h1>
                <p className="mt-5 max-w-sm text-sm leading-6 text-[#E3C565]">{subtitle}</p>
              </div>
              <div className="border-t border-white/15 pt-5 text-xs text-[#E3C565]">
                <strong className="text-white">One hub.</strong> Printing, supplies, and academic resources for the PUP Taguig community.
              </div>
            </div>
          </div>
          <div className="mx-auto w-full max-w-lg">
            <div className="mb-5">
              <div className={`mb-2 inline-block rounded-full px-3 py-1 text-xs font-bold text-white ${roleColor}`}>
                {roleBadge}
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-[#4B3621]">{formTitle}</h2>
              <p className="mt-1 text-sm text-gray-500">{formSubtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€ 1. PUPTian Login â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function Login({ navigate }: { navigate: (s: string) => void }) {
  return (
    <AuthShell
      navigate={navigate}
      roleBadge="PUPTian Login"
      roleColor="bg-[#4B3621]"
      title="University Organization Student Services Hub"
      subtitle="Sign in with your student account"
    >
      <WireCard className="rounded-[26px] border-[#4B3621]/20 p-5 shadow-[0_18px_40px_rgba(75,54,33,0.10)] sm:p-7">
        <form className="flex flex-col gap-4">
          <WireInput label="Student Number / Email" placeholder="e.g. 2021-00001 or juan@pup.edu.ph" />
          <WireInput label="Password" type="password" placeholder="Enter your password" />
          <div className="flex items-center justify-between">
            <WireCheckbox label="Remember Me" />
            <button type="button" className="text-xs text-gray-500 hover:text-gray-800 underline">Forgot Password?</button>
          </div>
          <WireBtn type="submit" size="lg" className="w-full mt-1" onClick={() => navigate("student-dashboard")}>
            Login as PUPTian
          </WireBtn>
        </form>
        <div className="border-t border-gray-200 mt-4 pt-4 text-center">
          <p className="text-sm text-gray-500 mb-3">No account yet?</p>
          <WireBtn variant="outline" className="w-full" onClick={() => navigate("register")}>Register as PUPTian</WireBtn>
        </div>
      </WireCard>
      <div className="mt-4 flex flex-col gap-2">
        <p className="text-xs text-gray-400 text-center mb-1">Other login portals:</p>
        <div className="grid grid-cols-3 gap-2">
          <WireBtn variant="secondary" size="sm" onClick={() => navigate("login-guest")}>Guest</WireBtn>
          <WireBtn variant="secondary" size="sm" onClick={() => navigate("login-provider")}>Provider</WireBtn>
          <WireBtn variant="secondary" size="sm" onClick={() => navigate("login-admin")}>Admin</WireBtn>
        </div>
        <p className="text-center text-xs text-gray-400 mt-1">
          <span className="underline cursor-pointer" onClick={() => navigate("landing")}>&larr; Back to Landing</span>
        </p>
      </div>
    </AuthShell>
  );
}

// â”€â”€â”€ 2. Guest Login â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function GuestLogin({ navigate }: { navigate: (s: string) => void }) {
  return (
    <AuthShell
      navigate={navigate}
      roleBadge="Guest Login"
      roleColor="bg-[#E3C565] text-[#000000]"
      title="University Organization Student Services Hub"
      subtitle="Limited access â€” browse and post requests"
    >
      <div className="mb-4 rounded-2xl border border-[#4B3621]/15 bg-[#E3C565]/35 p-4 text-xs text-[#4B3621]">
        <strong>Guest Access:</strong> You can browse services and post public need requests.
        Full ordering features require a PUPTian account.
      </div>
      <WireCard className="rounded-[26px] border-[#4B3621]/20 p-5 shadow-[0_18px_40px_rgba(75,54,33,0.10)] sm:p-7">
        <form className="flex flex-col gap-4">
          <WireInput label="Email Address" type="email" placeholder="your@email.com" />
          <WireInput label="Password" type="password" placeholder="Enter your password" />
          <div className="flex items-center justify-between">
            <WireCheckbox label="Remember Me" />
            <button type="button" className="text-xs text-gray-500 hover:text-gray-800 underline">Forgot Password?</button>
          </div>
          <WireBtn type="submit" size="lg" className="w-full mt-1 bg-gray-600 border-gray-600" onClick={() => navigate("guest-dashboard")}>
            Login as Guest
          </WireBtn>
        </form>
        <div className="border-t border-gray-200 mt-4 pt-4 text-center">
          <p className="text-sm text-gray-500 mb-3">No guest account?</p>
          <WireBtn variant="outline" className="w-full" onClick={() => navigate("register-guest")}>Register as Guest</WireBtn>
        </div>
      </WireCard>
      <div className="mt-4 flex flex-col gap-2">
        <p className="text-xs text-gray-400 text-center mb-1">Other login portals:</p>
        <div className="grid grid-cols-3 gap-2">
          <WireBtn variant="secondary" size="sm" onClick={() => navigate("login")}>PUPTian</WireBtn>
          <WireBtn variant="secondary" size="sm" onClick={() => navigate("login-provider")}>Provider</WireBtn>
          <WireBtn variant="secondary" size="sm" onClick={() => navigate("login-admin")}>Admin</WireBtn>
        </div>
        <p className="text-center text-xs text-gray-400 mt-1">
          <span className="underline cursor-pointer" onClick={() => navigate("landing")}>&larr; Back to Landing</span>
        </p>
      </div>
    </AuthShell>
  );
}

// â”€â”€â”€ 3. Service Provider Login â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function ProviderLogin({ navigate }: { navigate: (s: string) => void }) {
  return (
    <AuthShell
      navigate={navigate}
      roleBadge="Service Provider Login"
      roleColor="bg-[#4B3621]"
      title="University Organization Student Services Hub"
      subtitle="Collaborating provider portal"
    >
      <div className="mb-4 rounded-2xl border border-[#4B3621]/15 bg-[#E3C565]/35 p-4 text-xs text-[#4B3621]">
        <strong>Providers:</strong> Only University Organization-approved collaborating businesses can access this portal.
        Contact University Organization if you wish to become a provider.
      </div>
      <WireCard className="rounded-[26px] border-[#4B3621]/20 p-5 shadow-[0_18px_40px_rgba(75,54,33,0.10)] sm:p-7">
        <form className="flex flex-col gap-4">
          <WireInput label="Business Email" type="email" placeholder="your.shop@email.com" />
          <WireInput label="Password" type="password" placeholder="Enter your password" />
          <div className="flex items-center justify-between">
            <WireCheckbox label="Remember Me" />
            <button type="button" className="text-xs text-gray-500 hover:text-gray-800 underline">Forgot Password?</button>
          </div>
          <WireBtn type="submit" size="lg" className="w-full mt-1 bg-gray-700 border-gray-700" onClick={() => navigate("provider-dashboard")}>
            Login as Provider
          </WireBtn>
        </form>
        <div className="border-t border-gray-200 mt-4 pt-4 text-center">
          <p className="text-sm text-gray-500 mb-3">Not yet a collaborator?</p>
          <WireBtn variant="outline" className="w-full" onClick={() => navigate("register")}>Apply as Provider</WireBtn>
        </div>
      </WireCard>
      <div className="mt-4 flex flex-col gap-2">
        <p className="text-xs text-gray-400 text-center mb-1">Other login portals:</p>
        <div className="grid grid-cols-3 gap-2">
          <WireBtn variant="secondary" size="sm" onClick={() => navigate("login")}>PUPTian</WireBtn>
          <WireBtn variant="secondary" size="sm" onClick={() => navigate("login-guest")}>Guest</WireBtn>
          <WireBtn variant="secondary" size="sm" onClick={() => navigate("login-admin")}>Admin</WireBtn>
        </div>
        <p className="text-center text-xs text-gray-400 mt-1">
          <span className="underline cursor-pointer" onClick={() => navigate("landing")}>&larr; Back to Landing</span>
        </p>
      </div>
    </AuthShell>
  );
}

// â”€â”€â”€ 4. Admin Login (internal) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function AdminLogin({ navigate }: { navigate: (s: string) => void }) {
  return (
    <div className="min-h-screen bg-white text-[#000000]">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div className="relative min-h-[440px] overflow-hidden rounded-[28px] bg-[#000000] p-7 text-white shadow-[0_22px_60px_rgba(0,0,0,0.18)] sm:p-10">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border-[34px] border-[#E3C565]/40" />
          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center ring-2 ring-white/20">
                <img src={organizationLogo} alt="University Organization logo" className="h-full w-full object-contain" />
              </span>
              <p className="font-semibold">Student Services Hub</p>
            </div>
            <div className="py-12">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E3C565]/30 bg-[#E3C565]/10 px-3 py-1.5 text-xs font-medium text-[#E3C565]">
                <i className="bi bi-lock-fill" aria-hidden="true" />
                Restricted access
              </div>
              <h1 className="text-4xl font-bold leading-tight tracking-[-0.04em]">University Organization Admin Access</h1>
              <p className="mt-5 text-sm leading-6 text-[#E3C565]">Internal operations for approvals, providers, orders, and platform content.</p>
            </div>
            <p className="border-t border-white/15 pt-5 text-xs text-gray-400">Administrator credentials are issued by University Organization management only.</p>
          </div>
        </div>
        <div className="mx-auto w-full max-w-lg">
          <div className="mb-5">
            <div className="mb-2 inline-block rounded-full bg-[#000000] px-3 py-1 text-xs font-bold text-[#E3C565]">ADMINISTRATOR PORTAL</div>
            <h2 className="text-2xl font-bold tracking-tight text-[#4B3621]">Sign in securely</h2>
            <p className="mt-1 text-sm text-gray-500">Two-factor authentication is required for admin access.</p>
          </div>
          <div className="rounded-[26px] border border-[#4B3621]/20 bg-white p-5 shadow-[0_18px_40px_rgba(75,54,33,0.10)] sm:p-7">
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-wide text-[#4B3621]">Admin Username</label>
              <input placeholder="admin@pasoa.pup.edu.ph" className="w-full rounded-xl border border-[#4B3621]/20 bg-[#fffdf5] px-3 py-2.5 text-sm text-[#000000] placeholder-gray-400 focus:border-[#E3C565] focus:outline-none" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-wide text-[#4B3621]">Admin Password</label>
              <input type="password" placeholder="••••••••" className="w-full rounded-xl border border-[#4B3621]/20 bg-[#fffdf5] px-3 py-2.5 text-sm text-[#000000] placeholder-gray-400 focus:border-[#E3C565] focus:outline-none" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-wide text-[#4B3621]">Admin Code (2FA)</label>
              <input placeholder="6-digit authentication code" className="w-full rounded-xl border border-[#4B3621]/20 bg-[#fffdf5] px-3 py-2.5 text-sm text-[#000000] placeholder-gray-400 focus:border-[#E3C565] focus:outline-none" />
            </div>
            <WireBtn size="lg" className="mt-1 w-full rounded-xl border-[#4B3621] bg-[#4B3621] text-white hover:bg-[#000000]" onClick={() => navigate("admin-dashboard")}>
              Access Admin Panel
            </WireBtn>
          </form>
          </div>
          <button onClick={() => navigate("landing")} className="mt-5 block mx-auto text-xs text-gray-500 underline hover:text-[#4B3621]">
            &larr; Back to Landing Page
          </button>
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€ 5. PUPTian Registration â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function Register({ navigate }: { navigate: (s: string) => void }) {
  const [role, setRole] = useState<"puptian" | "provider">("puptian");
  return (
    <AuthShell
      navigate={navigate}
      roleBadge="Registration"
      roleColor="bg-[#4B3621]"
      title="Join the student services hub."
      subtitle="Choose the account that matches how you want to participate in the PUP Taguig community."
      formTitle="Create an Account"
      formSubtitle="Join University Organization Student Services Hub"
    >
      <div className="mb-5 flex overflow-hidden rounded-2xl border border-[#4B3621]/20 bg-white p-1 shadow-sm">
            <button onClick={() => setRole("puptian")} className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors ${role === "puptian" ? "bg-[#4B3621] text-white" : "text-gray-600 hover:bg-[#E3C565]/30"}`}>
              PUPTian (Student)
            </button>
            <button onClick={() => setRole("provider")} className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors ${role === "provider" ? "bg-[#4B3621] text-white" : "text-gray-600 hover:bg-[#E3C565]/30"}`}>
              Service Provider
            </button>
      </div>

      <div className="mb-4 text-center">
            <p className="text-xs text-gray-500">
              Registering as a Guest?{" "}
              <span className="cursor-pointer font-medium text-[#4B3621] underline" onClick={() => navigate("register-guest")}>
                Guest Registration &rarr;
              </span>
            </p>
      </div>

      <WireCard className="rounded-[26px] border-[#4B3621]/20 p-5 shadow-[0_18px_40px_rgba(75,54,33,0.10)] sm:p-7">
            {role === "puptian" ? (
              <form className="flex flex-col gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="text-xs font-semibold uppercase tracking-wide border-b border-gray-100 pb-2 mb-1 md:col-span-2 text-gray-500">PUPTian &mdash; Student Information</div>
                  <WireInput label="Full Name" placeholder="Last Name, First Name M.I." />
                  <WireInput label="Student Number" placeholder="e.g. 2021-00001" />
                  <WireInput label="Email Address" type="email" placeholder="Official PUP or personal email" />
                  <WireInput label="Contact Number" type="tel" placeholder="09XXXXXXXXX" />
                  <WireInput label="Password" type="password" placeholder="Minimum 8 characters" />
                  <WireInput label="Confirm Password" type="password" placeholder="Re-enter your password" />
                  <div className="mt-1 md:col-span-2"><WireCheckbox label="I have read and agree to the Terms and Services" /></div>
                </div>
                <WireBtn type="submit" size="lg" className="w-full mt-2" onClick={() => navigate("student-dashboard")}>Register as PUPTian</WireBtn>
              </form>
            ) : (
              <form className="flex flex-col gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="text-xs font-semibold uppercase tracking-wide border-b border-gray-100 pb-2 mb-1 md:col-span-2 text-gray-500">Service Provider &mdash; Business Information</div>
                  <WireInput label="Business / Provider Name" placeholder="Official business name" />
                  <WireInput label="Contact Person" placeholder="Name of authorized representative" />
                  <WireInput label="Email Address" type="email" placeholder="Business email" />
                  <WireInput label="Contact Number" type="tel" placeholder="09XXXXXXXXX" />
                  <WireInput className="md:col-span-2" label="Business Address" placeholder="Complete address" />
                  <WireSelect className="md:col-span-2" label="Service Type" options={["Select service type...", "Printing Services", "School Supplies", "Both"]} />
                  <WireInput label="Password" type="password" placeholder="Minimum 8 characters" />
                  <WireInput label="Confirm Password" type="password" placeholder="Re-enter your password" />
                  <div className="border border-dashed border-gray-300 bg-gray-50 p-3 text-xs text-gray-500 md:col-span-2">
                    <strong>Note:</strong> Provider accounts require University Organization approval before activation.
                  </div>
                  <div className="mt-1 md:col-span-2"><WireCheckbox label="I have read and agree to the Terms and Services" /></div>
                </div>
                <WireBtn type="submit" size="lg" className="w-full mt-2" onClick={() => navigate("provider-dashboard")}>Submit Provider Application</WireBtn>
              </form>
            )}
            <div className="border-t border-gray-200 mt-4 pt-4 text-center">
              <WireBtn variant="ghost" onClick={() => navigate("login")} className="text-sm text-gray-500">&larr; Back to Login</WireBtn>
            </div>
          </WireCard>
    </AuthShell>
  );
}

// â”€â”€â”€ 6. Guest Registration â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function GuestRegister({ navigate }: { navigate: (s: string) => void }) {
  return (
    <AuthShell
      navigate={navigate}
      roleBadge="Guest Registration"
      roleColor="bg-[#E3C565] text-[#000000]"
      title="Explore first. Join when ready."
      subtitle="Create a limited guest account to browse services and post public requests before committing to a full student account."
      formTitle="Create a Guest Account"
      formSubtitle="Browse services and post requests"
    >
          <div className="mb-4 rounded-2xl border border-[#4B3621]/15 bg-[#E3C565]/35 p-4 text-xs text-[#4B3621]">
            <p className="font-semibold mb-1">Guest Account Limitations:</p>
            <ul className="list-disc list-inside flex flex-col gap-0.5">
              <li>Can browse all available services</li>
              <li>Can post &ldquo;Need / Request&rdquo; posts (admin approval required)</li>
              <li>Cannot order printing or purchase supplies</li>
              <li>Cannot create rental posts (PUPTian only)</li>
              <li>Cannot track orders</li>
            </ul>
          </div>

          <WireCard className="rounded-[26px] border-[#4B3621]/20 p-5 shadow-[0_18px_40px_rgba(75,54,33,0.10)] sm:p-7">
            <form className="flex flex-col gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="text-xs font-semibold uppercase tracking-wide border-b border-gray-100 pb-2 mb-1 md:col-span-2 text-gray-500">Guest &mdash; Basic Information</div>
                <WireInput label="Full Name" placeholder="Your full name" />
                <WireInput label="Email Address" type="email" placeholder="your@email.com" />
                <WireInput label="Contact Number" type="tel" placeholder="09XXXXXXXXX" />
                <WireSelect label="Purpose / Affiliation" options={["Select...", "Non-PUP Student", "Faculty / Staff"]} />
                <WireInput label="Password" type="password" placeholder="Minimum 8 characters" />
                <WireInput label="Confirm Password" type="password" placeholder="Re-enter your password" />
                <div className="mt-1 md:col-span-2">
                  <WireCheckbox label="I understand guest accounts have limited access" />
                  <div className="mt-2">
                    <WireCheckbox label="I have read and agree to the Terms and Services" />
                  </div>
                </div>
              </div>
              <WireBtn type="submit" size="lg" className="w-full mt-2 bg-gray-600 border-gray-600" onClick={() => navigate("guest-dashboard")}>
                Register as Guest
              </WireBtn>
            </form>
            <div className="border-t border-gray-200 mt-4 pt-4 text-center flex flex-col gap-2">
              <p className="text-xs text-gray-500">PUP Taguig student?</p>
              <WireBtn variant="outline" className="w-full" onClick={() => navigate("register")}>Register as PUPTian instead</WireBtn>
              <WireBtn variant="ghost" onClick={() => navigate("login-guest")} className="text-sm text-gray-500">&larr; Back to Guest Login</WireBtn>
            </div>
        </WireCard>
    </AuthShell>
  );
}
