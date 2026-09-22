import { MarketingNav } from "@/components/marketing/nav";
import { Hero } from "@/components/marketing/hero";
import { Features } from "@/components/marketing/features";
import { Steps } from "@/components/marketing/steps";
import { Pricing } from "@/components/marketing/pricing";
import { MarketingFooter } from "@/components/marketing/footer";

export default function Home() {
  return (
    <>
      <MarketingNav />
      <main>
        <Hero />
        <Features />
        <Steps />
        <Pricing />
      </main>
      <MarketingFooter />
    </>
  );
}
