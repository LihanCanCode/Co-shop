"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/types";
import { useCartStore } from "@/store/cart-store";

const selectClass =
  "w-full rounded-xl px-3 py-2.5 text-sm text-cs-text-primary transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cs-accent/60";

const selectStyle = {
  background: "rgba(8, 8, 15, 0.7)",
  border: "1px solid var(--cs-border)",
};

export default function AddToCartForm({ product }: { product: Product }) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const logActivity = useCartStore((state) => state.logActivity);

  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
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
      setMessage(
        error instanceof Error ? error.message : "Unable to add to cart."
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Size */}
      <div>
        <label
          htmlFor="pdp-size"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-cs-text-muted"
        >
          Size
        </label>
        <select
          id="pdp-size"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className={selectClass}
          style={selectStyle}
        >
          {product.sizes.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Color */}
      <div>
        <label
          htmlFor="pdp-color"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-cs-text-muted"
        >
          Colour
        </label>
        <select
          id="pdp-color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className={selectClass}
          style={selectStyle}
        >
          {product.colors.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Quantity */}
      <div>
        <label
          htmlFor="pdp-qty"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-cs-text-muted"
        >
          Quantity
        </label>
        <input
          id="pdp-qty"
          type="number"
          min={1}
          max={product.stock}
          value={qty}
          onChange={(e) =>
            setQty(Math.max(1, Number(e.target.value) || 1))
          }
          className="w-28 rounded-xl px-3 py-2.5 text-sm text-cs-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cs-accent/60"
          style={selectStyle}
        />
      </div>

      {/* CTA */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        type="submit"
        disabled={status === "loading"}
        className="btn-gradient relative rounded-xl px-4 py-3.5 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cs-accent/60 focus-visible:ring-offset-2"
      >
        {status === "loading" ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Adding…
          </span>
        ) : (
          "Add to cart"
        )}
      </motion.button>

      {/* Status message */}
      <AnimatePresence>
        {message && (
          <motion.p
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`text-sm font-medium ${
              status === "error" ? "text-red-400" : "text-cs-agent-light"
            }`}
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>

      {/* View cart link */}
      <AnimatePresence>
        {status === "done" && (
          <motion.button
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            type="button"
            onClick={() => router.push("/cart")}
            className="group flex items-center gap-1.5 text-sm font-semibold text-cs-accent-light hover:text-white transition-colors"
          >
            View cart
            <motion.span
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="inline-block"
            >
              →
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>
    </form>
  );
}
