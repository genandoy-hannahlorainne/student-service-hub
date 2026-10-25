import { useState } from "react";
import {
  WireBtn, WireCard, WireCheckbox, WireInput, WirePlaceholder,
  WirePublicNav, WireSelect,
} from "../components/WireframeUI";

// ─── Shared form shell ───────────────────────────────────────────────

function AuthShell({
  navigate,
  roleBadge,
  roleColor,
  title,
  subtitle,
  children,
}: {
  navigate: (s: string) => void;
  roleBadge: string;
  roleColor: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <WirePublicNav navigate={navigate} />
      <div className="flex items-center justify-center py-8 px-4 min-h-[calc(100vh-56px)]">
        <div className="w-full max-w-sm">
          <div className="text-center mb-5">
            <WirePlaceholder label="LOGO" className="w-14 h-14 mx-auto mb-3" />
            <div className={`inline-block px-3 py-1 text-xs font-bold text-white mb-2 ${roleColor}`}>
              {roleBadge}
            </div>
            <h1 className="text-xl font-bold text-gray-800">{title}</h1>
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── 1. PUPTian Login ────────────────────────────────────────────────

export function Login({ navigate }: { navigate: (s: string) => void }) {
  return (
    <AuthShell
      navigate={navigate}
      roleBadge="PUPTian Login"
      roleColor="bg-gray-800"
      title="PASOA Student Services"
      subtitle="Sign in with your student account"
    >
      <WireCard>
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
          <span className="underline cursor-pointer" onClick={() => navigate("landing")}>← Back to Landing</span>
        </p>
      </div>
    </AuthShell>
  );
}

// ─── 2. Guest Login ──────────────────────────────────────────────────

export function GuestLogin({ navigate }: { navigate: (s: string) => void }) {
  return (
    <AuthShell
      navigate={navigate}
      roleBadge="Guest Login"
      roleColor="bg-gray-500"
      title="PASOA Student Services"
      subtitle="Limited access — browse and post requests"
    >
      <div className="border border-dashed border-gray-400 p-3 bg-gray-50 text-xs text-gray-600 mb-4">
        <strong>Guest Access:</strong> You can browse services and post public need requests.
        Full ordering features require a PUPTian account.
      </div>
      <WireCard>
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
          <span className="underline cursor-pointer" onClick={() => navigate("landing")}>← Back to Landing</span>
        </p>
      </div>
    </AuthShell>
  );
}

// ─── 3. Service Provider Login ────────────────────────────────────────

export function ProviderLogin({ navigate }: { navigate: (s: string) => void }) {
  return (
    <AuthShell
      navigate={navigate}
      roleBadge="Service Provider Login"
      roleColor="bg-gray-600"
      title="PASOA Student Services"
      subtitle="Collaborating provider portal"
    >
      <div className="border border-dashed border-gray-400 p-3 bg-gray-50 text-xs text-gray-600 mb-4">
        <strong>Providers:</strong> Only PASOA-approved collaborating businesses can access this portal.
        Contact PASOA if you wish to become a provider.
      </div>
      <WireCard>
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
          <span className="underline cursor-pointer" onClick={() => navigate("landing")}>← Back to Landing</span>
        </p>
      </div>
    </AuthShell>
  );
}

// ─── 4. Admin Login (internal) ────────────────────────────────────────

export function AdminLogin({ navigate }: { navigate: (s: string) => void }) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-start sm:items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <WirePlaceholder label="PASOA LOGO" className="w-16 h-16 mx-auto mb-3" />
          <div className="inline-block bg-gray-700 text-white text-xs font-bold px-3 py-1 mb-2">
            ADMINISTRATOR PORTAL
          </div>
          <h1 className="text-xl font-bold text-white">PASOA Admin Access</h1>
          <p className="text-sm text-gray-400 mt-1">Internal use only — not publicly accessible</p>
        </div>

        <div className="border border-gray-600 bg-gray-800 p-5">
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Admin Username</label>
              <input placeholder="admin@pasoa.pup.edu.ph" className="border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 w-full" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Admin Password</label>
              <input type="password" placeholder="••••••••" className="border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 w-full" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Admin Code (2FA)</label>
              <input placeholder="6-digit authentication code" className="border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 w-full" />
            </div>
            <div className="border border-dashed border-gray-600 p-2 text-center text-xs text-gray-500">
              Two-factor authentication is required for admin access.
            </div>
            <WireBtn size="lg" className="w-full mt-1 bg-gray-100 text-gray-900 border-gray-200 hover:bg-white" onClick={() => navigate("admin-dashboard")}>
              Access Admin Panel
            </WireBtn>
          </form>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Admin credentials are issued by PASOA management only.<br />
            This portal is <strong className="text-gray-300">not publicly registered</strong>.
          </p>
          <button onClick={() => navigate("landing")} className="text-xs text-gray-500 hover:text-gray-300 underline mt-2 block mx-auto">
            ← Back to Landing Page
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── 5. PUPTian Registration ─────────────────────────────────────────

export function Register({ navigate }: { navigate: (s: string) => void }) {
  const [role, setRole] = useState<"puptian" | "provider">("puptian");
  return (
    <div className="min-h-screen bg-gray-50">
      <WirePublicNav navigate={navigate} />
      <div className="flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-6">
            <WirePlaceholder label="LOGO" className="w-14 h-14 mx-auto mb-3" />
            <h1 className="text-xl font-bold text-gray-800">Create an Account</h1>
            <p className="text-sm text-gray-500 mt-1">Join PASOA Student Services</p>
          </div>

          {/* Role tabs */}
          <div className="flex border border-gray-300 mb-5 bg-white">
            <button onClick={() => setRole("puptian")} className={`flex-1 py-2.5 text-sm font-medium transition-colors ${role === "puptian" ? "bg-gray-800 text-white" : "text-gray-600 hover:bg-gray-50"}`}>
              PUPTian (Student)
            </button>
            <button onClick={() => setRole("provider")} className={`flex-1 py-2.5 text-sm font-medium transition-colors border-l border-gray-300 ${role === "provider" ? "bg-gray-800 text-white" : "text-gray-600 hover:bg-gray-50"}`}>
              Service Provider
            </button>
          </div>

          <div className="mb-4 text-center">
            <p className="text-xs text-gray-500">
              Registering as a Guest?{" "}
              <span className="underline cursor-pointer text-gray-700 font-medium" onClick={() => navigate("register-guest")}>
                Guest Registration →
              </span>
            </p>
          </div>

          <WireCard>
            {role === "puptian" ? (
              <form className="flex flex-col gap-4">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100 pb-2 mb-1">PUPTian — Student Information</div>
                <WireInput label="Full Name" placeholder="Last Name, First Name M.I." />
                <WireInput label="Student Number" placeholder="e.g. 2021-00001" />
                <WireInput label="Email Address" type="email" placeholder="Official PUP or personal email" />
                <WireInput label="Contact Number" type="tel" placeholder="09XXXXXXXXX" />
                <WireInput label="Password" type="password" placeholder="Minimum 8 characters" />
                <WireInput label="Confirm Password" type="password" placeholder="Re-enter your password" />
                <div className="mt-1"><WireCheckbox label="I have read and agree to the Terms and Services" /></div>
                <WireBtn type="submit" size="lg" className="w-full mt-2" onClick={() => navigate("student-dashboard")}>Register as PUPTian</WireBtn>
              </form>
            ) : (
              <form className="flex flex-col gap-4">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100 pb-2 mb-1">Service Provider — Business Information</div>
                <WireInput label="Business / Provider Name" placeholder="Official business name" />
                <WireInput label="Contact Person" placeholder="Name of authorized representative" />
                <WireInput label="Email Address" type="email" placeholder="Business email" />
                <WireInput label="Contact Number" type="tel" placeholder="09XXXXXXXXX" />
                <WireInput label="Business Address" placeholder="Complete address" />
                <WireSelect label="Service Type" options={["Select service type...", "Printing Services", "School Supplies", "Both"]} />
                <WireInput label="Password" type="password" placeholder="Minimum 8 characters" />
                <WireInput label="Confirm Password" type="password" placeholder="Re-enter your password" />
                <div className="border border-dashed border-gray-300 p-3 bg-gray-50 text-xs text-gray-500">
                  <strong>Note:</strong> Provider accounts require PASOA approval before activation.
                </div>
                <div className="mt-1"><WireCheckbox label="I have read and agree to the Terms and Services" /></div>
                <WireBtn type="submit" size="lg" className="w-full mt-2" onClick={() => navigate("provider-dashboard")}>Submit Provider Application</WireBtn>
              </form>
            )}
            <div className="border-t border-gray-200 mt-4 pt-4 text-center">
              <WireBtn variant="ghost" onClick={() => navigate("login")} className="text-sm text-gray-500">← Back to Login</WireBtn>
            </div>
          </WireCard>
        </div>
      </div>
    </div>
  );
}

// ─── 6. Guest Registration ────────────────────────────────────────────

export function GuestRegister({ navigate }: { navigate: (s: string) => void }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <WirePublicNav navigate={navigate} />
      <div className="flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-5">
            <WirePlaceholder label="LOGO" className="w-14 h-14 mx-auto mb-3" />
            <div className="inline-block bg-gray-500 text-white text-xs font-bold px-3 py-1 mb-2">GUEST REGISTRATION</div>
            <h1 className="text-xl font-bold text-gray-800">Create a Guest Account</h1>
            <p className="text-sm text-gray-500 mt-1">Browse services and post requests</p>
          </div>

          <div className="border border-dashed border-gray-400 p-3 bg-gray-50 text-xs text-gray-600 mb-4">
            <p className="font-semibold mb-1">Guest Account Limitations:</p>
            <ul className="list-disc list-inside flex flex-col gap-0.5">
              <li>Can browse all available services</li>
              <li>Can post &ldquo;Need / Request&rdquo; posts (admin approval required)</li>
              <li>Cannot order printing or purchase supplies</li>
              <li>Cannot create rental posts (PUPTian only)</li>
              <li>Cannot track orders</li>
            </ul>
          </div>

          <WireCard>
            <form className="flex flex-col gap-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100 pb-2 mb-1">Guest — Basic Information</div>
              <WireInput label="Full Name" placeholder="Your full name" />
              <WireInput label="Email Address" type="email" placeholder="your@email.com" />
              <WireInput label="Contact Number" type="tel" placeholder="09XXXXXXXXX" />
              <WireSelect label="Purpose / Affiliation" options={["Select...", "PUP Taguig Student (unregistered)", "Non-PUP Student", "Faculty / Staff", "Community Member", "Other"]} />
              <WireInput label="Password" type="password" placeholder="Minimum 8 characters" />
              <WireInput label="Confirm Password" type="password" placeholder="Re-enter your password" />
              <div className="mt-1">
                <WireCheckbox label="I understand guest accounts have limited access" />
                <div className="mt-2">
                  <WireCheckbox label="I have read and agree to the Terms and Services" />
                </div>
              </div>
              <WireBtn type="submit" size="lg" className="w-full mt-2 bg-gray-600 border-gray-600" onClick={() => navigate("guest-dashboard")}>
                Register as Guest
              </WireBtn>
            </form>
            <div className="border-t border-gray-200 mt-4 pt-4 text-center flex flex-col gap-2">
              <p className="text-xs text-gray-500">PUP Taguig student?</p>
              <WireBtn variant="outline" className="w-full" onClick={() => navigate("register")}>Register as PUPTian instead</WireBtn>
              <WireBtn variant="ghost" onClick={() => navigate("login-guest")} className="text-sm text-gray-500">← Back to Guest Login</WireBtn>
            </div>
          </WireCard>
        </div>
      </div>
    </div>
  );
}
