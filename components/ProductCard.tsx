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
          className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cs-accent"
        >
          {/* Image with bottom fade overlay */}
          <div className="relative overflow-hidden rounded-t-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element -- inline SVG data URI, not eligible for next/image optimization */}
            <img
              src={product.image}
              alt={`${product.name} product photo`}
              width={300}
              height={300}
              className="aspect-square w-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
              style={{ background: "rgba(24,24,40,0.8)" }}
            />
            {/* Bottom gradient fade */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
              style={{
                background:
                  "linear-gradient(to top, rgba(15,15,26,0.95) 0%, transparent 100%)",
              }}
            />
          </div>

          {/* Info */}
          <div className="space-y-1.5 px-4 pb-4 pt-2">
            {/* Category pill */}
            <span className="pill-badge">{product.category}</span>

            {/* Name */}
            <h3 className="mt-1.5 font-semibold text-cs-text-primary transition-colors duration-200 group-hover:text-cs-accent-light">
              {product.name}
            </h3>

            {/* Price */}
            <p
              className="text-sm font-bold tabular-nums"
              style={{ color: "#f59e0b" }}
            >
              {formatCurrency(product.price)}
            </p>
          </div>
        </Link>
      </SpotlightTarget>
    </MotionProductCard>
  );
}
