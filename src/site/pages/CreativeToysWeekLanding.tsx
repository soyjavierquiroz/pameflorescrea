import { type ImgHTMLAttributes, useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  Heart,
  Images,
  Lightbulb,
  Sparkles,
  Star,
  Wand2,
} from 'lucide-react';
import { CreativeToysForm } from '../components/creative-toys/CreativeToysForm';
import { CreativeToysSection } from '../components/creative-toys/CreativeToysSection';
import { CREATIVE_TOYS_ASSETS } from '../registration/creativeToysRegistration';

const identityBullets = [
  'Quieres generar ingresos desde casa',
  'Amas las manualidades o trabajar con niños',
  'Quieres algo propio pero no sabes por dónde empezar',
  'No tienes experiencia previa',
  'Quieres sentirte orgullosa de construir algo tuyo',
];

const whyBullets = [
  'Verás una oportunidad concreta para empezar con creatividad, propósito y enfoque.',
  'Entenderás qué hace que un juguete creativo conecte con familias reales.',
  'Tendrás una ruta inicial para ordenar tus ideas y convertirlas en un proyecto.',
  'Vivirás una semana pensada para mujeres que quieren avanzar sin descuidar lo importante.',
];

const learningBullets = [
  'Cómo convertir creatividad en oportunidad de ingresos',
  'Cómo crear juguetes que las familias desean comprar',
  'Cómo empezar aunque no tengas experiencia',
  'Cómo ordenar tus ideas en un proyecto real',
];

const agenda = [
  {
    className: 'Clase 1',
    date: '30 de junio',
    image: CREATIVE_TOYS_ASSETS.classImages[0],
    title: 'Cómo generar ingresos desde casa con un proyecto que disfrutas',
    text: 'Descubre por qué esta oportunidad está ayudando a mujeres a construir un proyecto propio haciendo algo que aman.',
  },
  {
    className: 'Clase 2',
    date: '1 de julio',
    image: CREATIVE_TOYS_ASSETS.classImages[1],
    title: 'Las 3 claves para crear juguetes irresistibles que las familias aman comprar',
    text: 'Cómo pasar de tener muchas ideas a crear productos atractivos y vendibles.',
  },
  {
    className: 'Clase 3',
    date: '2 de julio',
    image: CREATIVE_TOYS_ASSETS.classImages[2],
    title: 'Cómo pasar de sentirte perdida a construir algo propio',
    text: 'La ruta que siguen mis alumnas para dejar de sentirse perdidas y empezar con claridad.',
  },
  {
    className: 'Clase 4',
    date: '5 de julio',
    image: CREATIVE_TOYS_ASSETS.classImages[3],
    title: 'Es tu momento: se abren las puertas de tu nueva vida creativa',
    text: 'Una sesión para tomar claridad, conectar con tu siguiente paso y mirar tu proyecto con más decisión.',
  },
];

function SafeImage({ className, src, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return null;
  }

  return (
    <img
      {...props}
      className={className}
      src={src}
      onError={() => setHasError(true)}
    />
  );
}

function BulletList({ bullets, light = false }: { bullets: string[]; light?: boolean }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {bullets.map((bullet) => (
        <div
          className={[
            'flex items-start gap-3 rounded-lg border-2 p-4 shadow-sm',
            light
              ? 'border-dashed border-white/24 bg-white/10 text-white'
              : 'border-dashed border-[#e8c9ff] bg-white text-[#342052]',
          ].join(' ')}
          key={bullet}
        >
          <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#13cdd7]" />
          <p className="text-sm font-semibold leading-6 sm:text-base">{bullet}</p>
        </div>
      ))}
    </div>
  );
}

function LogoMark() {
  return (
    <div className="flex items-center gap-3">
      <SafeImage
        alt="Pame Flores Crea"
        className="h-14 w-14 rounded-md border-2 border-dashed border-[#ffd45d] bg-white object-contain p-1 shadow-lg"
        height="56"
        src={CREATIVE_TOYS_ASSETS.logo}
        width="56"
      />
      <div>
        <p className="text-sm font-black uppercase text-white">Pame Flores Crea</p>
        <p className="text-xs font-semibold text-white/74">Juguetes creativos</p>
      </div>
    </div>
  );
}

function DecorativeLayer() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.58)_1px,transparent_0)] [background-size:22px_22px]" />
      <Sparkles className="absolute left-[7%] top-24 h-8 w-8 rotate-12 text-[#ffd45d]/80" />
      <Star className="absolute right-[9%] top-16 h-7 w-7 -rotate-12 fill-[#ffd45d]/70 text-[#ffd45d]/70" />
      <Wand2 className="absolute bottom-20 right-[13%] h-8 w-8 rotate-12 text-[#7ef8f0]/70" />
      <div className="absolute -left-8 top-1/3 h-28 w-28 rounded-full border-2 border-dotted border-[#ffd45d]/60" />
      <div className="absolute bottom-10 left-[18%] h-20 w-20 rounded-full border-2 border-dashed border-white/35" />
    </div>
  );
}

