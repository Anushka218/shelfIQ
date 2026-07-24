import { useEffect, useState } from "react";
import { getShelf, searchProducts } from "../api/client";
import ShelfGrid from "../components/ShelfGrid";
import InsightBanner from "../components/InsightBanner";
import RegionSelector from "../components/RegionSelector";
import { SkeletonGrid } from "../components/SkeletonCard";

export default function Homepage({ region, setRegion }) {
  const [shelf, setShelf] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    setShelf(null);
    getShelf(region).then(setShelf);
  }, [region]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (!searchInput.trim()) {
      setSearchResults(null);
      return;
    }
    setSearching(true);
    searchProducts(searchInput)
      .then(setSearchResults)
      .finally(() => setSearching(false));
  }

  function clearSearch() {
    setSearchInput("");
    setSearchResults(null);
  }

  return (
    <div>
      <div className="bg-white border-b border-border px-6 py-3 flex items-center gap-4">
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 flex items-center gap-2 bg-[#F5F5F6] rounded px-3 py-2"
        >
          <span className="text-muted text-sm">🔍</span>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search categories, sellers, trends..."
            className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
          />
          {searchInput && (
            <button type="button" onClick={clearSearch} className="text-muted text-xs">
              ✕
            </button>
          )}
          {searching && <span className="text-xs text-muted">Searching...</span>}
        </form>

        <RegionSelector region={region} onChange={setRegion} />
      </div>

      <div className="max-w-5xl mx-auto p-6">
        {searchResults ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-ink">
                {searchResults.count} results for "{searchResults.query}"
              </h2>
              <button onClick={clearSearch} className="text-xs font-bold text-pink">
                Clear Search
              </button>
            </div>

            {searchResults.results.length === 0 ? (
              <p className="text-muted text-sm">No products found.</p>
            ) : (
              <ShelfGrid recommendations={searchResults.results} />
            )}
          </>
        ) : (
          <>
            <InsightBanner region={region} product={shelf?.recommendations?.[0]} />

            {!shelf ? (
              <SkeletonGrid />
            ) : shelf.recommendations?.length === 0 ? (
              <p className="text-muted">No recommendations available for this region.</p>
            ) : (
              <ShelfGrid recommendations={shelf.recommendations} />
            )}
          </>
        )}
      </div>
    </div>
  );
}