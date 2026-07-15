"use client";

import { HandCoins, Plus, Trash2 } from "lucide-react";
import type { FeeConfig, FeeTramo } from "@/lib/finance/blank/types";
import { formatCurrencyCOPCompact } from "@/lib/finance/formatters";

interface FeeConfigEditorProps {
  feeConfig: FeeConfig;
  onChange: (feeConfig: FeeConfig) => void;
}

export function FeeConfigEditor({ feeConfig, onChange }: FeeConfigEditorProps) {
  function updateTramo(index: number, patch: Partial<FeeTramo>) {
    const tramos = feeConfig.tramos.map((tramo, i) => (i === index ? { ...tramo, ...patch } : tramo));
    onChange({ ...feeConfig, tramos });
  }

  function addTramo() {
    const last = feeConfig.tramos[feeConfig.tramos.length - 1];
    const min = last ? last.max + 1 : 0;
    onChange({ ...feeConfig, tramos: [...feeConfig.tramos, { min, max: min + 50_000_000, tasa: 0.03 }] });
  }

  function removeTramo(index: number) {
    onChange({ ...feeConfig, tramos: feeConfig.tramos.filter((_, i) => i !== index) });
  }

  return (
    <div className="rounded-2xl border border-arena-200 bg-white p-5 space-y-4">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-arena-100">
          <HandCoins className="h-4 w-4 text-deep-700" />
        </span>
        <div>
          <p className="font-display text-base font-bold text-deep-900">Fee GEHsuites</p>
          <p className="text-xs text-deep-700/60">Fee fijo mensual + variable escalonado sobre ingresos</p>
        </div>
      </div>

      <label className="flex flex-col gap-1 max-w-xs">
        <span className="text-xs font-semibold uppercase tracking-wide text-deep-700/50">Fee fijo mensual (COP)</span>
        <input
          type="number"
          min="0"
          step="100000"
          value={feeConfig.feeFijoMensual}
          onChange={(e) => onChange({ ...feeConfig, feeFijoMensual: Number(e.target.value) || 0 })}
          className="rounded-lg border border-arena-200 px-3 py-2 text-sm tabular-nums text-deep-900"
        />
      </label>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-deep-700/50">
            Tramos del fee variable (sobre ingresos totales mensuales)
          </p>
          <button
            type="button"
            onClick={addTramo}
            className="inline-flex items-center gap-1.5 rounded-lg bg-arena-100 px-3 py-1.5 text-xs font-semibold text-deep-900 transition hover:bg-arena-200"
          >
            <Plus className="h-3.5 w-3.5" />
            Agregar tramo
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {feeConfig.tramos.map((tramo, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2 rounded-lg bg-arena-50 p-2.5">
              <label className="flex items-center gap-1.5">
                <span className="text-xs text-deep-700/50">Desde</span>
                <input
                  type="number"
                  min="0"
                  value={tramo.min}
                  onChange={(e) => updateTramo(i, { min: Number(e.target.value) || 0 })}
                  className="w-28 rounded-lg border border-arena-200 bg-white px-2 py-1.5 text-right text-sm tabular-nums text-deep-900"
                  aria-label={`Tramo ${i + 1}: ingreso mínimo`}
                />
              </label>
              <label className="flex items-center gap-1.5">
                <span className="text-xs text-deep-700/50">Hasta</span>
                <input
                  type="number"
                  min="0"
                  value={tramo.max}
                  onChange={(e) => updateTramo(i, { max: Number(e.target.value) || 0 })}
                  className="w-28 rounded-lg border border-arena-200 bg-white px-2 py-1.5 text-right text-sm tabular-nums text-deep-900"
                  aria-label={`Tramo ${i + 1}: ingreso máximo`}
                />
              </label>
              <label className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={Number((tramo.tasa * 100).toFixed(2))}
                  onChange={(e) => updateTramo(i, { tasa: (Number(e.target.value) || 0) / 100 })}
                  className="w-16 rounded-lg border border-arena-200 bg-white px-2 py-1.5 text-right text-sm tabular-nums text-deep-900"
                  aria-label={`Tramo ${i + 1}: tasa`}
                />
                <span className="text-sm text-deep-700/60">%</span>
              </label>
              <span className="text-xs text-deep-700/40">
                {formatCurrencyCOPCompact(tramo.min)} – {formatCurrencyCOPCompact(tramo.max)}
              </span>
              <button
                type="button"
                onClick={() => removeTramo(i)}
                className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-deep-700/40 transition hover:bg-danger-500/10 hover:text-danger-500"
                aria-label={`Eliminar tramo ${i + 1}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
