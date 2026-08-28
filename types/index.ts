export type ProductCategory = "Shoes" | "Apparel";

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  sizes: string[];
  colors: string[];
  image: string;
  stock: number;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  size: string;
  color: string;
  qty: number;
  image: string;
}

export interface Cart {
  items: CartItem[];
  discountCode?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discountCode?: string;
  discountPercent?: number;
  total: number;
  createdAt: string;
  status: "confirmed";
}
