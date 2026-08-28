import type { Cart, Order, Product } from "@/types";
import { formatCurrency } from "@/lib/format";

export function formatProductLine(product: Product): string {
  return `- id: ${product.id} | ${product.name} | ${formatCurrency(product.price)} | ${product.category} | sizes: ${product.sizes.join(", ")} | colors: ${product.colors.join(", ")}`;
}

export function formatProductList(products: Product[], header: string): string {
  if (products.length === 0) {
    return `${header}\nNo products matched. Try a broader search or different filters.`;
  }
  return [header, ...products.map(formatProductLine)].join("\n");
}

export function formatProductDetail(product: Product): string {
  return [
    `${product.name} (id: ${product.id})`,
    product.description,
    `Category: ${product.category}`,
    `Price: ${formatCurrency(product.price)}`,
    `Sizes: ${product.sizes.join(", ")}`,
    `Colors: ${product.colors.join(", ")}`,
    `In stock: ${product.stock}`,
  ].join("\n");
}

export function formatCartSummary(cart: Cart, subtotal: number, total: number): string {
  if (cart.items.length === 0) {
    return "Your cart is empty.";
  }
  const lines = cart.items.map(
    (item) =>
      `- itemId: ${item.id} | ${item.qty} × ${item.name} (size ${item.size}, ${item.color}) — ${formatCurrency(item.price * item.qty)}`
  );
  const summary = [`Cart (${cart.items.length} line item(s)):`, ...lines, `Subtotal: ${formatCurrency(subtotal)}`];
  if (cart.discountCode) {
    summary.push(`Discount code applied: ${cart.discountCode}`);
  }
  summary.push(`Total: ${formatCurrency(total)}`);
  return summary.join("\n");
}

export function formatOrderSummary(order: Order): string {
  const lines = order.items.map(
    (item) => `- ${item.qty} × ${item.name} (size ${item.size}, ${item.color})`
  );
  const parts = [
    `Order confirmed — id: ${order.id}`,
    `Placed: ${new Date(order.createdAt).toLocaleString()}`,
    ...lines,
    `Subtotal: ${formatCurrency(order.subtotal)}`,
  ];
  if (order.discountCode) {
    parts.push(`Discount code: ${order.discountCode} (${Math.round((order.discountPercent ?? 0) * 100)}% off)`);
  }
  parts.push(`Total: ${formatCurrency(order.total)}`, `Status: ${order.status}`);
  return parts.join("\n");
}

export function formatComparison(products: Product[]): string {
  if (products.length === 0) return "No matching products found to compare.";
  const header = ["Comparing:", ...products.map((p) => p.name)].join(" vs. ");
  const rows = products.map((p) => formatProductDetail(p)).join("\n\n");
  return `${header}\n\n${rows}`;
}
