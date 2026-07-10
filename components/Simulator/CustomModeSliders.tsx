"use client";

import { formatCurrencyCOP, formatPercent } from "@/lib/finance/formatters";

interface CustomModeSlidersProps {
  ocupacionPct: number;
  adr: number;
  onOcupacionChange: (value: number) => void;
  onAdrChange: (value: number) => void;
}

export function CustomModeSliders({ ocupacionPct, adr, onOcupacionChange, onAdrChange }: CustomModeSlidersProps) {
  return (
    <div className="rounded-xl border border-dorado-200 bg-dorado-50 p-4 space-y-4">
      <p className="text-xs text-dorado-800">
        Ajusta tu propio escenario — los resultados serán una{" "}
        <span className="font-semibold">estimación interpolada</span>, no parte del modelo oficial.
      </p>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="ocupacion-slider" className="text-xs font-semibold uppercase tracking-wide text-deep-700/70">
            % Ocupación
          </label>
          <span className="text-sm font-bold text-deep-900">{formatPercent(ocupacionPct)}</span>
        </div>
        <input
          id="ocupacion-slider"
          type="range"
          min={0.2}
          max={0.95}
          step={0.01}
          value={ocupacionPct}
          onChange={(e) => onOcupacionChange(Number(e.target.value))}
          className="w-full accent-dorado-500"
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="adr-slider" className="text-xs font-semibold uppercase tracking-wide text-deep-700/70">
            ADR (tarifa promedio)
          </label>
          <span className="text-sm font-bold text-deep-900">{formatCurrencyCOP(adr)}</span>
        </div>
        <input
          id="adr-slider"
          type="range"
          min={350_000}
          max={950_000}
          step={5_000}
          value={adr}
          onChange={(e) => onAdrChange(Number(e.target.value))}
          className="w-full accent-dorado-500"
        />
      </div>
    </div>
  );
}
