// Tipos del simulador en blanco GEHsuites (independiente del modelo Patio Corao).

import type { LineItem } from "@/lib/types";

export type OcupacionScenarioKey = "pesimista" | "conservador" | "optimista";

export interface OcupacionScenario {
  key: OcupacionScenarioKey;
  label: string;
  ocupacionPct: number;
}

export interface RoomType {
  id: string;
  nombre: string;
  cantidad: number;
  adr: number; // tarifa promedio diaria (COP)
}

export type CostLineModo = "fijo" | "porcentaje";

/** Línea de costo/gasto definida por el usuario: monto fijo mensual o % de los ingresos totales. */
export interface CostLine {
  id: string;
  concepto: string;
  modo: CostLineModo;
  montoFijo: number; // COP mensual, usado si modo === "fijo"
  pctSobreIngresos: number; // 0-1, usado si modo === "porcentaje"
}

/** Línea de ingreso adicional (renta complementaria, arriendo fijo, etc.), como monto fijo mensual. */
export interface IncomeLine {
  id: string;
  concepto: string;
  montoMensual: number;
}

export interface FeeTramo {
  min: number;
  max: number;
  tasa: number; // 0-1
}

export interface FeeConfig {
  feeFijoMensual: number;
  tramos: FeeTramo[];
}

export interface BlankBreakdown {
  roomNoches: LineItem;
  ingresoHospedaje: LineItem;
  otrosIngresos: { lineas: LineItem[]; total: LineItem };
  ingresos: { total: LineItem };
  costosDirectos: { lineas: LineItem[]; total: LineItem };
  utilidadBruta: LineItem;
  gastosOperacionales: { lineas: LineItem[]; total: LineItem };
  ebitda: LineItem;
  margenEbitdaPct: number;
  gastoFinanciero: LineItem;
  feeGEH: {
    fijo: LineItem;
    variable: LineItem;
    total: LineItem;
    tasaTramoPct: number;
  };
  utilidadNeta: LineItem;
  margenNetoPct: number;
}
