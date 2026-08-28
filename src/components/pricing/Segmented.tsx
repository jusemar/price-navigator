interface Option<T extends string> {
  id: T;
  label: string;
  desc?: string;
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  columns,
}: {
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
  columns?: boolean;
}) {
  return (
    <div
      role="radiogroup"
      className={
        columns
          ? "grid gap-2 sm:grid-cols-3"
          : "flex flex-wrap gap-2 rounded-2xl bg-surface p-1.5 ring-1 ring-hairline"
      }
    >
      {options.map((o) => {
        const active = o.id === value;
        return (
          <button
            key={o.id}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.id)}
            className={`min-w-0 rounded-xl px-4 py-2.5 text-left transition-all duration-300 ${
              active
                ? "bg-primary text-primary-foreground shadow-soft"
                : "text-muted-foreground hover:bg-surface-strong hover:text-foreground"
            } ${columns ? "ring-1 ring-hairline" : ""}`}
          >
            <span className="block truncate text-sm font-semibold">{o.label}</span>
            {o.desc ? (
              <span
                className={`mt-0.5 block text-xs ${
                  active ? "text-primary-foreground/75" : "text-muted-foreground/80"
                }`}
              >
                {o.desc}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
