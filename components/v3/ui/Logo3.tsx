import { LOGO_CHECK_D, LOGO_CHECK_W, LOGO_D_D, LOGO_D_W } from "@/lib/v3/logo";

// Logo phẳng v3: ✓ cobalt + D mực. Dùng cho nav, footer, hero (mobile / trước khi 3D sẵn sàng).
export function Mark3({ size = 32, className, title }: { size?: number; className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 100 100" width={size} height={size} className={className}
      role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}
    >
      <path d={LOGO_D_D} fill="none" stroke="var(--v3-ink, #111)" strokeWidth={LOGO_D_W} strokeLinecap="round" strokeLinejoin="round" />
      <path d={LOGO_CHECK_D} fill="none" stroke="var(--v3-blue, #1d4ed8)" strokeWidth={LOGO_CHECK_W} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Logo ngang: monogram + chữ "VDuyStudio". */
export default function Logo3({ size = 32 }: { size?: number }) {
  return (
    <span className="v3-logo">
      <Mark3 size={size} />
      <span className="v3-logo-name">VDuy<span>Studio</span></span>
    </span>
  );
}
