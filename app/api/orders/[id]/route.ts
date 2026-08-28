import { NextResponse } from "next/server";
import { getOrder } from "@/lib/cart-cookie";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) {
    return NextResponse.json({ error: `No order found with id "${id}".` }, { status: 404 });
  }
  return NextResponse.json({ order });
}
