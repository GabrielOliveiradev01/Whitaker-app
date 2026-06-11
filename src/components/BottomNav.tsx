import { Home, Plane, Wallet, Star, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const items = [
  { key: 'inicio', label: 'Início', icon: Home, route: '/app' },
  { key: 'oportunidades', label: 'Oportunidades', icon: Plane, route: '/app' },
  { key: 'carteira', label: 'Carteira', icon: Wallet, route: '/recebedor' },
  { key: 'favoritos', label: 'Favoritos', icon: Star, route: '/app' },
  { key: 'conta', label: 'Conta', icon: User, route: '/configuracoes' },
];

export default function BottomNav({ active }: { active?: string }) {
  const nav = useNavigate();
  const { pathname } = useLocation();

  const current =
    active ??
    (pathname.startsWith('/configuracoes')
      ? 'conta'
      : pathname.startsWith('/recebedor')
        ? 'carteira'
        : 'inicio');

  return (
    <nav className="absolute inset-x-0 bottom-0 z-40 border-t border-white/8 bg-[#0a0a0bee] backdrop-blur-xl">
      <div className="flex items-center justify-around px-2 pb-5 pt-2.5">
        {items.map(({ key, label, icon: Icon, route }) => {
          const isActive = key === current;
          return (
            <button
              key={key}
              onClick={() => nav(route)}
              className="flex flex-1 flex-col items-center gap-1"
            >
              <Icon size={21} className={isActive ? 'text-gold' : 'text-white/45'} />
              <span className={`text-[10px] ${isActive ? 'font-bold text-gold' : 'text-white/45'}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
