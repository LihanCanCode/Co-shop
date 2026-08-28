import { NextRequest, NextResponse } from "next/server";
import { applyDiscountCode, cartSubtotal, cartTotal } from "@/lib/cart-cookie";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const code = String(body.code ?? "");
    if (!code) throw new Error("Missing discount code.");
    const cart = await applyDiscountCode(code);
    return NextResponse.json({ cart, subtotal: cartSubtotal(cart), total: cartTotal(cart) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to apply discount code." },
      { status: 400 }
    );
  }
}
