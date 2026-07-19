const CATEGORY_IMAGES = {
  "Kurtas": "/images/kurtas.jpg",
  "Ethnic Sets": "/images/ethnic-sets.jpg",
  "Jackets": "/images/jackets.jpg",
  "Sneakers": "/images/sneakers.jpg",
  "Denim": "/images/denim.jpg",
};

export default function CategoryCard({ category, rank }) {
  const isTop = rank === 1;
  const imageSrc = CATEGORY_IMAGES[category];

  return (
    <div
      className={`rounded-md overflow-hidden border bg-white transition-shadow hover:shadow-md ${
        isTop ? "border-pink shadow-sm" : "border-border"
      }`}
    >
      <div className="relative h-28 bg-pink-tint flex items-center justify-center">
        <img
          src={imageSrc}
          alt={category}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.style.display = "none"; }}
        />
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
        <h3 className="text-sm font-bold text-ink">{category}</h3>
      </div>
    </div>
  );
}