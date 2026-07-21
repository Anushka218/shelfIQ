const CATEGORY_STICKERS = {
  "Kurta": "👘",
  "Saree": "🥻",
  "Sneakers": "👟",
  "Shirt": "👔",
  "Jeans": "👖",
};

export default function ProductCard({ product, rank }) {
  const isTop = rank === 1;
  return (
    <div
      className={`rounded-md overflow-hidden border bg-white transition-shadow hover:shadow-md ${
        isTop ? "border-pink shadow-sm" : "border-border"
      }`}
    >
      <div className="relative h-28 bg-pink-tint flex items-center justify-center">
        <span className="text-xs text-muted px-2 text-center">{product.category}</span>
        <span className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-lg rotate-6 border-2 border-white">
          {CATEGORY_STICKERS[product.category] || "🛍️"}
        </span>
        <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm text-muted text-xs">
          ♡
        </span>
        <span
          className={`absolute top-2 left-2 text-[10px] font-bold px-1.5 py-0.5 rounded ${
            isTop ? "bg-pink text-white" : "bg-ink text-white"
          }`}
        >
          {isTop ? "#1 TOP PICK" : `#${rank}`}
        </span>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-bold text-ink truncate">{product.title}</h3>
        <p className="text-xs text-muted mb-1">{product.brand}</p>
        <p className="text-sm font-semibold text-ink mb-2">₹{product.price}</p>
        <div className="flex flex-wrap gap-1">
          {product.reasons?.slice(0, 2).map((r) => (
            <span key={r} className="text-[10px] bg-[#E7F8F3] text-green px-1.5 py-0.5 rounded">
              {r}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}