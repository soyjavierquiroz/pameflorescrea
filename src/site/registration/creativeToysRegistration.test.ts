import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { resolveAttribution } from '../../core/attribution';
import { buildVisitorPayload } from '../../core/visitor/visitorPayload';
import {
  buildCreativeToysRegistrationPayload,
  CREATIVE_TOYS_ASSETS,
  CREATIVE_TOYS_EVENT_NAME,
  CREATIVE_TOYS_LEAD_EVENT_NAME,
  CREATIVE_TOYS_WHATSAPP_REDIRECT_DELAY_MS,
  getCreativeToysWhatsAppUrl,
  getCreativeToysNavigationTargetAfterCapture,
  getCreativeToysConfirmationPath,
  isCreativeToysCaptureOk,
  scheduleCreativeToysWhatsAppRedirect,
  shouldAutoRedirectToCreativeToysWhatsApp,
  shouldTrackCreativeToysLead,
  validateCreativeToysForm,
} from './creativeToysRegistration';

const trackingConfigured = {
  capiWebhookUrl: 'https://relay.example/events',
  metaPixelId: '123456789',
  tiktokPixelId: '',
};

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

describe('creative toys registration helpers', () => {
  it('validates required name', () => {
    expect(validateCreativeToysForm({ name: '', email: 'pame@example.com' })).toMatchObject({
      name: 'Escribe tu nombre para poder registrarte.',
    });
    expect(validateCreativeToysForm({ name: 'A', email: 'pame@example.com' })).toMatchObject({
      name: 'Escribe tu nombre para poder registrarte.',
    });
  });

  it('validates email format', () => {
    expect(validateCreativeToysForm({ name: 'Pame', email: '' })).toMatchObject({
      email: 'Escribe tu correo para recibir el acceso.',
    });
    expect(validateCreativeToysForm({ name: 'Pame', email: 'pame.test' })).toMatchObject({
      email: 'Revisa que tu correo tenga un formato válido.',
    });
  });

  it('resolves confirmation paths for organic and ads routes', () => {
    expect(getCreativeToysConfirmationPath('/500-extra')).toBe('/confirmacion/500-extra');
    expect(getCreativeToysConfirmationPath('/x9m/500-extra')).toBe(
      '/x9m/confirmacion/500-extra',
    );
  });

  it('does not navigate when capture fails', () => {
    const captureOk = isCreativeToysCaptureOk(false, { ok: false });

    expect(captureOk).toBe(false);
    expect(getCreativeToysNavigationTargetAfterCapture(captureOk, '/500-extra')).toBeNull();
  });

  it('navigates to confirmation when capture succeeds', () => {
    const captureOk = isCreativeToysCaptureOk(true, { ok: true });

    expect(captureOk).toBe(true);
    expect(getCreativeToysNavigationTargetAfterCapture(captureOk, '/500-extra')).toBe(
      '/confirmacion/500-extra',
    );
    expect(getCreativeToysNavigationTargetAfterCapture(captureOk, '/x9m/500-extra')).toBe(
      '/x9m/confirmacion/500-extra',
    );
  });

  it('builds the capture.php payload with path-based traffic channel', () => {
    const attribution = resolveAttribution({
      url: '/500-extra?fbclid=paid-click&utm_medium=paid',
      adsRoutePrefix: '/x9m',
    });
    const visitorPayload = buildVisitorPayload({
      ip: '203.0.113.1',
      city: 'Quito',
      region: 'Pichincha',
      country_name: 'Ecuador',
      country_code: 'EC',
      timezone: 'America/Guayaquil',
      currency: 'USD',
      country_calling_code: '+593',
    });

    const payload = buildCreativeToysRegistrationPayload({
      name: '  Pame   Flores ',
      email: 'PAME@EXAMPLE.COM',
      attribution,
      visitorPayload,
      pageUrl: 'https://pameflorescrea.com/500-extra?fbclid=paid-click&utm_medium=paid',
      currentPath: '/500-extra',
      userAgent: 'vitest',
      submittedAt: '2026-06-17T00:00:00.000Z',
    });

    expect(payload).toMatchObject({
      name: 'Pame Flores',
      first_name: 'Pame Flores',
      email: 'pame@example.com',
      traffic_channel: 'organic',
      capture_list_slug: '500-extra',
      list: '500-extra',
      landing_slug: '500-extra',
      event_name: CREATIVE_TOYS_EVENT_NAME,
      source: 'pameflorescrea.com',
      current_path: '/500-extra',
      confirmation_path: '/confirmacion/500-extra',
      user_agent: 'vitest',
      visitor_ip: '203.0.113.1',
      visitor_city: 'Quito',
    });
    expect(payload.attribution).toMatchObject({
      traffic_channel: 'organic',
      click_ids: { fbclid: 'paid-click' },
      should_track_ads: false,
    });
  });

  it('builds ads payload and confirmation path under /x9m', () => {
    const attribution = resolveAttribution({
      url: '/x9m/500-extra?fbclid=paid-click',
      adsRoutePrefix: '/x9m',
    });

    const payload = buildCreativeToysRegistrationPayload({
      name: 'Pame',
      email: 'pame@example.com',
      attribution,
      visitorPayload: buildVisitorPayload(null),
      pageUrl: 'https://pameflorescrea.com/x9m/500-extra?fbclid=paid-click',
      currentPath: '/x9m/500-extra',
      userAgent: 'vitest',
      submittedAt: '2026-06-17T00:00:00.000Z',
    });

    expect(payload.traffic_channel).toBe('ads');
    expect(payload.confirmation_path).toBe('/x9m/confirmacion/500-extra');
  });

  it('only allows Lead tracking after capture OK, under ads path, and with tracking configured', () => {
    const adsAttribution = resolveAttribution({
      url: '/x9m/500-extra?fbclid=paid-click',
      adsRoutePrefix: '/x9m',
    });
    const organicAttribution = resolveAttribution({
      url: '/500-extra?fbclid=paid-click&utm_medium=paid',
      adsRoutePrefix: '/x9m',
    });

    expect(shouldTrackCreativeToysLead(adsAttribution, false, trackingConfigured)).toBe(false);
    expect(shouldTrackCreativeToysLead(organicAttribution, true, trackingConfigured)).toBe(false);
    expect(shouldTrackCreativeToysLead(adsAttribution, true, {
      capiWebhookUrl: '',
      metaPixelId: '',
      tiktokPixelId: '',
    })).toBe(false);
    expect(shouldTrackCreativeToysLead(adsAttribution, true, trackingConfigured)).toBe(true);
  });

  it('uses the organic WhatsApp URL on the organic confirmation route', () => {
    vi.stubEnv('VITE_WHATSAPP_GROUP_URL_ORGANIC', '  https://wa.local/organic  ');
    vi.stubEnv('VITE_WHATSAPP_GROUP_URL_ADS', 'https://wa.local/ads');
    vi.stubEnv('VITE_WHATSAPP_GROUP_URL', 'https://wa.local/fallback');

    expect(getCreativeToysWhatsAppUrl('/confirmacion/500-extra')).toBe(
      'https://wa.local/organic',
    );
  });

  it('uses the ads WhatsApp URL on the ads confirmation route', () => {
    vi.stubEnv('VITE_WHATSAPP_GROUP_URL_ORGANIC', 'https://wa.local/organic');
    vi.stubEnv('VITE_WHATSAPP_GROUP_URL_ADS', 'https://wa.local/ads');
    vi.stubEnv('VITE_WHATSAPP_GROUP_URL', 'https://wa.local/fallback');

    expect(getCreativeToysWhatsAppUrl('/x9m/confirmacion/500-extra')).toBe(
      'https://wa.local/ads',
    );
  });

  it('falls back to the shared WhatsApp URL when the specific URL is empty', () => {
    vi.stubEnv('VITE_WHATSAPP_GROUP_URL_ORGANIC', '');
    vi.stubEnv('VITE_WHATSAPP_GROUP_URL_ADS', '');
    vi.stubEnv('VITE_WHATSAPP_GROUP_URL', 'https://wa.local/fallback');

    expect(getCreativeToysWhatsAppUrl('/confirmacion/500-extra')).toBe(
      'https://wa.local/fallback',
    );
    expect(getCreativeToysWhatsAppUrl('/x9m/confirmacion/500-extra')).toBe(
      'https://wa.local/fallback',
    );
  });

  it('returns no WhatsApp URL and disables redirect when all WhatsApp env values are empty', () => {
    vi.stubEnv('VITE_WHATSAPP_GROUP_URL_ORGANIC', '');
    vi.stubEnv('VITE_WHATSAPP_GROUP_URL_ADS', '');
    vi.stubEnv('VITE_WHATSAPP_GROUP_URL', '');

    const whatsappUrl = getCreativeToysWhatsAppUrl('/confirmacion/500-extra');

    expect(whatsappUrl).toBe('');
    expect(shouldAutoRedirectToCreativeToysWhatsApp(whatsappUrl)).toBe(false);
  });

  it('schedules the WhatsApp redirect at 5000ms and not before', () => {
    vi.useFakeTimers();
    const assign = vi.fn();
    const browserWindow = {
      clearTimeout: globalThis.clearTimeout,
      location: { assign },
      setTimeout: globalThis.setTimeout,
    } as unknown as Window;

    const cleanup = scheduleCreativeToysWhatsAppRedirect(browserWindow, 'https://wa.local/organic');

    expect(CREATIVE_TOYS_WHATSAPP_REDIRECT_DELAY_MS).toBe(5000);
    vi.advanceTimersByTime(4999);
    expect(assign).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(assign).toHaveBeenCalledWith('https://wa.local/organic');

    cleanup();
  });

  it('cleans up the pending WhatsApp redirect timer', () => {
    vi.useFakeTimers();
    const assign = vi.fn();
    const browserWindow = {
      clearTimeout: globalThis.clearTimeout,
      location: { assign },
      setTimeout: globalThis.setTimeout,
    } as unknown as Window;

    const cleanup = scheduleCreativeToysWhatsAppRedirect(browserWindow, 'https://wa.local/organic');
    cleanup();
    vi.advanceTimersByTime(CREATIVE_TOYS_WHATSAPP_REDIRECT_DELAY_MS);

    expect(assign).not.toHaveBeenCalled();
  });

  it('does not define checkout or purchase conversion events', () => {
    expect(CREATIVE_TOYS_LEAD_EVENT_NAME).toBe('Lead');
    expect(CREATIVE_TOYS_LEAD_EVENT_NAME).not.toBe('InitiateCheckout');
    expect(CREATIVE_TOYS_LEAD_EVENT_NAME).not.toBe('Purchase');
    expect(CREATIVE_TOYS_LEAD_EVENT_NAME).not.toBe('CompleteRegistration');
  });

  it('references local assets that exist', () => {
    const publicDir = join(process.cwd(), 'public');
    const assetPaths = [
      CREATIVE_TOYS_ASSETS.banner,
      CREATIVE_TOYS_ASSETS.hero,
      CREATIVE_TOYS_ASSETS.heroFallback,
      CREATIVE_TOYS_ASSETS.toys,
      CREATIVE_TOYS_ASSETS.portrait,
      CREATIVE_TOYS_ASSETS.portraitFallback,
      CREATIVE_TOYS_ASSETS.logo,
      CREATIVE_TOYS_ASSETS.legacyLogo,
      ...CREATIVE_TOYS_ASSETS.classImages,
      ...CREATIVE_TOYS_ASSETS.galleryImages,
    ];

    expect(CREATIVE_TOYS_ASSETS.classImages).toHaveLength(4);
    expect(CREATIVE_TOYS_ASSETS.galleryImages).toHaveLength(10);
    for (const assetPath of assetPaths) {
      expect(assetPath.startsWith('/assets/pame-flores-crea/500-extra/')).toBe(true);
      expect(existsSync(join(publicDir, assetPath))).toBe(true);
    }
  });

  it('uses the approved VIP image and removes the sensitive creative toys image', () => {
    const publicDir = join(process.cwd(), 'public');
    const sensitiveImageName = ['juguetes', 'creativos'].join('-');
    const sourceFiles = [
      'src/site/registration/creativeToysRegistration.ts',
      'src/site/pages/CreativeToysWeekConfirmation.tsx',
      'src/site/pages/CreativeToysWeekLanding.tsx',
      'src/site/registration/creativeToysRegistration.test.ts',
    ];

    expect(CREATIVE_TOYS_ASSETS.toys).toBe(
      '/assets/pame-flores-crea/500-extra/pame-vip-creativa.webp',
    );
    expect(existsSync(join(publicDir, CREATIVE_TOYS_ASSETS.toys))).toBe(true);
    expect(
      existsSync(join(publicDir, `assets/pame-flores-crea/500-extra/${sensitiveImageName}.webp`)),
    ).toBe(false);
    for (const sourceFile of sourceFiles) {
      expect(readFileSync(join(process.cwd(), sourceFile), 'utf8')).not.toContain(
        sensitiveImageName,
      );
    }
  });

  it('references class and gallery assets with the expected filenames', () => {
    expect(CREATIVE_TOYS_ASSETS.classImages).toEqual([
      '/assets/pame-flores-crea/500-extra/classes/class-1.webp',
      '/assets/pame-flores-crea/500-extra/classes/class-2.webp',
      '/assets/pame-flores-crea/500-extra/classes/class-3.webp',
      '/assets/pame-flores-crea/500-extra/classes/class-4.webp',
    ]);

    expect(CREATIVE_TOYS_ASSETS.galleryImages[0]).toBe(
      '/assets/pame-flores-crea/500-extra/gallery/gallery-01.jpg',
    );
    expect(CREATIVE_TOYS_ASSETS.galleryImages[9]).toBe(
      '/assets/pame-flores-crea/500-extra/gallery/gallery-10.jpg',
    );
  });
});
