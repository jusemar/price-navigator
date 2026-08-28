/**
 * DADOS FICTÍCIOS — apenas para prototipagem visual.
 * Todos os valores, regras e textos abaixo são mockados e podem ser
 * ajustados livremente depois.
 */

export type CategoryId = "padrao" | "consultiva" | "juridico" | "combo";
export type TierId = "essencial" | "plus" | "experts";

export interface Category {
  id: CategoryId;
  label: string;
  tagline: string;
  badge?: string;
}

export const categories: Category[] = [
  {
    id: "padrao",
    label: "Contabilidade Padrão",
    tagline: "A rotina fiscal e contábil em dia, sem burocracia.",
  },
  {
    id: "consultiva",
    label: "Contabilidade Consultiva",
    tagline: "Um estrategista financeiro dentro da sua operação.",
  },
  {
    id: "juridico",
    label: "Assistência Jurídica",
    tagline: "Contratos, trabalhista e societário com time dedicado.",
  },
  {
    id: "combo",
    label: "Pacote Empresarial Completo",
    tagline: "Contabilidade + Jurídico no mesmo contrato, mais barato.",
    badge: "Economia de 18%",
  },
];

export const COMBO_DISCOUNT = 0.18;

export interface Tier {
  id: TierId;
  name: string;
  badge: string;
  pitch: string;
  highlight?: boolean;
}

export const tiers: Tier[] = [
  {
    id: "essencial",
    name: "Essencial",
    badge: "Começando",
    pitch: "Obrigações em ordem, com time de apoio no chat.",
  },
  {
    id: "plus",
    name: "Plus",
    badge: "Melhor custo-benefício",
    pitch: "Rotina completa, notas emitidas por nós e reuniões periódicas.",
    highlight: true,
  },
  {
    id: "experts",
    name: "Experts",
    badge: "Atendimento VIP",
    pitch: "Consultor dedicado, análises mensais e prioridade total.",
  },
];

/* ---------------------------------------------------------------- perguntas */

export type FrameworkId = "mei" | "simples" | "presumido" | "real";

export interface Answers {
  framework: FrameworkId;
  sector: "servicos" | "comercio" | "industria";
  employees: number;
  invoices: number;
  invoiceIssuer: "cliente" | "contabilidade";
  revenue: number;
  support: "digital" | "hibrido" | "dedicado";
  routine: "eu_cuido" | "compartilhado" | "terceirizado";
}

export const defaultAnswers: Answers = {
  framework: "simples",
  sector: "servicos",
  employees: 3,
  invoices: 20,
  invoiceIssuer: "contabilidade",
  revenue: 80000,
  support: "hibrido",
  routine: "compartilhado",
};

export const frameworks: { id: FrameworkId; label: string; hint: string }[] = [
  { id: "mei", label: "MEI", hint: "Faturamento até R$ 81 mil/ano" },
  { id: "simples", label: "Simples Nacional", hint: "O regime mais comum" },
  { id: "presumido", label: "Lucro Presumido", hint: "Apuração trimestral" },
  { id: "real", label: "Lucro Real", hint: "Estrutura contábil completa" },
];

export const sectors: { id: Answers["sector"]; label: string }[] = [
  { id: "servicos", label: "Serviços" },
  { id: "comercio", label: "Comércio" },
  { id: "industria", label: "Indústria" },
];

export const supports: { id: Answers["support"]; label: string; desc: string }[] = [
  { id: "digital", label: "100% digital", desc: "Chat e e-mail, resposta em até 9h" },
  { id: "hibrido", label: "Híbrido", desc: "Chat, telefone e reuniões em grupo" },
  { id: "dedicado", label: "Consultor dedicado", desc: "WhatsApp direto e reuniões 1:1" },
];

