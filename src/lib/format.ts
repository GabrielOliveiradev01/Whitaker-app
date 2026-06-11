export function brl(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function num(value: number): string {
  return value.toLocaleString('pt-BR');
}

export function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'Agora';
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} h`;
  const d = Math.floor(h / 24);
  return `${d} d`;
}

/** Converte centavos (inteiro) para exibição decimal pt-BR, ex: 344800 -> "3.448,00". */
export function centsToDisplay(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Extrai os dígitos digitados e trata como centavos. Ex: "3448,00" -> 344800. */
export function digitsToCents(input: string): number {
  const digits = input.replace(/\D/g, '');
  return digits ? parseInt(digits, 10) : 0;
}

export function maskCpf(v: string): string {
  return v
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}
