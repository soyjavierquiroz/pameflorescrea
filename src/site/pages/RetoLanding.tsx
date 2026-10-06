import { Sparkles, Star, Wand2 } from 'lucide-react';
import { CreativeToysButton } from '../components/creative-toys/CreativeToysButton';
import { CreativeToysForm } from '../components/creative-toys/CreativeToysForm';
import { CreativeToysSection } from '../components/creative-toys/CreativeToysSection';
import { retoCampaign } from '../registration/campaigns';
import { RETO_ASSETS } from './retoAssets';

const agenda = [
  {
    label: 'DÍA 1 — 20 DE OCTUBRE',
    title: 'La RUTA para darle dirección a tu creatividad y convertirla en un negocio exitoso con Juguetes Educativos',
    description: 'Vas a descubrir el camino para dejar de tener ideas sueltas en la cabeza y empezar con claridad, aunque hoy no sepas ni por dónde partir.',
  },
  {
    label: 'DÍA 2 — 21 DE OCTUBRE',
    title: 'Las 3 piezas clave para aumentar tus ingresos con Libros Sensoriales',
    description: 'Te cuento las 3 cosas que hacen que un libro sensorial deje de ser solo “bonito” y se convierta en un producto que las familias quieran comprar y que pueda generar ingresos.',
  },
  {
    label: 'DÍA 3 — 22 DE OCTUBRE',
    title: '5 estrategias para atraer clientes que valoren y paguen por tus libros sensoriales',
    description: 'Vas a aprender cómo encontrar clientes que valoren tu trabajo y paguen lo que realmente vale, sin tener que regalarlo.',
  },
  {
    label: 'DÍA 4 — 25 DE OCTUBRE',
    title: 'LÁNZATE a construir tu propia Juguetería Rentable',
    description: 'Es el momento de dar el paso: te muestro cómo pasar de “ya sé cómo hacerlo” a empezar a construir tu propio negocio.',
  },
] as const;

const metrics = [
  { value: '+1.000', label: 'libros sensoriales vendidos' },
  { value: '+200', label: 'modelos creados' },
  { value: '+1.000', label: 'alumnas que han aprendido conmigo' },
  { value: '9 años', label: 'en Juguetería Creativa' },
] as const;

function scrollToNearestForm(button: HTMLButtonElement): void {
  const forms = Array.from(document.querySelectorAll<HTMLFormElement>('form[data-reto-form]'));
  const buttonY = button.getBoundingClientRect().top;
  const closest = forms.sort((a, b) =>
    Math.abs(a.getBoundingClientRect().top - buttonY) - Math.abs(b.getBoundingClientRect().top - buttonY),
  )[0];
  if (!closest) return;
  closest.scrollIntoView({ behavior: 'smooth', block: 'center' });
  window.setTimeout(() => {
    closest.querySelector<HTMLInputElement>('input:not([type="hidden"])')?.focus({ preventScroll: true });
  }, 350);
}

function FormScrollButton({ children }: { children: string }) {
  return (
    <CreativeToysButton onClick={(event) => scrollToNearestForm(event.currentTarget)} type="button">
      {children}
    </CreativeToysButton>
  );
}

function EventDetails() {
  return (
    <ul className="mt-5 space-y-2 border-t border-dashed border-[#ffd45d]/50 pt-4 text-sm font-bold leading-5 text-white/90 sm:text-base">
      <li className="flex items-start gap-2"><span aria-hidden="true">📅</span><span>20, 21, 22 y 25 de octubre</span></li>
      <li className="flex items-start gap-2"><span aria-hidden="true">⏰</span><span>7 PM Ecuador / Colombia / Perú</span></li>
      <li className="flex items-start gap-2"><span aria-hidden="true">🎬</span><span>Evento 100% virtual, gratuito y en vivo</span></li>
    </ul>
  );
}

function DecorativeLayer() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.58)_1px,transparent_0)] [background-size:22px_22px]" />
      <Sparkles className="absolute left-[7%] top-24 h-8 w-8 rotate-12 text-[#ffd45d]/80" />
      <Star className="absolute right-[9%] top-16 h-7 w-7 -rotate-12 fill-[#ffd45d]/70 text-[#ffd45d]/70" />
      <Wand2 className="absolute bottom-20 right-[13%] h-8 w-8 rotate-12 text-[#7ef8f0]/70" />
      <div className="absolute -left-8 top-1/3 h-28 w-28 rounded-full border-2 border-dotted border-[#ffd45d]/60" />
    </div>
  );
}

