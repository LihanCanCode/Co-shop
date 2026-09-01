"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cart-store";

/**
 * Wraps a UI element that a WebMCP tool call can "point at".
 * Spotlight glow uses cyan (agent colour) to match the overall agent/user
 * colour semantics: cyan = agent-initiated, violet = user-initiated.
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
                "0 0 0 0px rgba(6,182,212,0)",
                "0 0 0 3px rgba(6,182,212,0.55)",
                "0 0 20px 4px rgba(6,182,212,0.25)",
                "0 0 0 0px rgba(6,182,212,0)",
              ],
            }
          : { boxShadow: "0 0 0 0px rgba(6,182,212,0)" }
      }
      transition={
        active
          ? { duration: 2.0, times: [0, 0.25, 0.5, 1], ease: "easeOut" }
          : { duration: 0.2 }
      }
      style={{ borderRadius: "0.75rem" }}
    >
      {children}
    </motion.div>
  );
}
