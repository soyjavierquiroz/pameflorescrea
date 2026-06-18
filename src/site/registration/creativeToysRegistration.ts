import type { AttributionEventFields } from '../../core/services/analytics';
import { buildAttributionEventFields } from '../../core/services/analytics';
import { isAdsRoutePath, withAdsRoutePrefix } from '../../core/routing/adsRoute';
import type { ResolvedAttribution, TrafficChannel } from '../../core/attribution';
import type { VisitorPayload } from '../../core/visitor/visitorPayload';

export const CREATIVE_TOYS_REGISTRATION_KEY = 'pame_500_extra_registration_v1';
export const CREATIVE_TOYS_PENDING_CONVERSION_KEY = 'pame_500_extra_pending_conversion_v1';
export const CREATIVE_TOYS_LANDING_SLUG = '500-extra';
export const CREATIVE_TOYS_COMPLETE_REGISTRATION_EVENT_NAME = 'CompleteRegistration';
export const CREATIVE_TOYS_EVENT_NAME = 'SEMANA DEL EMPRENDIMIENTO CON JUGUETES CREATIVOS';
export const CREATIVE_TOYS_SOURCE = 'pameflorescrea.com';
export const CREATIVE_TOYS_ORGANIC_LANDING_PATH = '/500-extra';
export const CREATIVE_TOYS_ORGANIC_CONFIRMATION_PATH = '/confirmacion/500-extra';
export const CREATIVE_TOYS_WHATSAPP_REDIRECT_DELAY_MS = 5000;

export const CREATIVE_TOYS_ASSETS = {
  hero: '/assets/pame-flores-crea/500-extra/hero-pame-creativa.webp?v=20260617-hero2',
  heroFallback: '/assets/pame-flores-crea/500-extra/hero-pame-juguete.webp',
  toys: '/assets/pame-flores-crea/500-extra/pame-vip-creativa.webp',
  portrait: '/assets/pame-flores-crea/500-extra/familia-pame.jpg',
  portraitFallback: '/assets/pame-flores-crea/500-extra/pame-flores.webp',
  logo: '/assets/pame-flores-crea/500-extra/logo-pame-flores-crea.png',
  legacyLogo: '/assets/pame-flores-crea/500-extra/logo-pame-flores-crea.webp',
  classImages: [
    '/assets/pame-flores-crea/500-extra/classes/class-1.webp',
    '/assets/pame-flores-crea/500-extra/classes/class-2.webp',
    '/assets/pame-flores-crea/500-extra/classes/class-3.webp',
    '/assets/pame-flores-crea/500-extra/classes/class-4.webp',
  ],
  galleryImages: [
    '/assets/pame-flores-crea/500-extra/gallery/gallery-01.jpg',
    '/assets/pame-flores-crea/500-extra/gallery/gallery-02.jpg',
    '/assets/pame-flores-crea/500-extra/gallery/gallery-03.jpg',
    '/assets/pame-flores-crea/500-extra/gallery/gallery-04.jpg',
    '/assets/pame-flores-crea/500-extra/gallery/gallery-05.jpg',
    '/assets/pame-flores-crea/500-extra/gallery/gallery-06.jpg',
    '/assets/pame-flores-crea/500-extra/gallery/gallery-07.jpg',
    '/assets/pame-flores-crea/500-extra/gallery/gallery-08.jpg',
    '/assets/pame-flores-crea/500-extra/gallery/gallery-09.jpg',
    '/assets/pame-flores-crea/500-extra/gallery/gallery-10.jpg',
  ],
} as const;

export interface CreativeToysFormValues {
  name: string;
  email: string;
}

export interface CreativeToysFormErrors {
  name?: string;
  email?: string;
}

export interface CreativeToysTrackingConfig {
  capiWebhookUrl?: string | null;
  metaPixelId?: string | null;
  tiktokPixelId?: string | null;
}

export interface CreativeToysRegistrationSnapshot {
  lead_name: string;
  lead_email: string;
  registered_at: string;
  source_path: string;
}

export interface CreativeToysPendingConversion {
  event_name: typeof CREATIVE_TOYS_COMPLETE_REGISTRATION_EVENT_NAME;
  event_id: string;
  lead_email: string;
  lead_name: string;
  source_path: string;
  confirmation_path: string;
  traffic_channel: 'ads';
  capture_ok_at: string;
  sent: boolean;
  sent_at?: string;
}

export interface BuildCreativeToysRegistrationPayloadInput {
  name: string;
  email: string;
  attribution: ResolvedAttribution;
  visitorPayload: VisitorPayload;
  pageUrl: string;
  currentPath: string;
  userAgent: string;
  submittedAt: string;
}

