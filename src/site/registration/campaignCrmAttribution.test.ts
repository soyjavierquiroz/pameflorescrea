import { execFileSync } from 'node:child_process';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { campaignCrmStorageKey, CRM_TTL_MS, normalizeCrmReferrer, resolveCampaignCrmAttribution } from './campaignCrmAttribution';
import { buildCampaignRegistrationPayload, buildPendingConversion } from './campaignRegistration';
import { retoCampaign } from './campaigns';
import { resolveAttribution } from '../../core/attribution';
import { buildVisitorPayload } from '../../core/visitor/visitorPayload';

let items: Map<string, string>;
let id: string;
let sequence = 0;
beforeEach(() => {
  items = new Map();
  id = `test-${sequence++}`;
  vi.stubGlobal('window', { localStorage: {
    getItem: (key: string) => items.get(key) ?? null,
    setItem: (key: string, value: string) => items.set(key, value),
    removeItem: (key: string) => items.delete(key),
  } });
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('campaign CRM attribution', () => {
  it.each([
    ['https://www.youtube.com/', 'youtube', 'youtube.com'],
    ['https://youtu.be/', 'youtube', 'youtube.com'],
    ['https://m.youtube.com/watch?v=secret#fragment', 'youtube', 'youtube.com'],
    ['https://www.instagram.com/', 'instagram', 'instagram.com'],
    ['https://l.instagram.com/', 'instagram', 'instagram.com'],
    ['https://www.facebook.com/', 'facebook', 'facebook.com'],
    ['https://l.facebook.com/', 'facebook', 'facebook.com'],
    ['https://lm.facebook.com/', 'facebook', 'facebook.com'],
    ['https://www.tiktok.com/', 'tiktok', 'tiktok.com'],
    ['https://m.tiktok.com/', 'tiktok', 'tiktok.com'],
    ['https://www.google.co.uk/', 'google', 'google.co.uk'],
    ['https://www.linkedin.com/', 'linkedin', 'linkedin.com'],
    ['https://x.com/', 'x', 'x.com'],
    ['https://twitter.com/', 'twitter', 'twitter.com'],
    ['https://newsletter.example.com/path?secret=yes', 'newsletter.example.com', 'newsletter.example.com'],
  ])('normalizes %s without path/query', (url, source, domain) => {
    expect(normalizeCrmReferrer(url)).toEqual({ referrer_source: source, referrer_domain: domain, referrer_origin: new URL(url).origin });
  });
  it.each(['', 'invalid', 'https://pameflorescrea.com/reto/', 'https://www.pameflorescrea.com/', 'https://foo.pameflorescrea.com/', 'javascript:alert(1)'])('ignores %s', (referrer) => {
    expect(normalizeCrmReferrer(referrer)).toEqual({});
  });
  it('keeps direct traffic free of invented attribution', () => {
    expect(resolveCampaignCrmAttribution(id, '/reto/', '', 100)).toEqual({});
  });
  it('captures organic and ads examples without inferring UTMs from referrers', () => {
    expect(resolveCampaignCrmAttribution(id, '/reto/?utm_source=instagram&utm_medium=organic_social&utm_campaign=reto_octubre&utm_content=bio', '', 100)).toMatchObject({ utm_source: 'instagram', utm_medium: 'organic_social', utm_campaign: 'reto_octubre', utm_content: 'bio' });
    expect(resolveCampaignCrmAttribution(`${id}-ads`, '/x9m/reto/?utm_source=facebook&utm_medium=paid_social&utm_campaign=reto_octubre&utm_content=video_03&fbclid=TEST', '', 100)).toMatchObject({ utm_source: 'facebook', utm_medium: 'paid_social', utm_campaign: 'reto_octubre', utm_content: 'video_03', fbclid: 'TEST' });
    const ads = resolveCampaignCrmAttribution(`${id}-ref`, '/x9m/reto/', 'https://l.instagram.com/', 100);
    expect(ads.referrer_source).toBe('instagram');
    expect(ads).not.toHaveProperty('utm_source');
  });
  it('uses collision-free campaign keys', () => {
    expect(campaignCrmStorageKey('reto')).toBe('pame_reto_crm_attribution_v1');
    expect(campaignCrmStorageKey('500-extra')).toBe('pame_500-extra_crm_attribution_v1');
    expect(campaignCrmStorageKey('a-b')).not.toBe(campaignCrmStorageKey('a_b'));
  });
  it('persists organic UTMs and all click IDs through reloads and empty ads visits', () => {
    resolveCampaignCrmAttribution(id, '/reto/?utm_source=instagram&utm_campaign=reto_octubre&fbclid=TEST&gclid=G&ttclid=T', '', 100);
    for (const url of ['/reto/', '/x9m/reto/', '/reto/?utm_source=%20&utm_campaign=']) {
      expect(resolveCampaignCrmAttribution(id, url, '', 101)).toMatchObject({ utm_source: 'instagram', utm_campaign: 'reto_octubre', fbclid: 'TEST', gclid: 'G', ttclid: 'T' });
    }
    expect(resolveCampaignCrmAttribution(id, '/reto/?utm_source=email', '', 102)).toEqual({ utm_source: 'email' });
  });
  it('keeps external referrers on internal/empty reloads and replaces with the next external touch', () => {
    resolveCampaignCrmAttribution(id, '/reto/', 'https://www.youtube.com/watch?v=secret', 100);
    for (const ref of ['', 'https://pameflorescrea.com/reto/']) {
      const fields = resolveCampaignCrmAttribution(id, '/reto/', ref, 101);
      expect(fields.referrer_source).toBe('youtube');
      expect(fields).not.toHaveProperty('utm_source');
    }
    expect(resolveCampaignCrmAttribution(id, '/reto/', 'https://l.instagram.com/', 102)).toMatchObject({ referrer_source: 'instagram', referrer_domain: 'instagram.com', referrer_origin: 'https://l.instagram.com' });
  });
  it('isolates all attribution between campaigns', () => {
    resolveCampaignCrmAttribution(`${id}-500`, '/500-extra?utm_campaign=500_extra_old&fbclid=OLD', 'https://youtube.com', 100);
    const reto = resolveCampaignCrmAttribution(id, '/reto?utm_campaign=reto_octubre', 'https://instagram.com', 101);
    expect(reto.utm_campaign).toBe('reto_octubre');
    expect(reto).not.toHaveProperty('fbclid');
    expect(resolveCampaignCrmAttribution(`${id}-500`, '/500-extra', '', 102)).toMatchObject({ utm_campaign: '500_extra_old', fbclid: 'OLD', referrer_source: 'youtube' });
  });
  it('expires at 30 days and refreshes timestamp on a new touch', () => {
    resolveCampaignCrmAttribution(id, '/reto?utm_source=email', '', 100);
    expect(resolveCampaignCrmAttribution(id, 'invalid://[', '', 100 + CRM_TTL_MS - 1).utm_source).toBe('email');
    expect(resolveCampaignCrmAttribution(id, '/reto', '', 100 + CRM_TTL_MS)).not.toHaveProperty('utm_source');
    resolveCampaignCrmAttribution(id, '/reto?utm_source=new', '', 100 + CRM_TTL_MS + 1);
    expect(JSON.parse(items.get(campaignCrmStorageKey(id))!).timestamp).toBe(100 + CRM_TTL_MS + 1);
  });
  it.each(['{bad', '{}', '{"timestamp":"bad","fields":{}}', '{"timestamp":100,"fields":[]}'])('recovers from corrupt storage %s', (raw) => {
    items.set(campaignCrmStorageKey(id), raw);
    expect(resolveCampaignCrmAttribution(id, '/reto', '', 101)).toEqual({});
  });
  it('replaces Facebook with email without retaining previous click IDs', () => {
    resolveCampaignCrmAttribution(id, '/reto?utm_source=facebook&utm_medium=paid_social&fbclid=AAA', '', 100);
    expect(resolveCampaignCrmAttribution(id, '/reto?utm_source=email&utm_medium=email', '', 101)).toEqual({ utm_source: 'email', utm_medium: 'email' });
  });
  it('replaces Facebook with a referrer-only YouTube snapshot', () => {
    resolveCampaignCrmAttribution(id, '/reto?utm_source=facebook&fbclid=AAA', '', 100);
    expect(resolveCampaignCrmAttribution(id, '/reto', 'https://www.youtube.com/', 101)).toEqual({ referrer_source: 'youtube', referrer_domain: 'youtube.com', referrer_origin: 'https://www.youtube.com' });
  });
  it.each(['', 'https://pameflorescrea.com/reto/', 'https://sub.pameflorescrea.com/reto/'])('preserves the complete snapshot and timestamp without external signals (%s)', (referrer) => {
    const first = resolveCampaignCrmAttribution(id, '/reto?utm_source=instagram&utm_medium=organic_social', '', 100);
    const stored = items.get(campaignCrmStorageKey(id));
    expect(resolveCampaignCrmAttribution(id, '/x9m/reto/', referrer, 101)).toEqual(first);
    expect(items.get(campaignCrmStorageKey(id))).toBe(stored);
  });
  it('stores UTMs, referrer and click IDs together from the same touch', () => {
    const fields = resolveCampaignCrmAttribution(id, '/reto?utm_source=instagram&fbclid=AAA', 'https://l.instagram.com/', 100);
    expect(fields).toEqual({ utm_source: 'instagram', fbclid: 'AAA', referrer_source: 'instagram', referrer_domain: 'instagram.com', referrer_origin: 'https://l.instagram.com' });
    expect(JSON.parse(items.get(campaignCrmStorageKey(id))!).fields).not.toHaveProperty('landing_path');
  });
  it('expires on day 31 despite a direct visit on day 29 and creates no empty storage', () => {
    const day = 24 * 60 * 60 * 1000;
    resolveCampaignCrmAttribution(id, '/reto?utm_source=instagram', '', 0);
    expect(resolveCampaignCrmAttribution(id, '/x9m/reto/?utm_source=%20', '', 29 * day)).toEqual({ utm_source: 'instagram' });
    expect(JSON.parse(items.get(campaignCrmStorageKey(id))!).timestamp).toBe(0);
    expect(resolveCampaignCrmAttribution(id, '/reto/', '', 31 * day)).toEqual({});
    expect(items.has(campaignCrmStorageKey(id))).toBe(false);
  });
  it('sends the current submit path after expiration without attribution fields', () => {
    vi.spyOn(Date, 'now').mockReturnValue(CRM_TTL_MS + 1);
    resolveCampaignCrmAttribution(id, '/reto?utm_source=instagram', '', 0);
    const payload = buildCampaignRegistrationPayload({ ...retoCampaign, campaignId: id }, {
      name: 'Pame', email: 'pame@example.com', attribution: resolveAttribution({ url: '/x9m/reto/' }),
      visitorPayload: buildVisitorPayload(null), pageUrl: 'https://pameflorescrea.com/x9m/reto/?unrelated=1#fragment',
      currentPath: '/x9m/reto/', userAgent: 'test', submittedAt: 'now', referrer: '',
    });
    expect(payload.landing_path).toBe('/x9m/reto/');
    expect(payload).not.toHaveProperty('utm_source');
    expect(payload).not.toHaveProperty('fbclid');
    expect(payload).not.toHaveProperty('referrer_source');
    expect(items.has(campaignCrmStorageKey(id))).toBe(false);
    vi.restoreAllMocks();
  });
  it('keeps memory attribution if localStorage throws', () => {
    vi.stubGlobal('window', { get localStorage() { throw new Error('privacy'); } });
    resolveCampaignCrmAttribution(id, '/reto?utm_source=email', 'https://youtube.com', 100);
    expect(resolveCampaignCrmAttribution(id, '/reto', '', 101)).toMatchObject({ utm_source: 'email', referrer_source: 'youtube' });
  });
  it.each([
    ['/reto/?utm_medium=paid_social&fbclid=TEST', 'https://facebook.com', 'organic', false],
    ['/x9m/reto/', '', 'ads', true],
  ])('keeps route gating at %s', (url, referrer, channel, track) => {
    const attribution = resolveAttribution({ url });
    const payload = buildCampaignRegistrationPayload({ ...retoCampaign, campaignId: id }, {
      name: 'Pame', email: 'pame@example.com', whatsapp: '+593991234567', attribution,
      visitorPayload: buildVisitorPayload(null), pageUrl: url, currentPath: new URL(url, 'https://pameflorescrea.com').pathname,
      userAgent: 'test', submittedAt: 'now', referrer,
    });
    expect(payload.traffic_channel).toBe(channel);
    expect(attribution.shouldTrackAds).toBe(track);
    expect(payload.phone).toBe(payload.whatsapp);
    if (!track) {
      expect(payload).toMatchObject({ utm_medium: 'paid_social', fbclid: 'TEST', referrer_source: 'facebook' });
      expect(buildPendingConversion(retoCampaign, { captureOk: true, currentPath: '/reto', confirmationPath: '/confirmacion/reto', name: 'Pame', email: 'pame@example.com', registeredAt: 'now' })).toBeNull();
    }
  });
});

describe('PHP CRM upstream normalization', () => {
  function normalize(payload: unknown) {
    return JSON.parse(execFileSync('php', ['-r', "require 'public/capture-crm.php'; $_SERVER['HTTP_REFERER'] = 'https://facebook.com/secret'; echo json_encode(capture_apply_crm(json_decode(stream_get_contents(STDIN), true)));"], { input: JSON.stringify(payload), encoding: 'utf8' }));
  }
  it('responds with an empty 404 when invoked directly', () => {
    const result = execFileSync('php', ['-r', "$_SERVER['SCRIPT_FILENAME'] = realpath('public/capture-crm.php'); ob_start(); require 'public/capture-crm.php'; $body = ob_get_clean(); echo json_encode(['status' => http_response_code(), 'body' => $body]);"], { encoding: 'utf8' });
    expect(JSON.parse(result)).toEqual({ status: 404, body: '' });
  });
  it('flattens every CRM field into upstream and both custom maps', () => {
    const fields = { utm_source: 'email', utm_medium: 'organic_social', utm_campaign: 'reto_octubre', utm_content: 'video-03', utm_term: 'craft', fbclid: 'F', gclid: 'G', ttclid: 'T', referrer_source: 'youtube', referrer_domain: 'youtube.com', referrer_origin: 'https://www.youtube.com', landing_path: '/reto/' };
    const output = normalize({ ...fields, source: 'pameflorescrea.com' });
    expect(output).toMatchObject(fields);
    expect(output.custom_fields).toEqual(fields);
    expect(output.custom_values).toEqual(fields);
    expect(output.source).toBe('pameflorescrea.com');
  });
  it('uses nested fallback and explicit flat priority without changing nested objects', () => {
    const input = { utm_source: ' email ', utm_medium: ' ', fbclid: 'FLAT', utms: { utm_source: 'instagram', utm_campaign: 'reto_octubre', utm_medium: 'organic_social', utm_custom: 'preserved' }, click_ids: { fbclid: 'OLD', gclid: 'G', ttclid: 'T' } };
    const output = normalize(input);
    expect(output).toMatchObject({ utm_source: 'email', utm_campaign: 'reto_octubre', utm_medium: 'organic_social', fbclid: 'FLAT', gclid: 'G', ttclid: 'T', utms: input.utms, click_ids: input.click_ids });
    expect(output.custom_fields).toEqual(output.custom_values);
    expect(output.custom_values.utm_campaign).toBe('reto_octubre');
  });
  it('omits empty/non-string input and never uses HTTP Referer', () => {
    const output = normalize({ source: 'pameflorescrea.com', utm_source: [], fbclid: {}, utm_content: ' ', referrer_origin: 'invalid', referrer_domain: 'https://youtube.com/secret', referrer_source: 'https://youtube.com', landing_path: 'https://site.test' });
    expect(output).toEqual({ source: 'pameflorescrea.com' });
  });
  it('strips referrer path/query/fragment and landing query; bounds values', () => {
    const output = normalize({ referrer_origin: 'https://www.youtube.com/watch?secret=yes#x', landing_path: '/reto/?secret=yes#x', utm_content: 'a'.repeat(1000) });
    expect(output.referrer_origin).toBe('https://www.youtube.com');
    expect(output.landing_path).toBe('/reto/');
    expect(output.utm_content).toHaveLength(512);
    expect(JSON.stringify(output)).not.toContain('secret');
  });
});
