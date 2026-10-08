import { renderToString } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from '../../App';
import { resolveAttribution } from '../../core/attribution';
import { VisitorProvider } from '../../core/visitor/VisitorContext';
import { buildVisitorPayload } from '../../core/visitor/visitorPayload';
import {
  buildCampaignRegistrationPayload,
  buildPendingConversion,
  getCampaignConfirmationPath,
  readCampaignPendingConversion,
  readCampaignSnapshot,
  shouldTrackCampaignConversion,
  storeCampaignPendingConversion,
  validateCampaignForm,
  writeCampaignSnapshot,
  submitCampaignRegistration,
} from './campaignRegistration';
import { creativeToysCampaign, retoCampaign } from './campaigns';
import { getCreativeToysWhatsAppUrl } from './creativeToysRegistration';
import { getCampaignWhatsAppUrl, scheduleWhatsAppRedirect, WHATSAPP_REDIRECT_DELAY_MS } from './whatsappGroup';

function renderRoute(pathname: string): string {
  return renderToString(
    <MemoryRouter initialEntries={[pathname]}>
      <VisitorProvider><App /></VisitorProvider>
    </MemoryRouter>,
  );
}

function storageMock() {
  const items = new Map<string, string>();
  return {
    getItem: vi.fn((key: string) => items.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => { items.set(key, value); }),
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.useRealTimers();
});

