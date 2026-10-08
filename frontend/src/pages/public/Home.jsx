import { ArrowRight, Check, Code2, HeartPulse, Megaphone, Palette, Search, Settings, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import JobSearch from "../../components/jobs/JobSearch";
import JobCard from "../../components/jobs/JobCard";
import { DEMO_JOBS, JOB_CATEGORIES } from "../../utils/constants";
import heroPerson from "../../assets/hero-person.jpg";
import { useJobs } from "../../hooks/useJobs";

const icons = { code: Code2, settings: Settings, chart: TrendingUp, palette: Palette, megaphone: Megaphone, heart: HeartPulse, shield: ShieldCheck };

export default function Home() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { jobs } = useJobs();
  const displayJobs = jobs.length ? jobs.slice(0,3) : DEMO_JOBS;

  return (
    <>
      <section className="relative overflow-hidden bg-[#061733]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_45%,rgba(55,103,255,.36),transparent_30%),linear-gradient(110deg,#06152f,#0d2451_48%,#151a49)]"/>
        <div className="container-wide relative grid min-h-[356px] items-center py-12 lg:grid-cols-[1.08fr_.92fr]">
          <div className="relative z-10 max-w-[650px]">
            <div className="mb-4 inline-flex rounded-full bg-[#1c477e] px-4 py-2 text-xs font-bold text-white">Your Next Career Move Starts Here 🚀</div>
            <h1 className="text-4xl font-extrabold leading-[1.04] tracking-tight text-white sm:text-5xl">Find Your Dream Job<br/>From <span className="gradient-text">Top Companies</span></h1>
            <p className="mt-5 max-w-[590px] text-sm leading-6 text-white/75 sm:text-[15px]">We fetch the latest job openings from company websites and bring them to you — all in one place. Get detailed job information and apply easily with our premium subscription.</p>
            <div className="mt-6 max-w-[1020px]"><JobSearch value={search} setValue={setSearch} onSearch={() => navigate(`/jobs?search=${encodeURIComponent(search)}`)}/></div>
          </div>
          <div className="pointer-events-none absolute right-0 top-0 h-full w-[48%]">
            <img
              src={heroPerson}
              className="absolute right-0 top-0 h-full w-full object-contain object-right"
              style={{
                maskImage:
                  "linear-gradient(90deg, transparent 0%, black 16%, black 92%, transparent 100%)"
              }}
              alt="Career"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-[#edf1f7] bg-white">
        <div className="container-wide grid grid-cols-2 gap-6 py-7 sm:grid-cols-4 lg:grid-cols-7">
          {JOB_CATEGORIES.map(c => { const Icon = icons[c.icon]; return (
            <button key={c.name} onClick={() => navigate(`/jobs?category=${encodeURIComponent(c.name)}`)} className="group text-center">
              <span className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl ${c.tone === "green" ? "bg-[#e8f8ef] text-[#17a05f]" : c.tone === "orange" ? "bg-[#fff1e7] text-[#ff7d25]" : c.tone === "purple" ? "bg-[#f1eaff] text-[#7950dc]" : c.tone === "red" ? "bg-[#ffedf0] text-[#ed5b69]" : c.tone === "cyan" ? "bg-[#e6fbfc] text-[#20a8ae]" : "bg-[#e9f1ff] text-[#3473dd]"} transition group-hover:scale-105`}><Icon size={23}/></span>
              <div className="mt-2 text-[12px] font-bold text-[#17284a]">{c.name}</div><div className="text-[10px] text-[#8290aa]">({c.count})</div>
            </button>
          )})}
          <button onClick={() => navigate("/jobs")} className="group text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#e9f1ff] text-[#3473dd] text-xl">•••</span><div className="mt-2 text-[12px] font-bold text-[#17284a]">View All</div><div className="text-[10px] text-[#8290aa]">(8+)</div></button>
        </div>
      </section>

      <section className="container-wide py-8">
        <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
          <div>
            <div className="mb-3 flex items-center justify-between"><h2 className="section-title text-xl">Featured Jobs</h2><Link to="/jobs" className="flex items-center gap-1 text-xs font-bold text-[#3157f5]">View All Jobs <ArrowRight size={14}/></Link></div>
            <div className="space-y-3">{displayJobs.map(job => <JobCard key={job._id} job={job}/>)}</div>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl bg-gradient-to-br from-[#f1f0ff] to-[#eaf1ff] p-6">
              <div className="flex items-start gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#5264f7] shadow-sm">♛</div><div><h3 className="font-extrabold text-[#102044]">Unlock Apply Access</h3><p className="mt-1 text-xs leading-5 text-[#71809b]">View full job details and apply to your dream jobs with a premium subscription.</p><Link to="/subscriptions" className="btn-primary mt-4 !px-5 !py-2.5 text-xs">View Plans →</Link></div></div>
              <div className="mt-5 space-y-2 text-xs text-[#52627f]"><div className="flex gap-2"><Check size={14} className="text-[#3157f5]"/> Access to all job applications</div><div className="flex gap-2"><Check size={14} className="text-[#3157f5]"/> Track your application history</div><div className="flex gap-2"><Check size={14} className="text-[#3157f5]"/> Get personalized recommendations</div></div>
            </div>
            <div className="soft-card p-6"><h3 className="font-extrabold text-[#102044]">Why Choose JobOrbit?</h3><div className="mt-4 space-y-3 text-xs text-[#52627f]"><div className="flex gap-2"><Check size={14} className="text-[#3157f5]"/> Latest jobs from top companies</div><div className="flex gap-2"><Check size={14} className="text-[#3157f5]"/> Detailed job information (no manual search)</div><div className="flex gap-2"><Check size={14} className="text-[#3157f5]"/> Easy and secure application process</div><div className="flex gap-2"><Check size={14} className="text-[#3157f5]"/> Affordable subscription plans</div></div></div>
          </div>
        </div>
      </section>
    </>
  );
}
