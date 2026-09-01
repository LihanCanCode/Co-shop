"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const cardVariants = {
  hidden: { opacity: 0, y: 22, scale: 0.94 },
  show:   { opacity: 1, y: 0,  scale: 1 },
};

export default function MotionProductCard({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <motion.li
      variants={cardVariants}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="group card-hover relative overflow-hidden rounded-2xl"
      style={{
        background:
          "linear-gradient(145deg, rgba(24,24,40,0.85) 0%, rgba(15,15,26,0.90) 100%)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid var(--cs-border)",
      }}
    >
      {children}
    </motion.li>
  );
}
