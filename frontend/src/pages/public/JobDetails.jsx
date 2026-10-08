import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BriefcaseBusiness, CalendarDays, CheckCircle2, GraduationCap, MapPin, ShieldCheck, Tag } from "lucide-react";
import { getJob } from "../../services/jobService";
import { DEMO_JOBS } from "../../utils/constants";
import ApplyButton from "../../components/jobs/ApplyButton";

export default function JobDetails() {
  const { id } = useParams(); const navigate = useNavigate();
  const [job, setJob] = useState(null);
  useEffect(()=>{ getJob(id).then(({data})=>setJob(data.job)).catch(()=>setJob(DEMO_JOBS.find(j=>j._id===id) || DEMO_JOBS[0])); },[id]);

  if (!job) return <div className="container-wide py-20 text-center">Loading...</div>;
  return <section className="container-wide py-8">
    <button onClick={()=>navigate(-1)} className="mb-5 flex items-center gap-2 text-sm font-bold text-[#65748e]"><ArrowLeft size={16}/> Back to jobs</button>
    <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
      <div className="soft-card overflow-hidden">
        <div className="bg-gradient-to-r from-[#0b2147] to-[#263f91] p-7 text-white"><div className="text-lg font-extrabold opacity-90">{job.company?.name || "Company"}</div><h1 className="mt-2 text-3xl font-extrabold tracking-tight">{job.title}</h1><div className="mt-4 flex flex-wrap gap-4 text-sm text-white/75"><span className="flex items-center gap-1"><MapPin size={15}/>{job.location || "India"}</span><span className="flex items-center gap-1"><BriefcaseBusiness size={15}/>{job.experience || "Not specified"}</span><span className="flex items-center gap-1"><Tag size={15}/>{job.jobType || "Full Time"}</span></div></div>
        <div className="p-7">
          <div className="grid gap-3 sm:grid-cols-4">
            {[["Experience",job.experience,BriefcaseBusiness],["Education",job.qualification,GraduationCap],["Job Type",job.jobType,CalendarDays],["Location",job.location,MapPin]].map(([l,v,I])=><div key={l} className="rounded-xl bg-[#f7f9fd] p-4"><I size={17} className="text-[#3157f5]"/><div className="mt-2 text-[10px] font-bold uppercase tracking-wide text-[#8a97ad]">{l}</div><div className="mt-1 text-sm font-bold text-[#223354]">{v || "—"}</div></div>)}
          </div>
          <article className="mt-8"><h2 className="text-xl font-extrabold text-[#102044]">Job Description</h2><div className="prose prose-sm mt-3 max-w-none text-[#5e6d87]" dangerouslySetInnerHTML={{__html: job.description || "Detailed job description will appear here from the original job posting."}}/></article>
          <article className="mt-8"><h2 className="text-xl font-extrabold text-[#102044]">Skills Required</h2><div className="mt-3 flex flex-wrap gap-2">{(job.skills||[]).map(s=><span className="pill" key={s}>{s}</span>)}</div></article>
          <article className="mt-8"><h2 className="text-xl font-extrabold text-[#102044]">Requirements</h2><ul className="mt-3 space-y-2 text-sm text-[#5e6d87]">{(job.requirements?.length ? job.requirements : ["Review the complete requirements on the original company posting."]).map((x,i)=><li key={i} className="flex gap-2"><CheckCircle2 size={17} className="mt-0.5 text-[#3157f5]"/>{x}</li>)}</ul></article>
        </div>
      </div>
      <aside className="space-y-4">
        <div className="soft-card sticky top-24 p-6"><h3 className="text-lg font-extrabold text-[#102044]">Ready to Apply?</h3><p className="mt-2 text-sm leading-6 text-[#71809b]">Apply through the original company website after your JobNest subscription is active.</p><ApplyButton jobId={job._id}/><div className="mt-5 rounded-xl bg-[#f6f8fd] p-4 text-xs leading-5 text-[#667691]"><ShieldCheck size={17} className="mb-1 text-[#3157f5]"/> Your subscription controls application access; JobNest does not submit forms on the company website.</div></div>
      </aside>
    </div>
  </section>
}
