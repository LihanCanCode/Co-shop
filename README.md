# CoShop

A storefront built for the **OpenAI WebMCP Challenge** — where a shopper and their
AI agent browse, compare, and check out in the *same session*, watching each
other work.

Most agentic-commerce demos are one of two things: a static catalog with a
chat widget bolted on, or an agent that silently completes a purchase while
the human watches a spinner. CoShop is neither. Every WebMCP tool call is
grounded live in the UI — the exact product card or cart line the agent just
touched scrolls into view and pulses — and the one truly consequential action,
placing an order, is never completed by the agent alone. The agent can
**prepare** a checkout and even **withdraw** it, but only the human can
**confirm** it, via a live banner that appears wherever they're standing in
the app. It's the difference between an agent that acts *on* the storefront
and an agent that acts *with* you in it.

## Why this matters

Real agentic checkout — the kind merchants will actually ship — needs a human
sign-off gate for the same reason two-factor auth exists: an agent should be
able to do the tedious 90% (search, compare, fill the cart, apply the code)
autonomously, but the "place a real order with real money" step is exactly
where you want a deliberate, visible human decision. CoShop's confirm/decline
mechanic is a small, concrete model of that — not a toy restriction, but the
shape a production agentic-checkout flow would actually need.

## What's built

- **16-item product catalog** across Shoes and Apparel, browsable and
  searchable by a human or an agent identically.
- **11 WebMCP tools**, registered via `document.modelContext` and backed by
  the same API routes and shared state the human-facing UI uses — an agent
  and a person are never working off two different sources of truth:
  - `search_products`, `filter_products`, `get_product_details`,
    `compare_products` — read-only discovery tools.
  - `add_to_cart`, `remove_from_cart`, `view_cart`, `apply_discount_code` —
    cart mutation, fully autonomous.
  - `checkout` — **stages** an order and hands it to the shopper; does not
    place it.
  - `cancel_checkout` — lets the agent withdraw a checkout it staged.
  - `get_order_status` — look up a placed order.
- **Live agent grounding.** Every tool call that touches something on screen
  (a product card, a cart line, the discount box) scrolls it into view and
  pulses it, so "the agent just did something" is never just a toast — you
  can see exactly what.
- **Human-in-the-loop checkout.** When the agent calls `checkout`, a
  confirmation banner appears globally, on whatever page the shopper is on,
  with the order total and two buttons only a human can click: confirm or
  decline. The shopper's own manual "Checkout" button in the cart is
  unaffected — the gate exists specifically for the agent → human handoff.
- **A visible activity log** (`aria-live`, styled as captions) narrating every
  tool call in order — both a demo aid and a genuine accessibility feature: a
  non-visual user gets the same "I can see what the agent is doing" signal a
  sighted user gets from watching the UI move.
- **Accessible by default** — semantic HTML, ARIA labels, skip-to-content,
  visible focus states, and live regions throughout, not bolted on after.
- **Deterministic offline product art** — gradient SVGs generated from each
  product's id, so the storefront has zero external image dependency (nothing
  that can fail to load during a live demo).
- **Framer Motion throughout** — staggered catalog entrance, card hover/tap,
  animated cart add/remove, and a cart badge that pops on change.

## Tech stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- [`use-webmcp-tool`](https://www.npmjs.com/package/use-webmcp-tool) for
  `document.modelContext` tool registration
- Zustand for shared cart/UI state (used by both the React UI and the WebMCP
  tools' `execute()` calls — one store, one source of truth)
- Framer Motion for animation
- Cookie-backed cart/order storage (no database) — correct for a stateless
  serverless deployment, and enough for a demo-scale catalog

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No environment
variables or external services are required — the catalog is seeded in code
and cart/order state lives in an httpOnly cookie per session.

To exercise the WebMCP tools with a real agent rather than the UI:

- **Chrome**: enable `chrome://flags/#enable-webmcp-testing`, then use an
  agent-driven browsing surface that speaks WebMCP against the running app.
- **ChatGPT's in-app browser** (or any other WebMCP-aware agent client):
  navigate it to the deployed URL and ask it to shop — e.g. *"find me a
  waterproof running shoe under $120, add it to my cart, and check out."*
  Watch it stage the order, then confirm it yourself in the UI.

## Project structure

```
app/                 Routes: browse, product detail, cart, order confirmation
components/          UI components + WebMCPTools.tsx (all tool registrations)
store/cart-store.ts  Shared Zustand store — cart, spotlight, pending checkout
lib/                 Catalog data, formatting helpers, placeholder art, cookie cart
app/api/             Cart, discount, checkout, and order-status routes
```

## License

MIT — see [LICENSE](./LICENSE).
