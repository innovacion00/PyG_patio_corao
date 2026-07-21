import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Simulator } from "@/components/Simulator/Simulator";
import { WhyInvest } from "@/components/WhyInvest";
import { FinancialBreakdown } from "@/components/FinancialBreakdown";
import { GEHSuitesFeeExplainer } from "@/components/GEHSuitesFeeExplainer";
import { FAQ } from "@/components/FAQ";
import { LegalNotice } from "@/components/LegalNotice";
import { Footer } from "@/components/Footer";
import { FloatingLandingSwitch } from "@/components/FloatingLandingSwitch";

export default function LandingV2() {
  return (
    <div className="flex flex-col flex-1">
      <Header />
      <main className="flex flex-col flex-1">
        <Hero />
        <Simulator />
        <WhyInvest />
        <FinancialBreakdown />
        <GEHSuitesFeeExplainer variant="full" />
        <FAQ />
        <LegalNotice />
      </main>
      <Footer />
      <FloatingLandingSwitch />
    </div>
  );
}
