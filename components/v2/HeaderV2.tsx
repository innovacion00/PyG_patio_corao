import { Building2 } from "lucide-react";

export function HeaderV2() {
  return (
    <header className="sticky top-0 z-40 border-b border-arena-200 bg-arena-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3.5">
        <a href="#" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-deep-900">
            <Building2 className="h-4 w-4 text-dorado-300" />
          </span>
          <span className="font-display text-base font-bold tracking-tight text-deep-900">GEHsuites</span>
        </a>
        <a
          href="#simulador"
          className="inline-flex items-center rounded-full bg-dorado-400 px-4 py-2 text-xs font-bold uppercase tracking-wide text-deep-950 transition hover:bg-dorado-300"
        >
          Simular ahora
        </a>
      </div>
    </header>
  );
}
