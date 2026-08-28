import { NextResponse } from "next/server";
import { createOrder } from "@/lib/cart-cookie";

export async function POST() {
  try {
    const order = await createOrder();
    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to complete checkout." },
      { status: 400 }
    );
  }
}
