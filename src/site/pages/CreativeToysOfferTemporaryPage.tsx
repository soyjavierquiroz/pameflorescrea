import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock3,
  Gift,
  HeartHandshake,
  HelpCircle,
  Images,
  Lightbulb,
  MessageCircle,
  MonitorSmartphone,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wand2,
  Zap,
} from 'lucide-react';
import analytics from '../../core/services/analytics';
import {
  buildTemporaryOfferCheckoutEventData,
  shouldTrackTemporaryOfferCheckout,
  TEMPORARY_OFFER_CHECKOUT_URL,
  TEMPORARY_OFFER_SLUG,
  TEMPORARY_OFFER_SUPPORT_WHATSAPP_URL,
} from '../registration/creativeToysOfferTemporary';

const ASSET_BASE = '/assets/pame-flores-crea/oferta';
const WEEK_ASSET_BASE = '/assets/pame-flores-crea/500-extra';
const MOBILE_STICKY_CTA_SCROLL_THRESHOLD = 420;

function shouldShowMobileStickyCta(scrollY: number): boolean {
  return scrollY > MOBILE_STICKY_CTA_SCROLL_THRESHOLD;
}

const assets = {
  hero: `${ASSET_BASE}/hero-certificacion.webp`,
  discountHeader: `${ASSET_BASE}/cabecera-197.webp`,
  logo: `${WEEK_ASSET_BASE}/logo-pame-flores-crea.png`,
  pame: `${ASSET_BASE}/pame-oferta.webp`,
  pameVipCreative: `${ASSET_BASE}/pame-vip-creativa.webp`,
  plataforma: `${ASSET_BASE}/plataforma.webp`,
  programa: [
    `${ASSET_BASE}/programa-01.webp`,
    `${ASSET_BASE}/programa-02.webp`,
    `${ASSET_BASE}/programa-03.webp`,
  ],
  testimonios: [
    `${ASSET_BASE}/testimonio-01.webp`,
    `${ASSET_BASE}/testimonio-02.jpg`,
    `${ASSET_BASE}/testimonio-03.webp`,
    `${ASSET_BASE}/testimonio-04.jpg`,
    `${ASSET_BASE}/testimonio-05.jpg`,
  ],
  bonos: [
    `${ASSET_BASE}/bono-calculadora.webp`,
    `${ASSET_BASE}/bono-costura.webp`,
    `${ASSET_BASE}/bono-envio.webp`,
    `${ASSET_BASE}/bono-accion-rapida.webp`,
    `${ASSET_BASE}/bono-ventas-rapidas.webp`,
  ],
};

const trustChips = [
  { icon: Clock3, label: 'Acceso por 1 año' },
  { icon: Users, label: 'Acompañamiento y comunidad' },
  { icon: ShieldCheck, label: '7 días de garantía' },
];

const idealFor = [
  'Quieres generar ingresos extras sin descuidar a tu familia.',
  'Amas el mundo infantil y quieres emprender con propósito.',
  'Tienes talento manual, educativo o creativo y no sabes cómo convertirlo en negocio.',
  'Te cansaste de proyectos que no conectan contigo ni con tus valores.',
  'Has probado cursos o ideas sueltas, pero necesitas una ruta clara.',
];

const certificationIncludes = [
  {
    title: 'Método',
    text: 'Mi método estrella de las 3N para construir un negocio con propósito y mirada rentable.',
  },
  {
    title: 'Producto estrella',
    text: 'Paso a paso para crear libros sensoriales novedosos, tiernos y atractivos para tus clientes.',
  },
  {
    title: 'Clientes estrella',
    text: 'Los 5 nichos de oportunidad para encontrar clientes que valoren tus productos y paguen lo justo.',
  },
  {
    title: 'Confección rápida',
    text: 'Plantillas y moldes en tamaño real para avanzar de forma más simple con tus primeros libros.',
  },
  {
    title: 'Comunidad',
    text: 'Un espacio de Jugueteras Creativas Profesionales para apoyarte, compartir y mantener la motivación.',
  },
  {
    title: 'Ruta exacta',
    text: 'Una ruta para conseguir tus primeros clientes y avanzar hacia convertirte en una experta.',
  },
];

const components = [
  {
    image: assets.programa[0],
    title: 'Curso de Juguetería Creativa con Quiet Books Mágicos',
    text: '10 módulos con videos, moldes, plantillas de 8 libros sensoriales y descargas.',
  },
  {
    image: assets.programa[1],
    title: 'Jugueteras Creativas LIVE',
    text: '10 sesiones grupales con Pame y su equipo para resolver dudas y avanzar acompañada.',
  },
  {
    image: assets.programa[2],
    title: 'Comunidad exclusiva',
    text: 'Un espacio para compartir avances, recibir apoyo y mantenerte en movimiento.',
  },
];

