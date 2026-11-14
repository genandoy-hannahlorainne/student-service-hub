/**
 * ProviderPending.tsx
 *
 * Shown to providers who have submitted their application but have not yet
 * been approved by an admin.
 */

import { useAuth } from "../context/AuthContext";
import { WireBtn } from "../components/WireframeUI";
import organizationLogo from "../assets/images/org_ssh_logo.png";

export default function ProviderPending({
  navigate,
}: {
  navigate: (s: string) => void;
}) {
  const { providerRecord, logout, profile } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("landing");
  };

  const statusColor =
    providerRecord?.status === "rejected"
      ? "text-[#4B3621] bg-[#E3C565] border-[#4B3621]"
      : "text-amber-700 bg-amber-50 border-amber-200";

  const statusText =
    providerRecord?.status === "rejected"
      ? "Application Rejected"
      : "Application Pending Review";

  return (
    <div className="min-h-screen bg-[#E3C565] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#E3C565] rounded-2xl border border-[#4B3621] shadow-lg p-8 flex flex-col items-center gap-6">
        {/* Logo */}
        <img src={organizationLogo} alt="University Organization" className="h-16 w-16 object-contain" />

        {/* Status badge */}
        <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${statusColor}`}>
          <i
            className={`bi ${providerRecord?.status === "rejected" ? "bi-x-circle" : "bi-hourglass-split"}`}
            aria-hidden="true"
          />
          {statusText}
        </div>

        {/* Main message */}
        <div className="text-center">
          <h1 className="text-xl font-bold text-[#4B3621] mb-2">
            {providerRecord?.status === "rejected"
              ? "Your application was not approved"
              : "Your application is under review"}
          </h1>

          {providerRecord?.status === "rejected" ? (
            <>
              <p className="text-sm text-[#4B3621] mb-3">
                Unfortunately, your provider application for{" "}
                <strong>{providerRecord.business_name}</strong> was not approved.
              </p>
              {providerRecord.rejection_reason && (
                <div className="rounded-xl border border-red-100 bg-[#E3C565] px-4 py-3 text-sm text-[#4B3621] text-left mb-3">
                  <strong>Reason:</strong> {providerRecord.rejection_reason}
                </div>
              )}
              <p className="text-sm text-[#4B3621]">
                Contact University Organization for more information or to appeal.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-[#4B3621] mb-3">
                Thank you, <strong>{profile?.display_name}</strong>. Your application for{" "}
                <strong>{providerRecord?.business_name}</strong> has been received.
              </p>
              <p className="text-sm text-[#4B3621]">
                An admin will review your application and notify you by email once a decision
                has been made. This typically takes 1–3 business days.
              </p>
            </>
          )}
        </div>

        {/* What happens next */}
        {providerRecord?.status !== "rejected" && (
          <div className="w-full rounded-xl border border-[#4B3621] bg-[#E3C565] p-4 text-sm text-[#4B3621]">
            <p className="font-semibold mb-2 text-[#4B3621]">What happens next?</p>
            <ol className="list-decimal list-inside flex flex-col gap-1 text-xs text-[#4B3621]">
              <li>Admin reviews your business information</li>
              <li>You receive an approval or feedback email</li>
              <li>Once approved, you can log in and start accepting orders</li>
            </ol>
          </div>
        )}

        {/* Actions */}
        <div className="w-full flex flex-col gap-2">
          <WireBtn variant="outline" className="w-full" onClick={() => navigate("contact")}>
            Contact University Organization
          </WireBtn>
          <WireBtn variant="ghost" className="w-full text-[#4B3621]" onClick={handleLogout}>
            Log out
          </WireBtn>
        </div>
      </div>
    </div>
  );
}
