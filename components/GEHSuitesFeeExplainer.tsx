"use client";

import { HandCoins, Percent } from "lucide-react";
import { FEE_FIJO_GEH_MENSUAL, TRAMOS_FEE_VARIABLE } from "@/lib/finance/constants";
import { formatCurrencyCOP, formatCurrencyCOPCompact, formatPercent } from "@/lib/finance/formatters";
import type { FinancialBreakdown } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface GEHSuitesFeeExplainerProps {
  /** Si se pasa, resalta el tramo aplicable a ese desglose (uso dentro del simulador). */
  activeBreakdown?: FinancialBreakdown;
  variant?: "compact" | "full";
}

export function GEHSuitesFeeExplainer({ activeBreakdown, variant = "full" }: GEHSuitesFeeExplainerProps) {
  const content = (
    <div className="rounded-2xl border border-arena-200 bg-white p-5 space-y-4">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-arena-100">
          <HandCoins className="h-4 w-4 text-deep-700" />
        </span>
        <div>
          <p className="font-display text-base font-bold text-deep-900">Fee GEHsuites</p>
          <p className="text-xs text-deep-700/60">Fee fijo + variable escalonado sobre ingresos</p>
        </div>
      </div>

      <div className="rounded-lg bg-arena-50 p-3">
        <p className="text-sm text-deep-700">
          Fee fijo mensual: <span className="font-bold text-deep-900">{formatCurrencyCOP(FEE_FIJO_GEH_MENSUAL)}</span>
        </p>
      </div>

      <div className="space-y-2">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-deep-700/60">
          <Percent className="h-3.5 w-3.5 text-dorado-600" />
          Tramos del fee variable (sobre ingresos totales mensuales)
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {TRAMOS_FEE_VARIABLE.map((tramo) => {
            const isActive = activeBreakdown && activeBreakdown.feeGEH.tasaTramoPct === tramo.tasa;
            return (
              <div
                key={tramo.tasa}
                className={`rounded-lg border p-2.5 text-sm transition ${
                  isActive ? "border-dorado-400 bg-dorado-50" : "border-arena-200 bg-white"
                }`}
              >
                <p className="font-bold text-deep-900">{formatPercent(tramo.tasa)}</p>
                <p className="text-deep-700/60 text-xs">
                  {formatCurrencyCOPCompact(tramo.min)} – {formatCurrencyCOPCompact(tramo.max)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {activeBreakdown && (
        <p className="text-sm text-deep-700/70 border-t border-arena-200 pt-3">
          Con ingresos de <span className="font-semibold text-deep-900">{formatCurrencyCOP(activeBreakdown.ingresos.total.mensual)}</span> al
          mes, tu escenario aplica el tramo del{" "}
          <span className="font-semibold text-dorado-700">{formatPercent(activeBreakdown.feeGEH.tasaTramoPct)}</span> — fee
          variable de {formatCurrencyCOP(activeBreakdown.feeGEH.variable.mensual)}/mes.
        </p>
      )}
    </div>
  );

  if (variant === "compact") return content;

  return (
    <section id="comercializacion" className="bg-deep-950">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14 sm:py-20 flex flex-col gap-8">
        <SectionHeading
          tone="dark"
          eyebrow="Transparencia"
          title="Modelo de comercialización GEHsuites"
          description="GEHsuites opera y comercializa Patio Corao a cambio de un fee simple y predecible: un componente fijo mensual y uno variable que escala con los ingresos, alineando incentivos entre operador e inversionistas."
        />
        <div className="mx-auto w-full max-w-2xl">{content}</div>
      </div>
    </section>
  );
}
