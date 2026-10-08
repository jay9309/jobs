import { useEffect, useState } from "react";
import { BarChart3, BriefcaseBusiness, Building2, CreditCard, FileCheck2, IndianRupee, Users, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import StatCard from "../../components/admin/StatCard";
import { getAdminDashboard } from "../../services/adminService";
import { formatCurrency } from "../../utils/formatCurrency";

export default function AdminDashboard(){
  const [data,setData]=useState({stats:{},recentPayments:[],recentUsers:[],recentJobs:[]});
  const load=()=>getAdminDashboard().then(r=>setData(r.data)).catch(()=>{});
  useEffect(()=>{load()},[]);
  const s=data.stats||{};
  return <div>
    <div className="mb-7 flex flex-col justify-between gap-3 md:flex-row md:items-end"><div><div className="text-sm font-bold text-[#3157f5]">Owner control center</div><h1 className="mt-1 text-3xl font-extrabold text-[#102044]">Admin Dashboard</h1><p className="mt-1 text-sm text-[#7c8aa5]">Everything you need to run JobNest from one place.</p></div><Link to="/admin/jobs/add" className="btn-primary">+ Post New Job</Link></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total Users" value={s.totalUsers||0} icon={Users} />
      <StatCard label="Total Jobs" value={s.totalJobs||0} icon={BriefcaseBusiness} />
      <StatCard label="Active Subscriptions" value={s.activeSubscriptions||0} icon={CreditCard} />
      <StatCard label="Total Revenue" value={formatCurrency(s.totalRevenue||0)} icon={IndianRupee} />
    </div>
    <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Companies" value={s.totalCompanies||0} icon={Building2} />
      <StatCard label="Applications" value={s.totalApplications||0} icon={FileCheck2} />
      <StatCard label="This Month" value={formatCurrency(s.monthlyRevenue||0)} icon={BarChart3} />
      <StatCard label="Successful Payments" value={s.successfulPayments||0} icon={CreditCard} />
    </div>
    <div className="mt-6 grid gap-5 xl:grid-cols-[1.35fr_1fr]">
      <section className="soft-card p-6"><div className="flex items-center justify-between"><h2 className="font-extrabold text-[#102044]">Recent payments</h2><Link to="/admin/payments" className="text-sm font-bold text-[#3157f5]">View all <ArrowUpRight className="inline" size={15}/></Link></div><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead className="border-b text-xs uppercase text-[#8a97ad]"><tr><th className="py-3">User</th><th>Plan</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead><tbody>{data.recentPayments.map(p=><tr key={p._id} className="border-b last:border-0"><td className="py-3 font-bold">{p.user?.name||"—"}</td><td>{p.plan?.name||"—"}</td><td>{formatCurrency(p.amount)}</td><td><span className={`rounded-full px-2 py-1 text-xs font-bold ${p.status==='SUCCESS'?'bg-[#e9f8ef] text-[#1a8d5b]':'bg-[#fff4e6] text-[#b86b00]'}`}>{p.status}</span></td><td>{new Date(p.createdAt).toLocaleDateString('en-IN')}</td></tr>)}</tbody></table></div></section>
      <section className="soft-card p-6"><div className="flex items-center justify-between"><h2 className="font-extrabold text-[#102044]">Latest users</h2><Link to="/admin/users" className="text-sm font-bold text-[#3157f5]">Manage</Link></div><div className="mt-4 space-y-3">{data.recentUsers.map(u=><div key={u._id} className="flex items-center justify-between rounded-xl bg-[#f7f9fd] p-3"><div><div className="text-sm font-bold text-[#102044]">{u.name}</div><div className="text-xs text-[#8290a8]">{u.email}</div></div><span className={`text-xs font-bold ${u.isActive?'text-[#1a8d5b]':'text-red-500'}`}>{u.isActive?'Active':'Blocked'}</span></div>)}</div></section>
    </div>
    <section className="soft-card mt-5 p-6"><div className="flex items-center justify-between"><h2 className="font-extrabold text-[#102044]">Latest job openings</h2><Link to="/admin/jobs" className="text-sm font-bold text-[#3157f5]">Manage jobs</Link></div><div className="mt-4 grid gap-3 md:grid-cols-2">{data.recentJobs.map(j=><div key={j._id} className="rounded-xl border border-[#edf1f7] p-4"><div className="text-sm font-extrabold text-[#102044]">{j.title}</div><div className="mt-1 text-xs text-[#7c8aa5]">{j.company?.name||'Company'} · {j.location||'India'}</div><div className="mt-3"><span className={`rounded-full px-2 py-1 text-xs font-bold ${j.published?'bg-[#e9f8ef] text-[#1a8d5b]':'bg-[#fff4e6] text-[#b86b00]'}`}>{j.published?'Published':'Draft'}</span></div></div>)}</div></section>
  </div>
}
