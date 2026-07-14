import type { FinancialBreakdown, InvestorResults, LineItem, LineOverrides, ScenarioKey } from "../types";
import {
  DIAS_OPERATIVOS_MES,
  FEE_FIJO_GEH_MENSUAL,
  FINANCIAL_BREAKDOWNS,
  INGRESO_CAFE_MENSUAL,
  INGRESO_ROOFTOP_MENSUAL,
  INGRESO_SPA_MENSUAL,
  NUMERO_HABITACIONES,
  TRAMOS_FEE_VARIABLE,
  VALOR_TOTAL_PROYECTO,
} from "./constants";

/**
 * Motor de cálculo financiero — funciones puras, sin dependencias de UI.
 *
 * Los 3 escenarios oficiales (pesimista/conservador/optimista) NO se
 * recalculan aquí: se leen directamente de `FINANCIAL_BREAKDOWNS`, que es
 * la fuente de verdad tomada del modelo real. Este motor se usa únicamente
 * para el modo "personalizado", cuando el usuario ajusta ocupación/ADR
 * fuera de los 3 valores fijos, interpolando proporcionalmente sobre el
 * escenario Conservador (base de calibración).
 */

// ---------------------------------------------------------------------------
// 1) Room-noches e ingreso por hospedaje
// ---------------------------------------------------------------------------
export function roomNoches(
  ocupacionPct: number,
  numeroHabitaciones: number = NUMERO_HABITACIONES,
  diasOperativosMes: number = DIAS_OPERATIVOS_MES,
): number {
  return ocupacionPct * numeroHabitaciones * diasOperativosMes;
}

export function ingresoHospedajeMensual(ocupacionPct: number, adr: number): number {
  return roomNoches(ocupacionPct) * adr;
}

// ---------------------------------------------------------------------------
// 2) Ingresos totales (hospedaje + rentas complementarias fijas)
// ---------------------------------------------------------------------------
export function ingresosTotalesMensual(ingresoHospedaje: number): number {
  return ingresoHospedaje + INGRESO_ROOFTOP_MENSUAL + INGRESO_CAFE_MENSUAL + INGRESO_SPA_MENSUAL;
}

// ---------------------------------------------------------------------------
// 6) Fee GEHsuites — tabla de tramos sobre ingresos totales mensuales
// ---------------------------------------------------------------------------
export function tasaTramoFeeVariable(ingresosTotalesMes: number): number {
  for (const tramo of TRAMOS_FEE_VARIABLE) {
    if (ingresosTotalesMes >= tramo.min && ingresosTotalesMes <= tramo.max) {
      return tramo.tasa;
    }
  }
  // Fuera de los tramos tabulados: por debajo del piso no hay fee variable;
  // por encima del techo se mantiene el tramo más alto (extrapolación conservadora).
  const ultimoTramo = TRAMOS_FEE_VARIABLE[TRAMOS_FEE_VARIABLE.length - 1];
  if (ingresosTotalesMes > ultimoTramo.max) return ultimoTramo.tasa;
  return 0;
}

export function feeVariableGEHMensual(ingresosTotalesMes: number): number {
  return ingresosTotalesMes * tasaTramoFeeVariable(ingresosTotalesMes);
}

export function totalFeeGEHMensual(ingresosTotalesMes: number): number {
  return FEE_FIJO_GEH_MENSUAL + feeVariableGEHMensual(ingresosTotalesMes);
}

// ---------------------------------------------------------------------------
// Interpolación de líneas de costo/gasto para el modo personalizado,
// proporcional al cambio en ingresoHospedaje respecto al escenario Conservador.
// ---------------------------------------------------------------------------
function escalarLineas(lineas: LineItem[], factor: number): LineItem[] {
  return lineas.map((linea) => ({
    concepto: linea.concepto,
    mensual: linea.mensual * factor,
    anual: linea.mensual * factor * 12,
  }));
}

function sumarLineas(lineas: LineItem[]): number {
  return lineas.reduce((acc, linea) => acc + linea.mensual, 0);
}

function anualizar(concepto: string, mensual: number): LineItem {
  return { concepto, mensual, anual: mensual * 12 };
}

/**
 * Construye el desglose financiero para el modo "personalizado", interpolando
 * sobre el escenario Conservador (base de calibración) según la nota de la
 * sección 3 del modelo. Los escenarios oficiales NO pasan por esta función.
 */
