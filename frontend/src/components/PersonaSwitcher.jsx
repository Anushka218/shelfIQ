const PERSONAS = [
  { label: "Default", user_id: null },
  { label: "Premium Shopper", user_id: "demo_user_premium_lucknow" },
  { label: "Budget Shopper", user_id: "demo_user_budget_lucknow" },
];

export default function PersonaSwitcher({ persona, onChange }) {
  return (
    <div className="flex gap-2">
      {PERSONAS.map((p) => (
        <button
          key={p.label}
          onClick={() => onChange(p)}
          className={`px-3.5 py-1.5 rounded text-xs font-bold ${
            persona.label === p.label
              ? "bg-pink text-white"
              : "bg-white text-ink border border-border"
          }`}
        >
          {p.label.toUpperCase()}
        </button>
      ))}
    </div>
  );
}