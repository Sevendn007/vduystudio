// Bộ hình ảnh thương hiệu dạng SVG vector — sắc nét ở mọi độ phân giải,
// không phụ thuộc file ảnh bên ngoài. Dùng chung cho landing & trang chi tiết.

export function VerifiedBadge({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 1.5l2.4 1.8 3-.2 1.1 2.8 2.6 1.5-.8 2.9.8 2.9-2.6 1.5-1.1 2.8-3-.2L12 22.5l-2.4-1.8-3 .2-1.1-2.8L2.9 16.6l.8-2.9-.8-2.9 2.6-1.5 1.1-2.8 3 .2L12 1.5z"
        fill="#1d9bf0"
      />
      <path
        d="M8.5 12.2l2.3 2.3 4.7-4.9"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BrandMark({
  color = "currentColor",
  height = 22,
}: {
  color?: string;
  height?: number;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        fontWeight: 800,
        fontSize: height * 0.72,
        letterSpacing: "-0.5px",
        color,
        lineHeight: 1,
      }}
    >
      <VerifiedBadge size={height} />
      vduystudio
    </span>
  );
}

const GRADIENTS: Record<string, [string, string]> = {
  tiktok: ["#0f0f0f", "#25f4ee"],
  facebook: ["#1877f2", "#0a2a6b"],
  "instagram-threads": ["#f58529", "#dd2a7b"],
  "bao-chi": ["#f59e0b", "#b45309"],
};

// Ảnh bìa case study: trông như một screenshot hồ sơ đã xác minh.
export function ProjectCover({
  platform,
  handle,
  tag,
}: {
  platform: string;
  handle: string;
  tag: string;
}) {
  const [c1, c2] = GRADIENTS[platform] ?? ["#7c3aed", "#ec4899"];
  const gid = `pg-${platform}-${handle.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <svg viewBox="0 0 400 300" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${gid})`} />
      <circle cx="330" cy="60" r="90" fill="#fff" opacity="0.06" />
      <circle cx="70" cy="250" r="70" fill="#fff" opacity="0.05" />
      {/* thẻ hồ sơ */}
      <g transform="translate(28,90)">
        <rect width="344" height="130" rx="16" fill="#ffffff" opacity="0.12" />
        <circle cx="46" cy="65" r="30" fill="#fff" opacity="0.9" />
        <circle cx="46" cy="65" r="30" fill={c2} opacity="0.35" />
        <rect x="92" y="44" width="120" height="14" rx="7" fill="#fff" opacity="0.9" />
        <g transform="translate(220,42)">
          <path
            d="M9 0l1.8 1.4 2.3-.2.9 2.1 2 1.2-.6 2.2.6 2.2-2 1.2-.9 2.1-2.3-.2L9 17l-1.8-1.4-2.3.2-.9-2.1-2-1.2.6-2.2L2.6 8 4.6 6.8l.9-2.1 2.3.2L9 0z"
            fill="#1d9bf0"
          />
          <path d="M6 8.6l2 2 3.6-3.8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
        <rect x="92" y="72" width="180" height="10" rx="5" fill="#fff" opacity="0.5" />
        <rect x="92" y="90" width="120" height="10" rx="5" fill="#fff" opacity="0.35" />
      </g>
      <text x="28" y="52" fontFamily="system-ui,sans-serif" fontSize="13" fontWeight="700" fill="#fff" opacity="0.85" style={{ textTransform: "uppercase", letterSpacing: "1px" }}>
        {tag}
      </text>
    </svg>
  );
}

// Phone mockup: màn hình hồ sơ có huy hiệu xác minh.
export function PhoneMock({
  label,
  accent = "#1d9bf0",
  scale = 1,
}: {
  label: string;
  accent?: string;
  scale?: number;
}) {
  return (
    <svg
      width={150 * scale}
      height={300 * scale}
      viewBox="0 0 150 300"
      aria-hidden
      style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,.18))" }}
    >
      <rect x="4" y="4" width="142" height="292" rx="26" fill="#0b0b0f" />
      <rect x="10" y="10" width="130" height="280" rx="20" fill="#14141b" />
      <rect x="55" y="16" width="40" height="6" rx="3" fill="#000" />
      {/* header gradient */}
      <defs>
        <linearGradient id={`ph-${label}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={accent} />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <rect x="10" y="30" width="130" height="86" fill={`url(#ph-${label})`} opacity="0.9" />
      <circle cx="75" cy="86" r="26" fill="#fff" />
      <circle cx="75" cy="86" r="22" fill="#14141b" />
      {/* verified name row */}
      <g transform="translate(48,128)">
        <rect x="0" y="0" width="42" height="10" rx="5" fill="#fff" opacity="0.9" />
        <g transform="translate(48,-2)">
          <path
            d="M7 0l1.4 1.1 1.8-.1.7 1.6 1.5.9-.5 1.7.5 1.7-1.5.9-.7 1.6-1.8-.1L7 13l-1.4-1.1-1.8.1-.7-1.6L1.6 9.5l.5-1.7-.5-1.7L3.1 5l.7-1.6 1.8.1L7 0z"
            fill="#1d9bf0"
          />
          <path d="M4.6 6.6l1.6 1.6 2.8-3" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
      </g>
      <rect x="40" y="146" width="70" height="7" rx="3.5" fill="#fff" opacity="0.35" />
      {/* stats */}
      <g fill="#fff" opacity="0.8">
        <rect x="22" y="168" width="28" height="18" rx="4" opacity="0.12" />
        <rect x="61" y="168" width="28" height="18" rx="4" opacity="0.12" />
        <rect x="100" y="168" width="28" height="18" rx="4" opacity="0.12" />
      </g>
      {/* grid */}
      <g fill="#fff" opacity="0.1">
        <rect x="22" y="196" width="32" height="32" rx="5" />
        <rect x="59" y="196" width="32" height="32" rx="5" />
        <rect x="96" y="196" width="32" height="32" rx="5" />
        <rect x="22" y="232" width="32" height="32" rx="5" />
        <rect x="59" y="232" width="32" height="32" rx="5" />
        <rect x="96" y="232" width="32" height="32" rx="5" />
      </g>
      {/* label chip */}
      <g transform="translate(28,272)">
        <rect width="94" height="16" rx="8" fill="#fff" opacity="0.14" />
        <text x="47" y="12" textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize="9" fontWeight="700" fill="#fff">
          {label}
        </text>
      </g>
    </svg>
  );
}

// Avatar dạng chữ cái đầu, gradient thương hiệu.
export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const gid = `av-${name.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1d9bf0" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="20" fill={`url(#${gid})`} />
      <text x="20" y="26" textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize="15" fontWeight="700" fill="#fff">
        {initials}
      </text>
    </svg>
  );
}
