import { notFound } from "next/navigation";
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
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-8 sm:px-6 md:grid-cols-2">
      {/* eslint-disable-next-line @next/next/no-img-element -- inline SVG data URI, not eligible for next/image optimization */}
      <img
        src={product.image}
        alt={`${product.name} product photo`}
        width={600}
        height={600}
        className="aspect-square w-full rounded-2xl bg-neutral-800 object-cover"
      />

      <div className="flex flex-col gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
            {product.category}
          </p>
          <h1 className="mt-1 text-2xl font-bold text-neutral-50 sm:text-3xl">{product.name}</h1>
          <p className="mt-2 text-xl font-semibold text-emerald-300">
            {formatCurrency(product.price)}
          </p>
        </div>

        <p className="text-neutral-300">{product.description}</p>
        <p className="text-sm text-neutral-500">{product.stock} in stock</p>

        <div className="mt-2 rounded-xl border border-neutral-800 bg-neutral-900 p-5">
          <AddToCartForm product={product} />
        </div>
      </div>
    </div>
  );
}
