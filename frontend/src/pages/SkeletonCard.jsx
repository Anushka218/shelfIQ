export function SkeletonCard() {
  return (
    <div className="rounded-md overflow-hidden border border-border bg-white animate-pulse">
      <div className="h-28 bg-[#F0F0F1]"></div>
      <div className="p-3 space-y-2">
        <div className="h-3 bg-[#F0F0F1] rounded w-3/4"></div>
        <div className="h-3 bg-[#F0F0F1] rounded w-1/2"></div>
        <div className="h-3 bg-[#F0F0F1] rounded w-1/3"></div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 10 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonStat() {
  return (
    <div className="bg-white border border-border rounded-md p-4 animate-pulse">
      <div className="h-3 bg-[#F0F0F1] rounded w-2/3 mb-3"></div>
      <div className="h-6 bg-[#F0F0F1] rounded w-1/3"></div>
    </div>
  );
}