let counter = 0;

/** Generador simple de ids únicos para filas de tablas editables (solo cliente). */
export function createId(prefix: string): string {
  counter += 1;
  return `${prefix}-${counter}-${Date.now().toString(36)}`;
}
