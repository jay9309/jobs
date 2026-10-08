import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Logo from "../../components/common/Logo";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminLogin = location.pathname === "/admin/login" || location.state?.from?.startsWith("/admin");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login({ email, password });

      if (isAdminLogin && data.user.role !== "ADMIN") {
        logout();
        setError("This account does not have owner/admin access.");
        setLoading(false);
        return;
      }

      navigate(location.state?.from || (data.user.role === "ADMIN" ? "/admin" : "/dashboard"));
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f8fd] px-4 py-8">
      <div className="mx-auto max-w-md">
        <div className="mb-8 flex justify-center"><Logo /></div>
        <div className="soft-card p-8">
          <div className="mb-5 rounded-xl bg-[#f3f6ff] p-4">
            <div className="text-xs font-extrabold uppercase tracking-wide text-[#3157f5]">
              {isAdminLogin ? "Owner / Admin Login" : "JobNest Account"}
            </div>
            <div className="mt-1 text-sm text-[#667691]">
              {isAdminLogin
                ? "Sign in with the owner account to access the management panel."
                : "Sign in to continue your job search."}
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-[#102044]">Welcome back</h1>
          {error && <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <input
              className="input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={loading}
              required
            />
            <input
              className="input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={loading}
              required
            />
            <button className="btn-primary w-full" disabled={loading}>
              {loading ? "Signing in..." : isAdminLogin ? "Sign in to Admin Panel" : "Login"}
            </button>
          </form>
          {!isAdminLogin && (
            <p className="mt-6 text-center text-sm text-[#7c8aa5]">
              New to JobNest? <Link className="font-bold text-[#3157f5]" to="/register">Create account</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
