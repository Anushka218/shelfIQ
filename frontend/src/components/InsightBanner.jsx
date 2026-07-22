import { useEffect, useState } from "react";
import { getExplanation } from "../api/client";

export default function InsightBanner({ region, product, userId }) {
  const [reasons, setReasons] = useState(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!product) return;
    setLoading(true);
    setFailed(false);
    getExplanation(region, product.product_id, userId)
      .then((data) => {
        setReasons(data.reasons || []);
        setLoading(false);
      })
      .catch(() => {
        setFailed(true);
        setLoading(false);
      });
  }, [region, product, userId]);

  if (!product || failed) return null;

  return (
    <div className="bg-pink-tint border border-pink/20 rounded-md p-4 mb-6 flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-pink flex items-center justify-center flex-shrink-0">
        <span className="text-white text-sm">✨</span>
      </div>
      <div className="flex-1">
        <div className="text-[11px] font-bold text-muted uppercase tracking-wide mb-1">
          Why "{product.title}" is ranked #1
        </div>
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-pink border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-muted">Generating explanation...</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {reasons.map((r) => (
              <span key={r} className="text-xs bg-white border border-pink/30 text-ink px-2 py-1 rounded">
                {r}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}