describe('campaign pages and form', () => {
  it.each(['/reto', '/reto/', '/x9m/reto', '/x9m/reto/'])('renders RETO at %s', (path) => {
    const html = renderRoute(path);
    expect(html).toContain('CONQUISTA LA');
    expect(html).toContain('JUGUETERÍA RENTABLE');
    expect(html).toContain('NOMBRE *');
    expect(html).toContain('CORREO ELECTRÓNICO *');
    for (const id of ['reto-hero-form', 'reto-final-form']) {
      const form = html.match(new RegExp(`<form[^>]*id="${id}"[\\s\\S]*?</form>`))![0];
      expect(form).toContain('NOMBRE *');
      expect(form).toContain('CORREO ELECTRÓNICO *');
      expect(form.match(/<input\b/g)).toHaveLength(2);
      expect(form).not.toMatch(/whatsapp|PhoneInput|type="tel"|<select/i);
    }
    expect(html).toContain('¡QUIERO MI LUGAR GRATIS!');
    expect(html).toContain('reto-hero-form');
    expect(html).toContain('reto-final-form');
  });

  it.each(['/confirmacion/reto', '/confirmacion/reto/', '/x9m/confirmacion/reto', '/x9m/confirmacion/reto/'])('renders RETO confirmation at %s', (path) => {
    const html = renderRoute(path);
    expect(html).toContain('Registro confirmado');
    expect(html).toContain('CONQUISTA LA JUGUETERÍA RENTABLE');
  });

  it.each([
    ['/confirmacion/reto', '/confirmacion/500-extra', 'organic'],
    ['/confirmacion/reto/', '/confirmacion/500-extra', 'organic'],
    ['/x9m/confirmacion/reto', '/x9m/confirmacion/500-extra', 'ads'],
    ['/x9m/confirmacion/reto/', '/x9m/confirmacion/500-extra', 'ads'],
  ])('shares the %s WhatsApp destination with 500-extra', (retoPath, legacyPath, group) => {
    vi.stubEnv('VITE_WHATSAPP_GROUP_URL_ORGANIC', 'https://wa.local/organic');
    vi.stubEnv('VITE_WHATSAPP_GROUP_URL_ADS', 'https://wa.local/ads');
    vi.stubEnv('VITE_WHATSAPP_GROUP_URL', 'https://wa.local/fallback');

    const url = `https://wa.local/${group}`;
    expect(getCampaignWhatsAppUrl(retoPath)).toBe(url);
    expect(getCreativeToysWhatsAppUrl(legacyPath)).toBe(url);
    const retoHtml = renderRoute(retoPath);
    if (group === 'organic') {
      expect(retoHtml).toContain(`href="${url}"`);
    } else {
      expect(retoHtml).toContain('disabled=""');
      expect(retoHtml).not.toContain('href="https://wa.local/');
    }
    expect(renderRoute(legacyPath)).toContain(`href="${url}"`);
    expect(retoHtml).toContain('UNIRME AL GRUPO DE WHATSAPP');
    expect(retoHtml).toContain('Te llevaremos automáticamente al grupo de WhatsApp en 5 segundos.');
    expect(retoHtml).not.toContain(`href="https://wa.local/${group === 'ads' ? 'organic' : 'ads'}"`);
  });

  it('keeps the confirmation usable when no WhatsApp group is configured', () => {
    vi.stubEnv('VITE_WHATSAPP_GROUP_URL_ORGANIC', '');
    vi.stubEnv('VITE_WHATSAPP_GROUP_URL_ADS', '');
    vi.stubEnv('VITE_WHATSAPP_GROUP_URL', '');

    for (const path of ['/confirmacion/reto', '/x9m/confirmacion/reto']) {
      const html = renderRoute(path);
      expect(html).toContain('Registro confirmado');
      expect(html).toContain('El enlace al grupo estará disponible pronto.');
      expect(html).not.toContain('UNIRME AL GRUPO DE WHATSAPP');
      expect(html).not.toContain('Te llevaremos automáticamente al grupo');
    }
  });

  it('reads only the RETO snapshot on its confirmation routes', () => {
    const localStorage = storageMock();
    const sessionStorage = storageMock();
    vi.stubGlobal('window', { localStorage, sessionStorage });

    renderRoute('/confirmacion/reto');
    renderRoute('/x9m/confirmacion/reto');

    for (const storage of [localStorage, sessionStorage]) {
      expect(storage.getItem).toHaveBeenCalledWith(retoCampaign.registrationStorageKey);
      expect(storage.getItem).not.toHaveBeenCalledWith(creativeToysCampaign.registrationStorageKey);
      expect(storage.getItem).not.toHaveBeenCalledWith(creativeToysCampaign.pendingConversionStorageKey);
    }
  });

  it('waits five seconds after tracking readiness before redirecting to WhatsApp', () => {
    vi.useFakeTimers();
    const assign = vi.fn();
    const browserWindow = { setTimeout, clearTimeout, location: { assign } };
    const cleanup = scheduleWhatsAppRedirect(browserWindow, 'https://wa.local/ads');

    expect(WHATSAPP_REDIRECT_DELAY_MS).toBe(5000);
    vi.advanceTimersByTime(4999);
    expect(assign).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(assign).toHaveBeenCalledOnce();
    cleanup();
  });

  it('uses the RETO tracking hook before its WhatsApp redirect and stores no group URL in the page', () => {
    const source = readFileSync(join(process.cwd(), 'src/site/pages/RetoConfirmation.tsx'), 'utf8');
    expect(source).toContain('useCampaignConfirmationTracking(retoCampaign, location.pathname)');
    expect(source).toContain('getCampaignWhatsAppUrl(location.pathname)');
    expect(source).toContain('if (!shouldAutoRedirect || !redirectReady)');
    expect(source).toContain('!isAdsRoutePath(location.pathname) || redirectReady');
    expect(source.indexOf('useCampaignConfirmationTracking(retoCampaign')).toBeLessThan(source.indexOf('return scheduleWhatsAppRedirect'));
    expect(source).not.toContain('VITE_WHATSAPP_GROUP_URL');
    expect(source).not.toContain('https://');
  });

  it('preserves the original two-field form and offer route', () => {
    const week = renderRoute('/500-extra');
    expect(week).toContain('500 dólares extras al mes');
    expect(week).toContain('creative-toys-hero-form-name');
    expect(week).toContain('creative-toys-hero-form-email');
    expect(week).not.toContain('creative-toys-hero-form-whatsapp');
    expect(week).toContain('QUIERO REGISTRARME GRATIS');
    const offer = renderRoute('/oferta');
    expect(offer).toContain('397 USD');
    expect(renderRoute('/x9m/oferta')).toContain('397 USD');
  });

  it('validates RETO and 500-extra using only name and email, ignoring hidden WhatsApp', () => {
    for (const campaign of [retoCampaign, creativeToysCampaign]) {
      for (const whatsapp of [undefined, '', '+123', '+593991234567']) {
        expect(validateCampaignForm({ name: 'Pame', email: 'pame@example.com', whatsapp }, campaign)).toEqual({});
      }
      expect(validateCampaignForm({ name: '', email: 'invalid' }, campaign)).toMatchObject({ name: expect.any(String), email: expect.any(String) });
    }
    const values = { name: 'Pame', email: 'pame@example.com', whatsapp: '' };
    expect(validateCampaignForm(values, { ...retoCampaign, whatsapp: 'required' }).whatsapp).toBeTruthy();
    expect(validateCampaignForm(values, { ...retoCampaign, whatsapp: 'optional' })).toEqual({});
  });
});

