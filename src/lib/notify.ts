import { store } from './store';
import { RECIPIENT_APP, WHITAKER_APP } from '../config';
import { sendPush, ensurePushSubscription } from './push';

export type NotifyPayload = {
  app: 'whitaker' | 'recipient';
  title: string;
  body: string;
  amount?: number;
  icon?: string;
};

const CHANNEL = 'whitaker-pix-bus';
const bus =
  typeof window !== 'undefined' && 'BroadcastChannel' in window
    ? new BroadcastChannel(CHANNEL)
    : null;

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof Notification === 'undefined') return 'denied';
  let perm = Notification.permission;
  if (perm === 'default') {
    try {
      perm = await Notification.requestPermission();
    } catch {
      perm = Notification.permission;
    }
  }
  // Já inscreve o dispositivo para push real assim que houver permissão.
  if (perm === 'granted') void ensurePushSubscription();
  return perm;
}

function urlFor(app: NotifyPayload['app']) {
  return app === 'recipient' ? '/recebedor' : '/notificacoes';
}

/** Dispara a notificação do sistema operacional (se permitida). */
async function osNotify(payload: NotifyPayload) {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;

  const options: NotificationOptions = {
    body: payload.body,
    icon: payload.icon ?? '/icon.svg',
    badge: '/icon.svg',
    tag: `${payload.app}-${Date.now()}`,
    data: { url: urlFor(payload.app) },
  };

  // No iOS (PWA) e no Android é obrigatório/recomendado usar o service worker.
  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) {
        await reg.showNotification(payload.title, options);
        return;
      }
    }
  } catch {
    // cai no fallback
  }

  // Fallback para navegadores de desktop sem SW ativo
  try {
    const n = new Notification(payload.title, options);
    setTimeout(() => n.close(), 6000);
  } catch {
    // ignore
  }
}

/** Mostra apenas o toast in-app (banner dentro do app). */
function emitToast(payload: NotifyPayload) {
  window.dispatchEvent(new CustomEvent('app-toast', { detail: payload }));
}

/**
 * Entrega a notificação na barra do sistema: tenta PUSH REAL (servidor) e,
 * se não houver inscrição/backend, cai para notificação local do SW.
 */
async function deliverSystemNotification(payload: NotifyPayload) {
  const pushed = await sendPush({
    title: payload.title,
    body: payload.body,
    url: urlFor(payload.app),
    tag: `${payload.app}-${Date.now()}`,
  });
  if (!pushed) await osNotify(payload);
}

/** Registra no histórico + toast + notificação na barra do sistema (push). */
export function pushNotification(payload: NotifyPayload) {
  store.addNotification({
    app: payload.app,
    title: payload.title,
    body: payload.body,
    amount: payload.amount,
  });
  emitToast(payload);
  void deliverSystemNotification(payload);
}

/** Notifica o outro app (recebedor), inclusive se estiver aberto em outra aba/janela. */
export function notifyRecipientApp(payload: Omit<NotifyPayload, 'app'>) {
  const full: NotifyPayload = { ...payload, app: 'recipient' };
  // Toast em outra aba/janela aberta (o push do sistema já vai para o aparelho).
  bus?.postMessage(full);
  pushNotification(full);
}

/** Inicia o ouvinte do barramento entre abas. Chame uma vez no boot do app. */
export function initNotificationBus() {
  if (!bus) return;
  bus.onmessage = (e: MessageEvent<NotifyPayload>) => {
    // Histórico já sincroniza via localStorage e o push já foi para o aparelho.
    // Aqui só exibimos o toast nesta outra aba.
    emitToast(e.data);
  };
}

export const APPS = { RECIPIENT_APP, WHITAKER_APP };
