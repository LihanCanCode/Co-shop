"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cart-store";

/**
 * Wraps a UI element that a WebMCP tool call can "point at". When the shared
 * store's spotlight matches this id, the element scrolls into view and pulses
 * — the visual half of "watch the agent work on this exact thing".
 */
export default function SpotlightTarget({
  id,
  children,
  className,
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  const active = useCartStore((state) => state.spotlight === id);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (active) {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [active]);

  return (
    <motion.div
      ref={ref}
      id={id}
      className={className}
      animate={
        active
          ? {
              boxShadow: [
                "0 0 0 0 rgba(52,211,153,0)",
                "0 0 0 4px rgba(52,211,153,0.55)",
                "0 0 0 0 rgba(52,211,153,0)",
              ],
            }
          : { boxShadow: "0 0 0 0 rgba(52,211,153,0)" }
      }
      transition={active ? { duration: 1.8, times: [0, 0.35, 1], ease: "easeOut" } : { duration: 0.2 }}
      style={{ borderRadius: "0.75rem" }}
    >
      {children}
    </motion.div>
  );
}
