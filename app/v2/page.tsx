import type { Metadata } from "next";
import { HeaderV2 } from "@/components/v2/HeaderV2";
import { HeroV2 } from "@/components/v2/HeroV2";
import { BlankSimulator } from "@/components/BlankSimulator/BlankSimulator";
import { FooterV2 } from "@/components/v2/FooterV2";
import { FloatingLandingSwitch } from "@/components/FloatingLandingSwitch";

export const metadata: Metadata = {
  title: "GEHsuites | Simulador de Rentabilidad Hotelera",
  description:
    "Arma tu propio modelo de rentabilidad hotelera: define tipos de habitación, cantidad y ADR, y descubre en segundos la utilidad y márgenes estimados.",
};

export default function LandingV2() {
  return (
    <div className="flex flex-col flex-1">
      <HeaderV2 />
      <main className="flex flex-col flex-1">
        <HeroV2 />
        <BlankSimulator />
      </main>
      <FooterV2 />
      <FloatingLandingSwitch />
    </div>
  );
}
