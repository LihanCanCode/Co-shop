# CoShop — Progress Tracker

Project: Agent-native accessible storefront for the OpenAI WebMCP Challenge.
Full plan: see conversation / `velvety-gliding-scroll.md` plan file.

Legend: [ ] todo · [~] in progress · [x] done · [!] blocked/needs decision

## Day 1 — Scaffold
- [x] `create-next-app` (TS, Tailwind, App Router, ESLint) in project root
- [x] Seed product catalog data (`lib/catalog.ts`, 16 products across Shoes/Apparel)
- [x] Types (`types/index.ts`)
- [x] Browse/search page (`app/page.tsx`)
- [x] Product detail page (`app/product/[id]/page.tsx`)
- [x] Cart page (`app/cart/page.tsx`)
- [ ] Deploy empty/early skeleton to Vercel — **not done yet, do next**

## Day 2 — WebMCP Tools
- [x] Cookie-backed cart/order store (`lib/cart-cookie.ts`) — used cookies instead of the
      originally-planned in-memory store, since Vercel functions are stateless per-invocation
      and an in-memory store wouldn't survive between calls in production
- [x] API routes: cart (get/add/remove), discount, checkout, order status
- [x] `WebMCPTools.tsx` registering tools (via `use-webmcp-tool`'s `useWebMCP` hook)
- [x] Tool: `search_products`
- [x] Tool: `filter_products`
- [x] Tool: `get_product_details`
- [x] Tool: `add_to_cart`
- [x] Tool: `view_cart`
- [x] Tool: `remove_from_cart`
- [x] Tool: `checkout`
- [x] Manually tested full flow via curl (add to cart → discount → checkout → order) — all correct
- [ ] Test end-to-end in Chrome with `chrome://flags/#enable-webmcp-testing` (real agent call, not curl)

## Day 3 — Sync + Checkout + Accessibility
- [x] Real-time cart sync — implemented via shared Zustand store (`store/cart-store.ts`): both
      the UI and WebMCP tool `execute()` calls hit the same store actions, so a tool call
      re-renders the UI instantly with no polling/SSE needed
- [x] `ToolActivityToast` showing "agent just called X" (aria-live, doubles as a11y feature)
- [x] Checkout flow + order confirmation page (`app/orders/[id]/page.tsx`)
- [x] Accessibility pass: ARIA labels, aria-live regions, skip-to-content, focus-visible states,
      semantic HTML across browse/detail/cart/checkout — built in throughout, not yet audited
      with a screen reader

## Day 4 — Stretch + Polish
- [x] Stretch tool: `apply_discount_code` (codes: WEBMCP10, AGENT15)
- [x] Stretch tool: `get_order_status`
- [x] Stretch tool: `compare_products`
- [x] Error handling in tool execute()/API routes (bad id, out of stock, empty cart, bad discount)
- [ ] README.md (setup + WebMCP explanation) — still default create-next-app content, **todo**
- [ ] LICENSE (MIT) — **todo**
- [ ] Devpost text description draft — **todo**

## Day 5 — Demo + Submission
- [ ] Record <3 min narrated demo video
- [ ] Finalize Devpost writeup (inspiration / what it does / how built / challenges / what's next)
- [ ] Full run-through in ChatGPT in-app browser against deployed Vercel URL
- [ ] `git init` + push to a public GitHub repo (license visible in About section — hard requirement)
- [ ] Buffer / bug fixes
- [ ] Submit on Devpost

## Decisions & Notes
- Project lives at `d:\Semester 3-2\DevHack\WebMCP` (already on D:, 104GB free — no drive changes needed)
- Checkout is mock/simulated payment, no real processor
- Session identity via httpOnly cookie, no auth/login (MVP scope)
- Static seeded catalog, no real inventory API
- Cart/order persistence redesigned from "in-memory store" (per original plan) to cookie-backed,
  for correctness on stateless serverless deployment (Vercel)
- Product images are deterministic inline SVG data URIs (no external image CDN) — removes a
  network-dependency risk from the live judged demo
- 10 WebMCP tools total (7 MVP + 3 stretch), all wired to the same API routes / store actions
  the UI itself uses — single source of truth, no logic duplication
- `npm run build` passes cleanly (TS + lint), full cart→checkout→order flow verified via curl
  against a running dev server

## Retarget — genuine collaboration + motion polish (2026-08-28)
The original "agent completes checkout autonomously" concept was too generic for
Creativity & Ambition — it's the default pattern every commerce WebMCP entry will submit,
and it's a weaker fit for the challenge brief's "interact, collaborate, and create together"
framing than a visible negotiation would be. Retargeted without a rebuild:
- [x] Store: `spotlight` (which DOM target should pulse) + `pendingCheckout` /
      `prepareCheckout` / `confirmCheckout` / `cancelCheckout` (`store/cart-store.ts`)
- [x] `SpotlightTarget` component — scrolls into view + pulses when a tool call points at it
- [x] Wired spotlight into product cards, cart line items, discount/summary box
- [x] `checkout` tool now stages the order and requires human confirmation instead of
      completing it directly; new `cancel_checkout` tool lets the agent withdraw it
- [x] `CheckoutConfirmBar` — global banner, only a human click can complete an
      agent-proposed order; the human's own Checkout button is unaffected (no self-confirm)
- [x] Framer Motion pass: staggered product grid entrance, card hover/tap, animated cart
      item add/remove, cart-badge pop, upgraded activity toast (newest = "caption")
- [x] Product placeholder art upgraded to gradient + layered shapes (still deterministic
      inline SVG, no external image dependency)
- [x] `npm run build` passes; order-confirm API flow re-verified via curl after the change

## Current Status
**Now doing:** Retarget complete and build-verified. Still need a real browser pass to see
the spotlight/confirm-bar animations in action (curl can't exercise client-side Zustand
state), then: deploy to Vercel, real Chrome WebMCP-flag test, README/LICENSE/git init,
Devpost writeup.
