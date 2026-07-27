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
    <div className="min-h-[85vh] flex items-center justify-center bg-[#F5F5F6] px-4">
      <div className="w-full max-w-sm bg-white border border-border rounded-lg shadow-sm p-8">
        <button
          onClick={() => onNavigate("browse")}
          className="text-xs text-muted hover:text-ink flex items-center gap-1 mb-5"
        >
          ← Back
        </button>

        <h1 className="text-xl font-bold text-ink mb-6">Log In</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm outline-none bg-white focus:border-pink focus:ring-1 focus:ring-pink transition-colors"
            placeholder="Email"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm outline-none bg-white focus:border-pink focus:ring-1 focus:ring-pink transition-colors"
            placeholder="Password"
          />

          {error && (
            <p className="text-xs text-pink bg-pink-tint border border-pink/20 rounded-md px-3 py-2.5">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink text-white font-bold text-sm py-3 rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
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
  );
}