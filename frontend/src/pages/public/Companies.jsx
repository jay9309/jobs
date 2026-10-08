import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, ArrowUpRight } from "lucide-react";
import { getCompanies } from "../../services/adminService";

const demo = [{_id:"tcs",name:"TCS",description:"Technology and consulting opportunities."},{_id:"ibm",name:"IBM",description:"Engineering, cloud and software roles."},{_id:"infosys",name:"Infosys",description:"IT services and digital transformation roles."}];

export default function Companies() {
  const [companies,setCompanies]=useState(demo);
  useEffect(()=>{getCompanies().then(({data})=>{if(data.companies?.length)setCompanies(data.companies)}).catch(()=>{});},[]);
  return <section className="container-wide py-10"><div className="mb-8"><div className="text-sm font-bold text-[#3157f5]">Hiring companies</div><h1 className="mt-1 text-3xl font-extrabold text-[#102044]">Explore companies</h1><p className="mt-2 text-sm text-[#7c8aa5]">Discover jobs grouped by hiring organization.</p></div><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{companies.map(c=><Link key={c._id} to={`/companies/${c._id}`} className="soft-card group p-6 hover:-translate-y-1 transition"><div className="flex items-center justify-between"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eef2ff] text-[#3157f5]"><Building2/></div><ArrowUpRight className="text-[#a0abc0] group-hover:text-[#3157f5]"/></div><h3 className="mt-5 text-xl font-extrabold text-[#102044]">{c.name}</h3><p className="mt-2 text-sm leading-6 text-[#7a89a4]">{c.description || "Latest openings from this company on JobNest."}</p></Link>)}</div></section>
}
