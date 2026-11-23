// Dấu tích xác minh quen thuộc: huy hiệu viền lượn sóng 8 cánh (như TikTok/Instagram/Facebook) + dấu check trắng.
// Dùng currentColor cho phần huy hiệu để đổi màu theo ngữ cảnh.
const SEAL =
  "M12 0.75 L12.73 0.9 L13.41 1.32 L14.01 1.9 L14.54 2.51 L15.05 3.03 L15.58 3.36 L16.19 3.5 L16.91 3.49 L17.72 3.44 L18.56 3.45 L19.33 3.64 L19.95 4.05 L20.36 4.67 L20.55 5.44 L20.56 6.28 L20.51 7.09 L20.5 7.81 L20.64 8.42 L20.97 8.95 L21.49 9.46 L22.1 9.99 L22.68 10.59 L23.1 11.27 L23.25 12 L23.1 12.73 L22.68 13.41 L22.1 14.01 L21.49 14.54 L20.97 15.05 L20.64 15.58 L20.5 16.19 L20.51 16.91 L20.56 17.72 L20.55 18.56 L20.36 19.33 L19.95 19.95 L19.33 20.36 L18.56 20.55 L17.72 20.56 L16.91 20.51 L16.19 20.5 L15.58 20.64 L15.05 20.97 L14.54 21.49 L14.01 22.1 L13.41 22.68 L12.73 23.1 L12 23.25 L11.27 23.1 L10.59 22.68 L9.99 22.1 L9.46 21.49 L8.95 20.97 L8.42 20.64 L7.81 20.5 L7.09 20.51 L6.28 20.56 L5.44 20.55 L4.67 20.36 L4.05 19.95 L3.64 19.33 L3.45 18.56 L3.44 17.72 L3.49 16.91 L3.5 16.19 L3.36 15.58 L3.03 15.05 L2.51 14.54 L1.9 14.01 L1.32 13.41 L0.9 12.73 L0.75 12 L0.9 11.27 L1.32 10.59 L1.9 9.99 L2.51 9.46 L3.03 8.95 L3.36 8.42 L3.5 7.81 L3.49 7.09 L3.44 6.28 L3.45 5.44 L3.64 4.67 L4.05 4.05 L4.67 3.64 L5.44 3.45 L6.28 3.44 L7.09 3.49 L7.81 3.5 L8.42 3.36 L8.95 3.03 L9.46 2.51 L9.99 1.9 L10.59 1.32 L11.27 0.9Z";

export default function VerifiedTick({ size = 18, check = "#fff" }: { size?: number; check?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden style={{ flex: "none" }}>
      <path d={SEAL} fill="currentColor" strokeLinejoin="round" stroke="currentColor" strokeWidth="0.6" />
      <path d="M7.4 12.4 L10.6 15.5 L16.8 8.9" fill="none" stroke={check} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
