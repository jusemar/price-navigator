import { useEffect, useRef, useState } from "react";

/** Interpola o valor exibido para dar a sensação de recálculo ao vivo. */
export function AnimatedPrice({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const from = useRef(value);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const origin = from.current;
    const delta = value - origin;
    const duration = 450;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(origin + delta * eased);
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else from.current = value;
    };

    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      from.current = display;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <span className="tabular-nums">
      {Math.round(display).toLocaleString("pt-BR")}
    </span>
  );
}
