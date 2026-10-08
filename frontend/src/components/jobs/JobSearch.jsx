import { Grid2X2, MapPin, Search } from "lucide-react";

export default function JobSearch({ value, setValue, onSearch }) {
  return (
    <form onSubmit={e => { e.preventDefault(); onSearch?.(); }} className="hero-search">
      <div className="hero-search-field"><Search size={18}/><input value={value} onChange={e => setValue(e.target.value)} placeholder="Search job title, skills, or company" /></div>
      <div className="hero-search-field"><MapPin size={18}/><input placeholder="Location" /></div>
      <div className="hero-search-field"><Grid2X2 size={17}/><select defaultValue=""><option value="" disabled>Job Type</option><option>Full Time</option><option>Internship</option><option>Part Time</option></select></div>
      <button className="btn-primary !min-h-[46px] !rounded-[9px] !px-8">Search</button>
    </form>
  );
}
