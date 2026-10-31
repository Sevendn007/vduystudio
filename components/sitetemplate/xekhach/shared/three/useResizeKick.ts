"use client";
// R3F đo khung chứa bằng react-use-measure. Trong vài môi trường (webview nhúng,
// khung xem trước) lần đo đầu trả về 0 nên root 3D không bao giờ được tạo và
// canvas chỉ còn màu nền. Bắn vài sự kiện resize sau khi mount để ép đo lại —
// vô hại ở trình duyệt thật.
import { useEffect } from "react";

export function useResizeKick(): void {
  useEffect(() => {
    const fire = () => window.dispatchEvent(new Event("resize"));
    const raf = requestAnimationFrame(fire);
    const timers = [60, 240, 700].map((ms) => window.setTimeout(fire, ms));
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(window.clearTimeout);
    };
  }, []);
}
