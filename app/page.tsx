import { Suspense } from "react";
import { filterProducts } from "@/lib/catalog";
import ProductGrid from "@/components/ProductGrid";
import Filters from "@/components/Filters";

// Hero section is server-renderable (no client hooks)
function HeroSection() {
  return (
    <div 
      className="relative mb-6 overflow-hidden rounded-3xl p-8 sm:p-12 shadow-2xl"
      style={{
        background: "linear-gradient(135deg, rgba(24,24,40,0.85) 0%, rgba(15,15,26,0.95) 100%)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid var(--cs-border-bright)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      {/* Decorative background glow inside the card */}
      <div 
        className="absolute -right-20 -top-20 h-64 w-64 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)",
          filter: "blur(40px)"
        }}
      />
      
      <div className="relative z-10">
        {/* Headline */}
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl font-heading">
          <span className="gradient-text">Shop smarter,</span>
          <br />
          <span className="text-cs-text-primary">together with your agent.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-cs-text-secondary">
          Every product here is reachable two ways — browse it yourself, or hand
          the job to your AI agent. It uses the same{" "}
          <span
            className="font-semibold"
            style={{ color: "#22d3ee" }}
          >
            WebMCP tools
          </span>{" "}
          this page exposes.
        </p>

        {/* Decorative rule */}
        <div
          className="mt-8 h-1 w-24 rounded-full"
          style={{
            background: "linear-gradient(90deg, #7c3aed, #a855f7, transparent)",
          }}
        />
      </div>
    </div>
  );
}

export default async function Home(props: PageProps<"/">) {
  const searchParams = await props.searchParams;

  const query =
    typeof searchParams.q === "string" ? searchParams.q : undefined;
  const category =
    typeof searchParams.category === "string"
      ? searchParams.category
      : undefined;
  const maxPrice =
    typeof searchParams.maxPrice === "string" && searchParams.maxPrice !== ""
      ? Number(searchParams.maxPrice)
      : undefined;

  const products = filterProducts({ query, category, maxPrice });

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6">
      <HeroSection />

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-cs-text-muted">
          Browse the catalog
        </p>
        <Suspense fallback={null}>
          <Filters />
        </Suspense>
      </div>

      <ProductGrid products={products} />
    </div>
  );
}
