import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, X, Info, Sparkles, ArrowRight, ShieldCheck, Clock, Wallet } from "lucide-react";

import { AnimatedPrice } from "@/components/pricing/AnimatedPrice";
import { Segmented } from "@/components/pricing/Segmented";
import { Stepper } from "@/components/pricing/Stepper";
import {
  type Answers,
  type CategoryId,
  type TierId,
  categories,
  currency,
  defaultAnswers,
  featuresFor,
  frameworks,
  priceFor,
  routines,
  sectors,
  supports,
  tiers,
} from "@/lib/pricing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Preços sob medida | ContabilPro" },
      {
        name: "description",
        content:
          "Monte seu plano em 30 segundos: contabilidade, jurídico ou o pacote completo, com preço calculado pelo seu enquadramento, equipe e rotina.",
      },
      { property: "og:title", content: "Preços sob medida | ContabilPro" },
      {
        property: "og:description",
        content:
          "Configurador de planos contábeis e jurídicos com preço transparente, calculado ao vivo conforme o perfil da sua empresa.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  const [category, setCategory] = useState<CategoryId>("padrao");
  const [answers, setAnswers] = useState<Answers>(defaultAnswers);
  const [openBreakdown, setOpenBreakdown] = useState<TierId | null>(null);

  const set = <K extends keyof Answers>(key: K, value: Answers[K]) =>
    setAnswers((a) => ({ ...a, [key]: value }));

  const prices = useMemo(
    () => tiers.map((t) => priceFor(category, t.id, answers)),
    [category, answers],
  );
  const groups = useMemo(() => featuresFor(category), [category]);
  const activeCategory = categories.find((c) => c.id === category)!;

  return (
    <main className="min-h-screen bg-background">
      {/* HERO */}
      <section className="grid-veil border-b border-hairline">
        <div className="mx-auto max-w-6xl px-5 pb-14 pt-16 sm:pt-24">
          <span className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-xs font-semibold text-accent-foreground ring-1 ring-hairline">
            <Sparkles className="h-3.5 w-3.5" /> Preço calculado ao vivo — sem “fale com vendas”
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl leading-[1.05] font-bold sm:text-6xl">
            Responda 6 perguntas.
            <br />
            <span className="text-muted-foreground">Veja seu preço real</span> na hora.
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Cada empresa tem um custo diferente — e a gente mostra exatamente de onde ele vem.
            Ajuste seu perfil ao lado e compare os três níveis de serviço lado a lado.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Wallet className="h-4 w-4 text-mint-foreground" /> Sem taxa de adesão
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-mint-foreground" /> Cancele quando quiser
            </span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-mint-foreground" /> Migração gratuita
            </span>
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="mx-auto max-w-6xl px-5 pt-12">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          1. Escolha o tipo de serviço
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => {
            const active = c.id === category;
            return (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                aria-pressed={active}
                className={`group relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-300 ${
                  active
                    ? "bg-primary text-primary-foreground shadow-lift"
                    : "bg-card ring-1 ring-hairline hover:-translate-y-0.5 hover:shadow-soft"
                }`}
              >
                {c.badge ? (
                  <span
                    className={`mb-3 inline-block rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      active
                        ? "bg-mint text-mint-foreground"
                        : "bg-highlight/25 text-highlight-foreground"
                    }`}
                  >
                    {c.badge}
                  </span>
                ) : null}
                <span className="block text-base font-semibold leading-snug">{c.label}</span>
                <span
                  className={`mt-2 block text-sm ${
                    active ? "text-primary-foreground/75" : "text-muted-foreground"
                  }`}
                >
                  {c.tagline}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* CONFIGURADOR + PLANOS */}
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-8 lg:grid-cols-[380px_minmax(0,1fr)] lg:items-start">
          {/* PAINEL */}
          <div className="rounded-3xl bg-card p-6 shadow-soft ring-1 ring-hairline lg:sticky lg:top-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              2. Conte sobre a empresa
            </h2>

            <div className="mt-6 space-y-6">
              <Field label="Enquadramento fiscal">
                <div className="grid grid-cols-2 gap-2">
                  {frameworks.map((f) => {
                    const active = f.id === answers.framework;
                    return (
                      <button
                        key={f.id}
                        onClick={() => set("framework", f.id)}
                        className={`rounded-xl px-3 py-2.5 text-left transition-colors ${
                          active
                            ? "bg-primary text-primary-foreground"
                            : "bg-surface ring-1 ring-hairline hover:bg-surface-strong"
                        }`}
                      >
                        <span className="block text-sm font-semibold">{f.label}</span>
                        <span
                          className={`mt-0.5 block text-[11px] leading-tight ${
                            active ? "text-primary-foreground/70" : "text-muted-foreground"
                          }`}
                        >
                          {f.hint}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Field>

              <Field label="Ramo de atuação">
                <Segmented
                  options={sectors}
                  value={answers.sector}
                  onChange={(v) => set("sector", v)}
                />
              </Field>

              <Field label="Funcionários registrados">
                <Stepper
                  value={answers.employees}
                  onChange={(v) => set("employees", v)}
                  max={120}
                  suffix="pessoas"
                />
              </Field>

              <Field label="Notas fiscais por mês">
                <Stepper
                  value={answers.invoices}
                  onChange={(v) => set("invoices", v)}
                  max={500}
                  step={5}
                  suffix="notas"
                />
                <div className="mt-3">
                  <Segmented
                    options={[
                      { id: "cliente" as const, label: "Eu emito" },
                      { id: "contabilidade" as const, label: "Vocês emitem" },
                    ]}
                    value={answers.invoiceIssuer}
                    onChange={(v) => set("invoiceIssuer", v)}
                  />
                </div>
              </Field>

              <Field label="Faturamento mensal">
                <input
                  type="range"
                  min={0}
                  max={1000000}
                  step={5000}
                  value={answers.revenue}
                  onChange={(e) => set("revenue", Number(e.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surface-strong accent-primary"
                />
                <p className="mt-2 text-sm font-semibold">
                  {answers.revenue >= 1000000 ? "Acima de R$ 1 milhão" : currency(answers.revenue)}
                  <span className="ml-1 font-normal text-muted-foreground">/mês</span>
                </p>
              </Field>

              <Field label="Como quer ser atendido">
                <div className="space-y-2">
                  {supports.map((s) => (
                    <Radio
                      key={s.id}
                      active={answers.support === s.id}
                      onClick={() => set("support", s.id)}
                      label={s.label}
                      desc={s.desc}
                    />
                  ))}
                </div>
              </Field>

              <Field label="Quem cuida da rotina">
                <div className="space-y-2">
                  {routines.map((r) => (
                    <Radio
                      key={r.id}
                      active={answers.routine === r.id}
                      onClick={() => set("routine", r.id)}
                      label={r.label}
                      desc={r.desc}
                    />
                  ))}
                </div>
              </Field>
            </div>

            <button
              onClick={() => setAnswers(defaultAnswers)}
              className="mt-6 w-full rounded-xl bg-surface py-2.5 text-sm font-medium text-muted-foreground ring-1 ring-hairline transition-colors hover:bg-surface-strong hover:text-foreground"
            >
              Recomeçar configuração
            </button>
          </div>

          {/* PLANOS */}
          <div>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  3. Seu preço nos 3 níveis
                </h2>
                <p className="mt-1 text-lg font-semibold">{activeCategory.label}</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground">
                Atualiza a cada resposta
              </span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {tiers.map((t, i) => {
                const p = prices[i]!;
                return (
                  <article
                    key={t.id}
                    className={`slide-up relative flex flex-col rounded-3xl p-5 ${
                      t.highlight
                        ? "bg-primary text-primary-foreground shadow-lift"
                        : "bg-card ring-1 ring-hairline"
                    }`}
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <span
                      className={`inline-block w-fit rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        t.highlight
                          ? "bg-mint text-mint-foreground"
                          : "bg-surface-strong text-secondary-foreground"
                      }`}
                    >
                      {t.badge}
                    </span>
                    <h3 className="mt-3 text-xl font-bold">{t.name}</h3>
                    <p
                      className={`mt-1 text-xs leading-snug ${
                        t.highlight ? "text-primary-foreground/75" : "text-muted-foreground"
                      }`}
                    >
                      {t.pitch}
                    </p>

                    <div className="mt-5">
                      <span
                        className={`block text-xs line-through ${
                          t.highlight ? "text-primary-foreground/60" : "text-muted-foreground"
                        }`}
                      >
                        {currency(p.anchor)}
                      </span>
                      <p className="flex items-baseline gap-1">
                        <span className="text-sm font-medium">R$</span>
                        <span className="text-4xl font-bold">
                          <AnimatedPrice value={p.total} />
                        </span>
                        <span
                          className={`text-sm ${
                            t.highlight ? "text-primary-foreground/70" : "text-muted-foreground"
                          }`}
                        >
                          /mês
                        </span>
                      </p>
                    </div>

                    <button
                      onClick={() => setOpenBreakdown(openBreakdown === t.id ? null : t.id)}
                      className={`mt-3 w-fit text-xs font-semibold underline decoration-dotted underline-offset-4 ${
                        t.highlight ? "text-primary-foreground/80" : "text-muted-foreground"
                      }`}
                    >
                      {openBreakdown === t.id ? "Ocultar cálculo" : "Como chegamos nesse valor?"}
                    </button>

                    {openBreakdown === t.id ? (
                      <ul
                        className={`slide-up mt-3 space-y-1.5 rounded-2xl p-3 text-xs ${
                          t.highlight ? "bg-primary-foreground/10" : "bg-surface"
                        }`}
                      >
                        {p.lines.map((l) => (
                          <li key={l.label} className="flex items-baseline justify-between gap-3">
                            <span
                              className={
                                t.highlight
                                  ? "text-primary-foreground/75"
                                  : "text-muted-foreground"
                              }
                            >
                              {l.label}
                            </span>
                            <span className="shrink-0 font-semibold tabular-nums">
                              {currency(l.value)}
                            </span>
                          </li>
                        ))}
                        <li className="flex items-baseline justify-between gap-3 border-t border-current/15 pt-1.5 font-semibold">
                          <span>Total ajustado</span>
                          <span className="tabular-nums">{currency(p.total)}</span>
                        </li>
                      </ul>
                    ) : null}

                    <button
                      className={`mt-5 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5 ${
                        t.highlight
                          ? "bg-mint text-mint-foreground"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      Contratar <ArrowRight className="h-4 w-4" />
                    </button>
                  </article>
                );
              })}
            </div>

            {category === "combo" ? (
              <p className="slide-up mt-4 rounded-2xl bg-accent px-4 py-3 text-sm text-accent-foreground">
                <strong>Desconto de combo aplicado:</strong> contabilidade e jurídico juntos saem
                18% mais baratos do que contratados separadamente.
              </p>
            ) : null}

            {/* COMPARATIVO */}
            <div className="mt-10 overflow-hidden rounded-3xl bg-card ring-1 ring-hairline">
              <div className="grid grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))] items-end gap-2 border-b border-hairline bg-surface px-4 py-3 sm:px-5">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Comparativo
                </span>
                {tiers.map((t) => (
                  <span key={t.id} className="truncate text-center text-sm font-bold">
                    {t.name}
                  </span>
                ))}
              </div>

              {groups.map((g) => (
                <div key={g.group}>
                  <p className="bg-surface-strong px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-secondary-foreground sm:px-5">
                    {g.group}
                  </p>
                  {g.rows.map((row) => (
                    <div
                      key={row.label}
                      className="grid grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))] items-center gap-2 border-b border-hairline px-4 py-3 last:border-0 sm:px-5"
                    >
                      <span className="flex min-w-0 items-center gap-1.5 text-sm text-foreground">
                        <span className="min-w-0">{row.label}</span>
                        {row.hint ? (
                          <span title={row.hint} className="shrink-0 text-muted-foreground">
                            <Info className="h-3.5 w-3.5" />
                          </span>
                        ) : null}
                      </span>
                      {tiers.map((t) => {
                        const v = row.values[t.id as TierId];
                        return (
                          <span key={t.id} className="text-center text-xs">
                            {v === true ? (
                              <Check className="mx-auto h-4 w-4 text-mint-foreground" />
                            ) : v === false ? (
                              <X className="mx-auto h-4 w-4 text-muted-foreground/50" />
                            ) : (
                              <span className="text-muted-foreground">{v}</span>
                            )}
                          </span>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Valores de demonstração. A proposta final é confirmada após a análise dos documentos
              da empresa.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-foreground">{label}</p>
      {children}
    </div>
  );
}

function Radio({
  active,
  onClick,
  label,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  desc: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`grid w-full grid-cols-[auto_minmax(0,1fr)] items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
        active ? "bg-accent ring-1 ring-ring" : "bg-surface ring-1 ring-hairline hover:bg-surface-strong"
      }`}
    >
      <span
        className={`mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full ring-1 ${
          active ? "bg-primary ring-primary" : "ring-hairline"
        }`}
      >
        {active ? <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" /> : null}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold">{label}</span>
        <span className="block text-[11px] leading-tight text-muted-foreground">{desc}</span>
      </span>
    </button>
  );
}
