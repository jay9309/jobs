import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import JobCard from "../../components/jobs/JobCard";
import { useJobs } from "../../hooks/useJobs";
import { DEMO_JOBS } from "../../utils/constants";

export default function Jobs() {
  const [params, setParams] = useSearchParams();
  const initial = params.get("search") || "";
  const [search, setSearch] = useState(initial);
  const { jobs, loading } = useJobs(search ? { search } : {});
  const list = jobs.length ? jobs : DEMO_JOBS.filter(j => !search || `${j.title} ${j.company?.name}`.toLowerCase().includes(search.toLowerCase()));

  return <section className="container-wide py-10">
    <div className="mb-7"><div className="text-sm font-bold text-[#3157f5]">Explore opportunities</div><h1 className="mt-1 text-3xl font-extrabold text-[#102044]">Find your next job</h1><p className="mt-2 text-sm text-[#7c8aa5]">Search and compare openings from companies in one place.</p></div>
    <div className="soft-card mb-6 grid gap-3 p-3 md:grid-cols-[1fr_180px_auto]"><div className="flex items-center gap-3 px-3"><Search size={18} className="text-[#8190aa]"/><input className="w-full outline-none" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Job title, skill, company"/></div><select className="input !py-2.5"><option>All locations</option><option>Pune</option><option>Bangalore</option><option>Hyderabad</option></select><button onClick={()=>setParams(search ? {search}: {})} className="btn-primary"><SlidersHorizontal size={16}/> Search</button></div>
    <div className="mb-3 text-sm font-semibold text-[#61708c]">{loading ? "Loading jobs..." : `${list.length} jobs found`}</div>
    <div className="space-y-3">{list.map(job=><JobCard key={job._id} job={job}/>)}</div>
  </section>
}
