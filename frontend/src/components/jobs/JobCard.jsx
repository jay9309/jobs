import { BriefcaseBusiness, ChevronRight, MapPin, Tag } from "lucide-react";
import { Link } from "react-router-dom";

const logoStyle = {
  TCS: "text-[#ef3f38]",
  IBM: "text-[#2e75d9]",
  Infosys: "text-[#1477b9]"
};

export default function JobCard({ job }) {
  const companyName = job.company?.name || "Company";
  return (
    <div className="group rounded-[14px] border border-[#e6ecf5] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(18,42,84,.08)]">
      <div className="grid items-center gap-4 md:grid-cols-[150px_1fr_180px]">
        <div>
          <div className={`text-2xl font-extrabold tracking-tight ${logoStyle[companyName] || "text-[#3157f5]"}`}>{companyName}</div>
          <div className="mt-1 text-[11px] text-[#7887a2]">{job.company?.name || "Hiring company"}</div>
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[17px] font-extrabold text-[#102044]">{job.title}</h3>
            {job.badge && <span className="rounded-md bg-[#e2f8ef] px-2.5 py-1 text-[11px] font700 font-semibold text-[#18915e]">{job.badge}</span>}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-[#6e7e9c]">
            <span className="inline-flex items-center gap-1"><MapPin size={13}/>{job.location || "India"}</span>
            <span className="inline-flex items-center gap-1"><BriefcaseBusiness size={13}/>{job.experience || "Not specified"}</span>
            <span className="inline-flex items-center gap-1"><Tag size={13}/>{job.qualification || "Any graduate"}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {(job.skills || []).slice(0, 5).map(skill => <span key={skill} className="pill">{skill}</span>)}
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 md:flex-col md:items-end">
          <div className="text-xs font-bold text-[#263a60]">{job.salary || "Salary not disclosed"}</div>
          <Link to={`/jobs/${job._id}`} className="btn-primary !px-5 !py-2.5 text-xs">View Details <ChevronRight size={15}/></Link>
        </div>
      </div>
    </div>
  );
}
