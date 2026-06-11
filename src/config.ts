/**
 * Configuração do "app recebedor" (o outro app que recebe o dinheiro).
 * Troque o nome e a logo aqui quando tiver a marca definitiva.
 * A logo pode ser uma URL ou um arquivo importado de /src/assets.
 */
export const RECIPIENT_APP = {
  name: 'Banco Recebedor',
  // Coloque aqui o caminho da logo enviada (ex: importe de ./assets/logo.png)
  logo: '' as string,
  // Cor de destaque do app recebedor
  accent: '#22c55e',
};

export const WHITAKER_APP = {
  name: 'Whitaker IA',
  accent: '#e3b341',
};

/**
 * Único usuário autorizado a acessar o app.
 * O cadastro público está desativado.
 */
export const AUTHORIZED_USER = {
  name: 'CEO Whitaker IA',
  email: 'Ceo@whitalkeria.com.br',
  password: '12345678',
};

export function isAuthorized(user: { email: string; password?: string } | null): boolean {
  if (!user) return false;
  return user.email.trim().toLowerCase() === AUTHORIZED_USER.email.toLowerCase();
}
