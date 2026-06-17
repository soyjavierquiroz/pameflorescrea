import { ArrowRight, Loader2 } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface CreativeToysButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
}

export function CreativeToysButton({
  children,
  className = '',
  disabled,
  isLoading = false,
  type = 'button',
  ...props
}: CreativeToysButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      {...props}
      type={type}
      disabled={isDisabled}
      className={[
        'inline-flex min-h-[54px] w-full items-center justify-center gap-2 rounded-md bg-[#23d7df] px-5 py-3 text-center text-sm font-black uppercase text-[#24104e] shadow-[0_14px_32px_rgba(35,215,223,0.26)] transition duration-200 hover:bg-[#68f1ee] focus:outline-none focus:ring-2 focus:ring-[#f4c54f] focus:ring-offset-2 focus:ring-offset-[#2b1163] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-7',
        className,
      ].join(' ')}
    >
      {isLoading ? <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" /> : null}
      <span>{children}</span>
      {!isLoading ? <ArrowRight aria-hidden="true" className="h-5 w-5" /> : null}
    </button>
  );
}
