import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-deep-950 text-white/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Image src="/geh-logo-full.png" alt="GEHsuites Hotels" width={200} height={63} className="h-6 w-auto" />
          <span className="font-display text-sm font-semibold text-white/80">× Patio Corao</span>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs">
          <a href="#simulador" className="hover:text-white transition">Simulador</a>
          <a href="#por-que-invertir" className="hover:text-white transition">Por qué invertir</a>
          <a href="#desglose-financiero" className="hover:text-white transition">Desglose financiero</a>
          <a href="#comercializacion" className="hover:text-white transition">Comercialización</a>
          <a href="#faq" className="hover:text-white transition">FAQ</a>
        </nav>
        <p className="text-xs text-white/40">© {new Date().getFullYear()} GEHsuites. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
