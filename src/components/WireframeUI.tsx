import { ReactNode, useState, useCallback } from "react";
import organizationLogo from "../assets/images/org_ssh_logo.png";

// â”€â”€â”€ Primitives â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function WireBox({ className = "", children }: { className?: string; children?: ReactNode }) {
  return <div className={`border border-gray-300 ${className}`}>{children}</div>;
}

export function WirePlaceholder({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div className={`bg-gray-200 flex items-center justify-center text-gray-500 text-xs border border-dashed border-gray-400 ${className}`}>
      [ {label} ]
    </div>
  );
}

export function WireBtn({
  children,
  variant = "primary",
  size = "md",
  onClick,
  className = "",
  type = "button",
  disabled,
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const base = "inline-flex items-center justify-center font-medium cursor-pointer transition-colors";
  const sizes = { sm: "px-3 py-1 text-xs", md: "px-4 py-2 text-sm", lg: "px-5 py-2.5 text-sm" };
  const variants = {
    primary: "bg-[#4B3621] text-white hover:bg-[#000000] border border-[#4B3621]",
    secondary: "bg-[#E3C565] text-[#000000] hover:bg-[#4B3621] border border-[#4B3621]",
    danger: "bg-gray-700 text-white hover:bg-gray-600 border border-gray-700",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 border border-transparent",
    outline: "bg-white text-[#4B3621] hover:bg-blue-50 border border-[#4B3621]",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}${disabled ? " opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
    >
      {children}
    </button>
  );
}

export function WireInput({
  label,
  type = "text",
  placeholder,
  className = "",
}: {
  label?: string;
  type?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        className="border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:border-gray-500 w-full"
      />
    </div>
  );
}

export function WireSelect({ label, options, className = "" }: { label?: string; options: string[]; className?: string }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</label>}
      <select className="border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:border-gray-500 w-full">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

export function WireTextarea({ label, placeholder, rows = 3, className = "" }: { label?: string; placeholder?: string; rows?: number; className?: string }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</label>}
      <textarea rows={rows} placeholder={placeholder} className="border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:border-gray-500 w-full resize-none" />
    </div>
  );
}

export function WireBadge({ children, variant = "default" }: { children: ReactNode; variant?: "default" | "success" | "pending" | "rejected" | "active" }) {
  const variants = {
    default: "border-gray-400 text-gray-600 bg-gray-100",
    success: "border-gray-600 text-gray-800 bg-gray-200 font-semibold",
    pending: "border-gray-500 text-gray-700 bg-gray-100 italic",
    rejected: "border-gray-700 text-gray-800 bg-gray-300",
    active: "border-gray-800 text-gray-900 bg-gray-200 font-bold",
  };
  return <span className={`border px-2 py-0.5 text-xs ${variants[variant]}`}>{children}</span>;
}

export function WireCard({ children, className = "", onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return <div className={`bg-white border border-gray-300 p-4 ${className}`} onClick={onClick}>{children}</div>;
}

export function WireSectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-base font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">{children}</h2>;
}

export function WireLabel({ children }: { children: ReactNode }) {
  return <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{children}</span>;
}

