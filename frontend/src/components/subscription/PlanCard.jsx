import { Check, Crown } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";
import PaymentButton from "./PaymentButton";

export default function PlanCard({ plan, featured = false }) {
  return (
    <div className={`relative rounded-2xl border bg-white p-7 shadow-sm ${featured ? "border-[#6577ff] shadow-[0_18px_45px_rgba(69,88,235,.13)]" : "border-[#e5ebf5]"}`}>
      {featured && <div className="absolute right-5 top-5 rounded-full bg-[#eef0ff] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#5364f7]">Most Popular</div>}
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef1ff] text-[#5364f7]"><Crown size={21}/></div>
      <h3 className="mt-5 text-xl font-extrabold text-[#102044]">{plan.name}</h3>
      <div className="mt-2 flex items-end gap-1"><span className="text-4xl font-extrabold text-[#102044]">{formatCurrency(plan.price)}</span><span className="pb-1 text-sm text-[#7a89a4]">/ plan</span></div>
      <p className="mt-2 text-sm text-[#7a89a4]">Access for {plan.validityDays} days</p>
      <div className="my-6 h-px bg-[#edf1f7]"/>
      <div className="space-y-3 text-sm text-[#52627f]">
        <div className="flex gap-2"><Check size={17} className="text-[#2ca66f]"/> Apply to {plan.applicationLimit > 0 ? `${plan.applicationLimit} jobs` : "unlimited jobs"}</div>
        <div className="flex gap-2"><Check size={17} className="text-[#2ca66f]"/> View detailed job information</div>
        <div className="flex gap-2"><Check size={17} className="text-[#2ca66f]"/> Track your applications</div>
      </div>
      <PaymentButton plan={plan}/>
    </div>
  );
}
