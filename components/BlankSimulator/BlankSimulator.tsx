"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { CostLine, FeeConfig, IncomeLine, RoomType } from "@/lib/finance/blank/types";
import {
  DEFAULT_DIAS_OPERATIVOS_MES,
  DEFAULT_FEE_CONFIG,
  DEFAULT_OCUPACION_PCT,
  DEFAULT_ROOM_TYPES,
} from "@/lib/finance/blank/constants";
import { calcularADRPromedio, computeBlankBreakdown } from "@/lib/finance/blank/engine";
import { RoomTypesEditor } from "./RoomTypesEditor";
import { OcupacionScenarioSelector } from "./OcupacionScenarioSelector";
import { IncomeLinesEditor } from "./IncomeLinesEditor";
import { CostLinesEditor } from "./CostLinesEditor";
import { FeeConfigEditor } from "./FeeConfigEditor";
import { BlankResultsSummary } from "./BlankResultsSummary";
import { BlankPyGTable } from "./BlankPyGTable";
import { formatPercent } from "@/lib/finance/formatters";

export function BlankSimulator() {
  const [rooms, setRooms] = useState<RoomType[]>(DEFAULT_ROOM_TYPES);
  const [ocupacionPct, setOcupacionPct] = useState(DEFAULT_OCUPACION_PCT);
  const [diasOperativosMes, setDiasOperativosMes] = useState(DEFAULT_DIAS_OPERATIVOS_MES);
  const [otrosIngresos, setOtrosIngresos] = useState<IncomeLine[]>([]);
  const [costosDirectos, setCostosDirectos] = useState<CostLine[]>([]);
  const [gastosOperacionales, setGastosOperacionales] = useState<CostLine[]>([]);
  const [feeConfig, setFeeConfig] = useState<FeeConfig>(DEFAULT_FEE_CONFIG);
  const [gastoFinancieroMensual, setGastoFinancieroMensual] = useState(0);
  const [horizonte, setHorizonte] = useState<"mensual" | "anual">("anual");

  const breakdown = useMemo(
    () =>
      computeBlankBreakdown({
        rooms,
        ocupacionPct,
        diasOperativosMes,
        otrosIngresos,
        costosDirectos,
        gastosOperacionales,
        feeConfig,
        gastoFinancieroMensual,
      }),
    [
      rooms,
      ocupacionPct,
      diasOperativosMes,
      otrosIngresos,
      costosDirectos,
      gastosOperacionales,
      feeConfig,
      gastoFinancieroMensual,
    ],
  );

  const adrPromedio = useMemo(() => calcularADRPromedio(rooms), [rooms]);

  return (
    <section id="simulador" className="mx-auto max-w-6xl px-4 sm:px-6 py-14 sm:py-20 scroll-mt-20">
      <div className="flex flex-col gap-2 mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-dorado-600">Simulador GEHsuites</span>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-deep-900">
          Arma tu propio modelo de rentabilidad
        </h2>
        <p className="max-w-2xl text-sm sm:text-base text-deep-700/70">
          Define tus tipos de habitación, su cantidad y ADR, ajusta la ocupación y los costos, y descubre en tiempo
          real la utilidad, el EBITDA y los márgenes estimados.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 rounded-2xl border border-arena-200 bg-white p-5 space-y-5 h-fit"
        >
          <RoomTypesEditor rooms={rooms} onChange={setRooms} />

          <OcupacionScenarioSelector ocupacionPct={ocupacionPct} onChange={setOcupacionPct} />

          <div className="grid grid-cols-2 gap-2.5">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-deep-700/60">
                Ajuste fino ({formatPercent(ocupacionPct)})
              </span>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={Math.round(ocupacionPct * 100)}
                onChange={(e) => setOcupacionPct(Number(e.target.value) / 100)}
                className="accent-dorado-500"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-deep-700/60">Días operativos/mes</span>
              <input
                type="number"
                min="0"
                max="31"
                value={diasOperativosMes}
                onChange={(e) => setDiasOperativosMes(Number(e.target.value) || 0)}
                className="rounded-lg border border-arena-200 px-3 py-2 text-sm tabular-nums text-deep-900"
              />
            </label>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-deep-700/60">Horizonte</p>
            <div className="flex rounded-lg bg-arena-100 p-1">
              {(["mensual", "anual"] as const).map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHorizonte(h)}
                  className={`flex-1 rounded-md py-2 text-sm font-semibold capitalize transition ${
                    horizonte === h ? "bg-deep-900 text-white" : "text-deep-700/60"
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-3"
        >
          <BlankResultsSummary breakdown={breakdown} horizonte={horizonte} />
        </motion.div>
      </div>

      <div className="mt-5">
        <IncomeLinesEditor lines={otrosIngresos} onChange={setOtrosIngresos} />
      </div>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <CostLinesEditor
          title="Costos directos"
          description="Costos asociados directamente a la operación (comisiones, insumos, servicios)."
          lines={costosDirectos}
          onChange={setCostosDirectos}
          ingresosBaseMensual={breakdown.ingresoHospedaje.mensual}
          idPrefix="costo-directo"
        />
        <CostLinesEditor
          title="Gastos operacionales"
          description="Gastos administrativos y de soporte a la operación (nómina, honorarios, etc.)."
          lines={gastosOperacionales}
          onChange={setGastosOperacionales}
          ingresosBaseMensual={breakdown.ingresoHospedaje.mensual}
          idPrefix="gasto-operacional"
        />
      </div>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <FeeConfigEditor feeConfig={feeConfig} onChange={setFeeConfig} />

        <div className="rounded-2xl border border-arena-200 bg-white p-5 space-y-3 h-fit">
          <p className="font-display text-base font-bold text-deep-900">Gasto financiero</p>
          <p className="text-xs text-deep-700/60">Servicio de deuda u otro gasto financiero mensual, si aplica.</p>
          <label className="flex flex-col gap-1 max-w-xs">
            <span className="text-xs font-semibold uppercase tracking-wide text-deep-700/50">Monto mensual (COP)</span>
            <input
              type="number"
              min="0"
              step="100000"
              value={gastoFinancieroMensual}
              onChange={(e) => setGastoFinancieroMensual(Number(e.target.value) || 0)}
              className="rounded-lg border border-arena-200 px-3 py-2 text-sm tabular-nums text-deep-900"
            />
          </label>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-5 rounded-2xl border border-arena-200 bg-white p-5"
      >
        <p className="font-display text-base font-bold text-deep-900">P&amp;G resultante</p>
        <p className="mb-4 text-xs text-deep-700/50">
          Se recalcula en tiempo real a partir de tus tipos de habitación, ocupación y líneas de costo/gasto.
        </p>
        <BlankPyGTable
          breakdown={breakdown}
          ocupacionPct={ocupacionPct}
          diasOperativosMes={diasOperativosMes}
          adrPromedio={adrPromedio}
        />
      </motion.div>

      <p className="mt-6 rounded-xl border border-arena-200 bg-arena-100 p-4 text-xs text-deep-700/70 text-center">
        Simulador de plantilla en blanco — las cifras dependen enteramente de lo que configures. No representa ningún
        proyecto específico ni constituye garantía de rentabilidad.
      </p>
    </section>
  );
}
