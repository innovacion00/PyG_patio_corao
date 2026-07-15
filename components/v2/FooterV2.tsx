import { Building2 } from "lucide-react";

export function FooterV2() {
  return (
    <footer className="border-t border-arena-200 bg-arena-100 text-deep-700/70">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2 text-deep-900">
          <Building2 className="h-4 w-4 text-dorado-600" />
          <span className="font-display text-sm font-semibold">GEHsuites</span>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs">
          <a href="#simulador" className="hover:text-deep-900 transition">Simulador</a>
        </nav>
        <p className="text-xs text-deep-700/50">© {new Date().getFullYear()} GEHsuites. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
