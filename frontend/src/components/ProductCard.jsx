import { useState } from "react";
import { isWishlisted, toggleWishlist } from "../api/wishlist";
import { useToast } from "../components/ToastContext";

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
  const common = { width: 44, height: 44, viewBox: "0 0 32 32" };

  if (category === "Sneakers") {
    return (
      <svg {...common}>
        <path fill={color} opacity="0.2" d="M3 21h26v5H3z" />
        <path
          fill={color}
          d="M3 21c0-3 2.5-5.5 6-6.5l9-3.5c2 2.5 5.5 3.5 9 3l1.5 6.5-2 1H3v-0.5z"
        />
        <circle cx="9" cy="21" r="1" fill="white" opacity="0.7" />
        <circle cx="14" cy="21" r="1" fill="white" opacity="0.7" />
      </svg>
    );
  }

  if (category === "Jeans") {
    return (
      <svg {...common}>
        <path fill={color} opacity="0.2" d="M9 2h14l1.5 26H18l-2-13-2 13H8.5L9 2z" />
        <path fill={color} d="M9 2h6v11l-1.5 15H8.5L9 2z" />
        <path fill={color} d="M17 2h6l0.5 26H19l-2-15V2z" />
        <rect x="10" y="6" width="4" height="1" fill="white" opacity="0.6" />
      </svg>
    );
  }

  if (category === "Saree") {
    return (
      <svg {...common}>
        <path fill={color} opacity="0.2" d="M11 2c3 8 3 18 0 28h6c-3-10-3-20 0-28z" />
        <path fill={color} d="M13 2c2 8 2 18 0 28h3c-2-10-2-20 0-28z" />
        <circle cx="14.5" cy="8" r="1.2" fill="white" opacity="0.7" />
        <circle cx="14.5" cy="16" r="1.2" fill="white" opacity="0.7" />
        <circle cx="14.5" cy="24" r="1.2" fill="white" opacity="0.7" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path fill={color} opacity="0.2" d="M11 2l5 3 5-3 4 4-3 4v19H10V10L7 6z" />
      <path fill={color} d="M11 2l5 3 5-3 3 3-4 4-4-2.5L12 9 8 5z" />
      <rect x="15" y="9" width="2" height="16" fill="white" opacity="0.5" />
    </svg>
  );
}

export default function ProductCard({ product, rank }) {
  const isTop = rank === 1;
  const iconColor = getColorFromTitle(product.title);
  const [wishlisted, setWishlisted] = useState(() => isWishlisted(product.product_id));
  const showToast = useToast();

  function handleWishlistClick(e) {
    e.stopPropagation();
    const newState = toggleWishlist(product.product_id);
    setWishlisted(newState);
    showToast(newState ? "Added to wishlist ♥" : "Removed from wishlist");
  }

  return (
    <div
      className={`group rounded-md overflow-hidden border bg-white transition-all hover:shadow-lg ${
        isTop ? "border-pink shadow-sm" : "border-border"
      }`}
    >
      <div
        className="relative h-32 flex items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(160deg, ${iconColor}22, ${iconColor}08)`,
        }}
      >
        <div className="transition-transform duration-200 group-hover:scale-110">
          <CategoryIcon category={product.category} color={iconColor} />
        </div>

        <button
          onClick={handleWishlistClick}
          className={`absolute top-2 right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm text-xs transition-transform active:scale-90 ${
            wishlisted ? "text-pink" : "text-muted"
          }`}
        >
          {wishlisted ? "♥" : "♡"}
        </button>

        {isTop && (
          <span className="absolute top-2 left-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-pink text-white">
            #1 TOP PICK
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-bold text-ink truncate">{product.title}</h3>
        <p className="text-xs text-muted mb-1">{product.brand}</p>
        <p className="text-sm font-semibold text-ink mb-2">₹{product.price}</p>
        <div className="flex flex-wrap gap-1 mb-2">
          {product.reasons?.slice(0, 2).map((r) => (
            <span key={r} className="text-[10px] bg-[#E7F8F3] text-green px-1.5 py-0.5 rounded">
              {r}
            </span>
          ))}
        </div>
        <button
          onClick={(e) => e.stopPropagation()}
          className="w-full bg-pink text-white text-xs font-bold py-2 rounded hover:opacity-90 transition-opacity"
        >
          BUY NOW
        </button>
      </div>
    </div>
  );
}