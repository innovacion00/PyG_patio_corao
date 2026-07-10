"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Mail, Phone, User, Coins, ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface FormState {
  nombre: string;
  email: string;
  telefono: string;
  monto: string;
}

const INITIAL_STATE: FormState = { nombre: "", email: "", telefono: "", monto: "" };

export function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // Sin backend: captura local de la intención de inversión.
    // Listo para conectar a un endpoint / CRM sin refactor mayor.
    setSubmitted(true);
  }

  return (
    <section id="contacto" className="bg-deep-900 text-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-14 sm:py-20 flex flex-col gap-8">
        <SectionHeading
          tone="dark"
          title="¿Listo para simular tu inversión con un asesor?"
          description="Déjanos tus datos y un asesor de GEHsuites te contactará para resolver tus dudas y formalizar tu inversión en Patio Corao."
        />

        <div className="mx-auto w-full max-w-xl rounded-2xl bg-white p-6 sm:p-7 text-deep-900">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 py-8 text-center"
            >
              <CheckCircle2 className="h-12 w-12 text-forest-500" />
              <p className="font-display text-xl font-bold">¡Gracias, {form.nombre.split(" ")[0] || "inversionista"}!</p>
              <p className="text-sm text-deep-700/70">
                Un asesor de GEHsuites se pondrá en contacto contigo muy pronto.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="space-y-1.5">
                <label htmlFor="nombre" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-deep-700/60">
                  <User className="h-3.5 w-3.5 text-dorado-600" /> Nombre completo
                </label>
                <input
                  id="nombre"
                  required
                  value={form.nombre}
                  onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                  className="w-full rounded-lg border border-arena-300 px-4 py-2.5 text-sm outline-none transition focus:border-dorado-500 focus:ring-2 focus:ring-dorado-100"
                  placeholder="Nombre y apellido"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-deep-700/60">
                  <Mail className="h-3.5 w-3.5 text-dorado-600" /> Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full rounded-lg border border-arena-300 px-4 py-2.5 text-sm outline-none transition focus:border-dorado-500 focus:ring-2 focus:ring-dorado-100"
                  placeholder="tucorreo@ejemplo.com"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="telefono" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-deep-700/60">
                  <Phone className="h-3.5 w-3.5 text-dorado-600" /> Teléfono
                </label>
                <input
                  id="telefono"
                  type="tel"
                  required
                  value={form.telefono}
                  onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))}
                  className="w-full rounded-lg border border-arena-300 px-4 py-2.5 text-sm outline-none transition focus:border-dorado-500 focus:ring-2 focus:ring-dorado-100"
                  placeholder="+57 300 000 0000"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="monto" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-deep-700/60">
                  <Coins className="h-3.5 w-3.5 text-dorado-600" /> Monto a invertir (COP)
                </label>
                <input
                  id="monto"
                  required
                  value={form.monto}
                  onChange={(e) => setForm((f) => ({ ...f, monto: e.target.value }))}
                  className="w-full rounded-lg border border-arena-300 px-4 py-2.5 text-sm outline-none transition focus:border-dorado-500 focus:ring-2 focus:ring-dorado-100"
                  placeholder="$ 100.000.000"
                />
              </div>

              <button
                type="submit"
                className="group mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-dorado-400 px-6 py-3 text-sm font-bold uppercase tracking-wide text-deep-950 transition hover:bg-dorado-300"
              >
                Quiero invertir
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
