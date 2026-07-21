import { useEffect, useState } from "react";
import { getExplanation } from "../api/client";

export default function InsightBanner({ region, category }) {
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!category) return;
    setLoading(true);
    setFailed(false);
    getExplanation(region, category)
      .then((data) => {
        setExplanation(data.explanation);
        setLoading(false);
      })
      .catch(() => {
        setFailed(true);
        setLoading(false);
      });
  }, [region, category]);

  if (!category || failed) return null;

  return (
    <div className="bg-pink-tint border border-pink/20 rounded-md p-4 mb-6 flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-pink flex items-center justify-center flex-shrink-0">
        <span className="text-white text-sm">✨</span>
      </div>
      <div className="flex-1">
        <div className="text-[11px] font-bold text-muted uppercase tracking-wide mb-1">
          Why it's trending
        </div>
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-pink border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-muted">Generating explanation...</p>
          </div>
        ) : (
          <p className="text-sm text-ink">
            <strong>{category}:</strong> {explanation}
          </p>
        )}
      </div>
    </div>
  );
}