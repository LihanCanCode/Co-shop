import type { Product } from "@/types";
import { productImage } from "@/lib/placeholder";

const SHOE_SIZES = ["7", "8", "9", "10", "11", "12"];
const APPAREL_SIZES = ["S", "M", "L", "XL"];

type SeedProduct = Omit<Product, "image">;

const SEED_PRODUCTS: SeedProduct[] = [
  {
    id: "trailblazer-runner",
    name: "Trailblazer Runner",
    description:
      "A lightweight daily trainer with responsive cushioning for road and light trail miles.",
    category: "Shoes",
    price: 89,
    sizes: SHOE_SIZES,
    colors: ["Black", "Crimson", "Slate"],
    stock: 24,
  },
  {
    id: "urban-glide-sneaker",
    name: "Urban Glide Sneaker",
    description:
      "A minimalist low-top sneaker built for all-day comfort on city streets.",
    category: "Shoes",
    price: 74,
    sizes: SHOE_SIZES,
    colors: ["White", "Navy", "Charcoal"],
    stock: 30,
  },
  {
    id: "cloudstep-walking-shoe",
    name: "CloudStep Walking Shoe",
    description:
      "Extra-cushioned walking shoe designed for long shifts and long walks alike.",
    category: "Shoes",
    price: 68,
    sizes: SHOE_SIZES,
    colors: ["Black", "Sand"],
    stock: 18,
  },
  {
    id: "peak-hiker-boot",
    name: "Peak Hiker Boot",
    description: "A waterproof hiking boot with aggressive tread for rugged terrain.",
    category: "Shoes",
    price: 132,
    sizes: ["8", "9", "10", "11", "12"],
    colors: ["Olive", "Charcoal"],
    stock: 12,
  },
  {
    id: "classic-canvas-low-top",
    name: "Classic Canvas Low-Top",
    description: "A timeless canvas low-top that pairs with everything.",
    category: "Shoes",
    price: 52,
    sizes: ["7", "8", "9", "10", "11"],
    colors: ["White", "Black", "Navy"],
    stock: 40,
  },
  {
    id: "all-terrain-trail-boot",
    name: "All-Terrain Trail Boot",
    description:
      "Rugged trail boot with a reinforced toe and grippy outsole for uneven ground.",
    category: "Shoes",
    price: 118,
    sizes: ["8", "9", "10", "11", "12"],
    colors: ["Slate", "Olive"],
    stock: 15,
  },
  {
    id: "studio-flex-trainer",
    name: "Studio Flex Trainer",
    description:
      "A flexible cross-trainer built for studio workouts and quick lateral moves.",
    category: "Shoes",
    price: 79,
    sizes: ["7", "8", "9", "10", "11"],
    colors: ["Black", "White"],
    stock: 22,
  },
  {
    id: "coastal-slip-on",
    name: "Coastal Slip-On",
    description: "A breathable slip-on shoe made for warm days near the water.",
    category: "Shoes",
    price: 58,
    sizes: ["8", "9", "10", "11", "12"],
    colors: ["Sand", "Navy"],
    stock: 20,
  },
  {
    id: "everyday-crew-tee",
    name: "Everyday Crew Tee",
    description: "A soft, breathable cotton tee for everyday wear.",
    category: "Apparel",
    price: 22,
    sizes: APPAREL_SIZES,
    colors: ["Black", "White", "Charcoal", "Sand"],
    stock: 60,
  },
  {
    id: "performance-half-zip",
    name: "Performance Half-Zip",
    description: "A moisture-wicking half-zip pullover built for training days.",
    category: "Apparel",
    price: 58,
    sizes: APPAREL_SIZES,
    colors: ["Navy", "Charcoal"],
    stock: 26,
  },
  {
    id: "lightweight-rain-shell",
    name: "Lightweight Rain Shell",
    description: "A packable rain shell that keeps you dry without weighing you down.",
    category: "Apparel",
    price: 84,
    sizes: APPAREL_SIZES,
    colors: ["Black", "Olive"],
    stock: 16,
  },
  {
    id: "relaxed-fit-joggers",
    name: "Relaxed Fit Joggers",
    description:
      "Relaxed-fit joggers with a tapered leg, perfect for travel or rest days.",
    category: "Apparel",
    price: 46,
    sizes: APPAREL_SIZES,
    colors: ["Charcoal", "Black", "Sand"],
    stock: 34,
  },
  {
    id: "merino-wool-beanie",
    name: "Merino Wool Beanie",
    description: "A warm merino wool beanie for cold-weather days.",
    category: "Apparel",
    price: 28,
    sizes: ["One Size"],
    colors: ["Black", "Navy", "Crimson"],
    stock: 45,
  },
  {
    id: "trail-windbreaker",
    name: "Trail Windbreaker",
    description: "A wind-resistant shell built for variable trail weather.",
    category: "Apparel",
    price: 64,
    sizes: APPAREL_SIZES,
    colors: ["Olive", "Slate"],
    stock: 19,
  },
  {
    id: "classic-denim-jacket",
    name: "Classic Denim Jacket",
    description: "A classic denim jacket with a modern relaxed fit.",
    category: "Apparel",
    price: 76,
    sizes: APPAREL_SIZES,
    colors: ["Navy", "Black"],
    stock: 21,
  },
  {
    id: "thermal-base-layer",
    name: "Thermal Base Layer",
    description: "A thermal base layer for cold-weather layering.",
    category: "Apparel",
    price: 38,
    sizes: APPAREL_SIZES,
    colors: ["Black", "Charcoal"],
    stock: 28,
  },
];

export const PRODUCTS: Product[] = SEED_PRODUCTS.map((p) => ({
  ...p,
  image: productImage(p.id, p.name),
}));

export const CATEGORIES: Product["category"][] = ["Shoes", "Apparel"];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return PRODUCTS;
  return PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  );
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  query?: string;
}

export function filterProducts(filters: ProductFilters): Product[] {
  let results = filters.query ? searchProducts(filters.query) : PRODUCTS;

  if (filters.category) {
    const category = filters.category.toLowerCase();
    results = results.filter((p) => p.category.toLowerCase() === category);
  }
  if (typeof filters.minPrice === "number") {
    results = results.filter((p) => p.price >= filters.minPrice!);
  }
  if (typeof filters.maxPrice === "number") {
    results = results.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters.size) {
    const size = filters.size.toLowerCase();
    results = results.filter((p) => p.sizes.some((s) => s.toLowerCase() === size));
  }
  if (filters.color) {
    const color = filters.color.toLowerCase();
    results = results.filter((p) => p.colors.some((c) => c.toLowerCase() === color));
  }

  return results;
}
