import { CheckCircle2, Heart, Lightbulb, Sparkles } from 'lucide-react';
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
    title: 'Cómo generar ingresos desde casa con un proyecto que disfrutas',
    text: 'Descubre por qué esta oportunidad está ayudando a mujeres a construir un proyecto propio haciendo algo que aman.',
  },
  {
    className: 'Clase 2',
    date: '1 de julio',
    title: 'Las 3 claves para crear juguetes irresistibles que las familias aman comprar',
    text: 'Cómo pasar de tener muchas ideas a crear productos atractivos y vendibles.',
  },
  {
    className: 'Clase 3',
    date: '2 de julio',
    title: 'Cómo pasar de sentirte perdida a construir algo propio',
    text: 'La ruta que siguen mis alumnas para dejar de sentirse perdidas y empezar con claridad.',
  },
  {
    className: 'Clase 4',
    date: '5 de julio',
    title: 'Es tu momento: se abren las puertas de tu nueva vida creativa',
    text: 'Una sesión para tomar claridad, conectar con tu siguiente paso y mirar tu proyecto con más decisión.',
  },
];

function BulletList({ bullets, light = false }: { bullets: string[]; light?: boolean }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {bullets.map((bullet) => (
        <div
          className={[
            'flex items-start gap-3 rounded-lg border p-4',
            light
              ? 'border-white/14 bg-white/8 text-white'
              : 'border-[#eadfff] bg-white text-[#342052] shadow-sm',
          ].join(' ')}
          key={bullet}
        >
          <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#23d7df]" />
          <p className="text-sm font-semibold leading-6 sm:text-base">{bullet}</p>
        </div>
      ))}
    </div>
  );
}

function LogoMark() {
  return (
    <div className="flex items-center gap-3">
      <img
        alt="Pame Flores Crea"
        className="h-12 w-12 rounded-md object-cover"
        height="48"
        src={CREATIVE_TOYS_ASSETS.logo}
        width="48"
      />
      <div>
        <p className="text-sm font-black uppercase text-white">Pame Flores Crea</p>
        <p className="text-xs font-semibold text-white/70">Juguetes creativos</p>
      </div>
    </div>
  );
}

export function CreativeToysWeekLanding() {
  return (
    <main className="min-h-screen bg-[#2b1163] text-white">
      <section className="relative overflow-hidden bg-[#2b1163]">
        <div className="absolute inset-x-0 top-0 h-2 bg-[#23d7df]" aria-hidden="true" />
        <div className="mx-auto grid w-full max-w-6xl gap-7 px-5 pb-10 pt-6 sm:gap-8 sm:px-8 sm:pb-14 sm:pt-8 lg:grid-cols-[1.02fr_0.98fr] lg:px-10 lg:pb-20 lg:pt-10">
          <div className="flex flex-col justify-center">
            <LogoMark />
            <div className="mt-5 inline-flex w-fit items-center gap-2 rounded-md border border-[#f4c54f]/40 bg-[#f4c54f]/12 px-3 py-2 text-[11px] font-black uppercase leading-4 text-[#ffe38b] sm:mt-8 sm:text-xs">
              <Sparkles aria-hidden="true" className="h-4 w-4" />
              SEMANA DEL EMPRENDIMIENTO CON JUGUETES CREATIVOS
            </div>
            <p className="mt-4 text-sm font-black text-[#23d7df] sm:mt-5 sm:text-base">
              30 de junio, 1, 2 y 5 de julio
            </p>
            <h1 className="mt-3 max-w-3xl text-3xl font-black leading-[1.05] sm:mt-4 sm:text-5xl">
              Descubre cómo generar desde{' '}
              <span className="text-[#f4c54f]">500 dólares extras al mes</span> con Juguetes
              Creativos
            </h1>
            <p className="mt-4 text-lg font-black leading-7 text-white sm:mt-5 sm:text-2xl sm:leading-8">
              Sin descuidar a tu familia y aun si empiezas de cero.
            </p>
            <div className="mt-5 rounded-lg border border-white/14 bg-white/10 p-4 shadow-[0_18px_52px_rgba(0,0,0,0.22)] sm:mt-7 sm:max-w-xl sm:p-5">
              <CreativeToysForm id="creative-toys-hero-form" />
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/78 sm:mt-4 sm:text-lg sm:leading-7">
              Construye un proyecto propio transformando tu amor por los niños y tu creatividad en
              una fuente de ingresos real haciendo algo que disfrutas.
            </p>
          </div>

          <div className="relative min-h-[420px] overflow-hidden rounded-lg border border-white/14 bg-[#4a1ca4] shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
            <img
              alt="Pame Flores sosteniendo un juguete creativo"
              className="h-full min-h-[420px] w-full object-cover"
              src={CREATIVE_TOYS_ASSETS.hero}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-[#2b1163]/88 p-4 backdrop-blur">
              <p className="flex items-center gap-2 text-sm font-black text-[#f4c54f]">
                <Heart aria-hidden="true" className="h-4 w-4" />
                Creatividad, familia y un proyecto propio.
              </p>
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
          <div className="overflow-hidden rounded-lg border border-white/14 bg-white/8">
            <img
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
              className="flex items-start gap-3 rounded-lg border border-[#d8c8f0] bg-[#f8f1ff] p-4"
              key={bullet}
            >
              <Lightbulb aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#0e9fa8]" />
              <p className="text-sm font-bold leading-6 text-[#342052] sm:text-base">{bullet}</p>
            </div>
          ))}
        </div>
      </CreativeToysSection>

      <CreativeToysSection title="Agenda" tone="light">
        <div className="grid gap-4 md:grid-cols-2">
          {agenda.map((item) => (
            <article
              className="rounded-lg border border-[#dfd1f2] bg-white p-5 text-[#24104e] shadow-sm"
              key={`${item.className}-${item.date}`}
            >
              <p className="text-sm font-black uppercase text-[#0e9fa8]">
                {item.className} — {item.date}
              </p>
              <h3 className="mt-3 text-xl font-black leading-7">{item.title}</h3>
              <p className="mt-3 text-sm font-semibold leading-6 text-[#5b4a77]">{item.text}</p>
            </article>
          ))}
        </div>
      </CreativeToysSection>

      <CreativeToysSection title="Quién te acompaña" tone="purple">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <div className="overflow-hidden rounded-lg border border-white/14 bg-white/8">
            <img
              alt="Pame Flores"
              className="h-full min-h-[340px] w-full object-cover"
              src={CREATIVE_TOYS_ASSETS.portrait}
            />
          </div>
          <div className="max-w-2xl">
            <p className="text-xl font-bold leading-9 text-white/86 sm:text-2xl">
              Pame Flores acompaña a mujeres creativas que quieren transformar sus habilidades
              manuales en proyectos propios, útiles y con propósito.
            </p>
          </div>
        </div>
      </CreativeToysSection>

      <section className="bg-[#24104e] text-white">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_0.82fr] lg:px-10 lg:py-20">
          <div>
            <p className="text-xs font-black uppercase text-[#23d7df]">
              Registro final
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
              Reserva tu lugar gratis y recibe el acceso por WhatsApp.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/76 sm:text-lg">
              Si sientes que tienes creatividad, amor por los niños y ganas de construir algo
              propio, esta semana puede ayudarte a ver el primer camino con claridad.
            </p>
          </div>
          <div className="rounded-lg border border-white/14 bg-white/10 p-4 shadow-[0_18px_52px_rgba(0,0,0,0.22)] sm:p-5">
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
