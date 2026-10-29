import { useState, useEffect } from "react";

// Auth
import { AuthProvider, useAuth } from "./context/AuthContext";

// Skeletons
import {
  LandingSkeleton, AuthSkeleton, AdminLoginSkeleton, AdminLandingSkeleton,
  StudentSkeleton, GuestSkeleton, ProviderSkeleton, AdminSkeleton,
  PageTransitionBar,
} from "./components/Skeletons";

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
import AdminLanding from "./screens/admin/AdminLanding";
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
  | "admin-landing" | "admin-dashboard" | "admin-providers" | "admin-rental-approval"
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

// Admin entry screens (landing + login) — unauthenticated access is allowed
const ADMIN_ENTRY_SCREENS = new Set<Screen>([
  "admin-landing", "login-admin",
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
  "admin-landing": "Admin — Portal Landing",
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
  { label: "Administrator (Internal)", screens: ["admin-landing", "admin-dashboard", "admin-providers", "admin-rental-approval", "admin-orders", "admin-website"] },
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

    // Invite-accepted / mid-flow signup: Identity account exists but no profile yet.
    // Send them to the registration screen to finish setting up their account.
    // Only redirect if not already there — avoids an infinite loop.
    if (authStatus === "needs_registration") {
      if (screen !== "register") setScreen("register");
      return;
    }

    const isAuthenticated = authStatus === "authenticated";

    // 1. Authenticated users must not land on public login or registration screens.
    //    navigate() handles this proactively, but RouteGuard is the safety net.
    //    Note: admin-landing and login-admin are NOT in this list — they are
    //    the admin world's own entry screens and are handled separately below.
    const publicAuthScreens: Screen[] = [
      "login", "login-guest", "login-provider",
      "register", "register-guest",
    ];
    if (isAuthenticated && publicAuthScreens.includes(screen)) {
      if (isAdmin) { setScreen("admin-dashboard"); return; }
      if (isProvider) { setScreen(providerPending ? "provider-pending" : "provider-dashboard"); return; }
      if (isStudent) { setScreen("student-dashboard"); return; }
      if (isGuest) { setScreen("guest-dashboard"); return; }
    }

    // 2. Admin entry screens (admin-landing, login-admin) — redirect
    //    authenticated admins straight to their dashboard, block non-admins.
    if (ADMIN_ENTRY_SCREENS.has(screen)) {
      if (isAuthenticated && isAdmin) { setScreen("admin-dashboard"); return; }
      // Non-admins who somehow land here get sent to the public landing
      if (isAuthenticated && !isAdmin) { setScreen("landing"); return; }
      // Unauthenticated: allow through (they are the intended audience)
    }

    // 3. Admin dashboard/pages — must be authenticated admin
    if (ADMIN_SCREENS.has(screen)) {
      if (!isAuthenticated) { setScreen("admin-landing"); return; }
      if (!isAdmin) { setScreen("landing"); return; }
    }

    // 4. Student screens
    if (STUDENT_SCREENS.has(screen)) {
      if (!isAuthenticated) { setScreen("login"); return; }
      if (!isStudent && !isAdmin) { setScreen("landing"); return; }
    }

    // 5. Guest screens
    if (GUEST_SCREENS.has(screen)) {
      if (!isAuthenticated) { setScreen("login-guest"); return; }
      if (!isGuest && !isAdmin) { setScreen("landing"); return; }
    }

    // 6. Provider screens — block pending providers
    if (PROVIDER_SCREENS.has(screen)) {
      if (!isAuthenticated) { setScreen("login-provider"); return; }
      if (!isProvider && !isAdmin) { setScreen("landing"); return; }
      if (isProvider && providerPending) { setScreen("provider-pending"); return; }
    }
  }, [screen, authStatus, isAdmin, isStudent, isProvider, isGuest, providerPending, setScreen]);

  // Show the matching skeleton while auth is resolving.
  if (authStatus === "initialising" || authStatus === "loading_profile") {
    return <SkeletonFor screen={screen} />;
  }

  // needs_registration: Identity session exists but no DB profile yet.
  // The useEffect above already called setScreen("register").
  // We must render children (not a skeleton) so the Register form actually mounts.
  // The register screen is a public screen — no auth required to view it.
  if (authStatus === "needs_registration") {
    return <>{children}</>;
  }

  return <>{children}</>;
}

// ─── Hash ↔ Screen maps ───────────────────────────────────────────────────────
// Every screen has a canonical URL hash. The public landing page uses "" (no hash).
// Admin pages all live under #/admin/... for clear namespace separation.

const SCREEN_TO_HASH: Record<Screen, string> = {
  // Public
  "landing":              "",
  "public-services":      "#/services",
  "about":                "#/about",
  "how-it-works":         "#/how-it-works",
  "contact":              "#/contact",
  "provider-partnership": "#/provider-partnership",
  // Auth
  "login":                "#/login",
  "login-guest":          "#/login/guest",
  "login-provider":       "#/login/provider",
  "login-admin":          "#/admin/login",
  "register":             "#/register",
  "register-guest":       "#/register/guest",
  // Student
  "provider-pending":     "#/provider/pending",
  "student-dashboard":    "#/student/dashboard",
  "browse-services":      "#/student/services",
  "printing-service":     "#/student/printing",
  "printing-confirmation":"#/student/printing/confirm",
  "order-tracking":       "#/student/orders",
  "school-supplies":      "#/student/supplies",
  "resource-rental":      "#/student/rentals",
  "create-rental-post":   "#/student/rentals/new",
  "rental-post-status":   "#/student/rentals/mine",
  "transaction-receipt":  "#/student/receipt",
  // Guest
  "guest-dashboard":      "#/guest/dashboard",
  "guest-post":           "#/guest/post",
  "guest-my-posts":       "#/guest/posts",
  // Provider
  "provider-dashboard":   "#/provider/dashboard",
  "provider-profile":     "#/provider/profile",
  // Admin
  "admin-landing":        "#/admin",
  "admin-dashboard":      "#/admin/dashboard",
  "admin-providers":      "#/admin/providers",
  "admin-rental-approval":"#/admin/rentals",
  "admin-orders":         "#/admin/orders",
  "admin-website":        "#/admin/website",
};

