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
  /** Si es false, la línea se excluye del cálculo del PyG pero se conserva para reactivarla luego. */
  activo: boolean;
}

/** Línea de ingreso adicional (renta complementaria, arriendo fijo, etc.), como monto fijo mensual. */
export interface IncomeLine {
  id: string;
  concepto: string;
  montoMensual: number;
  /** Si es false, la línea se excluye del cálculo del PyG pero se conserva para reactivarla luego. */
  activo: boolean;
}

/** Línea del PyG con id/activo trazables hasta un CostLine o IncomeLine, para el toggle de la tabla resultante. */
export interface ToggleableLineItem extends LineItem {
  id: string;
  activo: boolean;
}

/** Línea de costo/gasto en el PyG: además del monto, conserva el modo y % para poder editarse desde la tabla resultante. */
export interface CostToggleableLineItem extends ToggleableLineItem {
  modo: CostLineModo;
  pctSobreIngresos: number;
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
  otrosIngresos: { lineas: ToggleableLineItem[]; total: LineItem };
  ingresos: { total: LineItem };
  costosDirectos: { lineas: CostToggleableLineItem[]; total: LineItem };
  utilidadBruta: LineItem;
  gastosOperacionales: { lineas: CostToggleableLineItem[]; total: LineItem };
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
