import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Menu,
  Bell,
  Eye,
  EyeOff,
  Plane,
  CreditCard,
  ArrowLeftRight,
  Tag,
  ShoppingBag,
  ArrowRight,
  Clock,
  Gift,
  ChevronRight,
} from 'lucide-react';
import Logo from '../components/Logo';
import SafeTop from '../components/SafeTop';
import BottomNav from '../components/BottomNav';
import { useStore } from '../lib/store';
import { brl, num, timeAgo } from '../lib/format';

const earnCards = [
  { icon: CreditCard, title: 'Use seu cartão', desc: 'Ganhe milhas a cada compra' },
  { icon: ArrowLeftRight, title: 'Transfira pontos', desc: 'Transfira e ganhe bônus' },
  { icon: Tag, title: 'Promoções', desc: 'Descubra as melhores ofertas' },
  { icon: ShoppingBag, title: 'Compras online', desc: 'Ganhe milhas em parceiros' },
];

export default function Home() {
  const nav = useNavigate();
  const [hide, setHide] = useState(false);
  const user = useStore((s) => s.user);
  const balance = useStore((s) => s.balance);
  const miles = useStore((s) => s.miles);
  const transactions = useStore((s) => s.transactions);
  const unread = useStore((s) => s.notifications.filter((n) => n.app === 'whitaker' && !n.read).length);

  const firstName = user?.name?.split(' ')[0] ?? 'Whitaker';

  return (
    <div className="relative flex h-full w-full flex-col bg-ink">
      <SafeTop />

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-28">
        {/* Header */}
        <header className="flex items-center justify-between pt-3">
          <button className="flex h-10 w-10 items-center justify-center rounded-xl text-white/80">
            <Menu size={24} />
          </button>
          <Logo />
          <button
            onClick={() => nav('/notificacoes')}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-white/80"
          >
            <Bell size={22} />
            {unread > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-gold ring-2 ring-ink" />
            )}
          </button>
        </header>

        {/* Greeting */}
        <div className="mt-5">
          <h1 className="text-[26px] font-extrabold leading-tight text-white">
            Olá, <span className="text-gold">{firstName}</span>
          </h1>
          <p className="mt-1 text-sm text-white/45">Sua inteligência trabalha por você 24h por dia.</p>
        </div>

        {/* Hero card */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mt-5 overflow-hidden rounded-3xl border border-stroke bg-gradient-to-br from-panel-2 to-panel p-5"
        >
          <div className="pointer-events-none absolute -right-6 -top-10 h-40 w-40 rounded-full bg-gold/10 blur-2xl" />
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <button
                onClick={() => setHide((h) => !h)}
                className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-white/45"
              >
                Valor a receber {hide ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <div className="mt-3 flex items-end gap-1">
                <span className="text-2xl font-bold text-gold">R$</span>
                <span className="text-[40px] font-extrabold leading-none text-gold">
                  {hide ? '••••••' : brl(balance).replace('R$', '').trim()}
                </span>
              </div>
              <p className="mt-2 text-sm text-white/45">em milhas e benefícios</p>
            </div>

            {/* Airplane glowing badge */}
            <div className="relative mt-1 grid h-[88px] w-[88px] shrink-0 place-items-center">
              <div className="absolute inset-0 rounded-full border border-gold/40" />
              <div className="absolute inset-0 rounded-full shadow-[0_0_30px_6px_rgba(227,179,65,0.35)]" />
              <div className="absolute -right-1 top-2 h-3 w-3 rounded-full bg-gold shadow-[0_0_12px_3px_rgba(227,179,65,0.8)]" />
              <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-[#1b1b1d] to-black">
                <Plane size={30} className="text-gold" />
              </div>
            </div>
          </div>

          <button
            onClick={() => nav('/resgatar')}
            className="mt-4 flex w-full items-center justify-between rounded-2xl border border-gold/40 bg-gold/5 px-5 py-3.5 text-[15px] font-bold text-gold transition active:scale-[0.98]"
          >
            Resgatar agora
            <ArrowRight size={18} />
          </button>
        </motion.div>

        {/* Ganhe em milhas */}
        <SectionHeader title="GANHE EM MILHAS" action="Ver todas" />
        <div className="mt-3 grid grid-cols-4 gap-2.5">
          {earnCards.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex flex-col rounded-2xl border border-stroke bg-panel p-3"
            >
              <Icon size={20} className="text-gold" />
              <p className="mt-3 text-[11px] font-bold leading-tight text-white">{title}</p>
              <p className="mt-1 text-[9px] leading-tight text-white/40">{desc}</p>
              <ChevronRight size={14} className="mt-2 text-white/30" />
            </div>
          ))}
        </div>

        {/* Em destaque */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mt-6 overflow-hidden rounded-3xl border border-stroke bg-panel"
        >
          <div className="flex">
            <div className="flex-1 p-5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold">Em destaque</span>
              <h3 className="mt-2 text-[17px] font-extrabold leading-tight text-white">
                Transferência bonificada até <span className="text-gold">100%</span>
              </h3>
              <p className="mt-1.5 text-[11px] leading-snug text-white/45">
                Aproveite as melhores oportunidades e multiplique suas milhas.
              </p>
              <button className="mt-3 flex items-center gap-1.5 text-[13px] font-bold text-gold">
                Ver oportunidades <ArrowRight size={15} />
              </button>
            </div>
            {/* Janela do avião (sunset) */}
            <div className="relative w-[120px] shrink-0">
              <div className="absolute inset-0 bg-gradient-to-b from-[#f6b352] via-[#c8772e] to-[#3a2440]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,225,160,0.9),transparent_55%)]" />
              {/* asa */}
              <div className="absolute bottom-6 left-2 h-2 w-24 rotate-[18deg] rounded bg-[#2a2a30]/80" />
              {/* moldura janela */}
              <div className="absolute inset-2 rounded-[2rem] ring-[6px] ring-[#0e0e0f]" />
              <div className="absolute inset-2 rounded-[2rem] ring-1 ring-white/10" />
            </div>
          </div>
        </motion.div>

        {/* Resumo da conta */}
        <SectionHeader title="RESUMO DA CONTA" action="Ver detalhes" />
        <div className="mt-3 grid grid-cols-3 gap-2.5 rounded-3xl border border-stroke bg-panel p-4">
          <Stat icon={<Plane size={18} className="text-gold" />} label="Saldo de milhas" value={num(miles)} />
          <Stat icon={<ArrowLeftRight size={18} className="text-gold" />} label="Em transferências" value="128.400" />
          <Stat icon={<Clock size={18} className="text-gold" />} label="A expirar (30 dias)" value="12.450" />
        </div>

        {/* Atividades recentes */}
        <SectionHeader title="ATIVIDADES RECENTES" action="Ver todas" />
        <div className="mt-3 space-y-2.5">
          {transactions.length === 0 ? (
            <ActivityRow
              icon={<Gift size={20} className="text-gold" />}
              title="Bônus de transferência recebido"
              subtitle="Latam Pass"
              value="+ 25.000"
              time="Hoje"
            />
          ) : (
            transactions.slice(0, 5).map((t) => (
              <ActivityRow
                key={t.id}
                icon={<ArrowLeftRight size={20} className="text-gold" />}
                title={t.direction === 'out' ? `PIX enviado` : 'PIX recebido'}
                subtitle={t.counterparty}
                value={`${t.direction === 'out' ? '- ' : '+ '}${brl(t.amount)}`}
                time={timeAgo(t.createdAt)}
                negative={t.direction === 'out'}
              />
            ))
          )}
        </div>
      </div>

      <BottomNav active="inicio" />
    </div>
  );
}

function SectionHeader({ title, action }: { title: string; action: string }) {
  return (
    <div className="mt-6 flex items-center justify-between">
      <h2 className="text-[12px] font-bold uppercase tracking-widest text-white/60">{title}</h2>
      <button className="flex items-center gap-1 text-[11px] font-semibold text-gold">
        {action} <ArrowRight size={13} />
      </button>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      {icon}
      <span className="mt-2 text-[10px] leading-tight text-white/45">{label}</span>
      <span className="mt-1 text-[17px] font-extrabold text-gold">{value}</span>
    </div>
  );
}

function ActivityRow({
  icon,
  title,
  subtitle,
  value,
  time,
  negative,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: string;
  time: string;
  negative?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-stroke bg-panel px-4 py-3.5">
      <div className="grid h-10 w-10 place-items-center rounded-full bg-gold/10">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-semibold text-white">{title}</p>
        <p className="text-[12px] text-white/40">{subtitle}</p>
      </div>
      <div className="text-right">
        <p className={`text-[14px] font-extrabold ${negative ? 'text-red-400' : 'text-gold'}`}>{value}</p>
        <p className="text-[11px] text-white/35">{time}</p>
      </div>
    </div>
  );
}
