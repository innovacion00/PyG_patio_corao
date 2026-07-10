"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getScenarioBreakdown } from "@/lib/finance/engine";
import { formatCurrencyCOP, formatPercent } from "@/lib/finance/formatters";

export function FAQ() {
  const pesimista = getScenarioBreakdown("pesimista");

  const FAQS = [
    {
      question: "¿Qué pasa si la ocupación es menor a la esperada?",
      answer: (
        <>
          Lo mostramos con total transparencia: en el escenario Pesimista (50% de ocupación, ADR{" "}
          {formatCurrencyCOP(490_000)}), el proyecto genera una utilidad neta de{" "}
          <span className="font-semibold text-danger-500">
            {formatCurrencyCOP(pesimista.utilidadNeta.mensual)}/mes
          </span>{" "}
          (margen neto de {formatPercent(pesimista.margenNetoPct)}). No ocultamos este escenario porque forma parte
          de la información que necesitas para decidir con criterio.
        </>
      ),
    },
    {
      question: "¿Qué cubre el fee de GEHsuites?",
      answer:
        "El fee fijo mensual cubre la operación integral del hotel: gestión de reservas, atención a huéspedes, coordinación de mantenimiento y estándar de marca. El fee variable escalonado (2%, 3% o 4% según el nivel de ingresos) alinea los incentivos de GEHsuites con el desempeño del proyecto: a mayor ingreso, mayor fee, pero también mayor utilidad para el inversionista.",
    },
    {
      question: "¿Cómo se calcula el ROI?",
      answer:
        "El ROI anual se calcula dividiendo la utilidad neta que te corresponde según tu participación (monto invertido / valor total del proyecto) entre el monto que invertiste. El simulador lo recalcula en tiempo real según el escenario y el monto que elijas.",
    },
    {
      question: "¿Cuándo se distribuyen las utilidades?",
      answer:
        "Las utilidades se distribuyen conforme al calendario y política de distribución acordada en el vehículo de inversión del proyecto (mensual, trimestral o anual según se defina contractualmente). Este simulador estima la utilidad generada por el modelo operativo; la mecánica exacta de distribución se formaliza en el acuerdo de inversión.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 sm:px-6 py-14 sm:py-20 flex flex-col gap-6">
      <SectionHeading eyebrow="Preguntas frecuentes" title="Resolviendo tus dudas" />

      <div className="flex flex-col gap-2.5">
        {FAQS.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={item.question} className="rounded-xl border border-arena-200 bg-white overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-3.5 text-left"
              >
                <span className="text-sm font-semibold text-deep-900">{item.question}</span>
                <ChevronDown className={`h-4 w-4 shrink-0 text-deep-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && <div className="px-5 pb-4 text-sm text-deep-700/70 leading-relaxed">{item.answer}</div>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