export function buildCustomBreakdown(ocupacionPct: number, adr: number): FinancialBreakdown {
  const base = FINANCIAL_BREAKDOWNS.conservador;

  const ingresoHospedaje = ingresoHospedajeMensual(ocupacionPct, adr);
  const ingresosTotales = ingresosTotalesMensual(ingresoHospedaje);

  // Factor de escalamiento de costos/gastos: cambio en ingresoHospedaje vs. Conservador.
  const factorCostos = ingresoHospedaje / base.ingresos.hospedaje.mensual;
  // Factor de escalamiento del gasto financiero: proporcional a ingresos totales.
  const factorIngresos = ingresosTotales / base.ingresos.total.mensual;

  const costosDirectosLineas = escalarLineas(base.costosDirectos.lineas, factorCostos);
  const totalCostosDirectos = sumarLineas(costosDirectosLineas);

  const utilidadBrutaMensual = ingresosTotales - totalCostosDirectos;

  const gastosOperacionalesLineas = escalarLineas(base.gastosOperacionales.lineas, factorCostos);
  const totalGastosOperacionales = sumarLineas(gastosOperacionalesLineas);

  const ebitdaMensual = utilidadBrutaMensual - totalGastosOperacionales;
  const margenEbitdaPct = ingresosTotales !== 0 ? ebitdaMensual / ingresosTotales : 0;

  const gastoFinancieroMensual = base.gastoFinanciero.mensual * factorIngresos;

  const feeVariable = feeVariableGEHMensual(ingresosTotales);
  const totalFeeGEH = FEE_FIJO_GEH_MENSUAL + feeVariable;

  const utilidadNetaMensual = ebitdaMensual - gastoFinancieroMensual - totalFeeGEH;
  const margenNetoPct = ingresosTotales !== 0 ? utilidadNetaMensual / ingresosTotales : 0;

  const roomNochesMensual = roomNoches(ocupacionPct);

  return {
    scenario: "conservador" as ScenarioKey, // referencia de calibración; UI etiqueta como interpolado
    isInterpolated: true,
    assumptions: {
      ocupacionPct,
      adr,
      roomNoches: { concepto: "Room-noches Ocupadas", mensual: roomNochesMensual, anual: roomNochesMensual * 12 },
    },
    ingresos: {
      hospedaje: { concepto: "Ingresos por Venta de Hospedaje", mensual: ingresoHospedaje, anual: ingresoHospedaje * 12 },
      rooftop: { concepto: "Ingreso Rooftop (mensual)", mensual: INGRESO_ROOFTOP_MENSUAL, anual: INGRESO_ROOFTOP_MENSUAL * 12 },
      cafe: { concepto: "Ingreso Local Café (mensual, arriendo)", mensual: INGRESO_CAFE_MENSUAL, anual: INGRESO_CAFE_MENSUAL * 12 },
      spa: { concepto: "Ingreso SPA (mensual, arriendo)", mensual: INGRESO_SPA_MENSUAL, anual: INGRESO_SPA_MENSUAL * 12 },
      total: { concepto: "INGRESOS", mensual: ingresosTotales, anual: ingresosTotales * 12 },
    },
    costosDirectos: {
      lineas: costosDirectosLineas,
      total: { concepto: "TOTAL COSTOS DIRECTOS", mensual: totalCostosDirectos, anual: totalCostosDirectos * 12 },
    },
    utilidadBruta: anualizar("UTILIDAD BRUTA", utilidadBrutaMensual),
    gastosOperacionales: {
      lineas: gastosOperacionalesLineas,
      total: { concepto: "TOTAL GASTOS OPERACIONALES", mensual: totalGastosOperacionales, anual: totalGastosOperacionales * 12 },
    },
    ebitda: anualizar("EBITDA (UTILIDAD OPERACIONAL)", ebitdaMensual),
    margenEbitdaPct,
    gastoFinanciero: anualizar("Gasto Financiero (Bancario)", gastoFinancieroMensual),
    feeGEH: {
      fijo: anualizar("Gasto Fee Fijo Mensual GEH Suites", FEE_FIJO_GEH_MENSUAL),
      variable: anualizar("Gasto Fee Variable GEH Suites (% s/ventas)", feeVariable),
      total: anualizar("TOTAL FEE GEH SUITES", totalFeeGEH),
      tasaTramoPct: tasaTramoFeeVariable(ingresosTotales),
    },
    utilidadNeta: anualizar("UTILIDAD / PÉRDIDA NETA", utilidadNetaMensual),
    margenNetoPct,
  };
}

/** Devuelve el desglose oficial (no recalculado) para un escenario fijo. */
export function getScenarioBreakdown(scenario: ScenarioKey): FinancialBreakdown {
  return FINANCIAL_BREAKDOWNS[scenario];
}

