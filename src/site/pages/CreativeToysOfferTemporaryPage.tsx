import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock3,
  Gift,
  HeartHandshake,
  HelpCircle,
  MessageCircle,
  MonitorSmartphone,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
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

const assets = {
  hero: `${ASSET_BASE}/hero-certificacion.webp`,
  pame: `${ASSET_BASE}/pame-oferta.webp`,
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
  { icon: Users, label: 'Comunidad y soporte' },
  { icon: ShieldCheck, label: '7 días de garantía' },
];

const idealFor = [
  'Eres una mamá que trabaja medio tiempo o está en casa y quieres generar ingresos extras sin descuidar a tu familia con un proyecto que ames.',
  'Tienes conocimientos en educación infantil y buscas una opción de negocio alineada a tu profesión y a tus valores.',
  'Eres una mujer talentosa con ganas de empezar el proyecto de tus sueños y convertir tu potencial en un negocio real con impacto.',
  'Estás agotada de empezar proyectos que no tienen que ver contigo, tu propósito ni tus conocimientos.',
  'Has invertido en cursos de marketing o redes, pero sigues buscando una actividad que sí conecte con lo que te gusta emprender.',
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
    text: '10 módulos con videos cortos, moldes reales, plantillas prácticas de 8 libros sensoriales, entrenamientos, tutoriales y descargas.',
  },
  {
    image: assets.programa[1],
    title: 'Jugueteras Creativas LIVE',
    text: '10 sesiones grupales en vivo con Pame y su equipo para acompañarte, guiarte y despejar tus dudas.',
  },
  {
    image: assets.programa[2],
    title: 'Comunidad exclusiva',
    text: 'Un lugar para resolver inquietudes, compartir avances y sentirte acompañada mientras construyes tu proyecto.',
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
  tone?: 'light' | 'white' | 'teal' | 'dark';
  title: string;
}) {
  const toneClasses = {
    light: 'bg-[#f7f2ec] text-[#1f252c]',
    white: 'bg-white text-[#1f252c]',
    teal: 'bg-[#2f6f73] text-white',
    dark: 'bg-[#1f252c] text-white',
  };

  return (
    <section className={toneClasses[tone]} id={id}>
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <div className="max-w-3xl">
          {eyebrow ? (
            <p
              className={[
                'mb-3 text-xs font-black uppercase',
                tone === 'teal' || tone === 'dark' ? 'text-[#f1b84d]' : 'text-[#2f6f73]',
              ].join(' ')}
            >
              {eyebrow}
            </p>
          ) : null}
          <h2 className="font-sans text-3xl font-black leading-tight sm:text-4xl">{title}</h2>
          {intro ? (
            <p
              className={[
                'mt-4 text-base leading-7 sm:text-lg',
                tone === 'teal' || tone === 'dark' ? 'text-white/82' : 'text-[#56606a]',
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
  children = 'Quiero inscribirme ahora',
  className = '',
}: {
  children?: string;
  className?: string;
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
        'inline-flex min-h-[54px] w-full items-center justify-center gap-2 rounded-md bg-[#d66540] px-5 py-3 text-center text-sm font-black uppercase text-white shadow-[0_14px_32px_rgba(214,101,64,0.3)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#be5031] focus:outline-none focus:ring-2 focus:ring-[#f1b84d] focus:ring-offset-2 focus:ring-offset-white sm:w-auto sm:px-7',
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

function SupportLink() {
  return (
    <a
      className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-md border-2 border-[#2f6f73] bg-white px-5 py-3 text-center text-sm font-black uppercase text-[#2f6f73] transition hover:bg-[#eef7f4] focus:outline-none focus:ring-2 focus:ring-[#f1b84d]"
      href={TEMPORARY_OFFER_SUPPORT_WHATSAPP_URL}
      rel="noopener noreferrer"
      target="_blank"
    >
      <MessageCircle aria-hidden="true" className="h-5 w-5" />
      Escríbenos por WhatsApp
    </a>
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
    <main className="min-h-screen bg-[#f7f2ec] text-[#1f252c]">
      <section className="relative isolate overflow-hidden bg-[#f7f2ec]">
        <div className="absolute inset-x-0 top-0 h-2 bg-[#f1b84d]" aria-hidden="true" />
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 pb-12 pt-8 sm:px-8 lg:grid-cols-[1.03fr_0.97fr] lg:px-10 lg:pb-20 lg:pt-12">
          <div className="flex flex-col justify-center">
            <p className="inline-flex w-fit items-center gap-2 rounded-md border border-[#2f6f73]/20 bg-white px-3 py-2 text-xs font-black uppercase text-[#2f6f73] shadow-sm">
              <Sparkles aria-hidden="true" className="h-4 w-4" />
              Certificación J.C.P.
            </p>
            <h1 className="mt-5 max-w-3xl font-sans text-4xl font-black leading-[1.05] text-[#1f252c] sm:text-5xl">
              Descubre la manera más simple y rápida de generar ingresos extras con Juguetes
              Creativos en solo 9 semanas.
            </h1>
            <p className="mt-5 max-w-2xl text-xl font-bold leading-8 text-[#2f6f73]">
              Tu talento y experiencia puede ser la llave para emprender mientras impactas en tu
              comunidad.
            </p>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#56606a] sm:text-lg">
              La Certificación de Juguetería Creativa Profesional te enseña a dominar el arte de la
              Juguetería Creativa y cómo convertirlo en un negocio con propósito.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <CheckoutCta />
              <SupportLink />
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {trustChips.map(({ icon: Icon, label }) => (
                <div
                  className="flex min-h-[72px] items-center gap-3 rounded-lg border border-[#2f6f73]/16 bg-white p-4 shadow-sm"
                  key={label}
                >
                  <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-[#d66540]" />
                  <p className="text-sm font-black leading-5 text-[#1f252c]">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-end justify-center lg:items-center">
            <div className="w-full overflow-hidden rounded-lg border border-[#2f6f73]/18 bg-white p-2 shadow-[0_26px_70px_rgba(31,37,44,0.14)]">
              <OfferImage
                alt="Certificación de Juguetería Creativa Profesional"
                className="aspect-[4/5] w-full rounded-md object-cover sm:aspect-[1/1]"
                loading="eager"
                src={assets.hero}
              />
            </div>
          </div>
        </div>
      </section>

      <Section
        eyebrow="Para quién es"
        intro="Con la Certificación de Juguetería Creativa es más fácil generar ingresos con Juguetes Creativos, aún si empiezas de cero o no te sientes creativa."
        title="Es ideal para ti si..."
        tone="white"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {idealFor.map((item) => (
            <article
              className="flex gap-3 rounded-lg border border-[#e7d8ca] bg-[#fdfaf6] p-5 shadow-sm"
              key={item}
            >
              <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#2f6f73]" />
              <p className="text-sm font-semibold leading-6 text-[#3b424a] sm:text-base">{item}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Menos frustración y más acción creativa"
        intro="Sé que dentro de ti hay una fuerza enorme de querer crear, crecer y encontrar una actividad que no solo te apasione, sino que te permita descubrir tu verdadero potencial mientras generas ingresos extra."
        title="La Juguetería Creativa conecta con tu corazón y tus talentos"
        tone="teal"
      >
        <div className="grid gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="overflow-hidden rounded-lg border border-white/20 bg-white/10 p-2 shadow-[0_24px_58px_rgba(0,0,0,0.18)]">
            <OfferImage
              alt="Pame Flores"
              className="aspect-[4/5] w-full rounded-md object-cover"
              src={assets.pame}
            />
          </div>
          <div className="space-y-5 text-base leading-7 text-white/88 sm:text-lg">
            <p>
              Sé lo que es sentirse perdida, con mil ideas, muchas ganas, miedos y comparación. Pero
              siempre es un buen día para cambiar, pensar diferente y tomar acción.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                'Decidir confiar en tu capacidad.',
                'Decidir confiar en ese proyecto que hace tiempo está en tu corazón.',
                'Decidir dejarte acompañar.',
                'Decidir que mereces un espacio y una actividad para ti.',
              ].map((item) => (
                <div className="rounded-lg bg-white/10 p-4 text-sm font-bold leading-6" key={item}>
                  {item}
                </div>
              ))}
            </div>
            <p className="font-bold text-white">
              Esta transformación requiere un proceso y estoy aquí para caminar juntas, paso a paso.
            </p>
            <CheckoutCta className="focus:ring-offset-[#2f6f73]">Quiero entrar a la certificación</CheckoutCta>
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Lo que incluye"
        intro="Una ruta concreta para pasar de la creatividad dispersa a un proyecto con producto, clientes, confección y comunidad."
        title="Qué incluye la Certificación J.C.P."
        tone="light"
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {certificationIncludes.map((item) => (
            <article className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-[#e7d8ca]" key={item.title}>
              <BadgeCheck aria-hidden="true" className="h-6 w-6 text-[#d66540]" />
              <h3 className="mt-4 font-sans text-lg font-black text-[#1f252c]">{item.title}</h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#56606a]">{item.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="El programa"
        intro="Estos son los 3 componentes que te llevarán paso a paso."
        title="Curso, sesiones LIVE y comunidad"
        tone="white"
      >
        <div className="grid gap-5 lg:grid-cols-3">
          {components.map((component) => (
            <article
              className="overflow-hidden rounded-lg border border-[#e7d8ca] bg-white shadow-[0_16px_38px_rgba(31,37,44,0.08)]"
              key={component.title}
            >
              <OfferImage
                alt={component.title}
                className="aspect-[16/11] w-full bg-[#f7f2ec] object-cover"
                src={component.image}
              />
              <div className="p-5">
                <h3 className="font-sans text-xl font-black leading-7">{component.title}</h3>
                <p className="mt-3 text-sm font-semibold leading-6 text-[#56606a]">{component.text}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Plataforma y acceso"
        intro="Tendrás una plataforma de estudios que puedes ver desde celular, tablet o computadora, desde cualquier lugar y a cualquier hora."
        title="Acceso por 1 año para avanzar a tu ritmo"
        tone="light"
      >
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="overflow-hidden rounded-lg bg-white p-2 shadow-sm ring-1 ring-[#e7d8ca]">
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
              <div className="flex gap-3 rounded-lg bg-white p-5 shadow-sm ring-1 ring-[#e7d8ca]" key={item}>
                <MonitorSmartphone aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#2f6f73]" />
                <p className="font-bold leading-6 text-[#3b424a]">{item}</p>
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
        <div className="flex flex-col gap-5 rounded-lg border border-white/12 bg-white/8 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <ShieldCheck aria-hidden="true" className="h-10 w-10 shrink-0 text-[#f1b84d]" />
            <p className="max-w-3xl text-base font-semibold leading-7 text-white/86">
              Queremos que entres con confianza. Si en los primeros 7 días sientes que esta
              certificación no es para ti, tendrás una garantía clara y tranquilizadora.
            </p>
          </div>
          <CheckoutCta className="focus:ring-offset-[#1f252c]">Quiero inscribirme ahora</CheckoutCta>
        </div>
      </Section>

      <Section
        eyebrow="Resultados reales"
        intro="Mira cómo la Certificación ha impactado la vida de más de 520 mujeres."
        title="Historias de alumnas"
        tone="white"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {assets.testimonios.map((src, index) => (
            <figure
              className="overflow-hidden rounded-lg bg-[#f7f2ec] p-2 shadow-sm ring-1 ring-[#e7d8ca]"
              key={src}
            >
              <OfferImage
                alt={`Testimonio de alumna ${index + 1}`}
                className="aspect-[4/5] w-full rounded-md object-cover"
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
        tone="teal"
      >
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="rounded-lg bg-white p-6 text-[#1f252c] shadow-[0_24px_58px_rgba(0,0,0,0.14)]">
            <p className="text-sm font-black uppercase text-[#2f6f73]">Una cuota</p>
            <p className="mt-2 font-sans text-6xl font-black text-[#d66540]">197 USD</p>
            <p className="mt-4 text-sm font-semibold leading-6 text-[#56606a]">
              Puedes pagar con tarjeta de crédito, débito o PayPal. Si estás en Ecuador y deseas
              pagar con depósito o tienes preguntas, escríbenos por WhatsApp.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <CheckoutCta>Quiero inscribirme ahora</CheckoutCta>
              <SupportLink />
            </div>
          </div>
          <div className="rounded-lg border border-white/18 bg-white/10 p-6">
            <h3 className="font-sans text-2xl font-black text-white">
              Es el momento de regalarte una habilidad que te durará toda la vida.
            </h3>
            <p className="mt-4 text-base font-semibold leading-7 text-white/84">
              Imagínate amar cada cosa que haces mientras generas ingresos extras y construyes el
              proyecto de tus sueños sin descuidar a tu familia.
            </p>
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
            <article className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-[#e7d8ca]" key={bonus.title}>
              {bonus.image ? (
                <OfferImage
                  alt={bonus.title}
                  className="mb-4 aspect-[4/3] w-full rounded-md bg-[#f7f2ec] object-cover"
                  src={bonus.image}
                />
              ) : (
                <div className="mb-4 flex aspect-[4/3] items-center justify-center rounded-md bg-[#eef7f4] text-[#2f6f73]">
                  <Gift aria-hidden="true" className="h-10 w-10" />
                </div>
              )}
              <p className="text-xs font-black uppercase text-[#d66540]">Bono {index + 1}</p>
              <h3 className="mt-2 font-sans text-lg font-black leading-6">{bonus.title}</h3>
              <p className="mt-2 text-sm font-black text-[#2f6f73]">{bonus.value}</p>
              <p className="mt-3 text-sm font-semibold leading-6 text-[#56606a]">{bonus.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Acción rápida"
        intro="Estos regalos son exclusivos para quienes se inscriban en las primeras 24 horas."
        title='Bono de Acción Rápida: Pack "Los 3 Juguetes Más Vendidos"'
        tone="white"
      >
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div className="overflow-hidden rounded-lg bg-[#f7f2ec] p-2 shadow-sm ring-1 ring-[#e7d8ca]">
            <OfferImage
              alt='Bono de acción rápida Los 3 Juguetes Más Vendidos'
              className="aspect-[4/3] w-full rounded-md object-cover"
              src={assets.bonos[3]}
            />
          </div>
          <div className="space-y-4">
            <div className="flex gap-3 rounded-lg bg-[#f7f2ec] p-5 ring-1 ring-[#e7d8ca]">
              <Star aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#d66540]" />
              <p className="font-bold leading-7 text-[#3b424a]">
                Lista con los 3 juguetes más vendidos y su paso a paso para empezar ya.
              </p>
            </div>
            <div className="flex gap-3 rounded-lg bg-[#f7f2ec] p-5 ring-1 ring-[#e7d8ca]">
              <HeartHandshake aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#2f6f73]" />
              <p className="font-bold leading-7 text-[#3b424a]">
                Pack de ventas rápidas para ayudarte a recuperar tu inversión desde el primer mes.
              </p>
            </div>
            <CheckoutCta>Quiero entrar a la certificación</CheckoutCta>
          </div>
        </div>
      </Section>

      <Section eyebrow="Preguntas" title="Frases frecuentes" tone="light">
        <div className="grid gap-3">
          {faqs.map((faq) => (
            <details className="group rounded-lg bg-white p-5 shadow-sm ring-1 ring-[#e7d8ca]" key={faq.question}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-sans text-base font-black text-[#1f252c]">
                <span className="flex items-center gap-3">
                  <HelpCircle aria-hidden="true" className="h-5 w-5 shrink-0 text-[#2f6f73]" />
                  {faq.question}
                </span>
                <span className="text-[#d66540] transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 text-sm font-semibold leading-6 text-[#56606a]">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Soporte"
        intro="Si estás en Ecuador y deseas pagar con depósito o tienes preguntas, escríbenos por WhatsApp."
        title="Estamos para ayudarte"
        tone="white"
      >
        <div className="flex flex-col gap-4 rounded-lg bg-[#eef7f4] p-6 ring-1 ring-[#cfe4df] sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-base font-bold leading-7 text-[#2b4b4d]">
            Te ayudamos a revisar opciones de pago y resolver dudas antes de entrar a la
            certificación.
          </p>
          <SupportLink />
        </div>
      </Section>

      <footer className="bg-[#1f252c] px-5 py-10 text-white sm:px-8 lg:px-10">
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
