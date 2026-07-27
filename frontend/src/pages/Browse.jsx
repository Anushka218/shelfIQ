import { useEffect, useState } from "react";
import { filterProducts } from "../api/client";
import ShelfGrid from "../components/ShelfGrid";
import RegionSelector from "../components/RegionSelector";

const CATEGORIES = ["Kurta", "Saree", "Sneakers", "Shirt", "Jeans"];
const GENDERS = ["Women", "Men"];
const SEASONS = ["Summer", "Spring", "All Season"];

export default function Browse({ onNavigate, region, setRegion }) {
  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    season: "",
    min_price: "",
    max_price: "",
  });

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  function updateFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function applyFilters() {
    setLoading(true);
    filterProducts({ ...filters, region })
      .then((res) => setData(res))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    applyFilters();
  }, [region]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-ink">Browse Catalog</h1>
          <p className="text-sm text-muted">Explore products across regions</p>
        </div>
        <RegionSelector region={region} onChange={setRegion} />
      </div>

      <div className="bg-white border border-border rounded-md p-4 mb-6 flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-[10px] font-bold text-muted uppercase block mb-1">Category</label>
          <select
            value={filters.category}
            onChange={(e) => updateFilter("category", e.target.value)}
            className="border border-border rounded px-2 py-1.5 text-sm"
          >
            <option value="">All</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold text-muted uppercase block mb-1">Gender</label>
          <select
            value={filters.gender}
            onChange={(e) => updateFilter("gender", e.target.value)}
            className="border border-border rounded px-2 py-1.5 text-sm"
          >
            <option value="">All</option>
            {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold text-muted uppercase block mb-1">Season</label>
          <select
            value={filters.season}
            onChange={(e) => updateFilter("season", e.target.value)}
            className="border border-border rounded px-2 py-1.5 text-sm"
          >
            <option value="">All</option>
            {SEASONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold text-muted uppercase block mb-1">Min Price</label>
          <input
            type="number"
            value={filters.min_price}
            onChange={(e) => updateFilter("min_price", e.target.value)}
            className="border border-border rounded px-2 py-1.5 text-sm w-24"
            placeholder="₹0"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-muted uppercase block mb-1">Max Price</label>
          <input
            type="number"
            value={filters.max_price}
            onChange={(e) => updateFilter("max_price", e.target.value)}
            className="border border-border rounded px-2 py-1.5 text-sm w-24"
            placeholder="₹5000"
          />
        </div>
        <button
          onClick={applyFilters}
          className="bg-pink text-white text-sm font-bold px-4 py-2 rounded"
        >
          Apply
        </button>
      </div>

      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : data ? (
        <>
          <p className="text-xs text-muted mb-3">{data.count} products found</p>
          {data.results.length === 0 ? (
            <p className="text-muted text-sm">No products match these filters.</p>
          ) : (
            <ShelfGrid recommendations={data.results} onNavigate={onNavigate} />
          )}
        </>
      ) : null}
    </div>
  );
}