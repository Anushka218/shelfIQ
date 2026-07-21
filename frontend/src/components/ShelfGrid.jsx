import CategoryCard from "./CategoryCard";

export default function ShelfGrid({ shelfOrder }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {shelfOrder.map((category, i) => (
        <CategoryCard key={category} category={category} rank={i + 1} />
      ))}
    </div>
  );import ProductCard from "./ProductCard";

export default function ShelfGrid({ recommendations }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {recommendations.map((product, i) => (
        <ProductCard key={product.product_id} product={product} rank={i + 1} />
      ))}
    </div>
  );
}
}