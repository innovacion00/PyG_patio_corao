"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SCENARIO_ORDER, SCENARIOS } from "@/lib/finance/constants";
import { getScenarioBreakdown } from "@/lib/finance/engine";
import { formatCurrencyCOPCompact, formatCurrencyCOP } from "@/lib/finance/formatters";

interface ScenarioComparisonChartProps {
  horizonte: "mensual" | "anual";
}

export function ScenarioComparisonChart({ horizonte }: ScenarioComparisonChartProps) {
  const data = SCENARIO_ORDER.map((key) => {
    const breakdown = getScenarioBreakdown(key);
    const pick = (item: { mensual: number; anual: number }) => (horizonte === "mensual" ? item.mensual : item.anual);
    return {
      escenario: SCENARIOS[key].label,
      "Ingresos Totales": pick(breakdown.ingresos.total),
      EBITDA: pick(breakdown.ebitda),
      "Utilidad Neta": pick(breakdown.utilidadNeta),
    };
  });

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e7d6b3" vertical={false} />
          <XAxis dataKey="escenario" tick={{ fill: "#0e2036", fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
          <YAxis
            tickFormatter={(v) => formatCurrencyCOPCompact(v)}
            tick={{ fill: "#78552f", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={64}
          />
          <Tooltip
            formatter={(value) => formatCurrencyCOP(Number(value))}
            contentStyle={{ borderRadius: 10, border: "1px solid #e7d6b3", boxShadow: "var(--shadow-soft)", fontSize: 13 }}
          />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
          <Bar dataKey="Ingresos Totales" fill="#66d8de" radius={[4, 4, 0, 0]} />
          <Bar dataKey="EBITDA" fill="#cf9c54" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Utilidad Neta" fill="#1f5c4d" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
