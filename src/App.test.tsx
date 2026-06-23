import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { VisitorProvider } from './core/visitor/VisitorContext';
import {
  buildTemporaryOfferCheckoutEventData,
  shouldTrackTemporaryOfferCheckout,
  TEMPORARY_OFFER_CHECKOUT_URL,
} from './site/registration/creativeToysOfferTemporary';

function renderRoute(pathname: string): string {
  return renderToString(
    <MemoryRouter initialEntries={[pathname]}>
      <VisitorProvider>
        <App />
      </VisitorProvider>
    </MemoryRouter>,
  );
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('App routes', () => {
  it('redirects / to the organic creative toys landing', () => {
    const appSource = readFileSync(join(process.cwd(), 'src/App.tsx'), 'utf8');

    expect(appSource).toContain('<Route path="/" element={<Navigate to="/500-extra" replace />} />');
    expect(renderRoute('/')).not.toContain('Sitio en preparacion');
  });

  it('keeps the preparation page at /x9m', () => {
    expect(renderRoute('/x9m')).toContain('Sitio en preparacion');
  });

  it('renders the creative toys landing at /500-extra', () => {
    const html = renderRoute('/500-extra');

    expect(html).toContain('Descubre cómo generar desde');
    expect(html).toContain(
      'Es tu momento de construir un proyecto propio que transforme tu amor por los niños',
    );
    expect(html).toContain('Una experiencia creativa para empezar con ilusión');
    expect(html).toContain('¡Hola, soy Pame Flores!');
    expect(html).toContain('Academia de Juguetería Creativa');
  });

  it('renders the creative toys landing at /x9m/500-extra', () => {
    expect(renderRoute('/x9m/500-extra')).toContain(
      'SEMANA DEL EMPRENDIMIENTO CON JUGUETES CREATIVOS',
    );
  });

  it('renders the temporary creative toys offer at /temporal', () => {
    const html = renderRoute('/temporal');

    expect(html).toContain('Certificación J.C.P.');
    expect(html).toContain('Descubre la manera más simple y rápida');
    expect(html).toContain('QUIERO INSCRIBIRME AHORA');
    expect(html).toContain(`href="${TEMPORARY_OFFER_CHECKOUT_URL}"`);
    expect(html).toContain('Si estás en Ecuador y deseas pagar con depósito');
    expect(html).not.toContain('Bolivia');
  });

  it('renders the temporary creative toys offer at /x9m/temporal', () => {
    const html = renderRoute('/x9m/temporal');

    expect(html).toContain('Certificación de Juguetería Creativa Profesional');
    expect(html).toContain(`href="${TEMPORARY_OFFER_CHECKOUT_URL}"`);
  });

  it('keeps temporary offer checkout tracking disabled outside the ads route', () => {
    expect(shouldTrackTemporaryOfferCheckout('/temporal')).toBe(false);
    expect(shouldTrackTemporaryOfferCheckout('/temporal?fbclid=paid-click')).toBe(false);
  });

  it('allows only InitiateCheckout preparation under the ads temporary route', () => {
    const payload = buildTemporaryOfferCheckoutEventData({
      eventId: 'event-test-1',
      eventSourceUrl: 'https://pameflorescrea.com/x9m/temporal?fbclid=test',
    });

    expect(shouldTrackTemporaryOfferCheckout('/x9m/temporal')).toBe(true);
    expect(payload).toMatchObject({
      event_id: 'event-test-1',
      event_source_url: 'https://pameflorescrea.com/x9m/temporal?fbclid=test',
      offer_slug: 'certificacion-jugueteria-creativa',
      checkout_url: TEMPORARY_OFFER_CHECKOUT_URL,
      value: 197,
      currency: 'USD',
    });
    expect(Object.values(payload)).not.toContain('Purchase');
    expect(Object.values(payload)).not.toContain('CompleteRegistration');
    expect(Object.values(payload)).not.toContain('Lead');
  });

  it('renders the confirmation page at /confirmacion/500-extra', () => {
    expect(renderRoute('/confirmacion/500-extra')).toContain('Registro confirmado');
  });

  it('renders the WhatsApp button when the organic group URL is configured', () => {
    vi.stubEnv('VITE_WHATSAPP_GROUP_URL_ORGANIC', 'https://wa.local/organic');
    vi.stubEnv('VITE_WHATSAPP_GROUP_URL_ADS', '');
    vi.stubEnv('VITE_WHATSAPP_GROUP_URL', '');

    const html = renderRoute('/confirmacion/500-extra');

    expect(html).toContain('UNIRME AL GRUPO DE WHATSAPP');
    expect(html).toContain('Te llevaremos automáticamente al grupo de WhatsApp en 5 segundos.');
    expect(html).toContain('href="https://wa.local/organic"');
    expect(html).toContain('target="_self"');
    expect(html).not.toContain('El enlace al grupo estará disponible pronto.');
  });

  it('renders the ads WhatsApp button from the ads group URL', () => {
    vi.stubEnv('VITE_WHATSAPP_GROUP_URL_ORGANIC', 'https://wa.local/organic');
    vi.stubEnv('VITE_WHATSAPP_GROUP_URL_ADS', 'https://wa.local/ads');
    vi.stubEnv('VITE_WHATSAPP_GROUP_URL', '');

    const html = renderRoute('/x9m/confirmacion/500-extra');

    expect(html).toContain('UNIRME AL GRUPO DE WHATSAPP');
    expect(html).toContain('href="https://wa.local/ads"');
    expect(html).not.toContain('El enlace al grupo estará disponible pronto.');
  });

  it('renders the confirmation page at /x9m/confirmacion/500-extra', () => {
    vi.stubEnv('VITE_WHATSAPP_GROUP_URL_ORGANIC', '');
    vi.stubEnv('VITE_WHATSAPP_GROUP_URL_ADS', '');
    vi.stubEnv('VITE_WHATSAPP_GROUP_URL', '');

    expect(renderRoute('/x9m/confirmacion/500-extra')).toContain(
      'El enlace al grupo estará disponible pronto.',
    );
  });
});