export const routines: { id: Answers["routine"]; label: string; desc: string }[] = [
  { id: "eu_cuido", label: "Eu cuido", desc: "Envio documentos e emito minhas notas" },
  { id: "compartilhado", label: "Dividimos", desc: "Vocês emitem notas, eu acompanho" },
  { id: "terceirizado", label: "Vocês cuidam", desc: "Rotina 100% terceirizada" },
];

/* ------------------------------------------------------------------ cálculo */

const frameworkBase: Record<FrameworkId, Record<TierId, number>> = {
  mei: { essencial: 89, plus: 129, experts: 219 },
  simples: { essencial: 195, plus: 259, experts: 429 },
  presumido: { essencial: 389, plus: 519, experts: 799 },
  real: { essencial: 749, plus: 989, experts: 1490 },
};

const juridicoBase: Record<FrameworkId, Record<TierId, number>> = {
  mei: { essencial: 69, plus: 119, experts: 199 },
  simples: { essencial: 149, plus: 229, experts: 379 },
  presumido: { essencial: 229, plus: 349, experts: 569 },
  real: { essencial: 379, plus: 549, experts: 890 },
};

const sectorFactor: Record<Answers["sector"], number> = {
  servicos: 1,
  comercio: 1.08,
  industria: 1.18,
};

const supportFactor: Record<Answers["support"], number> = {
  digital: 1,
  hibrido: 1.07,
  dedicado: 1.2,
};

const routineFactor: Record<Answers["routine"], number> = {
  eu_cuido: 0.94,
  compartilhado: 1,
  terceirizado: 1.14,
};

export interface PriceLine {
  label: string;
  value: number;
}

export interface TierPrice {
  tier: TierId;
  total: number;
  anchor: number;
  lines: PriceLine[];
}

function round5(n: number) {
  return Math.round(n / 5) * 5;
}

export function priceFor(
  category: CategoryId,
  tier: TierId,
  a: Answers,
): TierPrice {
  const lines: PriceLine[] = [];

  const accounting = frameworkBase[a.framework][tier];
  const legal = juridicoBase[a.framework][tier];

  let base = 0;
  if (category === "padrao") base = accounting;
  if (category === "consultiva") base = accounting * 1.35;
  if (category === "juridico") base = legal;
  if (category === "combo") base = accounting + legal;

  lines.push({ label: "Base do plano", value: round5(base) });

  let total = base;

  if (category !== "juridico") {
    const staff = Math.max(0, a.employees - 2) * 24;
    if (staff) lines.push({ label: `Folha (${a.employees} funcionários)`, value: staff });
    total += staff;

    const notes =
      a.invoiceIssuer === "contabilidade" ? Math.max(0, a.invoices - 10) * 2.4 : 0;
    if (notes)
      lines.push({ label: `Emissão de ${a.invoices} notas/mês`, value: round5(notes) });
    total += notes;

    const revenue = Math.max(0, a.revenue - 50000) * 0.0009;
    if (revenue)
      lines.push({ label: "Volume de faturamento", value: round5(revenue) });
    total += revenue;

    total *= sectorFactor[a.sector];
    total *= routineFactor[a.routine];
  } else {
    const staff = Math.max(0, a.employees - 2) * 9;
    if (staff) lines.push({ label: "Risco trabalhista", value: staff });
    total += staff;
  }

  total *= supportFactor[a.support];

  const anchor = round5(total * 1.22);
  if (category === "combo") total *= 1 - COMBO_DISCOUNT;

  return { tier, total: round5(total), anchor, lines };
}

