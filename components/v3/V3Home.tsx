"use client";
import { useEffect } from "react";
import { V3Provider, type V3Data } from "./V3Context";
import Nav3 from "./ui/Nav3";
import Dock from "./ui/Dock";
import ProgressRail from "./ui/ProgressRail";
import Hero from "./chapters/Hero";
import ServicesPricing from "./chapters/ServicesPricing";
import Trust from "./chapters/Trust";
import ResultBelt from "./chapters/ResultBelt";
import Process from "./chapters/Process";
import Feedback from "./chapters/Feedback";
import Footer3 from "./chapters/Footer3";
import WelcomePopup from "@/components/WelcomePopup";

// 3D giờ chỉ nằm trong ô nghệ thuật của Hero (components/v3/ui/HeroArt.tsx) — không còn
// canvas cố định phủ cả trang.
export default function V3Home(props: V3Data) {
  useEffect(() => {
    document.body.classList.add("v3-page");
    return () => document.body.classList.remove("v3-page");
  }, []);

  return (
    <V3Provider data={props}>
      <div className="v3">
        <WelcomePopup deferOpen />
        <Nav3 />
        <ProgressRail />
        <main>
          <Hero />
          <ServicesPricing />
          <Trust />
          <ResultBelt />
          <Process />
          <Feedback />
          <Footer3 />
        </main>
        <Dock />
      </div>
    </V3Provider>
  );
}
