// Monogram Kim Lý — cùng ngôn ngữ với logo VD của VDuyStudio: hai nét bút liên
// tục, không khối đặc, một nét mực và một nét cobalt. Nét "L" là thân chữ và
// vệt đường chạy ngang dưới chân; nét "K" cắt chéo qua, gợi hai chiều của tuyến.
// Dùng `tone` để đổi màu khi đặt trên nền tối.

export const KL_L_D = "M26 18 V74 H78";
export const KL_K_D = "M26 50 L60 20 M43 40 L70 74";
export const KL_STROKE = 9;

type Props = {
  size?: number;
  /** "ink" = nét chính màu mực (nền sáng); "light" = nét chính màu trắng (nền tối) */
  tone?: "ink" | "light";
  className?: string;
  title?: string;
};

export default function KimLyLogo({ size = 56, tone = "ink", className, title }: Props) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      fill="none"
    >
      <path
        d={KL_L_D}
        stroke={tone === "light" ? "#ffffff" : "var(--c-ink, #0c0c10)"}
        strokeWidth={KL_STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={KL_K_D}
        stroke={tone === "light" ? "#7fa0ff" : "var(--c-cobalt, #2140f0)"}
        strokeWidth={KL_STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Logo ngang: monogram + chữ "Kim Lý" — dùng ở thanh điều hướng và footer. */
export function KimLyLockup({ size = 40, tone = "ink" }: { size?: number; tone?: "ink" | "light" }) {
  return (
    <span className="kl-lockup" data-tone={tone}>
      <KimLyLogo size={size} tone={tone} />
      <span className="kl-lockup-name">
        Kim <span>Lý</span>
      </span>
    </span>
  );
}
