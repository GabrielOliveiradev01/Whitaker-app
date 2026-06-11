import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plane, ArrowDownLeft } from 'lucide-react';
import type { NotifyPayload } from '../lib/notify';
import { RECIPIENT_APP, WHITAKER_APP } from '../config';
import { brl } from '../lib/format';

type ToastItem = NotifyPayload & { id: string };

export default function ToastHost() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    function onToast(e: Event) {
      const detail = (e as CustomEvent<NotifyPayload>).detail;
      const item: ToastItem = { ...detail, id: crypto.randomUUID() };
      setToasts((t) => [item, ...t].slice(0, 3));
      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== item.id));
      }, 5200);
    }
    window.addEventListener('app-toast', onToast as EventListener);
    return () => window.removeEventListener('app-toast', onToast as EventListener);
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-[100] flex flex-col items-center gap-2 px-3"
      style={{ paddingTop: 'max(env(safe-area-inset-top), 12px)' }}
    >
      <AnimatePresence>
        {toasts.map((t) => {
          const isWhitaker = t.app === 'whitaker';
          const meta = isWhitaker ? WHITAKER_APP : RECIPIENT_APP;
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="pointer-events-auto w-full max-w-[360px] rounded-2xl border border-white/10 bg-[#1c1c1ecc] px-3.5 py-3 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-start gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl overflow-hidden"
                  style={{ background: `${meta.accent}22`, color: meta.accent }}
                >
                  {!isWhitaker && RECIPIENT_APP.logo ? (
                    <img src={RECIPIENT_APP.logo} alt="" className="h-full w-full object-cover" />
                  ) : isWhitaker ? (
                    <Plane size={18} />
                  ) : (
                    <ArrowDownLeft size={18} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-[11px] font-bold uppercase tracking-wide" style={{ color: meta.accent }}>
                      {meta.name}
                    </span>
                    <span className="text-[10px] text-white/40">agora</span>
                  </div>
                  <p className="mt-0.5 text-[13px] font-semibold text-white leading-tight">{t.title}</p>
                  <p className="text-[12px] text-white/60 leading-snug">{t.body}</p>
                  {typeof t.amount === 'number' && (
                    <p
                      className="mt-1 text-[13px] font-extrabold"
                      style={{ color: isWhitaker ? '#f87171' : meta.accent }}
                    >
                      {isWhitaker ? '- ' : '+ '}
                      {brl(t.amount)}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
