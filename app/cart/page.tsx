"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/format";
import SpotlightTarget from "@/components/SpotlightTarget";

const panelStyle = {
  background: "rgba(24, 24, 40, 0.70)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border: "1px solid var(--cs-border)",
};

export default function CartPage() {
  const router = useRouter();
  const cart = useCartStore((state) => state.cart);
  const subtotal = useCartStore((state) => state.subtotal);
  const total = useCartStore((state) => state.total);
  const removeItem = useCartStore((state) => state.removeItem);
  const applyDiscount = useCartStore((state) => state.applyDiscount);
  const checkout = useCartStore((state) => state.confirmCheckout);

  const [discountCode, setDiscountCode] = useState("");
  const [discountMessage, setDiscountMessage] = useState<string | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  async function handleRemove(itemId: string) {
    await removeItem(itemId).catch(() => undefined);
  }

  async function handleApplyDiscount(e: FormEvent) {
    e.preventDefault();
    setDiscountMessage(null);
    try {
      await applyDiscount(discountCode);
      setDiscountMessage(`Applied "${discountCode.toUpperCase()}".`);
    } catch (error) {
      setDiscountMessage(
        error instanceof Error ? error.message : "Unable to apply code."
      );
    }
  }

  async function handleCheckout() {
    setCheckingOut(true);
    setCheckoutError(null);
    try {
      const order = await checkout();
      router.push(`/orders/${order.id}`);
    } catch (error) {
      setCheckoutError(
        error instanceof Error ? error.message : "Unable to complete checkout."
      );
      setCheckingOut(false);
    }
  }

  /* ── Empty cart ── */
  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
        >
          <span className="text-6xl">🛍️</span>
          <h1 className="mt-4 text-2xl font-black text-cs-text-primary">
            Your cart is empty
          </h1>
          <p className="mt-2 text-cs-text-secondary">
            Browse the catalog yourself, or ask your agent to find and add
            something for you.
          </p>
          <Link
            href="/"
            className="btn-gradient mt-8 inline-block rounded-xl px-6 py-3 text-sm"
          >
            Continue shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  /* ── Cart items ── */
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mx-auto max-w-3xl px-4 py-8 sm:px-6"
    >
      <h1 className="text-2xl font-black text-cs-text-primary sm:text-3xl">
        Your cart
      </h1>

      {/* Items */}
      <ul className="mt-6 flex flex-col gap-3" aria-label="Cart items">
        <AnimatePresence initial={false}>
          {cart.items.map((item) => (
            <motion.li
              key={item.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -28, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
            >
              <SpotlightTarget id={`cart-item-${item.id}`}>
                <div
                  className="flex items-center gap-4 rounded-2xl p-4 transition-all duration-200"
                  style={panelStyle}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- inline SVG data URI */}
                  <img
                    src={item.image}
                    alt=""
                    width={72}
                    height={72}
                    className="h-18 w-18 shrink-0 rounded-xl object-cover"
                    style={{ background: "rgba(24,24,40,0.8)" }}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-cs-text-primary">
                      {item.name}
                    </p>
                    <p className="mt-0.5 text-sm text-cs-text-secondary">
                      Size {item.size} · {item.color} · Qty {item.qty}
                    </p>
                  </div>
                  <p
                    className="font-bold tabular-nums"
                    style={{ color: "#f59e0b" }}
                  >
                    {formatCurrency(item.price * item.qty)}
                  </p>
                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-cs-text-muted transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cs-accent/60"
                    style={{ border: "1px solid var(--cs-border)" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "rgba(239,68,68,0.4)";
                      (e.currentTarget as HTMLElement).style.color = "#f87171";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "var(--cs-border)";
                      (e.currentTarget as HTMLElement).style.color = "";
                    }}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    Remove
                  </motion.button>
                </div>
              </SpotlightTarget>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {/* Discount code */}
      <form
        onSubmit={handleApplyDiscount}
        className="mt-6 flex flex-wrap items-end gap-3"
      >
        <div className="flex-1">
          <label
            htmlFor="discount-code"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-cs-text-muted"
          >
            Discount code
          </label>
          <input
            id="discount-code"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            placeholder="WEBMCP10"
            className="w-full rounded-xl px-3 py-2.5 text-sm text-cs-text-primary placeholder:text-cs-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cs-accent/60 sm:w-52"
            style={{
              background: "rgba(8, 8, 15, 0.7)",
              border: "1px solid var(--cs-border)",
            }}
          />
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          type="submit"
          className="rounded-xl px-5 py-2.5 text-sm font-semibold text-cs-text-secondary transition-all duration-200 focus-visible:outline-none"
          style={{
            background: "rgba(139, 92, 246, 0.08)",
            border: "1px solid var(--cs-border)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor =
              "var(--cs-border-bright)";
            (e.currentTarget as HTMLElement).style.color = "#c4b5fd";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor =
              "var(--cs-border)";
            (e.currentTarget as HTMLElement).style.color = "";
          }}
        >
          Apply
        </motion.button>
        {discountMessage ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            role="status"
            aria-live="polite"
            className="text-sm text-cs-text-secondary"
          >
            {discountMessage}
          </motion.p>
        ) : null}
      </form>

      {/* Order summary */}
      <SpotlightTarget id="discount-summary">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="relative mt-8 overflow-hidden rounded-2xl p-6"
          style={{
            ...panelStyle,
            border: "1px solid var(--cs-border-bright)",
            boxShadow: "0 0 30px rgba(124,58,237,0.10)",
          }}
        >
          {/* Top gradient accent */}
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(139,92,246,0.7), rgba(168,85,247,0.5), transparent)",
            }}
          />

          <div className="flex justify-between text-cs-text-secondary">
            <span>Subtotal</span>
            <span className="tabular-nums">{formatCurrency(subtotal)}</span>
          </div>
          {cart.discountCode ? (
            <div
              className="mt-1.5 flex justify-between text-sm font-semibold"
              style={{ color: "#22d3ee" }}
            >
              <span>Discount ({cart.discountCode})</span>
              <span className="tabular-nums">
                -{formatCurrency(subtotal - total)}
              </span>
            </div>
          ) : null}
          <div
            className="mt-3 flex justify-between border-t pt-3 text-lg font-black text-cs-text-primary"
            style={{ borderColor: "var(--cs-border)" }}
          >
            <span>Total</span>
            <span
              className="tabular-nums"
              style={{ color: "#f59e0b" }}
            >
              {formatCurrency(total)}
            </span>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={handleCheckout}
            disabled={checkingOut}
            className="btn-gradient mt-5 w-full rounded-xl px-4 py-3.5 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cs-accent/60"
          >
            {checkingOut ? (
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
                Placing order…
              </span>
            ) : (
              "Checkout"
            )}
          </motion.button>

          {checkoutError ? (
            <p role="alert" className="mt-2 text-sm text-red-400">
              {checkoutError}
            </p>
          ) : null}
        </motion.div>
      </SpotlightTarget>
    </motion.div>
  );
}
