"use client";

import { motion } from "framer-motion";
import { Building2, LineChart, ShieldCheck, Waves } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const REASONS = [
  {
    icon: Building2,
    title: "Operador especializado",
    description:
      "GEHsuites gestiona la operación diaria del hotel boutique: reservas, huéspedes, mantenimiento y estándar de servicio, para que tu inversión funcione sin que tengas que operarla.",
  },
  {
    icon: Waves,
    title: "Ingresos diversificados",
    description:
      "El proyecto no depende solo de habitaciones: rooftop, café y spa generan rentas complementarias fijas que estabilizan el flujo de caja mes a mes.",
  },
  {
    icon: LineChart,
    title: "Estructura de costos transparente",
    description:
      "Cada línea de costo directo y gasto operacional está documentada y disponible para revisión — sin cifras ocultas ni supuestos genéricos.",
  },
  {
    icon: ShieldCheck,
    title: "Escenarios con transparencia total",
    description:
      "Mostramos siempre el escenario Pesimista, incluso cuando implica utilidad negativa. Preferimos que decidas con información completa.",
  },
];

export function WhyInvest() {
  return (
    <section id="por-que-invertir" className="mx-auto max-w-6xl px-4 sm:px-6 py-14 sm:py-20 flex flex-col gap-8">
      <SectionHeading
        eyebrow="Por qué Patio Corao"
        title="Una inversión inmobiliaria turística con operación profesional"
        description="Patio Corao combina un activo boutique en zona de alta demanda turística con un operador especializado que profesionaliza cada fuente de ingreso."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {REASONS.map(({ icon: Icon, title, description }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="rounded-2xl border border-arena-200 bg-white p-5"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-arena-100">
              <Icon className="h-4 w-4 text-deep-700" />
            </span>
            <p className="mt-3 font-display text-base font-bold text-deep-900">{title}</p>
            <p className="mt-1.5 text-sm text-deep-700/70 leading-relaxed">{description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
