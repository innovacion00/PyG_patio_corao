import Image from "next/image";

export function HeaderV2() {
  return (
    <header className="sticky top-0 z-40 border-b border-deep-800 bg-deep-900/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3.5">
        <a href="#" className="flex items-center gap-2">
          <Image src="/geh-logo-full.png" alt="GEHsuites" width={1046} height={329} className="h-9 w-auto" priority />
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
