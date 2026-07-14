"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="bg-gradient-to-b from-deep-950 to-deep-900 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-14 sm:pt-20 pb-16 sm:pb-20">
        <motion.span
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/80"
        >
          Inversión inmobiliaria · Renta corta · Hospitalidad boutique
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display mt-6 max-w-2xl text-4xl sm:text-5xl font-bold leading-tight text-balance"
        >
          Simulador de rentabilidad
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 max-w-xl text-base sm:text-lg text-white/70 text-pretty"
        >
          Proyecta tu utilidad neta estimada, mensual y anual, según cuánto inviertes en Patio Corao — un hotel
          boutique operado por GEHsuites con ingresos por hospedaje, café y spa.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center gap-4"
        >
          <a
            href="#simulador"
            className="group inline-flex items-center gap-2 rounded-full bg-dorado-400 px-6 py-3 text-sm font-bold uppercase tracking-wide text-deep-950 transition hover:bg-dorado-300"
          >
            Simular mi rentabilidad
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </a>
          <span className="text-sm text-white/60">8 habitaciones boutique · Operación hotelera GEHsuites</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 text-xs text-white/40"
        >
          Modelo financiero estimado sujeto a variaciones comerciales, operativas y de mercado.
        </motion.p>
      </div>
    </section>
  );
}
