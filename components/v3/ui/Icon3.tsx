import type { Icon3DName } from "@/lib/homeCopy";

// Icon đơn sắc (currentColor) cho v3 — thay Icon3D PNG xanh ngọc của v2 (lệch palette kem/cobalt).
// Nét 1.8px trên lưới 24; glyph thương hiệu dạng fill đơn giản.
const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function Glyph({ name }: { name: Icon3DName }) {
  switch (name) {
    case "tiktok":
      return <path fill="currentColor" d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64C4.16 18.63 6.92 21 9.85 21c3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z" />;
    case "facebook":
      return <path fill="currentColor" d="M13.6 21v-7.2h2.5l.4-3h-2.9V8.9c0-.85.25-1.45 1.5-1.45h1.5V4.8a20 20 0 0 0-2.2-.1c-2.2 0-3.7 1.34-3.7 3.8v2.3H8.2v3h2.5V21z" />;
    case "instagram":
      return <g {...S}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" /></g>;
    case "threads":
      return <g {...S}><path d="M16.5 11.2c-.4-2.4-2-3.7-4.3-3.7-2.6 0-4.2 1.9-4.2 4.6 0 2.9 1.7 4.6 4.3 4.6 2.2 0 3.6-1.2 3.6-3 0-2.1-2.1-2.9-4.3-2.4-1.5.3-2.3 1.3-2.1 2.4.2 1 1.2 1.6 2.4 1.5" /><path d="M18.8 7.6A8 8 0 1 0 19.6 16" /></g>;
    case "youtube":
      return <g><rect x="2.5" y="5.5" width="19" height="13" rx="4" fill="currentColor" /><path d="M10.2 9.3v5.4l4.6-2.7z" fill="#fff" /></g>;
    case "x":
      return <path fill="currentColor" d="M17.6 3.5h3l-6.6 7.5 7.7 10h-6l-4.7-6.1-5.4 6.1h-3l7-8L2.4 3.5h6.2l4.3 5.6zm-1 15.8h1.7L7.5 5.1H5.7z" />;
    case "messenger":
    case "chat":
      return <path {...S} d="M20 14.5a2 2 0 0 1-2 2H8.5L4 20.5V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />;
    case "megaphone":
    case "press":
      return <g {...S}><path d="M4 10v4l12 5V5z" /><path d="M16 9a3 3 0 0 1 0 6" /><path d="M7 15l1.2 4.5h2.6L10 15.8" /></g>;
    case "website":
      return <g {...S}><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4" /><path d="m10 8.5-2 2 2 2M14 8.5l2 2-2 2" /></g>;
    case "handshake":
      return <g {...S}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /><path d="m9 14.5 2 2 4-4.5" /></g>;
    case "shield":
      return <g {...S}><path d="M12 21s7.5-3.6 7.5-9.5V5.5L12 3 4.5 5.5v6C4.5 17.4 12 21 12 21z" /><path d="m9 12 2.2 2.2L15.5 10" /></g>;
    case "unlock":
      return <g {...S}><rect x="4.5" y="10.5" width="15" height="10" rx="2.5" /><path d="M8 10.5V7.5a4 4 0 0 1 7.6-1.7" /></g>;
    case "growth":
      return <g {...S}><path d="M4 18 10 12l3.5 3.5L20 9" /><path d="M15 9h5v5" /></g>;
    case "verify":
    default:
      return <g {...S}><path d="M12 2.8 14.4 4.6l3-.1 1 2.8 2.4 1.8-.9 2.9.9 2.9-2.4 1.8-1 2.8-3-.1L12 21.2l-2.4-1.8-3 .1-1-2.8L3.2 14.9l.9-2.9-.9-2.9 2.4-1.8 1-2.8 3 .1z" /><path d="m8.8 12.2 2.2 2.2 4.3-4.6" /></g>;
  }
}

export default function Icon3({ name, size = 24, className }: { name: Icon3DName; size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden>
      <Glyph name={name} />
    </svg>
  );
}
