"use client";

import { useState } from "react";
import OptionGalaxy from "@/components/variants/Option2079";
import OptionMajor from "@/components/variants/OptionMajor";

export default function Home() {
  const [style, setStyle] = useState<"galaxy" | "major">("galaxy");

  return (
    <>
      {style === "galaxy" ? <OptionGalaxy /> : <OptionMajor />}
      
      <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999, display: "flex", gap: "8px", background: "rgba(0,0,0,0.8)", padding: "8px", borderRadius: "100px", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)" }}>
        <button 
          onClick={() => setStyle("galaxy")}
          style={{ padding: "6px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: 600, border: "none", cursor: "pointer", background: style === "galaxy" ? "#fff" : "transparent", color: style === "galaxy" ? "#000" : "#fff", transition: "0.2s" }}
        >
          Galaxy
        </button>
        <button 
          onClick={() => setStyle("major")}
          style={{ padding: "6px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: 600, border: "none", cursor: "pointer", background: style === "major" ? "#fff" : "transparent", color: style === "major" ? "#000" : "#fff", transition: "0.2s" }}
        >
          Major
        </button>
      </div>
    </>
  );
}
