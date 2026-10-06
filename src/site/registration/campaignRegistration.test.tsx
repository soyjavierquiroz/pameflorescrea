import { renderToString } from 'react-dom/server';
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
} from './campaignRegistration';
import { creativeToysCampaign, retoCampaign } from './campaigns';

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

afterEach(() => vi.unstubAllGlobals());

describe('campaign pages and form', () => {
  it.each(['/reto', '/reto/', '/x9m/reto', '/x9m/reto/'])('renders RETO at %s', (path) => {
    const html = renderRoute(path);
    expect(html).toContain('CONQUISTA LA');
    expect(html).toContain('JUGUETERÍA RENTABLE');
    expect(html).toContain('NOMBRE *');
    expect(html).toContain('CORREO ELECTRÓNICO *');
    expect(html).toContain('WhatsApp');
    expect(html).toContain('¡QUIERO MI LUGAR GRATIS!');
    expect(html).toContain('reto-hero-form');
    expect(html).toContain('reto-final-form');
  });

  it.each(['/confirmacion/reto', '/confirmacion/reto/', '/x9m/confirmacion/reto', '/x9m/confirmacion/reto/'])('renders RETO confirmation at %s', (path) => {
    const html = renderRoute(path);
    expect(html).toContain('Registro confirmado');
    expect(html).toContain('CONQUISTA LA JUGUETERÍA RENTABLE');
    expect(html).not.toContain('Te llevaremos automáticamente al grupo');
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

  it('requires a valid international WhatsApp for RETO and supports optional mode', () => {
    const values = { name: 'Pame', email: 'pame@example.com', whatsapp: '' };
    expect(validateCampaignForm(values, retoCampaign).whatsapp).toBeTruthy();
    expect(validateCampaignForm({ ...values, whatsapp: '+123' }, retoCampaign).whatsapp).toBeTruthy();
    expect(validateCampaignForm({ ...values, whatsapp: '+593991234567' }, retoCampaign).whatsapp).toBeUndefined();
    expect(validateCampaignForm(values, { ...retoCampaign, whatsapp: 'optional' }).whatsapp).toBeUndefined();
    expect(validateCampaignForm(values, creativeToysCampaign).whatsapp).toBeUndefined();
  });
});

describe('campaign registration isolation', () => {
  it('builds an isolated RETO payload with WhatsApp and channel paths', () => {
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
        name: 'Pame Flores', email: 'pame@example.com', whatsapp: '+593991234567',
        campaign_id: 'reto', landing_slug: 'reto', capture_list_slug: 'reto', list: 'reto',
        event_name: 'CONQUISTA LA JUGUETERÍA RENTABLE',
        traffic_channel: path.startsWith('/x9m') ? 'ads' : 'organic',
        confirmation_path: path.startsWith('/x9m') ? '/x9m/confirmacion/reto' : '/confirmacion/reto',
        utms: { utm_source: 'example' }, click_ids: { fbclid: 'test' },
      });
      expect(payload).not.toHaveProperty('phone');
      expect(payload).not.toHaveProperty('mobile');
      expect(payload.visitor).toHaveProperty('country_calling_code');
    }
    expect(getCampaignConfirmationPath(retoCampaign, '/x9m/reto/')).toBe('/x9m/confirmacion/reto');
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
