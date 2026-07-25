import { useState } from "react";
import { registerUser, loginUser } from "../api/client";
import { useAuth } from "../components/AuthContext";
import { useToast } from "../components/ToastContext";

const REGIONS = ["Lucknow", "Coimbatore", "Jaipur", "Indore", "Patna", "Nagpur"];
const GENDERS = ["Male", "Female"];

export default function Register({ onNavigate }) {
  const { login } = useAuth();
  const showToast = useToast();

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
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerUser(form);

      const data = await loginUser({
        email: form.email,
        password: form.password,
      });

      login(data.access_token, data.user);

      showToast(`Account created! Welcome, ${data.user.name} 🎉`);

      onNavigate(
        data.user.role === "admin" ? "dashboard" : "shelf"
      );
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        "Registration failed. Try again.";

      setError(message);
      showToast(message);
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
            Join thousands of
            <br />
            data-driven sellers.
          </h2>

          <p className="text-white/70">
            Get a shelf ranked just for you, based on your region and
            preferences.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex items-center justify-center bg-[#F5F5F6] px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-ink mb-2">
              Create your account
            </h1>

            <p className="text-muted">
              Start exploring your personalized shelf
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-muted mb-2">
                Name
              </label>

              <input
                required
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Your name"
                className="w-full rounded-md border border-border bg-white px-4 py-3 outline-none focus:border-pink focus:ring-1 focus:ring-pink"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-muted mb-2">
                Email
              </label>

              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
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
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-md border border-border bg-white px-4 py-3 outline-none focus:border-pink focus:ring-1 focus:ring-pink"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-muted mb-2">
                  Region
                </label>

                <select
                  value={form.region}
                  onChange={(e) => updateField("region", e.target.value)}
                  className="w-full rounded-md border border-border bg-white px-4 py-3 outline-none focus:border-pink focus:ring-1 focus:ring-pink"
                >
                  {REGIONS.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-muted mb-2">
                  Gender
                </label>

                <select
                  value={form.gender}
                  onChange={(e) => updateField("gender", e.target.value)}
                  className="w-full rounded-md border border-border bg-white px-4 py-3 outline-none focus:border-pink focus:ring-1 focus:ring-pink"
                >
                  {GENDERS.map((gender) => (
                    <option key={gender} value={gender}>
                      {gender}
                    </option>
                  ))}
                </select>
              </div>
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
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{" "}
            <button
              onClick={() => onNavigate("login")}
              className="font-bold text-pink hover:underline"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}