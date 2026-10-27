import { useState, useEffect } from "react";

// Auth
import { AuthProvider, useAuth } from "./context/AuthContext";

// Public screens
import Landing from "./screens/Landing";
import { Login, GuestLogin, ProviderLogin, AdminLogin, Register, GuestRegister } from "./screens/Auth";
import ProviderPending from "./screens/ProviderPending";

// Student screens
import StudentDashboard from "./screens/student/StudentDashboard";
import BrowseServices from "./screens/student/BrowseServices";
import PrintingService from "./screens/student/PrintingService";
import PrintingConfirmation from "./screens/student/PrintingConfirmation";
import OrderTracking from "./screens/student/OrderTracking";
import SchoolSupplies from "./screens/student/SchoolSupplies";
import ResourceRental from "./screens/student/ResourceRental";
import CreateRentalPost from "./screens/student/CreateRentalPost";
import RentalPostStatus from "./screens/student/RentalPostStatus";

// Guest screens
import GuestDashboard from "./screens/guest/GuestDashboard";
import { GuestPost, GuestMyPosts } from "./screens/guest/GuestPost";

// Provider screens
import ProviderDashboard from "./screens/provider/ProviderDashboard";
import ProviderProfile from "./screens/provider/ProviderProfile";

// Admin screens
import AdminDashboard from "./screens/admin/AdminDashboard";
import AdminProviders from "./screens/admin/AdminProviders";
import AdminRentalApproval from "./screens/admin/AdminRentalApproval";
import AdminOrders from "./screens/admin/AdminOrders";
import AdminWebsite from "./screens/admin/AdminWebsite";

// Shared
import TransactionReceipt from "./screens/TransactionReceipt";
import { About, Contact, HowItWorks, ProviderPartnership, PublicServices } from "./screens/PublicPages";

// ─── Screen type ──────────────────────────────────────────────────────────────

type Screen =
  // Public
  | "landing" | "public-services" | "about" | "how-it-works" | "contact" | "provider-partnership"
  | "login" | "login-guest" | "login-provider" | "login-admin"
  | "register" | "register-guest"
  // Pending
  | "provider-pending"
  // Student
  | "student-dashboard" | "browse-services" | "printing-service"
  | "printing-confirmation" | "order-tracking" | "school-supplies"
  | "resource-rental" | "create-rental-post" | "rental-post-status"
  // Guest
  | "guest-dashboard" | "guest-post" | "guest-my-posts"
  // Provider
  | "provider-dashboard" | "provider-profile"
  // Admin
  | "admin-dashboard" | "admin-providers" | "admin-rental-approval"
  | "admin-orders" | "admin-website"
  // Shared
  | "transaction-receipt";

// ─── Protected screen sets ────────────────────────────────────────────────────

const STUDENT_SCREENS = new Set<Screen>([
  "student-dashboard", "browse-services", "printing-service",
  "printing-confirmation", "order-tracking", "school-supplies",
  "resource-rental", "create-rental-post", "rental-post-status",
  "transaction-receipt",
]);

const GUEST_SCREENS = new Set<Screen>([
  "guest-dashboard", "guest-post", "guest-my-posts",
]);

const PROVIDER_SCREENS = new Set<Screen>([
  "provider-dashboard", "provider-profile",
]);

const ADMIN_SCREENS = new Set<Screen>([
  "admin-dashboard", "admin-providers", "admin-rental-approval",
  "admin-orders", "admin-website",
]);

// ─── Screen label map ─────────────────────────────────────────────────────────

const SCREEN_LABELS: Record<Screen, string> = {
  "landing": "Landing Page",
  "public-services": "Public — Services",
  "about": "Public — About University Organization",
  "how-it-works": "Public — How It Works",
  "contact": "Public — Contact / Support",
  "provider-partnership": "Public — Provider Partnership",
  "login": "PUPTian Login",
  "login-guest": "Guest Login",
  "login-provider": "Provider Login",
  "login-admin": "Admin Login",
  "register": "PUPTian / Provider Register",
  "register-guest": "Guest Registration",
  "provider-pending": "Provider — Pending Approval",
  "student-dashboard": "Student Dashboard",
  "browse-services": "Browse Services",
  "printing-service": "Printing Service",
  "printing-confirmation": "Order Confirmation",
  "order-tracking": "Order Tracking",
  "school-supplies": "School Supplies",
  "resource-rental": "Resource Rental Hub",
  "create-rental-post": "Create Rental Post",
  "rental-post-status": "My Rental Posts",
  "guest-dashboard": "Guest Dashboard",
  "guest-post": "Guest — Post a Request",
  "guest-my-posts": "Guest — My Posts",
  "provider-dashboard": "Provider Dashboard",
  "provider-profile": "Provider Profile",
  "admin-dashboard": "Admin Dashboard",
  "admin-providers": "Admin — Providers",
  "admin-rental-approval": "Admin — Rental Approval",
  "admin-orders": "Admin — Orders",
  "admin-website": "Admin — Website",
  "transaction-receipt": "Transaction Receipt",
};

