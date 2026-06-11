# Whitaker IA

App (web/PWA) de milhas e benefícios com fluxo de resgate via **PIX** e **notificações** que saem do Whitaker e chegam em um segundo app (recebedor).

## Como rodar

São dois processos: o **backend de push** e o **app (Vite)**.

```bash
npm install

# 1) backend de push (porta 3001)
npm run server

# 2) em outro terminal: o app
npm run dev
```

Abra o endereço mostrado no terminal (ex: `http://localhost:5173`). O Vite faz proxy de `/api` para o backend (`localhost:3001`).

> Para receber **push notifications reais** (na barra do celular, mesmo com o app fechado), instale como PWA e aceite a permissão no login.

### Push notifications (Web Push)

- O backend usa **chaves VAPID** (geradas em `server/vapid.json` — não versionar).
- Ao conceder permissão, o dispositivo é inscrito (`/api/subscribe`).
- No PIX confirmado, o app chama `/api/notify`, o servidor envia o **push**, e o `service worker` exibe a notificação na barra do sistema.
- Se o backend estiver fora, há **fallback** para notificação local do service worker.
- **iPhone:** push só funciona com o app **instalado** na tela inicial (iOS 16.4+) e aberto pelo ícone.

Para regenerar as chaves VAPID:

```bash
node -e "const w=require('web-push');const fs=require('fs');fs.writeFileSync('server/vapid.json',JSON.stringify(w.generateVAPIDKeys(),null,2))"
```

## Fluxo principal

1. **Cadastro** (`/cadastro`) ou **Login** (`/login`) — dados salvos localmente no navegador.
2. **Home** (`/app`) — tela igual ao layout (tema escuro/dourado).
3. Toque em **Resgatar agora** (`/resgatar`):
   - informe o **valor**;
   - informe a **chave PIX** de destino;
   - **confirme**.
4. Ao confirmar, são disparadas **duas notificações**:
   - **Saindo do Whitaker IA**: "Transferência PIX enviada";
   - **Entrando no app recebedor**: "Você recebeu um PIX".
5. **App recebedor** (`/recebedor`) — mostra o saldo e as entradas recebidas.
6. **Notificações** do Whitaker (`/notificacoes`) — histórico (ícone de sino na Home).

As notificações aparecem como:
- **toast** dentro do app (banner no topo),
- **notificação real do SO** (se permitido),
- e o histórico fica salvo. Abrindo o app recebedor em **outra aba**, ele também recebe a notificação em tempo real (via `BroadcastChannel`).

## Trocar o nome e a logo do app recebedor

Edite `src/config.ts`:

```ts
export const RECIPIENT_APP = {
  name: 'Nome do App',          // nome que você vai me passar
  logo: '/caminho/para/logo.png', // ou importe de src/assets
  accent: '#22c55e',            // cor de destaque
};
```

Coloque a imagem da logo em `src/assets/` e importe, ou use uma URL.

## Stack

- React + TypeScript + Vite
- Tailwind CSS v4
- React Router
- Framer Motion (animações)
- lucide-react (ícones)
- Web Notifications API + BroadcastChannel + localStorage

## Observação sobre `npm run build`

Há um bug do Vite 8 (rolldown beta) ao resolver `index.html` quando o caminho da pasta contém **espaço** (`App Whiltaker`). O `npm run dev` funciona normalmente. Para gerar build de produção, mova o projeto para um caminho sem espaços (ex: `~/whitaker-ia`).
