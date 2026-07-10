import type { FinancialBreakdown, ScenarioAssumptions, ScenarioKey } from "../types";

/**
 * Fuente de verdad del modelo financiero P&G de Hospedaje — Patio Corao.
 * Todos los valores en COP. NO recalcular: estos son los 3 escenarios
 * oficiales del modelo real (hoja "PyG Hospedaje", tabla "PATIO CORAO —
 * Estado P y G") y deben mostrarse tal cual, con las mismas etiquetas de
 * concepto usadas en esa tabla.
 */

// ---------------------------------------------------------------------------
// Parámetros operativos del inventario (configurables si crece el proyecto)
// ---------------------------------------------------------------------------
export const NUMERO_HABITACIONES = 8;
export const DIAS_OPERATIVOS_MES = 30;

// Rentas complementarias fijas (no varían por ocupación/ADR)
export const INGRESO_ROOFTOP_MENSUAL = 10_000_000;
export const INGRESO_CAFE_MENSUAL = 6_000_000;
export const INGRESO_SPA_MENSUAL = 1_500_000;

// Comercialización GEHsuites
export const FEE_FIJO_GEH_MENSUAL = 3_000_000;

/**
 * Tramos del fee variable de GEHsuites, sobre ingresos totales mensuales.
 * Fuente: sección 2 del modelo (tabla de tramos del Fee Variable).
 */
export const TRAMOS_FEE_VARIABLE = [
  { min: 58_000_000, max: 80_000_000, tasa: 0.02 },
  { min: 81_000_000, max: 110_000_000, tasa: 0.03 },
  { min: 111_000_000, max: 190_000_000, tasa: 0.04 },
] as const;

/**
 * Valor total del proyecto / valuación usada para calcular la participación
 * pro-rata del inversionista. No viene en la hoja financiera original:
 * se expone aquí como parámetro fácilmente editable.
 */
export const VALOR_TOTAL_PROYECTO = 3_000_000_000;

// ---------------------------------------------------------------------------
// Supuestos de cada escenario (% ocupación y ADR)
// ---------------------------------------------------------------------------
export const SCENARIOS: Record<ScenarioKey, ScenarioAssumptions> = {
  pesimista: { key: "pesimista", label: "Pesimista", ocupacionPct: 0.5, adr: 490_000 },
  conservador: { key: "conservador", label: "Conservador", ocupacionPct: 0.68, adr: 700_000 },
  optimista: { key: "optimista", label: "Optimista", ocupacionPct: 0.75, adr: 790_000 },
};

export const SCENARIO_ORDER: ScenarioKey[] = ["pesimista", "conservador", "optimista"];

