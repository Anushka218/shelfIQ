import { useState } from "react";
import { registerUser, loginUser } from "../api/client";
import { useAuth } from "../components/AuthContext";

export default function Register({ onNavigate }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [region, setRegion] = useState("Lucknow");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerUser({ name, email, password, region, gender });
      // auto-login right after successful registration
      const data = await loginUser(email, password);
      login(data.access_token, data.user);
      onNavigate("shelf");
    } catch (err) {
      setError("Registration failed. Check your details and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16 p-6 border rounded-lg">
      <h1 className="text-xl font-bold mb-4">Sign Up</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="Lucknow">Lucknow</option>
          <option value="Coimbatore">Coimbatore</option>
          <option value="Jaipur">Jaipur</option>
          <option value="Indore">Indore</option>
          <option value="Patna">Patna</option>
          <option value="Nagpur">Nagpur</option>
        </select>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="border rounded px-3 py-2"
          required
        >
          <option value="">Select gender</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="other">Other</option>
        </select>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white rounded px-3 py-2 mt-2"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}