export function WireTable({ headers, rows }: { headers: string[]; rows: (string | ReactNode)[][] }) {
  return (
    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
      <table className="w-full text-sm border-collapse min-w-[540px]">
        <thead>
          <tr className="bg-gray-100 border-b-2 border-gray-300">
            {headers.map((h) => (
              <th key={h} className="text-left px-3 py-2 font-semibold text-gray-700 text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 text-gray-700 whitespace-nowrap">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function WireModal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white border border-gray-400 w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-3 bg-gray-100 border-b border-gray-300 sticky top-0">
          <span className="font-semibold text-gray-800 text-sm">{title}</span>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-xl leading-none w-8 h-8 flex items-center justify-center">&times;</button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export function WireStatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <WireCard className="flex flex-col gap-1">
      <WireLabel>{label}</WireLabel>
      <span className="text-2xl font-bold text-gray-800 mono">{value}</span>
    </WireCard>
  );
}

export function WireCheckbox({ label }: { label: string }) {
  return (
    <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer">
      <input type="checkbox" className="w-4 h-4 border border-gray-400 mt-0.5 shrink-0" />
      <span>{label}</span>
    </label>
  );
}

export function WireRadioGroup({ label, options, name }: { label?: string; options: string[]; name: string }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <WireLabel>{label}</WireLabel>}
      <div className="flex flex-wrap gap-3 mt-1">
        {options.map((o) => (
          <label key={o} className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer">
            <input type="radio" name={name} className="w-4 h-4" />{o}
          </label>
        ))}
      </div>
    </div>
  );
}

// â”€â”€â”€ Progress tracker â€” vertical on mobile, horizontal on sm+ â”€â”€â”€â”€â”€â”€â”€â”€

export function WireProgressTracker({ steps, current }: { steps: string[]; current: number }) {
  return (
    <>
      {/* Horizontal (sm and up) */}
      <div className="hidden sm:flex items-start justify-between w-full">
        {steps.map((step, i) => (
          <div key={step} className="flex flex-col items-center flex-1 relative">
            {i < steps.length - 1 && (
              <div className={`absolute top-4 left-1/2 w-full h-0.5 ${i < current ? "bg-gray-700" : "bg-gray-300"}`} />
            )}
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold z-10 ${i < current ? "bg-gray-700 border-gray-700 text-white" : i === current ? "bg-gray-300 border-gray-700 text-gray-800" : "bg-white border-gray-300 text-gray-400"}`}>
              {i < current ? "âœ“" : i + 1}
            </div>
            <span className={`text-xs mt-1 text-center leading-tight ${i <= current ? "text-gray-800 font-medium" : "text-gray-400"}`}>{step}</span>
          </div>
        ))}
      </div>
      {/* Vertical (mobile) */}
      <div className="sm:hidden flex flex-col gap-0">
        {steps.map((step, i) => (
          <div key={step} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${i < current ? "bg-gray-700 border-gray-700 text-white" : i === current ? "bg-gray-300 border-gray-700 text-gray-800" : "bg-white border-gray-300 text-gray-400"}`}>
                {i < current ? "âœ“" : i + 1}
              </div>
              {i < steps.length - 1 && <div className={`w-0.5 h-6 ${i < current ? "bg-gray-700" : "bg-gray-300"}`} />}
            </div>
            <span className={`text-sm pt-1 ${i <= current ? "text-gray-800 font-medium" : "text-gray-400"}`}>{step}</span>
          </div>
        ))}
      </div>
    </>
  );
}

