import InsightBanner from "../components/InsightBanner";
import { useEffect, useState } from "react";
import { getShelf } from "../api/client";
import ShelfGrid from "../components/ShelfGrid";
import RegionSelector from "../components/RegionSelector";
import PersonaSwitcher from "../components/PersonaSwitcher";

export default function Homepage() {
  const [region, setRegion] = useState("Lucknow");
  const [persona, setPersona] = useState({ label: "Default", user_id: null });
  const [shelf, setShelf] = useState(null);

  useEffect(() => {
    getShelf(region, persona.user_id).then(setShelf);
  }, [region, persona]);

  return (
    <div>
      <div className="bg-white border-b border-border px-6 py-3 flex items-center gap-4">
        <div className="flex-1 flex items-center gap-2 bg-[#F5F5F6] rounded px-3 py-2">
          <span className="text-muted text-sm">🔍</span>
          <span className="text-sm text-muted">Search categories, sellers, trends...</span>
        </div>
        <RegionSelector region={region} onChange={setRegion} />
      </div>

      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center gap-2 mb-5">
          <PersonaSwitcher persona={persona} onChange={setPersona} />
        </div>

        {shelf?.personalization_applied && (
          <p className="text-xs text-muted mb-3">alpha: {shelf.alpha} · regional vs personal blend</p>
        )}

        <InsightBanner region={region} category={shelf?.shelf_order?.[0]} />

        {shelf ? <ShelfGrid shelfOrder={shelf.shelf_order} /> : <p className="text-muted">Loading...</p>}</div>
    </div>
  );
}