import {
  StudentLayout, WireBtn,
} from "../../components/WireframeUI";

export default function OrderTracking({ navigate }: { navigate: (s: string) => void }) {
  return (
    <StudentLayout active="order-tracking" navigate={navigate}>
      <div className="mx-auto max-w-7xl space-y-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E3C565]">Student activity</p>
          <h1 className="mt-1 text-2xl font-bold text-[#4B3621]">Order tracking</h1>
          <p className="mt-1 text-sm text-[#4B3621]">Monitor orders as they move from submission to completion.</p>
        </div>
        <div className="rounded-2xl border border-dashed border-[#4B3621] bg-[#E3C565] p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E3C565]/30 text-2xl text-[#4B3621]">
            <i className="bi bi-receipt" aria-hidden="true" />
          </div>
          <h2 className="mt-5 text-lg font-bold text-[#4B3621]">No orders yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#4B3621]">Orders you submit from printing, school supplies, or resource rental will appear here with live status updates.</p>
          <WireBtn className="mt-5" onClick={() => navigate("browse-services")}>Browse services</WireBtn>
        </div>
      </div>
    </StudentLayout>
  );
}
