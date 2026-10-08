import { BriefcaseBusiness } from "lucide-react";
import { Link } from "react-router-dom";

export default function Logo({ light = false }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${light ? "text-white" : "text-[#102044]"}`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eaf0ff] text-[#3157f5]">
        <BriefcaseBusiness size={21} />
      </span>
      <span>
        <span className="block text-[22px] font-extrabold leading-5 tracking-tight">
          Job<span className="text-[#3157f5]">Nest</span>
        </span>
        <span className={`text-[9px] font-medium ${light ? "text-white/70" : "text-[#7c8aa5]"}`}>Real Jobs. Real Opportunities.</span>
      </span>
    </Link>
  );
}
