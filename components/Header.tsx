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
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-40 glass border-b"
      style={{ borderColor: "var(--cs-border)" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-lg font-bold tracking-tight text-cs-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cs-accent"
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: 180 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            aria-hidden
            className="flex h-9 w-9 items-center justify-center rounded-xl relative overflow-hidden"
            style={{
              background: "rgba(124, 58, 237, 0.15)",
              border: "1px solid rgba(168, 85, 247, 0.4)",
              boxShadow: "0 0 20px rgba(124,58,237,0.4), inset 0 0 10px rgba(168,85,247,0.2)",
              backdropFilter: "blur(8px)",
            }}
          >
            {/* Inner glow effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-fuchsia-400/20 rounded-xl" />
            
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative z-10"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="url(#grad1)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="url(#grad2)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="url(#grad3)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient id="grad1" x1="2" y1="2" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#c084fc" />
                  <stop offset="1" stopColor="#f0abfc" />
                </linearGradient>
                <linearGradient id="grad2" x1="2" y1="17" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#7c3aed" />
                  <stop offset="1" stopColor="#d8b4fe" />
                </linearGradient>
                <linearGradient id="grad3" x1="2" y1="12" x2="22" y2="17" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#9333ea" />
                  <stop offset="1" stopColor="#e879f9" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
          <span className="gradient-text">CoShop</span>
        </Link>

        {/* Nav */}
        <nav aria-label="Primary" className="flex items-center gap-3 sm:gap-4">
          {/* Agent badge */}
          {supported ? (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
              className="hidden items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold sm:inline-flex"
              style={{
                background: "rgb(6 182 212 / 0.10)",
                border: "1px solid rgb(6 182 212 / 0.30)",
                color: "#22d3ee",
              }}
            >
              <span
                aria-hidden
                className="agent-dot h-1.5 w-1.5 rounded-full bg-cs-agent"
              />
              Agent active
            </motion.span>
          ) : null}

          {/* Cart button */}
          <Link
            href="/cart"
            className="group relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-cs-text-primary transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cs-accent"
            style={{
              background: "rgba(139, 92, 246, 0.08)",
              border: "1px solid var(--cs-border)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--cs-border-bright)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(124,58,237,0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--cs-border)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            <svg
              aria-hidden
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-cs-accent-light"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <line x1="3" x2="21" y1="6" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            Cart
            <span aria-live="polite" className="relative inline-flex min-w-[1.5rem] items-center justify-center">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 420, damping: 20 }}
                  className="inline-flex min-w-[1.5rem] items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-bold text-white"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                    boxShadow: "0 0 8px rgba(124,58,237,0.5)",
                  }}
                >
                  {itemCount}
                </motion.span>
              </AnimatePresence>
            </span>
          </Link>
        </nav>
      </div>

      {/* Animated gradient border-bottom line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="absolute bottom-0 left-0 right-0 h-px origin-left"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.6), rgba(168,85,247,0.4), transparent)",
        }}
      />
    </motion.header>
  );
}
