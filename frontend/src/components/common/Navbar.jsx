import { Search } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "../../context/AuthContext";

const links = [
  ["/", "Home"],
  ["/jobs", "Jobs"],
  ["/companies", "Companies"],
  ["/subscriptions", "Subscriptions"],
  ["/about", "About"]
];

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-[#edf1f7] bg-white/95 backdrop-blur">
      <div className="container-wide flex h-[70px] items-center justify-between gap-6">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} className={({ isActive }) =>
              `relative py-6 text-[14px] font700 font-semibold ${isActive ? "text-[#102044]" : "text-[#15223e]"}`
            }>
              {label}
              <span className="absolute bottom-2 left-1/2 h-[2px] w-5 -translate-x-1/2 rounded bg-[#3157f5] opacity-0 group-[.active]:opacity-100" />
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/jobs" className="hidden rounded-full p-2 text-[#102044] hover:bg-[#f1f5fb] sm:block"><Search size={19} /></Link>
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="btn-secondary !px-5 !py-2.5 text-sm">Login</Link>
              <Link to="/register" className="btn-primary !px-5 !py-2.5 text-sm">Sign Up</Link>
            </>
          ) : (
            <>
              <Link to={user?.role === "ADMIN" ? "/admin" : "/dashboard"} className="btn-secondary !px-4 !py-2.5 text-sm">
                {user?.role === "ADMIN" ? "Admin" : "My Account"}
              </Link>
              <button onClick={() => { logout(); navigate("/"); }} className="hidden text-sm font-semibold text-[#66758f] lg:block">Logout</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
