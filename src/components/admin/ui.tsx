import type { ReactNode } from "react";

export function Panel({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl bg-card p-6 shadow-soft ring-1 ring-hairline sm:p-7">
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          {description ? (
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-muted-foreground/80">{hint}</span> : null}
    </label>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1.5 w-full rounded-xl bg-surface px-3.5 py-2.5 text-sm text-foreground ring-1 ring-hairline outline-none transition-shadow placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-ring"
    />
  );
}

export function NumberInput({
  value,
  onChange,
  prefix,
  suffix,
  step = 1,
}: {
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
}) {
  return (
    <div className="mt-1.5 flex items-center gap-2 rounded-xl bg-surface px-3 py-2 ring-1 ring-hairline focus-within:ring-2 focus-within:ring-ring">
      {prefix ? <span className="text-xs text-muted-foreground">{prefix}</span> : null}
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="min-w-0 flex-1 bg-transparent text-sm font-semibold tabular-nums text-foreground outline-none"
      />
      {suffix ? <span className="text-xs text-muted-foreground">{suffix}</span> : null}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`inline-flex h-6 w-11 shrink-0 items-center rounded-full ring-1 ring-hairline transition-colors ${
        checked ? "bg-primary" : "bg-surface-strong"
      }`}
    >
      <span
        className={`ml-0.5 grid h-5 w-5 place-items-center rounded-full bg-card shadow-soft transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export function Badge({ children, tone = "mint" }: { children: ReactNode; tone?: "mint" | "highlight" | "muted" }) {
  const tones = {
    mint: "bg-mint/25 text-mint-foreground",
    highlight: "bg-highlight/25 text-highlight-foreground",
    muted: "bg-surface-strong text-muted-foreground",
  } as const;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}