// â”€â”€â”€ Public nav with mobile hamburger â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function WirePublicNav({ navigate }: { navigate: (s: string) => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navLinks: { label: string; screen: string }[] = [
    { label: "Home", screen: "landing" },
    { label: "Contact", screen: "contact" },
    { label: "Provider Partnership", screen: "provider-partnership" },
  ];

  return (
    <>
    <div className="h-[70px]" aria-hidden="true" />
    <nav className="fixed inset-x-0 top-0 z-40 border-b border-[#4B3621]/20 bg-white text-[#4B3621] shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center">
            <img src={organizationLogo} alt="University Organization logo" className="h-full w-full object-contain" />
          </span>
          <span className="text-sm font-bold">University Organization Student Services Hub</span>
        </div>

        {/* Desktop links */}
        <div className="hidden items-center gap-5 text-sm lg:flex">
          {navLinks.map((item) => (
            <button key={item.screen} onClick={() => navigate(item.screen)} className="whitespace-nowrap text-[#4B3621] transition-colors hover:text-[#E3C565]">{item.label}</button>
          ))}
        </div>

        {/* Desktop auth buttons */}
        <div className="hidden items-center gap-2 md:flex">
          <WireBtn variant="outline" size="sm" onClick={() => navigate("login")} className="rounded-lg border-[#4B3621] bg-transparent text-[#4B3621] hover:bg-[#E3C565]">Login</WireBtn>
          <WireBtn variant="secondary" size="sm" onClick={() => navigate("register")} className="rounded-lg border-[#E3C565] bg-[#E3C565]">Register</WireBtn>
        </div>

        {/* Mobile: auth + hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <WireBtn variant="outline" size="sm" onClick={() => navigate("login")} className="rounded-lg border-[#4B3621] bg-transparent px-2 py-1 text-xs text-[#4B3621] hover:bg-[#E3C565]">Login</WireBtn>
          <button
            onClick={() => setMobileOpen((v: boolean) => !v)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-lg border border-[#4B3621] hover:bg-[#E3C565]"
            aria-label="Menu"
          >
            <span className={`block h-0.5 w-5 bg-[#4B3621] transition-all ${mobileOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-[#4B3621] transition-all ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-[#4B3621] transition-all ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="flex flex-col gap-1 border-t border-[#4B3621] bg-white px-4 py-3 md:hidden">
          {navLinks.map((item) => (
            <button key={item.screen} onClick={() => { navigate(item.screen); setMobileOpen(false); }} className="border-b border-[#4B3621] py-2 text-left text-sm text-[#4B3621] last:border-0 hover:text-[#E3C565]">
              {item.label}
            </button>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            <WireBtn className="w-full" onClick={() => { navigate("login"); setMobileOpen(false); }}>Login</WireBtn>
            <WireBtn variant="secondary" className="w-full" onClick={() => { navigate("register"); setMobileOpen(false); }}>Register</WireBtn>
          </div>
        </div>
      )}
    </nav>
    </>
  );
}

// â”€â”€â”€ Authenticated layouts with mobile drawer sidebar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type NavItem = { label: string; screen?: string; icon?: string };

function bootstrapIconForLabel(label: string): string {
  if (label.includes("Dashboard")) return "bi-grid-1x2";
  if (label.includes("Browse") || label.includes("Services")) return "bi-grid";
  if (label.includes("Printing")) return "bi-printer";
  if (label.includes("Supplies")) return "bi-bag";
  if (label.includes("Rental")) return "bi-box-seam";
  if (label.includes("Orders")) return "bi-receipt";
  if (label.includes("Transaction")) return "bi-clock-history";
  if (label.includes("Profile") || label.includes("Users")) return "bi-person";
  if (label.includes("Provider")) return "bi-shop";
  if (label.includes("Approval")) return "bi-check2-circle";
  if (label.includes("Settings")) return "bi-gear";
  if (label.includes("Logout")) return "bi-box-arrow-right";
  return "bi-circle";
}

function HamburgerBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 border border-gray-500 hover:bg-gray-700 mr-2 shrink-0"
      aria-label="Toggle sidebar"
    >
      <span className="block w-5 h-0.5 bg-white" />
      <span className="block w-5 h-0.5 bg-white" />
      <span className="block w-5 h-0.5 bg-white" />
    </button>
  );
}

function AuthHeader({ role, onMenuToggle, navigate }: { role: string; onMenuToggle: () => void; navigate: (s: string) => void }) {
  return (
    <header className="bg-gray-800 text-white px-3 py-2.5 flex items-center justify-between border-b border-gray-600 h-14 shrink-0">
      <div className="flex items-center gap-2 min-w-0">
        <HamburgerBtn onClick={onMenuToggle} />
        <WirePlaceholder label="LOGO" className="w-7 h-7 shrink-0" />
        <span className="font-bold text-sm hidden sm:block truncate">University Organization Student Services Hub</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <div className="hidden md:flex items-center border border-gray-500 bg-gray-700 px-2 py-1">
          <i className="bi bi-search text-gray-400 text-xs mr-1" aria-hidden="true" />
          <input placeholder="Search..." className="bg-transparent text-sm text-white placeholder-gray-400 focus:outline-none w-32" />
        </div>
        <button className="text-gray-300 hover:text-white text-sm w-8 h-8 flex items-center justify-center" aria-label="Notifications">
          <i className="bi bi-bell" aria-hidden="true" />
        </button>
        <button className="flex items-center gap-1 text-sm hover:text-gray-300">
          <i className="bi bi-person-circle text-lg" aria-hidden="true" />
          <span className="hidden sm:block text-xs max-w-[100px] truncate">{role}</span>
        </button>
      </div>
    </header>
  );
}

function SidebarDrawer({
  items,
  active,
  navigate,
  open,
  onClose,
  accentColor = "border-gray-700",
}: {
  items: NavItem[];
  active: string;
  navigate: (s: string) => void;
  open: boolean;
  onClose: () => void;
  accentColor?: string;
}) {
  const handleNav = (screen?: string) => {
    if (screen) navigate(screen);
    onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-56 lg:w-48 shrink-0
          bg-gray-100 border-r border-gray-300
          flex flex-col py-3 overflow-y-auto
          transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Mobile close button */}
        <div className="lg:hidden flex items-center justify-between px-4 pb-3 mb-1 border-b border-gray-200">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Navigation</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl leading-none">&times;</button>
        </div>

        {items.map((item) => (
          <button
            key={item.label}
            onClick={() => handleNav(item.screen)}
            className={`text-left px-4 py-2.5 text-sm transition-colors ${
              active === item.screen
                ? `bg-gray-300 font-semibold text-gray-900 border-l-4 ${accentColor}`
                : "text-gray-700 hover:bg-gray-200"
            } ${item.label === "Logout" ? "mt-auto text-gray-500 border-t border-gray-300" : ""}`}
          >
            <i className={`bi ${bootstrapIconForLabel(item.label)} mr-2`} aria-hidden="true" />{item.label}
          </button>
        ))}
      </aside>
    </>
  );
}