const bonuses = [
  {
    image: assets.bonos[0],
    title: 'Juguetes Creativos que Enamoran',
    value: 'Valorado en 77 USD',
    text: 'Biblioteca con 24 tutoriales en video, plantillas y moldes para abrir nuevas opciones de ingresos.',
  },
  {
    image: assets.bonos[1],
    title: 'De Principiante a Experta Cosiendo',
    value: 'Valorado en 127 USD',
    text: 'Una masterclass para vencer el miedo a la costura y ganar habilidades duraderas.',
  },
  {
    title: 'Guía Express de Estimulación Temprana',
    value: 'Valorado en 97 USD',
    text: 'Aprende qué actividades incluir en tus libros según la edad de los niños.',
  },
  {
    image: assets.bonos[4],
    title: 'Ventas explosivas con Instagram',
    value: 'Valorado en 97 USD',
    text: 'Aprende a usar Instagram a favor de tu emprendimiento sin sentirte perdida con la tecnología.',
  },
  {
    title: 'Imprime y Vende - Juguetes en Sublimado',
    value: 'Valorado en 97 USD',
    text: 'Una técnica con posibilidades para crear juguetes lindos y originales.',
  },
  {
    title: 'Agenda para una mamá emprendedora',
    value: 'Valorado en 47 USD',
    text: 'Tutorial y guía práctica para organizar mejor tu tiempo y avanzar con más calma.',
  },
  {
    image: assets.bonos[2],
    title: 'Envío Perfecto',
    value: 'Valorado en 47 USD',
    text: 'Empaca tus juguetes creativos de forma rápida, económica y práctica.',
  },
  {
    title: 'Fotos y videos que venden',
    value: 'Valorado en 47 USD',
    text: 'Aprende a tomar fotos que enamoren a tus clientes usando tu celular.',
  },
  {
    title: 'Diseña tus propios moldes en Canva',
    value: 'Valorado en 47 USD',
    text: 'Una solución práctica para dejar de sufrir cuando necesitas moldes propios.',
  },
  {
    title: 'Kit Ventas en Temporadas Altas',
    value: 'Valorado en 97 USD',
    text: 'Juguetes especiales para Pascua, Halloween y Navidad, más una masterclass de planificación de ventas.',
  },
];

const faqs = [
  {
    question: '¿Y cómo podré aclarar mis dudas durante la certificación?',
    answer:
      'Tendrás sesiones grupales en vivo con Pame y su equipo, además de una comunidad exclusiva para recibir acompañamiento durante el proceso.',
  },
  {
    question: '¿Cómo sé que este curso es diferente a otros?',
    answer:
      'No es sólo un curso de manualidades: combina método, producto estrella, nichos de clientes, moldes, comunidad y una ruta para convertir la Juguetería Creativa en un proyecto con propósito.',
  },
  {
    question: '¿Hay mucho contenido gratis en YouTube?',
    answer:
      'Sí puede haber ideas sueltas, pero aquí recibes una ruta organizada, plantillas, acompañamiento y foco para avanzar sin perderte entre información dispersa.',
  },
  {
    question: '¿Y si no me siento segura si esto es para mí?',
    answer:
      'Tienes 7 días de garantía para vivir la experiencia y decidir con tranquilidad si este camino conecta contigo.',
  },
  {
    question: 'No tengo dinero',
    answer:
      'La oferta es una cuota de 197 USD. Puedes pagar con tarjeta de crédito, débito o PayPal; si estás en Ecuador y deseas depósito, puedes escribirnos por WhatsApp.',
  },
  {
    question: 'No soy creativa',
    answer:
      'Puedes empezar incluso si nunca has tomado hilo o aguja. Lo importante es conectar con los valores de la Juguetería Creativa y darte la oportunidad de aprender paso a paso.',
  },
];

function createEventId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `pame_${TEMPORARY_OFFER_SLUG}_${Date.now()}`;
}

function OfferImage({
  alt,
  className,
  loading = 'lazy',
  src,
}: {
  alt: string;
  className: string;
  loading?: 'eager' | 'lazy';
  src: string;
}) {
  return <img alt={alt} className={className} loading={loading} src={src} />;
}

function DecorativeLayer() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.58)_1px,transparent_0)] [background-size:22px_22px]" />
      <Sparkles className="absolute left-[6%] top-24 h-8 w-8 rotate-12 text-[#ffd45d]/80" />
      <Star className="absolute right-[9%] top-14 h-7 w-7 -rotate-12 fill-[#ffd45d]/70 text-[#ffd45d]/70" />
      <Wand2 className="absolute bottom-20 right-[14%] h-8 w-8 rotate-12 text-[#7ef8f0]/70" />
      <div className="absolute -left-10 top-1/3 h-32 w-32 rounded-full border-2 border-dotted border-[#ffd45d]/60" />
      <div className="absolute bottom-10 left-[18%] h-20 w-20 rounded-full border-2 border-dashed border-white/35" />
      <div className="absolute -bottom-12 right-[28%] h-32 w-32 rotate-12 rounded-lg border-2 border-dashed border-[#7ef8f0]/35" />
    </div>
  );
}

