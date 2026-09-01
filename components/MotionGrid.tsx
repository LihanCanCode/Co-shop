"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const gridVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

export default function MotionGrid({ children }: { children: ReactNode }) {
  return (
    <motion.ul
      className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4"
      aria-label="Product results"
      variants={gridVariants}
      initial="hidden"
      animate="show"
      layout
    >
      {children}
    </motion.ul>
  );
}
