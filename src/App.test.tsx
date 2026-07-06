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
import { buildTemporaryOfferRedirectTarget } from './site/routing/offerRoutes';
import {
  CLASS_ONE_ADS_REDIRECT_DELAY_MS,
  CLASS_ONE_ORGANIC_REDIRECT_DELAY_MS,
  CLASS_ONE_YOUTUBE_URL,
} from './site/pages/ClassOneRedirectPage';
import {
  CLASS_TWO_ADS_REDIRECT_DELAY_MS,
  CLASS_TWO_ORGANIC_REDIRECT_DELAY_MS,
  CLASS_TWO_YOUTUBE_URL,
} from './site/pages/ClassTwoRedirectPage';
import {
  CLASS_THREE_ADS_REDIRECT_DELAY_MS,
  CLASS_THREE_ORGANIC_REDIRECT_DELAY_MS,
  CLASS_THREE_YOUTUBE_URL,
} from './site/pages/ClassThreeRedirectPage';

function renderRoute(pathname: string): string {
  return renderToString(
    <MemoryRouter initialEntries={[pathname]}>
      <VisitorProvider>
        <App />
      </VisitorProvider>
    </MemoryRouter>,
  );
}

function countOccurrences(value: string, search: string): number {
  return value.split(search).length - 1;
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('App routes', () => {
  it('redirects / to the organic temporary offer', () => {
    const appSource = readFileSync(join(process.cwd(), 'src/App.tsx'), 'utf8');

    expect(appSource).toContain('<Route path="/" element={<TemporaryOfferRedirect />} />');
    expect(buildTemporaryOfferRedirectTarget({ pathname: '/', search: '', hash: '' })).toBe(
      '/oferta/',
    );
    expect(renderRoute('/')).not.toContain('Sitio en preparacion');
  });

  it('keeps the preparation page at /x9m', () => {
    expect(renderRoute('/x9m')).toContain('Sitio en preparacion');
  });

  it('redirects organic free landing routes to the temporary offer', () => {
    const appSource = readFileSync(join(process.cwd(), 'src/App.tsx'), 'utf8');

    expect(appSource).toContain('<Route path="/500-extra" element={<TemporaryOfferRedirect />} />');
    expect(appSource).toContain(
      '<Route path="/500-extra/" element={<TemporaryOfferRedirect />} />',
    );
    expect(buildTemporaryOfferRedirectTarget({ pathname: '/500-extra', search: '', hash: '' })).toBe(
      '/oferta/',
    );
    expect(
      buildTemporaryOfferRedirectTarget({ pathname: '/500-extra/', search: '', hash: '' }),
    ).toBe('/oferta/');
    expect(
      buildTemporaryOfferRedirectTarget({
        pathname: '/500-extra',
        search: '?utm_source=ig',
        hash: '',
      }),
    ).toBe('/oferta/?utm_source=ig');
  });

  it('redirects ads free landing routes to the ads temporary offer', () => {
    const appSource = readFileSync(join(process.cwd(), 'src/App.tsx'), 'utf8');

    expect(appSource).toContain(
      '<Route path={`${adsRoutePrefix}/500-extra`} element={<TemporaryOfferRedirect ads />} />',
    );
    expect(appSource).toContain(
      '<Route path={`${adsRoutePrefix}/500-extra/`} element={<TemporaryOfferRedirect ads />} />',
    );
    expect(
      buildTemporaryOfferRedirectTarget({ pathname: '/x9m/500-extra', search: '', hash: '' }, true),
    ).toBe('/x9m/oferta/');
  });

  it('renders the class one redirect page at /clase1', () => {
    const html = renderRoute('/clase1');

    expect(html).toContain('Redirigiendo a la Clase 1');
    expect(html).toContain(
      'Estamos preparando tu acceso al video. Si no avanzas automáticamente',
    );
  });

  it('renders the class one redirect page at /x9m/clase1', () => {
    expect(renderRoute('/x9m/clase1')).toContain('Redirigiendo a la Clase 1');
  });

  it('uses the exact class one fallback video URL', () => {
    expect(renderRoute('/clase1')).toContain(`href="${CLASS_ONE_YOUTUBE_URL}"`);
  });

  it('keeps class one redirect behavior pointing to the original video', () => {
    expect(CLASS_ONE_ORGANIC_REDIRECT_DELAY_MS).toBe(1500);
    expect(CLASS_ONE_ADS_REDIRECT_DELAY_MS).toBe(2500);
    expect(renderRoute('/clase1')).toContain(`href="${CLASS_ONE_YOUTUBE_URL}"`);
  });

  it('renders the class two redirect page at /clase2', () => {
    const html = renderRoute('/clase2');

    expect(html).toContain('Redirigiendo a la Clase 2');
    expect(html).toContain(
      'Estamos preparando tu acceso al video. Si no avanzas automáticamente',
    );
  });

  it('renders the class two redirect page at /x9m/clase2', () => {
    expect(renderRoute('/x9m/clase2')).toContain('Redirigiendo a la Clase 2');
  });

  it('uses the exact class two fallback video URL', () => {
    expect(renderRoute('/clase2')).toContain(`href="${CLASS_TWO_YOUTUBE_URL}"`);
    expect(renderRoute('/x9m/clase2')).toContain(`href="${CLASS_TWO_YOUTUBE_URL}"`);
  });

  it('renders the class three redirect page at /clase3', () => {
    const html = renderRoute('/clase3');

    expect(html).toContain('Redirigiendo a la Clase 3');
    expect(html).toContain(
      'Estamos preparando tu acceso al video. Si no avanzas automáticamente',
    );
  });

  it('renders the class three redirect page at /x9m/clase3', () => {
    expect(renderRoute('/x9m/clase3')).toContain('Redirigiendo a la Clase 3');
  });

  it('uses the exact class three fallback video URL', () => {
    expect(renderRoute('/clase3')).toContain(`href="${CLASS_THREE_YOUTUBE_URL}"`);
    expect(renderRoute('/x9m/clase3')).toContain(`href="${CLASS_THREE_YOUTUBE_URL}"`);
  });

  it('configures class three redirect delays for organic and ads routes', () => {
    expect(CLASS_THREE_ORGANIC_REDIRECT_DELAY_MS).toBe(1500);
    expect(CLASS_THREE_ADS_REDIRECT_DELAY_MS).toBe(2500);
  });

  it('configures static class two metadata for organic and ads routes', () => {
    const viteSource = readFileSync(join(process.cwd(), 'vite.config.ts'), 'utf8');

    expect(viteSource).toContain("const classTwoTitle = 'Clase 2 | Pame Flores Crea'");
    expect(viteSource).toContain(
      "const classTwoDescription = 'Redirigiendo a la Clase 2 de Pame Flores Crea.'",
    );
    expect(viteSource).toContain("path: 'clase2'");
    expect(viteSource).toContain('path: `${adsPrefix}/clase2`');
    expect(viteSource).toContain("'noindex, nofollow'");
  });

  it('configures static class three metadata for organic and ads routes', () => {
    const viteSource = readFileSync(join(process.cwd(), 'vite.config.ts'), 'utf8');

    expect(viteSource).toContain("const classThreeTitle = 'Clase 3 | Pame Flores Crea'");
    expect(viteSource).toContain(
      "const classThreeDescription = 'Redirigiendo a la Clase 3 de Pame Flores Crea.'",
    );
    expect(viteSource).toContain("path: 'clase3'");
    expect(viteSource).toContain('path: `${adsPrefix}/clase3`');
    expect(viteSource).toContain("'noindex, nofollow'");
  });

  it('keeps class redirect behavior timer-only and conversion-free', () => {
    const pageSource = readFileSync(
      join(process.cwd(), 'src/site/pages/ClassRedirectPage.tsx'),
      'utf8',
    );

    expect(CLASS_ONE_ORGANIC_REDIRECT_DELAY_MS).toBe(1500);
    expect(CLASS_ONE_ADS_REDIRECT_DELAY_MS).toBe(2500);
    expect(CLASS_TWO_ORGANIC_REDIRECT_DELAY_MS).toBe(1500);
    expect(CLASS_TWO_ADS_REDIRECT_DELAY_MS).toBe(2500);
    expect(CLASS_THREE_ORGANIC_REDIRECT_DELAY_MS).toBe(1500);
    expect(CLASS_THREE_ADS_REDIRECT_DELAY_MS).toBe(2500);
    expect(pageSource).toContain('window.setTimeout');
    expect(pageSource).toContain('window.clearTimeout');
    expect(pageSource).toContain('window.location.assign(youtubeUrl)');
    expect(pageSource).not.toContain('trackEvent');
    expect(pageSource).not.toContain('InitiateCheckout');
    expect(pageSource).not.toContain('CompleteRegistration');
    expect(pageSource).not.toContain('Purchase');
    expect(pageSource).not.toContain('Lead');
  });

  it('renders the temporary creative toys offer at /oferta and /oferta/', () => {
    const html = renderRoute('/oferta');
    const htmlWithSlash = renderRoute('/oferta/');

    expect(html).toContain('Certificación J.C.P.');
    expect(htmlWithSlash).toContain('Certificación J.C.P.');
    expect(html).toContain('Descubre la manera más simple de construir un proyecto propio');
    expect(html).toContain('Juguetes Creativos');
    expect(html).toContain('sentir orgullosa');
    expect(html).toContain('Aunque hoy no sepas por dónde empezar');
    expect(html).toContain('proyecto propio que impacte vidas y genere ingresos para tu familia');
    expect(html).toContain('397 USD');
    expect(html).toContain('197 USD');
    expect(html).toContain('Inscríbete eligiendo la opción de pago que prefieras');
    expect(html).toContain('UNA CUOTA');
    expect(html).toContain('3 CUOTAS');
    expect(html).toContain('77 USD');
    expect(html).toContain('POR 3 MESES');
    expect(html).toContain('QUIERO PAGAR 197 USD');
    expect(html).toContain('QUIERO PAGAR EN 3 CUOTAS');
    expect(html).toContain('Es ideal para ti si:');
    expect(html).toContain('Sientes que tienes mucho potencial');
    expect(html).toContain('Sueñas con construir algo propio');
    expect(html).toContain('Amas la creatividad y el mundo infantil');
    expect(html).toContain('Has probado diferentes ideas');
    expect(html).toContain('Quieres dejar de sentirte perdida');
    expect(html).not.toContain('Si eres una mamá que trabaja medio tiempo');
    expect(html).not.toContain('Si tienes conocimientos en el área de la educación infantil');
    expect(html).not.toContain('Si eres una mujer talentosa');
    expect(html).not.toContain('Si estás agotada de empezar proyectos');
    expect(html).not.toContain('Si estás cansada de invertir en cursos de marketing');
    expect(html).not.toContain('Si estás cansada de Invertir en cursos de marketing');
    expect(html).toContain(
      'La Juguetería Creativa puede convertirse en ese proyecto propio que llevas tiempo buscando.',
    );
    expect(html).toContain('Sé que dentro de ti hay un enorme deseo de crear');
    expect(html).toContain('Eso es lo que representa la Juguetería Creativa');
    expect(html).toContain('Pero primero debes confiar en ti y también:');
    expect(html).toContain('Confiar en tu capacidad.');
    expect(html).toContain(
      'Confiar en tu intuición y en ese proyecto que hace tanto tiempo está en tu corazón.',
    );
    expect(html).toContain('Dejarte acompañar.');
    expect(html).toContain('Reconocer que mereces un espacio y una actividad para ti.');
    expect(html).toContain('Entender que puedes construir el proyecto de tus sueños.');
    expect(html).not.toContain('MENOS FRUSTRACIÓN Y MÁS ACCIÓN CREATIVA');
    expect(html).not.toContain('Sé lo que es sentirse perdida');
    expect(html).not.toContain('Pero lo bueno es que siempre es un buen día');
    expect(html).not.toContain('Pero primero debes confiar en ti y también decidir:');
    expect(html).not.toContain('Decidir confiar en tu capacidad');
    expect(html).toContain(
      'Todo lo que necesitas para dejar de sentirte perdida y empezar a construir un proyecto propio con claridad y confianza.',
    );
    expect(html).toContain('certificacion-jcp.webp');
    expect(html).not.toContain('programa-01.webp');
    expect(html).toContain('pame-oferta.webp');
    expect(html).toContain('pame-vip-creativa.webp');
    expect(html).toContain('ventas-temporadas-altas.webp');
    expect(html).toContain('disena-moldes-canva.webp');
    expect(html).toContain('fotos-videos-que-venden.webp');
    expect(html).toContain('de-principiante-a-experta-cosiendo.webp');
    expect(html).toContain('agenda-mama.webp');
    expect(html).toContain('imprime-vende-sublimado.webp');
    expect(html).toContain('ventas-explisivas-instagram.webp');
    expect(html).toContain('QUIERO INSCRIBIRME AHORA');
    expect(html).toContain('INSCRIBIRME AHORA');
    expect(html).toContain('ESCRÍBENOS POR WHATSAPP');
    expect(html).toContain('translate-y-[110%]');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain(`href="${TEMPORARY_OFFER_CHECKOUT_URL}"`);
    expect(countOccurrences(html, `href="${TEMPORARY_OFFER_CHECKOUT_URL}"`)).toBeGreaterThanOrEqual(2);
    expect(html).toContain('Si estás en Ecuador y deseas pagar con depósito');
    expect(html).toContain('galeria-1.webp');
    expect(html).toContain('galeria-8.webp');
    expect(html).not.toContain('Bolivia');
    expect(html).not.toContain('InitiateCheckout');
    expect(html).not.toContain('Purchase');
    expect(html).not.toContain('CompleteRegistration');
    expect(html).not.toContain('Lead');
  });

  it('renders the temporary creative toys offer at /x9m/oferta and /x9m/oferta/', () => {
    const html = renderRoute('/x9m/oferta');
    const htmlWithSlash = renderRoute('/x9m/oferta/');

    expect(html).toContain('Certificación de Juguetería Creativa Profesional');
    expect(htmlWithSlash).toContain('Certificación de Juguetería Creativa Profesional');
    expect(html).toContain('QUIERO PAGAR 197 USD');
    expect(html).toContain('QUIERO PAGAR EN 3 CUOTAS');
    expect(html).toContain(`href="${TEMPORARY_OFFER_CHECKOUT_URL}"`);
  });

  it('wires both temporary offer payment buttons to checkout', () => {
    const pageSource = readFileSync(
      join(process.cwd(), 'src/site/pages/CreativeToysOfferTemporaryPage.tsx'),
      'utf8',
    );

    expect(pageSource).toContain(
      '<CheckoutCta className="lg:w-[250px] xl:w-[280px]" variant="payment">',
    );
    expect(pageSource).toContain('QUIERO PAGAR 197 USD');
    expect(pageSource).toContain('QUIERO PAGAR EN 3 CUOTAS');
    expect(pageSource).toContain('certificacion-jcp.webp');
    expect(pageSource).not.toContain('programa-01.webp');
    expect(pageSource).toContain('href={TEMPORARY_OFFER_CHECKOUT_URL}');
    expect(pageSource).toContain("'InitiateCheckout'");
    expect(pageSource).not.toContain("'Purchase'");
    expect(pageSource).not.toContain("'CompleteRegistration'");
    expect(pageSource).not.toContain("'Lead'");
  });

  it('configures the temporary offer gallery carousel autoplay accessibly', () => {
    const pageSource = readFileSync(
      join(process.cwd(), 'src/site/pages/CreativeToysOfferTemporaryPage.tsx'),
      'utf8',
    );

    expect(pageSource).toContain('GALLERY_AUTOPLAY_INTERVAL_MS = 2000');
    expect(pageSource).toContain('window.setInterval');
    expect(pageSource).toContain('window.clearInterval');
    expect(pageSource).toContain('prefers-reduced-motion: reduce');
    expect(pageSource).toContain('scroller.scrollTo');
    expect(pageSource).toContain('[scrollbar-width:none]');
    expect(pageSource).toContain('alt={`Galería de juguetes creativos ${index + 1}`}');
    expect(pageSource).toContain('galeria-1.webp');
    expect(pageSource).toContain('galeria-8.webp');
  });

  it('redirects temporary offer routes to oferta and preserves URL details', () => {
    const appSource = readFileSync(join(process.cwd(), 'src/App.tsx'), 'utf8');

    expect(appSource).toContain('<Route path="/temporal" element={<TemporaryOfferRedirect />} />');
    expect(appSource).toContain(
      '<Route path="/temporal/" element={<TemporaryOfferRedirect />} />',
    );
    expect(appSource).toContain(
      '<Route path={`${adsRoutePrefix}/temporal`} element={<TemporaryOfferRedirect ads />} />',
    );
    expect(appSource).toContain(
      '<Route path={`${adsRoutePrefix}/temporal/`} element={<TemporaryOfferRedirect ads />} />',
    );
    expect(appSource).toContain('replace');
    expect(
      buildTemporaryOfferRedirectTarget({
        pathname: '/temporal',
        search: '?utm_source=meta',
        hash: '#x',
      }),
    ).toBe('/oferta/?utm_source=meta#x');
    expect(
      buildTemporaryOfferRedirectTarget({
        pathname: '/temporal/',
        search: '?utm_source=meta',
        hash: '#x',
      }),
    ).toBe('/oferta/?utm_source=meta#x');
    expect(
      buildTemporaryOfferRedirectTarget(
        {
          pathname: '/x9m/temporal',
          search: '?utm_source=meta',
          hash: '#x',
        },
        true,
      ),
    ).toBe('/x9m/oferta/?utm_source=meta#x');
    expect(
      buildTemporaryOfferRedirectTarget(
        {
          pathname: '/x9m/temporal/',
          search: '?utm_source=meta',
          hash: '#x',
        },
        true,
      ),
    ).toBe('/x9m/oferta/?utm_source=meta#x');
    expect(
      buildTemporaryOfferRedirectTarget(
        {
          pathname: '/x9m/500-extra',
          search: '?fbclid=test&utm_source=meta',
          hash: '',
        },
        true,
      ),
    ).toBe('/x9m/oferta/?fbclid=test&utm_source=meta');
    expect(
      buildTemporaryOfferRedirectTarget(
        {
          pathname: '/x9m/temporal',
          search: '?utm_campaign=x',
          hash: '#cta',
        },
        true,
      ),
    ).toBe('/x9m/oferta/?utm_campaign=x#cta');
  });

  it('keeps temporary offer checkout tracking disabled outside the ads route', () => {
    expect(shouldTrackTemporaryOfferCheckout('/oferta')).toBe(false);
    expect(shouldTrackTemporaryOfferCheckout('/oferta/')).toBe(false);
    expect(shouldTrackTemporaryOfferCheckout('/oferta?fbclid=paid-click')).toBe(false);
  });

  it('allows only InitiateCheckout preparation under the ads temporary route', () => {
    const payload = buildTemporaryOfferCheckoutEventData({
      eventId: 'event-test-1',
      eventSourceUrl: 'https://pameflorescrea.com/x9m/oferta?fbclid=test',
    });

    expect(shouldTrackTemporaryOfferCheckout('/x9m/oferta')).toBe(true);
    expect(shouldTrackTemporaryOfferCheckout('/x9m/oferta/')).toBe(true);
    expect(payload).toMatchObject({
      event_id: 'event-test-1',
      event_source_url: 'https://pameflorescrea.com/x9m/oferta?fbclid=test',
      offer_slug: 'certificacion-jugueteria-creativa',
      checkout_url: TEMPORARY_OFFER_CHECKOUT_URL,
      value: 197,
      currency: 'USD',
    });
    expect(Object.values(payload)).not.toContain('Purchase');
    expect(Object.values(payload)).not.toContain('CompleteRegistration');
    expect(Object.values(payload)).not.toContain('Lead');
  });

  it('keeps the mobile sticky CTA focused on checkout only', () => {
    const pageSource = readFileSync(
      join(process.cwd(), 'src/site/pages/CreativeToysOfferTemporaryPage.tsx'),
      'utf8',
    );
    const stickySource = pageSource.slice(
      pageSource.indexOf('function StickyMobileCta'),
      pageSource.indexOf('export function CreativeToysOfferTemporaryPage'),
    );

    expect(stickySource).toContain('INSCRIBIRME AHORA');
    expect(stickySource).not.toContain('UNA CUOTA');
    expect(stickySource).not.toContain('Una cuota');
    expect(stickySource).not.toContain('197 USD');
  });

  it('delays the mobile sticky CTA until after the scroll threshold', () => {
    const pageSource = readFileSync(
      join(process.cwd(), 'src/site/pages/CreativeToysOfferTemporaryPage.tsx'),
      'utf8',
    );

    expect(pageSource).toContain('MOBILE_STICKY_CTA_SCROLL_THRESHOLD = 420');
    expect(pageSource).toContain('scrollY > MOBILE_STICKY_CTA_SCROLL_THRESHOLD');
    expect(pageSource).toContain('window.addEventListener(\'scroll\'');
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
