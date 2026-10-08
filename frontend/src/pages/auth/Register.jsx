import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Logo from "../../components/common/Logo";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const nav = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(form);
      nav("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8fd] px-4 py-8">
      <div className="mx-auto max-w-md">
        <div className="mb-8 flex justify-center"><Logo /></div>
        <div className="soft-card p-8">
          <h1 className="text-2xl font-extrabold text-[#102044]">Create your account</h1>
          <p className="mt-1 text-sm text-[#7c8aa5]">Start discovering better opportunities.</p>
          {error && <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <input
              className="input"
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={loading}
              required
            />
            <input
              className="input"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={loading}
              required
            />
            <input
              className="input"
              type="password"
              minLength="6"
              placeholder="Password (6+ characters)"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              disabled={loading}
              required
            />
            <button className="btn-primary w-full" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-[#7c8aa5]">
            Already have an account? <Link className="font-bold text-[#3157f5]" to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
