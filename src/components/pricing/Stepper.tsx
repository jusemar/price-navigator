export function Stepper({
  value,
  onChange,
  min = 0,
  max = 200,
  step = 1,
  suffix,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  return (
    <div className="flex items-center gap-3">
      <button
        aria-label="Diminuir"
        onClick={() => onChange(clamp(value - step))}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface-strong text-lg font-medium text-foreground ring-1 ring-hairline transition-colors hover:bg-accent"
      >
        −
      </button>
      <div className="min-w-0 flex-1 text-center">
        <span className="text-xl font-semibold tabular-nums text-foreground">{value}</span>
        {suffix ? <span className="ml-1 text-xs text-muted-foreground">{suffix}</span> : null}
      </div>
      <button
        aria-label="Aumentar"
        onClick={() => onChange(clamp(value + step))}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface-strong text-lg font-medium text-foreground ring-1 ring-hairline transition-colors hover:bg-accent"
      >
        +
      </button>
    </div>
  );
}
