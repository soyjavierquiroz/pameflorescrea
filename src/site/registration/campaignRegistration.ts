import { isValidPhoneNumber } from 'libphonenumber-js';
import type { ResolvedAttribution, TrafficChannel } from '../../core/attribution';
import { isAdsRoutePath, withoutTrailingSlash } from '../../core/routing/adsRoute';
import {
  buildAttributionEventFields,
  type AnalyticsEventResult,
  type AttributionEventFields,
} from '../../core/services/analytics';
import type { VisitorPayload } from '../../core/visitor/visitorPayload';
import type { CampaignConfig } from './campaigns';

export const COMPLETE_REGISTRATION_EVENT_NAME = 'CompleteRegistration';

export interface CampaignFormValues {
  name: string;
  email: string;
  whatsapp?: string;
}

export interface CampaignFormErrors {
  name?: string;
  email?: string;
  whatsapp?: string;
}

export interface RegistrationSnapshot {
  lead_name: string;
  lead_email: string;
  registered_at: string;
  source_path: string;
}

export interface PendingConversion {
  event_name: typeof COMPLETE_REGISTRATION_EVENT_NAME;
  event_id: string;
  lead_email: string;
  lead_name: string;
  source_path: string;
  confirmation_path: string;
  traffic_channel: 'ads';
  capture_ok_at: string;
  sent: boolean;
  sent_at?: string;
  last_attempt_at?: string;
  attempts?: number;
  tracking_result?: { metaBrowserSent: boolean; capiSent: boolean; event_id: string };
}

export interface CampaignRegistrationPayload extends VisitorPayload, AttributionEventFields {
  name: string;
  first_name: string;
  email: string;
  whatsapp?: string;
  phone?: string;
  campaign_id?: string;
  traffic_channel: TrafficChannel;
  capture_list_slug: string;
  list: string;
  landing_slug: string;
  event_name: string;
  source: string;
  page_url: string;
  current_path: string;
  landing_path: string;
  landing_path_target: string;
  confirmation_path: string;
  submitted_at: string;
  attribution: AttributionEventFields;
  user_agent: string;
}

export interface BuildRegistrationInput extends CampaignFormValues {
  attribution: ResolvedAttribution;
  visitorPayload: VisitorPayload;
  pageUrl: string;
  currentPath: string;
  userAgent: string;
  submittedAt: string;
}

type ReadStorage = Pick<Storage, 'getItem'>;
type WriteStorage = Pick<Storage, 'setItem'>;
const memoryStorage = new Map<string, string>();

