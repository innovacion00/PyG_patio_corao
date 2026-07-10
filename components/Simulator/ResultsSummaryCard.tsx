"use client";

import type { ComponentType } from "react";
import { Wallet, TrendingUp, Timer, PiggyBank, Percent } from "lucide-react";
import type { FinancialBreakdown, InvestorResults } from "@/lib/types";
import { AnimatedCurrency } from "@/components/ui/AnimatedCurrency";
import { AnimatedPercent } from "@/components/ui/AnimatedPercent";
import { formatCurrencyCOP, formatNumber } from "@/lib/finance/formatters";

interface ResultsSummaryCardProps {
  breakdown: FinancialBreakdown;
  investor: InvestorResults;
  montoInvertido: number;
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
    <div
      className={`rounded-xl border border-arena-200 bg-white p-4 ${emphasis ? "sm:col-span-2 bg-arena-50" : ""}`}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-arena-100">
        <Icon className="h-4 w-4 text-deep-700" />
      </span>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-deep-700/60">{label}</p>
      <div className={`mt-1 font-bold tabular-nums text-deep-900 ${emphasis ? "text-2xl sm:text-3xl" : "text-lg"}`}>
        {children}
      </div>
    </div>
  );
}

export function ResultsSummaryCard({ breakdown, investor, montoInvertido, horizonte }: ResultsSummaryCardProps) {
  const utilidadInversionista =
    horizonte === "mensual" ? investor.utilidadInversionistaMensual : investor.utilidadInversionistaAnual;
  const otraUtilidad =
    horizonte === "mensual" ? investor.utilidadInversionistaAnual : investor.utilidadInversionistaMensual;
  const utilidadTone = utilidadInversionista < 0 ? "text-danger-500" : "text-forest-500";

  return (
    <div className="space-y-3">
      {breakdown.isInterpolated && (
        <span className="inline-block rounded-full bg-dorado-100 px-3 py-1 text-xs font-semibold text-dorado-700">
          Estimación interpolada
        </span>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatTile icon={Wallet} label="Monto invertido">
          {formatCurrencyCOP(montoInvertido)}
        </StatTile>

        <StatTile icon={PiggyBank} label="Participación">
          <AnimatedPercent value={investor.participacionPct} />
        </StatTile>

        <StatTile icon={TrendingUp} label={`Utilidad neta ${horizonte}`} emphasis>
          <span className={utilidadTone}>
            <AnimatedCurrency value={utilidadInversionista} />
          </span>
          <span className="mt-1 block text-xs font-normal text-deep-700/50">
            {horizonte === "mensual" ? "Anual" : "Mensual"}: {formatCurrencyCOP(otraUtilidad)}
          </span>
        </StatTile>

        <StatTile icon={Percent} label="ROI anual">
          <AnimatedPercent value={investor.roiAnualPct} />
        </StatTile>

        <StatTile icon={Timer} label="Payback estimado">
          {investor.paybackAnios !== null ? `${formatNumber(investor.paybackAnios, 1)} años` : "No aplica"}
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
    </div>
  );
}
