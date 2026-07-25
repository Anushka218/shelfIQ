import { useState } from "react";
import { Shirt, Footprints } from "lucide-react";
import { isWishlisted, toggleWishlist } from "../api/wishlist";
import { useToast } from "../components/ToastContext";
import { useAuth } from "./AuthContext";
import { markPurchase } from "../api/client";

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
  const iconProps = { size: 36, color, strokeWidth: 1.6 };

  if (category === "Sneakers") {
    return <Footprints {...iconProps} />;
  }

  if (category === "Jeans") {
    return (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 2h10l1 5-1 15h-4l-1-9-1 9H6L5 7z" />
        <path d="M8 6h3" />
        <path d="M13 6h3" />
      </svg>
    );
  }

  if (category === "Saree") {
    return (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 5c3 1 5 3 6 6s1 6-1 9" />
        <path d="M6 4c3.5 1 6 3.3 7 6.5s0.5 6.8-2 9.5" />
        <path d="M17.5 17c1.5 0.5 2.8 1.2 3.5 2.3" strokeWidth="1.2" />
        <path d="M15.5 19c1.7 0.4 3.2 1.1 4 2.2" strokeWidth="1.2" />
        <path d="M8 8.5c1 0.3 2 0.8 2.7 1.6" strokeWidth="1" opacity="0.7" />
        <path d="M9 12c1 0.3 1.9 0.8 2.5 1.6" strokeWidth="1" opacity="0.7" />
      </svg>
    );
  }
  if (category === "Shirt") {
    return <Shirt {...iconProps} />;
  }

  // Kurta (default) — longer tunic with side slits, distinct from shirt
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3c1 0.8 2 1.2 3 1.2S14 3.8 15 3" />
      <path d="M9 3l-4 3.5 2 2.5 2-1.5" />
      <path d="M15 3l4 3.5-2 2.5-2-1.5" />
      <path d="M9 3v4l-1.5 1v11.5c1.5 1 6 1 7.5 0V8L14 7V3" />
      <path d="M7.5 16.5l2-1.5" strokeWidth="1.2" />
      <path d="M16.5 16.5l-2-1.5" strokeWidth="1.2" />
    </svg>
  );
}

export default function ProductCard({ product, rank, onNavigate }) {
  const isTop = rank === 1;
  const iconColor = getColorFromTitle(product.title);
  const [wishlisted, setWishlisted] = useState(() => isWishlisted(product.product_id));
  const showToast = useToast();
  const { isAuthenticated } = useAuth();

  function handleWishlistClick(e) {
    e.stopPropagation();
    if (!isAuthenticated) {
      onNavigate?.("login");
      return;
    }
    const newState = toggleWishlist(product.product_id);
    setWishlisted(newState);
    showToast(newState ? "Added to wishlist ♥" : "Removed from wishlist");
  }

  function handleBuyClick(e) {
    e.stopPropagation();
    if (!isAuthenticated) {
      onNavigate?.("login");
      return;
    }
    markPurchase(product.product_id)
      .then(() => showToast(`${product.title} purchased! 🎉`))
      .catch(() => showToast("Something went wrong. Try again."));
  }

  return (
    <div
      className={`group rounded-lg overflow-hidden border bg-white transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 ${
        isTop ? "border-pink shadow-md" : "border-border"
      }`}
    >
      <div
        className="relative h-36 flex items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(150deg, ${iconColor}30 0%, ${iconColor}0A 60%, #ffffff 100%)`,
        }}
      >
        <div
          className="absolute w-24 h-24 rounded-full blur-xl opacity-30"
          style={{ background: iconColor }}
        ></div>

        <div
          className="relative w-20 h-20 rounded-full bg-white flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
          style={{
            boxShadow: `0 8px 20px -4px ${iconColor}55, 0 0 0 3px ${iconColor}25`,
          }}
        >
          <CategoryIcon category={product.category} color={iconColor} />
        </div>

        <button
          onClick={handleWishlistClick}
          className={`absolute top-2 right-2 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-md text-sm transition-transform active:scale-90 hover:scale-110 ${
            wishlisted ? "text-pink" : "text-muted"
          }`}
        >
          {wishlisted ? "♥" : "♡"}
        </button>

        {isTop && (
          <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-1 rounded-full bg-pink text-white shadow-md flex items-center gap-1">
            ✨ TOP PICK
          </span>
        )}
      </div>
      <div className="p-3.5">
        <h3 className="text-sm font-bold text-ink truncate mb-0.5">{product.title}</h3>
        <p className="text-xs text-muted mb-2">{product.brand}</p>
        <div className="flex items-baseline gap-1.5 mb-2.5">
          <span className="text-base font-extrabold text-ink">₹{product.price}</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {product.reasons?.slice(0, 2).map((r) => (
            <span key={r} className="text-[10px] font-semibold bg-[#E7F8F3] text-green px-2 py-1 rounded-full">
              {r}
            </span>
          ))}
        </div>
        <button
          onClick={handleBuyClick}
          className="w-full bg-pink text-white text-xs font-bold py-2.5 rounded-md hover:opacity-90 active:scale-[0.98] transition-all shadow-sm"
        >
          BUY NOW
        </button>
      </div>
    </div>
  );
}