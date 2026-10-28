import { useId } from "react";
import { BADGE_PATH, CHECK_PATH } from "@/lib/v3/badgePath";

// Con dấu tròn: chữ chạy vòng quanh huy hiệu tích xanh (vòng chữ xoay chậm, huy hiệu đứng yên).
export default function Seal({ text, className }: { text: string; className?: string }) {
  const id = `v3seal${useId().replace(/:/g, "")}`;
  return (
    <div className={`v3-seal${className ? ` ${className}` : ""}`} aria-hidden>
      <svg className="v3-seal-ring" viewBox="0 0 200 200">
        <defs>
          <path id={id} d="M100 100 m-78 0 a78 78 0 1 1 156 0 a78 78 0 1 1 -156 0" />
        </defs>
        <text>
          <textPath href={`#${id}`} textLength="488" lengthAdjust="spacing">{text}</textPath>
        </text>
      </svg>
      <svg className="v3-seal-badge" viewBox="0 0 100 100">
        <path d={BADGE_PATH} />
        <path d={CHECK_PATH} className="v3-seal-check" />
      </svg>
    </div>
  );
}
