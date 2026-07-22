import { useEffect, useState } from "react";
import { getSellerDashboard } from "../api/client";
import RegionSelector from "../components/RegionSelector";

export default function GapsAndSellers() {
  const [region, setRegion] = useState("Lucknow");
  const [data, setData] = useState(null);

  useEffect(() => {
    getSellerDashboard(region).then(setData);
  }, [region]);

  if (!data) return <p className="max-w-5xl mx-auto p-6 text-muted">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold text-ink">Market gaps & opportunities</h1>
          <p className="text-xs text-muted">{data.summary?.total_insights || 0} insights found</p>
        </div>
        <RegionSelector region={region} onChange={setRegion} />
      </div>

      {data.attribute_opportunities?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold text-muted uppercase tracking-wide mb-3">
            Zero-supply gaps
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {data.attribute_opportunities.map((g, i) => (
              <div key={i} className="bg-white border-2 border-pink rounded-md p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-ink capitalize">
                    {g.value} {g.category}
                  </span>
                  <span className="text-[10px] font-bold bg-pink text-white px-2 py-0.5 rounded">
                    {g.available_products} available
                  </span>
                </div>
                <p className="text-xs text-muted">{g.evidence}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.catalog_gaps?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold text-muted uppercase tracking-wide mb-3">
            Catalog gaps (demand vs. supply)
          </h2>
          <div className="bg-white border border-border rounded-md divide-y divide-border">
            {data.catalog_gaps.map((g, i) => (
              <div key={i} className="flex items-center justify-between p-3">
                <div>
                  <span className="text-sm font-bold text-ink capitalize">{g.category}</span>
                  <p className="text-xs text-muted">{g.evidence}</p>
                </div>
                <span className="text-sm font-bold text-pink flex-shrink-0 ml-4">
                  {g.ratio}x
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.pricing_opportunities?.length > 0 && (
        <div>
          <h2 className="text-xs font-bold text-muted uppercase tracking-wide mb-3">
            Pricing opportunities
          </h2>
          <div className="bg-white border border-border rounded-md divide-y divide-border">
            {data.pricing_opportunities.map((g, i) => (
              <div key={i} className="flex items-center justify-between p-3">
                <div>
                  <span className="text-sm font-bold text-ink capitalize">{g.category}</span>
                  <p className="text-xs text-muted">{g.evidence}</p>
                </div>
                <span className="text-sm font-bold text-ink flex-shrink-0 ml-4">
                  {g.budget_match_rate}% match
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}