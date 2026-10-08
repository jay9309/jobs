import { Link, Outlet, useLocation } from "react-router-dom";
import { BriefcaseBusiness, CreditCard, FileCheck2, LayoutDashboard, UserRound } from "lucide-react";
import Navbar from "../components/common/Navbar";

const items = [
  ["/dashboard", "Overview", LayoutDashboard],
  ["/dashboard/subscription", "Subscription", CreditCard],
  ["/dashboard/applications", "Applications", FileCheck2],
  ["/dashboard/profile", "Profile", UserRound]
];

export default function UserLayout() {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-[#f7faff]">
      <Navbar/>
      <div className="container-wide grid gap-6 py-8 lg:grid-cols-[230px_1fr]">
        <aside className="soft-card h-fit p-3">
          <div className="mb-3 flex items-center gap-2 border-b border-[#edf1f7] px-3 pb-4 font-extrabold"><BriefcaseBusiness size={18} className="text-[#3157f5]"/> My JobOrbit</div>
          {items.map(([to, label, Icon]) => <Link key={to} to={to} className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${location.pathname === to ? "bg-[#eef1ff] text-[#3157f5]" : "text-[#61708c] hover:bg-[#f5f7fb]"}`}><Icon size={17}/>{label}</Link>)}
        </aside>
        <main><Outlet/></main>
      </div>
    </div>
  );
}
