import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { isAdsRoutePath } from '../../core/routing/adsRoute';

interface ClassRedirectPageProps {
  classNumber: number;
  youtubeUrl: string;
  title: string;
  description: string;
  adsDelayMs: number;
  organicDelayMs: number;
}

function upsertMeta(name: string, content: string): void {
  let meta = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);

  if (!meta) {
    meta = document.createElement('meta');
    meta.name = name;
    document.head.appendChild(meta);
  }

  meta.content = content;
}

export function ClassRedirectPage({
  classNumber,
  youtubeUrl,
  title,
  description,
  adsDelayMs,
  organicDelayMs,
}: ClassRedirectPageProps) {
  const location = useLocation();
  const redirectDelay = isAdsRoutePath(location.pathname) ? adsDelayMs : organicDelayMs;
  const redirectMessage = `Redirigiendo a la Clase ${classNumber}…`;
  const buttonLabel = `VER CLASE ${classNumber} AHORA`;

  useEffect(() => {
    document.title = title;
    upsertMeta('description', description);
    upsertMeta('robots', 'noindex, nofollow');
  }, [description, title]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      window.location.assign(youtubeUrl);
    }, redirectDelay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [redirectDelay, youtubeUrl]);

  return (
    <main className="theme-expert min-h-screen overflow-hidden bg-[#7b1f70] text-white">
      <section className="relative flex min-h-screen items-center justify-center px-5 py-12 sm:px-8">
        <div
          className="absolute inset-0 opacity-35"
          aria-hidden="true"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.55) 1px, transparent 0)',
            backgroundSize: '26px 26px',
          }}
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(241,184,77,0.42),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(214,101,64,0.45),_transparent_38%)]"
          aria-hidden="true"
        />
        <div className="relative mx-auto flex w-full max-w-2xl flex-col items-center text-center">
          <p className="text-sm font-bold uppercase text-[#f1b84d] sm:text-base">
            Pame Flores Crea
          </p>
          <h1 className="expert-headline mt-5 text-4xl font-black leading-tight sm:text-6xl">
            {redirectMessage}
          </h1>
          <p className="mt-5 max-w-xl text-base font-semibold leading-7 text-white/90 sm:text-lg">
            Estamos preparando tu acceso al video. Si no avanzas automáticamente, toca el botón
            de abajo.
          </p>
          <a
            className="mt-9 inline-flex min-h-14 items-center justify-center rounded-md bg-[#f1b84d] px-7 text-center text-sm font-black uppercase text-[#4a123f] shadow-lg shadow-black/20 transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-white/45 sm:text-base"
            href={youtubeUrl}
          >
            {buttonLabel}
          </a>
        </div>
      </section>
    </main>
  );
}
