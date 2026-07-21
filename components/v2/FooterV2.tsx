import Image from "next/image";

export function FooterV2() {
  return (
    <footer className="border-t border-arena-200 bg-arena-100 text-deep-700/70">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2 text-deep-900">
          <Image src="/geh-mark.png" alt="GEHsuites" width={398} height={282} className="h-6 w-auto" />
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
