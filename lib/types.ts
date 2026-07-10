// Tipos compartidos del simulador financiero Patio Corao × GEHsuites

export type ScenarioKey = "pesimista" | "conservador" | "optimista";

export interface ScenarioAssumptions {
  key: ScenarioKey;
  label: string;
  ocupacionPct: number; // 0-1
  adr: number; // tarifa promedio diaria (COP)
}

/** Una línea de una tabla financiera (concepto + valor mensual/anual). */
export interface LineItem {
  concepto: string;
  mensual: number;
  anual: number;
}

/** Desglose financiero completo de un escenario, en la estructura del P&G. */
export interface FinancialBreakdown {
  scenario: ScenarioKey;
  isInterpolated: boolean;

  /** Supuestos operativos del escenario (fuente: tabla "PATIO CORAO — Estado P y G"). */
  assumptions: {
    ocupacionPct: number;
    adr: number;
    roomNoches: LineItem;
  };

  ingresos: {
    hospedaje: LineItem;
    rooftop: LineItem;
    cafe: LineItem;
    spa: LineItem;
    total: LineItem;
  };

  costosDirectos: {
    lineas: LineItem[];
    total: LineItem;
  };

  utilidadBruta: LineItem;

  gastosOperacionales: {
    lineas: LineItem[];
    total: LineItem;
  };

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

export interface SimulatorInputs {
  scenario: ScenarioKey;
  customMode: boolean;
  customOcupacionPct: number; // usado solo si customMode = true
  customAdr: number; // usado solo si customMode = true
  montoInvertido: number;
  horizonte: "mensual" | "anual";
}

export interface InvestorResults {
  participacionPct: number;
  utilidadInversionistaMensual: number;
  utilidadInversionistaAnual: number;
  roiAnualPct: number; // siempre calculado sobre base anual
  paybackAnios: number | null; // null si la utilidad anual es <= 0
}

export interface SimulatorResults {
  breakdown: FinancialBreakdown;
  investor: InvestorResults;
}
