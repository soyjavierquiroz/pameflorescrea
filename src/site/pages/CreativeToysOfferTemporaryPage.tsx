import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
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
const GALLERY_AUTOPLAY_INTERVAL_MS = 2000;

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
    `${ASSET_BASE}/certificacion-jcp.webp`,
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
  galeria: [
    `${ASSET_BASE}/gallery/galeria-1.webp`,
    `${ASSET_BASE}/gallery/galeria-2.webp`,
    `${ASSET_BASE}/gallery/galeria-3.webp`,
    `${ASSET_BASE}/gallery/galeria-4.webp`,
    `${ASSET_BASE}/gallery/galeria-5.webp`,
    `${ASSET_BASE}/gallery/galeria-6.webp`,
    `${ASSET_BASE}/gallery/galeria-7.webp`,
    `${ASSET_BASE}/gallery/galeria-8.webp`,
  ],
  bonos: [
    `${ASSET_BASE}/bono-calculadora.webp`,
    `${ASSET_BASE}/bono-costura.webp`,
    `${ASSET_BASE}/bono-envio.webp`,
    `${ASSET_BASE}/bono-accion-rapida.webp`,
    `${ASSET_BASE}/bono-ventas-rapidas.webp`,
  ],
};

const bonusImages = {
  agendaMama: `${ASSET_BASE}/agenda-mama.webp`,
  costura: `${ASSET_BASE}/de-principiante-a-experta-cosiendo.webp`,
  envioPerfecto: `${ASSET_BASE}/envio-perfecto.webp`,
  estimulacionTemprana: `${ASSET_BASE}/estimulacion-temprana.webp`,
  fotosVideos: `${ASSET_BASE}/fotos-videos-que-venden.webp`,
  imprimeVendeSublimado: `${ASSET_BASE}/imprime-vende-sublimado.webp`,
  juguetesCreativos: `${ASSET_BASE}/juguetes-creativos-que-enamoran.webp`,
  moldesCanva: `${ASSET_BASE}/disena-moldes-canva.webp`,
  ventasExplosivasInstagram: `${ASSET_BASE}/ventas-explisivas-instagram.webp`,
  ventasTemporadasAltas: `${ASSET_BASE}/ventas-temporadas-altas.webp`,
};

const trustChips = [
  { icon: Clock3, label: 'Acceso por 1 año' },
  { icon: Users, label: 'Comunidad y soporte' },
  { icon: ShieldCheck, label: '7 días de garantía' },
];

const idealFor = [
  'Sientes que tienes mucho potencial, pero todavía no encuentras un proyecto rentable donde poner todo lo que eres capaz de hacer.',
  'Sueñas con construir algo propio que te haga sentir orgullosa y además genere ingresos para tu familia.',
  'Amas la creatividad y el mundo infantil, y quieres convertir esa pasión en un proyecto con propósito.',
  'Has probado diferentes ideas, pero ninguna ha conectado realmente contigo ni con la vida que quieres construir.',
  'Quieres dejar de sentirte perdida y seguir una ruta clara para construir un proyecto propio, aunque hoy empieces desde cero.',
];