// Shared layout factory
function AppLayout({
  children,
  items,
  active,
  navigate,
  role,
  accentColor,
}: {
  children: ReactNode;
  items: NavItem[];
  active: string;
  navigate: (s: string) => void;
  role: string;
  accentColor?: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AuthHeader role={role} onMenuToggle={() => setSidebarOpen((v: boolean) => !v)} navigate={navigate} />
      <div className="flex flex-1 overflow-hidden relative">
        <SidebarDrawer
          items={items}
          active={active}
          navigate={navigate}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          accentColor={accentColor}
        />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-5">
          {children}
        </main>
      </div>
    </div>
  );
}

export function StudentLayout({ children, active, navigate }: { children: ReactNode; active: string; navigate: (s: string) => void }) {
  const items: NavItem[] = [
    { label: "Dashboard", screen: "student-dashboard", icon: "âŠž" },
    { label: "Browse Services", screen: "browse-services", icon: "â—«" },
    { label: "â€” Printing", screen: "printing-service", icon: "" },
    { label: "â€” School Supplies", screen: "school-supplies", icon: "" },
    { label: "â€” Resource Rental", screen: "resource-rental", icon: "" },
    { label: "My Orders", screen: "order-tracking", icon: "â—ˆ" },
    { label: "My Rental Posts", screen: "rental-post-status", icon: "â—‰" },
    { label: "Transaction History", screen: "transaction-receipt", icon: "◌" },
    { label: "Profile", screen: "student-dashboard", icon: "â—Ž" },
    { label: "Logout", screen: "landing", icon: "â—" },
  ];
  return <AppLayout items={items} active={active} navigate={navigate} role="Juan dela Cruz" accentColor="border-gray-700">{children}</AppLayout>;
}

export function ProviderLayout({ children, active, navigate }: { children: ReactNode; active: string; navigate: (s: string) => void }) {
  const items: NavItem[] = [
    { label: "Dashboard", screen: "provider-dashboard", icon: "âŠž" },
    { label: "Orders", screen: "provider-dashboard", icon: "â—ˆ" },
    { label: "Services", screen: "provider-profile", icon: "â—«" },
    { label: "Availability", screen: "provider-profile", icon: "â—‰" },
    { label: "Delivery Settings", screen: "provider-profile", icon: "◌" },
    { label: "Transaction History", screen: "transaction-receipt", icon: "◌" },
    { label: "Profile", screen: "provider-profile", icon: "â—Ž" },
    { label: "Logout", screen: "landing", icon: "â—" },
  ];
  return <AppLayout items={items} active={active} navigate={navigate} role="Speedy Print Shop" accentColor="border-gray-600">{children}</AppLayout>;
}

