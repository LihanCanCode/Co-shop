import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductById } from "@/lib/catalog";
import { formatCurrency } from "@/lib/format";
import AddToCartForm from "@/components/AddToCartForm";

export default async function ProductPage(props: PageProps<"/product/[id]">) {
  const { id } = await props.params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <Link
          href="/"
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-cs-text-secondary transition-colors hover:text-cs-accent-light"
        >
          <span className="transition-transform group-hover:-translate-x-1 inline-block">←</span>
          Back to catalog
        </Link>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        {/* Product image */}
        <div
          className="relative overflow-hidden rounded-3xl"
          style={{
            background: "rgba(24,24,40,0.7)",
            border: "1px solid var(--cs-border)",
            boxShadow: "0 0 60px rgba(124,58,237,0.12), 0 20px 60px rgba(0,0,0,0.4)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- inline SVG data URI, not eligible for next/image optimization */}
          <img
            src={product.image}
            alt={`${product.name} product photo`}
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
            style={{ background: "rgba(24,24,40,0.8)" }}
          />
          {/* Bottom fade */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
            style={{
              background:
                "linear-gradient(to top, rgba(15,15,26,0.6) 0%, transparent 100%)",
            }}
          />
        </div>

        {/* Product info */}
        <div className="flex flex-col gap-5">
          <div>
            {/* Category pill */}
            <span className="pill-badge">{product.category}</span>

            <h1 className="mt-3 text-3xl font-black tracking-tight text-cs-text-primary sm:text-4xl">
              {product.name}
            </h1>

            <p
              className="mt-2 text-2xl font-bold tabular-nums"
              style={{ color: "#f59e0b" }}
            >
              {formatCurrency(product.price)}
            </p>
          </div>

          <p className="text-base leading-relaxed text-cs-text-secondary">
            {product.description}
          </p>

          <p className="flex items-center gap-2 text-sm font-medium text-cs-text-muted">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{
                background:
                  product.stock > 10
                    ? "#22c55e"
                    : product.stock > 0
                    ? "#f59e0b"
                    : "#ef4444",
              }}
            />
            {product.stock > 0
              ? `${product.stock} in stock`
              : "Out of stock"}
          </p>

          {/* Add to cart panel */}
          <div
            className="relative mt-2 overflow-hidden rounded-2xl p-6"
            style={{
              background: "rgba(24, 24, 40, 0.70)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              border: "1px solid var(--cs-border)",
            }}
          >
            {/* Top accent line */}
            <div
              className="absolute inset-x-0 top-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(139,92,246,0.6), transparent)",
              }}
            />
            <AddToCartForm product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
