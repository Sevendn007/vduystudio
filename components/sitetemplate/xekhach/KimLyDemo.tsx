"use client";
// Một trang, hai bản demo. Mặc định là bản 2100; nút ở góc dưới đổi sang bản cổ
// điển và ngược lại. Lựa chọn được ghi vào ?style= để gửi link đúng bản.
import { useCallback, useEffect, useState } from "react";
import ClassicSite from "./classic/ClassicSite";
import FutureSite from "./future/FutureSite";
import StyleSwitch, { type DemoStyle } from "./StyleSwitch";

function readStyle(): DemoStyle {
  if (typeof window === "undefined") return "future";
  return new URLSearchParams(window.location.search).get("style") === "classic" ? "classic" : "future";
}

export default function KimLyDemo() {
  // null = chưa đọc xong ?style= . Dựng luôn bản 2100 rồi mới đổi sẽ khởi tạo
  // WebGL thừa một lần và nháy màn tối khi khách mở thẳng link bản cổ điển.
  const [style, setStyle] = useState<DemoStyle | null>(null);

  useEffect(() => {
    const apply = () => setStyle(readStyle());
    apply();
    // nút lùi/tiến của trình duyệt
    window.addEventListener("popstate", apply);
    return () => window.removeEventListener("popstate", apply);
  }, []);

  const change = useCallback((next: DemoStyle) => {
    setStyle(next);
    window.scrollTo({ top: 0, behavior: "auto" });
    const url = new URL(window.location.href);
    if (next === "future") url.searchParams.delete("style");
    else url.searchParams.set("style", next);
    window.history.replaceState(null, "", url.toString());
  }, []);

  if (style === null) return <div style={{ minHeight: "100svh", background: "#030611" }} />;

  return (
    <>
      {style === "classic" ? <ClassicSite /> : <FutureSite />}
      <StyleSwitch value={style} onChange={change} />
    </>
  );
}
