import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
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

function injectRouteMetadata(html: string, title: string, description: string): string {
  const metadata = [
    `    <title>${title}</title>`,
    `    <meta name="description" content="${description}" />`,
    `    <meta name="x-route-content-check" content="${description}" />`,
  ].join('\n');

  return html
    .replace(/ {4}<title>.*<\/title>\n?/g, '')
    .replace(/ {4}<meta name="description" content="[^"]*" \/>\n?/g, '')
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
        'SEMANA DEL EMPRENDIMIENTO CON JUGUETES CREATIVOS - Descubre cómo generar desde 500 dólares extras al mes con Juguetes Creativos. QUIERO REGISTRARME GRATIS.';
      const confirmationTitle = 'Registro recibido - Juguetes Creativos';
      const confirmationDescription =
        'Registro recibido para la Semana del Emprendimiento con Juguetes Creativos por WhatsApp. Te llevaremos automáticamente al grupo de WhatsApp en 5 segundos.';
      const staticEntries = [
        {
          path: '500-extra',
          html: injectRouteMetadata(baseHtml, landingTitle, landingDescription),
        },
        {
          path: 'confirmacion/500-extra',
          html: injectRouteMetadata(baseHtml, confirmationTitle, confirmationDescription),
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
            html: injectRouteMetadata(baseHtml, landingTitle, landingDescription),
          },
          {
            path: `${adsPrefix}/confirmacion/500-extra`,
            html: injectRouteMetadata(baseHtml, confirmationTitle, confirmationDescription),
          },
        );
      }

      for (const entry of staticEntries) {
        const entryPath = entry.path;
        const targetPath = join(process.cwd(), 'dist', entryPath, 'index.html');

        mkdirSync(dirname(targetPath), { recursive: true });
        writeFileSync(targetPath, entry.html);
      }
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), htmlEnvPlugin(mode), staticAdsEntryPlugin(mode)],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
}));
