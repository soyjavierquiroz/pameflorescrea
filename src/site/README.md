# Site Boundary

`src/site/**` is the active site customization boundary for Pame Flores Crea.

## Files

- `dna.config.ts`: active site config with Pame Flores Crea identity and safe placeholder defaults.
- `current.ts`: official runtime export consumed by pages and components.

## Defaults

This child uses `Pame Flores Crea`, `PAME_FLORES_CREA`, `https://pameflorescrea.com`, generic product ids, and `/assets/funnel-placeholder.svg`.

## Clone Guidance

Replace site-specific copy, assets, tracking, checkout, capture, offer, event, and success behavior here when the real funnel is defined. Keep shared components generic unless a change belongs in the parent for all clones.
