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
    <div className="min-h-[85vh] flex items-center justify-center bg-[#F5F5F6] px-4 py-10">
      <div className="w-full max-w-sm bg-white border border-border rounded-lg shadow-sm p-8">
        <button
          onClick={() => onNavigate("browse")}
          className="text-xs text-muted hover:text-ink flex items-center gap-1 mb-5"
        >
          ← Back
        </button>

        <h1 className="text-xl font-bold text-ink mb-6">Sign Up</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm outline-none bg-white focus:border-pink focus:ring-1 focus:ring-pink transition-colors"
            placeholder="Name"
          />
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm outline-none bg-white focus:border-pink focus:ring-1 focus:ring-pink transition-colors"
            placeholder="Email"
          />
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
            className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm outline-none bg-white focus:border-pink focus:ring-1 focus:ring-pink transition-colors"
            placeholder="Password"
          />
          <div className="flex gap-3">
            <select
              value={form.region}
              onChange={(e) => updateField("region", e.target.value)}
              className="flex-1 border border-border rounded-md px-3.5 py-2.5 text-sm outline-none bg-white focus:border-pink focus:ring-1 focus:ring-pink transition-colors"
            >
              {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <select
              value={form.gender}
              onChange={(e) => updateField("gender", e.target.value)}
              className="flex-1 border border-border rounded-md px-3.5 py-2.5 text-sm outline-none bg-white focus:border-pink focus:ring-1 focus:ring-pink transition-colors"
            >
              {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

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
  );
}