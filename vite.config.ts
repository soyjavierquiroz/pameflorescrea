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

function staticAdsEntryPlugin(mode: string) {
  const env: Record<string, string> = { ...defaultHtmlEnv, ...loadEnv(mode, process.cwd(), 'VITE_') };
  const rawPrefix = env.VITE_ADS_ROUTE_PREFIX?.trim() || '/x9m';
  const adsPrefix = rawPrefix.replace(/^\/+/, '').replace(/\/+$/, '');

  return {
    name: 'static-ads-entry',
    closeBundle() {
      if (!adsPrefix || adsPrefix === '.') {
        return;
      }

      const sourcePath = join(process.cwd(), 'dist', 'index.html');
      const targetPath = join(process.cwd(), 'dist', adsPrefix);

      mkdirSync(dirname(targetPath), { recursive: true });
      writeFileSync(targetPath, readFileSync(sourcePath, 'utf8'));
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), htmlEnvPlugin(mode), staticAdsEntryPlugin(mode)],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
}));
