import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="mt-16 bg-[#0b1833] text-white">
      <div className="container-wide grid gap-10 py-12 md:grid-cols-4">
        <div><Logo light /><p className="mt-5 max-w-xs text-sm leading-6 text-white/60">Discover relevant openings from top companies in one clean, trusted place.</p></div>
        <div><h4 className="font-bold">Explore</h4><div className="mt-4 space-y-3 text-sm text-white/60"><Link className="block hover:text-white" to="/jobs">Find Jobs</Link><Link className="block hover:text-white" to="/companies">Companies</Link><Link className="block hover:text-white" to="/subscriptions">Plans</Link></div></div>
        <div><h4 className="font-bold">Account</h4><div className="mt-4 space-y-3 text-sm text-white/60"><Link className="block hover:text-white" to="/login">Login</Link><Link className="block hover:text-white" to="/register">Create account</Link><Link className="block hover:text-white" to="/dashboard">My dashboard</Link></div></div>
        <div><h4 className="font-bold">JobOrbit</h4><p className="mt-4 text-sm leading-6 text-white/60">Real Jobs. Real Opportunities.</p></div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/45">© {new Date().getFullYear()} JobOrbit. All rights reserved.</div>
    </footer>
  );
}
