import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { isAdsRoutePath } from '../../core/routing/adsRoute';
import { readCampaignSnapshot, type RegistrationSnapshot } from '../registration/campaignRegistration';
import { retoCampaign } from '../registration/campaigns';
import { useCampaignConfirmationTracking } from '../registration/useCampaignConfirmationTracking';
import { getCampaignWhatsAppUrl, scheduleWhatsAppRedirect, shouldAutoRedirectToWhatsApp } from '../registration/whatsappGroup';
import { RETO_ASSETS } from './retoAssets';

export function RetoConfirmation() {
  const location = useLocation();
  const whatsappGroupUrl = getCampaignWhatsAppUrl(location.pathname);
  const [snapshot] = useState<RegistrationSnapshot | null>(() => readCampaignSnapshot(retoCampaign));
  const redirectReady = useCampaignConfirmationTracking(retoCampaign, location.pathname);
  const firstName = useMemo(() => snapshot?.lead_name.split(' ')[0] ?? '', [snapshot]);
  const shouldAutoRedirect = shouldAutoRedirectToWhatsApp(whatsappGroupUrl);
  const canLeaveForWhatsApp = !isAdsRoutePath(location.pathname) || redirectReady;
  const whatsappCtaClassName = 'mt-5 inline-flex min-h-[54px] items-center gap-2 rounded-md bg-[#e0008a] px-5 py-3 text-sm font-black uppercase text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffd45d]';

  useEffect(() => {
    if (!shouldAutoRedirect || !redirectReady) {
      return undefined;
    }

    return scheduleWhatsAppRedirect(window, whatsappGroupUrl);
  }, [redirectReady, shouldAutoRedirect, whatsappGroupUrl]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#24104e_0%,#4b1596_54%,#c349a4_100%)] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.58)_1px,transparent_0)] [background-size:22px_22px]" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 h-2 bg-[#ffd45d]" aria-hidden="true" />
      <section className="relative mx-auto grid min-h-screen w-full max-w-6xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[0.96fr_1.04fr] lg:items-center lg:px-10">
        <div className="flex min-w-0 flex-col justify-center">
          <img alt="Pame Flores Crea" className="h-14 w-14 rounded-md border-2 border-dashed border-[#ffd45d] bg-white object-contain p-1 shadow-lg" height="56" width="56" src={RETO_ASSETS.logo} />
          <div className="mt-8 inline-flex w-fit items-center gap-2 self-start rounded-md border-2 border-dashed border-[#7ef8f0]/60 bg-[#2b1163] px-3 py-2 text-sm font-black text-[#8ff7f4]">
            <CheckCircle2 aria-hidden="true" className="h-5 w-5" /> Registro confirmado
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
            {firstName ? <><span className="text-[#ffd45d]">{firstName},</span> ya estás registrada.</> : 'Ya estás registrada.'}
          </h1>
          <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-white/80">
            Tu lugar en CONQUISTA LA JUGUETERÍA RENTABLE está reservado. Nos vemos el 20, 21, 22 y 25 de octubre a las 7 PM Ecuador / Colombia / Perú.
          </p>
          <div className="mt-8 rounded-lg border-2 border-dashed border-white/30 bg-[#2b1163] p-5">
            {whatsappGroupUrl ? (
              <>
                <p className="text-base font-bold leading-7">Te llevaremos automáticamente al grupo de WhatsApp en 5 segundos.</p>
                {canLeaveForWhatsApp ? (
                  <a className={whatsappCtaClassName} href={whatsappGroupUrl} target="_self">
                    <MessageCircle aria-hidden="true" className="h-5 w-5" /> UNIRME AL GRUPO DE WHATSAPP
                  </a>
                ) : (
                  <button className={`${whatsappCtaClassName} cursor-wait opacity-70`} disabled type="button">
                    <MessageCircle aria-hidden="true" className="h-5 w-5" /> UNIRME AL GRUPO DE WHATSAPP
                  </button>
                )}
              </>
            ) : (
              <p className="text-base font-bold leading-7">El enlace al grupo estará disponible pronto.</p>
            )}
          </div>
        </div>
        <div className="relative flex min-w-0 items-center">
          <div className="absolute inset-x-6 bottom-0 top-8 rotate-[-3deg] rounded-lg border-2 border-dotted border-[#ffd45d]/60 bg-white/10" aria-hidden="true" />
          <div className="relative w-full overflow-hidden rounded-lg border-2 border-dashed border-white/38 bg-[#4a1ca4] shadow-[0_26px_74px_rgba(36,16,78,0.45)]">
            <img alt="Juguetes creativos para familias" className="h-[280px] w-full object-cover sm:h-[360px] sm:object-[center_25%] lg:h-[420px] lg:object-center" src={RETO_ASSETS.confirmation} />
          </div>
        </div>
      </section>
    </main>
  );
}
