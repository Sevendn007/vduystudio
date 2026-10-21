import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";
import Hero from "@/components/home/Hero";
import Projects from "@/components/home/Projects";
import { TrustedBy, Manifesto, Services, Clients, Process, Feedback } from "@/components/home/Sections";
import WelcomePopup from "@/components/WelcomePopup";

// Trang chủ HOLO GLASS — xem redesign_spec.md §6.
export default function Home() {
  return (
    <div className="holo">
      <WelcomePopup />
      <SiteNav />
      <main>
        <Hero />
        <TrustedBy />
        <Manifesto />
        <Services />
        <Projects />
        <Clients />
        <Process />
        <Feedback />
      </main>
      <SiteFooter />
    </div>
  );
}
