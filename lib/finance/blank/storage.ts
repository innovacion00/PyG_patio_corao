import type { CostLine, FeeConfig, IncomeLine, RoomType } from "./types";

const STORAGE_KEY = "geh-blank-simulator-v1";

export interface BlankSimulatorPersistedState {
  rooms: RoomType[];
  ocupacionPct: number;
  diasOperativosMes: number;
  otrosIngresos: IncomeLine[];
  costosDirectos: CostLine[];
  gastosOperacionales: CostLine[];
  feeConfig: FeeConfig;
  gastoFinancieroMensual: number;
  horizonte: "mensual" | "anual";
}

export function loadBlankSimulatorState(): BlankSimulatorPersistedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as BlankSimulatorPersistedState;
  } catch {
    return null;
  }
}

export function saveBlankSimulatorState(state: BlankSimulatorPersistedState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage puede fallar en modo privado o si está lleno; no es crítico para el simulador.
  }
}
