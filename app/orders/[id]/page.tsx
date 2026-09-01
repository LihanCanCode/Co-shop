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
      <div
        className="relative overflow-hidden rounded-2xl p-6 text-center"
        style={{
          background: "rgba(24, 24, 40, 0.70)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "1px solid rgb(6 182 212 / 0.35)",
          boxShadow: "0 0 40px rgba(6,182,212,0.12)",
        }}
      >
        {/* Top cyan accent line */}
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(6,182,212,0.7), transparent)",
          }}
        />
        <p
          className="text-sm font-bold uppercase tracking-widest"
          style={{ color: "#22d3ee" }}
        >
          Order confirmed
        </p>
        <h1 className="mt-2 text-2xl font-black text-cs-text-primary">
          Thank you for your order
        </h1>
        <p className="mt-2 text-sm text-cs-text-secondary">
          Order id: <span className="font-mono text-cs-text-primary">{order.id}</span>
        </p>
      </div>

      <ul className="mt-8 flex flex-col gap-3" aria-label="Order items">
        {order.items.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-4 rounded-2xl p-4"
            style={{
              background: "rgba(24, 24, 40, 0.60)",
              border: "1px solid var(--cs-border)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- inline SVG data URI */}
            <img
              src={item.image}
              alt=""
              width={56}
              height={56}
              className="h-14 w-14 shrink-0 rounded-xl object-cover"
              style={{ background: "rgba(24,24,40,0.8)" }}
            />
            <div className="flex-1">
              <p className="font-semibold text-cs-text-primary">{item.name}</p>
              <p className="mt-0.5 text-sm text-cs-text-secondary">
                Size {item.size} · {item.color} · Qty {item.qty}
              </p>
            </div>
            <p
              className="font-bold tabular-nums"
              style={{ color: "#f59e0b" }}
            >
              {formatCurrency(item.price * item.qty)}
            </p>
          </li>
        ))}
      </ul>

      <div
        className="mt-6 rounded-2xl p-5"
        style={{
          background: "rgba(24, 24, 40, 0.60)",
          border: "1px solid var(--cs-border)",
        }}
      >
        <div className="flex justify-between text-cs-text-secondary">
          <span>Subtotal</span>
          <span className="tabular-nums">{formatCurrency(order.subtotal)}</span>
        </div>
        {order.discountCode ? (
          <div
            className="mt-1.5 flex justify-between text-sm font-semibold"
            style={{ color: "#22d3ee" }}
          >
            <span>
              Discount ({order.discountCode},{" "}
              {Math.round((order.discountPercent ?? 0) * 100)}%)
            </span>
            <span className="tabular-nums">
              -{formatCurrency(order.subtotal - order.total)}
            </span>
          </div>
        ) : null}
        <div
          className="mt-3 flex justify-between border-t pt-3 text-lg font-black text-cs-text-primary"
          style={{ borderColor: "var(--cs-border)" }}
        >
          <span>Total</span>
          <span className="tabular-nums" style={{ color: "#f59e0b" }}>
            {formatCurrency(order.total)}
          </span>
        </div>
      </div>

      <p className="mt-8 text-center text-sm font-medium text-cs-text-muted">
        Ask your agent: &ldquo;What&apos;s the status of order{" "}
        {order.id.slice(0, 8)}?&rdquo;
      </p>

      <div className="mt-4 text-center">
        <Link
          href="/"
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-cs-accent-light transition-colors hover:text-white"
        >
          <span className="transition-transform group-hover:-translate-x-1 inline-block">←</span>
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
