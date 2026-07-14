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
// Rooftop: pendiente de inversión de adecuación (hoja "Supuestos", sección 7) — sin ingreso mientras tanto.
export const INGRESO_ROOFTOP_MENSUAL = 0;
export const INGRESO_CAFE_MENSUAL = 6_000_000;
export const INGRESO_SPA_MENSUAL = 1_500_000;

// Comercialización GEHsuites
export const FEE_FIJO_GEH_MENSUAL = 3_000_000;

/**
 * Tramos del fee variable de GEHsuites, sobre ingresos totales mensuales.
 * Fuente: hoja "PyG Hospedaje" — tasas aplicadas por escenario (3% / 4% / 5%).
 * Los límites de cada tramo son una interpolación razonable entre los 3
 * puntos de ingreso conocidos (Pesimista $67.5MM, Conservador $125.1MM,
 * Optimista $149.7MM), ya que el modelo fija la tasa por escenario y no
 * publica una tabla de rangos explícita.
 */
export const TRAMOS_FEE_VARIABLE = [
  { min: 0, max: 100_000_000, tasa: 0.03 },
  { min: 100_000_001, max: 140_000_000, tasa: 0.04 },
  { min: 140_000_001, max: 250_000_000, tasa: 0.05 },
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
  pesimista: { key: "pesimista", label: "Pesimista", ocupacionPct: 0.5, adr: 500_000 },
  conservador: { key: "conservador", label: "Conservador", ocupacionPct: 0.7, adr: 700_000 },
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
      adr: 500_000,
      roomNoches: { concepto: "Room-noches Ocupadas", mensual: 120, anual: 1440 },
    },
    ingresos: {
      hospedaje: { concepto: "Ingresos por Venta de Hospedaje", mensual: 60_000_000, anual: 720_000_000 },
      rooftop: { concepto: "Ingreso Rooftop (mensual)", mensual: 0, anual: 0 },
      cafe: { concepto: "Ingreso Local Café (mensual, arriendo)", mensual: 6_000_000, anual: 72_000_000 },
      spa: { concepto: "Ingreso SPA (mensual, arriendo)", mensual: 1_500_000, anual: 18_000_000 },
      total: { concepto: "INGRESOS", mensual: 67_500_000, anual: 810_000_000 },
    },
    costosDirectos: {
      lineas: [
        { concepto: "Gasto por Comisión Booking.com (18%)", mensual: 8_039_150, anual: 96_469_801 },
        { concepto: "Costo de Desayuno", mensual: 4_200_000, anual: 50_400_000 },
        { concepto: "Costo de Lavandería", mensual: 1_800_000, anual: 21_600_000 },
        { concepto: "Costo de Aseo y Cafetería", mensual: 5_200_000, anual: 62_400_000 },
        { concepto: "Gasto de Energía Eléctrica", mensual: 8_500_000, anual: 102_000_000 },
        { concepto: "Gasto de Arrendamiento", mensual: 46_000_000, anual: 552_000_000 },
        { concepto: "Gasto de Agua y Alcantarillado", mensual: 1_400_000, anual: 16_800_000 },
        { concepto: "Gasto de Gas", mensual: 150_000, anual: 1_800_000 },
        { concepto: "Gasto de Internet y Cable", mensual: 500_000, anual: 6_000_000 },
      ],
      total: { concepto: "TOTAL COSTOS DIRECTOS", mensual: 75_789_150, anual: 909_469_801 },
    },
    utilidadBruta: { concepto: "UTILIDAD BRUTA", mensual: -8_289_150, anual: -99_469_801 },
    gastosOperacionales: {
      lineas: [
        { concepto: "Gasto de Nómina (4 personas)", mensual: 12_000_000, anual: 144_000_000 },
        { concepto: "Gastos Nómina Practicantes (2)", mensual: 3_000_000, anual: 36_000_000 },
        { concepto: "Gasto de Honorarios", mensual: 553_318, anual: 6_639_815 },
        { concepto: "Gasto de Impuestos (ICA, etc.)", mensual: 439_866, anual: 5_278_395 },
        { concepto: "Gasto de Seguros", mensual: 154_559, anual: 1_854_712 },
        { concepto: "Gasto de Servicios Administrativos", mensual: 1_200_000, anual: 14_400_000 },
        { concepto: "Gasto de Asesoría Legal", mensual: 161_703, anual: 1_940_434 },
        { concepto: "Gasto de Mantenimiento y Reparaciones", mensual: 1_040_000, anual: 12_480_000 },
        { concepto: "Gasto de Adecuación e Instalación", mensual: 800_000, anual: 9_600_000 },
        { concepto: "Gastos Diversos", mensual: 1_050_000, anual: 12_600_000 },
      ],
      total: { concepto: "TOTAL GASTOS OPERACIONALES", mensual: 20_399_446, anual: 244_793_355 },
    },
    ebitda: { concepto: "EBITDA (UTILIDAD OPERACIONAL)", mensual: -28_688_596, anual: -344_263_157 },
    margenEbitdaPct: -0.4781,
    gastoFinanciero: { concepto: "Gasto Financiero (Bancario)", mensual: 1_485_000, anual: 17_820_000 },
    feeGEH: {
      fijo: { concepto: "Gasto Fee Fijo Mensual GEH Suites", mensual: 3_000_000, anual: 36_000_000 },
      variable: { concepto: "Gasto Fee Variable GEH Suites (% s/ventas)", mensual: 2_025_000, anual: 24_300_000 },
      total: { concepto: "TOTAL FEE GEH SUITES", mensual: 5_025_000, anual: 60_300_000 },
      tasaTramoPct: 0.03,
    },
    utilidadNeta: { concepto: "UTILIDAD / PÉRDIDA NETA", mensual: -35_198_596, anual: -422_383_157 },
    margenNetoPct: -0.5866,
  },

  conservador: {
    scenario: "conservador",
    isInterpolated: false,
    assumptions: {
      ocupacionPct: 0.7,
      adr: 700_000,
      roomNoches: { concepto: "Room-noches Ocupadas", mensual: 168, anual: 2016 },
    },
    ingresos: {
      hospedaje: { concepto: "Ingresos por Venta de Hospedaje", mensual: 117_600_000, anual: 1_411_200_000 },
      rooftop: { concepto: "Ingreso Rooftop (mensual)", mensual: 0, anual: 0 },
      cafe: { concepto: "Ingreso Local Café (mensual, arriendo)", mensual: 6_000_000, anual: 72_000_000 },
      spa: { concepto: "Ingreso SPA (mensual, arriendo)", mensual: 1_500_000, anual: 18_000_000 },
      total: { concepto: "INGRESOS", mensual: 125_100_000, anual: 1_501_200_000 },
    },
    costosDirectos: {
      lineas: [
        { concepto: "Gasto por Comisión Booking.com (18%)", mensual: 15_756_734, anual: 189_080_811 },
        { concepto: "Costo de Desayuno", mensual: 5_880_000, anual: 70_560_000 },
        { concepto: "Costo de Lavandería", mensual: 546_473, anual: 6_557_678 },
        { concepto: "Costo de Aseo y Cafetería", mensual: 5_980_000, anual: 71_760_000 },
        { concepto: "Gasto de Energía Eléctrica", mensual: 8_925_000, anual: 107_100_000 },
        { concepto: "Gasto de Arrendamiento", mensual: 46_000_000, anual: 552_000_000 },
        { concepto: "Gasto de Agua y Alcantarillado", mensual: 1_470_000, anual: 17_640_000 },
        { concepto: "Gasto de Gas", mensual: 157_500, anual: 1_890_000 },
        { concepto: "Gasto de Internet y Cable", mensual: 500_000, anual: 6_000_000 },
      ],
      total: { concepto: "TOTAL COSTOS DIRECTOS", mensual: 85_215_707, anual: 1_022_588_489 },
    },
    utilidadBruta: { concepto: "UTILIDAD BRUTA", mensual: 39_884_293, anual: 478_611_511 },
    gastosOperacionales: {
      lineas: [
        { concepto: "Gasto de Nómina (4 personas)", mensual: 12_000_000, anual: 144_000_000 },
        { concepto: "Gastos Nómina Practicantes (2)", mensual: 3_000_000, anual: 36_000_000 },
        { concepto: "Gasto de Honorarios", mensual: 1_084_503, anual: 13_014_038 },
        { concepto: "Gasto de Impuestos (ICA, etc.)", mensual: 862_138, anual: 10_345_654 },
        { concepto: "Gasto de Seguros", mensual: 302_936, anual: 3_635_235 },
        { concepto: "Gasto de Servicios Administrativos", mensual: 1_260_000, anual: 15_120_000 },
        { concepto: "Gasto de Asesoría Legal", mensual: 316_937, anual: 3_803_250 },
        { concepto: "Gasto de Mantenimiento y Reparaciones", mensual: 1_092_000, anual: 13_104_000 },
        { concepto: "Gasto de Adecuación e Instalación", mensual: 840_000, anual: 10_080_000 },
        { concepto: "Gastos Diversos", mensual: 1_102_500, anual: 13_230_000 },
      ],
      total: { concepto: "TOTAL GASTOS OPERACIONALES", mensual: 21_861_015, anual: 262_332_176 },
    },
    ebitda: { concepto: "EBITDA (UTILIDAD OPERACIONAL)", mensual: 18_023_278, anual: 216_279_335 },
    margenEbitdaPct: 0.1533,
    gastoFinanciero: { concepto: "Gasto Financiero (Bancario)", mensual: 2_752_200, anual: 33_026_400 },
    feeGEH: {
      fijo: { concepto: "Gasto Fee Fijo Mensual GEH Suites", mensual: 3_000_000, anual: 36_000_000 },
      variable: { concepto: "Gasto Fee Variable GEH Suites (% s/ventas)", mensual: 5_004_000, anual: 60_048_000 },
      total: { concepto: "TOTAL FEE GEH SUITES", mensual: 8_004_000, anual: 96_048_000 },
      tasaTramoPct: 0.04,
    },
    utilidadNeta: { concepto: "UTILIDAD / PÉRDIDA NETA", mensual: 7_267_078, anual: 87_204_935 },
    margenNetoPct: 0.0618,
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
      rooftop: { concepto: "Ingreso Rooftop (mensual)", mensual: 0, anual: 0 },
      cafe: { concepto: "Ingreso Local Café (mensual, arriendo)", mensual: 6_000_000, anual: 72_000_000 },
      spa: { concepto: "Ingreso SPA (mensual, arriendo)", mensual: 1_500_000, anual: 18_000_000 },
      total: { concepto: "INGRESOS", mensual: 149_700_000, anual: 1_796_400_000 },
    },
    costosDirectos: {
      lineas: [
        { concepto: "Gasto por Comisión Booking.com (18%)", mensual: 19_052_786, anual: 228_633_429 },
        { concepto: "Costo de Desayuno", mensual: 6_300_000, anual: 75_600_000 },
        { concepto: "Costo de Lavandería", mensual: 660_786, anual: 7_929_437 },
        { concepto: "Costo de Aseo y Cafetería", mensual: 6_279_000, anual: 75_348_000 },
        { concepto: "Gasto de Energía Eléctrica", mensual: 9_371_250, anual: 112_455_000 },
        { concepto: "Gasto de Arrendamiento", mensual: 46_000_000, anual: 552_000_000 },
        { concepto: "Gasto de Agua y Alcantarillado", mensual: 1_543_500, anual: 18_522_000 },
        { concepto: "Gasto de Gas", mensual: 165_375, anual: 1_984_500 },
        { concepto: "Gasto de Internet y Cable", mensual: 500_000, anual: 6_000_000 },
      ],
      total: { concepto: "TOTAL COSTOS DIRECTOS", mensual: 89_872_697, anual: 1_078_472_367 },
    },
    utilidadBruta: { concepto: "UTILIDAD BRUTA", mensual: 59_827_303, anual: 717_927_633 },
    gastosOperacionales: {
      lineas: [
        { concepto: "Gasto de Nómina (4 personas)", mensual: 12_000_000, anual: 144_000_000 },
        { concepto: "Gastos Nómina Practicantes (2)", mensual: 3_000_000, anual: 36_000_000 },
        { concepto: "Gasto de Honorarios", mensual: 1_311_364, anual: 15_736_363 },
        { concepto: "Gasto de Impuestos (ICA, etc.)", mensual: 1_042_483, anual: 12_509_796 },
        { concepto: "Gasto de Seguros", mensual: 366_306, anual: 4_395_666 },
        { concepto: "Gasto de Servicios Administrativos", mensual: 1_323_000, anual: 15_876_000 },
        { concepto: "Gasto de Asesoría Legal", mensual: 383_236, anual: 4_598_827 },
        { concepto: "Gasto de Mantenimiento y Reparaciones", mensual: 1_146_600, anual: 13_759_200 },
        { concepto: "Gasto de Adecuación e Instalación", mensual: 882_000, anual: 10_584_000 },
        { concepto: "Gastos Diversos", mensual: 1_157_625, anual: 13_891_500 },
      ],
      total: { concepto: "TOTAL GASTOS OPERACIONALES", mensual: 22_612_613, anual: 271_351_352 },
    },
    ebitda: { concepto: "EBITDA (UTILIDAD OPERACIONAL)", mensual: 37_214_690, anual: 446_576_281 },
    margenEbitdaPct: 0.2617,
    gastoFinanciero: { concepto: "Gasto Financiero (Bancario)", mensual: 3_293_400, anual: 39_520_800 },
    feeGEH: {
      fijo: { concepto: "Gasto Fee Fijo Mensual GEH Suites", mensual: 3_000_000, anual: 36_000_000 },
      variable: { concepto: "Gasto Fee Variable GEH Suites (% s/ventas)", mensual: 7_485_000, anual: 89_820_000 },
      total: { concepto: "TOTAL FEE GEH SUITES", mensual: 10_485_000, anual: 125_820_000 },
      tasaTramoPct: 0.05,
    },
    utilidadNeta: { concepto: "UTILIDAD / PÉRDIDA NETA", mensual: 23_436_290, anual: 281_235_481 },
    margenNetoPct: 0.1648,
  },
};
