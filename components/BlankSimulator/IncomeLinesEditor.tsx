"use client";

import { Plus, Trash2 } from "lucide-react";
import type { IncomeLine } from "@/lib/finance/blank/types";
import { createId } from "@/lib/finance/blank/id";

interface IncomeLinesEditorProps {
  lines: IncomeLine[];
  onChange: (lines: IncomeLine[]) => void;
}

export function IncomeLinesEditor({ lines, onChange }: IncomeLinesEditorProps) {
  function updateLine(id: string, patch: Partial<IncomeLine>) {
    onChange(lines.map((line) => (line.id === id ? { ...line, ...patch } : line)));
  }

  function addLine() {
    onChange([...lines, { id: createId("ingreso"), concepto: "Nuevo ingreso", montoMensual: 0, activo: true }]);
  }

  function removeLine(id: string) {
    onChange(lines.filter((line) => line.id !== id));
  }

  return (
    <div className="rounded-2xl border border-arena-200 bg-white p-5 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-display text-base font-bold text-deep-900">Otros ingresos</p>
          <p className="text-xs text-deep-700/50">Rentas complementarias fijas (rooftop, café, spa, arriendos, etc.).</p>
        </div>
        <button
          type="button"
          onClick={addLine}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-arena-100 px-3 py-1.5 text-xs font-semibold text-deep-900 transition hover:bg-arena-200"
        >
          <Plus className="h-3.5 w-3.5" />
          Agregar ingreso
        </button>
      </div>

      {lines.length === 0 ? (
        <p className="rounded-lg border border-dashed border-arena-300 p-4 text-center text-sm text-deep-700/50">
          Sin ingresos adicionales todavía.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {lines.map((line) => (
            <div key={line.id} className="flex flex-wrap items-center gap-2 rounded-lg bg-arena-50 p-2.5">
              <input
                type="text"
                value={line.concepto}
                onChange={(e) => updateLine(line.id, { concepto: e.target.value })}
                placeholder="Concepto"
                className="min-w-[10rem] flex-1 rounded-lg border border-arena-200 bg-white px-3 py-2 text-sm text-deep-900"
                aria-label="Concepto del ingreso"
              />
              <label className="flex items-center gap-1.5">
                <span className="text-xs text-deep-700/60">COP/mes</span>
                <input
                  type="number"
                  min="0"
                  step="100000"
                  value={line.montoMensual}
                  onChange={(e) => updateLine(line.id, { montoMensual: Number(e.target.value) || 0 })}
                  className="w-32 rounded-lg border border-arena-200 bg-white px-2 py-2 text-right text-sm tabular-nums text-deep-900"
                  aria-label={`Monto mensual de ${line.concepto}`}
                />
              </label>
              <button
                type="button"
                onClick={() => removeLine(line.id)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-deep-700/40 transition hover:bg-danger-500/10 hover:text-danger-500"
                aria-label={`Eliminar ${line.concepto}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-deep-700/40">
        Se suman después de Costos Directos para llegar a la Utilidad Bruta, y se incluyen en el fee GEHsuites y la
        utilidad neta.
      </p>
    </div>
  );
}
