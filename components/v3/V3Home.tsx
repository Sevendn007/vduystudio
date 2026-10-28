"use client";
import { useEffect } from "react";
import { V3Provider, type V3Data } from "./V3Context";
import Nav3 from "./ui/Nav3";
import Dock from "./ui/Dock";
import Hero from "./chapters/Hero";
import Story from "./chapters/Story";
import ServicesPricing from "./chapters/ServicesPricing";
import Trust from "./chapters/Trust";
import ResultBelt from "./chapters/ResultBelt";
import Feedback from "./chapters/Feedback";
import Footer3 from "./chapters/Footer3";
import WelcomePopup from "@/components/WelcomePopup";

// v3 "LIQUID COBALT × LIVE VERIFICATION":
//   Hero chrome lỏng → câu chuyện ghim (4 bước + đóng dấu tích) → mục lục dịch vụ nền mực
//   → dải đối tác bắt chéo + tuyên ngôn → dự án trượt ngang → feedback → footer chrome lỏng.
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
        <main>
          <Hero />
          <Story />
          <ServicesPricing />
          <Trust />
          <ResultBelt />
          <Feedback />
        </main>
        <Footer3 />
        <Dock />
      </div>
    </V3Provider>
  );
}
