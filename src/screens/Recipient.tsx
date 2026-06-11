import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ArrowDownLeft, Bell, Wallet, Send, QrCode, Plus } from 'lucide-react';
import SafeTop from '../components/SafeTop';
import { useStore } from '../lib/store';
import { brl, timeAgo } from '../lib/format';
import { RECIPIENT_APP } from '../config';

export default function Recipient() {
  const nav = useNavigate();
  const accent = RECIPIENT_APP.accent;
  const transactions = useStore((s) => s.transactions);
  const notifications = useStore((s) => s.notifications.filter((n) => n.app === 'recipient'));

  // Tudo que o Whitaker enviou ('out') é dinheiro recebido aqui.
  const received = transactions.filter((t) => t.direction === 'out');
  const total = received.reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="relative flex h-full w-full flex-col bg-[#0b0f0c]">
      <SafeTop />

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-12">
        {/* Header */}
        <header className="flex items-center justify-between pt-3">
          <button
            onClick={() => nav('/app')}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white/80"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div
              className="grid h-8 w-8 place-items-center overflow-hidden rounded-lg"
              style={{ background: `${accent}22`, color: accent }}
            >
              {RECIPIENT_APP.logo ? (
                <img src={RECIPIENT_APP.logo} alt="" className="h-full w-full object-cover" />
              ) : (
                <Wallet size={18} />
              )}
            </div>
            <span className="text-[15px] font-bold text-white">{RECIPIENT_APP.name}</span>
          </div>
          <button className="relative flex h-10 w-10 items-center justify-center rounded-xl text-white/80">
            <Bell size={22} />
            {notifications.some((n) => !n.read) && (
              <span
                className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full ring-2 ring-[#0b0f0c]"
                style={{ background: accent }}
              />
            )}
          </button>
        </header>

        {/* Saldo */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 rounded-3xl p-5 text-white"
          style={{ background: `linear-gradient(135deg, ${accent}, ${accent}aa)` }}
        >
          <p className="text-[12px] font-medium uppercase tracking-widest text-white/80">Saldo disponível</p>
          <p className="mt-2 text-[36px] font-extrabold leading-none">{brl(total)}</p>
          <p className="mt-2 text-[13px] text-white/80">Conta • {RECIPIENT_APP.name}</p>
        </motion.div>

        {/* Ações */}
        <div className="mt-4 grid grid-cols-4 gap-2.5">
          {[
            { icon: Send, label: 'Enviar' },
            { icon: ArrowDownLeft, label: 'Receber' },
            { icon: QrCode, label: 'PIX' },
            { icon: Plus, label: 'Adicionar' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-3">
              <Icon size={20} style={{ color: accent }} />
              <span className="text-[10px] text-white/70">{label}</span>
            </div>
          ))}
        </div>

        {/* Notificações de entrada */}
        <h2 className="mt-7 text-[12px] font-bold uppercase tracking-widest text-white/55">
          Entradas recentes
        </h2>

        <div className="mt-3 space-y-2.5">
          {received.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-white/40">
              Nenhuma transferência recebida ainda.
              <br />
              Faça um PIX pelo Whitaker IA para ver aparecer aqui.
            </div>
          ) : (
            received.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5"
              >
                <div
                  className="grid h-10 w-10 place-items-center rounded-full"
                  style={{ background: `${accent}22`, color: accent }}
                >
                  <ArrowDownLeft size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-semibold text-white">PIX recebido</p>
                  <p className="text-[12px] text-white/45">de Whitaker IA • chave {t.pixKey}</p>
                </div>
                <div className="text-right">
                  <p className="text-[15px] font-extrabold" style={{ color: accent }}>
                    + {brl(t.amount)}
                  </p>
                  <p className="text-[11px] text-white/35">{timeAgo(t.createdAt)}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