const GROUPS: { label: string; screens: Screen[] }[] = [
  { label: "Public", screens: ["landing", "public-services", "about", "how-it-works", "contact", "provider-partnership"] },
  { label: "Login Portals", screens: ["login", "login-guest", "login-provider", "login-admin"] },
  { label: "Registration", screens: ["register", "register-guest"] },
  { label: "PUPTian (Student)", screens: ["student-dashboard", "browse-services", "printing-service", "printing-confirmation", "order-tracking", "school-supplies", "resource-rental", "create-rental-post", "rental-post-status", "transaction-receipt"] },
  { label: "Guest (Limited Access)", screens: ["guest-dashboard", "guest-post", "guest-my-posts"] },
  { label: "Service Provider", screens: ["provider-pending", "provider-dashboard", "provider-profile"] },
  { label: "Administrator (Internal)", screens: ["admin-dashboard", "admin-providers", "admin-rental-approval", "admin-orders", "admin-website"] },
];

const GROUP_COLORS: Record<string, string> = {
  "Public": "bg-gray-700",
  "Login Portals": "bg-gray-600",
  "Registration": "bg-gray-500",
  "PUPTian (Student)": "bg-gray-800",
  "Guest (Limited Access)": "bg-gray-500",
  "Service Provider": "bg-gray-600",
  "Administrator (Internal)": "bg-gray-900",
};

// ─── Route guard component ────────────────────────────────────────────────────

/**
 * RouteGuard sits between the navigator and the screen renderer.
 * It reads auth state and redirects unauthenticated or unauthorised access.
 *
 * Rules:
 *  - Protected screens require authentication.
 *  - Role-specific screens require the matching role.
 *  - Admin screens block non-admins completely (not just redirect to login).
 *  - Provider screens redirect pending providers to the pending screen.
 *  - Authenticated users landing on login/register screens are redirected
 *    to their correct dashboard.
 */
