// Logo thương hiệu (con dấu tích xanh động) + bộ icon nền tảng chuẩn brand.
// Logo dựa trên file "VDuyStudio Logo": seal xanh #1877f2 + dấu check trắng.

let blSeq = 0;

export function BrandLogo({
  size = 34,
  animated = true,
  showText = false,
  textColor = "currentColor",
}: {
  size?: number;
  animated?: boolean;
  showText?: boolean;
  textColor?: string;
}) {
  const uid = `bl${blSeq++}`;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
      <span style={{ width: size, height: size, display: "inline-block", position: "relative", flexShrink: 0 }}>
        <style>{`
          .${uid}-seal{transform-origin:600px 400px;${animated ? `animation:${uid}Pulse 4.5s ease-in-out infinite;` : ""}}
          @keyframes ${uid}Pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
          .${uid}-glow{transform-origin:600px 400px;${animated ? `animation:${uid}Spin 9s linear infinite;` : ""}}
          @keyframes ${uid}Spin{to{transform:rotate(360deg)}}
          .${uid}-check{stroke-dasharray:230;${animated ? `animation:${uid}Draw 4.5s ease-in-out infinite;` : ""}}
          @keyframes ${uid}Draw{0%{stroke-dashoffset:230}22%,78%{stroke-dashoffset:0}100%{stroke-dashoffset:0}}
          @media(prefers-reduced-motion:reduce){.${uid}-seal,.${uid}-glow,.${uid}-check{animation:none;stroke-dashoffset:0;}}
        `}</style>
        <svg viewBox="420 240 360 320" width="100%" height="100%" style={{ overflow: "visible", display: "block" }}>
          <defs>
            <radialGradient id={`${uid}g`} cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#3b9bff" stopOpacity="0.55" />
              <stop offset="1" stopColor="#1877f2" stopOpacity="0" />
            </radialGradient>
            <linearGradient id={`${uid}s`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#3b9bff" />
              <stop offset="1" stopColor="#1160d4" />
            </linearGradient>
          </defs>
          {animated && <circle className={`${uid}-glow`} cx="600" cy="400" r="165" fill={`url(#${uid}g)`} />}
          <path
            className={`${uid}-seal`}
            fill={`url(#${uid}s)`}
            d="M600 250 636 279 683 272 701 317 748 335 741 382 776 400 741 418 748 465 701 483 683 528 636 521 600 550 564 521 517 528 499 483 452 465 459 418 424 400 459 382 452 335 499 317 517 272 564 279Z"
          />
          <path
            className={`${uid}-check`}
            fill="none"
            stroke="#fff"
            strokeWidth="34"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M534 402 L580 448 L668 356"
          />
        </svg>
      </span>
      {showText && (
        <b style={{ fontSize: size * 0.5, fontWeight: 800, letterSpacing: "-0.5px", color: textColor }}>
          vduystudio
        </b>
      )}
    </span>
  );
}

export type Platform = "tiktok" | "facebook" | "instagram" | "threads" | "press";

