"use client";

import { Coins } from "lucide-react";
import { formatCurrencyCOP } from "@/lib/finance/formatters";

interface InvestmentInputProps {
  value: number;
  onChange: (value: number) => void;
}

const QUICK_AMOUNTS = [50_000_000, 100_000_000, 250_000_000, 500_000_000];

export function InvestmentInput({ value, onChange }: InvestmentInputProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="monto-invertido" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-deep-700/60">
        <Coins className="h-3.5 w-3.5 text-dorado-600" />
        Monto a invertir
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-deep-500 font-medium">$</span>
        <input
          id="monto-invertido"
          type="text"
          inputMode="numeric"
          value={new Intl.NumberFormat("es-CO").format(value)}
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, "");
            onChange(raw ? Number(raw) : 0);
          }}
          className="w-full rounded-lg border border-arena-300 bg-white py-2.5 pl-7 pr-4 text-base font-bold text-deep-900 outline-none transition focus:border-dorado-500 focus:ring-2 focus:ring-dorado-100"
        />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {QUICK_AMOUNTS.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => onChange(amount)}
            className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${
              value === amount
                ? "bg-deep-900 text-white"
                : "bg-arena-100 text-deep-700 hover:bg-arena-200"
            }`}
          >
            {formatCurrencyCOP(amount)}
          </button>
        ))}
      </div>
    </div>
  );
}
