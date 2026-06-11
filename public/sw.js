// Service worker do Whitaker IA — habilita instalação como PWA e notificações
// disparadas pelo sistema (necessário no iOS e recomendado no Android).

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Push real: chega do servidor mesmo com o app fechado/em segundo plano.
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: 'Whitaker IA', body: event.data ? event.data.text() : '' };
  }
  const title = data.title || 'Whitaker IA';
  const options = {
    body: data.body || '',
    icon: '/icon.svg',
    badge: '/icon.svg',
    tag: data.tag,
    data: data.data || {},
    vibrate: [80, 40, 80],
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Permite que a página peça ao SW para exibir uma notificação do sistema.
self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || data.type !== 'SHOW_NOTIFICATION') return;
  const { title, options } = data.payload;
  self.registration.showNotification(title, options);
});

// Ao tocar na notificação, foca/abre o app.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if ('focus' in client) {
          client.navigate?.(target);
          return client.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(target);
    }),
  );
});
