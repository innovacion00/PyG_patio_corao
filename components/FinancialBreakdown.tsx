"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SCENARIO_ORDER, SCENARIOS } from "@/lib/finance/constants";
import { getScenarioBreakdown } from "@/lib/finance/engine";
import { formatCurrencyCOP } from "@/lib/finance/formatters";
import type { LineItem, ScenarioKey } from "@/lib/types";

function LineTable({ lines, total }: { lines: LineItem[]; total: LineItem }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-arena-200">
            <th className="py-2 text-xs font-semibold uppercase tracking-wide text-deep-700/50">Concepto</th>
            <th className="py-2 text-xs font-semibold uppercase tracking-wide text-deep-700/50 text-right">Mensual</th>
            <th className="py-2 text-xs font-semibold uppercase tracking-wide text-deep-700/50 text-right">Anual</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line) => (
            <tr key={line.concepto} className="border-b border-arena-100">
              <td className="py-2 text-deep-800">{line.concepto}</td>
              <td className="py-2 text-right tabular-nums text-deep-800">{formatCurrencyCOP(line.mensual)}</td>
              <td className="py-2 text-right tabular-nums text-deep-800">{formatCurrencyCOP(line.anual)}</td>
            </tr>
          ))}
          <tr className="font-bold text-deep-900">
            <td className="py-2">{total.concepto}</td>
            <td className="py-2 text-right tabular-nums">{formatCurrencyCOP(total.mensual)}</td>
            <td className="py-2 text-right tabular-nums">{formatCurrencyCOP(total.anual)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function AccordionSection({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-arena-200 bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-3.5 text-left"
      >
        <span className="font-display text-sm font-bold text-deep-900">{title}</span>
        <ChevronDown className={`h-4 w-4 text-deep-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
}

export function FinancialBreakdown() {
  const [scenario, setScenario] = useState<ScenarioKey>("conservador");
  const breakdown = getScenarioBreakdown(scenario);

  return (
    <section id="desglose-financiero" className="mx-auto max-w-5xl px-4 sm:px-6 py-14 sm:py-20 flex flex-col gap-6">
      <SectionHeading
        eyebrow="Profundidad financiera"
        title="Desglose financiero transparente"
        description="Para inversionistas que quieren revisar cada línea del modelo: costos directos y gastos operacionales, escenario por escenario."
        align="left"
      />

      <div className="flex gap-1 rounded-lg bg-arena-100 p-1 w-fit">
        {SCENARIO_ORDER.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setScenario(key)}
            className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
              scenario === key ? "bg-white text-deep-900 shadow-soft" : "text-deep-700/60"
            }`}
          >
            {SCENARIOS[key].label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <AccordionSection title="Ingresos" defaultOpen>
          <LineTable
            lines={[
              breakdown.ingresos.hospedaje,
              breakdown.ingresos.rooftop,
              breakdown.ingresos.cafe,
              breakdown.ingresos.spa,
            ]}
            total={breakdown.ingresos.total}
          />
        </AccordionSection>

        <AccordionSection title="Costos Directos">
          <LineTable lines={breakdown.costosDirectos.lineas} total={breakdown.costosDirectos.total} />
        </AccordionSection>

        <AccordionSection title="Gastos Operacionales">
          <LineTable lines={breakdown.gastosOperacionales.lineas} total={breakdown.gastosOperacionales.total} />
        </AccordionSection>

        <AccordionSection title="Gasto Financiero y Fee GEHsuites">
          <LineTable
            lines={[breakdown.gastoFinanciero, breakdown.feeGEH.fijo, breakdown.feeGEH.variable]}
            total={breakdown.feeGEH.total}
          />
        </AccordionSection>
      </div>
    </section>
  );
}
