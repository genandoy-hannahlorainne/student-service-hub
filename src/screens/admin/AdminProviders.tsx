import { useState } from "react";
import {
  AdminLayout, WireBtn, WireCard, WireBadge, WireTable, WireSectionTitle, WireModal, WireTextarea,
} from "../../components/WireframeUI";

const PROVIDERS = [
  { name: "Speedy Print Shop", type: "Printing", location: "Western Bicutan, Taguig", collab: "Active", fee: "â‚±30", status: "Active", since: "Oct 2025" },
  { name: "Taguig Print Center", type: "Printing", location: "Central Bicutan, Taguig", collab: "Active", fee: "â‚±35", status: "Active", since: "Nov 2025" },
  { name: "Campus Copy Express", type: "Printing", location: "Western Bicutan, Taguig", collab: "Active", fee: "â‚±25", status: "Inactive", since: "Oct 2025" },
  { name: "University Organization Supplies", type: "School Supplies", location: "PUP Taguig Campus", collab: "Active", fee: "â‚±20", status: "Active", since: "Sep 2025" },
  { name: "Quick Copy Solutions", type: "Printing", location: "Ususan, Taguig", collab: "Pending", fee: "TBD", status: "Pending", since: "Dec 2025" },
  { name: "Campus Supplies Co.", type: "School Supplies", location: "Fort Bonifacio, Taguig", collab: "Pending", fee: "TBD", status: "Pending", since: "Dec 2025" },
];

const FLOW_STEPS = [
  "University Organization Contacts Provider",
  "Provider Agrees",
  "Terms Discussed",
  "Delivery Fee Agreed",
  "Provider Registered",
  "Provider Activated",
  "Provider Visible on Platform",
];

export default function AdminProviders({ navigate }: { navigate: (s: string) => void }) {
  const [rejectModal, setRejectModal] = useState<string | null>(null);
  const [viewFlow, setViewFlow] = useState(false);

  return (
    <AdminLayout active="admin-providers" navigate={navigate}>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Service Provider Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage collaborating printing shops and supply providers</p>
          </div>
          <div className="flex gap-2">
            <WireBtn variant="outline" onClick={() => setViewFlow(true)}>Approval Flow</WireBtn>
            <WireBtn>+ Add Provider</WireBtn>
          </div>
        </div>

        {/* Important note */}
        <div className="border border-dashed border-gray-500 p-3 bg-gray-50 text-sm text-gray-700">
          <strong>Platform Policy:</strong> Only officially approved providers appear on the student-facing platform. Delivery fees are set as part of the collaboration agreement and cannot be modified independently by providers.
        </div>

        {/* Table */}
        <WireCard className="p-0 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <WireSectionTitle>All Service Providers ({PROVIDERS.length})</WireSectionTitle>
          </div>
          <WireTable
            headers={["Provider Name", "Type", "Location", "Collaboration", "Agreed Fee", "Status", "Actions"]}
            rows={PROVIDERS.map((p) => [
              <div key={p.name}>
                <p className="font-medium text-gray-800">{p.name}</p>
                <p className="text-xs text-gray-400">Since {p.since}</p>
              </div>,
              p.type,
              p.location,
              <WireBadge key={p.collab} variant={p.collab === "Active" ? "success" : "pending"}>{p.collab}</WireBadge>,
              <span key={p.fee} className="font-mono text-sm">{p.fee}</span>,
              <WireBadge key={p.status} variant={p.status === "Active" ? "success" : p.status === "Inactive" ? "rejected" : "pending"}>{p.status}</WireBadge>,
              <div key="actions" className="flex gap-1 flex-wrap">
                <WireBtn size="sm" variant="ghost">View</WireBtn>
                {p.status === "Pending" ? (
                  <>
                    <WireBtn size="sm">Approve</WireBtn>
                    <WireBtn size="sm" variant="secondary" onClick={() => setRejectModal(p.name)}>Reject</WireBtn>
                  </>
                ) : (
                  <>
                    <WireBtn size="sm" variant="outline">Edit</WireBtn>
                    <WireBtn size="sm" variant="secondary">{p.status === "Active" ? "Deactivate" : "Activate"}</WireBtn>
                  </>
                )}
              </div>,
            ])}
          />
        </WireCard>

        {/* Approval Flow Modal */}
        {viewFlow && (
          <WireModal title="Provider Approval Flow" onClose={() => setViewFlow(false)}>
            <p className="text-xs text-gray-500 mb-4">Standard process for onboarding a new Service Provider to University Organization</p>
            <div className="flex flex-col gap-2">
              {FLOW_STEPS.map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-gray-700 text-white flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</div>
                  <span className="text-sm text-gray-700">{step}</span>
                </div>
              ))}
            </div>
            <WireBtn variant="secondary" className="w-full mt-4" onClick={() => setViewFlow(false)}>Close</WireBtn>
          </WireModal>
        )}

        {/* Reject Modal */}
        {rejectModal && (
          <WireModal title={`Reject Provider â€” ${rejectModal}`} onClose={() => setRejectModal(null)}>
            <p className="text-sm text-gray-700 mb-3">Please provide a reason for rejecting this provider application:</p>
            <WireTextarea placeholder="e.g. Incomplete requirements submitted. Missing business permit." rows={3} />
            <div className="flex gap-2 mt-4">
              <WireBtn variant="secondary" className="flex-1" onClick={() => setRejectModal(null)}>Cancel</WireBtn>
              <WireBtn className="flex-1" onClick={() => setRejectModal(null)}>Confirm Reject</WireBtn>
            </div>
          </WireModal>
        )}
      </div>
    </AdminLayout>
  );
}
