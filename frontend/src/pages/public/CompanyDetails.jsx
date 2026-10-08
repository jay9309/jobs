import { Link, useParams } from "react-router-dom";
import { useJobs } from "../../hooks/useJobs";
import JobCard from "../../components/jobs/JobCard";

export default function CompanyDetails() {
  const { id } = useParams();
  const { jobs } = useJobs();
  const companyName = id === "tcs" ? "TCS" : id === "ibm" ? "IBM" : id === "infosys" ? "Infosys" : id;
  const list = jobs.filter(j => j.company?.name?.toLowerCase() === companyName.toLowerCase());
  return <section className="container-wide py-10"><Link to="/companies" className="text-sm font-bold text-[#3157f5]">← All companies</Link><div className="soft-card mt-5 bg-gradient-to-r from-[#0b2147] to-[#3157f5] p-8 text-white"><div className="text-3xl font-extrabold">{companyName}</div><p className="mt-2 max-w-2xl text-sm text-white/70">Explore relevant openings and application information for this hiring organization.</p></div><h2 className="mt-8 text-xl font-extrabold text-[#102044]">Open positions</h2><div className="mt-4 space-y-3">{list.length ? list.map(j=><JobCard key={j._id} job={j}/>) : <div className="soft-card p-8 text-sm text-[#7c8aa5]">No live positions found yet.</div>}</div></section>
}
