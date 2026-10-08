import { extractClickIds, extractUtms } from '../../core/attribution';

export const CRM_TTL_MS = 30 * 24 * 60 * 60 * 1000;
export const CRM_FIELDS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  'fbclid', 'gclid', 'ttclid', 'referrer_source', 'referrer_domain', 'referrer_origin',
] as const;
export type CrmAttribution = Partial<Record<typeof CRM_FIELDS[number], string>>;
type Entry = { timestamp: number; fields: CrmAttribution };
const memory = new Map<string, Entry>();

// Encoding preserves campaign identity, including punctuation, without key collisions.
export function campaignCrmStorageKey(campaignId: string): string {
  return `pame_${encodeURIComponent(campaignId)}_crm_attribution_v1`;
}

function nonEmpty(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim().slice(0, 512) : undefined;
}

export function normalizeCrmReferrer(referrer: string): CrmAttribution {
  try {
    const url = new URL(referrer);
    if (!['https:', 'http:'].includes(url.protocol)) return {};
    const host = url.hostname.toLowerCase().replace(/\.$/, '');
    if (host === 'pameflorescrea.com' || host.endsWith('.pameflorescrea.com')) return {};
    let domain = host.replace(/^www\./, '');
    let source = domain;
    for (const platform of ['youtube', 'instagram', 'facebook', 'tiktok', 'linkedin', 'x', 'twitter']) {
      const canonical = `${platform}.com`;
      if (host === canonical || host.endsWith(`.${canonical}`) || (platform === 'youtube' && host === 'youtu.be')) {
        domain = canonical;
        source = platform;
        break;
      }
    }
    if (/^(?:[a-z0-9-]+\.)*google\.(?:com|[a-z]{2}|com\.[a-z]{2}|co\.[a-z]{2})$/.test(host)) source = 'google';
    return { referrer_source: source, referrer_domain: domain, referrer_origin: `${url.protocol}//${url.host.toLowerCase()}` };
  } catch { return {}; }
}

export function captureCrmFields(pageUrl: string, referrer = ''): CrmAttribution {
  try {
    const url = new URL(pageUrl, 'https://pameflorescrea.com');
    const query = { ...extractUtms(url.searchParams), ...extractClickIds(url.searchParams) };
    const fields: CrmAttribution = { ...normalizeCrmReferrer(referrer) };
    for (const field of CRM_FIELDS) {
      const value = nonEmpty(query[field as keyof typeof query]);
      if (value) fields[field] = value;
    }
    return fields;
  } catch { return {}; }
}

function storage(): Storage | null {
  try { return typeof window === 'undefined' ? null : window.localStorage; } catch { return null; }
}

export function resolveCampaignCrmAttribution(
  campaignId: string, pageUrl: string, referrer = '', now = Date.now(),
): CrmAttribution {
  const key = campaignCrmStorageKey(campaignId);
  const local = storage();
  let previous = memory.get(key);
  let raw: string | null | undefined;
  try { raw = local?.getItem(key); } catch { /* Use memory if storage is inaccessible. */ }
  try {
    if (raw) {
      const entry = JSON.parse(raw) as Entry;
      if (!entry || typeof entry.timestamp !== 'number' || !Number.isFinite(entry.timestamp) ||
        entry.timestamp < 0 || entry.timestamp > now || now - entry.timestamp >= CRM_TTL_MS ||
        !entry.fields || typeof entry.fields !== 'object' || Array.isArray(entry.fields) ||
        Object.entries(entry.fields).some(([field, value]) => !CRM_FIELDS.includes(field as typeof CRM_FIELDS[number]) || nonEmpty(value) !== value)) {
        throw new Error('Invalid CRM attribution');
      }
      if (entry.fields.referrer_origin && normalizeCrmReferrer(entry.fields.referrer_origin).referrer_origin !== entry.fields.referrer_origin) {
        throw new Error('Invalid normalized CRM fields');
      }
      previous = entry;
    }
  } catch {
    previous = undefined;
    memory.delete(key);
    try { local?.removeItem(key); } catch { /* Privacy mode. */ }
  }
  if (previous && (previous.timestamp > now || now - previous.timestamp >= CRM_TTL_MS)) {
    previous = undefined;
    memory.delete(key);
    try { local?.removeItem(key); } catch { /* Privacy mode. */ }
  }
  const current = captureCrmFields(pageUrl, referrer);
  // Only attribution signals create a touch. Direct/internal visits preserve its original TTL.
  if (!Object.keys(current).length) return { ...previous?.fields };
  const entry = { timestamp: now, fields: current };
  if (typeof window !== 'undefined') {
    memory.set(key, entry);
    try { local?.setItem(key, JSON.stringify(entry)); } catch { /* Keep attribution in memory. */ }
  }
  return { ...current };
}
