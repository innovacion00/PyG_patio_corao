import type { BlankBreakdown } from "./types";

export type PyGRowKind = "section" | "line" | "subtotal" | "percent";

export interface PyGRow {
  label: string;
  kind: PyGRowKind;
  mensual?: number;
  anual?: number;
  /** Líneas de costo/gasto: se almacenan como magnitud positiva pero se muestran como deducción (signo "-"). */
  isDeduction?: boolean;
}

/** Filas de la tabla P&G resultante — compartidas entre la UI y la exportación a PDF. */
export function buildPyGRows(breakdown: BlankBreakdown): PyGRow[] {
  return [
    { label: breakdown.ingresos.total.concepto, kind: "subtotal", ...breakdown.ingresos.total },
    { label: breakdown.ingresoHospedaje.concepto, kind: "line", ...breakdown.ingresoHospedaje },

    { label: "COSTOS DIRECTOS", kind: "section" },
    ...breakdown.costosDirectos.lineas.map(
      (l): PyGRow => ({ label: l.concepto, kind: "line", mensual: l.mensual, anual: l.anual, isDeduction: true }),
    ),
    {
      label: breakdown.costosDirectos.total.concepto,
      kind: "subtotal",
      ...breakdown.costosDirectos.total,
      isDeduction: true,
    },

    { label: "OTROS INGRESOS", kind: "section" },
    ...breakdown.otrosIngresos.lineas.map(
      (l): PyGRow => ({ label: l.concepto, kind: "line", mensual: l.mensual, anual: l.anual }),
    ),
    { label: breakdown.otrosIngresos.total.concepto, kind: "subtotal", ...breakdown.otrosIngresos.total },

    { label: breakdown.utilidadBruta.concepto, kind: "subtotal", ...breakdown.utilidadBruta },

    { label: "GASTOS OPERACIONALES", kind: "section" },
    ...breakdown.gastosOperacionales.lineas.map(
      (l): PyGRow => ({ label: l.concepto, kind: "line", mensual: l.mensual, anual: l.anual, isDeduction: true }),
    ),
    {
      label: breakdown.gastosOperacionales.total.concepto,
      kind: "subtotal",
      ...breakdown.gastosOperacionales.total,
      isDeduction: true,
    },

    { label: breakdown.ebitda.concepto, kind: "subtotal", ...breakdown.ebitda },
    { label: "Margen EBITDA", kind: "percent", mensual: breakdown.margenEbitdaPct, anual: breakdown.margenEbitdaPct },

    { label: "GASTOS NO OPERACIONALES", kind: "section" },
    { label: breakdown.gastoFinanciero.concepto, kind: "line", ...breakdown.gastoFinanciero, isDeduction: true },

    { label: "COMERCIALIZACIÓN GEHSUITES", kind: "section" },
    { label: breakdown.feeGEH.fijo.concepto, kind: "line", ...breakdown.feeGEH.fijo, isDeduction: true },
    { label: breakdown.feeGEH.variable.concepto, kind: "line", ...breakdown.feeGEH.variable, isDeduction: true },
    { label: breakdown.feeGEH.total.concepto, kind: "subtotal", ...breakdown.feeGEH.total, isDeduction: true },

    { label: breakdown.utilidadNeta.concepto, kind: "subtotal", ...breakdown.utilidadNeta },
    { label: "Margen Neto", kind: "percent", mensual: breakdown.margenNetoPct, anual: breakdown.margenNetoPct },
  ];
}
