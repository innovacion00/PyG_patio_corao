"use client";

import { motion } from "framer-motion";
import type { ScenarioKey } from "@/lib/types";
import { SCENARIO_ORDER, SCENARIOS } from "@/lib/finance/constants";
import { formatPercent } from "@/lib/finance/formatters";

interface ScenarioSelectorProps {
  value: ScenarioKey;
  onChange: (scenario: ScenarioKey) => void;
  disabled?: boolean;
}

export function ScenarioSelector({ value, onChange, disabled }: ScenarioSelectorProps) {
  return (
    <div className={`grid grid-cols-3 gap-1 rounded-xl bg-arena-100 p-1 ${disabled ? "opacity-50" : ""}`}>
      {SCENARIO_ORDER.map((key) => {
        const scenario = SCENARIOS[key];
        const isActive = value === key;
        return (
          <button
            key={key}
            type="button"
            disabled={disabled}
            onClick={() => onChange(key)}
            aria-pressed={isActive}
            className="relative rounded-lg py-2.5 text-center transition-colors disabled:cursor-not-allowed"
          >
            {isActive && (
              <motion.span
                layoutId="scenario-highlight"
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
  );
}
