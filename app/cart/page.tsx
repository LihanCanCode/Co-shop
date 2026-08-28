"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/format";
import SpotlightTarget from "@/components/SpotlightTarget";

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
      setDiscountMessage(error instanceof Error ? error.message : "Unable to apply code.");
    }
  }

  async function handleCheckout() {
    setCheckingOut(true);
    setCheckoutError(null);
    try {
      const order = await checkout();
      router.push(`/orders/${order.id}`);
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Unable to complete checkout.");
      setCheckingOut(false);
    }
  }

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-neutral-50">Your cart is empty</h1>
        <p className="mt-2 text-neutral-400">
          Browse the catalog yourself, or ask your agent to find and add something for you.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-emerald-500 px-5 py-2.5 font-semibold text-neutral-950 hover:bg-emerald-400"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-neutral-50">Your cart</h1>

      <ul className="mt-6 flex flex-col gap-4" aria-label="Cart items">
        <AnimatePresence initial={false}>
          {cart.items.map((item) => (
            <motion.li
              key={item.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -24, transition: { duration: 0.18 } }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
            >
              <SpotlightTarget id={`cart-item-${item.id}`}>
                <div className="flex items-center gap-4 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element -- inline SVG data URI */}
                  <img
                    src={item.image}
                    alt=""
                    width={72}
                    height={72}
                    className="h-18 w-18 shrink-0 rounded-lg bg-neutral-800 object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-neutral-100">{item.name}</p>
                    <p className="text-sm text-neutral-400">
                      Size {item.size} · {item.color} · Qty {item.qty}
                    </p>
                  </div>
                  <p className="font-medium text-neutral-100">{formatCurrency(item.price * item.qty)}</p>
                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    className="rounded-lg border border-neutral-700 px-3 py-1.5 text-sm text-neutral-300 hover:border-red-500 hover:text-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    Remove
                  </button>
                </div>
              </SpotlightTarget>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <form onSubmit={handleApplyDiscount} className="mt-6 flex flex-wrap items-end gap-3">
        <div className="flex-1">
          <label htmlFor="discount-code" className="mb-1 block text-xs font-medium text-neutral-400">
            Discount code
          </label>
          <input
            id="discount-code"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            placeholder="WEBMCP10"
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400 sm:w-48"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-200 hover:border-emerald-500 hover:text-emerald-300"
        >
          Apply
        </button>
        {discountMessage ? (
          <p role="status" aria-live="polite" className="text-sm text-neutral-400">
            {discountMessage}
          </p>
        ) : null}
      </form>

      <SpotlightTarget id="discount-summary">
        <div className="mt-8 rounded-xl border border-neutral-800 bg-neutral-900 p-5">
          <div className="flex justify-between text-neutral-300">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {cart.discountCode ? (
            <div className="mt-1 flex justify-between text-sm text-emerald-400">
              <span>Discount ({cart.discountCode})</span>
              <span>-{formatCurrency(subtotal - total)}</span>
            </div>
          ) : null}
          <div className="mt-2 flex justify-between border-t border-neutral-800 pt-2 text-lg font-semibold text-neutral-50">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>

          <button
            type="button"
            onClick={handleCheckout}
            disabled={checkingOut}
            className="mt-4 w-full rounded-lg bg-emerald-500 px-4 py-3 font-semibold text-neutral-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
          >
            {checkingOut ? "Placing order…" : "Checkout"}
          </button>
          {checkoutError ? (
            <p role="alert" className="mt-2 text-sm text-red-400">
              {checkoutError}
            </p>
          ) : null}
        </div>
      </SpotlightTarget>
    </div>
  );
}
