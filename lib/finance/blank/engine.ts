import type { LineItem } from "@/lib/types";
import type {
  BlankBreakdown,
  CostLine,
  CostToggleableLineItem,
  FeeConfig,
  FeeTramo,
  IncomeLine,
  RoomType,
  ToggleableLineItem,
} from "./types";

/**
 * Motor de cálculo del simulador en blanco GEHsuites — funciones puras, sin
 * dependencias de UI. A diferencia del modelo Patio Corao, aquí no hay cifras
 * fijas: todo se deriva de los tipos de habitación y líneas de costo/gasto
 * que define el usuario.
 */

function anualizar(concepto: string, mensual: number): LineItem {
  return { concepto, mensual, anual: mensual * 12 };
}

/** Suma solo las líneas activas — las desactivadas se conservan en la tabla pero no afectan el PyG. */
function sumarActivas(lineas: ToggleableLineItem[]): number {
  return lineas.reduce((acc, linea) => acc + (linea.activo ? linea.mensual : 0), 0);
}

export function calcularIngresoHospedajeMensual(
  rooms: RoomType[],
  ocupacionPct: number,
  diasOperativosMes: number,
): number {
  return rooms.reduce((acc, room) => acc + room.cantidad * room.adr * ocupacionPct * diasOperativosMes, 0);
}

export function calcularRoomNochesMensual(rooms: RoomType[], ocupacionPct: number, diasOperativosMes: number): number {
  return rooms.reduce((acc, room) => acc + room.cantidad * ocupacionPct * diasOperativosMes, 0);
}

/** ADR promedio ponderado por cantidad de habitaciones de cada tipo. */
export function calcularADRPromedio(rooms: RoomType[]): number {
  const totalHabitaciones = rooms.reduce((acc, room) => acc + room.cantidad, 0);
  if (totalHabitaciones === 0) return 0;
  const sumaPonderada = rooms.reduce((acc, room) => acc + room.cantidad * room.adr, 0);
  return sumaPonderada / totalHabitaciones;
}

function tasaTramoFeeVariable(ingresosMes: number, tramos: FeeTramo[]): number {
  for (const tramo of tramos) {
    if (ingresosMes >= tramo.min && ingresosMes <= tramo.max) return tramo.tasa;
  }
  const ultimoTramo = tramos[tramos.length - 1];
  if (ultimoTramo && ingresosMes > ultimoTramo.max) return ultimoTramo.tasa;
  return 0;
}

function lineasDesdeCostLines(costLines: CostLine[], ingresosBaseMensual: number): CostToggleableLineItem[] {
  return costLines.map((linea) => {
    const mensual = linea.modo === "fijo" ? linea.montoFijo : linea.pctSobreIngresos * ingresosBaseMensual;
    return {
      id: linea.id,
      concepto: linea.concepto,
      mensual,
      anual: mensual * 12,
      activo: linea.activo,
      modo: linea.modo,
      pctSobreIngresos: linea.pctSobreIngresos,
    };
  });
}

function lineasDesdeIncomeLines(incomeLines: IncomeLine[]): ToggleableLineItem[] {
  return incomeLines.map((linea) => ({ id: linea.id, ...anualizar(linea.concepto, linea.montoMensual), activo: linea.activo }));
}

interface ComputeBlankBreakdownParams {
  rooms: RoomType[];
  ocupacionPct: number;
  diasOperativosMes: number;
  otrosIngresos: IncomeLine[];
  costosDirectos: CostLine[];
  gastosOperacionales: CostLine[];
  feeConfig: FeeConfig;
  gastoFinancieroMensual: number;
}

