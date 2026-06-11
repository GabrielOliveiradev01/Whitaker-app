export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const scale = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-lg' : 'text-2xl';
  return (
    <div className="flex flex-col items-center leading-none">
      <span
        className={`font-display ${scale} tracking-[0.35em] text-gradient-gold font-bold pl-[0.35em]`}
      >
        WHITAKER
      </span>
      <span className="mt-1 flex items-center gap-2">
        <span className="h-px w-5 bg-gradient-to-r from-transparent to-gold/60" />
        <span className="font-display text-[0.6rem] tracking-[0.5em] text-gold/80 pl-[0.5em]">
          IA
        </span>
        <span className="h-px w-5 bg-gradient-to-l from-transparent to-gold/60" />
      </span>
    </div>
  );
}
