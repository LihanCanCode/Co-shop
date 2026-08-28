"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCartStore } from "@/store/cart-store";
import { useWebMCPSupported } from "@/lib/use-webmcp-supported";

export default function Header() {
  const itemCount = useCartStore((state) =>
    state.cart.items.reduce((sum, item) => sum + item.qty, 0)
  );
  const supported = useWebMCPSupported();

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
        >
          <span
            aria-hidden
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-neutral-950"
          >
            CS
          </span>
          CoShop
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-4 sm:gap-6">
          {supported ? (
            <span className="hidden items-center gap-1.5 rounded-full border border-emerald-800/60 bg-emerald-950/60 px-3 py-1 text-xs font-medium text-emerald-300 sm:inline-flex">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Agent tools active
            </span>
          ) : null}
          <Link
            href="/cart"
            className="relative flex items-center gap-2 rounded-lg border border-neutral-700 px-3 py-2 text-sm font-medium text-neutral-100 hover:border-emerald-500 hover:text-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
          >
            Cart
            <span aria-live="polite" className="relative inline-flex min-w-[1.5rem] items-center justify-center">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 420, damping: 20 }}
                  className="inline-flex min-w-[1.5rem] items-center justify-center rounded-full bg-emerald-500 px-1.5 py-0.5 text-xs font-bold text-neutral-950"
                >
                  {itemCount}
                </motion.span>
              </AnimatePresence>
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
