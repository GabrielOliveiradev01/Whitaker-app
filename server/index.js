import express from 'express';
import cors from 'cors';
import webpush from 'web-push';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const keys = JSON.parse(fs.readFileSync(path.join(__dirname, 'vapid.json'), 'utf8'));

webpush.setVapidDetails('mailto:contato@whitaker.ia', keys.publicKey, keys.privateKey);

const app = express();
app.use(cors());
app.use(express.json());

// Inscrições de push (em memória — suficiente para o demo).
const subscriptions = new Map();

app.get('/api/vapidPublicKey', (_req, res) => {
  res.type('text/plain').send(keys.publicKey);
});

app.post('/api/subscribe', (req, res) => {
  const sub = req.body;
  if (!sub || !sub.endpoint) return res.status(400).json({ error: 'subscription inválida' });
  subscriptions.set(sub.endpoint, sub);
  console.log(`Inscrição registrada. Total: ${subscriptions.size}`);
  res.json({ ok: true });
});

app.post('/api/notify', async (req, res) => {
  const payload = JSON.stringify({
    title: req.body.title ?? 'Whitaker IA',
    body: req.body.body ?? '',
    data: req.body.data ?? {},
    tag: req.body.tag,
  });

  let sent = 0;
  await Promise.all(
    [...subscriptions.values()].map(async (sub) => {
      try {
        await webpush.sendNotification(sub, payload);
        sent += 1;
      } catch (err) {
        // Inscrição expirada/inválida -> remove
        if (err.statusCode === 404 || err.statusCode === 410) {
          subscriptions.delete(sub.endpoint);
        }
      }
    }),
  );

  res.json({ ok: true, sent });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Push server rodando em http://localhost:${PORT}`));
