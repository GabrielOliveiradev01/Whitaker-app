import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Check, Wallet, Plane, RotateCcw } from 'lucide-react';
import SafeTop from '../components/SafeTop';
import BottomNav from '../components/BottomNav';
import { store, useStore } from '../lib/store';
import { brl, num, centsToDisplay, digitsToCents } from '../lib/format';

export default function Settings() {
  const nav = useNavigate();
  const balance = useStore((s) => s.balance);
  const miles = useStore((s) => s.miles);
  const user = useStore((s) => s.user);

  const [balanceCents, setBalanceCents] = useState(Math.round(balance * 100));
  const [milesStr, setMilesStr] = useState(String(miles));
  const [saved, setSaved] = useState(false);

  function save() {
    const m = Number(milesStr.replace(/\D/g, ''));
    store.setBalance(balanceCents / 100);
    if (!Number.isNaN(m)) store.setMiles(m);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  return (
    <div className="relative flex h-full w-full flex-col bg-ink">
      <SafeTop />

      <div className="flex items-center gap-3 px-5 pt-2 pb-2">
        <button onClick={() => nav('/app')} className="flex h-9 w-9 items-center justify-center rounded-xl text-white/80">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-[17px] font-bold text-white">Configurações</h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-28">
        {/* Conta */}
        <div className="mt-2 rounded-2xl border border-stroke bg-panel p-4">
          <p className="text-[11px] uppercase tracking-widest text-white/40">Conta</p>
          <p className="mt-1 text-[15px] font-bold text-white">{user?.name ?? 'Usuário'}</p>
          <p className="text-[12px] text-white/45">{user?.email}</p>
        </div>

        <h2 className="mt-6 text-[12px] font-bold uppercase tracking-widest text-white/55">Saldos</h2>

        {/* Valor a receber */}
        <div className="mt-3 rounded-2xl border border-stroke bg-panel p-4">
          <div className="flex items-center gap-2 text-white/70">
            <Wallet size={18} className="text-gold" />
            <span className="text-[13px] font-semibold">Valor a receber</span>
          </div>
          <div className="mt-3 flex items-end gap-2 border-b border-stroke pb-2">
            <span className="text-xl font-bold text-gold">R$</span>
            <input
              inputMode="numeric"
              value={centsToDisplay(balanceCents)}
              onChange={(e) => setBalanceCents(digitsToCents(e.target.value))}
              className="w-full bg-transparent text-[28px] font-extrabold text-white outline-none"
              placeholder="0,00"
            />
          </div>
          <p className="mt-2 text-[11px] text-white/40">Atual: {brl(balance)} • digite os centavos</p>
        </div>

        {/* Saldo de milhas */}
        <div className="mt-3 rounded-2xl border border-stroke bg-panel p-4">
          <div className="flex items-center gap-2 text-white/70">
            <Plane size={18} className="text-gold" />
            <span className="text-[13px] font-semibold">Saldo de milhas</span>
          </div>
          <div className="mt-3 flex items-end gap-2 border-b border-stroke pb-2">
            <input
              inputMode="numeric"
              value={milesStr}
              onChange={(e) => setMilesStr(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-transparent text-[28px] font-extrabold text-white outline-none"
              placeholder="0"
            />
            <span className="pb-1 text-[13px] text-white/45">milhas</span>
          </div>
          <p className="mt-2 text-[11px] text-white/40">Atual: {num(miles)}</p>
        </div>

        {/* Atalhos rápidos */}
        <div className="mt-3 flex flex-wrap gap-2">
          {[1000, 5000, 10000, 50000].map((v) => (
            <button
              key={v}
              onClick={() => setBalanceCents(v * 100)}
              className="rounded-full border border-stroke bg-panel px-4 py-2 text-[12px] font-semibold text-white/70"
            >
              R$ {num(v)}
            </button>
          ))}
        </div>

        <button
          onClick={save}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-gold-soft via-gold to-gold-deep py-4 text-[15px] font-extrabold text-black transition active:scale-[0.98]"
        >
          {saved ? (
            <>
              <Check size={18} /> Salvo!
            </>
          ) : (
            'Salvar alterações'
          )}
        </button>

        {saved && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 text-center text-[12px] text-gold"
          >
            Saldo atualizado com sucesso.
          </motion.p>
        )}

        <button
          onClick={() => {
            store.setBalance(3448);
            store.setMiles(245680);
            setBalanceCents(344800);
            setMilesStr('245680');
          }}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-stroke bg-panel py-3.5 text-[13px] font-semibold text-white/60"
        >
          <RotateCcw size={16} /> Restaurar valores padrão
        </button>
      </div>

      <BottomNav active="conta" />
    </div>
  );
}
