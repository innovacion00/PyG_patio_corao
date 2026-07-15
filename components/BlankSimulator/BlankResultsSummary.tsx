"use client";

import type { ComponentType } from "react";
import { TrendingUp, Wallet, Percent } from "lucide-react";
import type { BlankBreakdown } from "@/lib/finance/blank/types";
import { AnimatedCurrency } from "@/components/ui/AnimatedCurrency";
import { AnimatedPercent } from "@/components/ui/AnimatedPercent";
import { formatCurrencyCOP } from "@/lib/finance/formatters";

interface BlankResultsSummaryProps {
  breakdown: BlankBreakdown;
  horizonte: "mensual" | "anual";
}

function marginTone(pct: number): string {
  if (pct < 0) return "text-danger-500";
  if (pct < 0.1) return "text-warning-500";
  return "text-forest-500";
}

interface StatTileProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
  emphasis?: boolean;
}

function StatTile({ icon: Icon, label, children, emphasis }: StatTileProps) {
  return (
    <div className={`rounded-xl border border-arena-200 bg-white p-4 ${emphasis ? "bg-arena-50" : ""}`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-arena-100">
        <Icon className="h-4 w-4 text-deep-700" />
      </span>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-deep-700/60">{label}</p>
      <div className="mt-1 font-bold tabular-nums text-deep-900 text-lg whitespace-nowrap">{children}</div>
    </div>
  );
}

export function BlankResultsSummary({ breakdown, horizonte }: BlankResultsSummaryProps) {
  const utilidadNeta = horizonte === "mensual" ? breakdown.utilidadNeta.mensual : breakdown.utilidadNeta.anual;
  const otraUtilidad = horizonte === "mensual" ? breakdown.utilidadNeta.anual : breakdown.utilidadNeta.mensual;
  const ebitda = horizonte === "mensual" ? breakdown.ebitda.mensual : breakdown.ebitda.anual;
  const utilidadTone = utilidadNeta < 0 ? "text-danger-500" : "text-forest-500";
  const ebitdaTone = ebitda < 0 ? "text-danger-500" : "text-deep-900";

  return (
    <div className="grid grid-cols-2 gap-3">
      <StatTile icon={TrendingUp} label={`Utilidad neta ${horizonte}`} emphasis>
        <span className={utilidadTone}>
          <AnimatedCurrency value={utilidadNeta} />
        </span>
        <span className="mt-1 block text-xs font-normal text-deep-700/50">
          {horizonte === "mensual" ? "Anual" : "Mensual"}: {formatCurrencyCOP(otraUtilidad)}
        </span>
      </StatTile>

      <StatTile icon={Wallet} label={`EBITDA ${horizonte}`}>
        <span className={ebitdaTone}>
          <AnimatedCurrency value={ebitda} />
        </span>
      </StatTile>

      <StatTile icon={Percent} label="Margen EBITDA">
        <span className={marginTone(breakdown.margenEbitdaPct)}>
          <AnimatedPercent value={breakdown.margenEbitdaPct} />
        </span>
      </StatTile>

      <StatTile icon={Percent} label="Margen neto">
        <span className={marginTone(breakdown.margenNetoPct)}>
          <AnimatedPercent value={breakdown.margenNetoPct} />
        </span>
      </StatTile>
    </div>
  );
}
