import { useState } from "react";
import { registerUser, loginUser } from "../api/client";
import { useAuth } from "../components/AuthContext";

const REGIONS = ["Lucknow", "Coimbatore", "Jaipur", "Indore", "Patna", "Nagpur"];
const GENDERS = ["Male", "Female"];

export default function Register({ onNavigate }) {
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    region: "Lucknow",
    gender: "Female",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerUser(form);
      const data = await loginUser({ email: form.email, password: form.password });
      login(data.access_token, data.user);
      onNavigate(data.user.role === "admin" ? "dashboard" : "shelf");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[85vh] grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-between bg-ink p-10 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-pink/20"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-pink/10 -mb-10 -ml-10"></div>
        <span className="text-2xl font-extrabold text-white tracking-tight relative">
          Shelf<span className="text-pink">IQ</span>
        </span>
        <div className="relative">
          <p className="text-white text-2xl font-bold leading-snug mb-3">
            Join thousands of<br />data-driven sellers.
          </p>
          <p className="text-white/60 text-sm">
            Get a shelf ranked just for you, based on your region and preferences.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-[#F5F5F6] px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-xl font-bold text-ink mb-1">Create your account</h1>
            <p className="text-sm text-muted">Start exploring your personalized shelf</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-muted uppercase block mb-1.5">Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm outline-none bg-white focus:border-pink focus:ring-1 focus:ring-pink transition-colors"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-muted uppercase block mb-1.5">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm outline-none bg-white focus:border-pink focus:ring-1 focus:ring-pink transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-muted uppercase block mb-1.5">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm outline-none bg-white focus:border-pink focus:ring-1 focus:ring-pink transition-colors"
                placeholder="••••••••"
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-[11px] font-bold text-muted uppercase block mb-1.5">Region</label>
                <select
                  value={form.region}
                  onChange={(e) => updateField("region", e.target.value)}
                  className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm outline-none bg-white focus:border-pink focus:ring-1 focus:ring-pink transition-colors"
                >
                  {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-[11px] font-bold text-muted uppercase block mb-1.5">Gender</label>
                <select
                  value={form.gender}
                  onChange={(e) => updateField("gender", e.target.value)}
                  className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm outline-none bg-white focus:border-pink focus:ring-1 focus:ring-pink transition-colors"
                >
                  {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>

            {error && (
              <p className="text-xs text-pink bg-pink-tint border border-pink/20 rounded-md px-3 py-2.5">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink text-white font-bold text-sm py-3 rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity shadow-sm"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-sm text-muted text-center mt-6">
            Already have an account?{" "}
            <button onClick={() => onNavigate("login")} className="text-pink font-bold">
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}