export function CreativeToysWeekLanding() {
  return (
    <main className="min-h-screen bg-[#2b1163] text-white">
      <section className="relative isolate overflow-hidden bg-[linear-gradient(135deg,#24104e_0%,#4b1596_44%,#c349a4_100%)]">
        <DecorativeLayer />
        <div className="absolute inset-x-0 top-0 h-2 bg-[#ffd45d]" aria-hidden="true" />
        <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-7 px-5 pb-10 pt-6 sm:gap-8 sm:px-8 sm:pb-14 sm:pt-8 lg:grid-cols-[1.02fr_0.98fr] lg:px-10 lg:pb-20 lg:pt-10">
          <div className="flex flex-col justify-center">
            <LogoMark />
            <div className="mt-5 inline-flex w-fit items-center gap-2 rounded-md border-2 border-dashed border-[#ffd45d]/70 bg-[#ffd45d]/16 px-3 py-2 text-[11px] font-black uppercase leading-4 text-[#fff0ad] shadow-sm sm:mt-8 sm:text-xs">
              <Sparkles aria-hidden="true" className="h-4 w-4" />
              SEMANA DEL EMPRENDIMIENTO CON JUGUETES CREATIVOS
            </div>
            <p className="mt-4 flex items-center gap-2 text-sm font-black text-[#7ef8f0] sm:mt-5 sm:text-base">
              <CalendarDays aria-hidden="true" className="h-5 w-5" />
              30 de junio, 1, 2 y 5 de julio
            </p>
            <h1 className="mt-3 max-w-3xl text-3xl font-black leading-[1.05] sm:mt-4 sm:text-5xl">
              Descubre cómo generar desde{' '}
              <span className="text-[#ffd45d]">500 dólares extras al mes</span> con Juguetes
              Creativos
            </h1>
            <p className="mt-4 text-lg font-black leading-7 text-white sm:mt-5 sm:text-2xl sm:leading-8">
              Sin descuidar a tu familia y aun si empiezas de cero.
            </p>
            <div className="mt-5 rounded-lg border-2 border-dashed border-white/26 bg-[#2b1163]/72 p-4 shadow-[0_20px_54px_rgba(36,16,78,0.35)] backdrop-blur sm:mt-7 sm:max-w-xl sm:p-5">
              <CreativeToysForm id="creative-toys-hero-form" />
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/82 sm:mt-4 sm:text-lg sm:leading-7">
              Construye un proyecto propio transformando tu amor por los niños y tu creatividad en
              una fuente de ingresos real haciendo algo que disfrutas.
            </p>
          </div>

          <div className="relative flex min-h-[420px] items-end justify-center lg:items-center">
            <div className="absolute inset-x-6 bottom-0 top-8 rotate-[-3deg] rounded-lg border-2 border-dotted border-[#ffd45d]/60 bg-white/10" />
            <div className="relative w-full overflow-hidden rounded-lg border-2 border-dashed border-white/38 bg-[#4a1ca4] shadow-[0_26px_74px_rgba(36,16,78,0.45)]">
              <SafeImage
                alt="Pame Flores sosteniendo un juguete creativo"
                className="h-full min-h-[420px] w-full object-cover"
                src={CREATIVE_TOYS_ASSETS.hero}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-[#2b1163]/88 p-4 backdrop-blur">
                <p className="flex items-center gap-2 text-sm font-black text-[#ffd45d]">
                  <Heart aria-hidden="true" className="h-4 w-4" />
                  Creatividad, familia y un proyecto propio.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CreativeToysSection title="Esta semana es para ti si..." tone="light">
        <BulletList bullets={identityBullets} />
      </CreativeToysSection>

      <CreativeToysSection
        intro="Una experiencia gratuita, directa y fácil de seguir para mirar tus habilidades manuales como una oportunidad real."
        title="Por qué participar"
        tone="purple"
      >
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="overflow-hidden rounded-lg border-2 border-dashed border-[#ffd45d]/50 bg-white/8 shadow-[0_18px_48px_rgba(0,0,0,0.18)]">
            <SafeImage
              alt="Juguetes creativos hechos a mano"
              className="h-full min-h-[260px] w-full object-cover"
              src={CREATIVE_TOYS_ASSETS.toys}
            />
          </div>
          <BulletList bullets={whyBullets} light />
        </div>
      </CreativeToysSection>

      <CreativeToysSection title="Durante esta semana descubrirás:" tone="white">
        <div className="grid gap-3 sm:grid-cols-2">
          {learningBullets.map((bullet) => (
            <div
              className="flex items-start gap-3 rounded-lg border-2 border-dotted border-[#e2b4ff] bg-[#fbf3ff] p-4 shadow-sm"
              key={bullet}
            >
              <Lightbulb aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#e0008a]" />
              <p className="text-sm font-bold leading-6 text-[#342052] sm:text-base">{bullet}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 overflow-hidden rounded-lg border-2 border-dashed border-[#d9b3ff] bg-[#f8f1ff]">
          <SafeImage
            alt="Semana del Emprendimiento con Juguetes Creativos"
            className="h-full max-h-[360px] w-full object-cover"
            src={CREATIVE_TOYS_ASSETS.banner}
          />
        </div>
      </CreativeToysSection>

      <CreativeToysSection title="Agenda" tone="light">
        <div className="grid gap-5 md:grid-cols-2">
          {agenda.map((item) => (
            <article
              className="overflow-hidden rounded-lg border-2 border-dashed border-[#d7b7ef] bg-white text-[#24104e] shadow-[0_16px_36px_rgba(78,28,134,0.12)]"
              key={`${item.className}-${item.date}`}
            >
              <div className="bg-[#f8f1ff]">
                <SafeImage
                  alt={`${item.className}: ${item.title}`}
                  className="aspect-[16/10] w-full object-cover"
                  src={item.image}
                />
              </div>
              <div className="p-5">
                <p className="inline-flex rounded-md bg-[#ffd45d] px-3 py-1 text-sm font-black uppercase text-[#4b1596]">
                  {item.className} — {item.date}
                </p>
                <h3 className="mt-3 text-xl font-black leading-7">{item.title}</h3>
                <p className="mt-3 text-sm font-semibold leading-6 text-[#5b4a77]">{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </CreativeToysSection>

      <CreativeToysSection
        intro="Juguetes, ideas y proyectos que te ayudan a visualizar lo que puedes construir paso a paso."
        title="Una experiencia creativa para empezar con ilusión"
        tone="white"
      >
        <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">
          {CREATIVE_TOYS_ASSETS.galleryImages.map((image, index) => (
            <figure
              className="mb-3 break-inside-avoid overflow-hidden rounded-lg border-2 border-dashed border-[#e2b4ff] bg-[#fbf3ff] p-1 shadow-sm"
              key={image}
            >
              <SafeImage
                alt={`Juguete creativo ${index + 1}`}
                className="w-full rounded-md object-cover"
                src={image}
              />
            </figure>
          ))}
        </div>
      </CreativeToysSection>

      <CreativeToysSection title="Quién te acompaña" tone="purple">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <div className="overflow-hidden rounded-lg border-2 border-dashed border-[#ffd45d]/54 bg-white/8 shadow-[0_18px_48px_rgba(0,0,0,0.18)]">
            <SafeImage
              alt="Pame Flores con su familia"
              className="h-full min-h-[340px] w-full object-cover"
              src={CREATIVE_TOYS_ASSETS.portrait}
            />
          </div>
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-md border border-white/18 bg-white/10 px-3 py-2 text-xs font-black uppercase text-[#ffd45d]">
              <Images aria-hidden="true" className="h-4 w-4" />
              Creatividad con propósito
            </p>
            <p className="mt-5 text-xl font-bold leading-9 text-white/88 sm:text-2xl">
              Pame Flores acompaña a mujeres creativas que quieren transformar sus habilidades
              manuales en proyectos propios, útiles y con propósito.
            </p>
          </div>
        </div>
      </CreativeToysSection>

      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#24104e_0%,#4b1596_54%,#d332a0_100%)] text-white">
        <DecorativeLayer />
        <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_0.82fr] lg:px-10 lg:py-20">
          <div>
            <p className="text-xs font-black uppercase text-[#7ef8f0]">Registro final</p>
            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
              Reserva tu lugar gratis y recibe el acceso por WhatsApp.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/82 sm:text-lg">
              Si sientes que tienes creatividad, amor por los niños y ganas de construir algo
              propio, esta semana puede ayudarte a ver el primer camino con claridad.
            </p>
          </div>
          <div className="rounded-lg border-2 border-dashed border-white/26 bg-[#2b1163]/72 p-4 shadow-[0_20px_54px_rgba(36,16,78,0.35)] backdrop-blur sm:p-5">
            <CreativeToysForm id="creative-toys-final-form" />
          </div>
        </div>
      </section>

      <footer className="bg-[#170830] px-5 py-10 text-sm leading-6 text-white/68 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl space-y-3">
          <p>
            Los resultados pueden variar y dependen de tu dedicación, contexto y aplicación de lo
            aprendido. Esta información no garantiza ingresos específicos.
          </p>
          <p>
            Este sitio no forma parte de Facebook, Meta, Google ni TikTok, ni está respaldado por
            dichas plataformas.
          </p>
          <p>Tus datos se usan para enviarte información del evento y recordatorios relacionados.</p>
          <p>Política de privacidad: disponible próximamente.</p>
        </div>
      </footer>
    </main>
  );
}
