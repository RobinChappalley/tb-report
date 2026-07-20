# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Headless Next.js 13 frontend for **Luxury Tribune**. Content is authored in a separate WordPress backend (`content.luxurytribune.com`) and consumed here via WPGraphQL. Subscriptions/payments are handled through the WooCommerce REST API and Stripe.

Production: https://www.luxurytribune.com — Staging: dev branch → Vercel preview.

## Commands

```bash
yarn dev                  # Next dev server
yarn build && yarn start  # Production build & serve
yarn clean                # Remove .next and node_modules/.cache

yarn lint:js              # ESLint (airbnb + prettier), --max-warnings=0
yarn lint:css             # Stylelint on .css / .scss / .styles.js(x)

yarn test:unit            # Jest
yarn test:unit:dev        # Jest watch
yarn test:unit -- path/to/file.spec.js   # single file
yarn test:unit -- -t "name"              # single test by name
```

Node `>=22` (per `package.json`; the README's "Node 14" line is stale). Husky pre-commit runs lint-staged → eslint + stylelint on staged files. Changelog is managed by [`chan`](https://github.com/geut/chan); release prefix is empty (see `.chanrc`).

## Architecture

### Pages router with French/English mirroring
This app uses the **Next.js pages router** (`src/pages/`), not the app router — with one exception (see API routes below). French is the default locale and lives at the root (`/sabonner`, `/a-propos`); English lives under `/en/` (`/en/subscribe`, `/en/about`). `src/locales/languages.js` sets `defaultLng = 'fr'`. `_app.js` calls `i18next.changeLanguage(getLang(asPath))` on every route change; UI strings are in `src/locales/messages.{fr,en}.json`.

Many pages have hardcoded content alongside WP-sourced content; the list of these specially-templated pages lives in `src/config/config.js → specificPages`. Keep both FR and EN routes in sync when adding/editing them.

### Two API clients (don't confuse them)
- **`src/client/client.js`** — POSTs GraphQL queries directly to the WordPress backend (`NEXT_PUBLIC_BASE_API_URL/wp/graphql`). Queries live in `src/client/queries/`. Used for content (posts, pages, authors, events, site config, login/preview).
- **`src/client/wooCommerceClient.js`** — POSTs to **our own** `/api/*` Next routes (`NEXT_PUBLIC_FRONTEND_API_URL/api/...`). These internal routes proxy to Stripe and WooCommerce so secret keys stay server-side.

### API routes use the App Router (mixed routing)
Internal API endpoints live in **`src/app/api/<name>/route.js`** (App Router) even though pages use the pages router. When adding a new server endpoint, follow this pattern (`export async function POST(req)` in `route.js`) — do not add it under `src/pages/api/`.

Each route is a thin wrapper that authenticates (`utils/getOAuthHeader` for WooCommerce, `stripeSecretKey` for Stripe) and calls the upstream API. The set of routes is roughly: `createCustomer`, `getCustomer`, `createSubscription`, `updateSubscription`, `listSubscriptionCustomer`, `getCoupon`, `deleteCoupon`, `products`, `createStripeCustomer`, `getStripeCustomer`, `createStripeSource`, `updateStripeCustomerDefaultSource`, `wordpress-sitemap`.

### Subscription flow
The subscription form (`src/components/SubscriptionForm/Subscription.jsx → onSubmit()`) drives a multi-step orchestration across the API routes above. There are **two distinct branches** — *signup* (new account) and *login/renewal* (existing account) — that call different sequences of routes. See `docs/subscription-flows.md` for the full diagram and `KNOWN_BUGS.md` for live bugs in the login branch (notably: `firstName`/`lastName` undefined when creating a Stripe customer; `stripeSourceId` never assigned so payment details aren't attached). Treat `KNOWN_BUGS.md` as a TODO list rather than historical context.

### WordPress block rendering & paywall
Post/page bodies come back from WPGraphQL as an array of blocks (Gutenberg + custom ACF blocks). `src/utils/resolveBlocksComponents.js` maps `block.name` → React component using the registry in `src/config/config.js → wpBlocks`. This file also enforces:
- **Paywall truncation** — if the user has no subscription and isn't a search-engine bot or in preview mode, blocks after `acf/paywall` are sliced off (`.slice(0, paywallIndex)`).
- **Block dedup** — strips `core/button` blocks nearby a `core/buttons`, and standalone `core/image` blocks that duplicate images already in a nearby `core/gallery`.

When adding a new block type: register it in `wpBlocks` (config), create the component under `src/components/blocks/<Name>/`, add it to the `components` map in `resolveBlocksComponents.js`, and import its `.styles.css` from `src/pages/_app.js` (styles aren't auto-loaded).

### Site config & data fetching
`_app.js` fetches `getSiteConfig()` once on mount and exposes it (plus `alertMessage`, `translations`) through `SiteConfigContext`. React Query (TanStack v4) is wired up with `refetchOnMount: false` / `refetchOnWindowFocus: false` defaults — pages typically prefetch on the server (`utils/prefetch.js`) and dehydrate into `pageProps.dehydratedState`. Per-resource hooks live in `src/hooks/use*.js`.

### Imports
Webpack `resolve.modules` includes `src/` (see `next.config.js`), so prefer absolute imports: `components/...`, `client/...`, `utils/...`, `hooks/...`, `config/...`, `contexts/...`, `services/...`, `locales/...`, `assets/...`, `styles/...`. ESLint enforces an explicit `simple-import-sort` grouping that mirrors these prefixes — don't reorder by hand.

### Styling
Tailwind + a handful of per-component `.styles.css` files registered in `_app.js`. Emotion is in the dependency tree from the original setup but the codebase is mostly Tailwind + plain CSS now. SVG imports go through `@svgr/webpack` (so `import Logo from '…svg'` gives a React component).

## Environment

Required vars (see `.env.sample`):

- `NEXT_PUBLIC_BASE_API_URL` — WordPress backend root (GraphQL at `/wp/graphql`, WooCommerce at `/wp-json/wc`)
- `NEXT_PUBLIC_FRONTEND_API_URL` — this app's own origin; used by `wooCommerceClient.js` to call the internal `/api/*` routes (set to `http://localhost:3000` in dev)
- `NEXT_PUBLIC_CONSUMER_KEY` / `NEXT_SECRET_CONSUMER_KEY` — WooCommerce OAuth
- `NEXT_PUBLIC_STRIPE_KEY` / `NEXT_SECRET_STRIPE_KEY` — Stripe
- `NEXT_PUBLIC_GOOGLE_TAG_MANAGER`

## Deployment

Vercel auto-deploys: `dev` branch → staging, `master` → production. PRs target `dev`; promotion to `master` is via a release PR. `vercel.json` and `.vercel/` hold the integration config.
