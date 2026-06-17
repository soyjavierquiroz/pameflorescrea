# Tracking Audit

Status: Pame Flores Crea initial placeholder baseline.

## Current Behavior

- Versioned `VITE_SITE_ID` is `PAME_FLORES_CREA`.
- Browser pixels are disabled because `VITE_META_PIXEL_ID` and `VITE_TIKTOK_PIXEL_ID` are empty.
- Server-side event relay is disabled because `VITE_CAPI_RELAY_URL` is empty.
- Microsoft Clarity is disabled because `VITE_CLARITY_PROJECT_ID` is empty.
- Capture relay settings are controlled by server `CAPTURE_*` variables.
- `VITE_ADS_ROUTE_PREFIX` is `/x9m`.
- Funnel context storage uses `funnel_context_v1`.
- The initial app renders only the preparation placeholder at `/` and `/x9m`.

## Shared Tracking Rules

`src/core/attribution` remains the canonical source for traffic channel, attribution source, paid platform, click IDs, UTMs, landing path, current path, and ads tracking eligibility.

Meta Pixel, TikTok Pixel, and CAPI relay are route-gated by `VITE_ADS_ROUTE_PREFIX` and also require their own IDs/endpoints. With the current empty env values, tracking stays inactive.

## Launch Requirements

Before any funnel launch, this child must set its own pixel ids, relay URL, allowed origins, capture destination, and test payloads. No production tracking identity is active in this baseline.

## Repository Origin

This repo was created from the parent repository tag `boilerplate-clean-v2-20260617`, not from another child. Future assets should live in a child namespace under `public/assets`.
