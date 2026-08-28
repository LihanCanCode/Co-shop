"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/types";
import { useCartStore } from "@/store/cart-store";

export default function AddToCartForm({ product }: { product: Product }) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const logActivity = useCartStore((state) => state.logActivity);

  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);
    try {
      await addItem({ productId: product.id, size, color, qty });
      logActivity(`Added ${qty} × ${product.name} to cart`);
      setStatus("done");
      setMessage(`Added to cart. Size ${size}, ${color}.`);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to add to cart.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="pdp-size" className="mb-1 block text-sm font-medium text-neutral-300">
          Size
        </label>
        <select
          id="pdp-size"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400"
        >
          {product.sizes.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="pdp-color" className="mb-1 block text-sm font-medium text-neutral-300">
          Color
        </label>
        <select
          id="pdp-color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400"
        >
          {product.colors.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="pdp-qty" className="mb-1 block text-sm font-medium text-neutral-300">
          Quantity
        </label>
        <input
          id="pdp-qty"
          type="number"
          min={1}
          max={product.stock}
          value={qty}
          onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
          className="w-24 rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-lg bg-emerald-500 px-4 py-3 font-semibold text-neutral-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
      >
        {status === "loading" ? "Adding…" : "Add to cart"}
      </button>

      <p role="status" aria-live="polite" className={status === "error" ? "text-sm text-red-400" : "text-sm text-emerald-400"}>
        {message}
      </p>

      {status === "done" ? (
        <button
          type="button"
          onClick={() => router.push("/cart")}
          className="text-sm font-medium text-emerald-300 underline underline-offset-4 hover:text-emerald-200"
        >
          View cart →
        </button>
      ) : null}
    </form>
  );
}