export function AdminLayout({ children, active, navigate }: { children: ReactNode; active: string; navigate: (s: string) => void }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutRequest = useCallback(() => {
    setShowLogoutConfirm(true);
  }, []);

  const handleLogoutConfirm = useCallback(() => {
    setShowLogoutConfirm(false);
    navigate("landing"); // App.tsx intercepts "landing" while authenticated to call logout()
  }, [navigate]);

  const handleLogoutCancel = useCallback(() => {
    setShowLogoutConfirm(false);
  }, []);

  const navItems = [
    { label: "Dashboard",    screen: "admin-dashboard",       icon: "bi-grid-1x2" },
    { label: "Providers",    screen: "admin-providers",       icon: "bi-shop" },
    { label: "Rental Posts", screen: "admin-rental-approval", icon: "bi-box-seam" },
    { label: "Orders",       screen: "admin-orders",          icon: "bi-bag" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f3f0]">

      {/* ?? Left Sidebar ???????????????????????????????????????????????? */}
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        flex flex-col bg-[#4B3621] text-white shrink-0
        transition-all duration-200
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        ${collapsed ? "lg:w-16" : "w-56"}
      `}>

        {/* Logo area ? click logo to collapse/expand on desktop, ? to close on mobile */}
        <div className={`flex items-center gap-3 px-4 py-4 border-b border-white/10 ${collapsed ? "justify-center" : ""}`}>
          <button
            onClick={() => setCollapsed((v: boolean) => !v)}
            className="hidden lg:block shrink-0 rounded-xl p-0.5 hover:ring-2 hover:ring-[#E3C565]/50 transition"
            aria-label="Toggle sidebar"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <img src={organizationLogo} alt="UniServe logo" className="h-8 w-8 object-contain" />
          </button>
          {/* Mobile: non-clickable logo */}
          <img src={organizationLogo} alt="UniServe logo" className="lg:hidden h-8 w-8 shrink-0 object-contain" />
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-[#E3C565] leading-none">UniServe</p>
              <p className="text-sm font-bold truncate">Admin Panel</p>
            </div>
          )}
          {/* Mobile close button */}
          <button onClick={() => setMobileOpen(false)} className="lg:hidden ml-auto text-white/60 hover:text-white text-xl leading-none">&times;</button>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-1 p-3 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = active === item.screen;
            return (
              <button
                key={item.screen}
                onClick={() => { navigate(item.screen); setMobileOpen(false); }}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-left transition
                  ${isActive ? "bg-[#E3C565] text-[#4B3621]" : "text-white/70 hover:text-white hover:bg-white/10"}
                  ${collapsed ? "justify-center" : ""}
                `}
              >
                <i className={`bi ${item.icon} text-base shrink-0`} aria-hidden="true" />
                {!collapsed && item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom: admin badge + logout */}
        <div className={`p-3 border-t border-white/10 flex flex-col gap-2 ${collapsed ? "items-center" : ""}`}>
          {!collapsed && (
            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2">
              <img src={organizationLogo} alt="" className="h-5 w-5 object-contain shrink-0" />
              <span className="text-xs font-semibold truncate">Admin</span>
            </div>
          )}
          <button
            onClick={handleLogoutRequest}
            title="Logout"
            className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/60 hover:text-white hover:bg-white/10 transition ${collapsed ? "justify-center w-full" : "w-full"}`}
          >
            <i className="bi bi-box-arrow-right text-base shrink-0" aria-hidden="true" />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>

      {/* ?? Right: topbar + content ????????????????????????????????????? */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">

        {/* Topbar */}
        <header className="h-14 shrink-0 bg-white border-b border-[#4B3621]/10 px-4 flex items-center justify-between gap-3">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((v: boolean) => !v)}
            className="lg:hidden flex flex-col gap-1.5 w-8 h-8 items-center justify-center shrink-0"
            aria-label="Toggle menu"
          >
            <span className="block w-5 h-0.5 bg-[#4B3621]" />
            <span className="block w-5 h-0.5 bg-[#4B3621]" />
            <span className="block w-5 h-0.5 bg-[#4B3621]" />
          </button>

          {/* Page title from active nav */}
          <p className="text-sm font-bold text-[#4B3621] truncate">
            {navItems.find(n => n.screen === active)?.label ?? "Admin"}
          </p>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto shrink-0">
            <button className="flex h-8 w-8 items-center justify-center rounded-xl text-[#4B3621]/50 hover:text-[#4B3621] hover:bg-[#fdf8f0] transition" aria-label="Notifications">
              <i className="bi bi-bell text-sm" aria-hidden="true" />
            </button>
            <div className="flex items-center gap-2 rounded-xl bg-[#fdf8f0] border border-[#4B3621]/10 px-2.5 py-1.5">
              <img src={organizationLogo} alt="" className="h-5 w-5 object-contain shrink-0" />
              <span className="text-xs font-semibold text-[#4B3621] hidden sm:block">Admin</span>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-5">
          {children}
        </main>
      </div>

      {/* ── Logout confirm dialog ─────────────────────────────────────────── */}
      {showLogoutConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleLogoutCancel}
            aria-hidden="true"
          />

          {/* Panel */}
          <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                <i className="bi bi-box-arrow-right text-lg text-red-600" aria-hidden="true" />
              </span>
              <div>
                <h2 id="logout-dialog-title" className="text-base font-bold text-[#4B3621]">Sign out of Admin Panel?</h2>
                <p className="text-xs text-gray-500 mt-0.5">Make sure you have saved any unsaved changes.</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">
              You will be returned to the landing page and your admin session will be terminated.
              Any unsaved work will be lost.
            </p>

            <div className="flex gap-2 mt-1">
              <button
                onClick={handleLogoutCancel}
                className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition flex items-center justify-center gap-1.5"
              >
                <i className="bi bi-box-arrow-right" aria-hidden="true" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export { useState };
