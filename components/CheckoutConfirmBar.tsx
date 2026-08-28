"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/format";

/**
 * The agent can prepare a checkout, but only the human can pull the trigger.
 * Renders globally so it surfaces no matter what page the shopper is on when
 * their agent proposes completing the order — the visible "handoff" moment.
 */
export default function CheckoutConfirmBar() {
  const router = useRouter();
  const pending = useCartStore((state) => state.pendingCheckout);
  const confirmCheckout = useCartStore((state) => state.confirmCheckout);
  const cancelCheckout = useCartStore((state) => state.cancelCheckout);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setBusy(true);
    setError(null);
    try {
      const order = await confirmCheckout();
      router.push(`/orders/${order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to complete checkout.");
      setBusy(false);
    }
  }

  return (
    <AnimatePresence>
      {pending ? (
        <motion.div
          id="checkout-confirm-bar"
          role="alertdialog"
          aria-live="assertive"
          aria-label="Agent is requesting checkout confirmation"
          initial={{ opacity: 0, y: -24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 340, damping: 28 }}
          className="fixed inset-x-4 top-4 z-[60] mx-auto max-w-md rounded-xl border border-emerald-500/60 bg-neutral-900/95 p-4 shadow-2xl backdrop-blur sm:inset-x-auto sm:right-6"
        >
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            <span aria-hidden className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Your agent wants to place this order
          </p>
          <p className="mt-2 text-sm text-neutral-300">
            {pending.items.length} item{pending.items.length === 1 ? "" : "s"} · Total{" "}
            <span className="font-semibold text-neutral-50">{formatCurrency(pending.total)}</span>
          </p>
          {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={busy}
              className="flex-1 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-neutral-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
            >
              {busy ? "Confirming…" : "Confirm order"}
            </button>
            <button
              type="button"
              onClick={cancelCheckout}
              disabled={busy}
              className="flex-1 rounded-lg border border-neutral-700 px-3 py-2 text-sm font-medium text-neutral-300 hover:border-red-500 hover:text-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
            >
              Decline
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
