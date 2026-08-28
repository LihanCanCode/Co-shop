import { NextRequest, NextResponse } from "next/server";
import { addToCart, cartSubtotal, cartTotal, getCart, removeFromCart } from "@/lib/cart-cookie";

function toResponse(cart: Awaited<ReturnType<typeof getCart>>) {
  return NextResponse.json({
    cart,
    subtotal: cartSubtotal(cart),
    total: cartTotal(cart),
  });
}

export async function GET() {
  const cart = await getCart();
  return toResponse(cart);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cart = await addToCart({
      productId: String(body.productId ?? ""),
      size: String(body.size ?? ""),
      color: String(body.color ?? ""),
      qty: body.qty !== undefined ? Number(body.qty) : undefined,
    });
    return toResponse(cart);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to add item to cart." },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const itemId = String(body.itemId ?? "");
    if (!itemId) throw new Error("Missing itemId.");
    const cart = await removeFromCart(itemId);
    return toResponse(cart);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to remove item from cart." },
      { status: 400 }
    );
  }
}
