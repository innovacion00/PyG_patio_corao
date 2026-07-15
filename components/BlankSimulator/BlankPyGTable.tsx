"use client";

import type { BlankBreakdown } from "@/lib/finance/blank/types";
import { formatCurrencyCOP, formatNumber, formatPercent } from "@/lib/finance/formatters";

interface BlankPyGTableProps {
  breakdown: BlankBreakdown;
  ocupacionPct: number;
  diasOperativosMes: number;
  adrPromedio: number;
}

type RowKind = "section" | "line" | "subtotal" | "percent";

interface Row {
  label: string;
  kind: RowKind;
  mensual?: number;
  anual?: number;
  isDeduction?: boolean;
}

function buildRows(breakdown: BlankBreakdown): Row[] {
  return [
    { label: breakdown.ingresos.total.concepto, kind: "subtotal", ...breakdown.ingresos.total },
    { label: breakdown.ingresoHospedaje.concepto, kind: "line", ...breakdown.ingresoHospedaje },

    { label: "COSTOS DIRECTOS", kind: "section" },
    ...breakdown.costosDirectos.lineas.map(
      (l): Row => ({ label: l.concepto, kind: "line", mensual: l.mensual, anual: l.anual, isDeduction: true }),
    ),
    { label: breakdown.costosDirectos.total.concepto, kind: "subtotal", ...breakdown.costosDirectos.total, isDeduction: true },

    { label: "OTROS INGRESOS", kind: "section" },
    ...breakdown.otrosIngresos.lineas.map((l): Row => ({ label: l.concepto, kind: "line", mensual: l.mensual, anual: l.anual })),
    { label: breakdown.otrosIngresos.total.concepto, kind: "subtotal", ...breakdown.otrosIngresos.total },

    { label: breakdown.utilidadBruta.concepto, kind: "subtotal", ...breakdown.utilidadBruta },

    { label: "GASTOS OPERACIONALES", kind: "section" },
    ...breakdown.gastosOperacionales.lineas.map(
      (l): Row => ({ label: l.concepto, kind: "line", mensual: l.mensual, anual: l.anual, isDeduction: true }),
    ),
    {
      label: breakdown.gastosOperacionales.total.concepto,
      kind: "subtotal",
      ...breakdown.gastosOperacionales.total,
      isDeduction: true,
    },

    { label: breakdown.ebitda.concepto, kind: "subtotal", ...breakdown.ebitda },
    { label: "Margen EBITDA", kind: "percent", mensual: breakdown.margenEbitdaPct, anual: breakdown.margenEbitdaPct },

    { label: "GASTOS NO OPERACIONALES", kind: "section" },
    { label: breakdown.gastoFinanciero.concepto, kind: "line", ...breakdown.gastoFinanciero, isDeduction: true },

    { label: "COMERCIALIZACIÓN GEHSUITES", kind: "section" },
    { label: breakdown.feeGEH.fijo.concepto, kind: "line", ...breakdown.feeGEH.fijo, isDeduction: true },
    { label: breakdown.feeGEH.variable.concepto, kind: "line", ...breakdown.feeGEH.variable, isDeduction: true },
    { label: breakdown.feeGEH.total.concepto, kind: "subtotal", ...breakdown.feeGEH.total, isDeduction: true },

    { label: breakdown.utilidadNeta.concepto, kind: "subtotal", ...breakdown.utilidadNeta },
    { label: "Margen Neto", kind: "percent", mensual: breakdown.margenNetoPct, anual: breakdown.margenNetoPct },
  ];
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-arena-200 bg-white px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-deep-700/50">{label}</p>
      <p className="text-sm font-bold text-deep-900">{value}</p>
    </div>
  );
}

export function BlankPyGTable({ breakdown, ocupacionPct, diasOperativosMes, adrPromedio }: BlankPyGTableProps) {
  const rows = buildRows(breakdown);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-deep-700/50">Variables operativas</p>
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-5 gap-2">
          <StatPill label="% Ocupación" value={formatPercent(ocupacionPct)} />
          <StatPill label="ADR promedio" value={formatCurrencyCOP(adrPromedio)} />
          <StatPill label="Días operativos / mes" value={formatNumber(diasOperativosMes, 0)} />
          <StatPill label="Room-noches / mes" value={formatNumber(breakdown.roomNoches.mensual, 1)} />
          <StatPill label="Room-noches / año" value={formatNumber(breakdown.roomNoches.anual, 1)} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-arena-200 text-left">
              <th className="py-2 pr-2 text-xs font-semibold uppercase tracking-wide text-deep-700/50">Concepto</th>
              <th className="py-2 px-2 text-xs font-semibold uppercase tracking-wide text-deep-700/50 text-right">Mensual</th>
              <th className="py-2 pl-2 text-xs font-semibold uppercase tracking-wide text-deep-700/50 text-right">Anual</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              if (row.kind === "section") {
                return (
                  <tr key={`${row.label}-${i}`} className="bg-arena-50">
                    <td colSpan={3} className="py-1.5 px-2 text-xs font-bold uppercase tracking-wide text-deep-700/70">
                      {row.label}
                    </td>
                  </tr>
                );
              }

              const isSubtotal = row.kind === "subtotal";
              const isPercent = row.kind === "percent";
              const mensual = row.mensual ?? 0;
              const anual = row.anual ?? 0;
              const isTrulyNegative = mensual < 0;
              const showMinus = row.isDeduction || isTrulyNegative;
              const valueColor = isTrulyNegative ? "text-danger-500" : row.isDeduction && !isSubtotal ? "text-dorado-700" : "";

              return (
                <tr
                  key={`${row.label}-${i}`}
                  className={`border-b border-arena-100 ${isSubtotal ? "bg-arena-50 font-bold text-deep-900" : "text-deep-800"}`}
                >
                  <td className={`py-1.5 pr-2 ${!isSubtotal ? "pl-3" : ""}`}>{row.label}</td>
                  {isPercent ? (
                    <td colSpan={2} className="py-1.5 px-2 text-right font-bold tabular-nums text-deep-900">
                      {formatPercent(row.mensual ?? 0)}
                    </td>
                  ) : (
                    <>
                      <td className={`py-1.5 px-2 text-right tabular-nums whitespace-nowrap ${valueColor}`}>
                        {`${showMinus ? "−" : ""}${formatCurrencyCOP(Math.abs(mensual))}`}
                      </td>
                      <td className={`py-1.5 pl-2 text-right tabular-nums whitespace-nowrap ${valueColor}`}>
                        {`${showMinus ? "−" : ""}${formatCurrencyCOP(Math.abs(anual))}`}
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