describe('campaign registration isolation', () => {
  it('builds an isolated RETO payload without phone and preserves channel paths', () => {
    for (const path of ['/reto', '/x9m/reto']) {
      const payload = buildCampaignRegistrationPayload(retoCampaign, {
        name: '  Pame  Flores ',
        email: 'PAME@EXAMPLE.COM',
        whatsapp: '+593991234567',
        attribution: resolveAttribution({ url: `${path}?utm_source=example&fbclid=test`, adsRoutePrefix: '/x9m' }),
        visitorPayload: buildVisitorPayload(null),
        pageUrl: `https://example.test${path}`,
        currentPath: path,
        userAgent: 'test',
        submittedAt: '2026-10-05T00:00:00.000Z',
      });
      expect(payload).toMatchObject({
        name: 'Pame Flores', email: 'pame@example.com',
        campaign_id: 'reto', landing_slug: 'reto', capture_list_slug: 'reto', list: 'reto',
        event_name: 'CONQUISTA LA JUGUETERÍA RENTABLE',
        traffic_channel: path.startsWith('/x9m') ? 'ads' : 'organic',
        confirmation_path: path.startsWith('/x9m') ? '/x9m/confirmacion/reto' : '/confirmacion/reto',
        utms: { utm_source: 'example' }, click_ids: { fbclid: 'test' },
      });
      expect(payload).not.toHaveProperty('whatsapp');
      expect(payload).not.toHaveProperty('phone');
      expect(payload).not.toHaveProperty('mobile');
      expect(payload.visitor).toHaveProperty('country_calling_code');
    }
    expect(getCampaignConfirmationPath(retoCampaign, '/x9m/reto/')).toBe('/x9m/confirmacion/reto');
  });

  it.each([
    [retoCampaign, '/reto'], [retoCampaign, '/x9m/reto'],
    [creativeToysCampaign, '/500-extra'], [creativeToysCampaign, '/x9m/500-extra'],
  ])('submits %s at %s without any phone properties and preserves CRM attribution', async (campaign, path) => {
    const query = '?utm_source=email&utm_medium=newsletter&utm_campaign=campaign&utm_content=banner&utm_term=craft&fbclid=F&gclid=G&ttclid=T';
    const url = `https://pameflorescrea.com${path}${query}`;
    const fields = { utm_source: 'email', utm_medium: 'newsletter', utm_campaign: 'campaign', utm_content: 'banner', utm_term: 'craft' };
    const payload = buildCampaignRegistrationPayload(campaign, {
      name: 'Pame', email: 'pame@example.com',
      attribution: resolveAttribution({ url, adsRoutePrefix: '/x9m' }),
      visitorPayload: buildVisitorPayload(null), pageUrl: url,
      currentPath: path, userAgent: 'test', submittedAt: '2026-10-08T00:00:00.000Z',
      referrer: 'https://www.youtube.com/watch?v=test',
    });
    expect(validateCampaignForm({ name: payload.name, email: payload.email }, campaign)).toEqual({});
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, clone: () => ({ json: async () => ({ ok: true }) }) });
    vi.stubGlobal('fetch', fetchMock);
    await submitCampaignRegistration(payload);
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    for (const key of ['whatsapp', 'phone', 'mobile']) expect(sent).not.toHaveProperty(key);
    expect(sent).toMatchObject({
      ...fields, fbclid: 'F', gclid: 'G', ttclid: 'T', landing_path: path,
      referrer_source: 'youtube', referrer_domain: 'youtube.com', referrer_origin: 'https://www.youtube.com',
      utms: fields, click_ids: { fbclid: 'F', gclid: 'G', ttclid: 'T' },
      attribution: { traffic_channel: path.startsWith('/x9m') ? 'ads' : 'organic', utms: fields, click_ids: { fbclid: 'F', gclid: 'G', ttclid: 'T' } },
    });
    for (const whatsapp of ['', '+123', '+593991234567']) {
      const ignored = buildCampaignRegistrationPayload(campaign, {
        name: 'Pame', email: 'pame@example.com', whatsapp,
        attribution: resolveAttribution({ url }), visitorPayload: buildVisitorPayload(null),
        pageUrl: url, currentPath: path, userAgent: 'test', submittedAt: 'now',
      });
      for (const key of ['whatsapp', 'phone', 'mobile']) expect(ignored).not.toHaveProperty(key);
    }
  });

  it('stores snapshots and pending conversions under independent keys', () => {
    const localStorage = storageMock();
    const sessionStorage = storageMock();
    vi.stubGlobal('window', { localStorage, sessionStorage });
    const snapshot = { lead_name: 'Pame', lead_email: 'pame@example.com', registered_at: 'now', source_path: '/reto' };
    writeCampaignSnapshot(retoCampaign, snapshot);
    expect(readCampaignSnapshot(retoCampaign)).toEqual(snapshot);
    expect(readCampaignSnapshot(creativeToysCampaign)).toBeNull();
    const pending = buildPendingConversion(retoCampaign, {
      captureOk: true, currentPath: '/x9m/reto', confirmationPath: '/x9m/confirmacion/reto',
      name: 'Pame', email: 'pame@example.com', registeredAt: 'now', eventId: 'pame_reto_test',
    })!;
    storeCampaignPendingConversion(retoCampaign, pending);
    expect(readCampaignPendingConversion(retoCampaign)).toEqual(pending);
    expect(readCampaignPendingConversion(creativeToysCampaign)).toBeNull();
    expect(localStorage.setItem).toHaveBeenCalledWith(retoCampaign.pendingConversionStorageKey, JSON.stringify(pending));
  });

  it('only prepares CompleteRegistration for the matching ads confirmation', () => {
    const ads = buildPendingConversion(retoCampaign, {
      captureOk: true, currentPath: '/x9m/reto', confirmationPath: '/x9m/confirmacion/reto',
      name: 'Pame', email: 'pame@example.com', registeredAt: 'now',
    })!;
    const config = { metaPixelId: 'test' };
    expect(ads.event_id).toMatch(/^pame_reto_/);
    expect(shouldTrackCampaignConversion(retoCampaign, '/x9m/confirmacion/reto', ads, config)).toBe(true);
    expect(shouldTrackCampaignConversion(retoCampaign, '/confirmacion/reto', ads, config)).toBe(false);
    expect(shouldTrackCampaignConversion(creativeToysCampaign, '/x9m/confirmacion/500-extra', ads, config)).toBe(false);
    expect(buildPendingConversion(retoCampaign, {
      captureOk: true, currentPath: '/reto', confirmationPath: '/confirmacion/reto',
      name: 'Pame', email: 'pame@example.com', registeredAt: 'now',
    })).toBeNull();
  });
});
