import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  Database,
  Layers,
  Minus,
  Plus,
  SlidersHorizontal,
  Sparkles,
  Table2,
  Tags,
  Wallet,
} from "lucide-react";

import { Badge, Field, NumberInput, Panel, TextInput, Toggle } from "@/components/admin/ui";
import {
  type CategoryId,
  type FrameworkId,
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

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel de preços | ContabilPro Admin" },
      {
        name: "description",
        content:
          "Painel visual para cadastrar categorias, níveis, preços base, multiplicadores e recursos que alimentam a página de planos.",
      },
      { property: "og:title", content: "Painel de preços | ContabilPro Admin" },
      {
        property: "og:description",
        content:
          "Configure valores base por enquadramento, adicionais por funcionário e nota fiscal, multiplicadores e o comparativo de recursos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminPage,
});

/* ------------------------------------------------------------ estado visual */

type Section = "catalogo" | "base" | "regras" | "recursos" | "preview";

const sections: { id: Section; label: string; icon: typeof Tags }[] = [
  { id: "catalogo", label: "Catálogo", icon: Tags },
  { id: "base", label: "Preços base", icon: Wallet },
  { id: "regras", label: "Regras de cálculo", icon: SlidersHorizontal },
  { id: "recursos", label: "Comparativo", icon: Table2 },
  { id: "preview", label: "Pré-visualização", icon: Sparkles },
];

const initialBase: Record<FrameworkId, Record<TierId, number>> = {
  mei: { essencial: 89, plus: 129, experts: 219 },
  simples: { essencial: 195, plus: 259, experts: 429 },
  presumido: { essencial: 389, plus: 519, experts: 799 },
  real: { essencial: 749, plus: 989, experts: 1490 },
};

const initialLegal: Record<FrameworkId, Record<TierId, number>> = {
  mei: { essencial: 69, plus: 119, experts: 199 },
  simples: { essencial: 149, plus: 229, experts: 379 },
  presumido: { essencial: 229, plus: 349, experts: 569 },
  real: { essencial: 379, plus: 549, experts: 890 },
};

