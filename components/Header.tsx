import Image from "next/image";

export function Header() {
  return (
    <header className="bg-deep-950 border-b border-white/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-4">
        <a href="#" className="flex items-center">
          <Image src="/geh-logo-full.png" alt="GEHsuites Hotels" width={200} height={63} className="h-8 sm:h-9 w-auto" priority />
        </a>
        <div className="flex items-center gap-2 text-sm text-white/50">
          <span className="hidden sm:inline">Proyecto</span>
          <span className="font-display text-base font-semibold text-dorado-200">Patio Corao</span>
        </div>
      </div>
    </header>
  );
}
