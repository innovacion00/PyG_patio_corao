import Image from "next/image";

export function FooterV2() {
  return (
    <footer className="border-t border-deep-800 bg-deep-900 text-arena-100/70">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Image src="/geh-logo-full.png" alt="GEHsuites" width={1046} height={329} className="h-7 w-auto" />
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs">
          <a href="#simulador" className="hover:text-white transition">Simulador</a>
        </nav>
        <p className="text-xs text-arena-100/50">© {new Date().getFullYear()} GEHsuites. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
