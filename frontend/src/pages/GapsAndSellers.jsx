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
      <div className="flex items-center justify-between mb-8">
  <div>
    <h1 className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight">
      Market Gaps & Opportunities
    </h1>
    <p className="text-sm text-muted mt-1">
      {data?.summary?.total_insights || 0} insights found
    </p>
  </div>
  <RegionSelector region={region} onChange={setRegion} />
</div>

      {data?.attribute_opportunities?.length > 0 && (
        <div className="mb-6">
          {/* <h2 className="text-xs font-bold uppercase text-muted mb-3">Attribute Opportunities</h2> */}
          <div className="mb-4 pb-2 border-b-2 border-pink/20">
            <h2 className="text-sm font-extrabold text-ink uppercase tracking-wide">
              Attribute Opportunities
            </h2>
          </div>
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
          <div className="mb-4 pb-2 border-b-2 border-pink/20">
            <h2 className="text-sm font-extrabold text-ink uppercase tracking-wide">
               Catalog Gaps
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {data.catalog_gaps.map((gap, index) => (
              <div
                key={index}
                className="group relative border border-border rounded-lg p-4 transition-all hover:shadow-md hover:border-pink/40 overflow-hidden bg-white"
              >
                {index === 0 && (
                  <span className="absolute top-0 right-0 text-[9px] font-bold text-white bg-pink px-2 py-0.5 rounded-bl-lg">
                    HIGHEST GAP
                  </span>
                )}
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold text-white flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, #FF3F6C, #FF3F6C99)`,
                    }}
                  >
                    {gap.category?.[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-ink capitalize truncate">{gap.category}</div>
                    <div className="text-xs text-muted mt-0.5">{gap.evidence}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <span className="text-[10px] font-semibold text-muted uppercase">Demand/Supply</span>
                  <span className="text-sm font-bold text-pink">{gap.ratio}x</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data?.pricing_opportunities?.length > 0 && (
        <div className="mb-6">
          <div className="mb-4 pb-2 border-b-2 border-pink/20">
            <h2 className="text-sm font-extrabold text-ink uppercase tracking-wide">
               Pricing Opportunities
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {data.pricing_opportunities.map((item, index) => (
              <div
                key={index}
                className="group relative border border-border rounded-lg p-4 transition-all hover:shadow-md hover:border-pink/40 overflow-hidden bg-white"
              >
                {index === 0 && (
                  <span className="absolute top-0 right-0 text-[9px] font-bold text-white bg-pink px-2 py-0.5 rounded-bl-lg">
                    TOP OPPORTUNITY
                  </span>
                )}
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold text-white flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, #FF3F6C, #FF3F6C99)`,
                    }}
                  >
                    {item.category?.[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-ink capitalize truncate">{item.category}</div>
                    <div className="text-xs text-muted mt-0.5">{item.evidence}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <span className="text-[10px] font-semibold text-muted uppercase">Above budget</span>
                  <span className="text-sm font-bold text-ink">{item.budget_match_rate}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data?.seller_recommendations?.length > 0 && (
        <div>
          <div className="mb-4 pb-2 border-b-2 border-pink/20">
            <h2 className="text-sm font-extrabold text-ink uppercase tracking-wide">
              Recommended Sellers
            </h2>
          </div>
          <div className="space-y-5">
            {data.seller_recommendations.map((group) => (
              <div key={group.category} className="bg-white border border-border rounded-lg p-5">
                <span className="inline-block bg-pink/10 text-pink text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full mb-4">
                  {group.category}
                </span>
                <div className="grid grid-cols-2 gap-3">
                  {group.recommended_sellers.slice(0, 4).map((seller, i) => (
                    <div
                      key={seller.seller_id}
                      className="group relative border border-border rounded-lg p-4 transition-all hover:shadow-md hover:border-pink/40 overflow-hidden"
                    >
                      {i === 0 && (
                        <span className="absolute top-0 right-0 text-[9px] font-bold text-white bg-pink px-2 py-0.5 rounded-bl-lg">
                          TOP MATCH
                        </span>
                      )}
                      <div className="flex items-start gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold text-white flex-shrink-0"
                          style={{
                            background: `linear-gradient(135deg, #FF3F6C, #FF3F6C99)`,
                          }}
                        >
                          {seller.business_name?.[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-sm text-ink truncate">{seller.business_name}</div>
                          <div className="text-xs text-muted flex items-center gap-1 mt-0.5">
                            📍 {seller.primary_region}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                        <div className="flex items-center gap-1">
                          <span className="text-amber-400 text-sm">★</span>
                          <span className="text-sm font-bold text-ink">{seller.rating}</span>
                        </div>
                        {seller.verified && (
                          <span className="text-[10px] font-semibold text-green bg-[#E7F8F3] px-2 py-0.5 rounded-full flex items-center gap-1">
                            ✓ Verified
                          </span>
                        )}
                      </div>
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