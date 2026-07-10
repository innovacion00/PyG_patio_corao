"use client";

import type { FinancialBreakdown } from "@/lib/types";
import { DIAS_OPERATIVOS_MES, NUMERO_HABITACIONES } from "@/lib/finance/constants";
import { formatCurrencyCOP, formatNumber, formatPercent } from "@/lib/finance/formatters";

interface DetailedPyGTableProps {
  breakdown: FinancialBreakdown;
  scenarioLabel: string;
}

type RowKind = "section" | "line" | "subtotal" | "percent";

interface Row {
  label: string;
  kind: RowKind;
  mensual?: number;
  anual?: number;
  /** Líneas de costo/gasto: se almacenan como magnitud positiva pero se muestran como deducción (signo "-"). */
  isDeduction?: boolean;
}

/**
 * Tabla detallada del P&G — misma estructura de fila que la tabla "PATIO
 * CORAO (Estado P y G)" de la hoja "PyG Hospedaje" (cada línea de ingreso,
 * costo, gasto, subtotal y margen), presentada con el mismo formato visual
 * de la "Tabla financiera detallada" de referencia: variables operativas
 * como píldoras arriba, y tabla Concepto / Mensual / Anual / % debajo.
 */
function buildRows(breakdown: FinancialBreakdown): Row[] {
  return [
    { label: breakdown.ingresos.total.concepto, kind: "subtotal", ...breakdown.ingresos.total },
    { label: breakdown.ingresos.hospedaje.concepto, kind: "line", ...breakdown.ingresos.hospedaje },
    { label: breakdown.ingresos.rooftop.concepto, kind: "line", ...breakdown.ingresos.rooftop },
    { label: breakdown.ingresos.cafe.concepto, kind: "line", ...breakdown.ingresos.cafe },
    { label: breakdown.ingresos.spa.concepto, kind: "line", ...breakdown.ingresos.spa },

    { label: "COSTOS DIRECTOS", kind: "section" },
    ...breakdown.costosDirectos.lineas.map(
      (l): Row => ({ label: l.concepto, kind: "line", mensual: l.mensual, anual: l.anual, isDeduction: true }),
    ),
    { label: breakdown.costosDirectos.total.concepto, kind: "subtotal", ...breakdown.costosDirectos.total, isDeduction: true },

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

    { label: "COMERCIALIZACIÓN GEH SUITES", kind: "section" },
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

export function DetailedPyGTable({ breakdown, scenarioLabel }: DetailedPyGTableProps) {
  const rows = buildRows(breakdown);
  const ingresosBaseMensual = breakdown.ingresos.total.mensual;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-deep-700/50">
          Variables operativas — Escenario {scenarioLabel}
        </p>
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <StatPill label="% Ocupación" value={formatPercent(breakdown.assumptions.ocupacionPct)} />
          <StatPill label="ADR aplicado" value={formatCurrencyCOP(breakdown.assumptions.adr)} />
          <StatPill label="Room-noches / mes" value={formatNumber(breakdown.assumptions.roomNoches.mensual, 1)} />
          <StatPill label="Room-noches / año" value={formatNumber(breakdown.assumptions.roomNoches.anual, 1)} />
          <StatPill label="Habitaciones" value={formatNumber(NUMERO_HABITACIONES, 0)} />
          <StatPill label="Días operativos / mes" value={formatNumber(DIAS_OPERATIVOS_MES, 0)} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-arena-200 text-left">
              <th className="py-2 pr-2 text-xs font-semibold uppercase tracking-wide text-deep-700/50">Concepto</th>
              <th className="py-2 px-2 text-xs font-semibold uppercase tracking-wide text-deep-700/50 text-right">Mensual</th>
              <th className="py-2 px-2 text-xs font-semibold uppercase tracking-wide text-deep-700/50 text-right">Anual</th>
              <th className="py-2 pl-2 text-xs font-semibold uppercase tracking-wide text-deep-700/50 text-right">%</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              if (row.kind === "section") {
                return (
                  <tr key={`${row.label}-${i}`} className="bg-arena-50">
                    <td colSpan={4} className="py-1.5 px-2 text-xs font-bold uppercase tracking-wide text-deep-700/70">
                      {row.label}
                    </td>
                  </tr>
                );
              }

              const isSubtotal = row.kind === "subtotal";
              const isPercent = row.kind === "percent";
              const mensual = row.mensual ?? 0;
              const anual = row.anual ?? 0;
              // Las líneas de deducción se guardan como magnitud positiva; se muestran con signo "-".
              const isTrulyNegative = mensual < 0; // p. ej. Utilidad Bruta/EBITDA/Neta en escenario Pesimista
              const showMinus = row.isDeduction || isTrulyNegative;
              const valueColor = isTrulyNegative ? "text-danger-500" : row.isDeduction && !isSubtotal ? "text-dorado-700" : "";
              const pctOfIngresos = !isPercent && ingresosBaseMensual !== 0 ? Math.abs(mensual) / ingresosBaseMensual : null;

              return (
                <tr
                  key={`${row.label}-${i}`}
                  className={`border-b border-arena-100 ${isSubtotal ? "bg-arena-50 font-bold text-deep-900" : "text-deep-800"}`}
                >
                  <td className={`py-1.5 pr-2 ${!isSubtotal ? "pl-3" : ""}`}>{row.label}</td>
                  {isPercent ? (
                    <>
                      <td className="py-1.5 px-2 text-right text-deep-400">—</td>
                      <td className="py-1.5 px-2 text-right text-deep-400">—</td>
                    </>
                  ) : (
                    <>
                      <td className={`py-1.5 px-2 text-right tabular-nums whitespace-nowrap ${valueColor}`}>
                        {`${showMinus ? "−" : ""}${formatCurrencyCOP(Math.abs(mensual))}`}
                      </td>
                      <td className={`py-1.5 px-2 text-right tabular-nums whitespace-nowrap ${valueColor}`}>
                        {`${showMinus ? "−" : ""}${formatCurrencyCOP(Math.abs(anual))}`}
                      </td>
                    </>
                  )}
                  <td
                    className={`py-1.5 pl-2 text-right tabular-nums ${
                      isPercent ? "font-bold text-deep-900" : "text-deep-700/50"
                    }`}
                  >
                    {isPercent ? formatPercent(row.mensual ?? 0) : pctOfIngresos !== null ? formatPercent(pctOfIngresos) : ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-deep-700/50">
        La columna % muestra la participación de cada línea sobre el total de ingresos del periodo.
      </p>
    </div>
  );
}
