"use client";
import { V3Provider } from "./V3Context";
import type { V3Settings } from "@/lib/v3/contact";
import Nav3 from "./ui/Nav3";

// Chỉ HEADER của trang chủ (thanh điều hướng viên thuốc) đặt lên các trang con; nội dung trang giữ nguyên.
export default function SubHeaderClient({ settings, current }: { settings: V3Settings | null; current?: string }) {
  return (
    <V3Provider data={{ projects: null, feedbacks: null, settings, pricing: {} }}>
      <div className="v3 v3-headonly">
        <Nav3 base="/" current={current} />
      </div>
    </V3Provider>
  );
}
