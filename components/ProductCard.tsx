import Link from "next/link";
import type { Product } from "@/types";
import { formatCurrency } from "@/lib/format";
import SpotlightTarget from "@/components/SpotlightTarget";
import MotionProductCard from "@/components/MotionProductCard";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <MotionProductCard>
      <SpotlightTarget id={`product-card-${product.id}`}>
        <Link
          href={`/product/${product.id}`}
          className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
        >
          <div className="overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element -- inline SVG data URI, not eligible for next/image optimization */}
            <img
              src={product.image}
              alt={`${product.name} product photo`}
              width={300}
              height={300}
              className="aspect-square w-full bg-neutral-800 object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            />
          </div>
          <div className="space-y-1 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
              {product.category}
            </p>
            <h3 className="font-semibold text-neutral-50 group-hover:text-emerald-300">
              {product.name}
            </h3>
            <p className="text-sm font-medium text-neutral-200">{formatCurrency(product.price)}</p>
          </div>
        </Link>
      </SpotlightTarget>
    </MotionProductCard>
  );
}