// ---------------------------------------------------------------------------
// 7) Ajustes manuales de costos/gastos (tabla "Desglose del P&G — detalle
//    completo"): activar/desactivar una línea o sobrescribir su % sobre
//    ingresos totales, con recálculo en cascada de todos los subtotales.
// ---------------------------------------------------------------------------
function resolveLine(line: LineItem, overrides: LineOverrides, ingresosTotalMensual: number): LineItem {
  const override = overrides[line.concepto];
  if (!override) return line;
  if (!override.enabled) return { ...line, mensual: 0, anual: 0 };
  if (override.pctOverride !== null) {
    const mensual = override.pctOverride * ingresosTotalMensual;
    return { ...line, mensual, anual: mensual * 12 };
  }
  return line;
}

export function applyLineOverrides(breakdown: FinancialBreakdown, overrides: LineOverrides): FinancialBreakdown {
  if (Object.keys(overrides).length === 0) return breakdown;

  const ingresosTotalMensual = breakdown.ingresos.total.mensual;
  const resolve = (line: LineItem) => resolveLine(line, overrides, ingresosTotalMensual);

  const costosDirectosLineas = breakdown.costosDirectos.lineas.map(resolve);
  const totalCostosDirectos = sumarLineas(costosDirectosLineas);

  const gastosOperacionalesLineas = breakdown.gastosOperacionales.lineas.map(resolve);
  const totalGastosOperacionales = sumarLineas(gastosOperacionalesLineas);

  const utilidadBrutaMensual = ingresosTotalMensual - totalCostosDirectos;
  const ebitdaMensual = utilidadBrutaMensual - totalGastosOperacionales;
  const margenEbitdaPct = ingresosTotalMensual !== 0 ? ebitdaMensual / ingresosTotalMensual : 0;

  const feeFijo = resolve(breakdown.feeGEH.fijo);
  const feeVariable = resolve(breakdown.feeGEH.variable);
  const totalFeeGEH = feeFijo.mensual + feeVariable.mensual;
  const tasaTramoPct = ingresosTotalMensual !== 0 ? feeVariable.mensual / ingresosTotalMensual : 0;

  const gastoFinanciero = resolve(breakdown.gastoFinanciero);

  const utilidadNetaMensual = ebitdaMensual - gastoFinanciero.mensual - totalFeeGEH;
  const margenNetoPct = ingresosTotalMensual !== 0 ? utilidadNetaMensual / ingresosTotalMensual : 0;

  return {
    ...breakdown,
    costosDirectos: {
      lineas: costosDirectosLineas,
      total: anualizar(breakdown.costosDirectos.total.concepto, totalCostosDirectos),
    },
    utilidadBruta: anualizar(breakdown.utilidadBruta.concepto, utilidadBrutaMensual),
    gastosOperacionales: {
      lineas: gastosOperacionalesLineas,
      total: anualizar(breakdown.gastosOperacionales.total.concepto, totalGastosOperacionales),
    },
    ebitda: anualizar(breakdown.ebitda.concepto, ebitdaMensual),
    margenEbitdaPct,
    gastoFinanciero,
    feeGEH: {
      fijo: feeFijo,
      variable: feeVariable,
      total: anualizar(breakdown.feeGEH.total.concepto, totalFeeGEH),
      tasaTramoPct,
    },
    utilidadNeta: anualizar(breakdown.utilidadNeta.concepto, utilidadNetaMensual),
    margenNetoPct,
  };
}

// ---------------------------------------------------------------------------
// 8) Rentabilidad del inversionista (pro-rata sobre el monto invertido)
// ---------------------------------------------------------------------------
export function participacionInversionista(montoInvertido: number, valorTotalProyecto: number = VALOR_TOTAL_PROYECTO): number {
  if (valorTotalProyecto <= 0) return 0;
  return montoInvertido / valorTotalProyecto;
}

export function calcInvestorResults(breakdown: FinancialBreakdown, montoInvertido: number): InvestorResults {
  const participacionPct = participacionInversionista(montoInvertido);
  const utilidadInversionistaAnual = breakdown.utilidadNeta.anual * participacionPct;
  const utilidadInversionistaMensual = breakdown.utilidadNeta.mensual * participacionPct;

  const roiAnualPct = montoInvertido > 0 ? utilidadInversionistaAnual / montoInvertido : 0;
  const paybackAnios = utilidadInversionistaAnual > 0 ? montoInvertido / utilidadInversionistaAnual : null;

  return {
    participacionPct,
    utilidadInversionistaMensual,
    utilidadInversionistaAnual,
    roiAnualPct,
    paybackAnios,
  };
}
