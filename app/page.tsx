import { Suspense } from "react";
import { filterProducts } from "@/lib/catalog";
import ProductGrid from "@/components/ProductGrid";
import Filters from "@/components/Filters";

export default async function Home(props: PageProps<"/">) {
  const searchParams = await props.searchParams;

  const query = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const category = typeof searchParams.category === "string" ? searchParams.category : undefined;
  const maxPrice =
    typeof searchParams.maxPrice === "string" && searchParams.maxPrice !== ""
      ? Number(searchParams.maxPrice)
      : undefined;

  const products = filterProducts({ query, category, maxPrice });

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-50 sm:text-3xl">
          Shop with a person, or ask your agent to
        </h1>
        <p className="mt-1 max-w-2xl text-neutral-400">
          Every product here is reachable two ways: click around like any storefront, or hand the
          job to your AI agent — it uses the same structured WebMCP tools this page does.
        </p>
      </div>

      <Suspense fallback={null}>
        <Filters />
      </Suspense>

      <ProductGrid products={products} />
    </div>
  );
}
