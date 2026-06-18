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
      tiktokSent: false,
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
      tiktokSent: false,
    });
    expect(scripts.size).toBe(0);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('does not send organic CompleteRegistration even with fbclid and paid UTMs', async () => {
    const { appendChild, fetchMock, scripts, windowMock } = installBrowserMocks(
      '/confirmacion/500-extra?fbclid=test&utm_source=meta&utm_medium=paid',
    );
    const { trackEvent } = await loadAnalytics();

    const result = await trackEvent('CompleteRegistration', {
      event_id: 'pame_500_extra_organic',
    });

    expect(result).toMatchObject({
      eventName: 'CompleteRegistration',
      capiAttempted: false,
      capiSent: false,
      metaBrowserAttempted: false,
      metaBrowserSent: false,
      tiktokAttempted: false,
      tiktokSent: false,
    });
    expect(scripts.size).toBe(0);
    expect(appendChild).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(windowMock).not.toHaveProperty('fbq');
  });

  it('loads pixels and calls CAPI under the ads prefix', async () => {
    const { fetchMock, scripts } = installBrowserMocks('/x9m/500-extra?fbclid=test');
    const { trackEvent } = await loadAnalytics();

    await expect(trackEvent('PageView')).resolves.toMatchObject({
      capiSent: true,
      metaBrowserSent: true,
      tiktokSent: true,
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

    await expect(
      trackEvent('CompleteRegistration', { event_id: 'pame_500_extra_test' }),
    ).resolves.toMatchObject({
      capiSent: false,
      metaBrowserSent: false,
      tiktokSent: false,
    });
    expect(scripts.size).toBe(0);
    expect(appendChild).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(windowMock).not.toHaveProperty('fbq');
  });

  it('returns metaBrowserSent true when CompleteRegistration invokes fbq under /x9m', async () => {
    const { fetchMock, windowMock } = installBrowserMocks('/x9m/confirmacion/500-extra');
    const { trackEvent } = await loadAnalytics({
      capiWebhookUrl: '',
      metaPixelId: '123456789',
      siteId: 'PAME_FLORES_CREA',
      tiktokPixelId: '',
    });

    const result = await trackEvent('CompleteRegistration', {
      event_id: 'pame_500_extra_browser_only',
    });

    expect(result).toMatchObject({
      eventName: 'CompleteRegistration',
      eventId: 'pame_500_extra_browser_only',
      metaBrowserAttempted: true,
      metaBrowserSent: true,
      capiAttempted: false,
      capiSent: false,
    });
    expect((windowMock as { fbq?: { queue?: unknown[] } }).fbq?.queue).toContainEqual([
      'track',
      'CompleteRegistration',
      expect.objectContaining({
        current_path: '/x9m/confirmacion/500-extra',
        traffic_channel: 'ads',
      }),
      { eventID: 'pame_500_extra_browser_only' },
    ]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns capiSent true only when the relay responds OK', async () => {
    const { fetchMock } = installBrowserMocks('/x9m/confirmacion/500-extra');
    const { trackEvent } = await loadAnalytics({
      capiWebhookUrl: 'https://relay.example/v1/events',
      metaPixelId: '',
      siteId: 'PAME_FLORES_CREA',
      tiktokPixelId: '',
    });

    await expect(
      trackEvent('CompleteRegistration', { event_id: 'pame_500_extra_capi_ok' }),
    ).resolves.toMatchObject({
      capiAttempted: true,
      capiSent: true,
      metaBrowserAttempted: false,
      metaBrowserSent: false,
    });
    expect(fetchMock).toHaveBeenCalledWith(
      'https://relay.example/v1/events',
      expect.objectContaining({
        keepalive: true,
        method: 'POST',
      }),
    );
  });

  it('returns capiSent false when the relay responds with a non-OK status', async () => {
    const { fetchMock } = installBrowserMocks('/x9m/confirmacion/500-extra');
    fetchMock.mockResolvedValueOnce({ ok: false, status: 500 });
    const { trackEvent } = await loadAnalytics({
      capiWebhookUrl: 'https://relay.example/v1/events',
      metaPixelId: '',
      siteId: 'PAME_FLORES_CREA',
      tiktokPixelId: '',
    });

    const result = await trackEvent('CompleteRegistration', {
      event_id: 'pame_500_extra_capi_500',
    });

    expect(result).toMatchObject({
      capiAttempted: true,
      capiSent: false,
      metaBrowserSent: false,
    });
    expect(result.errors).toContainEqual({
      provider: 'capi',
      message: 'CAPI relay responded with status 500.',
    });
  });

  it('returns capiSent false when the relay fetch throws', async () => {
    const { fetchMock } = installBrowserMocks('/x9m/confirmacion/500-extra');
    fetchMock.mockRejectedValueOnce(new Error('Network failed for https://relay.example/v1/events'));
    const { trackEvent } = await loadAnalytics({
      capiWebhookUrl: 'https://relay.example/v1/events',
      metaPixelId: '',
      siteId: 'PAME_FLORES_CREA',
      tiktokPixelId: '',
    });

    const result = await trackEvent('CompleteRegistration', {
      event_id: 'pame_500_extra_capi_error',
    });

    expect(result).toMatchObject({
      capiAttempted: true,
      capiSent: false,
      metaBrowserSent: false,
    });
    expect(result.errors?.[0]).toMatchObject({
      provider: 'capi',
      message: 'Network failed for [url]',
    });
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

  it('uses a supplied CompleteRegistration event_id for Meta Pixel and CAPI dedupe', async () => {
    const { fetchMock, windowMock } = installBrowserMocks(
      '/x9m/confirmacion/500-extra?fbclid=TEST_REGISTRATION_001',
    );
    const { trackEvent } = await loadAnalytics({
      capiWebhookUrl: 'https://relay.example/v1/events',
      metaPixelId: '123456789',
      siteId: 'PAME_FLORES_CREA',
      tiktokPixelId: '',
    });

    const result = await trackEvent('CompleteRegistration', {
      event_id: 'pame_500_extra_stable_event',
      lead: {
        nombre: 'Pame',
        email: 'pame@example.com',
      },
      confirmation_path: '/x9m/confirmacion/500-extra',
    });

    expect(result).toMatchObject({
      eventId: 'pame_500_extra_stable_event',
      capiSent: true,
      metaBrowserSent: true,
      tiktokSent: false,
    });
    expect((windowMock as { fbq?: { queue?: unknown[] } }).fbq?.queue).toContainEqual([
      'track',
      'CompleteRegistration',
      expect.objectContaining({
        confirmation_path: '/x9m/confirmacion/500-extra',
        lead: {
          nombre: 'Pame',
          email: 'pame@example.com',
        },
      }),
      { eventID: 'pame_500_extra_stable_event' },
    ]);

    const capiPayload = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));

    expect(capiPayload).toMatchObject({
      event_name: 'CompleteRegistration',
      event_id: 'pame_500_extra_stable_event',
      event_source_url:
        'https://example.com/x9m/confirmacion/500-extra?fbclid=TEST_REGISTRATION_001',
      action_source: 'website',
      data: expect.objectContaining({
        confirmation_path: '/x9m/confirmacion/500-extra',
        current_path: '/x9m/confirmacion/500-extra',
        traffic_channel: 'ads',
      }),
      user_data: expect.objectContaining({
        client_user_agent: 'vitest',
        fbp: expect.stringMatching(/^fb\.1\.\d+\.\d+$/),
        fbc: expect.stringContaining('TEST_REGISTRATION_001'),
        em: expect.stringMatching(/^[a-f0-9]{64}$/),
        fn: expect.stringMatching(/^[a-f0-9]{64}$/),
      }),
    });
    expect(capiPayload.data).not.toHaveProperty('event_id');
    expect(capiPayload.data).not.toHaveProperty('eventId');
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

describe('Meta ads PageView bootstrap', () => {
  it('initializes Meta Pixel and sends PageView under /x9m/500-extra', async () => {
    const { fetchMock, scripts, windowMock } = installBrowserMocks(
      '/x9m/500-extra?fbclid=test',
    );
    const { trackMetaPageView } = await loadAnalytics({
      capiWebhookUrl: 'https://relay.example/v1/events',
      metaPixelId: '123456789',
      siteId: 'PAME_FLORES_CREA',
      tiktokPixelId: '',
    });

    await expect(trackMetaPageView()).resolves.toBe(true);

    expect(scripts.get('boilerplate-meta-pixel-script')?.src).toBe(
      'https://connect.facebook.net/en_US/fbevents.js',
    );
    expect(scripts.has('boilerplate-tiktok-pixel-script')).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
    expect((windowMock as { fbq?: { queue?: unknown[] } }).fbq?.queue).toEqual([
      ['init', '123456789'],
      ['track', 'PageView'],
    ]);
  });

  it('does not initialize Meta Pixel outside /x9m even with paid query params', async () => {
    const { appendChild, fetchMock, scripts, windowMock } = installBrowserMocks(
      '/500-extra?fbclid=test&utm_medium=paid',
    );
    const { trackMetaPageView } = await loadAnalytics();

    await expect(trackMetaPageView()).resolves.toBe(false);

    expect(scripts.size).toBe(0);
    expect(appendChild).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(windowMock).not.toHaveProperty('fbq');
  });

  it('allows Meta PageView on ads confirmation routes', async () => {
    const { scripts, windowMock } = installBrowserMocks('/x9m/confirmacion/500-extra');
    const { trackMetaPageView } = await loadAnalytics({
      capiWebhookUrl: '',
      metaPixelId: '123456789',
      siteId: 'PAME_FLORES_CREA',
      tiktokPixelId: '',
    });

    await expect(trackMetaPageView()).resolves.toBe(true);

    expect(scripts.has('boilerplate-meta-pixel-script')).toBe(true);
    expect((windowMock as { fbq?: { queue?: unknown[] } }).fbq?.queue).toContainEqual([
      'track',
      'PageView',
    ]);
  });

  it('does not initialize Meta Pixel on ads routes when the Pixel ID is empty', async () => {
    const { appendChild, fetchMock, scripts, windowMock } =
      installBrowserMocks('/x9m/500-extra');
    const { trackMetaPageView } = await loadAnalytics({
      capiWebhookUrl: 'https://relay.example/v1/events',
      metaPixelId: '',
      siteId: 'PAME_FLORES_CREA',
      tiktokPixelId: '',
    });

    await expect(trackMetaPageView()).resolves.toBe(false);

    expect(scripts.size).toBe(0);
    expect(appendChild).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(windowMock).not.toHaveProperty('fbq');
  });

  it('does not emit conversion events during the Meta PageView bootstrap', async () => {
    const { fetchMock, windowMock } = installBrowserMocks('/x9m/500-extra');
    const { trackMetaPageView } = await loadAnalytics({
      capiWebhookUrl: 'https://relay.example/v1/events',
      metaPixelId: '123456789',
      siteId: 'PAME_FLORES_CREA',
      tiktokPixelId: '',
    });

    await trackMetaPageView();

    const fbqQueue = (windowMock as { fbq?: { queue?: unknown[] } }).fbq?.queue ?? [];
    expect(fbqQueue).not.toContainEqual(expect.arrayContaining(['Lead']));
    expect(fbqQueue).not.toContainEqual(expect.arrayContaining(['InitiateCheckout']));
    expect(fbqQueue).not.toContainEqual(expect.arrayContaining(['Purchase']));
    expect(fbqQueue).not.toContainEqual(expect.arrayContaining(['CompleteRegistration']));
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
