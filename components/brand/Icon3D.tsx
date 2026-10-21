/* eslint-disable @next/next/no-img-element */
import type { Icon3DName } from "@/lib/homeCopy";

// Icon 3D kính aqua (cùng chất liệu logo) — public/brand/icons-3d/*.webp.
// size ≤ 64 dùng bản 128px, lớn hơn dùng bản 512px.
export default function Icon3D({
  name,
  size = 64,
  alt = "",
  className,
}: {
  name: Icon3DName;
  size?: number;
  alt?: string;
  className?: string;
}) {
  const src = size <= 64 ? `/brand/icons-3d/${name}-128.webp` : `/brand/icons-3d/${name}.webp`;
  return (
    <img
      src={src}
      width={size}
      height={size}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      loading="lazy"
      decoding="async"
      draggable={false}
      className={`icon3d${className ? ` ${className}` : ""}`}
    />
  );
}
