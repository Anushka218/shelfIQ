import ThemeToggle from "./ThemeToggle";

export default function Navbar({ page, onNavigate }) {
  const tabs = [
    { key: "shelf", label: "SHELF" },
    { key: "dashboard", label: "DASHBOARD" },
    { key: "gaps", label: "GAPS & SELLERS" },
    { key: "browse", label: "BROWSE" },
  ];

  return (
    <div className="bg-ink px-6 py-3 flex items-center gap-6">
      <span className="text-lg font-extrabold text-white tracking-tight">
        Shelf<span className="text-pink">IQ</span>
      </span>
      <div className="flex gap-5 flex-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => onNavigate(t.key)}
            className={`text-xs font-bold pb-3 -mb-3 ${
              page === t.key
                ? "text-white border-b-2 border-pink"
                : "text-white/60"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <ThemeToggle />
      <div className="w-7 h-7 rounded-full bg-pink flex items-center justify-center text-[10px] text-white font-bold">
        JD
      </div>
    </div>
  );
}