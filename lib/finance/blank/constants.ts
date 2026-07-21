import type { CostLine, FeeConfig, OcupacionScenario, OcupacionScenarioKey, RoomType } from "./types";

export const DEFAULT_DIAS_OPERATIVOS_MES = 30;

/** Escenarios de ocupación — punto de partida rápido, ajustable con el slider fino. */
export const OCUPACION_SCENARIOS: Record<OcupacionScenarioKey, OcupacionScenario> = {
  pesimista: { key: "pesimista", label: "Pesimista", ocupacionPct: 0.5 },
  conservador: { key: "conservador", label: "Conservador", ocupacionPct: 0.7 },
  optimista: { key: "optimista", label: "Optimista", ocupacionPct: 0.85 },
};

export const OCUPACION_SCENARIO_ORDER: OcupacionScenarioKey[] = ["pesimista", "conservador", "optimista"];

export const DEFAULT_OCUPACION_PCT = OCUPACION_SCENARIOS.conservador.ocupacionPct;

export const DEFAULT_ROOM_TYPES: RoomType[] = [
  { id: "room-1", nombre: "Habitación Estándar", cantidad: 1, adr: 0 },
];

/** Conceptos de costo directo más comunes en la operación de un hostal/hospedaje — el usuario ajusta cada monto/%. */
const DEFAULT_COSTOS_DIRECTOS_CONCEPTOS = [
  "Gasto por Comisión Booking.com (18%)",
  "Costo de Desayuno",
  "Costo de Lavandería",
  "Costo de Aseo y Cafetería",
  "Gasto de Energía Eléctrica",
  "Gasto de Arrendamiento",
  "Gasto de Agua y Alcantarillado",
  "Gasto de Gas",
  "Gasto de Internet y Cable",
];

export const DEFAULT_COSTOS_DIRECTOS: CostLine[] = DEFAULT_COSTOS_DIRECTOS_CONCEPTOS.map((concepto, i) => ({
  id: `costo-directo-default-${i + 1}`,
  concepto,
  modo: "porcentaje",
  montoFijo: 0,
  pctSobreIngresos: 0,
  activo: true,
}));

/** Conceptos de gasto operacional más comunes en la operación de un hostal/hospedaje — el usuario ajusta cada monto/%. */
const DEFAULT_GASTOS_OPERACIONALES_CONCEPTOS = [
  "Gasto de Nómina",
  "Gasto de Honorarios",
  "Gasto de Impuestos (ICA, etc.)",
  "Gasto de Seguros",
  "Gasto de Servicios Administrativos",
  "Gasto de Asesoría Legal",
  "Gasto de Mantenimiento y Reparaciones",
  "Gasto de Adecuación e Instalación",
  "Gasto Diversos (Imprevistos)",
];

export const DEFAULT_GASTOS_OPERACIONALES: CostLine[] = DEFAULT_GASTOS_OPERACIONALES_CONCEPTOS.map((concepto, i) => ({
  id: `gasto-operacional-default-${i + 1}`,
  concepto,
  modo: "porcentaje",
  montoFijo: 0,
  pctSobreIngresos: 0,
  activo: true,
}));

/** Valores de partida basados en las condiciones comerciales vigentes de GEHsuites — editables por proyecto. */
export const DEFAULT_FEE_CONFIG: FeeConfig = {
  feeFijoMensual: 3_000_000,
  tramos: [
    { min: 0, max: 100_000_000, tasa: 0.03 },
    { min: 100_000_001, max: 140_000_000, tasa: 0.04 },
    { min: 140_000_001, max: 250_000_000, tasa: 0.05 },
  ],
};
