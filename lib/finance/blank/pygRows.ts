import type { BlankBreakdown } from "./types";

export type PyGRowKind = "section" | "line" | "subtotal" | "percent";

export interface PyGRow {
  label: string;
  kind: PyGRowKind;
  mensual?: number;
  anual?: number;
  /** Líneas de costo/gasto: se almacenan como magnitud positiva pero se muestran como deducción (signo "-"). */
  isDeduction?: boolean;
  /** Presente solo en líneas editables (costos directos, gastos operacionales, otros ingresos): habilita el toggle. */
  id?: string;
  activo?: boolean;
  /** mensual / ingresos totales mensuales — análisis vertical del PyG. Ausente en secciones y filas ya expresadas en %. */
  pctIngresos?: number;
  /** Presente solo en costos directos y gastos operacionales: % editable sobre el ingreso por hospedaje (fuente real del cálculo). */
  pctSobreIngresos?: number;
}

/** Filas de la tabla P&G resultante — compartidas entre la UI y la exportación a PDF. */
export function buildPyGRows(breakdown: BlankBreakdown): PyGRow[] {
  const ingresosTotalesMensual = breakdown.ingresoHospedaje.mensual + breakdown.otrosIngresos.total.mensual;
  const ingresoHospedajeMensual = breakdown.ingresoHospedaje.mensual;
  // Costos directos y gastos operacionales se calculan sobre el ingreso por hospedaje (no el total de ingresos) —
  // se recalcula siempre desde el monto real, así un monto fijo en COP también muestra su % equivalente.
  const pctSobreHospedaje = (mensual: number) => (ingresoHospedajeMensual !== 0 ? mensual / ingresoHospedajeMensual : 0);

  const rows: PyGRow[] = [
    { label: breakdown.ingresos.total.concepto, kind: "subtotal", ...breakdown.ingresos.total },
    { label: breakdown.ingresoHospedaje.concepto, kind: "line", ...breakdown.ingresoHospedaje },

    { label: "COSTOS DIRECTOS", kind: "section" },
    ...breakdown.costosDirectos.lineas.map(
      (l): PyGRow => ({
        label: l.concepto,
        kind: "line",
        mensual: l.mensual,
        anual: l.anual,
        isDeduction: true,
        id: l.id,
        activo: l.activo,
        pctSobreIngresos: pctSobreHospedaje(l.mensual),
      }),
    ),
    {
      label: breakdown.costosDirectos.total.concepto,
      kind: "subtotal",
      ...breakdown.costosDirectos.total,
      isDeduction: true,
    },

    { label: "OTROS INGRESOS", kind: "section" },
    ...breakdown.otrosIngresos.lineas.map(
      (l): PyGRow => ({
        label: l.concepto,
        kind: "line",
        mensual: l.mensual,
        anual: l.anual,
        id: l.id,
        activo: l.activo,
      }),
    ),
    { label: breakdown.otrosIngresos.total.concepto, kind: "subtotal", ...breakdown.otrosIngresos.total },

    { label: breakdown.utilidadBruta.concepto, kind: "subtotal", ...breakdown.utilidadBruta },

    { label: "GASTOS OPERACIONALES", kind: "section" },
    ...breakdown.gastosOperacionales.lineas.map(
      (l): PyGRow => ({
        label: l.concepto,
        kind: "line",
        mensual: l.mensual,
        anual: l.anual,
        isDeduction: true,
        id: l.id,
        activo: l.activo,
        pctSobreIngresos: pctSobreHospedaje(l.mensual),
      }),
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

  return rows.map((row) => {
    if (row.kind === "section" || row.kind === "percent") return row;
    const pctIngresos = ingresosTotalesMensual !== 0 ? (row.mensual ?? 0) / ingresosTotalesMensual : 0;
    return { ...row, pctIngresos };
  });
}
