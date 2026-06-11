import type { ReactNode } from 'react';

/**
 * Moldura de iPhone para visualizar o app no desktop.
 * No mobile (tela pequena) ocupa a tela toda sem moldura.
 */
export default function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh w-full bg-gradient-to-b from-[#0a0a0c] to-black flex items-center justify-center sm:p-6">
      <div className="relative w-full max-w-[420px] sm:max-w-[390px]">
        {/* Moldura visível só no desktop */}
        <div className="hidden sm:block absolute -inset-3 rounded-[3.2rem] bg-[#1b1b1e] shadow-2xl" />
        <div className="hidden sm:block absolute -inset-[6px] rounded-[2.9rem] bg-black ring-1 ring-white/10" />
        <div className="relative h-dvh sm:h-[844px] w-full overflow-hidden bg-ink sm:rounded-[2.6rem]">
          {/* Notch (desktop) */}
          <div className="hidden sm:block absolute left-1/2 top-2 z-50 h-7 w-32 -translate-x-1/2 rounded-full bg-black" />
          {children}
        </div>
      </div>
    </div>
  );
}
