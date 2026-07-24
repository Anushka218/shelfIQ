import { SkeletonGrid } from "../components/SkeletonCard";
import InsightBanner from "../components/InsightBanner";
import { useEffect, useState } from "react";
import { getShelf, searchProducts } from "../api/client";
import ShelfGrid from "../components/ShelfGrid";
import { useAuth } from "../components/AuthContext";
import { useRegion } from "../context/RegionContext";

export default function Homepage() {
  const { user } = useAuth();
  const { region } = useRegion();

  const [shelf, setShelf] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const userId = user?.id || user?.user_id || null;

    setShelf(null);

    getShelf(region, userId).then(setShelf);
  }, [region, user]);

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
      {/* Search Bar */}
      <div className="bg-white border-b border-border px-6 py-3">
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center gap-2 bg-[#F5F5F6] rounded px-3 py-2"
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
            <button
              type="button"
              onClick={clearSearch}
              className="text-muted text-xs"
            >
              ✕
            </button>
          )}
        </form>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        {searchResults ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-ink">
                {searchResults.count} results for "{searchResults.query}"
              </h2>

              <button
                onClick={clearSearch}
                className="text-xs text-pink font-bold"
              >
                Clear search
              </button>
            </div>

            {searchResults.results.length === 0 ? (
              <p className="text-muted text-sm">
                No products found.
              </p>
            ) : (
              <ShelfGrid recommendations={searchResults.results} />
            )}
          </>
        ) : (
          <>
            <InsightBanner
              region={region}
              product={shelf?.recommendations?.[0]}
              userId={user?.id || user?.user_id || null}
            />

            {!shelf ? (
              <SkeletonGrid />
            ) : shelf.recommendations?.length === 0 ? (
              <p className="text-muted">
                No data available for this region yet.
              </p>
            ) : (
              <ShelfGrid recommendations={shelf.recommendations} />
            )}
          </>
        )}
      </div>
    </div>
  );
}