"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftRight } from "lucide-react";

const LANDINGS: Record<string, { href: string; label: string }> = {
  "/": { href: "/v2", label: "Ver diseño original" },
  "/v2": { href: "/", label: "Ver otro diseño" },
};

export function FloatingLandingSwitch() {
  const pathname = usePathname();
  const target = LANDINGS[pathname] ?? LANDINGS["/"];

  return (
    <Link
      href={target.href}
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-deep-900 px-4 py-3 text-sm font-semibold text-white shadow-soft-lg transition hover:bg-deep-800"
    >
      <ArrowLeftRight className="h-4 w-4 text-dorado-300" />
      {target.label}
    </Link>
  );
}
