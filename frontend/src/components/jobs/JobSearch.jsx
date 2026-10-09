import { useState } from "react";
import { BriefcaseBusiness, Grid2X2, MapPin, Search, Sparkles, Tag } from "lucide-react";
import { getKeywordSuggestions, normalizeSearchText, rankJobSuggestions } from "../../utils/jobSearch";

export default function JobSearch({ value, setValue, jobs = [], onSearch, onSelect }) {
  const [isFocused, setIsFocused] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const suggestions = isFocused ? (() => {
    const matchingJobs = rankJobSuggestions(jobs, value);
    const jobTitles = new Set(matchingJobs.map(job => normalizeSearchText(job.title)));
    const keywords = getKeywordSuggestions(jobs, value)
      .filter(suggestion => !jobTitles.has(normalizeSearchText(suggestion.value)));
    return [
      ...keywords,
      ...matchingJobs.map(job => ({ type: "job", job }))
    ];
  })() : [];

  function selectSuggestion(suggestion) {
    if (suggestion.type === "keyword") {
      setValue(suggestion.value);
      setActiveSuggestion(-1);
      return;
    }
    setIsFocused(false);
    setActiveSuggestion(-1);
    onSelect?.(suggestion.job);
  }

  return (
    <form onSubmit={e => { e.preventDefault(); setIsFocused(false); onSearch?.(); }} className="hero-search">
      <div className="hero-search-field"><Search size={18}/><input
        value={value}
        onChange={e => { setValue(e.target.value); setActiveSuggestion(-1); }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => window.setTimeout(() => setIsFocused(false), 120)}
        onKeyDown={e => {
          if (e.key === "ArrowDown" && suggestions.length) {
            e.preventDefault();
            setActiveSuggestion(current => (current + 1) % suggestions.length);
          } else if (e.key === "ArrowUp" && suggestions.length) {
            e.preventDefault();
            setActiveSuggestion(current => current <= 0 ? suggestions.length - 1 : current - 1);
          } else if (e.key === "Enter" && activeSuggestion >= 0 && suggestions[activeSuggestion]) {
            e.preventDefault();
            selectSuggestion(suggestions[activeSuggestion]);
          } else if (e.key === "Escape") {
            setIsFocused(false);
          }
        }}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={suggestions.length > 0}
        aria-controls="hero-job-suggestions"
        aria-activedescendant={activeSuggestion >= 0 ? `job-suggestion-${activeSuggestion}` : undefined}
        placeholder="Search job title, skills, or company"
      /></div>
      <div className="hero-search-field"><MapPin size={18}/><input placeholder="Location" /></div>
      <div className="hero-search-field"><Grid2X2 size={17}/><select defaultValue=""><option value="" disabled>Job Type</option><option>Full Time</option><option>Internship</option><option>Part Time</option></select></div>
      <button className="btn-primary !min-h-[46px] !rounded-[9px] !px-8">Search</button>
      {suggestions.length > 0 && <div id="hero-job-suggestions" role="listbox" className="hero-suggestions">
        <div className="flex items-center gap-2 px-4 pb-2 pt-3 text-[11px] font-bold uppercase tracking-[.08em] text-[#8290aa]">
          <Sparkles size={14} className="text-[#5368ff]"/> Relevant job matches
        </div>
        {suggestions.map((suggestion, index) => <button
          key={suggestion.type === "keyword" ? `keyword-${suggestion.value}` : suggestion.job._id}
          id={`job-suggestion-${index}`}
          type="button"
          role="option"
          aria-selected={activeSuggestion === index}
          className={`hero-suggestion ${activeSuggestion === index ? "bg-[#f4f6ff]" : ""}`}
          onMouseEnter={() => setActiveSuggestion(index)}
          onMouseDown={e => e.preventDefault()}
          onClick={() => selectSuggestion(suggestion)}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#eef2ff] text-[#5368ff]">
            {suggestion.type === "keyword" ? <Tag size={17}/> : <BriefcaseBusiness size={17}/>}
          </span>
          <span className="min-w-0 flex-1 text-left">
            <span className="block truncate text-sm font-bold text-[#17284a]">
              {suggestion.type === "keyword" ? suggestion.value : suggestion.job.title}
            </span>
            <span className="mt-0.5 block truncate text-xs text-[#7887a2]">
              {suggestion.type === "keyword"
                ? "Search keyword"
                : `${suggestion.job.company?.name || "Company"} · ${[suggestion.job.location, suggestion.job.jobType].filter(Boolean).join(" · ")}`}
            </span>
          </span>
          <span className="hidden rounded-full bg-[#eef8f3] px-2.5 py-1 text-[10px] font-bold text-[#229462] sm:inline">
            {suggestion.type === "keyword" ? "Keyword" : "Best match"}
          </span>
        </button>)}
      </div>}
    </form>
  );
}