function AdminPage() {
  const [section, setSection] = useState<Section>("catalogo");

  // Catálogo
  const [cats, setCats] = useState(
    categories.map((c) => ({ ...c, active: true, badge: c.badge ?? "" })),
  );
  const [tierRows, setTierRows] = useState(
    tiers.map((t) => ({ ...t, active: true, highlight: !!t.highlight })),
  );
  const [comboDiscount, setComboDiscount] = useState(18);
  const [consultiveFactor, setConsultiveFactor] = useState(1.35);

  // Preços base
  const [base, setBase] = useState(initialBase);
  const [legal, setLegal] = useState(initialLegal);
  const [priceTable, setPriceTable] = useState<"contabil" | "juridico">("contabil");

  // Regras
  const [staffFree, setStaffFree] = useState(2);
  const [staffPrice, setStaffPrice] = useState(24);
  const [staffLegal, setStaffLegal] = useState(9);
  const [notesFree, setNotesFree] = useState(10);
  const [notePrice, setNotePrice] = useState(2.4);
  const [revenueFree, setRevenueFree] = useState(50000);
  const [revenueRate, setRevenueRate] = useState(0.0009);
  const [anchor, setAnchor] = useState(22);
  const [roundTo, setRoundTo] = useState(5);
  const [sectorF, setSectorF] = useState({ servicos: 1, comercio: 1.08, industria: 1.18 });
  const [supportF, setSupportF] = useState({ digital: 1, hibrido: 1.07, dedicado: 1.2 });
  const [routineF, setRoutineF] = useState({ eu_cuido: 0.94, compartilhado: 1, terceirizado: 1.14 });

  // Comparativo
  const [featureCategory, setFeatureCategory] = useState<CategoryId>("padrao");
  const groups = useMemo(() => featuresFor(featureCategory), [featureCategory]);

  // Pré-visualização
  const [previewCategory, setPreviewCategory] = useState<CategoryId>("padrao");
  const previewPrices = useMemo(
    () => tiers.map((t) => priceFor(previewCategory, t.id, defaultAnswers)),
    [previewCategory],
  );

  const table = priceTable === "contabil" ? base : legal;
  const setTable = priceTable === "contabil" ? setBase : setLegal;

  return (
    <div className="min-h-screen bg-background">
      {/* barra superior */}
      <header className="sticky top-0 z-30 border-b border-hairline bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3.5 sm:px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-xs font-semibold text-muted-foreground ring-1 ring-hairline transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Ver página pública
          </Link>
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold text-foreground">
              Painel de precificação
            </h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge tone="highlight">Somente visual</Badge>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5"
            >
              <Check className="h-4 w-4" /> Salvar
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[228px_minmax(0,1fr)]">
        {/* navegação */}
        <nav className="lg:sticky lg:top-24 lg:self-start">
          <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
            {sections.map((s) => {
              const Icon = s.icon;
              const active = s.id === section;
              return (
                <li key={s.id} className="shrink-0 lg:shrink">
                  <button
                    onClick={() => setSection(s.id)}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground shadow-soft"
                        : "text-muted-foreground hover:bg-surface hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {s.label}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 hidden rounded-2xl bg-surface p-4 ring-1 ring-hairline lg:block">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <Database className="h-3.5 w-3.5" /> Sem banco de dados
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              As alterações ficam apenas nesta tela. A persistência entra depois da aprovação do
              visual.
            </p>
          </div>
        </nav>

        <main className="space-y-6">
          {section === "catalogo" && (
            <>
              <Panel
                title="Categorias de plano"
                description="Os cartões que aparecem no topo da home. Controle nome, chamada, selo e visibilidade."
                action={
                  <button className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-xs font-semibold text-foreground ring-1 ring-hairline">
                    <Plus className="h-3.5 w-3.5" /> Nova categoria
                  </button>
                }
              >
                <div className="space-y-3">
                  {cats.map((c, i) => (
                    <div
                      key={c.id}
                      className="rounded-2xl bg-surface p-4 ring-1 ring-hairline transition-shadow hover:shadow-soft"
                    >
                      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_150px_auto] sm:items-end">
                        <Field label="Nome">
                          <TextInput
                            value={c.label}
                            onChange={(v) =>
                              setCats((p) => p.map((x, j) => (i === j ? { ...x, label: v } : x)))
                            }
                          />
                        </Field>
                        <Field label="Chamada">
                          <TextInput
                            value={c.tagline}
                            onChange={(v) =>
                              setCats((p) => p.map((x, j) => (i === j ? { ...x, tagline: v } : x)))
                            }
                          />
                        </Field>
                        <Field label="Selo">
                          <TextInput
                            value={c.badge}
                            placeholder="opcional"
                            onChange={(v) =>
                              setCats((p) => p.map((x, j) => (i === j ? { ...x, badge: v } : x)))
                            }
                          />
                        </Field>
                        <div className="flex items-center gap-2 pb-1">
                          <Toggle
                            label={`Ativar ${c.label}`}
                            checked={c.active}
                            onChange={(v) =>
                              setCats((p) => p.map((x, j) => (i === j ? { ...x, active: v } : x)))
                            }
                          />
                          <span className="text-xs text-muted-foreground">
                            {c.active ? "Visível" : "Oculta"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel
                title="Níveis (Essencial · Plus · Experts)"
                description="Nome, selo e o pitch exibido dentro de cada cartão de preço."
              >
                <div className="grid gap-3 lg:grid-cols-3">
                  {tierRows.map((t, i) => (
                    <div key={t.id} className="rounded-2xl bg-surface p-4 ring-1 ring-hairline">
                      <div className="mb-3 flex items-center justify-between">
                        <Badge tone={t.highlight ? "mint" : "muted"}>
                          {t.highlight ? "Destaque" : "Padrão"}
                        </Badge>
                        <Toggle
                          label={`Destacar ${t.name}`}
                          checked={t.highlight}
                          onChange={(v) =>
                            setTierRows((p) =>
                              p.map((x, j) => ({ ...x, highlight: i === j ? v : false })),
                            )
                          }
                        />
                      </div>
                      <div className="space-y-3">
                        <Field label="Nome">
                          <TextInput
                            value={t.name}
                            onChange={(v) =>
                              setTierRows((p) => p.map((x, j) => (i === j ? { ...x, name: v } : x)))
                            }
                          />
                        </Field>
                        <Field label="Selo">
                          <TextInput
                            value={t.badge}
                            onChange={(v) =>
                              setTierRows((p) => p.map((x, j) => (i === j ? { ...x, badge: v } : x)))
                            }
                          />
                        </Field>
                        <Field label="Pitch">
                          <TextInput
                            value={t.pitch}
                            onChange={(v) =>
                              setTierRows((p) => p.map((x, j) => (i === j ? { ...x, pitch: v } : x)))
                            }
                          />
                        </Field>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel
                title="Combinações"
                description="Como as categorias derivadas são calculadas a partir das tabelas base."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Desconto do pacote completo"
                    hint="Aplicado sobre contabilidade + jurídico."
                  >
                    <NumberInput value={comboDiscount} onChange={setComboDiscount} suffix="%" />
                  </Field>
                  <Field
                    label="Fator da contabilidade consultiva"
                    hint="Multiplica o valor da contabilidade padrão."
                  >
                    <NumberInput value={consultiveFactor} step={0.01} onChange={setConsultiveFactor} suffix="×" />
                  </Field>
                </div>
              </Panel>
            </>
          )}

          {section === "base" && (
            <Panel
              title="Tabela de preços base"
              description="Valor de partida por enquadramento tributário em cada nível, antes de adicionais e multiplicadores."
              action={
                <div className="flex gap-1.5 rounded-full bg-surface p-1 ring-1 ring-hairline">
                  {(["contabil", "juridico"] as const).map((k) => (
                    <button
                      key={k}
                      onClick={() => setPriceTable(k)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                        priceTable === k
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {k === "contabil" ? "Contabilidade" : "Jurídico"}
                    </button>
                  ))}
                </div>
              }
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      <th className="px-3 pb-1">Enquadramento</th>
                      {tiers.map((t) => (
                        <th key={t.id} className="px-3 pb-1">
                          {t.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {frameworks.map((f) => (
                      <tr key={f.id} className="bg-surface">
                        <td className="rounded-l-2xl px-3 py-3 ring-1 ring-hairline">
                          <span className="block text-sm font-semibold text-foreground">
                            {f.label}
                          </span>
                          <span className="text-xs text-muted-foreground">{f.hint}</span>
                        </td>
                        {tiers.map((t, idx) => (
                          <td
                            key={t.id}
                            className={`px-3 py-3 align-middle ring-1 ring-hairline ${
                              idx === tiers.length - 1 ? "rounded-r-2xl" : ""
                            }`}
                          >
                            <NumberInput
                              prefix="R$"
                              value={table[f.id][t.id]}
                              onChange={(v) =>
                                setTable((p) => ({
                                  ...p,
                                  [f.id]: { ...p[f.id], [t.id]: v },
                                }))
                              }
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          )}

          {section === "regras" && (
            <>
              <Panel
                title="Adicionais por volume"
                description="O que é cobrado além da base conforme as respostas do configurador na home."
              >
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Field label="Funcionários inclusos" hint="Acima disso, cobra por pessoa.">
                    <NumberInput value={staffFree} onChange={setStaffFree} suffix="pessoas" />
                  </Field>
                  <Field label="Valor por funcionário extra">
                    <NumberInput prefix="R$" value={staffPrice} onChange={setStaffPrice} />
                  </Field>
                  <Field label="Risco trabalhista (jurídico)" hint="Por funcionário extra.">
                    <NumberInput prefix="R$" value={staffLegal} onChange={setStaffLegal} />
                  </Field>
                  <Field label="Notas inclusas por mês">
                    <NumberInput value={notesFree} onChange={setNotesFree} suffix="notas" />
                  </Field>
                  <Field label="Valor por nota emitida" hint="Só quando a emissão é nossa.">
                    <NumberInput prefix="R$" step={0.1} value={notePrice} onChange={setNotePrice} />
                  </Field>
                  <Field label="Faturamento isento">
                    <NumberInput prefix="R$" step={1000} value={revenueFree} onChange={setRevenueFree} />
                  </Field>
                  <Field label="Taxa sobre excedente" hint="Aplicada ao faturamento acima do isento.">
                    <NumberInput step={0.0001} value={revenueRate} onChange={setRevenueRate} />
                  </Field>
                  <Field label="Preço-âncora" hint="Percentual acima do valor final, exibido riscado.">
                    <NumberInput value={anchor} onChange={setAnchor} suffix="%" />
                  </Field>
                  <Field label="Arredondar para múltiplos de">
                    <NumberInput value={roundTo} onChange={setRoundTo} prefix="R$" />
                  </Field>
                </div>
              </Panel>

              <Panel
                title="Multiplicadores por resposta"
                description="Cada resposta do cliente ajusta o total. 1,00 significa preço neutro."
              >
                <div className="grid gap-5 lg:grid-cols-3">
                  <FactorGroup
                    title="Ramo de atividade"
                    items={sectors.map((s) => ({ id: s.id, label: s.label }))}
                    values={sectorF}
                    onChange={(id, v) => setSectorF((p) => ({ ...p, [id]: v }))}
                  />
                  <FactorGroup
                    title="Forma de atendimento"
                    items={supports.map((s) => ({ id: s.id, label: s.label, desc: s.desc }))}
                    values={supportF}
                    onChange={(id, v) => setSupportF((p) => ({ ...p, [id]: v }))}
                  />
                  <FactorGroup
                    title="Quem cuida da rotina"
                    items={routines.map((s) => ({ id: s.id, label: s.label, desc: s.desc }))}
                    values={routineF}
                    onChange={(id, v) => setRoutineF((p) => ({ ...p, [id]: v }))}
                  />
                </div>
              </Panel>

              <Panel
                title="Ordem de cálculo"
                description="Referência de como os campos acima são aplicados na home."
              >
                <ol className="space-y-2.5">
                  {[
                    "Base do enquadramento no nível escolhido",
                    "+ funcionários extras, notas emitidas e excedente de faturamento",
                    "× ramo de atividade × rotina × atendimento",
                    "− desconto do pacote completo (quando aplicável)",
                    "= valor arredondado e âncora exibida riscada",
                  ].map((step, i) => (
                    <li key={step} className="flex gap-3 rounded-xl bg-surface p-3 ring-1 ring-hairline">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {i + 1}
                      </span>
                      <span className="text-sm text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
              </Panel>
            </>
          )}

          {section === "recursos" && (
            <Panel
              title="Comparativo de recursos"
              description="O que cada nível entrega. Use ✓/✕ ou um texto curto como “Até 25/mês”."
              action={
                <div className="flex flex-wrap gap-1.5 rounded-full bg-surface p-1 ring-1 ring-hairline">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setFeatureCategory(c.id)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                        featureCategory === c.id
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              }
            >
              <div className="space-y-5">
                {groups.map((g) => (
                  <div key={g.group + featureCategory}>
                    <div className="mb-2 flex items-center gap-2">
                      <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                      <h3 className="text-sm font-semibold text-foreground">{g.group}</h3>
                      <button className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground">
                        <Plus className="h-3.5 w-3.5" /> Linha
                      </button>
                    </div>
                    <div className="space-y-2">
                      {g.rows.map((r) => (
                        <div
                          key={r.label}
                          className="grid gap-3 rounded-2xl bg-surface p-3 ring-1 ring-hairline sm:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))_auto] sm:items-center"
                        >
                          <TextInput value={r.label} onChange={() => {}} />
                          {tiers.map((t) => {
                            const v = r.values[t.id];
                            return (
                              <div key={t.id}>
                                {typeof v === "boolean" ? (
                                  <div className="mt-1.5 flex items-center gap-2 rounded-xl bg-card px-3 py-2 ring-1 ring-hairline">
                                    <Toggle checked={v} onChange={() => {}} label={t.name} />
                                    <span className="truncate text-xs text-muted-foreground">
                                      {v ? "Incluso" : "Não incluso"}
                                    </span>
                                  </div>
                                ) : (
                                  <TextInput value={v} onChange={() => {}} />
                                )}
                              </div>
                            );
                          })}
                          <button
                            aria-label="Remover linha"
                            className="mt-1.5 grid h-9 w-9 place-items-center justify-self-end rounded-full bg-card text-muted-foreground ring-1 ring-hairline transition-colors hover:text-destructive"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {section === "preview" && (
            <Panel
              title="Pré-visualização"
              description="Como os três níveis aparecem para um cliente no perfil padrão do configurador."
              action={
                <div className="flex flex-wrap gap-1.5 rounded-full bg-surface p-1 ring-1 ring-hairline">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setPreviewCategory(c.id)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                        previewCategory === c.id
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              }
            >
              <div className="grid gap-3 lg:grid-cols-3">
                {previewPrices.map((p) => {
                  const tier = tiers.find((t) => t.id === p.tier)!;
                  return (
                    <div
                      key={p.tier}
                      className={`rounded-2xl p-5 ring-1 ${
                        tier.highlight
                          ? "bg-primary text-primary-foreground ring-primary shadow-lift"
                          : "bg-surface ring-hairline"
                      }`}
                    >
                      <span
                        className={`text-xs font-semibold ${
                          tier.highlight ? "text-primary-foreground/75" : "text-muted-foreground"
                        }`}
                      >
                        {tier.badge}
                      </span>
                      <h3 className="mt-1 text-lg font-semibold">{tier.name}</h3>
                      <p className="mt-3 text-3xl font-bold tabular-nums">{currency(p.total)}</p>
                      <p
                        className={`text-xs line-through ${
                          tier.highlight ? "text-primary-foreground/60" : "text-muted-foreground"
                        }`}
                      >
                        {currency(p.anchor)}
                      </p>
                      <ul className="mt-4 space-y-1.5 text-xs">
                        {p.lines.map((l) => (
                          <li key={l.label} className="flex justify-between gap-3">
                            <span className={tier.highlight ? "text-primary-foreground/80" : "text-muted-foreground"}>
                              {l.label}
                            </span>
                            <span className="tabular-nums">{currency(l.value)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Os valores acima usam a tabela atual do protótipo. Depois de conectar o backend, esta
                pré-visualização passa a refletir os campos editados aqui.
              </p>
            </Panel>
          )}
        </main>
      </div>
    </div>
  );
}

function FactorGroup<T extends string>({
  title,
  items,
  values,
  onChange,
}: {
  title: string;
  items: { id: T; label: string; desc?: string }[];
  values: Record<string, number>;
  onChange: (id: T, v: number) => void;
}) {
  return (
    <div className="rounded-2xl bg-surface p-4 ring-1 ring-hairline">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <div className="mt-3 space-y-3">
        {items.map((i) => (
          <div key={i.id}>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-sm text-foreground">{i.label}</span>
              <span className="text-xs tabular-nums text-muted-foreground">
                {values[i.id].toFixed(2)}×
              </span>
            </div>
            {i.desc ? (
              <span className="block text-xs text-muted-foreground/80">{i.desc}</span>
            ) : null}
            <NumberInput step={0.01} value={values[i.id]} onChange={(v) => onChange(i.id, v)} suffix="×" />
          </div>
        ))}
      </div>
    </div>
  );
}
