"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/format";

/**
 * The agent can prepare a checkout, but only the human can pull the trigger.
 * Cyan colour system = agent-initiated. Glassmorphism surface.
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
      setError(
        err instanceof Error ? err.message : "Unable to complete checkout."
      );
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
          initial={{ opacity: 0, y: -28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 340, damping: 28 }}
          className="fixed inset-x-4 top-4 z-[60] mx-auto max-w-md overflow-hidden rounded-2xl shadow-2xl sm:inset-x-auto sm:right-6"
          style={{
            background: "rgba(15, 15, 26, 0.95)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgb(6 182 212 / 0.40)",
            boxShadow:
              "0 0 40px rgba(6,182,212,0.12), 0 20px 60px rgba(0,0,0,0.5)",
          }}
        >
          {/* Cyan shimmer top line */}
          <motion.div
            className="h-px w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(6,182,212,0.8), rgba(34,211,238,0.6), transparent)",
            }}
            animate={{ backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />

          <div className="p-5">
            {/* Header */}
            <p
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
              style={{ color: "#22d3ee" }}
            >
              <span
                aria-hidden
                className="agent-dot inline-block h-1.5 w-1.5 rounded-full bg-cs-agent"
              />
              Your agent wants to place this order
            </p>

            {/* Summary */}
            <p className="mt-2.5 text-sm text-cs-text-secondary">
              {pending.items.length} item
              {pending.items.length === 1 ? "" : "s"} · Total{" "}
              <span className="font-bold text-cs-text-primary">
                {formatCurrency(pending.total)}
              </span>
            </p>

            {error ? (
              <p className="mt-2 text-sm text-red-400">{error}</p>
            ) : null}

            {/* Actions */}
            <div className="mt-4 flex gap-2.5">
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={handleConfirm}
                disabled={busy}
                className="btn-gradient flex-1 rounded-xl px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cs-accent/60"
              >
                {busy ? "Confirming…" : "Confirm order"}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={cancelCheckout}
                disabled={busy}
                className="flex-1 rounded-xl px-3 py-2.5 text-sm font-semibold text-cs-text-secondary transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cs-accent/60"
                style={{
                  background: "rgba(139, 92, 246, 0.07)",
                  border: "1px solid var(--cs-border)",
                }}
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
              >
                Decline
              </motion.button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
