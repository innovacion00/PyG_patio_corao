"use client";

import { Plus, Trash2 } from "lucide-react";
import type { CostLine, CostLineModo } from "@/lib/finance/blank/types";
import { createId } from "@/lib/finance/blank/id";
import { formatCurrencyCOP } from "@/lib/finance/formatters";

interface CostLinesEditorProps {
  title: string;
  description?: string;
  lines: CostLine[];
  onChange: (lines: CostLine[]) => void;
  /** Ingreso por hospedaje mensual, base usada para calcular el monto de las líneas en modo "% de ingresos". */
  ingresosBaseMensual: number;
  idPrefix: string;
}

export function CostLinesEditor({
  title,
  description,
  lines,
  onChange,
  ingresosBaseMensual,
  idPrefix,
}: CostLinesEditorProps) {
  function updateLine(id: string, patch: Partial<CostLine>) {
    onChange(lines.map((line) => (line.id === id ? { ...line, ...patch } : line)));
  }

  function addLine() {
    onChange([
      ...lines,
      { id: createId(idPrefix), concepto: "Nueva línea", modo: "porcentaje", montoFijo: 0, pctSobreIngresos: 0 },
    ]);
  }

  function removeLine(id: string) {
    onChange(lines.filter((line) => line.id !== id));
  }

  return (
    <div className="rounded-2xl border border-arena-200 bg-white p-5 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-display text-base font-bold text-deep-900">{title}</p>
          {description && <p className="text-xs text-deep-700/50">{description}</p>}
        </div>
        <button
          type="button"
          onClick={addLine}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-arena-100 px-3 py-1.5 text-xs font-semibold text-deep-900 transition hover:bg-arena-200"
        >
          <Plus className="h-3.5 w-3.5" />
          Agregar línea
        </button>
      </div>

      {lines.length === 0 ? (
        <p className="rounded-lg border border-dashed border-arena-300 p-4 text-center text-sm text-deep-700/50">
          Sin líneas todavía.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {lines.map((line) => {
            const montoMensual = line.modo === "fijo" ? line.montoFijo : line.pctSobreIngresos * ingresosBaseMensual;
            return (
              <div key={line.id} className="flex flex-wrap items-center gap-2 rounded-lg bg-arena-50 p-2.5">
                <input
                  type="text"
                  value={line.concepto}
                  onChange={(e) => updateLine(line.id, { concepto: e.target.value })}
                  placeholder="Concepto"
                  className="min-w-[10rem] flex-1 rounded-lg border border-arena-200 bg-white px-3 py-2 text-sm text-deep-900"
                  aria-label="Concepto de la línea"
                />

                <div className="flex rounded-lg bg-arena-100 p-0.5">
                  {(["porcentaje", "fijo"] as CostLineModo[]).map((modo) => (
                    <button
                      key={modo}
                      type="button"
                      onClick={() => updateLine(line.id, { modo })}
                      className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                        line.modo === modo ? "bg-deep-900 text-white" : "text-deep-700/60"
                      }`}
                    >
                      {modo === "porcentaje" ? "%" : "Fijo"}
                    </button>
                  ))}
                </div>

                {line.modo === "fijo" ? (
                  <label className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="0"
                      step="100000"
                      value={line.montoFijo}
                      onChange={(e) => updateLine(line.id, { montoFijo: Number(e.target.value) || 0 })}
                      className="w-32 rounded-lg border border-arena-200 bg-white px-2 py-2 text-right text-sm tabular-nums text-deep-900"
                      aria-label={`Monto fijo mensual de ${line.concepto}`}
                    />
                    <span className="text-sm text-deep-700/60">COP</span>
                  </label>
                ) : (
                  <label className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={Number((line.pctSobreIngresos * 100).toFixed(2))}
                      onChange={(e) => updateLine(line.id, { pctSobreIngresos: (Number(e.target.value) || 0) / 100 })}
                      className="w-20 rounded-lg border border-arena-200 bg-white px-2 py-2 text-right text-sm tabular-nums text-deep-900"
                      aria-label={`% sobre ingresos de ${line.concepto}`}
                    />
                    <span className="text-sm text-deep-700/60">%</span>
                  </label>
                )}

                <span className="min-w-[7.5rem] text-right text-xs tabular-nums text-deep-700/50">
                  {formatCurrencyCOP(montoMensual)}/mes
                </span>

                <button
                  type="button"
                  onClick={() => removeLine(line.id)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-deep-700/40 transition hover:bg-danger-500/10 hover:text-danger-500"
                  aria-label={`Eliminar ${line.concepto}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
      <p className="text-xs text-deep-700/40">
        Cada línea puede ser un monto fijo mensual o un % del ingreso por hospedaje.
      </p>
    </div>
  );
}