// ---------------------------------------------------------------------------
// Tablas exactas del P&G por escenario (fuente de verdad — hoja "PyG Hospedaje")
// ---------------------------------------------------------------------------
export const FINANCIAL_BREAKDOWNS: Record<ScenarioKey, FinancialBreakdown> = {
  pesimista: {
    scenario: "pesimista",
    isInterpolated: false,
    assumptions: {
      ocupacionPct: 0.5,
      adr: 490_000,
      roomNoches: { concepto: "Room-noches Ocupadas", mensual: 120, anual: 1440 },
    },
    ingresos: {
      hospedaje: { concepto: "Ingresos por Venta de Hospedaje", mensual: 58_800_000, anual: 705_600_000 },
      rooftop: { concepto: "Ingreso Rooftop (mensual)", mensual: 10_000_000, anual: 120_000_000 },
      cafe: { concepto: "Ingreso Local Café (mensual, arriendo)", mensual: 6_000_000, anual: 72_000_000 },
      spa: { concepto: "Ingreso SPA (mensual, arriendo)", mensual: 1_500_000, anual: 18_000_000 },
      total: { concepto: "INGRESOS", mensual: 76_300_000, anual: 915_600_000 },
    },
    costosDirectos: {
      lineas: [
        { concepto: "Gasto por Comisión Booking.com (18%)", mensual: 7_878_367, anual: 94_540_405 },
        { concepto: "Costo de Desayuno", mensual: 4_200_000, anual: 50_400_000 },
        { concepto: "Costo de Minibar", mensual: 557_271, anual: 6_687_251 },
        { concepto: "Costo de Lavandería", mensual: 273_237, anual: 3_278_839 },
        { concepto: "Costo de Aseo y Cafetería", mensual: 6_695_162, anual: 80_341_947 },
        { concepto: "Gasto de Energía Eléctrica", mensual: 9_150_000, anual: 109_800_000 },
        { concepto: "Gasto de Arrendamiento", mensual: 46_000_000, anual: 552_000_000 },
        { concepto: "Gasto de Agua y Alcantarillado", mensual: 1_400_000, anual: 16_800_000 },
        { concepto: "Gasto de Gas", mensual: 250_000, anual: 3_000_000 },
        { concepto: "Gasto de Internet y Cable", mensual: 500_000, anual: 6_000_000 },
      ],
      total: { concepto: "TOTAL COSTOS DIRECTOS", mensual: 76_904_037, anual: 922_848_442 },
    },
    utilidadBruta: { concepto: "UTILIDAD BRUTA", mensual: -604_037, anual: -7_248_442 },
    gastosOperacionales: {
      lineas: [
        { concepto: "Gasto de Nómina (6 personas)", mensual: 19_500_000, anual: 234_000_000 },
        { concepto: "Gasto de Honorarios", mensual: 542_252, anual: 6_507_019 },
        { concepto: "Gasto de Impuestos (ICA, etc.)", mensual: 431_069, anual: 5_172_827 },
        { concepto: "Gasto de Seguros", mensual: 151_468, anual: 1_817_617 },
        { concepto: "Gasto de Servicios Administrativos", mensual: 1_550_000, anual: 18_600_000 },
        { concepto: "Gasto de Asesoría Legal", mensual: 158_469, anual: 1_901_625 },
        { concepto: "Gasto de Mantenimiento y Reparaciones", mensual: 1_350_000, anual: 16_200_000 },
        { concepto: "Gasto de Adecuación e Instalación", mensual: 1_040_000, anual: 12_480_000 },
        { concepto: "Gastos Diversos", mensual: 1_204_940, anual: 14_459_276 },
      ],
      total: { concepto: "TOTAL GASTOS OPERACIONALES", mensual: 25_928_197, anual: 311_138_364 },
    },
    ebitda: { concepto: "EBITDA (UTILIDAD OPERACIONAL)", mensual: -26_532_234, anual: -318_386_806 },
    margenEbitdaPct: -0.4512,
    gastoFinanciero: { concepto: "Gasto Financiero (Bancario)", mensual: 2_106_333, anual: 25_275_993 },
    feeGEH: {
      fijo: { concepto: "Gasto Fee Fijo Mensual GEH Suites", mensual: 3_000_000, anual: 36_000_000 },
      variable: { concepto: "Gasto Fee Variable GEH Suites (% s/ventas)", mensual: 1_526_000, anual: 18_312_000 },
      total: { concepto: "TOTAL FEE GEH SUITES", mensual: 4_526_000, anual: 54_312_000 },
      tasaTramoPct: 0.02,
    },
    utilidadNeta: { concepto: "UTILIDAD / PÉRDIDA NETA", mensual: -33_164_567, anual: -397_974_799 },
    margenNetoPct: -0.564,
  },

  conservador: {
    scenario: "conservador",
    isInterpolated: false,
    assumptions: {
      ocupacionPct: 0.68,
      adr: 700_000,
      roomNoches: { concepto: "Room-noches Ocupadas", mensual: 163.2, anual: 1958.4 },
    },
    ingresos: {
      hospedaje: { concepto: "Ingresos por Venta de Hospedaje", mensual: 114_240_000, anual: 1_370_880_000 },
      rooftop: { concepto: "Ingreso Rooftop (mensual)", mensual: 10_000_000, anual: 120_000_000 },
      cafe: { concepto: "Ingreso Local Café (mensual, arriendo)", mensual: 6_000_000, anual: 72_000_000 },
      spa: { concepto: "Ingreso SPA (mensual, arriendo)", mensual: 1_500_000, anual: 18_000_000 },
      total: { concepto: "INGRESOS", mensual: 131_740_000, anual: 1_580_880_000 },
    },
    costosDirectos: {
      lineas: [
        { concepto: "Gasto por Comisión Booking.com (18%)", mensual: 15_306_542, anual: 183_678_502 },
        { concepto: "Costo de Desayuno", mensual: 5_712_000, anual: 68_544_000 },
        { concepto: "Costo de Minibar", mensual: 1_082_698, anual: 12_992_373 },
        { concepto: "Costo de Lavandería", mensual: 530_860, anual: 6_370_316 },
        { concepto: "Costo de Aseo y Cafetería", mensual: 7_699_437, anual: 92_393_239 },
        { concepto: "Gasto de Energía Eléctrica", mensual: 9_607_500, anual: 115_290_000 },
        { concepto: "Gasto de Arrendamiento", mensual: 46_000_000, anual: 552_000_000 },
        { concepto: "Gasto de Agua y Alcantarillado", mensual: 1_470_000, anual: 17_640_000 },
        { concepto: "Gasto de Gas", mensual: 262_500, anual: 3_150_000 },
        { concepto: "Gasto de Internet y Cable", mensual: 500_000, anual: 6_000_000 },
      ],
      total: { concepto: "TOTAL COSTOS DIRECTOS", mensual: 88_171_536, anual: 1_058_058_430 },
    },
    utilidadBruta: { concepto: "UTILIDAD BRUTA", mensual: 43_568_464, anual: 522_821_570 },
    gastosOperacionales: {
      lineas: [
        { concepto: "Gasto de Nómina (6 personas)", mensual: 19_500_000, anual: 234_000_000 },
        { concepto: "Gasto de Honorarios", mensual: 1_053_517, anual: 12_642_209 },
        { concepto: "Gasto de Impuestos (ICA, etc.)", mensual: 837_505, anual: 10_050_064 },
        { concepto: "Gasto de Seguros", mensual: 294_281, anual: 3_531_371 },
        { concepto: "Gasto de Servicios Administrativos", mensual: 1_627_500, anual: 19_530_000 },
        { concepto: "Gasto de Asesoría Legal", mensual: 307_882, anual: 3_694_585 },
        { concepto: "Gasto de Mantenimiento y Reparaciones", mensual: 1_417_500, anual: 17_010_000 },
        { concepto: "Gasto de Adecuación e Instalación", mensual: 1_092_000, anual: 13_104_000 },
        { concepto: "Gastos Diversos", mensual: 1_265_187, anual: 15_182_239 },
      ],
      total: { concepto: "TOTAL GASTOS OPERACIONALES", mensual: 27_395_372, anual: 328_744_468 },
    },
    ebitda: { concepto: "EBITDA (UTILIDAD OPERACIONAL)", mensual: 16_173_092, anual: 194_077_102 },
    margenEbitdaPct: 0.1416,
    gastoFinanciero: { concepto: "Gasto Financiero (Bancario)", mensual: 2_422_283, anual: 29_067_392 },
    feeGEH: {
      fijo: { concepto: "Gasto Fee Fijo Mensual GEH Suites", mensual: 3_000_000, anual: 36_000_000 },
      variable: { concepto: "Gasto Fee Variable GEH Suites (% s/ventas)", mensual: 3_952_200, anual: 47_426_400 },
      total: { concepto: "TOTAL FEE GEH SUITES", mensual: 6_952_200, anual: 83_426_400 },
      tasaTramoPct: 0.03,
    },
    utilidadNeta: { concepto: "UTILIDAD / PÉRDIDA NETA", mensual: 6_798_609, anual: 81_583_311 },
    margenNetoPct: 0.0595,
  },

  optimista: {
    scenario: "optimista",
    isInterpolated: false,
    assumptions: {
      ocupacionPct: 0.75,
      adr: 790_000,
      roomNoches: { concepto: "Room-noches Ocupadas", mensual: 180, anual: 2160 },
    },
    ingresos: {
      hospedaje: { concepto: "Ingresos por Venta de Hospedaje", mensual: 142_200_000, anual: 1_706_400_000 },
      rooftop: { concepto: "Ingreso Rooftop (mensual)", mensual: 10_000_000, anual: 120_000_000 },
      cafe: { concepto: "Ingreso Local Café (mensual, arriendo)", mensual: 6_000_000, anual: 72_000_000 },
      spa: { concepto: "Ingreso SPA (mensual, arriendo)", mensual: 1_500_000, anual: 18_000_000 },
      total: { concepto: "INGRESOS", mensual: 159_700_000, anual: 1_916_400_000 },
    },
    costosDirectos: {
      lineas: [
        { concepto: "Gasto por Comisión Booking.com (18%)", mensual: 19_052_786, anual: 228_633_429 },
        { concepto: "Costo de Desayuno", mensual: 6_300_000, anual: 75_600_000 },
        { concepto: "Costo de Minibar", mensual: 1_347_686, anual: 16_172_229 },
        { concepto: "Costo de Lavandería", mensual: 660_786, anual: 7_929_437 },
        { concepto: "Costo de Aseo y Cafetería", mensual: 8_084_408, anual: 97_012_901 },
        { concepto: "Gasto de Energía Eléctrica", mensual: 10_087_875, anual: 121_054_500 },
        { concepto: "Gasto de Arrendamiento", mensual: 46_000_000, anual: 552_000_000 },
        { concepto: "Gasto de Agua y Alcantarillado", mensual: 1_543_500, anual: 18_522_000 },
        { concepto: "Gasto de Gas", mensual: 275_625, anual: 3_307_500 },
        { concepto: "Gasto de Internet y Cable", mensual: 500_000, anual: 6_000_000 },
      ],
      total: { concepto: "TOTAL COSTOS DIRECTOS", mensual: 93_852_666, anual: 1_126_231_997 },
    },
    utilidadBruta: { concepto: "UTILIDAD BRUTA", mensual: 65_847_334, anual: 790_168_003 },
    gastosOperacionales: {
      lineas: [
        { concepto: "Gasto de Nómina (6 personas)", mensual: 19_500_000, anual: 234_000_000 },
        { concepto: "Gasto de Honorarios", mensual: 1_311_364, anual: 15_736_363 },
        { concepto: "Gasto de Impuestos (ICA, etc.)", mensual: 1_042_483, anual: 12_509_796 },
        { concepto: "Gasto de Seguros", mensual: 366_306, anual: 4_395_666 },
        { concepto: "Gasto de Servicios Administrativos", mensual: 1_708_875, anual: 20_506_500 },
        { concepto: "Gasto de Asesoría Legal", mensual: 383_236, anual: 4_598_827 },
        { concepto: "Gasto de Mantenimiento y Reparaciones", mensual: 1_488_375, anual: 17_860_500 },
        { concepto: "Gasto de Adecuación e Instalación", mensual: 1_146_600, anual: 13_759_200 },
        { concepto: "Gastos Diversos", mensual: 1_328_446, anual: 15_941_351 },
      ],
      total: { concepto: "TOTAL GASTOS OPERACIONALES", mensual: 28_275_684, anual: 339_308_203 },
    },
    ebitda: { concepto: "EBITDA (UTILIDAD OPERACIONAL)", mensual: 37_571_650, anual: 450_859_800 },
    margenEbitdaPct: 0.2642,
    gastoFinanciero: { concepto: "Gasto Financiero (Bancario)", mensual: 2_785_625, anual: 33_427_500 },
    feeGEH: {
      fijo: { concepto: "Gasto Fee Fijo Mensual GEH Suites", mensual: 3_000_000, anual: 36_000_000 },
      variable: { concepto: "Gasto Fee Variable GEH Suites (% s/ventas)", mensual: 6_388_000, anual: 76_656_000 },
      total: { concepto: "TOTAL FEE GEH SUITES", mensual: 9_388_000, anual: 112_656_000 },
      tasaTramoPct: 0.04,
    },
    utilidadNeta: { concepto: "UTILIDAD / PÉRDIDA NETA", mensual: 25_398_025, anual: 304_776_300 },
    margenNetoPct: 0.1786,
  },
};
