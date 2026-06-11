import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Plane, ArrowDownLeft, BellOff } from 'lucide-react';
import SafeTop from '../components/SafeTop';
import { store, useStore } from '../lib/store';
import { brl, timeAgo } from '../lib/format';
import { RECIPIENT_APP, WHITAKER_APP } from '../config';

export default function Notifications() {
  const nav = useNavigate();
  const notifications = useStore((s) => s.notifications);

  useEffect(() => {
    store.markAllRead('whitaker');
  }, []);

  return (
    <div className="relative flex h-full w-full flex-col bg-ink">
      <SafeTop />
      <div className="flex items-center gap-3 px-5 pt-2 pb-2">
        <button onClick={() => nav('/app')} className="flex h-9 w-9 items-center justify-center rounded-xl text-white/80">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-[17px] font-bold text-white">Notificações</h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-10">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-32 text-center text-white/40">
            <BellOff size={40} />
            <p className="mt-4 text-sm">Nenhuma notificação ainda.</p>
          </div>
        ) : (
          <div className="space-y-2.5 pt-2">
            {notifications.map((n) => {
              const isWhitaker = n.app === 'whitaker';
              const meta = isWhitaker ? WHITAKER_APP : RECIPIENT_APP;
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 rounded-2xl border border-stroke bg-panel px-4 py-3.5"
                >
                  <div
                    className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl"
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
                      <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: meta.accent }}>
                        {meta.name}
                      </span>
                      <span className="text-[11px] text-white/35">{timeAgo(n.createdAt)}</span>
                    </div>
                    <p className="mt-0.5 text-[14px] font-semibold text-white">{n.title}</p>
                    <p className="text-[12px] text-white/50">{n.body}</p>
                    {typeof n.amount === 'number' && (
                      <p
                        className="mt-1 text-[14px] font-extrabold"
                        style={{ color: isWhitaker ? '#f87171' : meta.accent }}
                      >
                        {isWhitaker ? '- ' : '+ '}
                        {brl(n.amount)}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