export interface CreativeToysRegistrationPayload
  extends VisitorPayload,
    AttributionEventFields {
  name: string;
  first_name: string;
  email: string;
  traffic_channel: TrafficChannel;
  capture_list_slug: typeof CREATIVE_TOYS_LANDING_SLUG;
  list: typeof CREATIVE_TOYS_LANDING_SLUG;
  landing_slug: typeof CREATIVE_TOYS_LANDING_SLUG;
  event_name: typeof CREATIVE_TOYS_EVENT_NAME;
  source: typeof CREATIVE_TOYS_SOURCE;
  page_url: string;
  current_path: string;
  landing_path: string;
  landing_path_target: string;
  confirmation_path: string;
  submitted_at: string;
  attribution: AttributionEventFields;
  user_agent: string;
}

export interface BuildCreativeToysPendingConversionInput {
  captureOk: boolean;
  confirmationPath: string;
  currentPath: string;
  email: string;
  eventId?: string;
  name: string;
  registeredAt: string;
}

function normalizeText(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

function readPublicEnvValue(key: string): string {
  const env = import.meta.env as Record<string, string | undefined>;

  return env[key]?.trim() ?? '';
}

export function isValidCreativeToysEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function validateCreativeToysForm(values: CreativeToysFormValues): CreativeToysFormErrors {
  const name = normalizeText(values.name);
  const email = values.email.trim();
  const errors: CreativeToysFormErrors = {};

  if (name.length < 2) {
    errors.name = 'Escribe tu nombre para poder registrarte.';
  }

  if (!email) {
    errors.email = 'Escribe tu correo para recibir el acceso.';
  } else if (!isValidCreativeToysEmail(email)) {
    errors.email = 'Revisa que tu correo tenga un formato válido.';
  }

  return errors;
}

export function getCreativeToysLandingPath(pathname: string): string {
  return isAdsRoutePath(pathname)
    ? withAdsRoutePrefix(CREATIVE_TOYS_ORGANIC_LANDING_PATH)
    : CREATIVE_TOYS_ORGANIC_LANDING_PATH;
}

export function getCreativeToysConfirmationPath(pathname: string): string {
  return isAdsRoutePath(pathname)
    ? withAdsRoutePrefix(CREATIVE_TOYS_ORGANIC_CONFIRMATION_PATH)
    : CREATIVE_TOYS_ORGANIC_CONFIRMATION_PATH;
}

export function getCreativeToysCaptureEndpoint(): string {
  const configuredEndpoint = import.meta.env.VITE_CAPTURE_WEBHOOK_URL?.trim();

  return configuredEndpoint || '/capture.php';
}

export function getCreativeToysWhatsAppUrl(pathname: string): string {
  const specificWhatsAppUrl = isAdsRoutePath(pathname)
    ? readPublicEnvValue('VITE_WHATSAPP_GROUP_URL_ADS')
    : readPublicEnvValue('VITE_WHATSAPP_GROUP_URL_ORGANIC');

  return specificWhatsAppUrl || readPublicEnvValue('VITE_WHATSAPP_GROUP_URL');
}

export function shouldAutoRedirectToCreativeToysWhatsApp(whatsappUrl: string): boolean {
  return whatsappUrl.trim().length > 0;
}

export function scheduleCreativeToysWhatsAppRedirect(
  browserWindow: Pick<Window, 'clearTimeout' | 'setTimeout'> & {
    location: Pick<Location, 'assign'>;
  },
  whatsappUrl: string,
): () => void {
  const redirectTimer = browserWindow.setTimeout(() => {
    browserWindow.location.assign(whatsappUrl);
  }, CREATIVE_TOYS_WHATSAPP_REDIRECT_DELAY_MS);

  return () => browserWindow.clearTimeout(redirectTimer);
}

export function isCreativeToysCaptureOk(
  responseOk: boolean,
  responseBody?: { ok?: unknown } | null,
): boolean {
  return responseOk && responseBody?.ok !== false;
}

export function getCreativeToysNavigationTargetAfterCapture(
  captureOk: boolean,
  currentPath: string,
): string | null {
  return captureOk ? getCreativeToysConfirmationPath(currentPath) : null;
}

export function buildCreativeToysRegistrationSnapshot(
  name: string,
  email: string,
  registeredAt: string,
  sourcePath: string,
): CreativeToysRegistrationSnapshot {
  return {
    lead_name: normalizeText(name),
    lead_email: email.trim().toLowerCase(),
    registered_at: registeredAt,
    source_path: sourcePath,
  };
}

export function createCreativeToysConversionEventId(): string {
  const suffix =
    typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.randomUUID === 'function'
      ? globalThis.crypto.randomUUID()
      : Math.random().toString(36).slice(2, 12);

  return `pame_500_extra_${Date.now()}_${suffix}`;
}

export function buildCreativeToysPendingConversion({
  captureOk,
  confirmationPath,
  currentPath,
  email,
  eventId,
  name,
  registeredAt,
}: BuildCreativeToysPendingConversionInput): CreativeToysPendingConversion | null {
  if (!captureOk || !isAdsRoutePath(currentPath)) {
    return null;
  }

  return {
    event_name: CREATIVE_TOYS_COMPLETE_REGISTRATION_EVENT_NAME,
    event_id: eventId?.trim() || createCreativeToysConversionEventId(),
    lead_email: email.trim().toLowerCase(),
    lead_name: normalizeText(name),
    source_path: currentPath,
    confirmation_path: confirmationPath,
    traffic_channel: 'ads',
    capture_ok_at: registeredAt,
    sent: false,
  };
}

export function isCreativeToysConfirmationPathForPendingConversion(
  pathname: string,
  pendingConversion: CreativeToysPendingConversion,
): boolean {
  return (
    pathname === pendingConversion.confirmation_path ||
    pathname.startsWith(withAdsRoutePrefix(CREATIVE_TOYS_ORGANIC_CONFIRMATION_PATH))
  );
}

export function buildCreativeToysRegistrationPayload({
  name,
  email,
  attribution,
  visitorPayload,
  pageUrl,
  currentPath,
  userAgent,
  submittedAt,
}: BuildCreativeToysRegistrationPayloadInput): CreativeToysRegistrationPayload {
  const normalizedName = normalizeText(name);
  const normalizedEmail = email.trim().toLowerCase();
  const attributionFields = buildAttributionEventFields(attribution);
  const confirmationPath = getCreativeToysConfirmationPath(currentPath);
  const trafficChannel: TrafficChannel = isAdsRoutePath(currentPath) ? 'ads' : 'organic';

  return {
    ...attributionFields,
    name: normalizedName,
    first_name: normalizedName,
    email: normalizedEmail,
    traffic_channel: trafficChannel,
    capture_list_slug: CREATIVE_TOYS_LANDING_SLUG,
    list: CREATIVE_TOYS_LANDING_SLUG,
    landing_slug: CREATIVE_TOYS_LANDING_SLUG,
    event_name: CREATIVE_TOYS_EVENT_NAME,
    source: CREATIVE_TOYS_SOURCE,
    page_url: pageUrl,
    current_path: currentPath,
    landing_path: attribution.landingPath,
    landing_path_target: getCreativeToysLandingPath(currentPath),
    confirmation_path: confirmationPath,
    submitted_at: submittedAt,
    attribution: {
      ...attributionFields,
      traffic_channel: trafficChannel,
    },
    ...visitorPayload,
    user_agent: userAgent,
  };
}

export function hasCreativeToysAdsTrackingConfig(config: CreativeToysTrackingConfig): boolean {
  return Boolean(
    config.metaPixelId?.trim() ||
      config.capiWebhookUrl?.trim() ||
      config.tiktokPixelId?.trim(),
  );
}

export function hasCreativeToysMetaConversionConfig(config: CreativeToysTrackingConfig): boolean {
  return Boolean(config.metaPixelId?.trim() || config.capiWebhookUrl?.trim());
}

export function shouldTrackCreativeToysCompleteRegistration(
  pathname: string,
  pendingConversion: CreativeToysPendingConversion | null,
  trackingConfig: CreativeToysTrackingConfig,
): boolean {
  if (!pendingConversion) {
    return false;
  }

  return (
    pendingConversion.event_name === CREATIVE_TOYS_COMPLETE_REGISTRATION_EVENT_NAME &&
    Boolean(pendingConversion.event_id.trim()) &&
    pendingConversion.sent !== true &&
    pendingConversion.traffic_channel === 'ads' &&
    isAdsRoutePath(pathname) &&
    isAdsRoutePath(pendingConversion.source_path) &&
    isCreativeToysConfirmationPathForPendingConversion(pathname, pendingConversion) &&
    hasCreativeToysMetaConversionConfig(trackingConfig)
  );
}

export function readCreativeToysPendingConversion(
  storage: Pick<Storage, 'getItem'>,
): CreativeToysPendingConversion | null {
  try {
    const storedValue = storage.getItem(CREATIVE_TOYS_PENDING_CONVERSION_KEY);

    if (!storedValue) {
      return null;
    }

    return JSON.parse(storedValue) as CreativeToysPendingConversion;
  } catch {
    return null;
  }
}

export function markCreativeToysPendingConversionSent(
  storage: Pick<Storage, 'setItem'>,
  pendingConversion: CreativeToysPendingConversion,
  sentAt: string,
): CreativeToysPendingConversion {
  const sentConversion = {
    ...pendingConversion,
    sent: true,
    sent_at: sentAt,
  };

  storage.setItem(CREATIVE_TOYS_PENDING_CONVERSION_KEY, JSON.stringify(sentConversion));

  return sentConversion;
}