function Section({
  children,
  eyebrow,
  id,
  intro,
  tone = 'light',
  title,
}: {
  children: ReactNode;
  eyebrow?: string;
  id?: string;
  intro?: string;
  tone?: 'light' | 'white' | 'purple' | 'gradient' | 'dark';
  title: string;
}) {
  const toneClasses = {
    light: 'bg-[#f8f1ff] text-[#24104e]',
    white: 'bg-white text-[#24104e]',
    purple: 'bg-[#3a1685] text-white',
    gradient: 'bg-[linear-gradient(135deg,#24104e_0%,#4b1596_46%,#d332a0_100%)] text-white',
    dark: 'bg-[#170830] text-white',
  };

  return (
    <section className={toneClasses[tone]} id={id}>
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <div className="max-w-3xl">
          {eyebrow ? (
            <p
              className={[
                'mb-3 text-xs font-black uppercase',
                tone === 'purple' || tone === 'gradient' || tone === 'dark'
                  ? 'text-[#ffd45d]'
                  : 'text-[#0e9fa8]',
              ].join(' ')}
            >
              {eyebrow}
            </p>
          ) : null}
          <h2 className="font-sans text-3xl font-black leading-tight sm:text-4xl">{title}</h2>
          {intro ? (
            <p
              className={[
                'mt-4 text-base font-semibold leading-7 sm:text-lg',
                tone === 'purple' || tone === 'gradient' || tone === 'dark'
                  ? 'text-white/78'
                  : 'text-[#5b4a77]',
              ].join(' ')}
            >
              {intro}
            </p>
          ) : null}
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

function CheckoutCta({
  children = 'QUIERO INSCRIBIRME AHORA',
  className = '',
  variant = 'default',
}: {
  children?: string;
  className?: string;
  variant?: 'default' | 'sticky';
}) {
  const location = useLocation();

  const handleCheckoutClick = () => {
    if (!shouldTrackTemporaryOfferCheckout(location.pathname)) {
      return;
    }

    void analytics.trackEvent(
      'InitiateCheckout',
      buildTemporaryOfferCheckoutEventData({
        eventId: createEventId(),
        eventSourceUrl: typeof window !== 'undefined' ? window.location.href : location.pathname,
      }),
    );
  };

  return (
    <a
      className={[
        variant === 'sticky'
          ? 'inline-flex min-h-[46px] items-center justify-center gap-2 rounded-md bg-[#e0008a] px-4 py-3 text-center text-xs font-black uppercase text-white shadow-[0_12px_28px_rgba(224,0,138,0.36)] transition duration-200 hover:bg-[#ff149d] focus:outline-none focus:ring-2 focus:ring-[#ffd45d] focus:ring-offset-2 focus:ring-offset-[#170830]'
          : 'inline-flex min-h-[58px] w-full items-center justify-center gap-2 rounded-md bg-[#e0008a] px-6 py-4 text-center text-sm font-black uppercase text-white shadow-[0_18px_42px_rgba(224,0,138,0.38)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#ff149d] focus:outline-none focus:ring-2 focus:ring-[#ffd45d] focus:ring-offset-2 focus:ring-offset-[#2b1163] sm:w-auto sm:px-8',
        className,
      ].join(' ')}
      href={TEMPORARY_OFFER_CHECKOUT_URL}
      onClick={handleCheckoutClick}
    >
      {children}
      <ArrowRight aria-hidden="true" className="h-5 w-5 shrink-0" />
    </a>
  );
}

function SupportLink({ className = '' }: { className?: string }) {
  return (
    <a
      className={[
        'inline-flex min-h-[54px] items-center justify-center gap-2 rounded-md border-2 border-[#7ef8f0]/70 bg-white/12 px-5 py-3 text-center text-sm font-black uppercase text-white transition hover:bg-white/18 focus:outline-none focus:ring-2 focus:ring-[#7ef8f0]',
        className,
      ].join(' ')}
      href={TEMPORARY_OFFER_SUPPORT_WHATSAPP_URL}
      rel="noopener noreferrer"
      target="_blank"
    >
      <MessageCircle aria-hidden="true" className="h-5 w-5" />
      ESCRÍBENOS POR WHATSAPP
    </a>
  );
}

function MiniProofCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-white/16 bg-white/10 p-4 text-sm font-black leading-5 text-white shadow-sm backdrop-blur">
      {children}
    </div>
  );
}

function StickyMobileCta() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleScroll = () => {
      setIsVisible(shouldShowMobileStickyCta(window.scrollY));
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      aria-hidden={!isVisible}
      className={[
        'fixed inset-x-0 bottom-0 z-50 border-t border-white/12 bg-[#170830]/94 px-4 pt-3 shadow-[0_-16px_42px_rgba(23,8,48,0.34)] backdrop-blur transition-[opacity,transform] duration-300 motion-reduce:transition-none sm:hidden',
        isVisible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-[110%] opacity-0',
      ].join(' ')}
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <div className="min-w-[86px]">
          <p className="text-[10px] font-black uppercase leading-4 text-[#7ef8f0]">Una cuota</p>
          <p className="text-xl font-black leading-none text-[#ffd45d]">197 USD</p>
        </div>
        <CheckoutCta className="flex-1" variant="sticky">
          INSCRIBIRME AHORA
        </CheckoutCta>
      </div>
    </div>
  );
}

