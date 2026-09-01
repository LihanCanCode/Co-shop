"use client";

import { motion } from "framer-motion";

/**
 * Decorative background orbs — purely visual, pointer-events-none.
 * Keeps home page / product pages feeling alive without affecting layout.
 */
export default function AnimatedBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {/* Primary violet orb — top-left */}
      <motion.div
        className="orb orb-a"
        style={{ top: "-120px", left: "-80px" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />

      {/* Purple orb — top-right */}
      <motion.div
        className="orb orb-b"
        style={{ top: "60px", right: "-60px" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.4, delay: 0.3, ease: "easeOut" }}
      />

      {/* Indigo orb — bottom-center */}
      <motion.div
        className="orb orb-c"
        style={{ bottom: "10%", left: "40%" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.6, ease: "easeOut" }}
      />

      {/* Subtle noise texture overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "256px 256px",
        }}
      />
    </div>
  );
}
