import { afterEach, describe, expect, it, vi } from 'vitest';

interface ScriptMock {
  async: boolean;
  id: string;
  onerror: (() => void) | null;
  onload: (() => void) | null;
  src: string;
}

function installBrowserMocks(pathWithSearch: string) {
  const url = new URL(pathWithSearch, 'https://example.com');
  const scripts = new Map<string, ScriptMock>();
  const storage = new Map<string, string>();
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 202 });
  const appendChild = vi.fn((script: ScriptMock) => {
    scripts.set(script.id, script);
    script.onload?.();
    return script;
  });
  const storageMock = {
    getItem: vi.fn((key: string) => storage.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => storage.set(key, value)),
  };
  const windowMock = {
    location: {
      href: url.toString(),
      pathname: url.pathname,
      protocol: 'https:',
      search: url.search,
    },
    localStorage: storageMock,
    navigator: { userAgent: 'vitest' },
    sessionStorage: storageMock,
  };
  const documentMock = {
    cookie: '',
    createElement: vi.fn(
      (): ScriptMock => ({ async: false, id: '', onerror: null, onload: null, src: '' }),
    ),
    getElementById: vi.fn((id: string) => scripts.get(id) ?? null),
    head: { appendChild },
    referrer: '',
  };

  vi.stubGlobal('window', windowMock);
  vi.stubGlobal('document', documentMock);
  vi.stubGlobal('fetch', fetchMock);

  return { appendChild, fetchMock, scripts, windowMock };
}

async function loadAnalytics(
  integrations = {
    capiWebhookUrl: 'https://relay.example/v1/events',
    metaPixelId: '123456789',
    siteId: 'EXAMPLE_SITE',
    tiktokPixelId: 'TEST_TIKTOK_PIXEL',
  },
) {
  vi.doMock('../config/funnel.config', () => ({
    default: {
      integrations,
    },
  }));
  vi.doMock('../../site/current', () => ({
    DNA: {
      tracking: {
        metaPixelScriptUrl: 'https://connect.facebook.net/en_US/fbevents.js',
        tiktokPixelScriptBaseUrl: 'https://analytics.tiktok.com/i18n/pixel/events.js',
      },
    },
  }));

  return import('./analytics');
}

afterEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
  vi.unstubAllGlobals();
});

describe('ads tracking route gate', () => {
  it('does not load pixels or call CAPI outside the ads prefix even with trackingEnabled', async () => {
    const { appendChild, fetchMock, scripts, windowMock } =
      installBrowserMocks('/500-extra?fbclid=test');
    const { trackEvent } = await loadAnalytics();

    const result = await trackEvent('InitiateCheckout', { trackingEnabled: true });

    expect(result).toMatchObject({
      capiSent: false,
      metaBrowserSent: false,
      tiktokBrowserSent: false,
    });
    expect(scripts.has('boilerplate-meta-pixel-script')).toBe(false);
    expect(scripts.has('boilerplate-tiktok-pixel-script')).toBe(false);
    expect(appendChild).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(windowMock).not.toHaveProperty('fbq');
  });

  it('does not load pixels or call CAPI outside the ads prefix with paid UTMs', async () => {
    const { fetchMock, scripts } = installBrowserMocks('/500-extra?utm_medium=paid');
    const { trackEvent } = await loadAnalytics();

    await expect(trackEvent('PageView')).resolves.toMatchObject({
      capiSent: false,
      metaBrowserSent: false,
      tiktokBrowserSent: false,
    });
    expect(scripts.size).toBe(0);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('loads pixels and calls CAPI under the ads prefix', async () => {
    const { fetchMock, scripts } = installBrowserMocks('/x9m/500-extra?fbclid=test');
    const { trackEvent } = await loadAnalytics();

    await expect(trackEvent('PageView')).resolves.toMatchObject({
      capiSent: true,
      metaBrowserSent: true,
      tiktokBrowserSent: true,
    });
    expect(scripts.get('boilerplate-meta-pixel-script')?.src).toBe(
      'https://connect.facebook.net/en_US/fbevents.js',
    );
    expect(scripts.get('boilerplate-tiktok-pixel-script')?.src).toContain(
      'https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=TEST_TIKTOK_PIXEL',
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('does not load pixels or call CAPI under the ads prefix when env values are empty', async () => {
    const { appendChild, fetchMock, scripts, windowMock } =
      installBrowserMocks('/x9m/500-extra?fbclid=test');
    const { trackEvent } = await loadAnalytics({
      capiWebhookUrl: '',
      metaPixelId: '',
      siteId: 'PAME_FLORES_CREA',
      tiktokPixelId: '',
    });

    await expect(trackEvent('Lead')).resolves.toMatchObject({
      capiSent: false,
      metaBrowserSent: false,
      tiktokBrowserSent: false,
    });
    expect(scripts.size).toBe(0);
    expect(appendChild).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(windowMock).not.toHaveProperty('fbq');
  });

  it('deduplicates events by sharing one event id across Meta Pixel and CAPI', async () => {
    const { fetchMock, windowMock } = installBrowserMocks('/x9m/oferta?fbclid=TEST_DEDUPE_001');
    vi.stubGlobal('crypto', {
      randomUUID: vi.fn(() => 'event-shared-1'),
    });
    const { trackEvent } = await loadAnalytics();

    const result = await trackEvent('InitiateCheckout', {
      content_name: 'Example Offer',
      content_ids: ['EXAMPLE_PRODUCT'],
      value: 100,
      currency: 'USD',
    });

    expect(result).toMatchObject({
      eventId: 'event-shared-1',
      capiSent: true,
      metaBrowserSent: true,
    });
    const fbqQueue = (windowMock as { fbq?: { queue?: unknown[] } }).fbq?.queue;

    expect(fbqQueue).toContainEqual([
      'track',
      'InitiateCheckout',
      expect.objectContaining({
        content_name: 'Example Offer',
        content_ids: ['EXAMPLE_PRODUCT'],
        value: 100,
        currency: 'USD',
      }),
      { eventID: 'event-shared-1' },
    ]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const capiPayload = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));

    expect(capiPayload).toMatchObject({
      siteId: 'EXAMPLE_SITE',
      event_name: 'InitiateCheckout',
      event_id: 'event-shared-1',
      event_source_url: 'https://example.com/x9m/oferta?fbclid=TEST_DEDUPE_001',
      action_source: 'website',
      data: expect.objectContaining({
        content_name: 'Example Offer',
        content_ids: ['EXAMPLE_PRODUCT'],
        value: 100,
        currency: 'USD',
      }),
      user_data: {
        fbp: expect.stringMatching(/^fb\.1\.\d+\.\d+$/),
        fbc: expect.stringContaining('TEST_DEDUPE_001'),
      },
    });
    expect(capiPayload).not.toHaveProperty('eventId');
  });

  it('does not synthesize strong conversion events from generic helpers', async () => {
    installBrowserMocks('/x9m/oferta');
    const { buildAttributionEventFields } = await loadAnalytics();

    const fields = buildAttributionEventFields({
      channel: 'ads',
      source: 'route',
      paidPlatform: null,
      landingPath: '/x9m/oferta',
      currentPath: '/x9m/oferta',
      clickIds: {},
      utms: {},
      shouldTrackAds: true,
    });

    expect(Object.values(fields)).not.toContain('Purchase');
    expect(Object.values(fields)).not.toContain('Lead');
    expect(Object.values(fields)).not.toContain('CompleteRegistration');
  });
});
