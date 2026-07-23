import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => localStorage.getItem("shelfiq_theme") === "dark");

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("shelfiq_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("shelfiq_theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm"
      title="Toggle dark mode"
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}