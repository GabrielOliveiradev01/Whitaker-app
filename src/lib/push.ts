/**
 * Push notifications reais (Web Push) — funcionam mesmo com o app fechado/
 * em segundo plano, aparecendo na barra do sistema. Requer o backend em
 * /server (chaves VAPID).
 */

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const buffer = new ArrayBuffer(raw.length);
  const output = new Uint8Array(buffer);
  for (let i = 0; i < raw.length; i += 1) output[i] = raw.charCodeAt(i);
  return output;
}

let subscribed = false;

/** Inscreve o dispositivo para receber push. Chame após a permissão ser concedida. */
export async function ensurePushSubscription(): Promise<boolean> {
  try {
    if (
      !('serviceWorker' in navigator) ||
      !('PushManager' in window) ||
      typeof Notification === 'undefined' ||
      Notification.permission !== 'granted'
    ) {
      return false;
    }

    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();

    if (!sub) {
      const res = await fetch('/api/vapidPublicKey');
      if (!res.ok) return false;
      const key = (await res.text()).trim();
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(key),
      });
    }

    await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(sub),
    });

    subscribed = true;
    return true;
  } catch {
    return false;
  }
}

export function isPushSubscribed() {
  return subscribed;
}

/** Pede ao servidor para enviar um push real ao(s) dispositivo(s) inscrito(s). */
export async function sendPush(opts: {
  title: string;
  body: string;
  url?: string;
  tag?: string;
}): Promise<boolean> {
  try {
    const res = await fetch('/api/notify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        title: opts.title,
        body: opts.body,
        tag: opts.tag,
        data: { url: opts.url ?? '/' },
      }),
    });
    if (!res.ok) return false;
    const json = (await res.json()) as { ok: boolean; sent: number };
    return json.ok && json.sent > 0;
  } catch {
    return false;
  }
}
