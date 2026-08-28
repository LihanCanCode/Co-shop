import "server-only";
import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";
import type { Cart, Order } from "@/types";
import { getProductById } from "@/lib/catalog";
import { discountPercentFor, normalizeDiscountCode } from "@/lib/discounts";

const CART_COOKIE = "coshop_cart";
const ORDERS_COOKIE = "coshop_orders";
const MAX_ORDERS = 5;
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function parseCart(raw: string | undefined): Cart {
  if (!raw) return { items: [] };
  try {
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.items)) {
      return { items: parsed.items, discountCode: parsed.discountCode };
    }
  } catch {
    // ignore malformed cookie, fall back to an empty cart
  }
  return { items: [] };
}

function parseOrders(raw: string | undefined): Order[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function getCart(): Promise<Cart> {
  const store = await cookies();
  return parseCart(store.get(CART_COOKIE)?.value);
}

async function saveCart(cart: Cart): Promise<void> {
  const store = await cookies();
  store.set(CART_COOKIE, JSON.stringify(cart), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export function cartSubtotal(cart: Cart): number {
  const raw = cart.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  return Math.round(raw * 100) / 100;
}

export function cartTotal(cart: Cart): number {
  const subtotal = cartSubtotal(cart);
  const percent = discountPercentFor(cart.discountCode);
  return Math.round(subtotal * (1 - percent) * 100) / 100;
}

interface AddToCartInput {
  productId: string;
  size: string;
  color: string;
  qty?: number;
}

export async function addToCart(input: AddToCartInput): Promise<Cart> {
  const product = getProductById(input.productId);
  if (!product) {
    throw new Error(`No product found with id "${input.productId}".`);
  }
  if (!product.sizes.some((s) => s.toLowerCase() === input.size?.toLowerCase())) {
    throw new Error(
      `"${product.name}" is not available in size "${input.size}". Available sizes: ${product.sizes.join(", ")}.`
    );
  }
  if (!product.colors.some((c) => c.toLowerCase() === input.color?.toLowerCase())) {
    throw new Error(
      `"${product.name}" is not available in color "${input.color}". Available colors: ${product.colors.join(", ")}.`
    );
  }

  const size = product.sizes.find((s) => s.toLowerCase() === input.size.toLowerCase())!;
  const color = product.colors.find((c) => c.toLowerCase() === input.color.toLowerCase())!;
  const qty = Math.max(1, Math.min(Math.floor(input.qty ?? 1), product.stock));

  const cart = await getCart();
  const existing = cart.items.find(
    (item) => item.productId === product.id && item.size === size && item.color === color
  );
  if (existing) {
    existing.qty = Math.min(existing.qty + qty, product.stock);
  } else {
    cart.items.push({
      id: randomUUID(),
      productId: product.id,
      name: product.name,
      price: product.price,
      size,
      color,
      qty,
      image: product.image,
    });
  }

  await saveCart(cart);
  return cart;
}

export async function removeFromCart(itemId: string): Promise<Cart> {
  const cart = await getCart();
  if (!cart.items.some((item) => item.id === itemId)) {
    throw new Error(`No cart item found with id "${itemId}".`);
  }
  const next: Cart = { ...cart, items: cart.items.filter((item) => item.id !== itemId) };
  await saveCart(next);
  return next;
}

export async function clearCart(): Promise<void> {
  await saveCart({ items: [] });
}

export async function applyDiscountCode(code: string): Promise<Cart> {
  const normalized = normalizeDiscountCode(code);
  if (discountPercentFor(normalized) === 0) {
    throw new Error(`"${code}" is not a valid discount code.`);
  }
  const cart = await getCart();
  const next: Cart = { ...cart, discountCode: normalized };
  await saveCart(next);
  return next;
}

export async function createOrder(): Promise<Order> {
  const cart = await getCart();
  if (cart.items.length === 0) {
    throw new Error("Your cart is empty. Add an item before checking out.");
  }

  const subtotal = cartSubtotal(cart);
  const percent = discountPercentFor(cart.discountCode);
  const order: Order = {
    id: randomUUID(),
    items: cart.items,
    subtotal,
    discountCode: cart.discountCode,
    discountPercent: percent || undefined,
    total: cartTotal(cart),
    createdAt: new Date().toISOString(),
    status: "confirmed",
  };

  const store = await cookies();
  const existing = parseOrders(store.get(ORDERS_COOKIE)?.value);
  const updated = [order, ...existing].slice(0, MAX_ORDERS);
  store.set(ORDERS_COOKIE, JSON.stringify(updated), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  await clearCart();
  return order;
}

export async function getOrder(orderId: string): Promise<Order | undefined> {
  const store = await cookies();
  const orders = parseOrders(store.get(ORDERS_COOKIE)?.value);
  return orders.find((order) => order.id === orderId);
}