// Icon nền tảng kiểu app-tile — chuẩn brand, đồng nhất kích thước.
export function PlatformIcon({ kind, size = 46 }: { kind: Platform; size?: number }) {
  const r = size * 0.28;
  const uid = `pi-${kind}`;
  const common = { width: size, height: size, viewBox: "0 0 48 48" } as const;

  if (kind === "tiktok") {
    const note =
      "M27 12 h4.4 c0.5 3.4 2.6 5.7 5.9 6 v4.3 c-2.1 0-4.1-.6-5.9-1.7 V27.6 c0 5-3.4 8.8-8.4 8.8 A8.4 8.4 0 1 1 24.6 19.3 v4.5 a4 4 0 1 0 2.4 3.7 Z";
    return (
      <svg {...common} aria-hidden>
        <rect width="48" height="48" rx={r} fill="#010101" />
        <path d={note} fill="#25F4EE" transform="translate(-1.4,-1.4)" />
        <path d={note} fill="#FE2C55" transform="translate(1.4,1.4)" />
        <path d={note} fill="#fff" />
      </svg>
    );
  }
  if (kind === "facebook") {
    return (
      <svg {...common} aria-hidden>
        <rect width="48" height="48" rx={r} fill="#1877F2" />
        <path
          d="M29.5 25 L30.4 19.4 H25 v-3.6 c0-1.5 .75-3 3.1-3 H30.6 V8.4 c0-.9-1.9-1.9-4.6-1.9-4.6 0-7.6 2.8-7.6 7.9 V19.4 H13.4 V25 h5 v14 h6.2 V25 Z"
          fill="#fff"
        />
      </svg>
    );
  }
  if (kind === "instagram") {
    return (
      <svg {...common} aria-hidden>
        <defs>
          <linearGradient id={uid} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#feda75" />
            <stop offset="0.35" stopColor="#fa7e1e" />
            <stop offset="0.6" stopColor="#d62976" />
            <stop offset="0.8" stopColor="#962fbf" />
            <stop offset="1" stopColor="#4f5bd5" />
          </linearGradient>
        </defs>
        <rect width="48" height="48" rx={r} fill={`url(#${uid})`} />
        <rect x="13.5" y="13.5" width="21" height="21" rx="6.5" fill="none" stroke="#fff" strokeWidth="3" />
        <circle cx="24" cy="24" r="5.8" fill="none" stroke="#fff" strokeWidth="3" />
        <circle cx="31.6" cy="16.4" r="1.9" fill="#fff" />
      </svg>
    );
  }
  if (kind === "threads") {
    return (
      <svg {...common} aria-hidden>
        <rect width="48" height="48" rx={r} fill="#010101" />
        <path
          d="M24.5 11 C17.5 11 13 15.6 13 24 s4.5 13 11.5 13 c4.6 0 7.4-2.1 8.7-5.2 M24.6 19.6 c3.4 0 5.6 1.7 5.6 4.6 0 3.6-3 5.2-6.2 5.2 -2.7 0-4.3-1.4-4.3-3.3 0-1.9 1.7-3.1 4-3.1 3.9 0 6.9 2.6 6.9 6.6"
          fill="none"
          stroke="#fff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  // press / báo chí
  return (
    <svg {...common} aria-hidden>
      <rect width="48" height="48" rx={r} fill="#0f172a" />
      <path d="M32 18 h5 v14.5 a2.5 2.5 0 0 1-2.5 2.5 H15 a2 2 0 0 1-2-2 V13 h19 Z" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M32 20 v12.5 a2.5 2.5 0 0 0 2.5 2.5" fill="none" stroke="#fff" strokeWidth="2.4" />
      <rect x="16.5" y="16.5" width="8.5" height="7" rx="1" fill="#fff" />
      <path d="M27 17 h2.5 M27 20.5 h2.5 M16.5 27 h13 M16.5 30.5 h13" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Avatar khách hàng: chân dung minh họa + vòng + badge tích xanh.
export function PersonAvatar({
  name,
  hue = 210,
  size = 48,
  verified = true,
}: {
  name: string;
  hue?: number;
  size?: number;
  verified?: boolean;
}) {
  const uid = `pa-${name.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <span style={{ position: "relative", width: size, height: size, display: "inline-block", flexShrink: 0 }}>
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
        <defs>
          <linearGradient id={uid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={`hsl(${hue},70%,62%)`} />
            <stop offset="1" stopColor={`hsl(${hue + 40},65%,45%)`} />
          </linearGradient>
        </defs>
        <rect width="48" height="48" rx="24" fill={`url(#${uid})`} />
        <circle cx="24" cy="19" r="8" fill="#fff" fillOpacity="0.92" />
        <path d="M9 42 c0-8.5 6.7-13 15-13 s15 4.5 15 13 Z" fill="#fff" fillOpacity="0.92" />
      </svg>
      {verified && (
        <span style={{ position: "absolute", right: -2, bottom: -2 }}>
          <svg width={size * 0.42} height={size * 0.42} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="11" fill="#fff" />
            <path
              d="M12 2.5l2 1.5 2.5-.2.9 2.3 2.2 1.3-.7 2.4.7 2.4-2.2 1.3-.9 2.3-2.5-.2-2 1.5-2-1.5-2.5.2-.9-2.3-2.2-1.3.7-2.4-.7-2.4 2.2-1.3.9-2.3 2.5.2z"
              fill="#1877f2"
            />
            <path d="M8.5 12l2.2 2.2 4.3-4.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </span>
      )}
    </span>
  );
}
