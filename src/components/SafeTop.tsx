/**
 * Espaçador que respeita a "safe area" do topo (notch / barra de status real do
 * celular). No PWA instalado, o sistema desenha a barra de status por cima,
 * então deixamos esse espaço livre. No desktop garante um respiro mínimo.
 */
export default function SafeTop() {
  return (
    <div
      className="shrink-0"
      style={{ height: 'max(env(safe-area-inset-top), 14px)' }}
    />
  );
}
