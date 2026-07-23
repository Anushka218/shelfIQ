import InsightBanner from "../components/InsightBanner";
import { useEffect, useState } from "react";
import { getShelf, searchProducts } from "../api/client";
import ShelfGrid from "../components/ShelfGrid";
import RegionSelector from "../components/RegionSelector";
import PersonaSwitcher from "../components/PersonaSwitcher";

export default function Homepage({ region, setRegion }) {
  const [persona, setPersona] = useState({ label: "Default", user_id: null });
  const [shelf, setShelf] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    getShelf(region, persona.user_id).then(setShelf);
  }, [region, persona]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (!searchInput.trim()) {
      setSearchResults(null);
      return;
    }
    setSearching(true);
    searchProducts(searchInput).then((data) => {
      setSearchResults(data);
      setSearching(false);
    });
  }

  function clearSearch() {
    setSearchInput("");
    setSearchResults(null);
  }

  return (
    <div>
      <div className="bg-white border-b border-border px-6 py-3 flex items-center gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2 bg-[#F5F5F6] rounded px-3 py-2">
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
              <button onClick={clearSearch} className="text-xs text-pink font-bold">
                Clear search
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
            <div className="flex items-center gap-2 mb-5">
              <PersonaSwitcher persona={persona} onChange={setPersona} />
            </div>

            <InsightBanner region={region} product={shelf?.recommendations?.[0]} userId={persona.user_id} />

            {!shelf ? (
              <p className="text-muted">Loading...</p>
            ) : !shelf.recommendations || shelf.recommendations.length === 0 ? (
              <p className="text-muted">No data available for this region yet.</p>
            ) : (
              <ShelfGrid recommendations={shelf.recommendations} />
            )}
          </>
        )}
      </div>
    </div>
  );
}