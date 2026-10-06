import type { AnalyticsEventResult } from '../../core/services/analytics';
import { withoutTrailingSlash } from '../../core/routing/adsRoute';
import { creativeToysCampaign } from './campaigns';
import {
  getCampaignWhatsAppUrl,
  scheduleWhatsAppRedirect,
  shouldAutoRedirectToWhatsApp,
  WHATSAPP_REDIRECT_DELAY_MS,
} from './whatsappGroup';
import {
  buildCampaignRegistrationPayload,
  buildPendingConversion,
  buildRegistrationSnapshot,
  COMPLETE_REGISTRATION_EVENT_NAME,
  createCampaignEventId,
  getCampaignCaptureEndpoint,
  getCampaignConfirmationPath,
  getCampaignLandingPath,
  isCampaignCaptureOk,
  markCampaignConversionFailed,
  readCampaignPendingConversion,
  readCampaignSnapshot,
  shouldTrackCampaignConversion,
  storeCampaignPendingConversion,
  validateCampaignForm,
  writeCampaignSnapshot,
  type BuildRegistrationInput,
  type CampaignFormErrors,
  type CampaignFormValues,
  type CampaignRegistrationPayload,
  type PendingConversion,
  type RegistrationSnapshot,
} from './campaignRegistration';

export const CREATIVE_TOYS_REGISTRATION_KEY = creativeToysCampaign.registrationStorageKey;
export const CREATIVE_TOYS_PENDING_CONVERSION_KEY = creativeToysCampaign.pendingConversionStorageKey;
export const CREATIVE_TOYS_LANDING_SLUG = creativeToysCampaign.landingSlug;
export const CREATIVE_TOYS_COMPLETE_REGISTRATION_EVENT_NAME = COMPLETE_REGISTRATION_EVENT_NAME;
export const CREATIVE_TOYS_EVENT_NAME = creativeToysCampaign.eventName;
export const CREATIVE_TOYS_SOURCE = creativeToysCampaign.source;
export const CREATIVE_TOYS_ORGANIC_LANDING_PATH = creativeToysCampaign.organicLandingPath;
export const CREATIVE_TOYS_ORGANIC_CONFIRMATION_PATH = creativeToysCampaign.organicConfirmationPath;
export const CREATIVE_TOYS_WHATSAPP_REDIRECT_DELAY_MS = WHATSAPP_REDIRECT_DELAY_MS;

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

export type CreativeToysFormValues = CampaignFormValues;
export type CreativeToysFormErrors = CampaignFormErrors;
export type CreativeToysRegistrationSnapshot = RegistrationSnapshot;
export type CreativeToysPendingConversion = PendingConversion;
export type CreativeToysRegistrationPayload = CampaignRegistrationPayload;
export type BuildCreativeToysRegistrationPayloadInput = BuildRegistrationInput;

export interface CreativeToysTrackingConfig {
  capiWebhookUrl?: string | null;
  metaPixelId?: string | null;
  tiktokPixelId?: string | null;
}