const certificationIncludes = [
  {
    title: 'MÉTODO',
    text: 'Tendrás mi método estrella de la 3Ns y te mostraré cómo aplicarlo para tener un negocio con un propósito pero además que sea rentable.',
  },
  {
    title: 'PRODUCTO ESTRELLA',
    text: 'Obtendrás el paso a paso para hacer Libros sensoriales novedosos, que atraigan a tus clientes.',
  },
  {
    title: 'CLIENTES ESTRELLA',
    text: 'Te mostraré exactamente cómo utilizar los 5 nichos de oportunidad para conseguir clientes estrella que valoren tus productos y paguen lo justo.',
  },
  {
    title: 'CONFECCIÓN RÁPIDA',
    text: 'Obtendrás plantillas y moldes en tamaño real para que puedas hacer tus primeros libros sensoriales de la manera más fácil y rápida.',
  },
  {
    title: 'COMUNIDAD',
    text: 'Tendrás una comunidad de Jugueteras Creativas Profesionales con quien apoyarte y además con quien compartir conocimiento y recibirás la motivación que necesitas.',
  },
  {
    title: 'RUTA EXACTA',
    text: 'Tendrás una ruta exacta para conseguir desde tus primeros clientes hasta convertirte en una experta.',
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

type Bonus = {
  image?: string;
  imageAlt?: string;
  imageFit?: 'contain' | 'cover';
  title: string;
  value: string;
  text: string;
};

const bonuses: Bonus[] = [
  {
    image: bonusImages.juguetesCreativos,
    imageAlt: 'Bono juguetes creativos que enamoran',
    imageFit: 'contain',
    title: 'Juguetes Creativos que Enamoran',
    value: 'Valorado en 77 USD',
    text: 'Biblioteca con 24 tutoriales en video, plantillas y moldes para abrir nuevas opciones de ingresos.',
  },
  {
    image: bonusImages.costura,
    imageAlt: 'Bono de principiante a experta cosiendo',
    imageFit: 'contain',
    title: 'De Principiante a Experta Cosiendo',
    value: 'Valorado en 127 USD',
    text: 'Una masterclass para vencer el miedo a la costura y ganar habilidades duraderas.',
  },
  {
    image: bonusImages.estimulacionTemprana,
    imageAlt: 'Bono estimulación temprana',
    imageFit: 'contain',
    title: 'Guía Express de Estimulación Temprana',
    value: 'Valorado en 97 USD',
    text: 'Aprende qué actividades incluir en tus libros según la edad de los niños.',
  },
  {
    image: bonusImages.ventasExplosivasInstagram,
    imageAlt: 'Bono ventas explosivas en Instagram',
    imageFit: 'contain',
    title: 'Ventas explosivas con Instagram',
    value: 'Valorado en 97 USD',
    text: 'Aprende a usar Instagram a favor de tu emprendimiento sin sentirte perdida con la tecnología.',
  },
  {
    image: bonusImages.imprimeVendeSublimado,
    imageAlt: 'Bono imprime y vende sublimado',
    imageFit: 'contain',
    title: 'Imprime y Vende - Juguetes en Sublimado',
    value: 'Valorado en 97 USD',
    text: 'Una técnica con posibilidades para crear juguetes lindos y originales.',
  },
  {
    image: bonusImages.agendaMama,
    imageAlt: 'Bono agenda para una mamá emprendedora',
    imageFit: 'contain',
    title: 'Agenda para una mamá emprendedora',
    value: 'Valorado en 47 USD',
    text: 'Tutorial y guía práctica para organizar mejor tu tiempo y avanzar con más calma.',
  },
  {
    image: bonusImages.envioPerfecto,
    imageAlt: 'Bono envío perfecto',
    imageFit: 'contain',
    title: 'Envío Perfecto',
    value: 'Valorado en 47 USD',
    text: 'Empaca tus juguetes creativos de forma rápida, económica y práctica.',
  },
  {
    image: bonusImages.fotosVideos,
    imageAlt: 'Bono fotos y videos que venden',
    imageFit: 'contain',
    title: 'Fotos y videos que venden',
    value: 'Valorado en 47 USD',
    text: 'Aprende a tomar fotos que enamoren a tus clientes usando tu celular.',
  },
  {
    image: bonusImages.moldesCanva,
    imageAlt: 'Bono diseña tus moldes en Canva',
    imageFit: 'contain',
    title: 'Diseña tus propios moldes en Canva',
    value: 'Valorado en 47 USD',
    text: 'Una solución práctica para dejar de sufrir cuando necesitas moldes propios.',
  },
  {
    image: bonusImages.ventasTemporadasAltas,
    imageAlt: 'Bono ventas en temporadas altas',
    imageFit: 'contain',
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
      'La oferta es una cuota de 197 USD o en 3 o 5 cuotas. Puedes pagar con tarjeta de crédito, débito o PayPal; si estás en Ecuador y deseas depósito, puedes escribirnos por WhatsApp.',
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
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-[4.5rem] lg:px-10 lg:py-20">
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
          <h2 className="font-sans text-[clamp(1.68rem,7vw,2.2rem)] font-black leading-[1.12] sm:text-4xl sm:leading-tight">
            {title}
          </h2>
          {intro ? (
            <p
              className={[
                'mt-4 max-w-[42rem] text-base font-semibold leading-7 sm:text-lg sm:leading-8',
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
  variant?: 'default' | 'payment' | 'sticky';
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
          ? 'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-[#e0008a] px-4 py-3 text-center text-xs font-black uppercase leading-4 text-white shadow-[0_12px_28px_rgba(224,0,138,0.36)] transition duration-200 hover:bg-[#ff149d] focus:outline-none focus:ring-2 focus:ring-[#ffd45d] focus:ring-offset-2 focus:ring-offset-[#170830]'
          : variant === 'payment'
            ? 'inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-lg bg-[#e0008a] px-4 py-3 text-center text-[13px] font-black uppercase leading-5 text-white shadow-[0_14px_34px_rgba(224,0,138,0.32)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#ff149d] focus:outline-none focus:ring-2 focus:ring-[#ffd45d] focus:ring-offset-2 focus:ring-offset-white sm:px-5 sm:text-sm'
            : 'inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-lg bg-[#e0008a] px-5 py-4 text-center text-sm font-black uppercase leading-5 text-white shadow-[0_18px_42px_rgba(224,0,138,0.38)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#ff149d] focus:outline-none focus:ring-2 focus:ring-[#ffd45d] focus:ring-offset-2 focus:ring-offset-[#2b1163] sm:w-auto sm:px-8',
        className,
      ].join(' ')}
      href={TEMPORARY_OFFER_CHECKOUT_URL}
      onClick={handleCheckoutClick}
    >
      <span>{children}</span>
      <ArrowRight aria-hidden="true" className="h-5 w-5 shrink-0" />
    </a>
  );
}

function SupportLink({
  className = '',
  variant = 'dark',
}: {
  className?: string;
  variant?: 'dark' | 'offer';
}) {
  return (
    <a
      className={[
        'inline-flex min-h-[54px] w-full items-center justify-center gap-2 rounded-lg border-2 px-5 py-3 text-center text-sm font-black uppercase leading-5 transition focus:outline-none focus:ring-2 sm:w-auto',
        variant === 'offer'
          ? 'border-[#7ef8f0] bg-white text-[#24104e] shadow-[0_12px_26px_rgba(75,21,150,0.12)] hover:border-[#7ef8f0] hover:bg-[#7ef8f0] hover:text-[#24104e] focus:ring-[#7ef8f0] focus:ring-offset-2 focus:ring-offset-white active:bg-[#5ee6de]'
          : 'border-[#7ef8f0]/70 bg-white/12 text-white hover:bg-white/18 focus:ring-[#7ef8f0]',
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

function GalleryCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    updatePreference();
    mediaQuery.addEventListener?.('change', updatePreference);

    return () => {
      mediaQuery.removeEventListener?.('change', updatePreference);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || prefersReducedMotion) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % assets.galeria.length);
    }, GALLERY_AUTOPLAY_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const currentSlide = slideRefs.current[currentIndex];

    if (!scroller || !currentSlide) {
      return;
    }

    scroller.scrollTo({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      left: currentSlide.offsetLeft,
    });
  }, [currentIndex, prefersReducedMotion]);

  return (
    <div
      aria-label="Galería de juguetes creativos"
      className="-mx-5 scroll-px-5 overflow-x-auto px-5 pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:-mx-10 lg:scroll-px-10 lg:px-10"
      ref={scrollerRef}
    >
      <div className="flex snap-x snap-mandatory gap-3 sm:gap-4">
        {assets.galeria.map((src, index) => (
          <figure
            className="min-w-[86%] snap-start overflow-hidden rounded-lg border border-[#eadcf7] bg-white p-2 shadow-[0_16px_36px_rgba(78,28,134,0.11)] sm:min-w-[44%] lg:min-w-[28%]"
            key={src}
            ref={(element) => {
              slideRefs.current[index] = element;
            }}
          >
            <OfferImage
              alt={`Galería de juguetes creativos ${index + 1}`}
              className="aspect-[4/5] w-full rounded-md object-cover"
              src={src}
            />
          </figure>
        ))}
      </div>
    </div>
  );
}

function MiniProofCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-white/16 bg-white/10 p-4 text-sm font-black leading-6 text-white shadow-sm backdrop-blur">
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
        'fixed inset-x-0 bottom-0 z-50 border-t border-white/12 bg-[#170830]/94 px-4 pt-2.5 shadow-[0_-16px_42px_rgba(23,8,48,0.34)] backdrop-blur transition-[opacity,transform] duration-300 motion-reduce:transition-none sm:hidden',
        isVisible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-[110%] opacity-0',
      ].join(' ')}
      style={{ paddingBottom: 'max(0.625rem, env(safe-area-inset-bottom))' }}
    >
      <div className="mx-auto flex max-w-lg items-center">
        <CheckoutCta className="w-full" variant="sticky">
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
      'Descubre cómo generar ingresos extra con juguetes creativos y construir un proyecto con propósito junto a Pame Flores.';
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
        <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-7 px-5 pb-10 pt-4 sm:px-8 sm:pb-14 sm:pt-8 lg:min-h-[680px] lg:grid-cols-[1.02fr_0.98fr] lg:px-10 lg:pb-20 lg:pt-10">
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
            <h1 className="mt-4 max-w-[41rem] font-sans text-[clamp(1.55rem,6.6vw,2.05rem)] font-black leading-[1.08] text-white sm:text-5xl sm:leading-[1.04] lg:text-[3.28rem]">
              Descubre la manera más simple de construir un proyecto propio con{' '}
              <span className="text-[#7ef8f0]">Juguetes Creativos</span> y generar ingresos extra
              haciendo algo que te haga <span className="text-[#ffd45d]">sentir orgullosa</span>.
            </h1>
            <p className="mt-4 max-w-[37rem] text-[clamp(0.96rem,3.75vw,1.08rem)] font-bold leading-[1.55] text-white/88 sm:text-xl sm:leading-8 lg:text-[1.28rem]">
              Aunque hoy no sepas por dónde empezar, descubrirás el paso a paso para convertir tu creatividad y tu amor por los niños en un proyecto propio que impacte vidas y genere ingresos para tu familia.
            </p>
            <div className="mt-5 grid gap-4 rounded-lg border border-white/18 bg-white/12 p-4 shadow-[0_22px_54px_rgba(36,16,78,0.32)] backdrop-blur sm:mt-6 sm:max-w-2xl sm:grid-cols-[0.92fr_1.08fr] sm:items-center sm:border-[#ffd45d]/44 sm:p-5">
              <div className="grid gap-2">
                <p className="text-xs font-black uppercase text-[#7ef8f0]">
                  Una cuota o en 3 o 5 cuotas
                </p>
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

          <div className="relative flex min-h-[340px] items-end justify-center sm:min-h-[430px] lg:min-h-[600px] lg:items-center">
            <div className="absolute inset-x-8 bottom-4 top-12 rotate-[-3deg] rounded-lg border-2 border-dotted border-[#ffd45d]/60 bg-white/10" />
            <div className="absolute -right-8 bottom-8 h-32 w-32 rounded-full bg-[#e0008a]/38 blur-3xl" />
            <div className="relative w-full max-w-[520px]">
              <div className="overflow-hidden rounded-lg border-2 border-dashed border-white/38 bg-[#4a1ca4] shadow-[0_26px_74px_rgba(36,16,78,0.45)]">
                <OfferImage
                  alt="Pame Flores acompañando la Certificación de Juguetería Creativa Profesional"
                  className="h-full min-h-[320px] w-full object-cover object-top sm:min-h-[460px] lg:min-h-[560px]"
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
        title="Es ideal para ti si:"
        tone="light"
      >
        <div className="mx-auto max-w-4xl rounded-2xl border border-[#eadcf7] bg-white p-6 shadow-[0_18px_42px_rgba(78,28,134,0.1)] sm:p-7 lg:p-8">
          <ul className="grid gap-5 sm:gap-6">
            {idealFor.map((item) => (
              <li className="flex gap-3.5 text-[#342052]" key={item}>
                <span aria-hidden="true" className="mt-0.5 text-lg leading-7 sm:text-2xl">
                  💛
                </span>
                <p className="text-base font-bold leading-7 sm:text-lg sm:leading-8">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section
        eyebrow="Menos frustración y más acción creativa"
        title="La Juguetería Creativa puede convertirse en ese proyecto propio que llevas tiempo buscando."
        tone="purple"
      >
        <div className="grid gap-9 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <div className="overflow-hidden rounded-lg border-2 border-dashed border-[#ffd45d]/44 bg-white/8 p-2 shadow-[0_24px_58px_rgba(0,0,0,0.22)]">
            <OfferImage
              alt="Pame Flores con juguetes creativos"
              className="h-full min-h-[300px] w-full rounded-md object-cover object-center sm:min-h-[420px] lg:min-h-[460px]"
              src={assets.pameVipCreative}
            />
          </div>
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-md border border-white/18 bg-white/10 px-3 py-2 text-xs font-black uppercase text-[#ffd45d]">
              <Images aria-hidden="true" className="h-4 w-4" />
              Creatividad con propósito
            </p>
            <div className="mt-5 space-y-5 text-base font-bold leading-7 text-white/88 sm:text-xl sm:leading-9">
              <p>
                Sé que dentro de ti hay un enorme deseo de crear, crecer y construir algo propio.
                Un proyecto que no solo te permita generar ingresos, sino también descubrir de lo
                que eres capaz, sentirte orgullosa de lo que construyes y poner tus talentos al
                servicio de los demás. Eso es lo que representa la Juguetería Creativa para cientos
                de mujeres que decidieron darse una oportunidad.
              </p>
              <p>Pero primero debes confiar en ti y también:</p>
            </div>
            <div className="mt-6 border-l-2 border-[#ffd45d]/55 pl-5 sm:pl-6">
              <ul className="grid gap-[1.125rem]">
                {[
                  'Confiar en tu capacidad.',
                  'Confiar en tu intuición y en ese proyecto que hace tanto tiempo está en tu corazón.',
                  'Dejarte acompañar.',
                  'Reconocer que mereces un espacio y una actividad para ti.',
                  'Entender que puedes construir el proyecto de tus sueños.',
                ].map((item) => (
                  <li className="flex gap-3 text-base font-black leading-7 text-white sm:text-lg" key={item}>
                    <span aria-hidden="true" className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#ffd45d] shadow-[0_0_0_4px_rgba(255,212,93,0.16)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-6 text-base font-bold leading-7 text-white/88 sm:text-xl sm:leading-9">
              Esta transformación requiere un proceso y estoy aquí para caminar juntas, paso a paso.
            </p>
            <div className="mt-7">
              <CheckoutCta>QUIERO YA SER PARTE DEL PROGRAMA</CheckoutCta>
            </div>
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Quote"
        title="La Juguetería Creativa es la opción que conecta con tu corazón y tus talentos."
        tone="gradient"
      >
        <blockquote className="max-w-4xl rounded-lg border-2 border-dashed border-[#ffd45d]/46 bg-white/10 p-6 text-[1.2rem] font-black leading-8 text-white shadow-[0_18px_48px_rgba(0,0,0,0.18)] sm:p-8 sm:text-2xl sm:leading-10">
          “A veces no se trata ni de emprender, ni de generar ingresos. Se trata de ver a la luz ese potencial que sabemos que tenemos.”
        </blockquote>
      </Section>

      <Section
        eyebrow="Lo que incluye"
        intro="Todo lo que necesitas para dejar de sentirte perdida y empezar a construir un proyecto propio con claridad y confianza."
        title="¿QUÉ INCLUYE LA CERTIFICACIÓN J.C.P.?"
        tone="white"
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {certificationIncludes.map((item) => (
            <article
              className="rounded-lg border border-[#eadcf7] bg-[#fbf3ff] p-6 shadow-[0_14px_30px_rgba(78,28,134,0.08)]"
              key={item.title}
            >
              <BadgeCheck aria-hidden="true" className="h-7 w-7 text-[#e0008a]" />
              <h3 className="mt-4 font-sans text-lg font-black text-[#24104e]">{item.title}</h3>
              <p className="mt-3 text-sm font-bold leading-6 text-[#5b4a77] sm:text-[15px] sm:leading-7">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Galería"
        intro="Mira algunos de los proyectos y resultados creativos que acompañan este camino."
        title="Juguetes creativos hechos con propósito"
        tone="light"
      >
        <GalleryCarousel />
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
        title="Inscríbete eligiendo la opción de pago que prefieras"
        tone="gradient"
      >
        <div className="relative overflow-hidden rounded-lg border-2 border-dashed border-[#ffd45d]/46 bg-[#170830]/72 p-5 shadow-[0_30px_90px_rgba(23,8,48,0.42)] backdrop-blur sm:p-7 lg:p-8">
          <Sparkles className="absolute right-5 top-5 h-8 w-8 text-[#ffd45d]/70" aria-hidden="true" />
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1.22fr)_minmax(280px,0.78fr)] lg:items-start xl:grid-cols-[minmax(620px,1.15fr)_minmax(340px,0.85fr)]">
            <div className="rounded-lg bg-white p-5 text-[#24104e] shadow-[0_24px_64px_rgba(0,0,0,0.2)] sm:p-7 lg:p-8">
              <div className="grid gap-4">
                <div className="grid gap-5 rounded-lg border-2 border-[#ffd45d] bg-[#fffaf0] p-5 shadow-[0_18px_38px_rgba(224,0,138,0.12)] sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(270px,0.42fr)] lg:items-center">
                  <div>
                    <p className="inline-flex rounded-md bg-[#ffd45d] px-3 py-1 text-sm font-black uppercase text-[#4b1596]">
                      UNA CUOTA
                    </p>
                    <p className="mt-3 font-sans text-5xl font-black leading-none text-[#e0008a] sm:text-6xl">
                      197 USD
                    </p>
                  </div>
                  <div className="lg:justify-self-end">
                    <CheckoutCta className="lg:w-[270px] xl:w-[300px]" variant="payment">
                      QUIERO PAGAR 197 USD
                    </CheckoutCta>
                  </div>
                </div>
                <div className="grid gap-5 rounded-lg border-2 border-[#eadcf7] bg-[#fbf7ff] p-5 shadow-[0_18px_38px_rgba(75,21,150,0.1)] sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(270px,0.42fr)] lg:items-center">
                  <div>
                    <p className="inline-flex rounded-md bg-[#13cdd7]/14 px-3 py-1 text-sm font-black uppercase text-[#4b1596]">
                      3 CUOTAS
                    </p>
                    <div className="mt-3 flex flex-wrap items-end gap-x-3 gap-y-1">
                      <p className="font-sans text-5xl font-black leading-none text-[#e0008a] sm:text-6xl">
                        77 USD
                      </p>
                      <p className="pb-1 text-sm font-black uppercase text-[#5b4a77]">POR 3 MESES</p>
                    </div>
                  </div>
                  <div className="lg:justify-self-end">
                    <CheckoutCta className="lg:w-[270px] xl:w-[300px]" variant="payment">
                      QUIERO PAGAR EN 3 CUOTAS
                    </CheckoutCta>
                  </div>
                </div>
                <div className="grid gap-5 rounded-lg border-2 border-[#eadcf7] bg-[#fbf7ff] p-5 shadow-[0_18px_38px_rgba(75,21,150,0.1)] sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(270px,0.42fr)] lg:items-center">
                  <div>
                    <p className="inline-flex rounded-md bg-[#13cdd7]/14 px-3 py-1 text-sm font-black uppercase text-[#4b1596]">
                      5 CUOTAS
                    </p>
                    <div className="mt-3 flex flex-wrap items-end gap-x-3 gap-y-1">
                      <p className="font-sans text-5xl font-black leading-none text-[#e0008a] sm:text-6xl">
                        47 USD
                      </p>
                      <p className="pb-1 text-sm font-black text-[#5b4a77]">por 5 meses</p>
                    </div>
                  </div>
                  <div className="lg:justify-self-end">
                    <CheckoutCta className="lg:w-[270px] xl:w-[300px]" variant="payment">
                      QUIERO PAGAR EN 5 CUOTAS
                    </CheckoutCta>
                  </div>
                </div>
              </div>
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
                <SupportLink variant="offer" />
              </div>
            </div>
            <div className="lg:pt-2">
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
                  alt={bonus.imageAlt ?? bonus.title}
                  className={[
                    'aspect-[4/3] w-full bg-[#f8f1ff]',
                    bonus.imageFit === 'contain' ? 'object-contain p-4 sm:p-5' : 'object-cover',
                  ].join(' ')}
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
              Una cuota o en 3 o 5 cuotas
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
