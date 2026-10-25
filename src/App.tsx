import { useState } from "react";

// Public screens
import Landing from "./screens/Landing";
import { Login, GuestLogin, ProviderLogin, AdminLogin, Register, GuestRegister } from "./screens/Auth";

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

type Screen =
  // Public
  | "landing" | "public-services" | "about" | "how-it-works" | "contact" | "provider-partnership"
  | "login" | "login-guest" | "login-provider" | "login-admin"
  | "register" | "register-guest"
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

const SCREEN_LABELS: Record<Screen, string> = {
  "landing": "Landing Page",
  "public-services": "Public — Services",
  "about": "Public — About PASOA",
  "how-it-works": "Public — How It Works",
  "contact": "Public — Contact / Support",
  "provider-partnership": "Public — Provider Partnership",
  "login": "PUPTian Login",
  "login-guest": "Guest Login",
  "login-provider": "Provider Login",
  "login-admin": "Admin Login",
  "register": "PUPTian / Provider Register",
  "register-guest": "Guest Registration",
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
  {
    label: "Public",
    screens: ["landing", "public-services", "about", "how-it-works", "contact", "provider-partnership"],
  },
  {
    label: "Login Portals",
    screens: ["login", "login-guest", "login-provider", "login-admin"],
  },
  {
    label: "Registration",
    screens: ["register", "register-guest"],
  },
  {
    label: "PUPTian (Student)",
    screens: [
      "student-dashboard", "browse-services", "printing-service",
      "printing-confirmation", "order-tracking", "school-supplies",
      "resource-rental", "create-rental-post", "rental-post-status",
      "transaction-receipt",
    ],
  },
  {
    label: "Guest (Limited Access)",
    screens: ["guest-dashboard", "guest-post", "guest-my-posts"],
  },
  {
    label: "Service Provider",
    screens: ["provider-dashboard", "provider-profile"],
  },
  {
    label: "Administrator (Internal)",
    screens: [
      "admin-dashboard", "admin-providers", "admin-rental-approval",
      "admin-orders", "admin-website",
    ],
  },
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

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [open, setOpen] = useState(false);

  const navigate = (s: string) => {
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
      {/* Wireframe Screen Navigator */}
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
              <span>PASOA Wireframe — Screens</span>
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

      {renderScreen()}
    </div>
  );
}
