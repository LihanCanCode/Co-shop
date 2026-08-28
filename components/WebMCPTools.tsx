"use client";

import { useWebMCP } from "use-webmcp-tool";
import { useCartStore } from "@/store/cart-store";
import { CATEGORIES, filterProducts, getProductById, searchProducts } from "@/lib/catalog";
import {
  formatCartSummary,
  formatComparison,
  formatOrderSummary,
  formatProductDetail,
  formatProductList,
} from "@/lib/agent-format";

/**
 * Registers the CoShop WebMCP tool surface via document.modelContext.
 * Every tool routes through the same cart store actions and API routes the
 * human-facing UI uses, so an agent and a person are always working off one
 * shared source of truth — that shared state is what powers the live UI sync.
 */
export default function WebMCPTools() {
  useWebMCP<{ query: string }, string>({
    name: "search_products",
    description:
      "Search the CoShop product catalog by keyword. Matches against product name, description, and category. Returns product ids that can be used with get_product_details or add_to_cart.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Free-text search, e.g. 'running shoes' or 'rain jacket'.",
        },
      },
      required: ["query"],
    },
    annotations: { readOnlyHint: true },
    execute: ({ query }) => {
      const results = searchProducts(query);
      useCartStore.getState().logActivity(`Searched for "${query}" — ${results.length} result(s)`);
      return formatProductList(results, `Found ${results.length} product(s) matching "${query}":`);
    },
  });

  useWebMCP<
    { category?: string; minPrice?: number; maxPrice?: number; size?: string; color?: string },
    string
  >({
    name: "filter_products",
    description:
      "Filter the CoShop product catalog by category, price range, size, and/or color. All fields are optional and combine with AND logic.",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          enum: CATEGORIES,
          description: "Product category to filter by.",
        },
        minPrice: { type: "number", description: "Minimum price in USD, inclusive." },
        maxPrice: { type: "number", description: "Maximum price in USD, inclusive." },
        size: { type: "string", description: "Required size, e.g. '10' or 'M'." },
        color: { type: "string", description: "Required color, e.g. 'Black'." },
      },
      required: [],
    },
    annotations: { readOnlyHint: true },
    execute: (filters) => {
      const results = filterProducts(filters);
      useCartStore.getState().logActivity(`Filtered catalog — ${results.length} result(s)`);
      return formatProductList(results, `${results.length} product(s) match those filters:`);
    },
  });

  useWebMCP<{ productId: string }, string>({
    name: "get_product_details",
    description:
      "Get full details for a single product by id, including price, available sizes, colors, and stock. Use the id returned by search_products or filter_products.",
    inputSchema: {
      type: "object",
      properties: {
        productId: { type: "string", description: "The product id." },
      },
      required: ["productId"],
    },
    annotations: { readOnlyHint: true },
    execute: ({ productId }) => {
      const product = getProductById(productId);
      if (!product) {
        throw new Error(`No product found with id "${productId}".`);
      }
      const store = useCartStore.getState();
      store.logActivity(`Looked up details for ${product.name}`);
      store.setSpotlight(`product-card-${product.id}`);
      return formatProductDetail(product);
    },
  });

  useWebMCP<{ productIds: string[] }, string>({
    name: "compare_products",
    description:
      "Compare two or more products side by side by id. Useful when a shopper is deciding between similar items.",
    inputSchema: {
      type: "object",
      properties: {
        productIds: {
          type: "array",
          items: { type: "string" },
          minItems: 2,
          description: "Two or more product ids to compare.",
        },
      },
      required: ["productIds"],
    },
    annotations: { readOnlyHint: true },
    execute: ({ productIds }) => {
      const products = productIds
        .map((id) => getProductById(id))
        .filter((p): p is NonNullable<typeof p> => Boolean(p));
      const store = useCartStore.getState();
      store.logActivity(`Compared ${products.length} product(s)`);
      if (products[0]) store.setSpotlight(`product-card-${products[0].id}`);
      return formatComparison(products);
    },
  });

  useWebMCP<{ productId: string; size: string; color: string; qty?: number }, string>({
    name: "add_to_cart",
    description:
      "Add a product to the shopping cart with a chosen size, color, and quantity. Requires a valid productId from search_products, filter_products, or get_product_details.",
    inputSchema: {
      type: "object",
      properties: {
        productId: { type: "string", description: "The product id to add." },
        size: { type: "string", description: "The size to add, must be one of the product's available sizes." },
        color: { type: "string", description: "The color to add, must be one of the product's available colors." },
        qty: { type: "number", minimum: 1, description: "Quantity to add. Defaults to 1." },
      },
      required: ["productId", "size", "color"],
    },
    execute: async ({ productId, size, color, qty }) => {
      const store = useCartStore.getState();
      const cart = await store.addItem({ productId, size, color, qty });
      const product = getProductById(productId);
      store.logActivity(`Added ${qty ?? 1} × ${product?.name ?? productId} to cart`);
      store.setSpotlight(`product-card-${productId}`);
      return formatCartSummary(cart, useCartStore.getState().subtotal, useCartStore.getState().total);
    },
  });

  useWebMCP<Record<string, never>, string>({
    name: "view_cart",
    description: "View the current shopping cart contents, subtotal, and total.",
    inputSchema: { type: "object", properties: {}, required: [] },
    annotations: { readOnlyHint: true },
    execute: async () => {
      const store = useCartStore.getState();
      await store.refresh();
      const state = useCartStore.getState();
      store.logActivity("Viewed cart");
      return formatCartSummary(state.cart, state.subtotal, state.total);
    },
  });

  useWebMCP<{ itemId: string }, string>({
    name: "remove_from_cart",
    description:
      "Remove a line item from the shopping cart. Use the itemId shown in view_cart's output, not the productId.",
    inputSchema: {
      type: "object",
      properties: {
        itemId: { type: "string", description: "The cart line item id to remove." },
      },
      required: ["itemId"],
    },
    execute: async ({ itemId }) => {
      const store = useCartStore.getState();
      const cart = await store.removeItem(itemId);
      store.logActivity("Removed an item from cart");
      return formatCartSummary(cart, useCartStore.getState().subtotal, useCartStore.getState().total);
    },
  });

  useWebMCP<{ code: string }, string>({
    name: "apply_discount_code",
    description: "Apply a discount code to the current cart.",
    inputSchema: {
      type: "object",
      properties: {
        code: { type: "string", description: "The discount code to apply, e.g. 'WEBMCP10'." },
      },
      required: ["code"],
    },
    execute: async ({ code }) => {
      const store = useCartStore.getState();
      const cart = await store.applyDiscount(code);
      store.logActivity(`Applied discount code ${code.toUpperCase()}`);
      store.setSpotlight("discount-summary");
      return formatCartSummary(cart, useCartStore.getState().subtotal, useCartStore.getState().total);
    },
  });

  useWebMCP<Record<string, never>, string>({
    name: "checkout",
    description:
      "Prepare checkout for everything currently in the cart and hand it to the shopper for final confirmation. This does NOT place the order — a confirmation banner appears in the storefront that only the human shopper can accept or decline. The cart must not be empty. After calling this, tell the shopper their order is ready to confirm; use cancel_checkout to withdraw it instead.",
    inputSchema: { type: "object", properties: {}, required: [] },
    execute: () => {
      const store = useCartStore.getState();
      const pending = store.prepareCheckout();
      if (!pending) {
        throw new Error("The cart is empty — add items before checking out.");
      }
      store.logActivity(`Prepared checkout — waiting on shopper to confirm ($${pending.total.toFixed(2)})`);
      store.setSpotlight("checkout-confirm-bar");
      return `I've prepared your order (${pending.items.length} item(s), total $${pending.total.toFixed(2)}) and it's now waiting for your confirmation in the storefront — a confirmation banner has appeared. Ask the shopper to click "Confirm order" to complete it, or call cancel_checkout to withdraw it.`;
    },
  });

  useWebMCP<Record<string, never>, string>({
    name: "cancel_checkout",
    description: "Withdraw a checkout that was previously prepared with the checkout tool, before the shopper confirms it.",
    inputSchema: { type: "object", properties: {}, required: [] },
    execute: () => {
      const store = useCartStore.getState();
      store.cancelCheckout();
      store.logActivity("Withdrew the pending checkout");
      return "The pending checkout has been withdrawn. The cart is unchanged and nothing was ordered.";
    },
  });

  useWebMCP<{ orderId: string }, string>({
    name: "get_order_status",
    description: "Look up the status of a previously placed order by its order id.",
    inputSchema: {
      type: "object",
      properties: {
        orderId: { type: "string", description: "The order id returned by checkout." },
      },
      required: ["orderId"],
    },
    annotations: { readOnlyHint: true },
    execute: async ({ orderId }) => {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? `No order found with id "${orderId}".`);
      }
      useCartStore.getState().logActivity(`Checked status of order ${orderId.slice(0, 8)}`);
      return formatOrderSummary(data.order);
    },
  });

  return null;
}
