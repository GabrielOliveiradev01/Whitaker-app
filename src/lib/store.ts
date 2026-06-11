import { useSyncExternalStore } from 'react';

export type User = {
  name: string;
  email: string;
  cpf: string;
  password: string;
};

export type TxDirection = 'out' | 'in';

export type Transaction = {
  id: string;
  direction: TxDirection;
  amount: number;
  pixKey: string;
  counterparty: string;
  createdAt: number;
};

export type AppNotification = {
  id: string;
  app: 'whitaker' | 'recipient';
  title: string;
  body: string;
  amount?: number;
  createdAt: number;
  read: boolean;
};

type State = {
  user: User | null;
  balance: number; // valor a receber (R$)
  miles: number;
  transactions: Transaction[];
  notifications: AppNotification[];
};

const STORAGE_KEY = 'whitaker-ia-state-v1';

const defaultState: State = {
  user: null,
  balance: 3448.0,
  miles: 245680,
  transactions: [],
  notifications: [],
};

function load(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultState };
    const parsed = JSON.parse(raw) as Partial<State>;
    return { ...defaultState, ...parsed };
  } catch {
    return { ...defaultState };
  }
}

let state: State = load();
const listeners = new Set<() => void>();

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

function setState(patch: Partial<State> | ((s: State) => Partial<State>)) {
  const next = typeof patch === 'function' ? patch(state) : patch;
  state = { ...state, ...next };
  emit();
}

// Sincroniza entre abas / janelas (ex: app recebedor aberto em outra aba)
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      state = load();
      listeners.forEach((l) => l());
    }
  });
}

export const store = {
  getState: () => state,
  subscribe: (cb: () => void) => {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  setState,

  signup(user: User) {
    setState({ user });
  },

  login(email: string, password: string): boolean {
    const u = state.user;
    if (u && u.email.toLowerCase() === email.toLowerCase() && u.password === password) {
      return true;
    }
    return false;
  },

  logout() {
    // Mantém o usuário cadastrado, apenas usado para fluxo de sessão se necessário
  },

  setBalance(value: number) {
    setState({ balance: Math.max(0, value) });
  },

  setMiles(value: number) {
    setState({ miles: Math.max(0, Math.round(value)) });
  },

  addNotification(n: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) {
    const notif: AppNotification = {
      ...n,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      read: false,
    };
    setState((s) => ({ notifications: [notif, ...s.notifications].slice(0, 50) }));
    return notif;
  },

  markAllRead(app?: 'whitaker' | 'recipient') {
    setState((s) => ({
      notifications: s.notifications.map((n) =>
        !app || n.app === app ? { ...n, read: true } : n,
      ),
    }));
  },

  addTransaction(tx: Omit<Transaction, 'id' | 'createdAt'>) {
    const t: Transaction = { ...tx, id: crypto.randomUUID(), createdAt: Date.now() };
    setState((s) => ({
      transactions: [t, ...s.transactions],
      balance: tx.direction === 'out' ? Math.max(0, s.balance - tx.amount) : s.balance,
    }));
    return t;
  },

  reset() {
    state = { ...defaultState };
    emit();
  },
};

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(state),
    () => selector(defaultState),
  );
}