export function normalizeRegistrationName(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

export function normalizeRegistrationEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidWhatsapp(value: string): boolean {
  try {
    return isValidPhoneNumber(value.trim());
  } catch {
    return false;
  }
}

export function validateCampaignForm(values: CampaignFormValues, campaign: CampaignConfig): CampaignFormErrors {
  const errors: CampaignFormErrors = {};
  if (normalizeRegistrationName(values.name).length < 2) {
    errors.name = 'Escribe tu nombre para poder registrarte.';
  }
  const email = values.email.trim();
  if (!email) {
    errors.email = 'Escribe tu correo para recibir el acceso.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Revisa que tu correo tenga un formato válido.';
  }
  if (campaign.whatsapp !== 'hidden') {
    const whatsapp = values.whatsapp?.trim() ?? '';
    if (!whatsapp && campaign.whatsapp === 'required') {
      errors.whatsapp = 'Escribe tu WhatsApp para recibir el acceso.';
    } else if (whatsapp && !isValidWhatsapp(whatsapp)) {
      errors.whatsapp = 'Ingresa un número de WhatsApp válido con prefijo de país.';
    }
  }
  return errors;
}

export function getCampaignLandingPath(campaign: CampaignConfig, pathname: string): string {
  return isAdsRoutePath(pathname) ? campaign.adsLandingPath : campaign.organicLandingPath;
}

export function getCampaignConfirmationPath(campaign: CampaignConfig, pathname: string): string {
  return isAdsRoutePath(pathname) ? campaign.adsConfirmationPath : campaign.organicConfirmationPath;
}

export function buildCampaignRegistrationPayload(
  campaign: CampaignConfig,
  input: BuildRegistrationInput,
): CampaignRegistrationPayload {
  const name = normalizeRegistrationName(input.name);
  const email = normalizeRegistrationEmail(input.email);
  const attributionFields = buildAttributionEventFields(input.attribution);
  const trafficChannel: TrafficChannel = isAdsRoutePath(input.currentPath) ? 'ads' : 'organic';
  const whatsapp = input.whatsapp?.trim() ?? '';

  return {
    ...attributionFields,
    name,
    first_name: name,
    email,
    ...(campaign.whatsapp !== 'hidden' && whatsapp ? { whatsapp } : {}),
    ...(campaign.whatsapp !== 'hidden' && whatsapp && isValidWhatsapp(whatsapp) ? { phone: whatsapp } : {}),
    ...(campaign.includeCampaignId ? { campaign_id: campaign.campaignId } : {}),
    traffic_channel: trafficChannel,
    capture_list_slug: campaign.captureListSlug,
    list: campaign.captureListSlug,
    landing_slug: campaign.landingSlug,
    event_name: campaign.eventName,
    source: campaign.source,
    page_url: input.pageUrl,
    current_path: input.currentPath,
    landing_path: input.attribution.landingPath,
    landing_path_target: getCampaignLandingPath(campaign, input.currentPath),
    confirmation_path: getCampaignConfirmationPath(campaign, input.currentPath),
    submitted_at: input.submittedAt,
    attribution: { ...attributionFields, traffic_channel: trafficChannel },
    ...input.visitorPayload,
    user_agent: input.userAgent,
  };
}

export function getCampaignCaptureEndpoint(): string {
  return import.meta.env.VITE_CAPTURE_WEBHOOK_URL?.trim() || '/capture.php';
}

export function isCampaignCaptureOk(responseOk: boolean, responseBody?: { ok?: unknown } | null): boolean {
  return responseOk && responseBody?.ok !== false;
}

export async function submitCampaignRegistration(payload: CampaignRegistrationPayload): Promise<void> {
  const response = await fetch(getCampaignCaptureEndpoint(), {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  let body: { ok?: unknown } | null = null;
  try {
    body = (await response.clone().json()) as { ok?: unknown };
  } catch {
    body = null;
  }
  if (!isCampaignCaptureOk(response.ok, body)) {
    throw new Error(`Capture responded with ${response.status}`);
  }
}

export function buildRegistrationSnapshot(
  name: string,
  email: string,
  registeredAt: string,
  sourcePath: string,
): RegistrationSnapshot {
  return {
    lead_name: normalizeRegistrationName(name),
    lead_email: normalizeRegistrationEmail(email),
    registered_at: registeredAt,
    source_path: sourcePath,
  };
}

export function createCampaignEventId(campaign: CampaignConfig): string {
  const suffix = typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.randomUUID === 'function'
    ? globalThis.crypto.randomUUID()
    : Math.random().toString(36).slice(2, 12);
  return `${campaign.eventIdPrefix}${Date.now()}_${suffix}`;
}

export function buildPendingConversion(
  campaign: CampaignConfig,
  input: {
    captureOk: boolean;
    currentPath: string;
    confirmationPath: string;
    email: string;
    name: string;
    registeredAt: string;
    eventId?: string;
  },
): PendingConversion | null {
  if (!input.captureOk || !isAdsRoutePath(input.currentPath)) return null;
  return {
    event_name: COMPLETE_REGISTRATION_EVENT_NAME,
    event_id: input.eventId?.trim() || createCampaignEventId(campaign),
    lead_email: normalizeRegistrationEmail(input.email),
    lead_name: normalizeRegistrationName(input.name),
    source_path: input.currentPath,
    confirmation_path: input.confirmationPath,
    traffic_channel: 'ads',
    capture_ok_at: input.registeredAt,
    sent: false,
  };
}

export function shouldTrackCampaignConversion(
  campaign: CampaignConfig,
  pathname: string,
  pending: PendingConversion | null,
  config: { metaPixelId?: string | null; capiWebhookUrl?: string | null },
): boolean {
  return Boolean(
    pending &&
    pending.event_name === COMPLETE_REGISTRATION_EVENT_NAME &&
    pending.event_id.trim() &&
    pending.sent !== true &&
    pending.traffic_channel === 'ads' &&
    isAdsRoutePath(pathname) &&
    withoutTrailingSlash(pending.source_path) === campaign.adsLandingPath &&
    withoutTrailingSlash(pending.confirmation_path) === campaign.adsConfirmationPath &&
    withoutTrailingSlash(pathname) === campaign.adsConfirmationPath &&
    (config.metaPixelId?.trim() || config.capiWebhookUrl?.trim()),
  );
}

function browserStorage(kind: 'localStorage' | 'sessionStorage'): (ReadStorage & WriteStorage) | null {
  try {
    return typeof window === 'undefined' ? null : window[kind];
  } catch {
    return null;
  }
}

function readItem(storage: ReadStorage | null, key: string): string | null {
  try { return storage?.getItem(key) ?? null; } catch { return null; }
}

function writeItem(storage: WriteStorage | null, key: string, value: string): void {
  try { storage?.setItem(key, value); } catch { /* Storage may be unavailable. */ }
}

function readJson<T>(raw: string | null): T | null {
  if (!raw) return null;
  try { return JSON.parse(raw) as T; } catch { return null; }
}

export function writeCampaignSnapshot(campaign: CampaignConfig, snapshot: RegistrationSnapshot): void {
  const value = JSON.stringify(snapshot);
  writeItem(browserStorage('localStorage'), campaign.registrationStorageKey, value);
  writeItem(browserStorage('sessionStorage'), campaign.registrationStorageKey, value);
  memoryStorage.set(campaign.registrationStorageKey, value);
}

export function readCampaignSnapshot(campaign: CampaignConfig): RegistrationSnapshot | null {
  const key = campaign.registrationStorageKey;
  return readJson<RegistrationSnapshot>(
    readItem(browserStorage('localStorage'), key) ??
    readItem(browserStorage('sessionStorage'), key) ??
    memoryStorage.get(key) ?? null,
  );
}

export function storeCampaignPendingConversion(campaign: CampaignConfig, pending: PendingConversion): void {
  const value = JSON.stringify(pending);
  writeItem(browserStorage('localStorage'), campaign.pendingConversionStorageKey, value);
  writeItem(browserStorage('sessionStorage'), campaign.pendingConversionStorageKey, value);
  memoryStorage.set(campaign.pendingConversionStorageKey, value);
}

function pendingTimestamp(pending: PendingConversion): string {
  return pending.sent_at ?? pending.last_attempt_at ?? pending.capture_ok_at;
}

export function readCampaignPendingConversion(campaign: CampaignConfig): PendingConversion | null {
  const key = campaign.pendingConversionStorageKey;
  const candidates = [
    readJson<PendingConversion>(readItem(browserStorage('localStorage'), key)),
    readJson<PendingConversion>(readItem(browserStorage('sessionStorage'), key)),
    readJson<PendingConversion>(memoryStorage.get(key) ?? null),
  ].filter((item): item is PendingConversion => item !== null);
  return candidates.reduce<PendingConversion | null>((latest, next) => {
    if (!latest) return next;
    if (latest.event_id === next.event_id && next.sent && !latest.sent) return next;
    return pendingTimestamp(next) >= pendingTimestamp(latest) ? next : latest;
  }, null);
}

export function markCampaignConversionSent(
  campaign: CampaignConfig,
  pending: PendingConversion,
  sentAt: string,
  result: Pick<AnalyticsEventResult, 'metaBrowserSent' | 'capiSent' | 'eventId'>,
): void {
  storeCampaignPendingConversion(campaign, {
    ...pending,
    sent: true,
    sent_at: sentAt,
    tracking_result: {
      metaBrowserSent: result.metaBrowserSent,
      capiSent: result.capiSent,
      event_id: result.eventId ?? '',
    },
  });
}

export function markCampaignConversionFailed(
  campaign: CampaignConfig,
  pending: PendingConversion,
  attemptedAt = new Date().toISOString(),
): PendingConversion {
  const failed = {
    ...pending,
    sent: false,
    attempts: (pending.attempts ?? 0) + 1,
    last_attempt_at: attemptedAt,
  };
  storeCampaignPendingConversion(campaign, failed);
  return failed;
}
