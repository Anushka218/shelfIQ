import { useEffect, useState } from "react";
import { getSellerDashboard } from "../api/client";
import RegionSelector from "../components/RegionSelector";

export default function GapsAndSellers({ region, setRegion }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!region) return;

    setLoading(true);
    setError("");

    getSellerDashboard(region)
      .then((res) => setData(res))
      .catch((err) => {
        console.error(err);
        setError(err.response?.data?.detail || "Failed to load seller dashboard.");
      })
      .finally(() => setLoading(false));
  }, [region]);

  if (!region) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <p>No region selected.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold text-ink">Market Gaps & Opportunities</h1>
          <p className="text-xs text-muted">{data?.summary?.total_insights || 0} insights found</p>
        </div>
        <RegionSelector region={region} onChange={setRegion} />
      </div>

      {data?.attribute_opportunities?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase text-muted mb-3">Zero Supply Gaps</h2>
          <div className="grid grid-cols-2 gap-3">
            {data.attribute_opportunities.map((gap, index) => (
              <div key={index} className="bg-white border-2 border-pink rounded-md p-4">
                <div className="flex justify-between mb-2">
                  <span className="font-bold capitalize">{gap.value} {gap.category}</span>
                  <span className="bg-pink text-white text-xs px-2 py-1 rounded">
                    {gap.available_products}
                  </span>
                </div>
                <p className="text-xs text-muted">{gap.evidence}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {data?.catalog_gaps?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase text-muted mb-3">Catalog Gaps</h2>
          <div className="bg-white border rounded divide-y">
            {data.catalog_gaps.map((gap, index) => (
              <div key={index} className="flex justify-between p-3">
                <div>
                  <div className="font-bold capitalize">{gap.category}</div>
                  <div className="text-xs text-muted">{gap.evidence}</div>
                </div>
                <div className="font-bold text-pink">{gap.ratio}x</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data?.pricing_opportunities?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase text-muted mb-3">Pricing Opportunities</h2>
          <div className="bg-white border rounded divide-y">
            {data.pricing_opportunities.map((item, index) => (
              <div key={index} className="flex justify-between p-3">
                <div>
                  <div className="font-bold capitalize">{item.category}</div>
                  <div className="text-xs text-muted">{item.evidence}</div>
                </div>
                <div className="font-bold">{item.budget_match_rate}%</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data?.seller_recommendations?.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase text-muted mb-3">Recommended Sellers</h2>
          <div className="space-y-4">
            {data.seller_recommendations.map((group) => (
              <div key={group.category} className="bg-white border rounded-md p-4">
                <h3 className="font-bold capitalize mb-3">{group.category}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {group.recommended_sellers.slice(0, 4).map((seller) => (
                    <div key={seller.seller_id} className="border rounded-md p-3">
                      <div className="font-bold">{seller.business_name}</div>
                      <div className="text-xs text-muted">{seller.primary_region}</div>
                      <div className="text-xs mt-2">⭐ {seller.rating}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}