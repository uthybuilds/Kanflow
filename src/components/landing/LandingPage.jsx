import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { Clients } from "./Clients";
import { Features } from "./Features";
import { UniversalWorkflow } from "./UniversalWorkflow";
import { TeamSync } from "./TeamSync";
import { KeyboardPower } from "./KeyboardPower";
import { ProductivityVelocity } from "./ProductivityVelocity";
import { Integrations } from "./Integrations";
import { Stats } from "./Stats";
import { Testimonials } from "./Testimonials";
import { CallToAction } from "./CallToAction";
import { Footer } from "./Footer";

export const LandingPage = () => {
  return (
    <div className="min-h-screen w-full bg-zinc-950 selection:bg-blue-500/30 transition-colors duration-300">
      <Navbar />
      <main>
        <Hero />
        <Clients />
        <Features />
        <UniversalWorkflow />
        <TeamSync />
        <KeyboardPower />
        <Integrations />
        <ProductivityVelocity />
        <Stats />
        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};
