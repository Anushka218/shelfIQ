import { useState } from "react";
import { loginUser } from "../api/client";
import { useAuth } from "../components/AuthContext";

export default function Login({ onNavigate }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      login(data.access_token, data.user);
      onNavigate(data.user.role === "admin" ? "dashboard" : "shelf");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed. Check your credentials.");
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
            Regional demand intelligence,<br />ranked live.
          </p>
          <p className="text-white/60 text-sm">
            Personalized shelves, market gap detection, and seller matching — all in one place.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-[#F5F5F6] px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-xl font-bold text-ink mb-1">Welcome back</h1>
            <p className="text-sm text-muted">Log in to your ShelfIQ account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-muted uppercase block mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm outline-none bg-white focus:border-pink focus:ring-1 focus:ring-pink transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-muted uppercase block mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm outline-none bg-white focus:border-pink focus:ring-1 focus:ring-pink transition-colors"
                placeholder="••••••••"
              />
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
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p className="text-sm text-muted text-center mt-6">
            Don't have an account?{" "}
            <button onClick={() => onNavigate("register")} className="text-pink font-bold">
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}