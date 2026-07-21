const COLOR_MAP = {
  "Grey": "#8A8D93",
  "Navy": "#1F3A5F",
  "Pink": "#FF3F6C",
  "Green": "#4CAF50",
  "Blue": "#2E7DD9",
  "Dark Blue": "#16294A",
  "Yellow": "#E8B93B",
  "White": "#C9CBD1",
  "Red": "#D9483B",
  "Black": "#2A2A2A",
  "Purple": "#8A4FBF",
  "Orange": "#E8823B",
};

function getColorFromTitle(title) {
  const found = Object.keys(COLOR_MAP).find((color) => title.includes(color));
  return found ? COLOR_MAP[found] : "#FF3F6C";
}

function CategoryIcon({ category, color }) {
  if (category === "Sneakers") {
    return (
      <svg viewBox="0 0 24 24" width="26" height="26">
        <path fill={color} d="M2 18h20v3H2v-3zm0-3c0-2 2-4 5-5l7-3c2 3 5 4 8 3l1 4-2 1H2z" />
      </svg>
    );
  }
  if (category === "Jeans") {
    return (
      <svg viewBox="0 0 24 24" width="26" height="26">
        <path fill={color} d="M7 2h10l1 20h-4l-1-9-1 9H7L7 2z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="26" height="26">
      <path
        fill={color}
        d="M9 2l3 2 3-2 3 3-2 3v14H8V8L6 5l3-3z"
      />
    </svg>
  );
}

export default function ProductCard({ product, rank }) {
  const isTop = rank === 1;
  const iconColor = getColorFromTitle(product.title);

  return (
    <div
      className={`rounded-md overflow-hidden border bg-white transition-shadow hover:shadow-md ${
        isTop ? "border-pink shadow-sm" : "border-border"
      }`}
    >
      <div className="relative h-28 bg-pink-tint flex flex-col items-center justify-center">
        <span className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center rotate-6 border-2 border-white">
          <CategoryIcon category={product.category} color={iconColor} />
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