"use client";

import { motion } from "framer-motion";
import { ArrowRight, BedDouble, Percent, TrendingUp } from "lucide-react";

const STEPS = [
  { icon: BedDouble, text: "Define tus tipos de habitación, cantidad y ADR" },
  { icon: Percent, text: "Ajusta ocupación, costos y gastos" },
  { icon: TrendingUp, text: "Obtén tu P&G, EBITDA y utilidad neta al instante" },
];

export function HeroV2() {
  return (
    <section className="bg-arena-50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 pt-14 sm:pt-20 pb-16 sm:pb-20 lg:grid-cols-5 lg:items-center">
        <div className="lg:col-span-3">
          <motion.span
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-deep-900/15 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-deep-700/70"
          >
            Herramienta GEHsuites · Simulador de rentabilidad hotelera
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display mt-6 max-w-xl text-4xl sm:text-6xl font-bold leading-[1.05] text-deep-900 text-balance"
          >
            Modela la rentabilidad de cualquier proyecto hotelero
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 max-w-lg text-base sm:text-lg text-deep-700/70 text-pretty"
          >
            Una plantilla de GEHsuites: crea tus propios tipos de habitación, asígnales cantidad y ADR, y
            proyecta la utilidad neta estimada según tus supuestos de ocupación y costos.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <a
              href="#simulador"
              className="group inline-flex items-center gap-2 rounded-full bg-deep-900 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-deep-800"
            >
              Empezar a simular
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </a>
            <span className="text-sm text-deep-700/60">Sin datos precargados · 100% configurable</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2 rounded-2xl border border-arena-200 bg-white p-5 shadow-soft-lg"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-deep-700/50">Cómo funciona</p>
          <div className="mt-3 flex flex-col divide-y divide-arena-100">
            {STEPS.map(({ icon: Icon, text }, i) => (
              <div key={text} className="flex items-center gap-3 py-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-arena-100 text-xs font-bold text-deep-700">
                  {i + 1}
                </span>
                <Icon className="h-4 w-4 shrink-0 text-dorado-600" />
                <span className="text-sm text-deep-700/80">{text}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-deep-700/40">Ideal para evaluar nuevos proyectos antes de operarlos.</p>
        </motion.div>
      </div>
    </section>
  );
}
