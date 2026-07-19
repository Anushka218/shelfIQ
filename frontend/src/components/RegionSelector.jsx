const REGIONS = ["Lucknow", "Coimbatore", "Jaipur", "Indore", "Patna", "Nagpur"];

export default function RegionSelector({ region, onChange }) {
  return (
    <div className="flex items-center gap-2 border border-border rounded px-3 py-2 bg-white">
      <span className="text-xs text-muted">📍</span>
      <select
        value={region}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm font-semibold text-ink bg-transparent focus:outline-none"
      >
        {REGIONS.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>
    </div>
  );
}