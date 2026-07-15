"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import type { LineOverrides, ScenarioKey, SimulatorInputs } from "@/lib/types";
import { SCENARIOS } from "@/lib/finance/constants";
import { applyLineOverrides, buildCustomBreakdown, getScenarioBreakdown } from "@/lib/finance/engine";
import { ScenarioSelector } from "./ScenarioSelector";
import { CustomModeSliders } from "./CustomModeSliders";
import { ResultsSummaryCard } from "./ResultsSummaryCard";
import { DetailedPyGTable } from "./DetailedPyGTable";
import { ScenarioComparisonChart } from "./ScenarioComparisonChart";
import { ScenarioCompareCards } from "./ScenarioCompareCards";
import { GEHSuitesFeeExplainer } from "@/components/GEHSuitesFeeExplainer";

const DEFAULT_INPUTS: SimulatorInputs = {
  scenario: "conservador",
  customMode: false,
  customOcupacionPct: SCENARIOS.conservador.ocupacionPct,
  customAdr: SCENARIOS.conservador.adr,
  horizonte: "anual",
};

export function Simulator() {
  const [inputs, setInputs] = useState<SimulatorInputs>(DEFAULT_INPUTS);
  const [lineOverrides, setLineOverrides] = useState<LineOverrides>({});

  const breakdown = useMemo(() => {
    if (inputs.customMode) {
      return buildCustomBreakdown(inputs.customOcupacionPct, inputs.customAdr);
    }
    return getScenarioBreakdown(inputs.scenario);
  }, [inputs.customMode, inputs.customOcupacionPct, inputs.customAdr, inputs.scenario]);

  // Los ajustes manuales de costos/gastos parten de cero cada vez que cambia el
  // escenario base (oficial o personalizado): no se mezclan entre escenarios.
  useEffect(() => {
    setLineOverrides({});
  }, [breakdown]);

  const effectiveBreakdown = useMemo(
    () => applyLineOverrides(breakdown, lineOverrides),
    [breakdown, lineOverrides],
  );

  function toggleLine(concepto: string) {
    setLineOverrides((prev) => {
      const current = prev[concepto] ?? { enabled: true, pctOverride: null };
      return { ...prev, [concepto]: { ...current, enabled: !current.enabled } };
    });
  }

  function setLinePct(concepto: string, pct: number | null) {
    setLineOverrides((prev) => {
      const current = prev[concepto] ?? { enabled: true, pctOverride: null };
      return { ...prev, [concepto]: { ...current, pctOverride: pct } };
    });
  }

  function updateScenario(scenario: ScenarioKey) {
    setInputs((prev) => ({ ...prev, scenario }));
  }

  return (
    <section id="simulador" className="mx-auto max-w-6xl px-4 sm:px-6 py-14 sm:py-20 scroll-mt-20">
      <div className="flex flex-col gap-2 mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-dorado-600">Simulador</span>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-deep-900">
          ¿Cuánto podrías ganar en Patio Corao?
        </h2>
        <p className="max-w-2xl text-sm sm:text-base text-deep-700/70">
          Elige un escenario y descubre en tiempo real la utilidad, el EBITDA y los márgenes estimados del hotel.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Panel de controles */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 rounded-2xl border border-arena-200 bg-white p-5 space-y-5 h-fit"
        >
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-deep-700/60">Escenario de ocupación</p>
            <ScenarioSelector value={inputs.scenario} onChange={updateScenario} disabled={inputs.customMode} />
          </div>

          <label className="flex items-center justify-between gap-3 rounded-lg bg-arena-50 px-3 py-2.5 cursor-pointer">
            <span className="flex items-center gap-2 text-sm font-medium text-deep-900">
              <SlidersHorizontal className="h-4 w-4 text-dorado-600" />
              Ajustar mi propio escenario
            </span>
            <input
              type="checkbox"
              checked={inputs.customMode}
              onChange={(e) => setInputs((prev) => ({ ...prev, customMode: e.target.checked }))}
              className="h-4 w-4 accent-dorado-500"
            />
          </label>

          {inputs.customMode && (
            <CustomModeSliders
              ocupacionPct={inputs.customOcupacionPct}
              adr={inputs.customAdr}
              onOcupacionChange={(v) => setInputs((prev) => ({ ...prev, customOcupacionPct: v }))}
              onAdrChange={(v) => setInputs((prev) => ({ ...prev, customAdr: v }))}
            />
          )}

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-deep-700/60">Horizonte</p>
            <div className="flex rounded-lg bg-arena-100 p-1">
              {(["mensual", "anual"] as const).map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setInputs((prev) => ({ ...prev, horizonte: h }))}
                  className={`flex-1 rounded-md py-2 text-sm font-semibold capitalize transition ${
                    inputs.horizonte === h ? "bg-deep-900 text-white" : "text-deep-700/60"
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Panel de resultados */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-3"
        >
          <ResultsSummaryCard breakdown={effectiveBreakdown} horizonte={inputs.horizonte} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-5 rounded-2xl border border-arena-200 bg-white p-5"
      >
        <p className="font-display text-base font-bold text-deep-900">Desglose del P&amp;G — detalle completo</p>
        <p className="mb-4 text-xs text-deep-700/50">
          Misma estructura que el Estado P&amp;G del modelo, línea por línea. Activa o desactiva costos/gastos y
          ajusta su % sobre ingresos para explorar variaciones sobre el escenario.
        </p>
        <DetailedPyGTable
          breakdown={effectiveBreakdown}
          scenarioLabel={inputs.customMode ? "Personalizado" : SCENARIOS[inputs.scenario].label}
          overrides={lineOverrides}
          onToggleLine={toggleLine}
          onPctChange={setLinePct}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-5"
      >
        <GEHSuitesFeeExplainer activeBreakdown={effectiveBreakdown} variant="compact" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-5 rounded-2xl border border-arena-200 bg-white p-5"
      >
        <p className="font-display text-base font-bold text-deep-900 mb-1">Comparador de escenarios</p>
        <p className="text-sm text-deep-700/60 mb-4">
          Pesimista, conservador y optimista, con ADR y ocupación reales de cada uno — referencia de transparencia
          del modelo oficial.
        </p>
        <ScenarioCompareCards activeScenario={inputs.customMode ? null : inputs.scenario} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-5 rounded-2xl border border-arena-200 bg-white p-5"
      >
        <p className="font-display text-base font-bold text-deep-900 mb-1">Ingresos, EBITDA y utilidad neta</p>
        <p className="text-sm text-deep-700/60 mb-4">
          Comparativo de los 3 escenarios oficiales, siempre visible como referencia de transparencia.
        </p>
        <ScenarioComparisonChart horizonte={inputs.horizonte} />
      </motion.div>

      <p className="mt-6 rounded-xl border border-arena-200 bg-arena-100 p-4 text-xs text-deep-700/70 text-center">
        Cifras basadas en el modelo financiero P&amp;G de hospedaje de Patio Corao, operado por GEHsuites. No constituyen
        garantía de rentabilidad. El escenario personalizado es una estimación interpolada y no forma parte del modelo
        oficial.
      </p>
    </section>
  );
}
