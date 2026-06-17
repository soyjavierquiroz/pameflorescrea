import type { ReactNode } from 'react';

interface CreativeToysSectionProps {
  children: ReactNode;
  eyebrow?: string;
  id?: string;
  intro?: string;
  title: string;
  tone?: 'light' | 'purple' | 'white';
}

const toneClasses = {
  light: 'bg-[#f8f1ff] text-[#24104e]',
  purple: 'bg-[#3a1685] text-white',
  white: 'bg-white text-[#24104e]',
};

export function CreativeToysSection({
  children,
  eyebrow,
  id,
  intro,
  title,
  tone = 'light',
}: CreativeToysSectionProps) {
  return (
    <section id={id} className={toneClasses[tone]}>
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="mb-3 text-xs font-black uppercase text-[#0e9fa8]">{eyebrow}</p>
          ) : null}
          <h2 className="text-3xl font-black leading-tight sm:text-4xl">{title}</h2>
          {intro ? (
            <p
              className={[
                'mt-4 text-base leading-7 sm:text-lg',
                tone === 'purple' ? 'text-white/78' : 'text-[#5b4a77]',
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
