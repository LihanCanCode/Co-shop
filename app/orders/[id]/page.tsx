import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrder } from "@/lib/cart-cookie";
import { formatCurrency } from "@/lib/format";

export default async function OrderPage(props: PageProps<"/orders/[id]">) {
  const { id } = await props.params;
  const order = await getOrder(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="rounded-2xl border border-emerald-800/50 bg-emerald-950/30 p-6 text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-emerald-400">
          Order confirmed
        </p>
        <h1 className="mt-1 text-2xl font-bold text-neutral-50">Thank you for your order</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Order id: <span className="font-mono">{order.id}</span>
        </p>
      </div>

      <ul className="mt-6 flex flex-col gap-3" aria-label="Order items">
        {order.items.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-4 rounded-xl border border-neutral-800 bg-neutral-900 p-4"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- inline SVG data URI */}
            <img
              src={item.image}
              alt=""
              width={56}
              height={56}
              className="h-14 w-14 shrink-0 rounded-lg bg-neutral-800 object-cover"
            />
            <div className="flex-1">
              <p className="font-medium text-neutral-100">{item.name}</p>
              <p className="text-sm text-neutral-400">
                Size {item.size} · {item.color} · Qty {item.qty}
              </p>
            </div>
            <p className="font-medium text-neutral-100">{formatCurrency(item.price * item.qty)}</p>
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-900 p-5">
        <div className="flex justify-between text-neutral-300">
          <span>Subtotal</span>
          <span>{formatCurrency(order.subtotal)}</span>
        </div>
        {order.discountCode ? (
          <div className="mt-1 flex justify-between text-sm text-emerald-400">
            <span>
              Discount ({order.discountCode}, {Math.round((order.discountPercent ?? 0) * 100)}%)
            </span>
            <span>-{formatCurrency(order.subtotal - order.total)}</span>
          </div>
        ) : null}
        <div className="mt-2 flex justify-between border-t border-neutral-800 pt-2 text-lg font-semibold text-neutral-50">
          <span>Total</span>
          <span>{formatCurrency(order.total)}</span>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-neutral-500">
        Ask your agent: &ldquo;What&apos;s the status of order {order.id.slice(0, 8)}?&rdquo;
      </p>

      <div className="mt-4 text-center">
        <Link href="/" className="font-medium text-emerald-300 underline underline-offset-4 hover:text-emerald-200">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
