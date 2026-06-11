import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, Plane, Check, Loader2, Copy, ShieldCheck } from 'lucide-react';
import SafeTop from '../components/SafeTop';
import { store, useStore } from '../lib/store';
import { brl, centsToDisplay, digitsToCents } from '../lib/format';
import { pushNotification, notifyRecipientApp, requestNotificationPermission } from '../lib/notify';
import { RECIPIENT_APP } from '../config';

type Step = 'amount' | 'key' | 'confirm' | 'processing' | 'done';

export default function Redeem() {
  const nav = useNavigate();
  const balance = useStore((s) => s.balance);
  const user = useStore((s) => s.user);

  const [step, setStep] = useState<Step>('amount');
  const [amountCents, setAmountCents] = useState<number>(Math.round(balance * 100));
  const [pixKey, setPixKey] = useState('');
  const [error, setError] = useState('');

  const amount = amountCents / 100;

  function goAmount() {
    if (amountCents <= 0) return setError('Informe um valor válido.');
    if (amount > balance) return setError('Valor maior que o disponível.');
    setError('');
    setStep('key');
  }

  function goKey() {
    if (!pixKey.trim()) return setError('Informe a chave PIX de destino.');
    setError('');
    setStep('confirm');
  }

  async function confirm() {
    setStep('processing');
    await requestNotificationPermission();

    setTimeout(() => {
      // Registra a transação (saída do Whitaker)
      store.addTransaction({
        direction: 'out',
        amount,
        pixKey: pixKey.trim(),
        counterparty: RECIPIENT_APP.name,
      });

      // Notificação SAINDO do Whitaker
      pushNotification({
        app: 'whitaker',
        title: 'Transferência PIX enviada',
        body: `Você enviou para ${RECIPIENT_APP.name} • chave ${pixKey.trim()}`,
        amount,
      });

      // Notificação ENTRANDO no app recebedor (inclusive em outra aba)
      notifyRecipientApp({
        title: 'Você recebeu um PIX',
        body: `De ${user?.name ?? 'Whitaker IA'} via Whitaker IA`,
        amount,
      });

      setStep('done');
    }, 2200);
  }

  return (
    <div className="relative flex h-full w-full flex-col bg-ink">
      <SafeTop />

      {/* Top bar */}
      <div className="flex items-center gap-3 px-5 pt-2 pb-1">
        <button
          onClick={() => (step === 'amount' ? nav('/app') : setStep(prev(step)))}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-white/80"
          disabled={step === 'processing' || step === 'done'}
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-[17px] font-bold text-white">Resgatar via PIX</h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-10">
        <AnimatePresence mode="wait">
          {step === 'amount' && (
            <StepWrap key="amount">
              <p className="text-sm text-white/45">Disponível: {brl(balance)}</p>
              <label className="mt-6 block text-[12px] font-semibold uppercase tracking-widest text-white/50">
                Valor a resgatar
              </label>
              <div className="mt-3 flex items-end gap-2 border-b border-stroke pb-3">
                <span className="text-2xl font-bold text-gold">R$</span>
                <input
                  autoFocus
                  inputMode="numeric"
                  value={centsToDisplay(amountCents)}
                  onChange={(e) => setAmountCents(digitsToCents(e.target.value))}
                  className="w-full bg-transparent text-[38px] font-extrabold text-white outline-none"
                  placeholder="0,00"
                />
              </div>
              <div className="mt-4 flex gap-2">
                {[0.25, 0.5, 1].map((p) => (
                  <button
                    key={p}
                    onClick={() => setAmountCents(Math.round(balance * p * 100))}
                    className="rounded-full border border-stroke bg-panel px-4 py-2 text-[12px] font-semibold text-white/70"
                  >
                    {p === 1 ? 'Tudo' : `${p * 100}%`}
                  </button>
                ))}
              </div>
              {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
              <PrimaryBtn onClick={goAmount}>Continuar</PrimaryBtn>
            </StepWrap>
          )}

          {step === 'key' && (
            <StepWrap key="key">
              <label className="block text-[12px] font-semibold uppercase tracking-widest text-white/50">
                Chave PIX de destino
              </label>
              <input
                autoFocus
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                placeholder="CPF, e-mail, telefone ou aleatória"
                className="mt-3 w-full rounded-2xl border border-stroke bg-panel px-4 py-4 text-[15px] text-white placeholder:text-white/35 outline-none focus:border-gold/50"
              />
              <div className="mt-4 rounded-2xl border border-stroke bg-panel p-4">
                <p className="text-[11px] uppercase tracking-widest text-white/40">Recebedor</p>
                <p className="mt-1 text-[15px] font-bold text-white">{RECIPIENT_APP.name}</p>
              </div>
              {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
              <PrimaryBtn onClick={goKey}>Continuar</PrimaryBtn>
            </StepWrap>
          )}

          {step === 'confirm' && (
            <StepWrap key="confirm">
              <div className="rounded-3xl border border-stroke bg-panel p-5">
                <p className="text-center text-[12px] uppercase tracking-widest text-white/40">
                  Você está enviando
                </p>
                <p className="mt-2 text-center text-[40px] font-extrabold text-gold">{brl(amount)}</p>
                <div className="mt-5 space-y-3 border-t border-stroke pt-4 text-sm">
                  <Row label="Para" value={RECIPIENT_APP.name} />
                  <Row label="Chave PIX" value={pixKey} copyable />
                  <Row label="De" value={user?.name ?? 'Whitaker IA'} />
                  <Row label="Quando" value="Agora" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-[12px] text-white/45">
                <ShieldCheck size={16} className="text-gold" /> Transação protegida pela Whitaker IA
              </div>
              <PrimaryBtn onClick={confirm}>Confirmar e enviar</PrimaryBtn>
            </StepWrap>
          )}

          {step === 'processing' && (
            <StepWrap key="processing">
              <div className="flex flex-col items-center justify-center pt-24">
                <Loader2 size={48} className="animate-spin text-gold" />
                <p className="mt-6 text-[16px] font-semibold text-white">Processando transferência…</p>
                <p className="mt-1 text-sm text-white/45">Enviando {brl(amount)} via PIX</p>
              </div>
            </StepWrap>
          )}

          {step === 'done' && (
            <StepWrap key="done">
              <div className="flex flex-col items-center justify-center pt-16">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                  className="grid h-24 w-24 place-items-center rounded-full bg-gold/15"
                >
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-gold">
                    <Check size={36} className="text-black" strokeWidth={3} />
                  </div>
                </motion.div>
                <p className="mt-6 text-[20px] font-extrabold text-white">PIX enviado!</p>
                <p className="mt-1 text-center text-sm text-white/50">
                  {brl(amount)} enviado para {RECIPIENT_APP.name}.
                </p>

                <div className="mt-6 flex items-center gap-2 rounded-2xl border border-gold/30 bg-gold/5 px-4 py-3 text-[12px] text-gold">
                  <Plane size={16} /> Notificações enviadas nos dois apps.
                </div>

                <div className="mt-8 w-full space-y-3">
                  <button
                    onClick={() => nav('/recebedor')}
                    className="w-full rounded-2xl border border-stroke bg-panel py-4 text-[15px] font-bold text-white"
                  >
                    Abrir {RECIPIENT_APP.name}
                  </button>
                  <button
                    onClick={() => nav('/app')}
                    className="w-full rounded-2xl bg-gradient-to-r from-gold-soft via-gold to-gold-deep py-4 text-[15px] font-extrabold text-black"
                  >
                    Voltar ao início
                  </button>
                </div>
              </div>
            </StepWrap>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function prev(step: Step): Step {
  if (step === 'key') return 'amount';
  if (step === 'confirm') return 'key';
  return 'amount';
}

function StepWrap({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="pt-4"
    >
      {children}
    </motion.div>
  );
}

function PrimaryBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mt-8 w-full rounded-2xl bg-gradient-to-r from-gold-soft via-gold to-gold-deep py-4 text-[15px] font-extrabold text-black transition active:scale-[0.98]"
    >
      {children}
    </button>
  );
}

function Row({ label, value, copyable }: { label: string; value: string; copyable?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/45">{label}</span>
      <span className="flex items-center gap-2 font-semibold text-white">
        {value}
        {copyable && (
          <button onClick={() => navigator.clipboard?.writeText(value)} className="text-white/40">
            <Copy size={14} />
          </button>
        )}
      </span>
    </div>
  );
}