function RouteGuard({
  screen,
  setScreen,
  children,
}: {
  screen: Screen;
  setScreen: (s: Screen) => void;
  children: React.ReactNode;
}) {
  const {
    authStatus,
    isAdmin,
    isStudent,
    isProvider,
    isGuest,
    providerPending,
  } = useAuth();

  useEffect(() => {
    if (authStatus === "initialising" || authStatus === "loading_profile") return;

    const isAuthenticated = authStatus === "authenticated";

    // 1. Redirect authenticated users away from login/register pages
    const authPages: Screen[] = [
      "login", "login-guest", "login-provider", "login-admin",
      "register", "register-guest",
    ];
    if (isAuthenticated && authPages.includes(screen)) {
      if (isAdmin) { setScreen("admin-dashboard"); return; }
      if (isProvider) { setScreen(providerPending ? "provider-pending" : "provider-dashboard"); return; }
      if (isStudent) { setScreen("student-dashboard"); return; }
      if (isGuest) { setScreen("guest-dashboard"); return; }
    }

    // 2. Admin screens — must be admin
    if (ADMIN_SCREENS.has(screen)) {
      if (!isAuthenticated) { setScreen("login-admin"); return; }
      if (!isAdmin) { setScreen("landing"); return; }
    }

    // 3. Student screens
    if (STUDENT_SCREENS.has(screen)) {
      if (!isAuthenticated) { setScreen("login"); return; }
      if (!isStudent && !isAdmin) { setScreen("landing"); return; }
    }

    // 4. Guest screens
    if (GUEST_SCREENS.has(screen)) {
      if (!isAuthenticated) { setScreen("login-guest"); return; }
      if (!isGuest && !isAdmin) { setScreen("landing"); return; }
    }

    // 5. Provider screens — block pending providers
    if (PROVIDER_SCREENS.has(screen)) {
      if (!isAuthenticated) { setScreen("login-provider"); return; }
      if (!isProvider && !isAdmin) { setScreen("landing"); return; }
      if (isProvider && providerPending) { setScreen("provider-pending"); return; }
    }
  }, [screen, authStatus, isAdmin, isStudent, isProvider, isGuest, providerPending, setScreen]);

  // Show a loading overlay while auth is resolving
  if (authStatus === "initialising" || authStatus === "loading_profile") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#4B3621] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// ─── Main App ─────────────────────────────────────────────────────────────────

function AppInner() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [open, setOpen] = useState(false);
  const { logout, authStatus } = useAuth();

  const navigate = (s: string) => {
    // Handle logout navigation — call real logout
    if (s === "landing" && authStatus === "authenticated") {
      // The sidebar Logout items navigate to "landing"; intercept to log out properly
      void logout().then(() => {
        setScreen("landing");
        window.scrollTo(0, 0);
      });
      return;
    }
    setScreen(s as Screen);
    window.scrollTo(0, 0);
  };

  const renderScreen = () => {
    switch (screen) {
      // Public
      case "landing": return <Landing navigate={navigate} />;
      case "public-services": return <PublicServices navigate={navigate} />;
      case "about": return <About navigate={navigate} />;
      case "how-it-works": return <HowItWorks navigate={navigate} />;
      case "contact": return <Contact navigate={navigate} />;
      case "provider-partnership": return <ProviderPartnership navigate={navigate} />;
      case "login": return <Login navigate={navigate} />;
      case "login-guest": return <GuestLogin navigate={navigate} />;
      case "login-provider": return <ProviderLogin navigate={navigate} />;
      case "login-admin": return <AdminLogin navigate={navigate} />;
      case "register": return <Register navigate={navigate} />;
      case "register-guest": return <GuestRegister navigate={navigate} />;
      // Provider pending
      case "provider-pending": return <ProviderPending navigate={navigate} />;
      // Student
      case "student-dashboard": return <StudentDashboard navigate={navigate} />;
      case "browse-services": return <BrowseServices navigate={navigate} />;
      case "printing-service": return <PrintingService navigate={navigate} />;
      case "printing-confirmation": return <PrintingConfirmation navigate={navigate} />;
      case "order-tracking": return <OrderTracking navigate={navigate} />;
      case "school-supplies": return <SchoolSupplies navigate={navigate} />;
      case "resource-rental": return <ResourceRental navigate={navigate} />;
      case "create-rental-post": return <CreateRentalPost navigate={navigate} />;
      case "rental-post-status": return <RentalPostStatus navigate={navigate} />;
      // Guest
      case "guest-dashboard": return <GuestDashboard navigate={navigate} />;
      case "guest-post": return <GuestPost navigate={navigate} />;
      case "guest-my-posts": return <GuestMyPosts navigate={navigate} />;
      // Provider
      case "provider-dashboard": return <ProviderDashboard navigate={navigate} />;
      case "provider-profile": return <ProviderProfile navigate={navigate} />;
      // Admin
      case "admin-dashboard": return <AdminDashboard navigate={navigate} />;
      case "admin-providers": return <AdminProviders navigate={navigate} />;
      case "admin-rental-approval": return <AdminRentalApproval navigate={navigate} />;
      case "admin-orders": return <AdminOrders navigate={navigate} />;
      case "admin-website": return <AdminWebsite navigate={navigate} />;
      // Shared
      case "transaction-receipt": return <TransactionReceipt navigate={navigate} />;
      default: return <Landing navigate={navigate} />;
    }
  };

  return (
    <div className="relative">
      {/* Screen Navigator (dev tool — visible in all environments) */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
        <button
          onClick={() => setOpen((v) => !v)}
          className="bg-gray-900 text-white text-xs font-semibold px-3 py-2 shadow-lg hover:bg-gray-700 border border-gray-600 flex items-center gap-1.5"
        >
          ◉ {open ? "Close Navigator" : "Screen Navigator"}
        </button>

        {open && (
          <div className="bg-white border border-gray-400 shadow-xl w-72 max-h-[80vh] overflow-y-auto">
            <div className="bg-gray-900 text-white text-xs font-semibold px-3 py-2 flex items-center justify-between">
              <span>University Organization Wireframe — Screens</span>
              <span className="text-gray-400">{Object.keys(SCREEN_LABELS).length} screens</span>
            </div>
            <div className="flex flex-col">
              {GROUPS.map((group) => (
                <div key={group.label}>
                  <div className={`px-3 py-1.5 text-xs font-bold text-white border-b border-gray-600 ${GROUP_COLORS[group.label] ?? "bg-gray-600"}`}>
                    {group.label}
                  </div>
                  {group.screens.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setScreen(s); setOpen(false); window.scrollTo(0, 0); }}
                      className={`w-full text-left px-3 py-2 text-xs border-b border-gray-100 hover:bg-gray-50 transition-colors ${screen === s ? "bg-gray-200 font-semibold text-gray-900" : "text-gray-700"}`}
                    >
                      {screen === s && "▶ "}
                      {SCREEN_LABELS[s]}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <RouteGuard screen={screen} setScreen={setScreen}>
        {renderScreen()}
      </RouteGuard>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