export interface CreativeToysTrackingResultSummary {
  metaBrowserSent: boolean;
  capiSent: boolean;
  event_id: string;
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

export function isValidCreativeToysEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function validateCreativeToysForm(values: CreativeToysFormValues): CreativeToysFormErrors {
  return validateCampaignForm(values, creativeToysCampaign);
}

export function getCreativeToysLandingPath(pathname: string): string {
  return getCampaignLandingPath(creativeToysCampaign, pathname);
}

export function getCreativeToysConfirmationPath(pathname: string): string {
  return getCampaignConfirmationPath(creativeToysCampaign, pathname);
}

export function getCreativeToysCaptureEndpoint(): string {
  return getCampaignCaptureEndpoint();
}

export function getCreativeToysWhatsAppUrl(pathname: string): string {
  return getCampaignWhatsAppUrl(pathname);
}

export function shouldAutoRedirectToCreativeToysWhatsApp(whatsappUrl: string): boolean {
  return shouldAutoRedirectToWhatsApp(whatsappUrl);
}

export function scheduleCreativeToysWhatsAppRedirect(
  browserWindow: Pick<Window, 'clearTimeout' | 'setTimeout'> & {
    location: Pick<Location, 'assign'>;
  },
  whatsappUrl: string,
): () => void {
  return scheduleWhatsAppRedirect(browserWindow, whatsappUrl);
}

export function isCreativeToysCaptureOk(
  responseOk: boolean,
  responseBody?: { ok?: unknown } | null,
): boolean {
  return isCampaignCaptureOk(responseOk, responseBody);
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
  return buildRegistrationSnapshot(name, email, registeredAt, sourcePath);
}

export function createCreativeToysConversionEventId(): string {
  return createCampaignEventId(creativeToysCampaign);
}

export function buildCreativeToysPendingConversion(
  input: BuildCreativeToysPendingConversionInput,
): CreativeToysPendingConversion | null {
  return buildPendingConversion(creativeToysCampaign, input);
}

export function isCreativeToysConfirmationPathForPendingConversion(
  pathname: string,
  pendingConversion: CreativeToysPendingConversion,
): boolean {
  return withoutTrailingSlash(pathname) === creativeToysCampaign.adsConfirmationPath &&
    withoutTrailingSlash(pendingConversion.confirmation_path) === creativeToysCampaign.adsConfirmationPath;
}

export function buildCreativeToysRegistrationPayload(
  input: BuildCreativeToysRegistrationPayloadInput,
): CreativeToysRegistrationPayload {
  return buildCampaignRegistrationPayload(creativeToysCampaign, input);
}

export function hasCreativeToysAdsTrackingConfig(config: CreativeToysTrackingConfig): boolean {
  return Boolean(config.metaPixelId?.trim() || config.capiWebhookUrl?.trim() || config.tiktokPixelId?.trim());
}

export function hasCreativeToysMetaConversionConfig(config: CreativeToysTrackingConfig): boolean {
  return Boolean(config.metaPixelId?.trim() || config.capiWebhookUrl?.trim());
}

export function shouldTrackCreativeToysCompleteRegistration(
  pathname: string,
  pendingConversion: CreativeToysPendingConversion | null,
  trackingConfig: CreativeToysTrackingConfig,
): boolean {
  return shouldTrackCampaignConversion(creativeToysCampaign, pathname, pendingConversion, trackingConfig);
}

export function storeCreativeToysPendingConversion(
  pendingConversion: CreativeToysPendingConversion,
): CreativeToysPendingConversion {
  storeCampaignPendingConversion(creativeToysCampaign, pendingConversion);
  return pendingConversion;
}

export function readCreativeToysPendingConversion(
  storage?: Pick<Storage, 'getItem'>,
): CreativeToysPendingConversion | null {
  if (storage) {
    try {
      const raw = storage.getItem(CREATIVE_TOYS_PENDING_CONVERSION_KEY);
      return raw ? JSON.parse(raw) as CreativeToysPendingConversion : null;
    } catch {
      return null;
    }
  }
  return readCampaignPendingConversion(creativeToysCampaign);
}

export function writeCreativeToysRegistrationSnapshot(snapshot: CreativeToysRegistrationSnapshot): void {
  writeCampaignSnapshot(creativeToysCampaign, snapshot);
}

export function readCreativeToysRegistrationSnapshot(): CreativeToysRegistrationSnapshot | null {
  return readCampaignSnapshot(creativeToysCampaign);
}

export function summarizeCreativeToysTrackingResult(
  result: Pick<AnalyticsEventResult, 'capiSent' | 'eventId' | 'metaBrowserSent'>,
): CreativeToysTrackingResultSummary {
  return {
    metaBrowserSent: result.metaBrowserSent,
    capiSent: result.capiSent,
    event_id: result.eventId ?? '',
  };
}

export function didCreativeToysTrackingSend(
  result: Pick<AnalyticsEventResult, 'capiSent' | 'metaBrowserSent'>,
): boolean {
  return result.metaBrowserSent || result.capiSent;
}

export function markCreativeToysPendingConversionSent(
  storage: Pick<Storage, 'setItem'> | null | undefined,
  pendingConversion: CreativeToysPendingConversion,
  sentAt: string,
  trackingResult?: CreativeToysTrackingResultSummary,
): CreativeToysPendingConversion {
  const sentConversion: CreativeToysPendingConversion = {
    ...pendingConversion,
    sent: true,
    sent_at: sentAt,
    tracking_result: trackingResult,
  };
  if (storage) {
    try {
      storage.setItem(CREATIVE_TOYS_PENDING_CONVERSION_KEY, JSON.stringify(sentConversion));
    } catch {
      // Browser storage may be unavailable.
    }
  } else {
    storeCampaignPendingConversion(creativeToysCampaign, sentConversion);
  }
  return sentConversion;
}

export function markCreativeToysPendingConversionAttemptFailed(
  pendingConversion: CreativeToysPendingConversion,
  attemptedAt: string,
): CreativeToysPendingConversion {
  return markCampaignConversionFailed(creativeToysCampaign, pendingConversion, attemptedAt);
}
