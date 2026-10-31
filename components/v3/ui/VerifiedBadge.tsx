// Huy hiệu tích xanh dựng theo đúng kiểu của Facebook: đĩa tròn có 12 múi bo
// (rosette) màu xanh Facebook, dấu tích trắng ở giữa. Hình múi sinh bằng công
// thức r(θ) = R·(1 + k·cos(12θ)) rồi nối bằng đường cong trơn, nên nét đều ở
// mọi kích thước và không cần file ảnh.

const PETALS = 12;
const R = 46;
const K = 0.075;

const ROSETTE = (() => {
  const steps = 192;
  const pts: [number, number][] = [];
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2 - Math.PI / 2;
    const r = R * (1 + K * Math.cos(PETALS * a));
    pts.push([50 + Math.cos(a) * r, 50 + Math.sin(a) * r]);
  }
  // Catmull-Rom → bezier cho viền mềm, không gãy góc
  let d = `M${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < pts.length; i++) {
    const p0 = pts[(i - 1 + pts.length) % pts.length];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % pts.length];
    const p3 = pts[(i + 2) % pts.length];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(2)} ${c1[1].toFixed(2)} ${c2[0].toFixed(2)} ${c2[1].toFixed(2)} ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
  }
  return d + "Z";
})();

export default function VerifiedBadge({
  size = 24,
  className,
  title,
}: {
  size?: number;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <path d={ROSETTE} fill="#1877F2" />
      <path
        d="M32 50.5 L44.5 63 L69 37"
        fill="none"
        stroke="#ffffff"
        strokeWidth="9.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
