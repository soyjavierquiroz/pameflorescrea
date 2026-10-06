import { isAdsRoutePath } from '../../core/routing/adsRoute';

export const WHATSAPP_REDIRECT_DELAY_MS = 5000;

function readPublicEnvValue(key: string): string {
  const env = import.meta.env as Record<string, string | undefined>;
  return env[key]?.trim() ?? '';
}

export function getCampaignWhatsAppUrl(pathname: string): string {
  const specificWhatsAppUrl = isAdsRoutePath(pathname)
    ? readPublicEnvValue('VITE_WHATSAPP_GROUP_URL_ADS')
    : readPublicEnvValue('VITE_WHATSAPP_GROUP_URL_ORGANIC');
  return specificWhatsAppUrl || readPublicEnvValue('VITE_WHATSAPP_GROUP_URL');
}

export function shouldAutoRedirectToWhatsApp(whatsappUrl: string): boolean {
  return whatsappUrl.trim().length > 0;
}

export function scheduleWhatsAppRedirect(
  browserWindow: Pick<Window, 'clearTimeout' | 'setTimeout'> & {
    location: Pick<Location, 'assign'>;
  },
  whatsappUrl: string,
): () => void {
  const redirectTimer = browserWindow.setTimeout(() => {
    browserWindow.location.assign(whatsappUrl);
  }, WHATSAPP_REDIRECT_DELAY_MS);
  return () => browserWindow.clearTimeout(redirectTimer);
}
