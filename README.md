# Pame Flores Crea

Sitio hijo limpio para `pameflorescrea.com`, creado desde el boilerplate padre `funnel-boilerplate` en el tag `boilerplate-clean-v2-20260617`.

## Estado Inicial

- Site name: `Pame Flores Crea`.
- Domain: `https://pameflorescrea.com`.
- Site id: `PAME_FLORES_CREA`.
- Ads route prefix: `/x9m`.
- Public root: `/home/pameflorescrea.com/public_html`.
- Source: `/home/pameflorescrea.com/source`.
- Default asset: `public/assets/funnel-placeholder.svg`.

La primera publicacion renderiza un placeholder profesional en:

- `/`: `Pame Flores Crea` / `Sitio en preparacion`.
- `/x9m`: el mismo placeholder, manteniendo viva la ruta de ads sin lanzar un funnel.

No hay landing de venta, checkout, Pixel, CAPI ni funnel configurados todavia.

## Repositorio

- `origin`: `git@github.com:soyjavierquiroz/pameflorescrea.git`
- `upstream`: `git@github.com:soyjavierquiroz/funnel-boilerplate.git`
- Branch: `pameflorescrea`

Este hijo fue creado desde el boilerplate padre, no desde otro sitio hijo.

## Superficie Del Sitio

- `.env`: valores publicos versionados sin secretos.
- `src/site/dna.config.ts`: identidad, dominio, site id y defaults del sitio.
- `src/site/current.ts`: frontera oficial de importacion del sitio.
- `public/capture.php`: relay generico configurado solo con variables server-side `CAPTURE_*`.
- `public/assets/**`: assets publicos. Los assets futuros del sitio deben vivir bajo `public/assets/pame-flores-crea/`.

## Validacion

Antes de publicar cambios:

```bash
npm test
php -l public/capture.php
npm run typecheck
npm run lint
npm run build
git diff --check
```

Verificar que `/` y `/x9m` respondan `200`.
