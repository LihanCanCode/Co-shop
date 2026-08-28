"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCartStore } from "@/store/cart-store";

/**
 * A visible, screen-reader-announced log of what the agent just did.
 * This is both the demo's "wow" moment (watch the store react live as the
 * agent works) and a genuine accessibility feature: a non-visual user gets
 * the same live confirmation a sighted user gets from watching the UI change.
 * The newest entry reads as a caption; older ones recede behind it.
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
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1 - i * 0.2, y: 0, scale: i === 0 ? 1 : 0.97 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className={`pointer-events-auto rounded-lg border bg-neutral-900/95 px-3 py-2 shadow-lg backdrop-blur ${
              i === 0 ? "border-emerald-500/60" : "border-emerald-800/40"
            }`}
          >
            <p className="flex items-center gap-2 text-xs font-medium text-emerald-300">
              <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Agent action
            </p>
            <p className={`mt-0.5 text-neutral-100 ${i === 0 ? "text-sm font-medium" : "text-xs"}`}>
              {entry.label}
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
