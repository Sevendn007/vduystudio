// Store cuộn mutable (không gây re-render React): canvas đọc trong useFrame.
export type Chapter = "hero" | "services" | "trust" | "projects" | "process" | "feedback" | "contact";
export const CHAPTERS: Chapter[] = ["hero", "services", "trust", "projects", "process", "feedback", "contact"];

export const scrollStore = {
  y: 0,          // scrollY px
  pageP: 0,      // 0..1 toàn trang
  chapter: "hero" as Chapter,
  chapterP: 0,   // 0..1 trong chương hiện tại (theo vị trí section so với viewport)
  vy: 0,         // vận tốc (px/frame, đã làm mượt)
};
