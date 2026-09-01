"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCartStore } from "@/store/cart-store";

/**
 * A visible, screen-reader-announced log of what the agent just did.
 * Cyan colour system = agent action. Glassmorphism surface.
 */
export default function ToolActivityToast() {
  const activity = useCartStore((state) => state.activity);

  if (activity.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-xs flex-col-reverse gap-2 sm:bottom-6 sm:right-6"
      aria-live="polite"
      aria-atomic="false"
    >
      <AnimatePresence initial={false}>
        {activity.slice(0, 4).map((entry, i) => (
          <motion.div
            key={entry.id}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.94 }}
            animate={{
              opacity: 1 - i * 0.22,
              y: 0,
              scale: i === 0 ? 1 : 0.96,
            }}
            exit={{ opacity: 0, y: -8, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="pointer-events-auto overflow-hidden rounded-xl shadow-2xl"
            style={{
              background: "rgba(15, 15, 26, 0.92)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: `1px solid ${
                i === 0
                  ? "rgb(6 182 212 / 0.45)"
                  : "rgb(6 182 212 / 0.15)"
              }`,
              boxShadow:
                i === 0
                  ? "0 0 20px rgba(6,182,212,0.15)"
                  : "none",
            }}
          >
            {/* Cyan top accent line */}
            {i === 0 && (
              <div
                className="h-px w-full"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(6,182,212,0.7), transparent)",
                }}
              />
            )}

            <div className="px-4 py-3">
              <p
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
                style={{ color: "#22d3ee" }}
              >
                <span
                  aria-hidden
                  className={`inline-block h-1.5 w-1.5 rounded-full bg-cs-agent ${
                    i === 0 ? "agent-dot" : ""
                  }`}
                />
                Agent action
              </p>
              <p
                className={`mt-1 text-cs-text-primary ${
                  i === 0 ? "text-sm font-medium" : "text-xs"
                }`}
              >
                {entry.label}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