export function CreativeToysOfferTemporaryPage() {
  useEffect(() => {
    const title = 'Certificación de Juguetería Creativa Profesional | Pame Flores Crea';
    const description =
      'Descubre cómo generar ingresos extras con juguetes creativos y construir un proyecto con propósito junto a Pame Flores.';
    const previousTitle = document.title;
    const descriptionMeta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const robotsMeta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const previousDescription = descriptionMeta?.content;
    const previousRobots = robotsMeta?.content;

    document.title = title;
    descriptionMeta?.setAttribute('content', description);
    robotsMeta?.setAttribute('content', 'noindex, nofollow');

    return () => {
      document.title = previousTitle;
      if (descriptionMeta && previousDescription) {
        descriptionMeta.setAttribute('content', previousDescription);
      }
      if (robotsMeta && previousRobots) {
        robotsMeta.setAttribute('content', previousRobots);
      }
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#2b1163] pb-24 text-white sm:pb-0">
      <section className="relative isolate overflow-hidden bg-[linear-gradient(135deg,#24104e_0%,#4b1596_44%,#c349a4_100%)]">
        <DecorativeLayer />
        <div className="absolute inset-x-0 top-0 h-2 bg-[#ffd45d]" aria-hidden="true" />
        <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-8 px-5 pb-8 pt-4 sm:px-8 sm:pb-14 sm:pt-8 lg:min-h-[680px] lg:grid-cols-[1.02fr_0.98fr] lg:px-10 lg:pb-20 lg:pt-10">
          <div className="flex flex-col justify-center">
            <div className="hidden items-center gap-3 sm:flex">
              <OfferImage
                alt="Pame Flores Crea"
                className="h-14 w-14 rounded-md border-2 border-dashed border-[#ffd45d] bg-white object-contain p-1 shadow-lg"
                loading="eager"
                src={assets.logo}
              />
              <div>
                <p className="text-sm font-black uppercase text-white">Pame Flores Crea</p>
                <p className="text-xs font-semibold text-white/74">Juguetería Creativa Profesional</p>
              </div>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-md border-2 border-dashed border-[#ffd45d]/70 bg-[#ffd45d]/16 px-3 py-2 text-[11px] font-black uppercase leading-4 text-[#fff0ad] shadow-sm sm:mt-8 sm:text-xs">
              <Zap aria-hidden="true" className="h-4 w-4" />
              Certificación J.C.P. · Oferta temporal
            </div>
            <h1 className="mt-3 max-w-3xl font-sans text-[1.72rem] font-black leading-[1.05] text-white sm:mt-4 sm:text-5xl sm:leading-[1.04] lg:text-[3.45rem]">
              Descubre la manera más simple y rápida de generar{' '}
              <span className="text-[#ffd45d]">ingresos extras</span> con{' '}
              <span className="text-[#7ef8f0]">Juguetes Creativos</span> en solo 9 semanas.
            </h1>
            <p className="mt-3 max-w-2xl text-[0.95rem] font-black leading-6 text-white sm:mt-4 sm:text-2xl sm:leading-8">
              Tu talento puede convertirse en un proyecto creativo con propósito.
            </p>
            <p className="mt-4 hidden max-w-2xl text-base font-bold leading-7 text-white/84 sm:block sm:text-lg sm:leading-8">
              Domina el arte de la Juguetería Creativa y conviértelo en un negocio con propósito,
              acompañado por Pame y una comunidad que avanza contigo.
            </p>
            <div className="mt-4 grid gap-3 rounded-lg border border-white/18 bg-white/12 p-4 shadow-[0_22px_54px_rgba(36,16,78,0.32)] backdrop-blur sm:mt-6 sm:max-w-2xl sm:grid-cols-[0.92fr_1.08fr] sm:items-center sm:border-[#ffd45d]/44 sm:p-5">
              <div className="grid gap-2">
                <p className="text-xs font-black uppercase text-[#7ef8f0]">Una cuota</p>
                <div className="flex items-end gap-3">
                  <div className="rounded-md border border-white/16 bg-[#170830]/38 px-3 py-2">
                    <p className="text-[10px] font-black uppercase leading-none text-white/62">Antes</p>
                    <p className="mt-1 text-base font-black leading-none text-white/58 line-through decoration-[#ffd45d] decoration-2 sm:text-lg">
                      397 USD
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase leading-none text-[#fff0ad]">Hoy solo</p>
                    <p className="mt-1 text-[2.65rem] font-black leading-none text-[#ffd45d] sm:text-5xl">
                      197 USD
                    </p>
                  </div>
                </div>
              </div>
              <div className="border-t border-white/16 pt-3 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
                <p className="text-sm font-black uppercase leading-5 text-white">
                  Acceso por 1 año · Garantía 7 días
                </p>
                <p className="mt-2 hidden text-sm font-semibold leading-6 text-white/78 sm:block">
                  Entra con la certificación completa, sesiones LIVE, comunidad y regalos incluidos.
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:items-center">
              <CheckoutCta className="sm:min-w-[290px]" />
              <SupportLink />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {trustChips.map(({ icon: Icon, label }) => (
                <MiniProofCard key={label}>
                  <span className="flex items-center gap-2">
                    <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-[#7ef8f0]" />
                    {label}
                  </span>
                </MiniProofCard>
              ))}
            </div>
          </div>

          <div className="relative flex min-h-[380px] items-end justify-center lg:min-h-[600px] lg:items-center">
            <div className="absolute inset-x-8 bottom-4 top-12 rotate-[-3deg] rounded-lg border-2 border-dotted border-[#ffd45d]/60 bg-white/10" />
            <div className="absolute -right-8 bottom-8 h-32 w-32 rounded-full bg-[#e0008a]/38 blur-3xl" />
            <div className="relative w-full max-w-[520px]">
              <div className="overflow-hidden rounded-lg border-2 border-dashed border-white/38 bg-[#4a1ca4] shadow-[0_26px_74px_rgba(36,16,78,0.45)]">
                <OfferImage
                  alt="Pame Flores acompañando la Certificación de Juguetería Creativa Profesional"
                  className="h-full min-h-[360px] w-full object-cover object-top sm:min-h-[460px] lg:min-h-[560px]"
                  loading="eager"
                  src={assets.pame}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-[#2b1163]/88 p-4 backdrop-blur">
                  <p className="flex items-center gap-2 text-sm font-black text-[#ffd45d]">
                    <HeartHandshake aria-hidden="true" className="h-4 w-4" />
                    Menos frustración y más acción creativa.
                  </p>
                </div>
              </div>
              <div className="absolute -left-4 top-8 hidden max-w-[190px] rounded-lg border-2 border-dashed border-[#ffd45d]/70 bg-[#ffd45d] p-3 text-[#4b1596] shadow-xl sm:block">
                <p className="text-[10px] font-black uppercase leading-4 text-[#4b1596]/72">Antes 397 USD</p>
                <p className="text-xs font-black uppercase leading-4">Hoy 197 USD · Acceso por 1 año</p>
              </div>
              <div className="absolute -bottom-5 right-4 hidden max-w-[220px] rounded-lg border-2 border-dashed border-white/40 bg-[#2b1163]/90 p-4 text-white shadow-xl backdrop-blur sm:block">
                <p className="text-xs font-black uppercase text-[#7ef8f0]">Incluye regalos</p>
                <p className="mt-1 text-sm font-black leading-5">Bonos, comunidad, sesiones LIVE y ruta exacta.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section
        eyebrow="Para quién es"
        intro="Con la Certificación de Juguetería Creativa es más fácil generar ingresos con Juguetes Creativos, aún si empiezas de cero o no te sientes creativa."
        title="Es ideal para ti si..."
        tone="light"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {idealFor.map((item) => (
            <article
              className="flex gap-3 rounded-lg border border-[#eadcf7] bg-white p-5 shadow-[0_14px_30px_rgba(78,28,134,0.08)]"
              key={item}
            >
              <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#13cdd7]" />
              <p className="text-sm font-bold leading-6 text-[#342052] sm:text-base">{item}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Menos frustración y más acción creativa"
        intro="Sé que dentro de ti hay una fuerza enorme de querer crear, crecer y encontrar una actividad que no solo te apasione, sino que te permita descubrir tu verdadero potencial mientras generas ingresos extra."
        title="La Juguetería Creativa conecta con tu corazón y tus talentos"
        tone="purple"
      >
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <div className="overflow-hidden rounded-lg border-2 border-dashed border-[#ffd45d]/44 bg-white/8 p-2 shadow-[0_24px_58px_rgba(0,0,0,0.22)]">
            <OfferImage
              alt="Pame Flores con juguetes creativos"
              className="h-full min-h-[340px] w-full rounded-md object-cover object-center sm:min-h-[420px] lg:min-h-[460px]"
              src={assets.pameVipCreative}
            />
          </div>
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-md border border-white/18 bg-white/10 px-3 py-2 text-xs font-black uppercase text-[#ffd45d]">
              <Images aria-hidden="true" className="h-4 w-4" />
              Creatividad con propósito
            </p>
            <div className="mt-5 space-y-5 text-lg font-bold leading-8 text-white/88 sm:text-xl sm:leading-9">
              <p>
                Sé lo que es sentirse perdida, con mil ideas y ganas de avanzar.{' '}
                <span className="text-[#ffd45d]">Siempre es un buen día para tomar acción.</span>
              </p>
              <p>
                Esta transformación requiere un proceso y estoy aquí para caminar juntas,{' '}
                <span className="text-[#7ef8f0]">paso a paso.</span>
              </p>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                'Decidir confiar en tu capacidad.',
                'Decidir confiar en ese proyecto que hace tiempo está en tu corazón.',
                'Decidir dejarte acompañar.',
                'Decidir que mereces una actividad para ti.',
              ].map((item) => (
                <div
                  className="rounded-lg border border-white/14 bg-white/10 p-4 text-sm font-black leading-6 text-white shadow-sm"
                  key={item}
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-7">
              <CheckoutCta>QUIERO ENTRAR A LA CERTIFICACIÓN</CheckoutCta>
            </div>
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Lo que incluye"
        intro="Una ruta concreta para pasar de la creatividad dispersa a un proyecto con producto, clientes, confección y comunidad."
        title="Qué incluye la Certificación J.C.P."
        tone="white"
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {certificationIncludes.map((item) => (
            <article
              className="rounded-lg border border-[#eadcf7] bg-[#fbf3ff] p-5 shadow-[0_12px_28px_rgba(78,28,134,0.07)]"
              key={item.title}
            >
              <BadgeCheck aria-hidden="true" className="h-6 w-6 text-[#e0008a]" />
              <h3 className="mt-4 font-sans text-lg font-black text-[#24104e]">{item.title}</h3>
              <p className="mt-2 text-sm font-bold leading-6 text-[#5b4a77]">{item.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="El programa"
        intro="Estos son los 3 componentes que te llevarán paso a paso."
        title="Curso, sesiones LIVE y comunidad"
        tone="light"
      >
        <div className="grid gap-5 lg:grid-cols-3">
          {components.map((component) => (
            <article
              className="overflow-hidden rounded-lg border border-[#eadcf7] bg-white text-[#24104e] shadow-[0_16px_36px_rgba(78,28,134,0.1)]"
              key={component.title}
            >
              <div className="bg-[#f8f1ff]">
                <OfferImage
                  alt={component.title}
                  className="aspect-[16/10] w-full object-cover"
                  src={component.image}
                />
              </div>
              <div className="p-5">
                <p className="inline-flex rounded-md bg-[#ffd45d] px-3 py-1 text-xs font-black uppercase text-[#4b1596]">
                  Componente
                </p>
                <h3 className="mt-3 font-sans text-xl font-black leading-7">{component.title}</h3>
                <p className="mt-3 text-sm font-semibold leading-6 text-[#5b4a77]">{component.text}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Plataforma y acceso"
        intro="Tendrás una plataforma de estudios que puedes ver desde celular, tablet o computadora, desde cualquier lugar y a cualquier hora."
        title="Acceso por 1 año para avanzar a tu ritmo"
        tone="gradient"
      >
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="overflow-hidden rounded-lg border border-white/18 bg-white/10 p-2 shadow-[0_18px_48px_rgba(0,0,0,0.18)]">
            <OfferImage
              alt="Plataforma de estudios de la certificación"
              className="aspect-[16/10] w-full rounded-md object-cover"
              src={assets.plataforma}
            />
          </div>
          <div className="grid gap-4">
            {[
              'Más de 200 lecciones, entrenamientos, tutoriales y descargas.',
              'Moldes reales y plantillas prácticas para libros sensoriales.',
              'Acceso desde cualquier dispositivo durante 1 año.',
            ].map((item) => (
              <div
                className="flex gap-3 rounded-lg border border-white/16 bg-white/10 p-5 shadow-sm"
                key={item}
              >
                <MonitorSmartphone aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#7ef8f0]" />
                <p className="font-black leading-6 text-white">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Garantía"
        intro="Tienes 7 días para vivir la experiencia, revisar si el contenido conecta contigo y decidir con calma."
        title="Además tienes una garantía de 7 días"
        tone="dark"
      >
        <div className="flex flex-col gap-5 rounded-lg border-2 border-dashed border-[#ffd45d]/42 bg-white/8 p-6 shadow-[0_18px_48px_rgba(0,0,0,0.18)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <ShieldCheck aria-hidden="true" className="h-10 w-10 shrink-0 text-[#ffd45d]" />
            <p className="max-w-3xl text-base font-bold leading-7 text-white/86">
              Queremos que entres con confianza. Si en los primeros 7 días sientes que esta
              certificación no es para ti, tendrás una garantía clara y tranquilizadora.
            </p>
          </div>
          <CheckoutCta>QUIERO INSCRIBIRME AHORA</CheckoutCta>
        </div>
      </Section>

      <Section
        eyebrow="Resultados reales"
        intro="Mira cómo la Certificación ha impactado la vida de más de 520 mujeres."
        title="Historias de alumnas"
        tone="white"
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-[1.1fr_0.9fr_0.9fr]">
          {assets.testimonios.map((src, index) => (
            <figure
              className={[
                'overflow-hidden rounded-lg border border-[#eadcf7] bg-white p-2 shadow-[0_14px_32px_rgba(78,28,134,0.09)]',
                index === 0 ? 'sm:row-span-2' : '',
              ].join(' ')}
              key={src}
            >
              <OfferImage
                alt={`Testimonio de alumna ${index + 1}`}
                className={[
                  'w-full rounded-md object-cover',
                  index === 0 ? 'aspect-[4/5] h-full' : 'aspect-[4/3]',
                ].join(' ')}
                src={src}
              />
            </figure>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Oferta"
        intro="La Certificación de Juguetería Creativa Profesional, todos los regalos y el acompañamiento."
        title="Inscríbete por una cuota de 197 USD"
        tone="gradient"
      >
        <div className="relative overflow-hidden rounded-lg border-2 border-dashed border-[#ffd45d]/46 bg-[#170830]/72 p-5 shadow-[0_30px_90px_rgba(23,8,48,0.42)] backdrop-blur sm:p-7 lg:p-8">
          <Sparkles className="absolute right-5 top-5 h-8 w-8 text-[#ffd45d]/70" aria-hidden="true" />
          <div className="grid gap-7 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div className="rounded-lg bg-white p-6 text-[#24104e] shadow-[0_24px_64px_rgba(0,0,0,0.2)] sm:p-7">
              <p className="inline-flex rounded-md bg-[#ffd45d] px-3 py-1 text-sm font-black uppercase text-[#4b1596]">
                Una cuota
              </p>
              <p className="mt-3 font-sans text-6xl font-black leading-none text-[#e0008a] sm:text-7xl">
                197 USD
              </p>
              <p className="mt-4 text-sm font-bold leading-6 text-[#5b4a77]">
                Paga con tarjeta de crédito, débito o PayPal. Si estás en Ecuador y deseas depósito,
                escríbenos por WhatsApp.
              </p>
              <div className="mt-6 grid gap-3">
                {['Certificación completa', 'Bonos incluidos', 'Acceso por 1 año', 'Garantía de 7 días'].map(
                  (item) => (
                    <p className="flex items-center gap-2 text-sm font-black text-[#342052]" key={item}>
                      <CheckCircle2 aria-hidden="true" className="h-5 w-5 text-[#13cdd7]" />
                      {item}
                    </p>
                  ),
                )}
              </div>
              <div className="mt-7 flex flex-col gap-3">
                <CheckoutCta>QUIERO INSCRIBIRME AHORA</CheckoutCta>
                <SupportLink className="border-[#4b1596]/24 bg-[#4b1596]/8 text-[#4b1596] hover:bg-[#4b1596]/12" />
              </div>
            </div>
            <div>
              <p className="text-xs font-black uppercase text-[#7ef8f0]">Decisión con tranquilidad</p>
              <h3 className="mt-3 max-w-xl font-sans text-3xl font-black leading-tight text-white sm:text-4xl">
                Una habilidad creativa que puede acompañarte durante años.
              </h3>
              <p className="mt-4 max-w-xl text-base font-bold leading-7 text-white/82">
                Entras con ruta, moldes, sesiones LIVE, comunidad y una garantía para tomar esta
                decisión con confianza.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  '10 sesiones grupales en vivo',
                  'Plantillas y moldes reales',
                  'Comunidad exclusiva',
                  'Ruta para conseguir clientes',
                ].map((item) => (
                  <div
                    className="rounded-lg border border-white/14 bg-white/10 p-4 text-sm font-black leading-6 text-white"
                    key={item}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Regalos"
        intro="En esta ocasión recibirás 10 regalos muy valiosos para avanzar con más herramientas desde el día 1."
        title="Bonos incluidos en la certificación"
        tone="light"
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bonuses.map((bonus, index) => (
            <article
              className="overflow-hidden rounded-lg border border-[#eadcf7] bg-white text-[#24104e] shadow-[0_16px_36px_rgba(78,28,134,0.1)]"
              key={bonus.title}
            >
              {bonus.image ? (
                <OfferImage
                  alt={bonus.title}
                  className="aspect-[4/3] w-full bg-[#f8f1ff] object-cover"
                  src={bonus.image}
                />
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center bg-[linear-gradient(135deg,#4b1596_0%,#d332a0_100%)] p-6 text-center text-[#ffd45d]">
                  <div>
                    <Gift aria-hidden="true" className="mx-auto h-11 w-11" />
                    <p className="mt-3 text-xs font-black uppercase text-white/88">Regalo de valor</p>
                  </div>
                </div>
              )}
              <div className="p-5">
                <p className="inline-flex rounded-md bg-[#ffd45d] px-3 py-1 text-xs font-black uppercase text-[#4b1596]">
                  Bono {index + 1}
                </p>
                <h3 className="mt-3 font-sans text-lg font-black leading-6">{bonus.title}</h3>
                <p className="mt-2 text-sm font-black text-[#e0008a]">{bonus.value}</p>
                <p className="mt-3 text-sm font-bold leading-6 text-[#5b4a77]">{bonus.text}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Acción rápida"
        intro="Estos regalos son exclusivos para quienes se inscriban en las primeras 24 horas."
        title='Bono de Acción Rápida: Pack "Los 3 Juguetes Más Vendidos"'
        tone="purple"
      >
        <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div className="overflow-hidden rounded-lg border-2 border-dashed border-[#ffd45d]/46 bg-white/8 p-2 shadow-[0_18px_48px_rgba(0,0,0,0.18)]">
            <OfferImage
              alt='Bono de acción rápida Los 3 Juguetes Más Vendidos'
              className="aspect-[4/3] w-full rounded-md object-cover"
              src={assets.bonos[3]}
            />
          </div>
          <div className="space-y-4">
            <div className="flex gap-3 rounded-lg border-2 border-dashed border-white/24 bg-white/10 p-5">
              <Star aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#ffd45d]" />
              <p className="font-black leading-7 text-white">
                Lista con los 3 juguetes más vendidos y su paso a paso para empezar ya.
              </p>
            </div>
            <div className="flex gap-3 rounded-lg border-2 border-dashed border-white/24 bg-white/10 p-5">
              <Lightbulb aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#7ef8f0]" />
              <p className="font-black leading-7 text-white">
                Pack de ventas rápidas para ayudarte a recuperar tu inversión desde el primer mes.
              </p>
            </div>
            <CheckoutCta>QUIERO ENTRAR A LA CERTIFICACIÓN</CheckoutCta>
          </div>
        </div>
      </Section>

      <Section eyebrow="Preguntas" title="Frases frecuentes" tone="light">
        <div className="grid gap-3">
          {faqs.map((faq) => (
            <details
              className="group rounded-lg border border-[#eadcf7] bg-white p-5 shadow-sm"
              key={faq.question}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-sans text-base font-black text-[#24104e]">
                <span className="flex items-center gap-3">
                  <HelpCircle aria-hidden="true" className="h-5 w-5 shrink-0 text-[#e0008a]" />
                  {faq.question}
                </span>
                <span className="text-[#e0008a] transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 text-sm font-bold leading-6 text-[#5b4a77]">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Soporte"
        intro="Si estás en Ecuador y deseas pagar con depósito o tienes preguntas, escríbenos por WhatsApp."
        title="Estamos para ayudarte"
        tone="gradient"
      >
        <div className="flex flex-col gap-4 rounded-lg border border-white/18 bg-white/10 p-6 shadow-[0_20px_54px_rgba(36,16,78,0.32)] sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-base font-black leading-7 text-white">
            Te ayudamos a revisar opciones de pago y resolver dudas antes de entrar a la
            certificación.
          </p>
          <SupportLink />
        </div>
      </Section>

      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#24104e_0%,#4b1596_54%,#d332a0_100%)] text-white">
        <DecorativeLayer />
        <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-7 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_0.82fr] lg:px-10 lg:py-20">
          <div>
            <p className="text-xs font-black uppercase text-[#7ef8f0]">Cierre de inscripción</p>
            <h2 className="mt-3 max-w-3xl font-sans text-3xl font-black leading-tight sm:text-4xl">
              Si esto está resonando contigo, este es el momento de entrar.
            </h2>
            <p className="mt-4 max-w-2xl text-base font-bold leading-7 text-white/84 sm:text-lg">
              La Certificación te da ruta, acompañamiento y herramientas para convertir tu
              creatividad en un proyecto con propósito.
            </p>
          </div>
          <div className="rounded-lg border-2 border-dashed border-white/28 bg-[#2b1163]/72 p-5 shadow-[0_20px_54px_rgba(36,16,78,0.35)] backdrop-blur">
            <p className="inline-flex rounded-md bg-[#ffd45d] px-3 py-1 text-xs font-black uppercase text-[#4b1596]">
              Una cuota
            </p>
            <p className="mt-3 font-sans text-5xl font-black leading-none text-[#ffd45d]">197 USD</p>
            <p className="mt-3 text-sm font-bold leading-6 text-white/78">
              Acceso por 1 año, bonos incluidos y garantía de 7 días.
            </p>
            <div className="mt-6">
              <CheckoutCta>QUIERO INSCRIBIRME AHORA</CheckoutCta>
            </div>
          </div>
        </div>
      </section>

      <StickyMobileCta />

      <footer className="bg-[#170830] px-5 py-10 text-white sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <p className="font-sans text-lg font-black">Pame Flores Crea</p>
          <p className="mt-4 max-w-5xl text-xs leading-6 text-white/64">
            Este sitio no es parte del sitio de Facebook o de Facebook Inc. Adicionalmente, este
            sitio NO está endosado por Facebook de ninguna manera. FACEBOOK es una marca registrada
            de FACEBOOK, Inc. Estamos compartiendo nuestra experiencia; esta información no es
            garantía de ganancias o resultados.
          </p>
        </div>
      </footer>
    </main>
  );
}

export default CreativeToysOfferTemporaryPage;
