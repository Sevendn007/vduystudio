import { Archivo, Be_Vietnam_Pro, JetBrains_Mono, Playfair_Display } from "next/font/google";

// Font của design system v3 — dùng chung cho trang chủ và các trang con (blog, dự án, dịch vụ).
const display = Archivo({ subsets: ["latin", "vietnamese"], axes: ["wdth"], variable: "--font-v3-display", display: "swap" });
const body = Be_Vietnam_Pro({ subsets: ["latin", "vietnamese"], weight: ["400", "500", "600", "700"], variable: "--font-v3-body", display: "swap" });
const serif = Playfair_Display({ subsets: ["latin", "vietnamese"], weight: ["500"], style: ["italic"], variable: "--font-v3-serif", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin", "vietnamese"], weight: ["500"], variable: "--font-v3-mono", display: "swap" });

export const v3FontVars = `${display.variable} ${body.variable} ${mono.variable} ${serif.variable}`;