export function currency(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

/* --------------------------------------------------------- comparativo mock */

export interface FeatureRow {
  label: string;
  hint?: string;
  values: Record<TierId, string | boolean>;
}

export interface FeatureGroup {
  group: string;
  rows: FeatureRow[];
}

const accountingRows: FeatureGroup[] = [
  {
    group: "Contabilidade",
    rows: [
      {
        label: "Escrituração e obrigações mensais",
        values: { essencial: true, plus: true, experts: true },
      },
      {
        label: "Abertura ou migração de empresa grátis",
        values: { essencial: true, plus: true, experts: true },
      },
      {
        label: "Certificado digital incluso",
        hint: "e-CNPJ A1 renovado anualmente",
        values: { essencial: false, plus: true, experts: true },
      },
      {
        label: "Balanço e DRE",
        values: { essencial: "Anual", plus: "Trimestral", experts: "Mensal comentado" },
      },
    ],
  },
  {
    group: "Notas fiscais",
    rows: [
      {
        label: "Plataforma própria de emissão",
        values: { essencial: true, plus: true, experts: true },
      },
      {
        label: "Emissão feita pelo nosso time",
        values: { essencial: false, plus: "Até 25/mês", experts: "Ilimitado" },
      },
    ],
  },
  {
    group: "Atendimento",
    rows: [
      {
        label: "Chat e e-mail",
        values: { essencial: "Até 9h", plus: "Até 4h", experts: "Até 1h" },
      },
      {
        label: "Telefone e videochamada",
        values: { essencial: false, plus: true, experts: true },
      },
      {
        label: "Consultor dedicado",
        values: { essencial: false, plus: false, experts: true },
      },
      {
        label: "Reunião de resultados",
        values: { essencial: "Em grupo", plus: "Trimestral 1:1", experts: "Mensal 1:1" },
      },
    ],
  },
  {
    group: "Rotina e pessoas",
    rows: [
      { label: "Pró-labore dos sócios", values: { essencial: "Até 2", plus: "Até 4", experts: "Ilimitado" } },
      { label: "Folha de pagamento", values: { essencial: "Cobrado à parte", plus: "Até 5 pessoas", experts: "Até 15 pessoas" } },
      { label: "Conciliação bancária", values: { essencial: "1 conta", plus: "Até 3 contas", experts: "Ilimitado" } },
    ],
  },
];

const consultiveRows: FeatureGroup[] = [
  ...accountingRows,
  {
    group: "Consultoria",
    rows: [
      { label: "Planejamento tributário", values: { essencial: "Anual", plus: "Semestral", experts: "Contínuo" } },
      { label: "Painel de indicadores", values: { essencial: false, plus: true, experts: true } },
      { label: "Projeção de fluxo de caixa", values: { essencial: false, plus: "Trimestral", experts: "Mensal" } },
      { label: "Comitê financeiro com sócios", values: { essencial: false, plus: false, experts: true } },
    ],
  },
];

const legalRows: FeatureGroup[] = [
  {
    group: "Consultoria jurídica",
    rows: [
      { label: "Consultas ilimitadas por chat", values: { essencial: true, plus: true, experts: true } },
      { label: "Revisão de contratos", values: { essencial: "2/mês", plus: "6/mês", experts: "Ilimitado" } },
      { label: "Elaboração de contratos sob medida", values: { essencial: false, plus: "3/mês", experts: "Ilimitado" } },
    ],
  },
  {
    group: "Trabalhista e societário",
    rows: [
      { label: "Rescisões e acordos", values: { essencial: false, plus: true, experts: true } },
      { label: "Alterações societárias", values: { essencial: "Cobrado à parte", plus: "2/ano", experts: "Ilimitado" } },
      { label: "Defesa em processos", values: { essencial: false, plus: "Orçamento reduzido", experts: "Incluso até 2/ano" } },
    ],
  },
  {
    group: "Proteção",
    rows: [
      { label: "Adequação LGPD", values: { essencial: false, plus: true, experts: true } },
      { label: "Blindagem patrimonial dos sócios", values: { essencial: false, plus: false, experts: true } },
      { label: "Advogado responsável nomeado", values: { essencial: false, plus: false, experts: true } },
    ],
  },
];

export function featuresFor(category: CategoryId): FeatureGroup[] {
  if (category === "padrao") return accountingRows;
  if (category === "consultiva") return consultiveRows;
  if (category === "juridico") return legalRows;
  return [...consultiveRows, ...legalRows];
}
