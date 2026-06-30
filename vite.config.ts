import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const defaultHtmlEnv = {
  VITE_DOMAIN: 'pameflorescrea.com',
  VITE_SITE_TITLE: 'Pame Flores Crea - Sitio en preparacion',
  VITE_SITE_DESCRIPTION: 'Sitio oficial de Pame Flores Crea en preparacion.',
  VITE_SOCIAL_IMAGE: 'https://pameflorescrea.com/assets/funnel-placeholder.svg',
};

function htmlEnvPlugin(mode: string) {
  const env: Record<string, string> = { ...defaultHtmlEnv, ...loadEnv(mode, process.cwd(), 'VITE_') };

  return {
    name: 'html-env-defaults',
    transformIndexHtml(html: string) {
      return html.replace(/__VITE_[A-Z0-9_]+__/g, (token) => {
        const key = token.slice(2, -2);
        return env[key] ?? '';
      });
    },
  };
}

function injectRouteMetadata(
  html: string,
  title: string,
  description: string,
  assetCheck?: string,
  robots?: string,
): string {
  const metadata = [
    `    <title>${title}</title>`,
    `    <meta name="description" content="${description}" />`,
    `    <meta name="robots" content="${robots ?? 'index, follow'}" />`,
    `    <meta name="x-route-content-check" content="${description}" />`,
    assetCheck ? `    <meta name="x-route-asset-check" content="${assetCheck}" />` : '',
  ]
    .filter(Boolean)
    .join('\n');

  return html
    .replace(/ {4}<title>.*<\/title>\n?/g, '')
    .replace(/ {4}<meta name="description" content="[^"]*" \/>\n?/g, '')
    .replace(/ {4}<meta name="robots" content="[^"]*" \/>\n?/g, '')
    .replace(/ {4}<meta name="x-route-content-check" content="[^"]*" \/>\n?/g, '')
    .replace(/ {4}<meta name="x-route-asset-check" content="[^"]*" \/>\n?/g, '')
    .replace('</head>', `${metadata}\n  </head>`);
}

function staticAdsEntryPlugin(mode: string) {
  const env: Record<string, string> = { ...defaultHtmlEnv, ...loadEnv(mode, process.cwd(), 'VITE_') };
  const rawPrefix = env.VITE_ADS_ROUTE_PREFIX?.trim() || '/x9m';
  const adsPrefix = rawPrefix.replace(/^\/+/, '').replace(/\/+$/, '');

  return {
    name: 'static-ads-entry',
    closeBundle() {
      const sourcePath = join(process.cwd(), 'dist', 'index.html');
      const baseHtml = readFileSync(sourcePath, 'utf8');
      const landingTitle = 'Semana del Emprendimiento con Juguetes Creativos';
      const landingDescription =
        'SEMANA DEL EMPRENDIMIENTO CON JUGUETES CREATIVOS - Descubre cómo generar desde 500 dólares extras al mes con Juguetes Creativos. Es tu momento de construir un proyecto propio que transforme tu amor por los niños y tu creatividad en una fuente de ingresos real haciendo algo que disfrutas. ¡Hola, soy Pame Flores! Academia de Juguetería Creativa. QUIERO REGISTRARME GRATIS.';
      const landingAssetCheck =
        '/assets/pame-flores-crea/500-extra/hero-pame-creativa.webp?v=20260617-hero2';
      const confirmationTitle = 'Registro recibido - Juguetes Creativos';
      const confirmationDescription =
        'Registro recibido para la Semana del Emprendimiento con Juguetes Creativos por WhatsApp. Te llevaremos automáticamente al grupo de WhatsApp en 5 segundos.';
      const temporaryOfferTitle =
        'Certificación de Juguetería Creativa Profesional | Pame Flores Crea';
      const temporaryOfferDescription =
        'Descubre la manera más simple y rápida de generar ingresos extras con Juguetes Creativos en solo 9 semanas. Quiero inscribirme ahora en la Certificación de Juguetería Creativa Profesional por 197 USD. Checkout: https://crm.pameflorescrea.com/pagos. Soporte para Ecuador por WhatsApp.';
      const temporaryOfferAssetCheck =
        '/assets/pame-flores-crea/oferta/hero-certificacion.webp';
      const classOneTitle = 'Clase 1 | Pame Flores Crea';
      const classOneDescription = 'Redirigiendo a la Clase 1 de Pame Flores Crea.';
      writeFileSync(
        sourcePath,
        injectRouteMetadata(baseHtml, landingTitle, landingDescription, landingAssetCheck),
      );
      const staticEntries = [
        {
          path: '500-extra',
          html: injectRouteMetadata(baseHtml, landingTitle, landingDescription, landingAssetCheck),
        },
        {
          path: 'confirmacion/500-extra',
          html: injectRouteMetadata(baseHtml, confirmationTitle, confirmationDescription),
        },
        {
          path: 'temporal',
          html: injectRouteMetadata(
            baseHtml,
            temporaryOfferTitle,
            temporaryOfferDescription,
            temporaryOfferAssetCheck,
            'noindex, nofollow',
          ),
        },
        {
          path: 'clase1',
          html: injectRouteMetadata(
            baseHtml,
            classOneTitle,
            classOneDescription,
            undefined,
            'noindex, nofollow',
          ),
        },
      ];

      if (adsPrefix && adsPrefix !== '.') {
        staticEntries.push(
          {
            path: adsPrefix,
            html: baseHtml,
          },
          {
            path: `${adsPrefix}/500-extra`,
            html: injectRouteMetadata(
              baseHtml,
              landingTitle,
              landingDescription,
              landingAssetCheck,
            ),
          },
          {
            path: `${adsPrefix}/confirmacion/500-extra`,
            html: injectRouteMetadata(baseHtml, confirmationTitle, confirmationDescription),
          },
          {
            path: `${adsPrefix}/temporal`,
            html: injectRouteMetadata(
              baseHtml,
              temporaryOfferTitle,
              temporaryOfferDescription,
              temporaryOfferAssetCheck,
              'noindex, nofollow',
            ),
          },
          {
            path: `${adsPrefix}/clase1`,
            html: injectRouteMetadata(
              baseHtml,
              classOneTitle,
              classOneDescription,
              undefined,
              'noindex, nofollow',
            ),
          },
        );
      }

      for (const entry of staticEntries) {
        const entryPath = entry.path;
        const targetPath = join(process.cwd(), 'dist', entryPath, 'index.html');

        mkdirSync(dirname(targetPath), { recursive: true });
        writeFileSync(targetPath, entry.html);
      }

      rmSync(join(process.cwd(), 'dist', 'capture.php'), { force: true });
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), htmlEnvPlugin(mode), staticAdsEntryPlugin(mode)],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
}));
