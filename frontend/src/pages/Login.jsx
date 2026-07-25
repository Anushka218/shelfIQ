import { useState } from "react";
import { loginUser } from "../api/client";
import { useAuth } from "../components/AuthContext";
import { useToast } from "../components/ToastContext";

export default function Login({ onNavigate }) {
  const { login } = useAuth();
  const showToast = useToast();

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
      showToast(`Welcome back, ${data.user.name}! 👋`);

      onNavigate(
        data.user.role === "admin" ? "dashboard" : "shelf"
      );
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        "Login failed. Check your credentials.";

      setError(message);
      showToast(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Brand Panel */}
      <div className="hidden md:flex flex-col justify-between bg-ink p-10 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-pink/20"></div>
        <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-pink/10"></div>

        <div className="relative z-10">
          <span className="text-3xl font-extrabold text-white tracking-tight">
            Shelf<span className="text-pink">IQ</span>
          </span>
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Regional demand
            <br />
            intelligence,
            <br />
            ranked live.
          </h2>

          <p className="text-white/70 text-lg max-w-md">
            Personalized shelves, market gap detection, and seller matching —
            all in one place.
          </p>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="flex items-center justify-center bg-[#F5F5F6] px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-ink mb-2">
              Welcome back
            </h1>

            <p className="text-muted">
              Log in to your ShelfIQ account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase text-muted mb-2">
                Email
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-md border border-border bg-white px-4 py-3 focus:border-pink focus:ring-1 focus:ring-pink outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-muted mb-2">
                Password
              </label>

              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-md border border-border bg-white px-4 py-3 focus:border-pink focus:ring-1 focus:ring-pink outline-none transition"
              />
            </div>

            {error && (
              <div className="rounded-md border border-pink/20 bg-pink-tint px-3 py-2 text-sm text-pink">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-pink py-3 font-bold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Don't have an account?{" "}
            <button
              onClick={() => onNavigate("register")}
              className="font-bold text-pink hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}