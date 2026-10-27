import SiteNav from "@/components/layout/SiteNav";
import SiteFooter from "@/components/layout/SiteFooter";
import Hero from "@/components/home/Hero";
import Projects from "@/components/home/Projects";
import Services from "@/components/home/Services";
import { TrustedBy, Manifesto, Clients, Process, Feedback } from "@/components/home/Sections";
import WelcomePopup from "@/components/WelcomePopup";

// Trang chủ HOLO GLASS (UI mới, xem trước) — xem redesign_spec.md §6.
export default function HoloHome() {
  return (
    <div className="holo">
      <WelcomePopup deferOpen />
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
