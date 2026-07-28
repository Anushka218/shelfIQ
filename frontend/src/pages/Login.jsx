import { useState } from "react";
import { loginUser } from "../api/client";
import { useAuth } from "../components/AuthContext";

export default function Login({ onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(email, password);
      login(data.access_token, data.user);

      if (data.user.role === "admin") {
        onNavigate("dashboard");
      } else {
        onNavigate("shelf");
      }
    } catch (err) {
      setError("Login failed. Check your email and password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Panel */}
      <div className="hidden md:flex flex-col justify-between bg-ink p-10 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-pink/20"></div>
        <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-pink/10"></div>

        <div>
          <span className="text-3xl font-extrabold text-white">
            Shelf<span className="text-pink">IQ</span>
          </span>
        </div>

        <div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Welcome back to
            <br />
            your personal shelf.
          </h2>

          <p className="text-white/70">
            Log in to see recommendations ranked just for you, based on your
            region and preferences.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex items-center justify-center bg-[#F5F5F6] px-6 py-12">
        <div className="w-full max-w-sm relative">
          <button
            onClick={() => onNavigate("browse")}
            className="absolute -top-2 right-0 text-muted hover:text-ink text-xl leading-none"
            aria-label="Close"
          >
            ✕
          </button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-ink mb-2">Log in</h1>
            <p className="text-muted">Welcome back — enter your details</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                className="w-full rounded-md border border-border bg-white px-4 py-3 outline-none focus:border-pink focus:ring-1 focus:ring-pink"
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
                className="w-full rounded-md border border-border bg-white px-4 py-3 outline-none focus:border-pink focus:ring-1 focus:ring-pink"
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
              className="w-full rounded-md bg-pink py-3 font-bold text-white transition hover:opacity-90 disabled:opacity-50"
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
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}