export function RetoLanding() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#2b1163] text-white">
      <section className="relative isolate overflow-hidden bg-[linear-gradient(135deg,#24104e_0%,#4b1596_44%,#c349a4_100%)]">
        <DecorativeLayer />
        <div className="absolute inset-x-0 top-0 h-2 bg-[#ffd45d]" aria-hidden="true" />
        <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-6 px-5 pb-8 pt-5 sm:gap-8 sm:px-8 sm:pb-14 sm:pt-8 lg:grid-cols-[1.02fr_0.98fr] lg:px-10 lg:pb-20 lg:pt-10">
          <div className="flex min-w-0 flex-col justify-center">
            <div className="flex items-center gap-3">
              <img alt="Pame Flores Crea" className="h-14 w-14 rounded-md border-2 border-dashed border-[#ffd45d] bg-white object-contain p-1 shadow-lg" src={RETO_ASSETS.logo} width="56" height="56" />
              <div><p className="text-sm font-black uppercase">Pame Flores Crea</p><p className="text-xs font-semibold text-white/74">Juguetes creativos</p></div>
            </div>
            <p className="mt-3 inline-flex w-fit items-center gap-2 rounded-md border-2 border-dashed border-[#ffd45d]/70 bg-[#ffd45d]/16 px-3 py-2 text-[11px] font-black uppercase leading-4 text-[#fff0ad] shadow-sm sm:mt-8 sm:text-xs">
              <Sparkles aria-hidden="true" className="h-4 w-4 shrink-0" /> RETO VIRTUAL GRATUITO DE 4 CLASES
            </p>
            <p className="mt-2 text-sm font-black text-[#7ef8f0] sm:mt-5 sm:text-base">20, 21, 22 y 25 de octubre</p>
            <h1 className="mt-1 min-w-0 text-[clamp(2.2rem,6vw,3.5rem)] font-black leading-[1.02] tracking-tight sm:mt-3">
              CONQUISTA LA<span className="block max-w-[9.5em] text-[#ffd45d]">JUGUETERÍA RENTABLE</span>
            </h1>
            <p className="mt-2 max-w-2xl text-lg font-black leading-6 sm:mt-5 sm:text-2xl sm:leading-8">Aprende la ruta para aumentar tus ingresos hasta $500 dólares mensuales creando libros sensoriales y juguetes educativos.</p>
            <p className="mt-3 hidden max-w-2xl text-base font-bold leading-6 text-white/86 sm:mt-4 sm:text-lg sm:leading-7 md:block">Aunque empieces desde cero, tengas poco tiempo y quieras seguir estando presente para tu familia.</p>
            <p className="mt-3 hidden max-w-2xl text-base font-bold leading-6 text-white/86 sm:mt-4 sm:text-lg sm:leading-7 md:block">Dale dirección a tu creatividad y transforma tu experiencia en un proyecto rentable antes que acabe el 2026.</p>
            <div className="mt-4 min-w-0 rounded-lg border-2 border-dashed border-white/26 bg-[#2b1163]/95 p-4 shadow-[0_20px_54px_rgba(36,16,78,0.35)] sm:mt-7 sm:max-w-xl sm:p-5">
              <h2 className="mb-3 text-xl font-black sm:mb-4">Regístrate gratis aquí abajo</h2>
              <CreativeToysForm id="reto-hero-form" campaign={retoCampaign} />
              <EventDetails />
            </div>
          </div>
          <div className="relative flex min-h-[240px] items-end justify-center sm:min-h-[320px] lg:min-h-[420px] lg:items-center">
            <div className="absolute inset-x-6 bottom-0 top-8 rotate-[-3deg] rounded-lg border-2 border-dotted border-[#ffd45d]/60 bg-white/10" />
            <div className="relative w-full overflow-hidden rounded-lg border-2 border-dashed border-white/38 bg-[#4a1ca4] shadow-[0_26px_74px_rgba(36,16,78,0.45)]">
              <img alt="Pame Flores con un juguete creativo" className="aspect-[4/5] w-full object-cover lg:aspect-auto lg:h-[600px] xl:h-[680px]" src={RETO_ASSETS.hero} />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f8f1ff] text-[#24104e]">
        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
          <div className="max-w-3xl">
            <div className="mb-8 max-w-2xl space-y-3 text-base font-semibold leading-7 text-[#5b4a77] md:hidden">
              <p className="font-bold text-[#4b1596]">Aunque empieces desde cero, tengas poco tiempo y quieras seguir estando presente para tu familia.</p>
              <p>Dale dirección a tu creatividad y transforma tu experiencia en un proyecto rentable antes que acabe el 2026.</p>
            </div>
            <h2 className="text-3xl font-black leading-tight sm:text-4xl">¿Te gustaría generar más ingresos, pero sin tener que elegir entre tu familia y tus propios sueños?</h2>
          </div>
          <div className="mt-8">
            <div className="grid max-w-5xl gap-6 text-base font-semibold leading-8 text-[#5b4a77] sm:text-lg lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
              <div className="space-y-4">
                <p className="text-lg font-black leading-8 text-[#4b1596] sm:text-xl">Tal vez llevas tiempo pensando en hacer algo para ti.</p>
                <p>Algo que te permita generar ingresos, aprovechar tu creatividad y sentir que estás construyendo un proyecto propio... pero que también pueda adaptarse a tu vida y a tu familia.</p>
                <p>Quizás incluso ya haces manualidades, trabajas con niños o alguna vez has creado un libro sensorial, pero todavía no sabes cómo convertir todo eso en un proyecto realmente rentable.</p>
              </div>
              <div className="space-y-4 border-l-2 border-dashed border-[#e0008a] pl-5 sm:pl-7">
                <p>Eso es justamente lo que quiero ayudarte a descubrir en este reto.</p>
                <p>Porque tu creatividad puede convertirse en mucho más que algo que haces en tus ratos libres.</p>
                <p className="font-black text-[#4b1596]">Puede convertirse en una fuente de ingresos y en un proyecto del que te sientas orgullosa.</p>
              </div>
            </div>
            <div className="mt-8"><FormScrollButton>QUIERO ASISTIR A LAS CLASES</FormScrollButton></div>
          </div>
        </div>
      </section>

      <section className="bg-[#3a1685] text-white">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14 lg:px-10">
          <h2 className="max-w-4xl border-l-4 border-dashed border-[#ffd45d] pl-5 text-xl font-black leading-8 sm:pl-7 sm:text-3xl sm:leading-10">Y en solo 4 clases, te mostraré el camino para convertir tu creatividad en una fuente de ingresos y empezar a construir tu propia Juguetería Rentable.</h2>
        </div>
      </section>

      <CreativeToysSection tone="light" title="Agenda">
        <div className="grid items-stretch gap-5 md:grid-cols-2">
          {agenda.map((item, index) => (
            <article key={item.label} className="flex min-w-0 flex-col overflow-hidden rounded-lg border-2 border-dashed border-[#d7b7ef] bg-white text-[#24104e] shadow-[0_16px_36px_rgba(78,28,134,0.12)]">
              <div className="bg-[#f8f1ff]"><img alt={`Imagen ilustrativa de la clase ${index + 1}`} className="aspect-video w-full object-cover" src={RETO_ASSETS.classes[index]} /></div>
              <div className="flex flex-1 flex-col p-5">
                <p className="self-start rounded-md bg-[#ffd45d] px-3 py-1 text-sm font-black uppercase text-[#4b1596]">{item.label}</p>
                <h3 className="mt-3 text-xl font-black leading-7">{item.title}</h3>
                <p className="mt-3 text-sm font-semibold leading-6 text-[#5b4a77]">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </CreativeToysSection>

      <CreativeToysSection tone="purple" title="¿Y SI PUDIERAS AUMENTAR TUS INGRESOS HACIENDO ALGO QUE REALMENTE DISFRUTAS?">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <div className="overflow-hidden rounded-lg border-2 border-dashed border-[#ffd45d]/54 bg-white/8 shadow-[0_18px_48px_rgba(0,0,0,0.18)]">
            <img alt="Pame Flores con su familia" className="h-full min-h-[300px] w-full object-cover sm:min-h-[340px]" src={RETO_ASSETS.pame} />
          </div>
          <div className="max-w-2xl space-y-5 text-lg font-bold leading-8 text-white/88 sm:text-xl">
            <p>Hace 9 años yo también buscaba una manera diferente de generar ingresos.</p>
            <p>Mi hijo tenía apenas 6 meses y yo quería construir algo propio que me permitiera hacer algo que amara sin dejar de estar presente para mi familia.</p>
            <p>Así descubrí los libros sensoriales.</p>
            <p className="text-[#ffd45d]">Lo que comenzó con un libro hecho con mis propias manos terminó convirtiéndose en mucho más:</p>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="min-w-0 rounded-lg border-2 border-dashed border-[#ffd45d]/55 bg-[#2b1163] p-3 sm:p-5">
              <p className="text-3xl font-black leading-none text-[#ffd45d] sm:text-4xl">{metric.value}</p>
              <p className="mt-3 text-sm font-bold leading-5 text-white sm:text-base sm:leading-6">{metric.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 max-w-3xl space-y-4 text-lg font-bold leading-8 text-white/90">
          <p>Y ahora quiero mostrarte cómo tú también puedes empezar a construir tu propio camino.</p>
          <p>En solo 4 clases, te mostraré el paso a paso para convertir tu creatividad en una fuente de ingresos y empezar a construir tu propia Juguetería Rentable.</p>
        </div>
        <div className="mt-8"><FormScrollButton>QUIERO PARTICIPAR GRATIS</FormScrollButton></div>
      </CreativeToysSection>

      <CreativeToysSection tone="light" title="MÁS DE 5.000 MUJERES">
        <p className="max-w-3xl text-lg font-bold leading-8 text-[#5b4a77]">ya han participado en mis clases y eventos y descubierto cómo transformar su creatividad y amor por el mundo infantil en algo más grande: una fuente de ingresos y un proyecto propio.</p>
        <div className="mt-8">
          {RETO_ASSETS.testimonials.map((src) => (
            <figure key={src} className="mx-auto max-w-4xl overflow-hidden rounded-lg border-2 border-dashed border-[#d7b7ef] bg-white p-1 shadow-sm">
              <a aria-label="Ampliar testimonios de alumnas" className="block cursor-zoom-in" href={src} rel="noopener noreferrer" target="_blank">
                <img alt="Comentarios de alumnas sobre las clases de Pame Flores" className="h-auto w-full rounded-md" src={src} />
              </a>
            </figure>
          ))}
        </div>
      </CreativeToysSection>

      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#24104e_0%,#4b1596_54%,#d332a0_100%)] text-white">
        <DecorativeLayer />
        <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_0.82fr] lg:px-10 lg:py-20">
          <div>
            <h2 className="text-3xl font-black leading-tight sm:text-4xl">Reserva tu lugar gratis</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/82 sm:text-lg">Regístrate y acompáñame en las 4 clases en vivo de CONQUISTA LA JUGUETERÍA RENTABLE.</p>
          </div>
          <div className="min-w-0 rounded-lg border-2 border-dashed border-white/26 bg-[#2b1163]/95 p-4 shadow-[0_20px_54px_rgba(36,16,78,0.35)] sm:p-5">
            <CreativeToysForm id="reto-final-form" campaign={retoCampaign} />
            <EventDetails />
          </div>
        </div>
      </section>
      <footer className="bg-[#170830] px-5 py-10 text-sm leading-6 text-white/68 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl space-y-3">
          <p>Los resultados pueden variar y dependen de tu dedicación, contexto y aplicación de lo aprendido. Esta información no garantiza ingresos específicos.</p>
          <p>Este sitio no forma parte de Facebook, Meta, Google ni TikTok, ni está respaldado por dichas plataformas.</p>
          <p>Tus datos se usan para enviarte información del evento y recordatorios relacionados.</p>
          <p>Política de privacidad: disponible próximamente.</p>
        </div>
      </footer>
    </main>
  );
}
