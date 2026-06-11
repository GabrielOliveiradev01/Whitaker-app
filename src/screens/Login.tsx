import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import Logo from '../components/Logo';
import { store } from '../lib/store';
import { requestNotificationPermission } from '../lib/notify';
import { AUTHORIZED_USER } from '../config';

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const emailOk = email.trim().toLowerCase() === AUTHORIZED_USER.email.toLowerCase();
    const passOk = password === AUTHORIZED_USER.password;
    if (!emailOk || !passOk) {
      setError('E-mail ou senha inválidos. Acesso restrito.');
      return;
    }
    store.signup({
      name: AUTHORIZED_USER.name,
      email: AUTHORIZED_USER.email,
      cpf: '',
      password: AUTHORIZED_USER.password,
    });
    await requestNotificationPermission();
    nav('/app');
  }

  return (
    <div className="relative h-full w-full overflow-y-auto no-scrollbar bg-ink">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gold/15 blur-3xl" />

      <div className="relative px-6 pb-10 pt-20">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center">
          <Logo size="lg" />
          <h1 className="mt-10 text-2xl font-extrabold text-white">Bem-vindo de volta</h1>
          <p className="mt-1 text-center text-sm text-white/50">Acesse sua conta para continuar.</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          onSubmit={submit}
          className="mt-10 space-y-3.5"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-stroke bg-panel px-4 py-3.5 focus-within:border-gold/50">
            <Mail size={18} className="text-gold/70" />
            <input
              className="flex-1 bg-transparent text-[15px] text-white placeholder:text-white/35 outline-none"
              placeholder="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-stroke bg-panel px-4 py-3.5 focus-within:border-gold/50">
            <Lock size={18} className="text-gold/70" />
            <input
              className="flex-1 bg-transparent text-[15px] text-white placeholder:text-white/35 outline-none"
              placeholder="Senha"
              type={show ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" onClick={() => setShow((s) => !s)} className="text-white/40">
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <p className="text-center text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-gold-soft via-gold to-gold-deep py-4 text-[15px] font-extrabold text-black transition active:scale-[0.98]"
          >
            Entrar
            <ArrowRight size={18} />
          </button>

          <p className="pt-2 text-center text-xs text-white/35">
            Acesso restrito. Somente usuários autorizados.
          </p>
        </motion.form>
      </div>
    </div>
  );
}
