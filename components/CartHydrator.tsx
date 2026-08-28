"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart-store";

/** Loads the cookie-backed cart into client state once on mount. */
export default function CartHydrator() {
  useEffect(() => {
    void useCartStore.getState().refresh();
  }, []);

  return null;
}
