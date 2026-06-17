# Architecture

This repository is the `pameflorescrea.com` child site, created from the parent funnel boilerplate tag `boilerplate-clean-v2-20260617`.

Runtime code reads the active site through `src/site/current.ts`, which re-exports from `src/site/dna.config.ts`.

## Boundaries

- `src/App.tsx`: initial public routes. `/` and `/x9m` render the preparation placeholder without importing funnel themes.
- `src/main.tsx`: mounts the placeholder app and initializes Clarity only when `VITE_CLARITY_PROJECT_ID` is set. Visitor enrichment is intentionally not mounted until a real funnel needs it.
- `src/site/dna.config.ts`: Pame Flores Crea identity, domain, site id, placeholder defaults, tracking defaults, capture settings, and future funnel config.
- `src/site/current.ts`: official import boundary for pages and components.
- `src/core/attribution`: pure traffic attribution resolver plus browser storage adapter.
- `src/core/services/analytics.ts`: browser pixel and CAPI helper. It remains available but is inactive without Pixel/CAPI env values and without a launched funnel surface.
- `src/core/routing/adsRoute.ts`: normalizes `VITE_ADS_ROUTE_PREFIX` and composes ads route paths.
- `src/site/funnel/funnelContext.ts`: generic handoff context stored under `VITE_FUNNEL_CONTEXT_STORAGE_KEY` or `funnel_context_v1`.
- `src/site/tracking/clarity.ts`: Microsoft Clarity loader gated by `VITE_CLARITY_PROJECT_ID`.
- `public/assets/funnel-placeholder.svg`: neutral default asset kept until Pame Flores Crea receives owned media.
- `public/capture.php`: generic capture relay configured with `CAPTURE_*` server env only.

## Operational Shape

The initial deploy renders a preparation placeholder only. No sales landing, checkout, Pixel, CAPI, or funnel has been configured yet.

Ads and organic pages can share visual routes, but ads routes are separated with `VITE_ADS_ROUTE_PREFIX`. The current prefix is `/x9m`.

Traffic attribution remains available in shared core code. Meta Pixel, TikTok Pixel, and CAPI relay must stay disabled until the site has clone-owned IDs and endpoints.

## Origin

This child was started from `git@github.com:soyjavierquiroz/funnel-boilerplate.git`, not from another child site.

Child-owned assets should use a `public/assets/pame-flores-crea/` namespace when added. Keep secrets in `.env.local` or server-only env, never in versioned browser env.
