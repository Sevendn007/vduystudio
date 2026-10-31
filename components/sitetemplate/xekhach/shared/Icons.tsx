// Bộ icon nét mảnh dùng chung cho 2 bản demo Kim Lý (không kéo thêm thư viện).
type P = { size?: number; className?: string };
const base = (s: number) => ({
  width: s,
  height: s,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

export const IcPhone = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M6.5 3h3l1.5 4-2 1.4a12 12 0 0 0 5.6 5.6L16 12l4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3.5 5.2 2 2 0 0 1 5.5 3h1Z" />
  </svg>
);
export const IcClock = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
export const IcPin = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 21s7-5.3 7-11a7 7 0 1 0-14 0c0 5.7 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
);
export const IcBus = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="3" y="4" width="18" height="12" rx="2.5" />
    <path d="M3 10h18M7 16v2M17 16v2" />
    <circle cx="7.5" cy="13.5" r="1" />
    <circle cx="16.5" cy="13.5" r="1" />
  </svg>
);
export const IcWifi = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M2.5 8.5a15 15 0 0 1 19 0M5.5 12a10.5 10.5 0 0 1 13 0M8.5 15.4a6 6 0 0 1 7 0" />
    <circle cx="12" cy="19" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);
export const IcCheck = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="m4.5 12.5 5 5 10-11" />
  </svg>
);
export const IcInfo = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 7.6v.5" />
  </svg>
);
export const IcArrowRight = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M5 12h14m0 0-6-6m6 6-6 6" />
  </svg>
);
export const IcArrowLeft = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M19 12H5m0 0 6-6m-6 6 6 6" />
  </svg>
);
export const IcShield = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 3 5 6v5.5c0 4.3 2.9 7.6 7 9.5 4.1-1.9 7-5.2 7-9.5V6l-7-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
export const IcBed = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M3 18V7M3 12h18v6M3 12v6M7.5 9.5h3M21 18v-4a2 2 0 0 0-2-2" />
  </svg>
);
export const IcSteering = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="2.6" />
    <path d="M3.4 10.5h5.2M15.4 10.5h5.2M12 14.6V21" />
  </svg>
);
export const IcMail = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m3.6 7 8.4 6 8.4-6" />
  </svg>
);
export const IcFacebook = ({ size = 18, className }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6c-.3 0-1.3-.1-2.45-.1-2.4 0-4.05 1.5-4.05 4.2v2.2H7.5V13h2.7v8h3.3Z" />
  </svg>
);
export const IcZalo = ({ size = 18, className }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M12 3C6.9 3 2.8 6.5 2.8 10.9c0 2.4 1.2 4.6 3.2 6-.1 1-.6 2.3-1.3 3.2-.2.3 0 .7.4.6 1.7-.3 3.1-1 4-1.7 .9.2 1.9.3 2.9.3 5.1 0 9.2-3.5 9.2-7.9S17.1 3 12 3Z" />
  </svg>
);
export const IcMenu = ({ size = 24, className }: P) => (
  <svg {...base(size)} strokeWidth={2} className={className}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);
export const IcClose = ({ size = 22, className }: P) => (
  <svg {...base(size)} strokeWidth={2} className={className}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const IcCopy = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="9" y="9" width="11" height="11" rx="2.4" />
    <path d="M5.5 15H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v.5" />
  </svg>
);
export const IcSms = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M21 11.5a8 8 0 0 1-8.5 8 9 9 0 0 1-3.4-.6L4 20.5l1.6-4.3A7.6 7.6 0 0 1 4 11.5a8 8 0 0 1 8.5-8 8 8 0 0 1 8.5 8Z" />
  </svg>
);