// Reverse map: hash string → Screen
const HASH_TO_SCREEN: Record<string, Screen> = Object.fromEntries(
  Object.entries(SCREEN_TO_HASH).map(([screen, hash]) => [hash, screen as Screen])
) as Record<string, Screen>;

/** Derive the initial screen from window.location.hash. */
function screenFromHash(): Screen {
  const hash = window.location.hash;
  // Exact match first
  if (hash in HASH_TO_SCREEN) return HASH_TO_SCREEN[hash];
  // No hash → landing
  if (!hash || hash === "#") return "landing";
  // Unknown hash → landing
  return "landing";
}

/** Pick the right skeleton for a screen that is about to render. */
function SkeletonFor({ screen }: { screen: Screen }) {
  // Admin world
  if (screen === "admin-landing") return <AdminLandingSkeleton />;
  if (screen === "login-admin")   return <AdminLoginSkeleton />;
  if (ADMIN_SCREENS.has(screen) || ADMIN_ENTRY_SCREENS.has(screen)) return <AdminSkeleton />;
  // Auth / login / register
  if (["login", "login-guest", "login-provider", "register", "register-guest"].includes(screen)) return <AuthSkeleton />;
  // Role portals
  if (STUDENT_SCREENS.has(screen) || screen === "provider-pending") return <StudentSkeleton />;
  if (GUEST_SCREENS.has(screen))    return <GuestSkeleton />;
  if (PROVIDER_SCREENS.has(screen)) return <ProviderSkeleton />;
  // Public / landing
  return <LandingSkeleton />;
}


function AppInner() {
  const [screen, setScreen] = useState<Screen>(screenFromHash);
  const [open, setOpen] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const [pendingScreen, setPendingScreen] = useState<Screen | null>(null);
  const { logout, authStatus, isAdmin, isStudent, isProvider, isGuest, providerPending } = useAuth();

  // ── Push URL hash whenever the active screen changes ─────────────────────
  useEffect(() => {
    const hash = SCREEN_TO_HASH[screen] ?? "";
    const current = window.location.hash;
    if (current !== hash) {
      window.history.pushState(null, "", hash === "" ? window.location.pathname : hash);
    }
  }, [screen]);

  // ── Sync screen from browser back / forward and direct URL entry ──────────
  useEffect(() => {
    const onPopState = () => {
      const target = screenFromHash();
      setScreen(target);
      window.scrollTo(0, 0);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // ── Skeleton flash on navigation ─────────────────────────────────────────
  useEffect(() => {
    if (pendingScreen === null) return;
    // Swap to real screen on next frame — skeleton was shown for one paint
    const id = requestAnimationFrame(() => {
      setScreen(pendingScreen);
      setNavigating(false);
      setPendingScreen(null);
      window.scrollTo(0, 0);
    });
    return () => cancelAnimationFrame(id);
  }, [pendingScreen]);

  /** Trigger a skeleton flash then navigate to the target screen. */
  const goTo = (target: Screen) => {
    setNavigating(true);
    setPendingScreen(target);
  };

  const loginAndRegisterScreens: Screen[] = [
    "login", "login-guest", "login-provider", "login-admin",
    "register", "register-guest",
  ];

  const navigate = (s: string) => {
    const target = s as Screen;

    // Admin logout → sign out then land on public landing
    if (target === "landing" && authStatus === "authenticated" && isAdmin) {
      void logout().then(() => goTo("landing"));
      return;
    }

    // Non-admin logout → sign out then land on public landing
    if (target === "landing" && authStatus === "authenticated") {
      void logout().then(() => goTo("landing"));
      return;
    }

    // Authenticated user hitting a login/register screen
    if (authStatus === "authenticated" && loginAndRegisterScreens.includes(target)) {
      const isOwnPortal =
        (isAdmin && target === "login-admin") ||
        (isStudent && target === "login") ||
        (isProvider && target === "login-provider") ||
        (isGuest && target === "login-guest");

      if (isOwnPortal) {
        if (isAdmin)    { goTo("admin-dashboard"); return; }
        if (isProvider) { goTo(providerPending ? "provider-pending" : "provider-dashboard"); return; }
        if (isStudent)  { goTo("student-dashboard"); return; }
        if (isGuest)    { goTo("guest-dashboard"); return; }
      }

      // Different role's portal or registration — sign out first
      void logout().then(() => goTo(target));
      return;
    }

    goTo(target);
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
      case "admin-landing": return <AdminLanding navigate={navigate} />;
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
      {/* Progress bar shown during page transitions */}
      {navigating && <PageTransitionBar />}

      {/* During navigation, show matching skeleton for the incoming screen */}
      {navigating && pendingScreen && <SkeletonFor screen={pendingScreen} />}

      {/* Screen content — hidden (not unmounted) during skeleton flash */}
      <div className={navigating ? "hidden" : undefined}>
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
                      onClick={() => { navigate(s); setOpen(false); }}
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
      </div>{/* end screen content wrapper */}
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
