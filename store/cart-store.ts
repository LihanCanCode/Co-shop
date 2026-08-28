"use client";

import { create } from "zustand";
import type { Cart, Order } from "@/types";

export interface ToolActivity {
  id: string;
  label: string;
  timestamp: number;
}

interface AddItemInput {
  productId: string;
  size: string;
  color: string;
  qty?: number;
}

export interface PendingCheckout {
  items: Cart["items"];
  subtotal: number;
  total: number;
  discountCode?: string;
}

interface CartState {
  cart: Cart;
  subtotal: number;
  total: number;
  hydrated: boolean;
  lastOrder: Order | null;
  activity: ToolActivity[];
  spotlight: string | null;
  pendingCheckout: PendingCheckout | null;
  refresh: () => Promise<void>;
  addItem: (input: AddItemInput) => Promise<Cart>;
  removeItem: (itemId: string) => Promise<Cart>;
  applyDiscount: (code: string) => Promise<Cart>;
  prepareCheckout: () => PendingCheckout | null;
  confirmCheckout: () => Promise<Order>;
  cancelCheckout: () => void;
  logActivity: (label: string) => void;
  setSpotlight: (id: string, ttlMs?: number) => void;
}

async function parseJsonResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error ?? "Something went wrong.");
  }
  return data as T;
}

export const useCartStore = create<CartState>()((set, get) => ({
  cart: { items: [] },
  subtotal: 0,
  total: 0,
  hydrated: false,
  lastOrder: null,
  activity: [],
  spotlight: null,
  pendingCheckout: null,

  logActivity: (label) => {
    set((state) => ({
      activity: [
        { id: crypto.randomUUID(), label, timestamp: Date.now() },
        ...state.activity,
      ].slice(0, 6),
    }));
  },

  setSpotlight: (id, ttlMs = 2200) => {
    set({ spotlight: id });
    setTimeout(() => {
      set((state) => (state.spotlight === id ? { spotlight: null } : {}));
    }, ttlMs);
  },

  refresh: async () => {
    const res = await fetch("/api/cart");
    const data = await parseJsonResponse<{ cart: Cart; subtotal: number; total: number }>(res);
    set({ cart: data.cart, subtotal: data.subtotal, total: data.total, hydrated: true });
  },

  addItem: async (input) => {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await parseJsonResponse<{ cart: Cart; subtotal: number; total: number }>(res);
    set({ cart: data.cart, subtotal: data.subtotal, total: data.total });
    return data.cart;
  },

  removeItem: async (itemId) => {
    const res = await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId }),
    });
    const data = await parseJsonResponse<{ cart: Cart; subtotal: number; total: number }>(res);
    set({ cart: data.cart, subtotal: data.subtotal, total: data.total });
    return data.cart;
  },

  applyDiscount: async (code) => {
    const res = await fetch("/api/cart/discount", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const data = await parseJsonResponse<{ cart: Cart; subtotal: number; total: number }>(res);
    set({ cart: data.cart, subtotal: data.subtotal, total: data.total });
    return data.cart;
  },

  prepareCheckout: () => {
    const { cart, subtotal, total } = get();
    if (cart.items.length === 0) return null;
    const pending: PendingCheckout = { items: cart.items, subtotal, total, discountCode: cart.discountCode };
    set({ pendingCheckout: pending });
    return pending;
  },

  cancelCheckout: () => {
    set({ pendingCheckout: null });
  },

  confirmCheckout: async () => {
    const res = await fetch("/api/checkout", { method: "POST" });
    const data = await parseJsonResponse<{ order: Order }>(res);
    set({ cart: { items: [] }, subtotal: 0, total: 0, lastOrder: data.order, pendingCheckout: null });
    return data.order;
  },
}));
