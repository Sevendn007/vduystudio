// Logo thương hiệu — dùng lại logo NGUYÊN BẢN VDuyStudio ở components/logo.tsx.
import { VDuyBadge, VDuyMark } from "@/components/logo";

// Giữ nguyên chữ ký prop để các nơi gọi cũ vẫn chạy; render logo gốc.
export function BrandLogo({
  size = 34,
  showText = false,
}: {
  size?: number;
  animated?: boolean;
  showText?: boolean;
  textColor?: string;
}) {
  return showText ? <VDuyMark size={size} intro={false} /> : <VDuyBadge size={size} intro={false} />;
}

export type Platform = "tiktok" | "facebook" | "instagram" | "threads" | "press" | "x" | "youtube" | "website";

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
        <g transform="translate(-2.5, 0)">
          <path d={note} fill="#25F4EE" transform="translate(-1.4,-1.4)" />
          <path d={note} fill="#FE2C55" transform="translate(1.4,1.4)" />
          <path d={note} fill="#fff" />
        </g>
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
  if (kind === "x") {
    return (
      <svg {...common} aria-hidden>
        <rect width="48" height="48" rx={r} fill="#000" />
        <path d="M12.5 11h5.8l7.7 10.3 8.9-10.3h5.5L28.1 25l12.4 12H34.7l-8.5-11.4-9.9 11.4h-5.5l13.1-15.1L12.5 11zm7.9 2h-3.6l17.7 20h3.6L20.4 13z" fill="#fff" />
      </svg>
    );
  }
  if (kind === "youtube") {
    return (
      <svg {...common} aria-hidden>
        <rect width="48" height="48" rx={r} fill="#FF0000" />
        <path d="M36.2 16.1c-.4-1.5-1.6-2.7-3.1-3.1C30.4 12.3 24 12.3 24 12.3s-6.4 0-9.1.7c-1.5.4-2.7 1.6-3.1 3.1-.7 2.7-.7 8.3-.7 8.3s0 5.6.7 8.3c.4 1.5 1.6 2.7 3.1 3.1 2.7.7 9.1.7 9.1.7s6.4 0 9.1-.7c1.5-.4 2.7-1.6 3.1-3.1.7-2.7.7-8.3.7-8.3s0-5.6-.7-8.3zM21 28.5V19.5l8 4.5-8 4.5z" fill="#fff" />
      </svg>
    );
  }
  if (kind === "website") {
    return (
      <svg {...common} aria-hidden>
        <defs>
          <linearGradient id={uid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#a855f7" />
            <stop offset="1" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id={`${uid}-g`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="rgba(255,255,255,0.3)" />
          </linearGradient>
        </defs>
        <rect width="48" height="48" rx={r} fill={`url(#${uid})`} />
        <rect x="10" y="14" width="28" height="20" rx="3" fill="none" stroke={`url(#${uid}-g)`} strokeWidth="2.5" />
        <path d="M10 21h28" stroke={`url(#${uid}-g)`} strokeWidth="2.5" />
        <circle cx="15" cy="17.5" r="1.5" fill="#fff" />
        <circle cx="19" cy="17.5" r="1.5" fill="#fff" />
        <path d="M16 26h12 M16 30h8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }
  // press / báo chí
  return (
    <svg {...common} aria-hidden>
      <defs>
        <linearGradient id={uid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f59e0b" />
          <stop offset="1" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id={`${uid}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="rgba(255,255,255,0.4)" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx={r} fill={`url(#${uid})`} />
      <rect x="12" y="14" width="24" height="22" rx="3" fill="none" stroke={`url(#${uid}-g)`} strokeWidth="2.5" />
      <path d="M12 18h24" stroke={`url(#${uid}-g)`} strokeWidth="2.5" />
      <path d="M21 24l1.5-2 1.5 2 2-1-1 3-3 1-2-2z" fill="#fff" />
      <path d="M17 31h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// Avatar khách hàng: chân dung minh họa + vòng + badge tích xanh.
export function PersonAvatar({
  name,
  avatarUrl,
  hue = 210,
  size = 48,
  verified = true,
}: {
  name: string;
  avatarUrl?: string | null;
  hue?: number;
  size?: number;
  verified?: boolean;
}) {
  const uid = `pa-${name.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <span style={{ position: "relative", width: size, height: size, display: "inline-block", flexShrink: 0 }}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          width={size}
          height={size}
          style={{ borderRadius: "50%", objectFit: "cover" }}
        />
      ) : (
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
      )}
      {verified && (
        <span style={{ position: "absolute", right: -2, bottom: -2 }}>
          <svg width={size * 0.42} height={size * 0.42} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="11" fill="#fff" />
            <path
              d="M12 2.5l2 1.5 2.5-.2.9 2.3 2.2 1.3-.7 2.4.7 2.4-2.2 1.3-.9 2.3-2.5-.2-2 1.5-2-1.5-2.5.2-.9-2.3-2.2-1.3.7-2.4-.7-2.4 2.2-1.3.9-2.3 2.5.2z"
              fill="#1877f2"
            />
            <path d="M9.5 12.2l2 2 4.5-4.5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </span>
      )}
    </span>
  );
}
