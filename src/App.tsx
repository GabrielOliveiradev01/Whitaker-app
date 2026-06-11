import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PhoneFrame from './components/PhoneFrame';
import ToastHost from './components/ToastHost';
import Login from './screens/Login';
import Home from './screens/Home';
import Redeem from './screens/Redeem';
import Recipient from './screens/Recipient';
import Notifications from './screens/Notifications';
import Settings from './screens/Settings';
import { initNotificationBus } from './lib/notify';
import { ensurePushSubscription } from './lib/push';
import { useStore } from './lib/store';
import { isAuthorized } from './config';

function Protected({ children }: { children: React.ReactNode }) {
  const user = useStore((s) => s.user);
  if (!isAuthorized(user)) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function Root() {
  const user = useStore((s) => s.user);
  return <Navigate to={isAuthorized(user) ? '/app' : '/login'} replace />;
}

export default function App() {
  useEffect(() => {
    initNotificationBus();
    // Reinscreve no push se a permissão já estiver concedida (volta ao app).
    void ensurePushSubscription();
  }, []);

  return (
    <BrowserRouter>
      <PhoneFrame>
        <ToastHost />
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/cadastro" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/app" element={<Protected><Home /></Protected>} />
          <Route path="/resgatar" element={<Protected><Redeem /></Protected>} />
          <Route path="/notificacoes" element={<Protected><Notifications /></Protected>} />
          <Route path="/configuracoes" element={<Protected><Settings /></Protected>} />
          <Route path="/recebedor" element={<Recipient />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PhoneFrame>
    </BrowserRouter>
  );
}
