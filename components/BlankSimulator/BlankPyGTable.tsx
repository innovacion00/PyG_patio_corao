"use client";

import type { BlankBreakdown } from "@/lib/finance/blank/types";
import { buildPyGRows } from "@/lib/finance/blank/pygRows";
import { formatCurrencyCOP, formatNumber, formatPercent } from "@/lib/finance/formatters";

interface BlankPyGTableProps {
  breakdown: BlankBreakdown;
  ocupacionPct: number;
  diasOperativosMes: number;
  adrPromedio: number;
  onToggleLine: (id: string) => void;
  onEditPct: (id: string, pct: number) => void;
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-arena-200 bg-white px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-deep-700/50">{label}</p>
      <p className="text-sm font-bold text-deep-900">{value}</p>
    </div>
  );
}

export function BlankPyGTable({
  breakdown,
  ocupacionPct,
  diasOperativosMes,
  adrPromedio,
  onToggleLine,
  onEditPct,
}: BlankPyGTableProps) {
  const rows = buildPyGRows(breakdown);

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
              <th className="py-2 px-2 text-xs font-semibold uppercase tracking-wide text-deep-700/50 text-right">Anual</th>
              <th className="py-2 px-2 text-xs font-semibold uppercase tracking-wide text-deep-700/50 text-right">%</th>
              <th className="py-2 pl-2 text-xs font-semibold uppercase tracking-wide text-deep-700/50 text-center">Activo</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              if (row.kind === "section") {
                return (
                  <tr key={`${row.label}-${i}`} className="bg-arena-50">
                    <td colSpan={5} className="py-1.5 px-2 text-xs font-bold uppercase tracking-wide text-deep-700/70">
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
              const isInactive = row.activo === false;

              return (
                <tr
                  key={`${row.label}-${i}`}
                  className={`border-b border-arena-100 ${isSubtotal ? "bg-arena-50 font-bold text-deep-900" : "text-deep-800"} ${isInactive ? "opacity-40" : ""}`}
                >
                  <td className={`py-1.5 pr-2 ${!isSubtotal ? "pl-3" : ""}`}>{row.label}</td>
                  {isPercent ? (
                    <td colSpan={3} className="py-1.5 px-2 text-right font-bold tabular-nums text-deep-900">
                      {formatPercent(row.mensual ?? 0)}
                    </td>
                  ) : (
                    <>
                      <td className={`py-1.5 px-2 text-right tabular-nums whitespace-nowrap ${valueColor}`}>
                        {`${showMinus ? "−" : ""}${formatCurrencyCOP(Math.abs(mensual))}`}
                      </td>
                      <td className={`py-1.5 px-2 text-right tabular-nums whitespace-nowrap ${valueColor}`}>
                        {`${showMinus ? "−" : ""}${formatCurrencyCOP(Math.abs(anual))}`}
                      </td>
                      <td className="py-1.5 px-2 text-right">
                        {row.pctSobreIngresos !== undefined ? (
                          <label className="flex items-center justify-end gap-1">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={Number((row.pctSobreIngresos * 100).toFixed(2))}
                              onChange={(e) => onEditPct(row.id!, (Number(e.target.value) || 0) / 100)}
                              className="w-16 rounded border border-arena-200 bg-white px-1.5 py-1 text-right text-xs tabular-nums text-deep-900"
                              aria-label={`% sobre ingresos de ${row.label}`}
                            />
                            <span className="text-xs text-deep-700/50">%</span>
                          </label>
                        ) : (
                          <span className="tabular-nums whitespace-nowrap text-deep-700/60">
                            {`${showMinus && (row.pctIngresos ?? 0) > 0 ? "−" : ""}${formatPercent(Math.abs(row.pctIngresos ?? 0))}`}
                          </span>
                        )}
                      </td>
                    </>
                  )}
                  <td className="py-1.5 pl-2 text-center">
                    {row.id ? (
                      <input
                        type="checkbox"
                        checked={row.activo ?? true}
                        onChange={() => onToggleLine(row.id!)}
                        className="h-4 w-4 accent-dorado-500"
                        aria-label={`Activar/desactivar ${row.label}`}
                      />
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
