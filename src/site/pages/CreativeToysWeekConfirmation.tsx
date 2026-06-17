import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import {
  CREATIVE_TOYS_ASSETS,
  CREATIVE_TOYS_REGISTRATION_KEY,
  CREATIVE_TOYS_WHATSAPP_REDIRECT_DELAY_MS,
  getCreativeToysWhatsAppUrl,
  shouldAutoRedirectToCreativeToysWhatsApp,
  type CreativeToysRegistrationSnapshot,
} from '../registration/creativeToysRegistration';

function readRegistrationSnapshot(): CreativeToysRegistrationSnapshot | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const storedValue = window.localStorage.getItem(CREATIVE_TOYS_REGISTRATION_KEY);

    if (!storedValue) {
      return null;
    }

    return JSON.parse(storedValue) as CreativeToysRegistrationSnapshot;
  } catch {
    return null;
  }
}

export function CreativeToysWeekConfirmation() {
  const location = useLocation();
  const whatsappGroupUrl = getCreativeToysWhatsAppUrl(location.pathname);
  const [snapshot] = useState(() => readRegistrationSnapshot());
  const firstName = useMemo(() => snapshot?.lead_name.split(' ')[0] ?? '', [snapshot]);
  const shouldAutoRedirect = shouldAutoRedirectToCreativeToysWhatsApp(whatsappGroupUrl);

  useEffect(() => {
    if (!shouldAutoRedirect) {
      return undefined;
    }

    const redirectTimer = window.setTimeout(() => {
      window.location.assign(whatsappGroupUrl);
    }, CREATIVE_TOYS_WHATSAPP_REDIRECT_DELAY_MS);

    return () => window.clearTimeout(redirectTimer);
  }, [shouldAutoRedirect, whatsappGroupUrl]);

  return (
    <main className="min-h-screen bg-[#2b1163] text-white">
      <section className="mx-auto grid min-h-screen w-full max-w-6xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[0.96fr_1.04fr] lg:px-10">
        <div className="flex flex-col justify-center">
          <img
            alt="Pame Flores Crea"
            className="h-14 w-14 rounded-md object-cover"
            height="56"
            src={CREATIVE_TOYS_ASSETS.logo}
            width="56"
          />
          <div className="mt-8 inline-flex w-fit items-center gap-2 rounded-md border border-[#23d7df]/40 bg-[#23d7df]/12 px-3 py-2 text-sm font-black text-[#8ff7f4]">
            <CheckCircle2 aria-hidden="true" className="h-5 w-5" />
            Registro confirmado
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
            {firstName ? `${firstName}, ya estás registrada.` : 'Ya estás registrada.'}
          </h1>
          <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-white/80">
            Tu acceso a la Semana del Emprendimiento con Juguetes Creativos se enviará por
            WhatsApp junto con los recordatorios del evento.
          </p>

          <div className="mt-8 rounded-lg border border-white/14 bg-white/10 p-5">
            {whatsappGroupUrl ? (
              <>
                <p className="text-base font-bold leading-7 text-white">
                  Te llevaremos al grupo de WhatsApp en unos segundos. También puedes entrar ahora:
                </p>
                <a
                  className="mt-5 inline-flex min-h-[54px] w-full items-center justify-center gap-2 rounded-md bg-[#23d7df] px-5 py-3 text-center text-sm font-black uppercase text-[#24104e] shadow-[0_14px_32px_rgba(35,215,223,0.26)] transition duration-200 hover:bg-[#68f1ee] focus:outline-none focus:ring-2 focus:ring-[#f4c54f] focus:ring-offset-2 focus:ring-offset-[#2b1163] sm:w-auto"
                  href={whatsappGroupUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <MessageCircle aria-hidden="true" className="h-5 w-5" />
                  Entrar al grupo de WhatsApp
                </a>
              </>
            ) : (
              <p className="text-base font-bold leading-7 text-white">
                El enlace al grupo estará disponible pronto.
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-full overflow-hidden rounded-lg border border-white/14 bg-[#4a1ca4] shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
            <img
              alt="Juguetes creativos para familias"
              className="h-full min-h-[420px] w-full object-cover"
              src={CREATIVE_TOYS_ASSETS.toys}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
