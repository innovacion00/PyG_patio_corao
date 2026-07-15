"use client";

import type { ScenarioKey } from "@/lib/types";
import { SCENARIO_ORDER, SCENARIOS } from "@/lib/finance/constants";
import { getScenarioBreakdown } from "@/lib/finance/engine";
import { formatCurrencyCOP, formatPercent } from "@/lib/finance/formatters";

interface ScenarioCompareCardsProps {
  activeScenario: ScenarioKey | null;
}

const DOT_COLOR: Record<ScenarioKey, string> = {
  pesimista: "bg-danger-500",
  conservador: "bg-dorado-400",
  optimista: "bg-forest-500",
};

export function ScenarioCompareCards({ activeScenario }: ScenarioCompareCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {SCENARIO_ORDER.map((key) => {
        const scenario = SCENARIOS[key];
        const breakdown = getScenarioBreakdown(key);
        const isActive = activeScenario === key;

        return (
          <div
            key={key}
            className={`rounded-2xl border bg-white p-5 transition-colors ${
              isActive ? "border-dorado-400 shadow-soft" : "border-arena-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-deep-900">
                <span className={`h-2 w-2 rounded-full ${DOT_COLOR[key]}`} />
                {scenario.label}
              </span>
              <span className="text-xs text-deep-700/50">Ocup. {formatPercent(scenario.ocupacionPct)}</span>
            </div>

            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-deep-700/50">ADR aplicado</p>
            <p className="text-lg font-bold text-deep-900">{formatCurrencyCOP(scenario.adr)}</p>

            <div className="mt-3 space-y-1.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-deep-700/60">Ingresos totales (año)</span>
                <span className="font-semibold text-deep-900">{formatCurrencyCOP(breakdown.ingresos.total.anual)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-deep-700/60">Utilidad neta (año)</span>
                <span
                  className={`font-semibold ${breakdown.utilidadNeta.anual < 0 ? "text-danger-500" : "text-forest-500"}`}
                >
                  {formatCurrencyCOP(breakdown.utilidadNeta.anual)}
                </span>
              </div>
            </div>

            <div className="mt-4 border-t border-arena-200 pt-3 grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-deep-700/50">Margen EBITDA</p>
                <p className={`text-base font-bold ${breakdown.margenEbitdaPct < 0 ? "text-danger-500" : "text-deep-900"}`}>
                  {formatPercent(breakdown.margenEbitdaPct)}
                </p>
              </div>
              <div>
                <p className="text-xs text-deep-700/50">Margen neto</p>
                <p className={`text-base font-bold ${breakdown.margenNetoPct < 0 ? "text-danger-500" : "text-deep-900"}`}>
                  {formatPercent(breakdown.margenNetoPct)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
