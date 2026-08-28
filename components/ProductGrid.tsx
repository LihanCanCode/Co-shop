import type { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import MotionGrid from "@/components/MotionGrid";

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p role="status" className="rounded-lg border border-neutral-800 bg-neutral-900 p-8 text-center text-neutral-400">
        No products match your search or filters. Try clearing a filter.
      </p>
    );
  }

  return (
    <MotionGrid>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </MotionGrid>
  );
}
