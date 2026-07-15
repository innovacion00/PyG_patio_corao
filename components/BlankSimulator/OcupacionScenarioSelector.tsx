"use client";

import { motion } from "framer-motion";
import { OCUPACION_SCENARIOS, OCUPACION_SCENARIO_ORDER } from "@/lib/finance/blank/constants";
import { formatPercent } from "@/lib/finance/formatters";

interface OcupacionScenarioSelectorProps {
  ocupacionPct: number;
  onChange: (ocupacionPct: number) => void;
}

export function OcupacionScenarioSelector({ ocupacionPct, onChange }: OcupacionScenarioSelectorProps) {
  const activeKey = OCUPACION_SCENARIO_ORDER.find((key) => OCUPACION_SCENARIOS[key].ocupacionPct === ocupacionPct);

  return (
    <div className="space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-deep-700/60">Escenario de ocupación</span>
      <div className="grid grid-cols-3 gap-1 rounded-xl bg-arena-100 p-1">
        {OCUPACION_SCENARIO_ORDER.map((key) => {
          const scenario = OCUPACION_SCENARIOS[key];
          const isActive = activeKey === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(scenario.ocupacionPct)}
              aria-pressed={isActive}
              className="relative rounded-lg py-2.5 text-center transition-colors"
            >
              {isActive && (
                <motion.span
                  layoutId="ocupacion-scenario-highlight"
                  className="absolute inset-0 rounded-lg bg-deep-900"
                  transition={{ type: "spring", stiffness: 350, damping: 32 }}
                />
              )}
              <span className={`relative text-sm font-semibold ${isActive ? "text-white" : "text-deep-700/70"}`}>
                {scenario.label}
                <span className="block text-xs font-normal opacity-70">{formatPercent(scenario.ocupacionPct)}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
