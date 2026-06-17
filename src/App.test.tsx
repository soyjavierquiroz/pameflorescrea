import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { VisitorProvider } from './core/visitor/VisitorContext';

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
  it('keeps the preparation page at /', () => {
    expect(renderRoute('/')).toContain('Sitio en preparacion');
  });

  it('keeps the preparation page at /x9m', () => {
    expect(renderRoute('/x9m')).toContain('Sitio en preparacion');
  });

  it('renders the creative toys landing at /500-extra', () => {
    const html = renderRoute('/500-extra');

    expect(html).toContain('Descubre cómo generar desde');
    expect(html).toContain('Una experiencia creativa para empezar con ilusión');
  });

  it('renders the creative toys landing at /x9m/500-extra', () => {
    expect(renderRoute('/x9m/500-extra')).toContain(
      'SEMANA DEL EMPRENDIMIENTO CON JUGUETES CREATIVOS',
    );
  });

  it('renders the confirmation page at /confirmacion/500-extra', () => {
    expect(renderRoute('/confirmacion/500-extra')).toContain('Registro confirmado');
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
