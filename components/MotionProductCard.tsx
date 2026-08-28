"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function MotionProductCard({ children }: { children: ReactNode }) {
  return (
    <motion.li
      variants={cardVariants}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 transition-colors hover:border-emerald-600/60"
    >
      {children}
    </motion.li>
  );
}