export function computeBlankBreakdown(params: ComputeBlankBreakdownParams): BlankBreakdown {
  const {
    rooms,
    ocupacionPct,
    diasOperativosMes,
    otrosIngresos,
    costosDirectos,
    gastosOperacionales,
    feeConfig,
    gastoFinancieroMensual,
  } = params;

  const ingresoHospedajeMensual = calcularIngresoHospedajeMensual(rooms, ocupacionPct, diasOperativosMes);
  const roomNochesMensual = calcularRoomNochesMensual(rooms, ocupacionPct, diasOperativosMes);

  const otrosIngresosLineas = lineasDesdeIncomeLines(otrosIngresos);
  const totalOtrosIngresosMensual = sumarActivas(otrosIngresosLineas);

  // Costos Directos y Gastos Operacionales se calculan (en modo "%") solo sobre
  // el ingreso por hospedaje: Otros Ingresos es un rubro aparte que se suma
  // después de Costos Directos, no una base para calcular costos/gastos.
  const costosDirectosLineas = lineasDesdeCostLines(costosDirectos, ingresoHospedajeMensual);
  const totalCostosDirectosMensual = sumarActivas(costosDirectosLineas);

  // Otros Ingresos se suma justo después de Costos Directos para llegar a la Utilidad Bruta.
  const utilidadBrutaMensual = ingresoHospedajeMensual - totalCostosDirectosMensual + totalOtrosIngresosMensual;

  const ingresosTotalesMensual = ingresoHospedajeMensual + totalOtrosIngresosMensual;

  const gastosOperacionalesLineas = lineasDesdeCostLines(gastosOperacionales, ingresoHospedajeMensual);
  const totalGastosOperacionalesMensual = sumarActivas(gastosOperacionalesLineas);

  const ebitdaMensual = utilidadBrutaMensual - totalGastosOperacionalesMensual;
  const margenEbitdaPct = ingresosTotalesMensual !== 0 ? ebitdaMensual / ingresosTotalesMensual : 0;

  const tasaTramoPct = tasaTramoFeeVariable(ingresosTotalesMensual, feeConfig.tramos);
  const feeVariableMensual = ingresosTotalesMensual * tasaTramoPct;
  const totalFeeGEHMensual = feeConfig.feeFijoMensual + feeVariableMensual;

  const utilidadNetaMensual = ebitdaMensual - gastoFinancieroMensual - totalFeeGEHMensual;
  const margenNetoPct = ingresosTotalesMensual !== 0 ? utilidadNetaMensual / ingresosTotalesMensual : 0;

  return {
    roomNoches: anualizar("Room-noches ocupadas", roomNochesMensual),
    ingresoHospedaje: anualizar("Ingresos por Hospedaje", ingresoHospedajeMensual),
    otrosIngresos: {
      lineas: otrosIngresosLineas,
      total: anualizar("TOTAL OTROS INGRESOS", totalOtrosIngresosMensual),
    },
    ingresos: { total: anualizar("INGRESOS", ingresoHospedajeMensual) },
    costosDirectos: {
      lineas: costosDirectosLineas,
      total: anualizar("TOTAL COSTOS DIRECTOS", totalCostosDirectosMensual),
    },
    utilidadBruta: anualizar("UTILIDAD BRUTA", utilidadBrutaMensual),
    gastosOperacionales: {
      lineas: gastosOperacionalesLineas,
      total: anualizar("TOTAL GASTOS OPERACIONALES", totalGastosOperacionalesMensual),
    },
    ebitda: anualizar("EBITDA (UTILIDAD OPERACIONAL)", ebitdaMensual),
    margenEbitdaPct,
    gastoFinanciero: anualizar("Gasto Financiero", gastoFinancieroMensual),
    feeGEH: {
      fijo: anualizar("Fee Fijo Mensual GEHsuites", feeConfig.feeFijoMensual),
      variable: anualizar("Fee Variable GEHsuites (% s/ingresos)", feeVariableMensual),
      total: anualizar("TOTAL FEE GEHSUITES", totalFeeGEHMensual),
      tasaTramoPct,
    },
    utilidadNeta: anualizar("UTILIDAD / PÉRDIDA NETA", utilidadNetaMensual),
    margenNetoPct,
  };
}
